import Fastify from 'fastify';
import fastifyMetrics from "fastify-metrics";
import { Game/* , Player */ } from './classes/Game.js'
import { WebSocket } from "ws";

// Where the Queue will listen
const PORT = Number(process.env.PORT) || 3040;
export const BUNNYURL = process.env.BUNNYURL ?? 'http://ft_bunny:3030';
export const MYURL = process.env.MYURL ?? `http://pong:${PORT}`;
export const MYPASS = process.env.MYPASS ?? 'password';

// gateway auth
const GATEWAY_SECRET = process.env.GATEWAY_SECRET ?? 'biscottini';

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

// Metrics - Register BEFORE routes
fastify.register(fastifyMetrics.default, {
    endpoint: '/metrics'
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

		// gets the message
		const message = await bunnyGet(queue);

		// a new message in game means new game to create
		if (queue === 'game') {
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

// export type Player = {
// 	ID:string;
// 	idx:number;
// 	status: "connected" | "disconnected" | "left";
// }

export type GameEntry = {
	game: Game,
	// players:Player[],
	timeout:number,
	metadata:any
}

const games:Map<string, GameEntry> = new Map();

export function createGame(gameid:string, playerid:string[], metadata: any): Game
{
	// #debug
	console.log(`Creating game ${gameid} with players ${playerid}...`);

	const players = Array.from(playerid, (id, idx) => ({
		ID: id,
		idx: idx,
	}));

	const game:Game = new Game(players);
	games.set(gameid, { game: game, /* players: players, */ timeout:TIMEOUT, metadata:metadata });
	return game;
}

// checks if a player is expected in a game, if so returns the gameid
function findGameOf(playerid:string): Game | undefined
{
	// for (const entry of games.values()) {
	// 	if (entry.game.has(playerid) !== undefined) return entry.game;
	// }


	// find all games im in
	const mygames = Array.from(games.values()).map((entry) => {
		if (entry.game.players.find(p => p.ID === playerid)) return entry.game
		else return null;
	}).filter((game): game is Game => game !== null);


	// check length
	if (mygames.length === 1) {return mygames[0];}
	else if (mygames.length > 1)
	{
		// leave all games but the last one
		for (let i = 0; i < mygames.length; ++i)
			if (i != mygames.length - 1) mygames[i].leave(playerid);

		// return the last one game
		return mygames[mygames.length - 1];
	}

	return undefined;
}

// export function findPlayer(fn: (players:Player[]) => boolean): { ID:string, game:Game, players:Player[]} | undefined
// {
// 	for (const [ID, { game } ] of games) {
// 		if (fn(game.players) === true) return { ID:ID, game:game, players:game.players};
// 	}
// 	return undefined;
// }

// export function joinGame(gameid:string, playerid:string, listener:(state:string) => void): { status:"success" | "failure", reason:string }
// {
// 	// check if game with ID is found
// 	const entry = games.get(gameid);
// 	if (entry === undefined) {
// 		return {
// 			status: "failure",
// 			reason: "Game not found"
// 		};
// 	}

// 	// for convenience
// 	const { game } = entry;
	
// 	// check if player is expected
// 	const player = entry.players.find(p => p.ID === playerid);
// 	if (player === undefined) {
// 		return {
// 			status: "failure",
// 			reason: "Player not expected"
// 		};
// 	}

// 	// remove listener if another socket is connected
// 	// #todo inndagare sul perche' dei multi socket
// 	if (player.status === 'connected') game.unsubscribe(playerid);

// 	// adds notify callback for game-state update
// 	game.subscribe(playerid, listener);

// 	// start game if first player
// 	if (entry.players.find(p => p.status === "connected") === undefined) {
// 		console.log(`Starting game ${gameid} ...`);
// 		entry.game.start();
// 	}

// 	// set status to connected
// 	player.status = "connected";
// 	return {
// 		status: "success",
// 		reason: "Player joined successfully"
// 	};
// }

// export function leaveGame(game:Game, playerid:string): { status:"success" | "failure", reason:string }
// {

// 	// check if player is expected
// 	const player = game.players.find(p => p.ID === playerid);
// 	if (player === undefined) {
// 		return {
// 			status: "failure",
// 			reason: "Player not expected"
// 		};
// 	}

// 	// remove listener
// 	game.unsubscribe(playerid);

// 	// set status to disconnected
// 	player.status = "left";

// 	// successful return
// 	return {
// 		status: "success",
// 		reason: "Player left successfully"
// 	};
// }

export function deleteGame(gameid:string, reason:string | void)
{
	// check if game is present
	const entry = games.get(gameid);
	if (entry === undefined) return;

	// check if game is finished
	const winner = entry.game.end();

	// #todo send to RabbitMQ and ft_bunny
	if (winner !== -1)
	{
		// create player array based on Player.idx
		const players = entry.game.players.sort((a, b) => a.idx - b.idx).map(p => p.ID);

		// what will be sent to RabbitMQ and ft_bunnyMQ @ecarbona
		const history = {
			game: 'pong',
			ID: gameid,
			winner: [entry.game.players[winner].ID],
			players: players,
			score: entry.game.state.score,
			replay: entry.game.replay,
			metadata: entry.metadata
		}

		// #todo send to RabbitMQ and ft_bunny
		bunnyPublish('history', history);
	}

	// send to lobby that all the players left the game
	// #outdated, let lobby read from history
	if (entry.metadata.origin && typeof entry.metadata.origin === "string") {
		bunnyPublish(entry.metadata.origin, {
			gameID: gameid,
			status: reason
		});
	}

	// close all sockets
	entry.game.close();

	// delete the game
	console.log(`Deleting game ${gameid}, reason: '${reason}' ...`);
	games.delete(gameid);
}













import { interpreter } from './interpreter.js';

function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// Websocket rout handler
fastify.register(async function (fastify) {

	/* === PLAYERS ENDPOINT === */
	fastify.get('/play', { websocket: true }, async (connection, request) => {

		// Logging the connection
		const clientIP = request.socket.remoteAddress;
		console.log(`New connection from ${clientIP}`);
		


		/* --------- CHECK AUTH --------- */
		const userid = request.headers['x-user-username'] as string;	// dangerous?
		const secret = request.headers['x-gateway-secret'];
		
		if (!userid || secret !== GATEWAY_SECRET) {
			console.log('Invalid user authentication', userid);
			connection.close(1008, "Invalid user authentication");
			return ;
		}
		/* ----- CHECK if EXPECTED ----- */

		let gamecheck;
		for (let i = 0; i < 3; i++) {
			gamecheck = findGameOf(userid);
			if (gamecheck) {break ;}
			await sleep(100);
		};
		if (!gamecheck) {
			console.log('Game not found', userid);
			connection.close(3000, "Game not found");
			return ;
		}

		/* --------- AUTO JOIN --------- */
		// listener for updates on the gamestate
		const listener = (state:string) => {
			if (state === "close") {
				connection.close(undefined, "Game closed");
			}
			else if (connection.readyState === WebSocket.OPEN) {
				connection.send(state);
			}
		};

		// join game
		gamecheck.subscribe(userid, listener);
		// start game (double start protected)
		gamecheck.start();

		/* ----------------------------- */




		/* #debug */
		console.log(`Client '${userid} 'connected from ${clientIP}`);

		// playerID not verified with JWT yet
		const playerid:string = userid;
		// game reference
		const game:Game = gamecheck;
		



		// Handle incoming messages
		connection.on('message', (message:string) => {
			
			interpreter(message, game, playerid)
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

			// remove listener
			game.unsubscribe(playerid);

			// close socket
			connection.close(1006, error);
		});

		// Handle connection close
		connection.on('close', (code:number, reason:string) => {
			console.log(`Client ${clientIP} disconnected - Code: ${code}, Reason: ${reason?.toString() || 'none'}`);

			// remove listener
			game.unsubscribe(playerid);
		});
	});





	/* === SPECTATORS ENDPOINT === */
	fastify.get('/spectate', { websocket: true }, (connection, request) => {
		
		// Logging the connection
		const clientIP = request.socket.remoteAddress;
		console.log(`New connection from ${clientIP}`);
		


		/* --------- CHECK AUTH --------- */
		const userid = request.headers['x-user-username'] as string;	// dangerous?
		const secret = request.headers['x-gateway-secret'];
		
		if (!userid || secret !== GATEWAY_SECRET) {
			console.log('Sus player', userid);
			connection.close(1008, "Invalid user authentication");
			return ;
		}

		let match:Game | undefined = undefined;

		// timeout for disconnection (1s)
		setTimeout(() => {
			if (match !== undefined) return ;
			connection.close(3008, "Didn't send the 'matchid' in time");
		}, 1000);

		// receive the matchid
		connection.on('message', (message:string) => {

			try
			{
				/* ------- CHECK GAMEID ------- */

				const { matchid } = JSON.parse(message);

				if (!matchid) {
					console.log('Forgot matchid for', userid);
					connection.close(3001, "Missing matchid");
					return ;
				}

				/* -------- FIND GAME -------- */
				const entry = games.get(matchid);
				if (!entry) {
					console.log('Game not found', userid);
					connection.close(3000, "Game not found");
					return ;
				}
				/* -------- JOIN GAME -------- */

				// save game
				match = entry.game;

				// listener for updates on the gamestate
				const listener = (state:string) => {
					if (state === "close") {
						connection.close(undefined, "Game closed");
					}
					else if (connection.readyState === WebSocket.OPEN) {
						connection.send(state);
					}
				};

				// add listener, even if not expected AS PLAYER
				entry.game.subscribe(userid, listener);
				/* --------------------------- */
			}
			catch (err)
			{
				console.log('Error while connecting the spectator socket');
				connection.close(1011, "Internal server error");
				return ;
			}
		})

		// Handle connection close
		connection.on('close', (code:number, reason:string) => {
			console.log(`Client ${clientIP} disconnected - Code: ${code}, Reason: ${reason?.toString() || 'none'}`);
			
			// remove listener
			if (match) match.unsubscribe(userid);
		});
	
		// Handle WebSocket errors
		connection.on('error', (error:string) => {
			console.error(`WebSocket error for ${clientIP}:`, error);

			// remove listener
			if (match) match.unsubscribe(userid);
			// close socket
			connection.close(1006, error);
		});

	});

	/* === REPLAY ENDPOINT === */
	fastify.get('/replay', { websocket: true }, (connection, request) => {
		
		// Logging the connection
		const clientIP = request.socket.remoteAddress;
		console.log(`New connection from ${clientIP}`);


		/* --------- CHECK AUTH --------- */
		const username = request.headers['x-user-username'] as string;	// dangerous?
		const secret = request.headers['x-gateway-secret'];
		
		if (!username || secret !== GATEWAY_SECRET) {
			console.log('Sus player', username);
			connection.close(1008, "Invalid user authentication");
			return ;
		}

		// replay game
		let game:Game | undefined = undefined;

		// timeout for disconnection (1s)
		setTimeout(() => {
			if (game !== undefined) return ;
			connection.close(3008, "Didn't send the 'replaystring' in time");
		}, 1000);

		// expect the replay string
		connection.on('message', (message:string) => {

			try
			{
				/* ------- CHECK REPLAY ------- */

				const replay = JSON.parse(message);

				// check for replay basics
				if (!replay.players || !replay.directions || !replay.moves) {
					console.log('Wrongly formatted replay', replay);
					connection.close(3001, "Wrongly formatted replay");
					return ;
				} 

				/* -------- BUILD GAME -------- */
				
				const players = Array.from(replay.players, (id, idx) => ({
					ID: id as string,	// trust me bro ;P
					idx: idx,
				}));

				// create game
				game = new Game(players, true);

				// set the directions
				game.setDirections(replay.directions);

				// set the moves to play
				game.setMoves(replay.moves);

				// listener sends board updates to the frontend
				const listener = (state:string) => {
					if (state === "close") {
						connection.close(undefined, "Game closed");
					}
					else if (connection.readyState === WebSocket.OPEN) {
						connection.send(state);
					}
				};

				// add listener, even if not expected AS PLAYER
				game.subscribe(username, listener);

				// start the game
				game.start();
				/* --------------------------- */
			}
			catch (err)
			{
				console.log('Error while connecting the spectator socket');
				connection.close(1011, "Internal server error");
				return ;
			}
		})

		// Handle connection close
		connection.on('close', (code:number, reason:string) => {
			console.log(`Client ${clientIP} disconnected - Code: ${code}, Reason: ${reason?.toString() || 'none'}`);
		
			// remove listener
			game?.unsubscribe(username);

			// stop game
			game?.stop();
		});
	
		// Handle WebSocket errors
		connection.on('error', (error:string) => {
			console.error(`WebSocket error for ${clientIP}:`, error);

			// close socket
			connection.close(1006, error);
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
			const { game } = entry;
			const players = game.players;

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
			// #todo on BOT-Update needs a safe way to know if an user is a bot
			if (players.find(p => !p.ID.startsWith('BOT'))	// allow only-bot games
				&& players.find(p => !p.ID.startsWith('BOT') && p.status !== "left") === undefined) {
				deleteGame(id, 'all players left');
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
		if (await bunnySubscribe([ 'game', 'tournament', 'lobby', 'history' ]) === false) throw 'Failed to subscribe';

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