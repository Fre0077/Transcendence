/* ------------------------- */
/* ------------------------- */
/* ------------------------- */


import Fastify from 'fastify';
// import { Game } from "./Game.js";
import { Lobby } from "./Lobby.js";

import { CREATE, JOIN, LEAVE, START, BOT } from './METHODS.js';
// import type { CreateReturn } from './METHODS.js';

// tRPC stuff
// server
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { lobbyRouter } from 'shared-trpc';
// client
import { getGameService } from './trpc.js';

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

// Register tRPC plugin (server side)
await fastify.register(fastifyTRPCPlugin, {
	prefix: '/trpc',
	trpcOptions: { router: lobbyRouter, createContext: () => ({ func: gameIsFinished }) },
});





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






// TRPC Client
const gameService = getGameService(`${GAME_URL}/trpc`);


/* --------------- LOBBY DB --------------- */

export type LobbyEntry = {
	lastCheck:number,
	lobby:Lobby
}

let lobbies:LobbyEntry[] = [];	// lobby array

export function createLobby(): Lobby {
	const lobby:Lobby = new Lobby();
	lobbies.push({ lastCheck: Date.now(), lobby: lobby});
	return lobby;
}

// returns the lobby in the 'lobbies' array
export function getLobby(lobbyID:string): Lobby | undefined {

	if (lobbyID === null) return undefined;

	let entry;

	// join the first lobby with an empty space
	if (lobbyID === 'ANY'){
		entry = lobbies.find(e => e.lobby.full() === false);
		if (entry === undefined) return undefined;
		else return entry.lobby;
	}

	// check the specific lobby
	entry = lobbies.find(e => e.lobby.ID === lobbyID);
	if (entry === undefined) return undefined;
	else return entry.lobby;
}

/* ---------- backend to backend ----------- */

function gameIsFinished(gameID:string) {
	let entry = lobbies.find(e => e.lobby.getGameDetails().ID === gameID);
	if (entry == undefined) return;
	else {
		console.log('Resetting lobby', entry.lobby.ID);
		entry.lobby.reset();
	}
}

/* --------------------------------------- */


/* HELPERS */

// check if the string is a JSON obj
function isValidObj(message:string): { method: string } | undefined {
	let parse: unknown;

	// JSON parse
	try {
		parse = JSON.parse(message.toString());
	} catch (err) {
		return undefined;
	}

	const obj:{ method: string } = Object(parse);

	// check 'method' property
	if (obj === undefined
		|| !("method" in obj)
		|| typeof obj.method !== "string")
	{
		console.log(`invalid JSON message ${message}`);
		return undefined;
	}

	return obj;
}

// WebSocket route handler
fastify.register(async function (fastify) {
	fastify.get('/lobbysocket', { websocket: true }, (connection, request) => {

		// Logging the connection
		const clientIP = request.socket.remoteAddress;
		console.log(`Client connected from ${clientIP}`);

		// generate player ID (get it from frontend afterwards @aleborghi)
		let playerID:string | undefined = undefined;;	// as of now saved only on JOIN requests

		//----- finding the right lobby to log in
		let lobby:Lobby | undefined = undefined;
		let interval:NodeJS.Timeout;	/* :D */

		// Send welcome message
		connection.send('Connected to Fastify WebSocket server!');

		// Handle incoming messages
		connection.on('message', (message:string) => {
			
			// Format and log message
			let msg = isValidObj(message.toString());
			if (msg === undefined) {
				console.log(`invalid JSON message ${msg}`);
				return;
			}

			// loggigng message
			console.log(`Received from ${clientIP}:`, msg);
				
			// various lobby operations
			switch (msg.method)
			{
				case "CREATE":
					/* { method: 'CREATE', playerID: <playerID>, format: <format> }
						Description: Creates a lobby, if 'format' is a valid format the lobby inherits that format.
						NOTE: automatically JOIN the lobby after a CREATE request
					*/
					let cret = CREATE(msg, lobby);

					// welp...
					if (cret.status == "success") {
						// save variables
						lobby = cret.lobby;
						playerID = cret.playerID;
					}

					// send reply
					if (connection.readyState === connection.OPEN) {
						connection.send(cret.reply);
					}
					break ;

				case "JOIN":
					/* { method: 'JOIN', lobbyID: <lobbyID>, playerID: <playerID> }
						Description: Joins a lobby with the specified ID, if playerID is null it fails
					*/
					let jret = JOIN(msg, lobby);

					// welp...
					if (jret.status == "success") {
						// save variables
						lobby = jret.lobby;
						playerID = jret.playerID;
					}
					
					// send reply
					if (connection.readyState === connection.OPEN) {
						connection.send(jret.reply);
					}
					break ;
				
				case "LEAVE":
					/* { method: 'LEAVE' } 
						Desccription: Leaves the lobby. If not authenticated or not joined a lobby the
						request fails 
					*/
					let lret = LEAVE(lobby, playerID);
					
					if (lret.status === "success")
						lobby = undefined;

					// send reply
					if (connection.readyState === connection.OPEN) {
						connection.send(lret.reply);
					}
					break ;

				case "BOT":
					/* { method: 'BOT', value: <command> }
						Description: ADDs or REMOVEs a BOT to the lobby
					*/
					let bret = BOT(msg, lobby);
					
					// send reply
					if (connection.readyState === connection.OPEN) {
						connection.send(bret.reply);
					}
					break ;
				
				case "START":
					/* { method: 'START' }
						Description: Starts the lobby. only one player will do that, than the lobby is closed and set to 'in-game'.
						If the lobby started correctly the 'value' of the reply is set to the 'gameID' to join
						Note: the other player will be notified that the lobby was successfully started by the 'ingame' propery of the
						lobbyStatus that gets sent once every second
					*/
					START(lobby, gameService, GAME_URL)
						.then((value) => {
							// send reply
							if (connection.readyState === connection.OPEN) {
								connection.send(value.reply);
							}
						})
						.catch((error) => {
							console.error('START Promise rejected with error: ' + error);
						});

					break ;
				
				default:
					console.log(`Unhandled method ${msg.method}`);

					// error reply
					if (connection.readyState === connection.OPEN) {
						connection.send(JSON.stringify({ method: `${msg.method}_REPLY`, status: 'failure', comment: `Unhandled method ${msg.method}`}));
					}
			}
		});

		// Handle WebSocket errors
		connection.on('error', (error:string) => {
			console.error(`WebSocket error for ${clientIP}:`, error);
		});

		// Handle connection close
		connection.on('close', (code:number, reason:string) => {
			if (interval) {clearInterval(interval);}
			
			// leave procedure
			LEAVE(lobby, playerID);

			// logging
			console.log(`Client ${clientIP} disconnected - Code: ${code}, Reason: ${reason?.toString() || 'none'}`);
		});


		// send lobby state to frontend once per second
		interval = setInterval(() => {
			// Don't send gamestate if the game isn't found
			if (lobby === undefined) return;
	
			if (connection.readyState === connection.OPEN) {
				// send lobby state
				connection.send(lobby.lobbyJSON);
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
		StatusChecker(lobbies);
	}, 1000);
};

// entrypoint
start();