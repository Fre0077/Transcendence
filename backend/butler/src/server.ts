import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyWebsocket from '@fastify/websocket';
import cors from '@fastify/cors';

// import { WebSocket } from "ws";
import { isCookieAuthenticated, attachCookies} from './middleware.js';


// Where the Queue will listen
const PORT = Number(process.env.PORT) || 3029;
// const MYURL = process.env.MYURL ?? `http://butler:${PORT}`;


/* ------- LOAD STUFF ------- */
const fastify = Fastify({ 
	logger: false //too much stuff... 
});

// Register WebSocket plugin
await fastify.register(fastifyWebsocket);
// Register Cookies plugin
await fastify.register(fastifyCookie);
// Register CORS policy to accept only requests with origin the frontend (localhost:3000)
await fastify.register(cors, {
	origin: 'http://frontend:3000', // frontend origin
	credentials: true,              // important: allows cookies to be sent
});

// Health-check endpoint (server-side)
fastify.get("/health", async () => ({ status: "ok" }));

// just logging all the connections
fastify.addHook('onRequest', (request, _, done) => {
	console.log(`[Gateway] Incoming request: ${request.method} ${request.url}`);
	done();
});

/* cosa fa questo container?
	tutte le call al backend passano da qui.

	Ci saranno delle call "protette" e delle call "publiche".
	Il controllo dell'autorizzazione viene fatto con i cookies.

	Il frontend ogni tanto chiedera' se l'utente e' autenticato per
	capire se fargli vedere alcune pagine.
	Questo container avra' l'endpoint per farlo.
*/


/*	ENDPOINTS:
	/isauth : {auth: true/false, "check if user is authenticated"}

	/profile/...
	/chat/...
	/auth/...

	/lobby/...
	/tournament/...
	/pong/...
*/

/* let connected_users:Map<string, WebSocket> = new Map();

async function sendNotify(username: string, ) {

} */


// #todo read the websocket headers in backend

import { 
	/* HTTP */
	authForward,
	noAuthForward,

	/* WS */
	authWebSocket,
	fwdWebSocket  
}
from './endpoints.js';


// backend urls
const AUTH_URL:string = process.env.AUTH_URL ?? 'http://auth:3001';
const PROFILE_URL:string = process.env.PROFILE_URL ?? 'http://auth:3001';
const CHAT_URL:string = process.env.CHAT_URL ?? 'http://auth:3001';

// http gateway endpoints
fastify.register(async function (fastify) {

	// helper to forwarder for backend HTTP services
	function httpforwarder(service:string, auth:boolean) {

		// JWT interceptor
		if (service === `${AUTH_URL}/api/login`) return async (request:FastifyRequest, reply:FastifyReply) => await noAuthForward(request, reply, service, attachCookies);
		else if (auth) return async (request:FastifyRequest, reply:FastifyReply) => await authForward(request, reply, service);
		else return async (request:FastifyRequest, reply:FastifyReply) => await noAuthForward(request, reply, service);
	}

	// authentication endpoint
	fastify.get('/isauth', async (request) => isCookieAuthenticated(request));

	// auth backend APIs
	fastify.post('/login', httpforwarder(`${AUTH_URL}/api/login`, false));
	fastify.post('/register', httpforwarder(`${AUTH_URL}/api/register`, false));
	// ... add others

	// profile backend APIs
	fastify.get('/user', httpforwarder(`${PROFILE_URL}/api/user`, true));
	// ... add others

	// chat backend APIs
	fastify.get('/user-list', httpforwarder(`${CHAT_URL}/api/user-list`, true));
	// ... add others


}, { prefix: '/api' });


// websocket endpoints
fastify.register(async function (fastify) {

	// helper to create forwarders for backend websocket services
	function wsforwarder(service: string) {
		return (connection:any, request:FastifyRequest) => fwdWebSocket(connection, request, service);
	}

	// secure websocket connection
	fastify.get('/', { websocket: true }, (connection, request) => authWebSocket(connection, request));

	// backend websockets
	fastify.get('/pongsocket', { websocket: true }, wsforwarder('pong/gamesocket'));
	fastify.get('/lobbysocket', { websocket: true }, wsforwarder('lobby/lobbysocket'));
	fastify.get('/tournamentsocket', { websocket: true }, wsforwarder('tournament/tournamentsocket'));

}, { prefix: '/ws' });

/* ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! */
/* CONNECT TO FRONTEND for frontend stuff (Catch-all SPA route)  */
fastify.get('/*', async (req, rep) => {
	console.log('Forwarding to frontend');
	noAuthForward(req, rep, 'http://frontend:3000');
});
/* ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! */


/* ------------------------------------------ */

const start = async () => {
	try {

		// start fastify server
		await fastify.listen({ port: PORT, host: '0.0.0.0' });
		
		// logging version for info and compatibility
		console.log(`Server running on http://localhost:${PORT}`);

	} catch (err) {
		console.log(err);
		fastify.log.error(err);
		process.exit(1);
	}

};

// entrypoint
start();