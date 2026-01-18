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
	// origin: 'http://frontend:3000', // frontend origin
	origin: 'http://localhost:3000', // frontend origin
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
from './forwarders.js';


// backend urls
const AUTH_URL = process.env.AUTH_URL ?? 'http://auth:3001';
const PROFILE_URL = process.env.PROFILE_URL ?? 'http://profile:3001';
const CHAT_URL = process.env.CHAT_URL ?? 'http://chat:3001';

// http gateway endpoints
fastify.register(async function (fastify) {

	// helper to forwarder for backend HTTP services
	function httpforwarder(endpoint:string, auth:boolean) {

		// JWT interceptor
		if (endpoint === `${AUTH_URL}/api/login`) return async (request:FastifyRequest, reply:FastifyReply) => await noAuthForward(request, reply, endpoint, attachCookies);
		else if (auth) return async (request:FastifyRequest, reply:FastifyReply) => await authForward(request, reply, endpoint);
		else return async (request:FastifyRequest, reply:FastifyReply) => await noAuthForward(request, reply, endpoint);
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

const LOBBY_URL = process.env.LOBBY_URL ?? 'http://lobby:3031';
const PONG_URL = process.env.LOBBY_URL ?? 'http://pong:3040';
// const TOURNAMENT_URL = process.env.LOBBY_URL ?? 'http://tournament:3032';

// websocket endpoints
fastify.register(async function (fastify) {

	// helper to create forwarders for backend websocket services
	function wsforwarder(service: string) {
		const wsurl = service.replace('http', 'ws');
		return (connection:any, request:FastifyRequest) => fwdWebSocket(connection, request, wsurl);
	}

	// secure websocket connection
	fastify.get('/', { websocket: true }, (connection, request) => authWebSocket(connection, request));

	// backend websockets
	fastify.get('/pong', { websocket: true }, wsforwarder(`${PONG_URL}/ws`));
	fastify.get('/lobby', { websocket: true }, wsforwarder(`${LOBBY_URL}/ws`));
	fastify.get('/tournament', { websocket: true }, wsforwarder('tournament/tournamentsocket'));

}, { prefix: '/ws' });



/* ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! */
/* CONNECT TO FRONTEND for frontend stuff (Catch-all SPA route)  */
// fastify.get('/*', async (req, rep) => {
// 	console.log('Forwarding to frontend');
// 	noAuthForward(req, rep, 'http://frontend:3000');
// });
fastify.get('/', async () => "This is the Backend Gateway, turn back now");
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