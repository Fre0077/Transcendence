import Fastify from 'fastify';
import { MQueue } from './MQueue.js'
import { v4 as uuidv4 } from "uuid";

// Where the Queue will listen
const PORT = Number(process.env.PORT) || 3030;


const fastify = Fastify({ 
	logger: false //too much stuff... 
});

/* ------------------------------------ */
/*				ENDPOINTS				*/
/* ------------------------------------ */

// Health-check endpoint (server-side)
fastify.get("/health", async () => ({ status: 'success' }));


/* ============= REGISTER ============ */

let IDs:Set<string> = new Set();

fastify.get(
	"/register",
	async () => {
		const ID = uuidv4();
		IDs.add(ID);

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
	if (IDs.has(ID) === false) return false;
	
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
	if (IDs.has(ID) === false) return false;

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
	if (IDs.has(ID) === false) return false;

	// check if the MQ exists
	const mq = mqueues.get(name);
	if (mq === undefined) return false;

	// perform the action
	mq.publish(ID, message);
	return true;
}

function get(ID:string, name:string): string | undefined
{
	/* #debug */
	console.log(`${ID} getting from`, name);

	// check if the ID is one of our onw generated ID
	if (IDs.has(ID) === false) return undefined;

	// check if the MQ exists
	const mq = mqueues.get(name);
	if (mq === undefined) return undefined;

	// perform the action
	return mq.get(ID);
}


// clean queues
// setInterval (() => {
// 	mqueues.forEach((queue, name) => {
// 		if (queue.empty()) mqueues.delete(name);
// 	});
// }, 1000);




/* ------------------------------------------ */
const start = async () => {
	try {
		// start fastify server
		await fastify.listen({ port: PORT, host: '0.0.0.0' });
		console.log(`Server running on http://localhost:${PORT}`);

		mqueues.set("test", new MQueue());
		mqueues.set("game", new MQueue());

	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}

};

// entrypoint
start();