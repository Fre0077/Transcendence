import Fastify from 'fastify';
import { Game } from './Game.js'
import { WebSocket } from "ws";


// Where the Queue will listen
const PORT = Number(process.env.PORT) || 3040;
export const BUNNYURL = process.env.BUNNYURL ?? 'http://ft_bunny:3030';
export const MYURL = process.env.MYURL ?? `http://pong:${PORT}`;
export const MYPASS = process.env.MYPASS ?? 'password';

// bunny client
import { bunnyRegister, bunnySubscribe, bunnyGet, bunnyPublish } from './bunny.js'

// service varaibles
const TIMEOUT:number = 10;	// timeout in seconds to wait before deleting the game
const INACTIVE_TIMEOUT:number = 1 * 60 * 1000;	// timeout in millisecond to wait before deleting the game (player inactivity)
// const FPS:number = 60;

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
			if (!("ID" in msg)
				|| typeof msg.ID !== "string"
				|| !("players" in msg)
				|| Array.isArray(msg.players) === false
				|| !msg.players.every((p: unknown) => typeof p === "string")
				/* new metadata */
				|| !("metadata" in msg))
			{
				console.log('Invalid JSON (with successful get)', message);
				// throw 'Invalid JSON (with successful get)';
				return { status: 'ko' };
			}

			createGame(msg.ID, msg.players, msg.metadata);
		}
		return { status: 'ok' };
	}
);

/* ============================================== */






/* ----------- GAMES DataBase ---------- */

export type Player = {
	ID:string;
	idx:number;
	status: "connected" | "disconnected" | "left";
}

let games:Map<string, {game: Game, players:Player[], timeout:number, metadata:any }> = new Map();

export function createGame(gameID:string, playersID:string[], metadata: any): Game
{
	// #debug
	console.log(`Creating game ${gameID} ...`);

	const players = Array.from(playersID, (id, idx) => ({
		ID: id,
		idx: idx,
		status: "disconnected" as "connected" | "disconnected" | "left"
	}));

	const game:Game = new Game(players.map(({ idx, ID }) => ({ idx, ID })));
	games.set(gameID, { game: game, players: players, timeout:TIMEOUT, metadata:metadata });
	return game;
}

export function findGame(gameID:string, playerID:string | void): {game: Game | undefined, player:Player | undefined}
{
	// check if game is there
	const game = games.get(gameID);
	if (game === undefined) return { game: undefined, player: undefined };

	// check if also the player is asked
	if (!playerID) return { game: game.game, player: undefined };

	// check if player is there
	const player = game.players.find(p => p.ID === playerID);
	if (player === undefined) return { game: game.game, player: undefined };

	// return the player
	return { game: game.game, player: player };
}

export function findPlayer(fn: (players:Player[]) => boolean): { ID:string, game:Game, players:Player[]} | undefined
{
	for (const [ID, { game, players } ] of games) {
		if (fn(players) === true) return { ID:ID, game:game, players:players};
	}
	return undefined;
}

export function joinGame(gameID:string, playerID:string, listener:(state:string) => void): { status:"success" | "failure", reason:string }
{
	// check if game with ID is found
	const entry = games.get(gameID);
	if (entry === undefined) {
		return {
			status: "failure",
			reason: "Game not found"
		};
	}

	// for convenience
	const { game } = entry;
	
	// check if player is expected
	const player = entry.players.find(p => p.ID === playerID);
	if (player === undefined) {
		return {
			status: "failure",
			reason: "Player not expected"
		};
	}

	// remove listener if another socket is connected
	// #todo inndagare sul perche' dei multi socket
	if (player.status === 'connected') game.unsubscribe(playerID);

	// adds notify callback for game-state update
	game.subscribe(playerID, listener);

	// start game if first player
	if (entry.players.find(p => p.status === "connected") === undefined) {
		console.log(`Starting game ${gameID} ...`);
		entry.game.start();
	}

	// set status to connected
	player.status = "connected";
	return {
		status: "success",
		reason: "Player joined successfully"
	};
}

export function leaveGame(gameID:string, playerID:string): { status:"success" | "failure", reason:string }
{
	// check if game with ID is found
	const entry = games.get(gameID);
	if (entry === undefined) {
		return {
			status: "failure",
			reason: "Game not found"
		};
	}

	// for convenience
	const { game } = entry;

	// check if player is expected
	const player = entry.players.find(p => p.ID === playerID);
	if (player === undefined) {
		return {
			status: "failure",
			reason: "Player not expected"
		};
	}

	// remove listener
	game.unsubscribe(playerID);

	// set status to disconnected
	player.status = "left";

	// successful return
	return {
		status: "success",
		reason: "Player left successfully"
	};
}

export function deleteGame(gameID:string, reason:string | void)
{
	// check if game is present
	const game = games.get(gameID);
	if (game === undefined) return;

	// check if game is finished
	const winner = game.game.end();

	// what will be sent to RabbitMQ and ft_bunnyMQ @ecarbona
	const history = {
		game: 'pong',
		ID: gameID,
		winner: [game.players[winner].ID],
		players: game.players.map(player => player.ID),
		score: game.game.state.score,
		metadata: game.metadata
	}

	// #todo send to RabbitMQ, not ft_bunny
	if (winner !== -1) bunnyPublish('history', history);

	// send to lobby that all the players left the game
	bunnyPublish('lobby', {
		gameID: gameID,
		status: 'finished'
	});

	// delete the game
	console.log(`Deleting game ${gameID}, reason: '${reason}' ...`);
	games.delete(gameID);
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

		// listener for updates on the gamestate
		const listener = (state:string) => {
			if (connection.readyState === WebSocket.OPEN) {
				connection.send(state);
			}
		};

		// Send welcome message
		connection.send('Connected to Fastify WebSocket server!');

		// Handle incoming messages
		connection.on('message', (message:string) => {
			
			interpreter(message, gameID, playerID, listener, (retGame:string | undefined, retPlayer:string | undefined) => {
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

			// disconnect procedure (just leave from the connected sockets, not from the lobby)
			if (gameID !== undefined && playerID !== undefined) {
				const { game, player } = findGame(gameID, playerID);

				if (player !== undefined) {
					player.status = "disconnected";
					console.log(player);

					// remove listener
					game?.unsubscribe(player.ID);

				}
			}

			console.log(`Client ${clientIP} disconnected - Code: ${code}, Reason: ${reason?.toString() || 'none'}`);
		});
	});
});






/* =============== GamesManager =============== */

function GamesManager()
{
	setTimeout(() => {
		// check for games to delete
		/* a game should be deleted if:
			- All players left
			- No player joined (timeout)
			- All player disconnected (timeout)
			- All players inactive (bigtimeout)
			If a game is finished a messagge should be sent
			to the Lobby and Match History services */
		games.forEach((entry, id) => {

			// for convenience
			const { game, players } = entry;

			// delete game if it's over
			if (game.end() !== -1) {
				deleteGame(id, 'finished');
				return ;
			}
			
			// delete game if inactive
			if (Date.now() - game.lastAction > INACTIVE_TIMEOUT) {
				deleteGame(id, 'inactive');
				return ;
			}

			// #debug
			if (entry.timeout !== TIMEOUT) console.log(id, entry.timeout);

			// check if all players left
			if (players.find(p => p.status !== "left") === undefined) {
				deleteGame(id, 'all player left');
				return ;
			}

			// check if at leas one player is connected
			if (players.find(p => p.status === "connected") !== undefined)
				entry.timeout = TIMEOUT;
			else {
				entry.timeout -= 1;
			}

			// if timeout is passed, delete the game
			if (entry.timeout === 0) {
				deleteGame(id, 'timeout');
			}
		});

		// loop
		GamesManager();
	}, 1000);
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
	// adds/removes games
	GamesManager();

};

// entrypoint
start();