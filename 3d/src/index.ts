/* ------------------------- */
/* ------------------------- */
/* ------------------------- */


import Fastify from 'fastify';
// import { Game } from "./Game.js";

// reply METHODS
import { LEAVE } from './METHODS.js'

const FPS:number = 60;
const PORT = Number(process.env.PORT) || 3004;
const LOBBY_PORT = Number(process.env.LOBBY_PORT) || 3003;
const LOBBY_URL = `http://localhost:${LOBBY_PORT}`;


/* -------- LOAD ELEMENTS -------- */
const fastify = Fastify({ 
	logger: false //too much stuff... 
});

// Register WebSocket plugin
await fastify.register(import('@fastify/websocket'));



// tRPC stuff
// server
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { gameRouter } from 'shared-trpc';
// client
import { getLobbyService } from './trpc.js';

import { addGame } from './gameDB.js';

// Register tRPC plugin
await fastify.register(fastifyTRPCPlugin, {
	prefix: '/trpc',
	trpcOptions: { router: gameRouter, createContext: () => ({ func: addGame }) },
});

// Health-check endpoint
fastify.get("/health", async () => ({ status: "ok" }));


// TRPC Client
const lobbyService = getLobbyService(`${LOBBY_URL}/trpc`);


export async function safeTRPC(arg:string)
{
	if (LOBBY_URL === undefined || LOBBY_URL === null) {
		console.log('invalid URL');
		return false;
	}

	const health = await fetch(`${LOBBY_URL}/health`)
		.then(r => r.json())
		.catch(() => null);

	if (!health?.status) {
		console.log(`Server '${LOBBY_URL}' offline`);
		return false;
	}

	lobbyService.endGame.mutate(arg);
	return true;
}

// #todo with @Fre007
export function saveGameIntoMatchHistory()
{
	console.log('#todo save data into DB with @Fre007');
}

/* --------------------------------- */


/* ------------------------------------------------------------ */
/*                                                             */
/*                                                            */
/*                                                           */
/*                                                          */
/*                                                         */
/*                                                        */
/*                      : )                              */
/*                                                      */
/*                                                     */
/*                                                    */
/*                                                   */
/*                                                  */
/*                                                 */
/*                                                */
/*                                               */
/*                                              */
/* * * * * * * * * * * * * * * * * * * * * * * */


/* --------------------------------------------- */
/* 												 */
/* 			FRONTEND to BACKEND WebSocket	 	 */
/* 												 */
/* --------------------------------------------- */

import { GameEntry, Player } from './gameDB.js';
import { interpreter } from './interpreter.js';

// WebSocket route handler
fastify.register(async function (fastify) {
	fastify.get('/gamesocket', { websocket: true }, (connection, request) => {

		// Storing the SenderIP and logging it
		const clientIP = request.socket.remoteAddress;
		console.log(`Client connected from ${clientIP}`);

		// Storing the Game and the Player
		let entry:GameEntry | undefined = undefined;
		let player:Player | undefined = undefined;
		let interval:NodeJS.Timeout;	/* :D */

		// Send welcome message
		connection.send('Connected to Fastify WebSocket server!');

		// Handle incoming messages
		connection.on('message', (message:string) => {
			
			const reply = interpreter(message, entry, player,
				(retEntry:GameEntry | undefined, retPlayer:Player | undefined) => {
					entry = retEntry;
					player = retPlayer;
				}
			)
			if (reply !== null && connection.readyState === connection.OPEN) {
				connection.send(reply);
			}
		});

		// Handle WebSocket errors
		connection.on('error', (error) => {
			console.error(`WebSocket error for ${clientIP}:`, error);
		});

		// Handle connection close
		connection.on('close', (code, reason) => {
			if (interval) {clearInterval(interval);}
			
			// leave procedure
			LEAVE(entry, player);

			// logging
			console.log(`Client ${clientIP} disconnected - Code: ${code}, Reason: ${reason?.toString() || 'none'}`);
		});

		// send gamestate to frontend 'FPS' times per second
		interval = setInterval(() => {
			// Don't send gamestate if the game isn't found
			if (entry === undefined) return;

			if (connection.readyState === connection.OPEN) {
				connection.send(entry.game.stateJSON);
			}

		}, 1000 / FPS);	// FPS (delay in ms)

	});
});

/* ============== GAME STARTER ============ */

/* ---- start server ---- */

import { StatusChecker } from './StatusChecker.js';

const start = async () => {
	try {
		await fastify.listen({ port: PORT, host: '0.0.0.0' });
		console.log(`Server running on http://localhost:${PORT}`);
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}

	// Games handler
	setInterval(() => {
		// check the status of the games, if needed removes them from the array
		// and sends notification to the lobby service
		StatusChecker();
	}, 1000);
};

// entrypoint
start();