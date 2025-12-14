import Fastify from 'fastify';
import { Lobby } from './Lobby.js'
import type { WebSocket } from "ws";


// Where the Queue will listen
const PORT = Number(process.env.PORT) || 3031;
export const BUNNYURL = process.env.BUNNYURL ?? 'http://localhost:3030';
export const MYURL = process.env.MYURL ?? `http://localhost:${PORT}`;
export const MYPASS = process.env.MYPASS ?? 'password';

// service varaibles
const TIMEOUT:number = 10;	// timeout in seconds to wait before deleeting the game

// bunny client
import { bunnyRegister, bunnySubscribe, bunnyGet, bunnyPublish } from './bunny.js'

/* ------- LOAD STUFF ------- */
const fastify = Fastify({ 
	logger: false //too much stuff... 
});

// Register WebSocket plugin
await fastify.register(import('@fastify/websocket'));

// Health-check endpoint (server-side)
fastify.get("/health", async () => ({ status: "ok" }));

/* ======= ALL LOBBIES ====== */
fastify.get("/lobbies", async () => ({
	states: Array.from(lobbies, ([id, { lobby }]) => ({
		ID: id,
		state: lobby.state
	}))
}));

/* ======== YOUR LOBBY ====== */
interface MyLobbyQuery {
	ID: string;	// ID of the lobby
}

fastify.get<{ Querystring: MyLobbyQuery }>(
	"/my-lobby",
	async (request) => {
		const { ID } = request.query;

		const lobby = findLobby(ID);
		if (lobby === undefined)
			return { status: 'failure' };
		else
			return { status: 'success', state: lobby.state };
	}
);


/* ============= BUNNY ENDPOINT ============ */
/* Description: this endpoint is passed to the bunnyMQ service
upon registration. The service will perform a GET request on this
endpoint whenever a new message is present in a subscribed queue. */

interface BunnyQuery {
	queue: string;
	howmany: number;
}

fastify.get<{ Querystring: BunnyQuery }>(
	"/bunny",
	async (request) => {
		const { queue } = request.query;

		// a new message in game means new game to create
		if (queue === 'lobby') {
			const message = await bunnyGet('lobby');
			const msg = Object(message);

			// check if we got the gameID and the status
			if ("gameID" in msg === false
				|| typeof msg.gameID !== "string"
				|| "status" in msg === false
				|| typeof msg.status !== "string")
			{
				console.log('Invalid JSON (with successful get)', message);
				// throw 'Invalid JSON (with successful get)';
				return { status: 'ko' };
			}

			// reset the lobbby
			for (const [id, { lobby }] of lobbies.entries()) {
				if (lobby.gameID === msg.gameID) {
					resetLobby(id);
					break; // stops immediately
				}
			}
			
			// successful get
			return { status: 'ok' };
		}
		// not expected
		return { status: 'ko' };
	}
);

/* ============================================== */








/* ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! */
/* 					 	TEMPORARY 					   */
/* 			  Serving Static HTML as Backend		   */

// fetching test html
await fastify.register(import('@fastify/static'), {
	root: new URL('../public', import.meta.url).pathname
});

// serving lobby test html
fastify.get('/', async (request, reply) => {
	request; // ignore
	return reply.sendFile('fastify_lobby.html');
});

// serving pong test html
fastify.get('/pong', async (request, reply) => {
	request; // ignore
	return reply.sendFile('fastify_pong.html');
});

// serving tower test html
fastify.get('/tower', async (request, reply) => {
	request; // ignore
	return reply.sendFile('fastify_tower.html');
});

/* ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! */







/* ----------- LOBBY DataBase ---------- */
let lobbies:Map<string, { lobby:Lobby<WebSocket>, timeout:number }> = new Map();

export function createLobby(/* game:string,  */size:number = 2): Lobby<WebSocket>
{
	const lobby:Lobby<WebSocket> = new Lobby(size);

	// #debug
	console.log(`Creating lobby ${lobby.ID} ...`);

	lobbies.set(lobby.ID, { lobby: lobby, timeout: TIMEOUT });
	return lobby;
}

export function findLobby(ID:string): Lobby<WebSocket> | undefined
{
	return lobbies.get(ID)?.lobby;
}

export function joinLobby(ID:string, playerID:string, ws:WebSocket)
{
	// check if lobby is present
	const e = lobbies.get(ID);
	if (e === undefined) return;

	// join lobby
	const { lobby } = e;
	lobby.join(playerID, ws);
}

export function resetLobby(ID:string)
{
	const e = lobbies.get(ID);
	if (e === undefined) return;

	// #debug
	console.log(`Resetting lobby ${ID} ...`);

	// reset lobby
	e.lobby.reset();

	// bots operations
	e.lobby.players.forEach((p, id) => {
		if (id.startsWith('BOT')) {
			// 'connect' bots to lobby
			p.connect(null);
			// disconnect bots from game
			bunnyPublish('bot', {
				method: 'DELETE',
				botid: id
			});
		}
	});
}

export function deleteLobby(ID:string)
{
	if (!lobbies.has(ID)) return;

	// #debug
	console.log(`Deleting lobby ${ID} ...`);

	lobbies.delete(ID);
}












import { interpreter } from './interpreter.js';

// WebSocket route handler
fastify.register(async function (fastify) {
	fastify.get('/lobbysocket', { websocket: true }, (connection, request) => {

		// Logging the connection
		const clientIP = request.socket.remoteAddress;
		console.log(`Client connected from ${clientIP}`);

		// playerID not verified with JWT yet
		let player:string | undefined = undefined;
		// lobbyID
		let lobby:string | undefined = undefined;

		// Send welcome message
		connection.send('Connected to Fastify WebSocket server!');

		// Handle incoming messages
		connection.on('message', (message:string) => {
			
			interpreter(message, lobby, player, connection, (retLobby:string | undefined, retPlayer:string | undefined) => {
				lobby = retLobby;
				player = retPlayer;
			})
			.then((reply) => {
				// send reply
				if (connection.readyState === connection.OPEN) {
					connection.send(reply);
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
			
			// leave procedure (just leave from the connected sockets, not from the lobby)
			if (lobby !== undefined && player !== undefined)
			{
				const lobbyObj= findLobby(lobby);
				lobbyObj?.disconnect(player);
			}

			console.log(`Client ${clientIP} disconnected - Code: ${code}, Reason: ${reason?.toString() || 'none'}`);
		});
	});
});

/* =============== LobbiesManager =============== */

function LobbiesManager()
{
	// check for lobbies to delete
	/* a lobby should be deleted if:
		- All players left
		- No player joined after game (timeout)
		- All player disconnected (timeout)
		If a game is finished a messagge should be sent
		to the Lobby and Match History services */
	lobbies.forEach((entry, id) => {

		// for convenience
		const { lobby } = entry;
	 
		// check if all players left
		if (lobby.empty()) {
			deleteLobby(id);
			return ;
		}

		// check if at least one player is connected
		const hasConnectedPlayer = Array
			.from(lobby.players.values())
			.some(p => p.status === 'connected');
		
		// if not decrement 'timeout'
		if (hasConnectedPlayer) entry.timeout = TIMEOUT;
		else if (lobby.ingame === false) entry.timeout--; 

		// if timeout is passed, delete the game
		if (entry.timeout === 0) {
			deleteLobby(id);
		}
	});
}

/* ============================================= */

/* ------------------------------------------ */

import { VERSION } from './bunny.js';

const start = async () => {
	try {

		// register to bunny service
		if (await bunnyRegister() === false) throw 'Failed to register';

		// subscribe to bunny queues
		if (await bunnySubscribe([ 'game', 'lobby', 'bot' ]) === false) throw 'Failed to subscribe';

		// start fastify server
		await fastify.listen({ port: PORT, host: '0.0.0.0' });
		
		// logging version for info and compatibility
		console.log(`Server running on http://localhost:${PORT}`);
		console.log('Bunny version:', VERSION);

	} catch (err) {
		console.log(err);
		fastify.log.error(err);
		process.exit(1);
	}

	// routine check (once every second)
	setInterval(() => {
		// removes lobbies
		LobbiesManager();
	})
};

// entrypoint
start();