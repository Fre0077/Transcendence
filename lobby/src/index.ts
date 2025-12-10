/* ------------------------- */
/* ------------------------- */
/* ------------------------- */


import Fastify from 'fastify';
// import { Game } from "./Game.js";
import { Lobby, Player } from "./Lobby.js";

import { interpreter } from './interpreter.js'

// constants
const PORT = Number(process.env.PORT) || 3003;
const GAME_PORT = Number(process.env.GAME_PORT) || 3002;
const GAME_URL = `http://localhost:${GAME_PORT}`;


/* -------- LOAD ELEMENTS -------- */
const fastify = Fastify({ 
	logger: false //too much stuff... 
});

// Register WebSocket plugin
await fastify.register(import('@fastify/websocket'));

// Health-check endpoint (server-side)
fastify.get("/health", async () => ({ status: "ok" }));


import { getAllLobbyStates } from './lobbyDB.js';

// all states
fastify.get("/lobbies", async () => ({ states: getAllLobbyStates() }));



/* ---------- tRPC stuff ---------- */
// server
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { lobbyRouter } from 'shared-trpc';
// client
import { getGameService } from './trpc.js';

import { gameIsFinished } from './lobbyDB.js'

// Register tRPC plugin (server side)
await fastify.register(fastifyTRPCPlugin, {
	prefix: '/trpc',
	trpcOptions: { router: lobbyRouter, createContext: () => ({ func: gameIsFinished }) },
});


// TRPC Client
export const gameService = {service: getGameService(`${GAME_URL}/trpc`), url: GAME_URL };



/* ! ! ! TEMP ! ! ! */

// fetching test html
await fastify.register(import('@fastify/static'), {
	root: new URL('../public', import.meta.url).pathname
});

// serving lobby test html
fastify.get('/', async (request, reply) => {
	request; // ignore
	return reply.sendFile('fastify_lobby.html');
});

// serving game test html
fastify.get('/game', async (request, reply) => {
	request; // ignore
	return reply.sendFile('fastify_game.html');
});



import { leaveLobbySocket } from './lobbyDB.js';


// WebSocket route handler
fastify.register(async function (fastify) {
	fastify.get('/lobbysocket', { websocket: true }, (connection, request) => {

		// Logging the connection
		const clientIP = request.socket.remoteAddress;
		console.log(`Client connected from ${clientIP}`);

		// playerId not verified with JWT yet
		let player:Player | undefined = undefined;
		//----- finding the right lobby to log in
		let lobby:Lobby | undefined = undefined;
		// personal loop
		let interval:NodeJS.Timeout;	/* :D */

		// Send welcome message
		connection.send('Connected to Fastify WebSocket server!');

		// Handle incoming messages
		connection.on('message', (message:string) => {
			
			interpreter(message, lobby, player, connection, (retLobby:Lobby | undefined, retPlayer:Player | undefined) => {
				lobby = retLobby;
				player = retPlayer;
			})
			.then((reply) => {
				// send reply
				if (connection.readyState === connection.OPEN) {
					connection.send(reply);
				}
				// close connection if the client left successfully
				if (reply.includes('LEAVE_REPLY') && reply.includes('success')) {
					connection.close();
				}
			})
			.catch((error) => {
				console.error('interpreter() Promise rejected with error: ' + error);
			});
		});

		// Handle WebSocket errors
		connection.on('error', (error:string) => {
			console.error(`WebSocket error for ${clientIP}:`, error);
		});

		// Handle connection close
		connection.on('close', (code:number, reason:string) => {
			if (interval) {clearInterval(interval);}
			
			// leave procedure (just leave from the connected sockets, not from the lobby)
			if (lobby !== undefined && player !== undefined && lobby.ingame === false)
			{
				leaveLobbySocket(lobby.ID, player.ID);
				player.status = "disconnected";
			}

			console.log(`Client ${clientIP} disconnected - Code: ${code}, Reason: ${reason?.toString() || 'none'}`);
		});


		// send lobby state to frontend once per second
		interval = setInterval(() => {
			// Don't send gamestate if the game isn't found
			if (lobby === undefined) return;
	
			if (connection.readyState === connection.OPEN) {
				// send lobby state
				connection.send(lobby.stateJSON);
			}

		}, 1000);	// (delay in ms)

	});
});

/* ---- start server ---- */

import { StatusChecker } from './StatusChecker.js';

const start = async () => {
	try {
		// start fastify server
		await fastify.listen({ port: PORT, host: '0.0.0.0' });
		console.log(`Server running on http://localhost:${PORT}`);

	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}

	// Games handler
	setInterval(() => {
		// check the status of the lobbies, if needed removes them from the array
		StatusChecker();
	}, 1000);
};

// entrypoint
start();