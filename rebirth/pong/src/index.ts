import Fastify from 'fastify';
import { Game } from './Game.js'
// import type { WebSocket } from "ws";


// Where the Queue will listen
const PORT = Number(process.env.PORT) || 3032;
export const BUNNYURL = process.env.BUNNYURL ?? 'http://localhost:3030';
export const MYURL = process.env.MYURL ?? 'http://localhost:3032';
export const MYPASS = process.env.MYPASS ?? 'password';

// bunny client
import { bunnyRegister, bunnySubscribe, bunnyGet, bunnyPublish } from './bunny.js'

// service varaibles
const TIMEOUT:number = 10;	// timeout in seconds to wait before deleeting the game
const FPS:number = 60;

/* ------- LOAD STUFF ------- */
const fastify = Fastify({ 
	logger: false //too much stuff... 
});

// Register WebSocket plugin
await fastify.register(import('@fastify/websocket'));

// Health-check endpoint (server-side)
fastify.get('/health', async () => ({ status: 'ok' }));




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
		if (queue === 'game') {
			const message = await bunnyGet('game');
			const msg = Object(message);

			// check if we got the gameID ad the players
			if ("ID" in msg === false
				|| typeof msg.ID !== "string"
				|| "players" in msg === false
				|| Array.isArray(msg.players) === false
				|| !msg.players.every((p: unknown) => typeof p === "string"))
			{
				console.log('Invalid JSON (with successful get)', message);
				// throw 'Invalid JSON (with successful get)';
				return { status: 'ko' };
			}

			createGame(msg.ID, msg.players);
		}
		return { status: 'ok' };
	}
);

/* ============================================== */






/* ----------- GAMES DataBase ---------- */

type Player = {
	ID:string;
	idx:number;
	status: "connected" | "disconnected" | "left";
}

let games:Map<string, {game: Game, players:Player[], timeout:number }> = new Map();

export function createGame(ID:string, playerIDs:string[]): Game
{
	// #debug
	console.log(`Creating game ${ID} ...`);

	const players = Array.from(playerIDs, (playerID, idx) => ({
		ID: playerID,
		idx: idx,
		status: "disconnected" as "connected" | "disconnected" | "left"
	}));

	const game:Game = new Game();
	games.set(ID, { game: game, players: players, timeout:TIMEOUT });
	return game;
}

export function findGame(ID:string, playerID:string | void): {game: Game | undefined, player:Player | undefined}
{
	// check if game is there
	const game = games.get(ID);
	if (game === undefined) return { game: undefined, player: undefined };

	// check if also the player is asked
	if (!playerID) return { game: game.game, player: undefined };

	// check if player is there
	const player = game.players.find(p => p.ID === playerID);
	if (player === undefined) return { game: game.game, player: undefined };

	// return the player
	return { game: game.game, player: player };
}

export function joinGame(ID:string, playerID:string): { status:"success" | "failure", reason:string }
{
	// check if game with ID is found
	const game = games.get(ID);
	if (game === undefined) {
		return {
			status: "failure",
			reason: "Game not found"
		};
	}

	// check if player is expected
	const player = game.players.find(p => p.ID === playerID);
	if (player === undefined) {
		return {
			status: "failure",
			reason: "Player not expected"
		};
	}

	// start game if first player
	if (game.players.find(p => p.status === "connected") === undefined) {
		console.log(`Starting game ${ID} ...`);
		game.game.start();
	}

	// set status to connected
	player.status = "connected";
	return {
		status: "success",
		reason: "Player joined successfully"
	};
}

export function leaveGame(ID:string, playerID:string): { status:"success" | "failure", reason:string }
{
	// check if game with ID is found
	const game = games.get(ID);
	if (game === undefined) {
		return {
			status: "failure",
			reason: "Game not found"
		};
	}

	// check if player is expected
	const player = game.players.find(p => p.ID === playerID);
	if (player === undefined) {
		return {
			status: "failure",
			reason: "Player not expected"
		};
	}

	// set status to disconnected
	player.status = "left";
	return {
		status: "success",
		reason: "Player left successfully"
	};
}

export function deleteGame(ID:string)
{
	// check if game is present
	const game = games.get(ID);
	if (game === undefined) return;

	// check if game is finished
	const winner = game.game.end();
	if (winner !== 0) bunnyPublish('history', {
		ID: ID,
		winner: game.players[winner],
		players: Array.from(game.players, (ID) => {
			ID
		})
	});

	// send to lobby that all the players left the game
	bunnyPublish('lobby', {
		gameID: ID,
		status: 'finished'
	});

	console.log(`Deleting game ${ID} ...`);
	games.delete(ID);
}












import { interpreter } from './interpreter.js';

// WebSocket route handler
fastify.register(async function (fastify) {
	fastify.get('/gamesocket', { websocket: true }, (connection, request) => {

		// Logging the connection
		const clientIP = request.socket.remoteAddress;
		console.log(`Client connected from ${clientIP}`);

		// playerID not verified with JWT yet
		let playerID:string | undefined = undefined;
		// gameID
		let gameID:string | undefined = undefined;
		// bot interval
		let interval:NodeJS.Timeout;	/* :D */

		// Send welcome message
		connection.send('Connected to Fastify WebSocket server!');

		// Handle incoming messages
		connection.on('message', (message:string) => {
			
			interpreter(message, gameID, playerID, (retGame:string | undefined, retPlayer:string | undefined) => {
				gameID = retGame;
				playerID = retPlayer;
			})
			.then((reply) => {
				// check if no reply needed
				if (reply === "no-reply") return;
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
			// kill the spammer
			if (interval) clearInterval(interval);

			// disconnect procedure (just leave from the connected sockets, not from the lobby)
			if (gameID !== undefined && playerID !== undefined) {
				const { player } = findGame(gameID, playerID);

				if (player !== undefined) {
					player.status = "disconnected";
					console.log(player);
				}
			}

			console.log(`Client ${clientIP} disconnected - Code: ${code}, Reason: ${reason?.toString() || 'none'}`);
		});

		// send gamestate to frontend 'FPS' times per second
		interval = setInterval(() => {
			// Don't send gamestate if the game isn't found
			if (gameID === undefined) return;
			const { game } = findGame(gameID);
			if (game === undefined) return;

			if (connection.readyState === connection.OPEN) {
				connection.send(game.stateJSON);
			}

		}, 1000 / FPS);	// FPS (delay in ms)
		
	});
});


/* =============== GamesManager =============== */

function GamesManager()
{
	// check for games to delete
	/* a game should be deleted if:
		- All players left
		- No player joined (timeout)
		- All player disconnected (timeout)
		If a game is finished a messagge should be sent
		to the Lobby and Match History services */
	games.forEach((game, id) => {

		// for convenience
		const { players } = game;

		// #debug
		if (game.timeout !== TIMEOUT) console.log(id, game.timeout);

		// check if all players left
		if (players.find(p => p.status !== "left") === undefined) {
			deleteGame(id);
			return ;
		}

		// check if at leas one player is connected
		if (players.find(p => p.status === "connected") !== undefined)
			game.timeout = TIMEOUT;
		else {
			game.timeout -= 1;
		}

		// if timeout is passed, delete the game
		if (game.timeout === 0) {
			deleteGame(id);
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
		if (await bunnySubscribe([ 'game', 'lobby', 'history' ]) === false) throw 'Failed to subscribe';

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
	setInterval((() => {
		// adds/removes games
		GamesManager();

	}), 1000);

};

// entrypoint
start();