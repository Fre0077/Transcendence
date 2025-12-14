import Fastify from 'fastify';
import { MQueue } from './MQueue.js'
import { v4 as uuidv4 } from "uuid";

// Where the Queue will listen
const PORT = Number(process.env.PORT) || 3030;
const VERSION:string = "1.0.3";


const fastify = Fastify({ 
	logger: false //too much stuff... 
});

/* ------------------------------------ */
/*				ENDPOINTS				*/
/* ------------------------------------ */

// Health-check endpoint (server-side)
fastify.get('/health', async () => ({ status: 'ok' }));


/* ============= REGISTER ============ */

// map of IDs and users data
let users:Map<string, { endpoint:string, password:string }> = new Map();

interface RegisterQuery {
	endp: string;
	pass: string;
}

fastify.get<{ Querystring: RegisterQuery }>(
	"/register",
	async (request) => {
		// check if they passed the notify endpoint
		const { endp, pass } = request.query;
		if (endp !== undefined && pass === undefined) return { status: 'failure', ID: undefined, reason: 'Missing \'pass\' property' };

		// check all the users
		if (endp !== undefined)
		{
			for (const [ID, { endpoint, password }] of users)
			{
				// if someone has same endpoint ...
				if (endp === endpoint)
				{
					// ... and same passowrd
					if (pass === password)
					{
						// #debug
						console.log('Erasing data of endpoint', endpoint);
						// leave all the qeues
						mqueues.forEach((mq) => {mq.leave(ID)});
						// remove the old user from the users list
						users.delete(ID);
						break ;
					}
					// ... and different password
					else return { status: 'failure', ID: undefined, reason: 'Wrong password for endpoint ' + endp };
				}
			}
		}

		// assign the ID
		const ID = uuidv4();
		users.set(ID, { endpoint:endp, password:pass });

		// #debug
		console.log(`Client ${ID} successfully registered with endpoint`, endp);
		return { status: 'success', ID: ID };
	}
);

/* ============= SUBSRCIBE ============ */
interface SubscribeQuery {
	ID: string;
	queue: string;
}

fastify.get<{ Querystring: SubscribeQuery }>(
	"/subscribe",
	async (request) => {
		const { ID, queue } = request.query;

		const status = subscribe(ID, queue) ? 'success' : 'failure';
		return { status: status };
	}
);


/* =============== LEAVE ============= */
interface LeaveQuery {
	ID: string;
	queue: string;
}

fastify.get<{ Querystring: LeaveQuery }>(
	"/leave",
	async (request) => {
		const { ID, queue } = request.query;

		const status = leave(ID, queue) ? 'success' : 'failure';
		return { status: status };
	}
);


/* ============== PUBLISH ============ */
interface PublushQuery {
	ID: string;
	queue: string;
	message:string;
}


fastify.post<{ Body: PublushQuery }>(
	"/publish",
	async (request) => {
		const { ID, queue, message } = request.body;

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
	if (users.has(ID) === false) return false;
	
	// check if the MQ exists
	const mq = mqueues.get(name);
	if (mq === undefined) return false;

	// perform the action
	mq.subscribe(ID);
	return true;
}

function leave(ID:string, name:string): boolean
{
	/* #debug */
	console.log(`${ID} leaving`, name);

	// check if the ID is one of our onw generated ID
	if (users.has(ID) === false) return false;

	// check if the MQ exists
	const mq = mqueues.get(name);
	if (mq === undefined) return false;

	// perform the action
	mq.leave(ID);
	return true;
}

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
	return mq.publish(ID, message);
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
function notify(mq:MQueue, name:string)
{
	// better MQueue
	for (const follower of mq.queues.keys())
	{
		const endpoint = users.get(follower)?.endpoint
		if (endpoint !== undefined && mq.empty(follower) === false)
		{
			// #debug
			console.log('Notifying', follower);

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





// monitor queues
function MonitorQueues()
{
	// console.log('Monitorin queues...')
	// for each queue
	mqueues.forEach((mq, name) => {
		// send notifications
		notify(mq, name);

		// no mqueue delete for now
		// if (queue.empty()) mqueues.delete(name);
	});
}



/* ------------------------------------------ */
const start = async () => {
	try {

		// create queues
		mqueues.set('test', new MQueue());
		mqueues.set('game', new MQueue());
		mqueues.set('lobby', new MQueue());
		mqueues.set('history', new MQueue());
		mqueues.set('bot', new MQueue());

		// start fastify server
		await fastify.listen({ port: PORT, host: '0.0.0.0' });
		console.log(`ft_bunnyMQ version ${VERSION} running on http://localhost:${PORT}`);

	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}

	// routine checks
	setInterval(() => {
		// send notifications and shut down queues
		MonitorQueues();
	}, 1000);

};

// entrypoint
start();