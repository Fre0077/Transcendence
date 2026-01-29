import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyMetrics from "fastify-metrics";
import fastifyWebsocket from '@fastify/websocket';
import fastifyMultipart from '@fastify/multipart';
import cors from '@fastify/cors';

// import { WebSocket } from "ws";
import { isCookieAuthenticated, attachAllCookies, clearAllCookies} from './middleware.js';


// Where the Queue will listen
const PORT = Number(process.env.PORT) || 3029;
// const MYURL = process.env.MYURL ?? `http://butler:${PORT}`;


/* ------- LOAD STUFF ------- */
const fastify = Fastify({ 
	logger: false, //too much stuff... 
	trustProxy: true
});

// Metrics - Register BEFORE routes
await fastify.register(fastifyMetrics.default, {
  endpoint: '/metrics'
});

// Register WebSocket plugin
await fastify.register(fastifyMultipart);
await fastify.register(fastifyWebsocket);
// Register Cookies plugin
await fastify.register(fastifyCookie);
// Register CORS policy to accept only requests with origin the frontend (localhost:3000)
await fastify.register(cors, {
	// origin: 'http://frontend:3000', // frontend origin
	/* origin: ['http://localhost:3000', 'http://frontend:3000'], */ // frontend origin
	origin: false,
	credentials: true,              // important: allows cookies to be sent
	methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
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
	fetchBackend,
	authForward,
	noAuthForward,

	/* WS */
	fwdWebSocket  
}
from './forwarders.js';

import {
	sendLobbyInvite,
	authWebSocket,
	/* sendFriendRequest, */
	attachFriendStatus,
	sendFriendUpdate,
	sendFriendNotification,
} from './backendbypass.js';



// backend urls
const AUTH_URL = process.env.AUTH_URL ?? 'http://auth:3001';
const CHAT_URL = process.env.CHAT_URL ?? 'http://chat:3002';
const PROFILE_URL = process.env.PROFILE_URL ?? 'http://profile:3003';
const LOBBY_URL = process.env.LOBBY_URL ?? 'http://lobby:3031';
const TOURNAMENT_URL = process.env.TOURNAMENT_URL ?? 'http://tournament:3032';
const PONG_URL = process.env.PONG_URL ?? 'http://pong:3040';

// http gateway endpoints
fastify.register(async function (fastify) {

	// helper to forwarder for backend HTTP services
	/* @handler: (data:any, reply:FastifyReply) => any, this function modifies the returned 'data'
	   @updater: (user:any) => void, this function sends an update to all connected users related to 'user'
	   @notifier: (sender:string, data:any) => void, this function sends a notification to 'target' user (found in data) if connected */
	function httpforwarder(endpoint:string, type:string, opts?:any) {

		// if no auth
		if (opts?.auth === false) return async (request:FastifyRequest, reply:FastifyReply) => await noAuthForward(request, reply, endpoint, type, opts.handler);
		// if auth
		else return async (request:FastifyRequest, reply:FastifyReply) => await authForward(request, reply, endpoint, type, opts.handler, opts?.updater, opts?.notifier);
	}

	// authentication endpoint
	fastify.get('/isauth', async (request, reply) => isCookieAuthenticated(request, reply));
	fastify.delete('/logout', async (_, reply) => clearAllCookies(reply));

	// auth backend APIs
	fastify.post('/login', httpforwarder(`${AUTH_URL}/api/login`, 'application/json', { auth: false, handler: attachAllCookies }));
	fastify.post('/register', httpforwarder(`${AUTH_URL}/api/register`, 'application/json', { auth: false }));
	fastify.post('/auth/google', httpforwarder(`${AUTH_URL}/api/auth/google`, 'application/json', { auth: false }));
	fastify.post('/2fa/verify', httpforwarder(`${AUTH_URL}/api/2fa/verify`, 'application/json', { auth: false }));
	fastify.get('/profile',  httpforwarder(`${AUTH_URL}/api/profile`, 'application/json', { auth: true }));
	fastify.patch('/profile',  httpforwarder(`${AUTH_URL}/api/profile`, 'application/json', { auth: true, handler: attachAllCookies }));
	fastify.post('/profile/avatar',  httpforwarder(`${AUTH_URL}/api/profile/avatar`, 'multipart/form-data', { auth: true }));
	fastify.post('/2fa/generate',  httpforwarder(`${AUTH_URL}/api/2fa/generate`, 'application/json', { auth: true }));
	fastify.post('/2fa/enable',  httpforwarder(`${AUTH_URL}/api/2fa/enable`, 'application/json', { auth: true }));
	fastify.post('/2fa/disable',  httpforwarder(`${AUTH_URL}/api/2fa/disable`, 'application/json', { auth: true }));
	// fastify.post('/logout',  httpforwarder(`${AUTH_URL}/api/logout`, { auth: false }));
	// ... add others

	// profile backend APIs
	fastify.get('/user', httpforwarder(`${PROFILE_URL}/api/user`, 'application/json', { auth: true }));
	fastify.get('/game', httpforwarder(`${PROFILE_URL}/api/game`, 'application/json', { auth: true }));
	fastify.get('/userinfo', httpforwarder(`${PROFILE_URL}/api/userinfo`, 'application/json', { auth: true }));
	fastify.get('/friends', httpforwarder(`${PROFILE_URL}/api/friends`, 'application/json', { auth: true, handler: attachFriendStatus }));
	fastify.post('/friend/request', httpforwarder(`${PROFILE_URL}/api/friend/request`, 'application/json', { auth: true, updater: sendFriendUpdate, notifier: sendFriendNotification }));
	fastify.post('/friend/accept', httpforwarder(`${PROFILE_URL}/api/friend/accept`, 'application/json', { auth: true, updater: sendFriendUpdate }));
	fastify.post('/friend/remove', httpforwarder(`${PROFILE_URL}/api/friend/remove`, 'application/json', { auth: true, updater: sendFriendUpdate }));
	// ... add others

	// chat backend APIs
	fastify.post('/user-list', httpforwarder(`${CHAT_URL}/api/user-list`, 'application/json', { auth: true }));
	fastify.post('/new-message', httpforwarder(`${CHAT_URL}/api/new-message`, 'application/json', { auth: true }));
	fastify.post('/new-chat', httpforwarder(`${CHAT_URL}/api/new-chat`, 'application/json', { auth: true }));
	fastify.post('/delete-chat-messages', httpforwarder(`${CHAT_URL}/api/delete-chat-messages`, 'application/json', { auth: true }));
	fastify.post('/delete-chat', httpforwarder(`${CHAT_URL}/api/delete-chat`, 'application/json', { auth: true }));
	fastify.post('/delete-message', httpforwarder(`${CHAT_URL}/api/delete-message`, 'application/json', { auth: true }));
	fastify.post('/search-message', httpforwarder(`${CHAT_URL}/api/search-message`, 'application/json', { auth: true }));
	fastify.post('/search-chat', httpforwarder(`${CHAT_URL}/api/search-chat`, 'application/json', { auth: true }));
	fastify.post('/block-user', httpforwarder(`${CHAT_URL}/api/block-user`, 'application/json', { auth: true }));
	fastify.post('/sblock-user', httpforwarder(`${CHAT_URL}/api/sblock-user`, 'application/json', { auth: true }));
	// ... add others

	// Fetches the desired backend endpoint (if specified). Then on successfule response calls the 'forward' function.
	// NOTE that the 'splitforwarder()' needs 'isCookieAuthenticated()' as preHandler, so that it cann attach the 'user' to the request.
	function splitforwarder(endpoint:string | undefined, forwarder: (request:FastifyRequest, reply:FastifyReply) => void)
	{
		return async (request:FastifyRequest, reply:FastifyReply) => {

			// fetch the desired endpoint
			if (endpoint !== undefined)
			{
				let ret;
				try {
					ret = await fetchBackend(request, endpoint, 'application/json', { ok:true, user:(request as any).user });
				} catch (err) {
					console.log('Error', err);
					reply.code(502).send("Backend service unreachable");
					return ;
				}

				// if fetch went wrong don't forward second part
				if (ret.status !== 200) {
					reply.code(ret.status).send(ret.statusText);
					return ;
				}
			}

			// execute the second part
			forwarder(request, reply);
		};
	}

	// backend bypass endpoints (interact with the users connected to butler)
	// All these endpoint require an authenticated connection
	fastify.post('/lobby-invite', { preHandler: [isCookieAuthenticated] }, splitforwarder(undefined, sendLobbyInvite));
	// fastify.post('/friend-request', { preHandler: [isCookieAuthenticated] }, splitforwarder(`${PROFILE_URL}/api/friend/request`, sendFriendRequest));


}, { prefix: '/api' });


// websocket endpoints (always need authentication)
fastify.register(async function (fastify) {

	// helper to create forwarders for backend websocket services
	function wsforwarder(service: string) {
		const wsurl = service.replace('http', 'ws');
		return (connection:any, request:FastifyRequest) => fwdWebSocket(connection, request, wsurl);
	}

	// secure websocket connection
	fastify.get('/', { websocket: true }, (connection, request) => authWebSocket(connection, request));

	// game websockets
	fastify.get('/pong/play', { websocket: true }, wsforwarder(`${PONG_URL}/play`));
	fastify.get('/pong/spectate', { websocket: true }, wsforwarder(`${PONG_URL}/spectate`));
	fastify.get('/pong/replay', { websocket: true }, wsforwarder(`${PONG_URL}/replay`));
	fastify.get('/lobby', { websocket: true }, wsforwarder(`${LOBBY_URL}/ws`));
	fastify.get('/tournament', { websocket: true }, wsforwarder(`${TOURNAMENT_URL}/ws`));

	// chat websockets
	fastify.get('/broadcast', { websocket: true }, wsforwarder(`${CHAT_URL}/api/broadcast`));

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