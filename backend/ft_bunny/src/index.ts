import Fastify from 'fastify';
import { MQueue } from './classes/MQueue.js'

// generate ids
import { v4 as uuidv4 } from "uuid";

// hash passwords
import argon2 from "argon2";

// Where the Queue will listen
const PORT = Number(process.env.PORT) || 3030;
const VERSION:string = "1.0.4";

const fastify = Fastify({ 
	logger: false //too much stuff... 
});

/* ------------------------------------ */
/*				ENDPOINTS				*/
/* ------------------------------------ */

// Health-check endpoint (server-side)
fastify.get('/health', async () => ({ status: 'ok' }));


/* ============= REGISTER ============ */

type User = {
	notify:boolean;
	endpoint:string;
	password:string;
	subs:Set<string>
}

// map of IDs and users data
let users:Map<string, User> = new Map();

interface RegisterQuery {
	endp?: string;
	pass?: string;
}

fastify.get<{ Querystring: RegisterQuery }>(
	"/register",
	async (request, reply) => {
		// check if they passed the notify endpoint
		const { endp, pass } = request.query;

		// check if Endpoint login
		if (endp !== undefined)
		{
			// check if password passed
			if (pass === undefined) {
				return reply.status(400).send({
					status: 'failure',
					ID: undefined,
					reason: 'Missing \'pass\' property'
				});
			}

			// check if already logged in
			for (const [ID, { endpoint, password }] of users)
			{
				// if someone has same endpoint ...
				if (endp === endpoint)
				{
					// ... and same passowrd
					if (await argon2.verify(password, pass))
					{	
						// return the ID
						return { status: 'success', ID: ID };
					}
					// ... and different password
					else return reply.status(400).send({
							status: 'failure',
							ID: undefined,
							reason: 'Wrong password for endpoint ' + endp
						});
				}
			}

			// if not logged in yet

			// assign the ID
			const ID = uuidv4();

			// hash the password
			const hash = await argon2.hash(pass, {
				type: argon2.argon2id,
				memoryCost: 2 ** 16, // 64 MB
				timeCost: 3,
				parallelism: 1,
			})
			
			// save in db
			users.set(ID, { notify: true, endpoint:endp, password:hash, subs: new Set() });

			// #debug
			console.log(`Client ${ID} successfully registered with endpoint`, endp);

			return { status: 'success', ID: ID };
		}
		else	/* no notification endpoint specified */
		{
			// assign the ID
			const ID = uuidv4();

			users.set(ID, { notify: false, endpoint:'-', password:'-', subs: new Set() });

			// #debug
			console.log(`Client ${ID} successfully registered with no endpoint`);

			return { status: 'success', ID: ID };
		}

		// should never come here
		return reply.status(400).send({ status: 'failure', ID: undefined, reason: 'Unknown error' });
	}
);

/* ============= SUBSRCIBE ============ */
interface SubscribeQuery {
	ID?: string;
	queue?: string;
}

fastify.get<{ Querystring: SubscribeQuery }>(
	"/subscribe",
	async (request, reply) => {
		const { ID, queue } = request.query;

		if (ID === undefined || queue === undefined) {
			return reply.status(400).send({
				status: 'failure',
				reason: 'Missing query field'
			});
		}

		const status = subscribe(ID, queue) ? 'success' : 'failure';
		return { status: status };
	}
);


/* =============== LEAVE ============= */
interface LeaveQuery {
	ID?: string;
	queue?: string;
}

fastify.get<{ Querystring: LeaveQuery }>(
	"/leave",
	async (request, reply) => {
		const { ID, queue } = request.query;

		if (ID === undefined || queue === undefined) {
			return reply.status(400).send({
				status: 'failure',
				reason: 'Missing query field'
			});
		}

		const status = leave(ID, queue) ? 'success' : 'failure';
		return { status: status };
	}
);


/* ============== PUBLISH ============ */
interface PublishQuery {
	ID?: string;
	queue?: string;
	message?:string;
}


fastify.post<{ Body: PublishQuery }>(
	"/publish",
	async (request, reply) => {
		const { ID, queue, message } = request.body;

		if (ID === undefined || queue === undefined || message === undefined) {
			return reply.status(400).send({
				status: 'failure',
				reason: 'Missing query field'
			});
		}

		const status = publish(ID, queue, message) ? 'success' : 'failure';
		return { status: status };
	}
);

/* =============== GET =============== */
interface GetQuery {
	ID: string;
	queue: string;
}

fastify.get<{ Querystring: GetQuery }>(
	"/get",
	async (request) => {
		const { ID, queue } = request.query;

		const message = get(ID, queue);
		if (message === undefined)
			return { status: 'failure' };
		else
			return { status: 'success', message: message };
	}
);










/* -------------- DB -------------- */


// Map with { name : MQueue }
let mqueues:Map<string, MQueue> = new Map();

function subscribe(ID:string, name:string): boolean
{
	/* #debug */
	console.log(`${ID} subscribing to`, name);

	// check if the ID is one of our onw generated ID
	const user = users.get(ID);
	if (user === undefined) return false;
	// console.log('User ok');
	
	// check if the MQ exists
	const mq = mqueues.get(name);
	if (mq === undefined) return false;
	// console.log('Queue ok');

	// perform the subscription
	mq.subscribe(ID);

	// add to user
	user.subs.add(name);

	return true;
}

function leave(ID:string, name:string): boolean
{
	/* #debug */
	console.log(`${ID} leaving`, name);

	// check if the ID is one of our onw generated ID
	const user = users.get(ID);
	if (user === undefined) return false;

	// check if the MQ exists
	const mq = mqueues.get(name);
	if (mq === undefined) return false;

	// perform the unsubscription
	mq.leave(ID);

	// update the user
	user.subs.delete(name);

	return true;
}

import {publishGameHistory} from "./publisher.js"

function publish(ID:string, name:string, message:string): boolean
{
	/* #debug */
	console.log(`${ID} publishing to`, name);

	// check if the ID is one of our onw generated ID
	if (users.has(ID) === false) return false;

	// check if the MQ exists
	const mq = mqueues.get(name);
	if (mq === undefined) return false;

	// perform the action
	const ok = mq.publish(ID, message);

	// check outcome
	if (ok === false) return false;

	/* --- FORWARD --- */
	const fwd = forwards.get(name);
	if (fwd) fwd(message);
	/* --------------- */

	// successful return
	return true;
}

function get(ID:string, name:string): string | undefined
{
	/* #debug */
	console.log(`${ID} getting from`, name);

	// check if the ID is one of our onw generated ID
	if (users.has(ID) === false) return undefined;

	// check if the MQ exists
	const mq = mqueues.get(name);
	if (mq === undefined) return undefined;

	// perform the action
	return mq.get(ID)?.message;
}

// send notification if new messages are there
// #todo not notify if notification already sent
function notify(mq:MQueue, name:string)
{
	// better MQueue
	for (const follower of mq.queues.keys())
	{
		const user = users.get(follower);
		if (!user) return;

		// no notification if disabled
		if (user.notify === false) return;

		// get endpoint
		const endpoint = user.endpoint;

		if (endpoint !== undefined && mq.empty(follower) === false)
		{
			// #debug
			console.log('Notifying \'' + follower + '\' for \'' + name + '\'');

			fetch(`${endpoint}?queue=${name}`)
			.catch((err) => console.log(err));
		}
	}

	// Lamer MQueue
	/* if (mq.empty() === false)
	{
		for (const follower of mq.followers)
		{
			const endpoint = users.get(follower)?.endpoint
			if (endpoint !== undefined && follower !== mq.peek()?.sender)
			{
				// #debug
				console.log('Notifying ' + follower + ' for ' + name);

				fetch(`${endpoint}?queue=${name}`)
				.catch((err) => console.log(err));
			}
		}
	} */
}











/* ------------- FILE MANAGEMENT ------------ */
// all by ChatGPT

import { writeFile, readFile } from "fs/promises";

function serialize(map: Map<string, User>)
{
	return JSON.stringify(
		Array.from(map.entries(), ([key, value]) => [
		key,
		{ ...value, subs: [...value.subs] },
		]),
		null,
		2
	);
}

function deserialize(json: string)
{
	const entries = JSON.parse(json) as [ string, User ][];

	return new Map(
		entries.map(([key, value]) => [
		key,
		{ ...value, subs: new Set(value.subs) },
		])
	);
}

async function persistMap(map: Map<string, User>)
{
	const data = serialize(map);
	console.log('Writing user backup...');
	await writeFile("users.json", data + "\n", "utf8");
}

/* let pending = false;

function schedulePersist(map: Map<string, any>, ms:number)
{
	if (pending) return;
		pending = true;

	setTimeout(async () => {
		pending = false;
		if (map.size > 0) await persistMap(map);
	}, ms);
}

function updateDB() { schedulePersist(users, 5000); } */

/*  - - - UPDATE BACKUP REGULARLY - - - */

let mapsize:number = 0;

function getMapSize(map:Map<string, { endpoint:string, password:string, subs:Set<string>}>)
{
	let mymapsize = map.size;

	for (const entry of map.values()) {
		mymapsize += entry.subs.size;
	}

	return mymapsize;
}

function updateBackup()
{
	const currsize = getMapSize(users);

	if (mapsize !== currsize)
	{
		persistMap(users);
		mapsize = currsize;
	}
}

/*  - - - LOAD BACKUP - - - */

async function loadMap(): Promise<
  Map<string, User>>
{
	let map;

	try {
		const data = await readFile("users.json", "utf8");

		map = deserialize(data);
		
	} catch {
		// no file found
		console.log('No backup file, initializing new map ...');
		return new Map();
	}

	console.log('Loaded new map:', map);

	return  map;
}

// read user.json and updates 'users' and 'mqueues' accordingly
async function laodBackup()
{
	// load users
	users = await loadMap();

	// subscribe to mqueues
	users.forEach((user, id) => {
		user.subs.forEach((sub) => {
			subscribe(id, sub);
		});
	})
}

/* ------------------------------------------ */










// monitor queues
function MonitorQueues()
{
	setTimeout(() => {
		// console.log('Monitorin queues...')
		// for each queue
		mqueues.forEach((mq, name) => {
			// send notifications
			notify(mq, name);

			// no mqueue delete for now
			// if (queue.empty()) mqueues.delete(name);
		});

		// loop
		MonitorQueues();
	}, 100);
}

// backup user file once in a while
function ChronoBackup()
{
	setTimeout(() => {

		// update backup
		updateBackup();

		// loop
		ChronoBackup();
	}, 1000);
}

/* #todo
 - add log to all services
 - store all messages
 - single MQueue with multiple 'head's, once per sub  */

// forward messages to other services
let forwards:Map<string, (msg:string) => void> = new Map();

/* ------------------------------------------ */
const start = async () => {
	try {

		// create queues
		mqueues.set('test', new MQueue());
		mqueues.set('game', new MQueue());
		mqueues.set('lobby', new MQueue());
		mqueues.set('tournament', new MQueue());
		mqueues.set('history', new MQueue());
		mqueues.set('bot', new MQueue());

		// add forwards
		forwards.set('history', publishGameHistory);

		// load users backup if present
		await laodBackup();

		// start fastify server
		await fastify.listen({ port: PORT, host: '0.0.0.0' });
		console.log(`ft_bunnyMQ version ${VERSION} running on http://localhost:${PORT}`);

	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}

	/* routine checks */
	// send notifications and shut down queues
	MonitorQueues();
	// updates database
	ChronoBackup();

};

// entrypoint
start();