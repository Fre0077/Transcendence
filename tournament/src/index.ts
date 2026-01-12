import Fastify from 'fastify';
import { Tournament } from './Tournament.js'
import type { WebSocket } from "ws";


// Where the Queue will listen
const PORT = Number(process.env.PORT) || 3032;
export const BUNNYURL = process.env.BUNNYURL ?? 'http://localhost:3030';
export const MYURL = process.env.MYURL ?? `http://localhost:${PORT}`;
export const MYPASS = process.env.MYPASS ?? 'password';

// service varaibles
const TIMEOUT:number = 120;	// timeout in seconds to wait before deleting the lobby

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
		if (queue === 'history') {
			const message = await bunnyGet('history');
			const msg = Object(message);

			/* {
				game: 'pong',
				ID: gameID,
				winner: [game.players[winner]],
				players: game.players.map(player => player.ID)
			} */

			// check if we got the ID, the winner and the score
			if (!("ID" in msg)
				|| typeof msg.ID !== "string"
				|| !("winner" in msg)
				|| !Array.isArray(msg.winner)
				|| !msg.winner.every((n:unknown) => typeof n === "string")
				|| !("score" in msg)
				|| !Array.isArray(msg.score)
				|| !msg.score.every((n:unknown) => typeof n === "number"))
			{
				console.log('Invalid JSON (with successful get)', message);
				// throw 'Invalid JSON (with successful get)';
				return { status: 'ko' };
			}
			
			// finds the tournament the game belongs to
			const tournament = findTournament((t:Tournament<WebSocket>) => {
				return t.game(msg.ID);
			})

			// finalize the room
			if (tournament !== undefined) {
				tournament.finalizeRoom(msg.winner, msg.score);
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
	return reply.sendFile('fastify_tournament.html');
});

// serving pong test html
fastify.get('/pong', async (request, reply) => {
	request; // ignore
	return reply.sendFile('fastify_pong.html');
});

/* ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! */







const sendgame = async (gameid:string, players:string[]): Promise<boolean> => {
	// signal the GameService to create a Game
	return bunnyPublish('game', { ID: gameid, players: players });
} 



/* ----------- LOBBY DataBase ---------- */
let tournaments:Map<string, { tournament:Tournament<WebSocket>, timeout:number}> = new Map();

export function createTournament(/* game:string,  */size:number = 4): Tournament<WebSocket>
{
	const tournament:Tournament<WebSocket> = new Tournament(sendgame, size);

	// #debug
	console.log(`Creating tournament ${tournament.ID} ...`);

	tournaments.set(tournament.ID, { tournament: tournament, timeout: TIMEOUT });
	return tournament;
}

/* export function findLobby(ID:string): Tournament<WebSocket> | undefined
{
	return lobbies.get(ID)?.lobby;
} */

export function findTournament(fn: (tournament:Tournament<WebSocket>) => boolean): Tournament<WebSocket> | undefined
{
	for (const { tournament } of tournaments.values()) {
		if (fn(tournament) === true) return tournament;
	}
	return undefined;
}

export function joinTournament(ID:string, playerID:string, ws:WebSocket)
{
	// check if lobby is present
	const e = tournaments.get(ID);
	if (e === undefined) return;

	// join lobby
	const { tournament } = e;
	tournament.join(playerID, ws);
}

// set's the update property to true, meaning that the state was updated
/* function updateTournament(ID:string)
{
	const e = lobbies.get(ID);
	if (e === undefined) return;

	e.update = true;
} */

export function deleteTournament(ID:string, reason:string | void)
{
	if (!tournaments.has(ID)) return;

	// #debug
	console.log(`Deleting tournament ${ID}, reason: '${reason}' ...`);

	tournaments.delete(ID);
}












import { interpreter } from './interpreter.js';

// WebSocket route handler
fastify.register(async function (fastify) {
	fastify.get('/tournamentsocket', { websocket: true }, (connection, request) => {

		// Logging the connection
		const clientIP = request.socket.remoteAddress;
		console.log(`Client connected from ${clientIP}`);

		// playerID not verified with JWT yet
		let player:string | undefined = undefined;
		// lobbyID
		let tournament:string | undefined = undefined;

		// Send welcome message
		connection.send('Connected to Fastify WebSocket server!');

		// Handle incoming messages
		connection.on('message', (message:string) => {
			
			interpreter(message, tournament, player, connection, (retLobby:string | undefined, retPlayer:string | undefined) => {
				// new stuff on lobby
				// if (retUpdate === true) {	/* #ugly */
				// 	if (lobby !== undefined) updateLobby(lobby);
				// 	else if (retLobby !== undefined) updateLobby(retLobby);
				// }

				tournament = retLobby;
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
			if (tournament !== undefined && player !== undefined)
			{
				const tournamentObj:Tournament<WebSocket> | undefined = findTournament((t:Tournament<WebSocket>) => { return t.ID === tournament });
				tournamentObj?.disconnect(player);

				// #debug
				console.log('Disconnecting:',player);
			}

			console.log(`Client ${clientIP} disconnected - Code: ${code}, Reason: ${reason?.toString() || 'none'}`);
		});
	});
});







/* =============== LobbiesManager =============== */

function onlyBots(tournament:Tournament<WebSocket>): boolean
{
	for (const p of tournament.players.values())
	{
		if (p.isBot() === false && p.status !== "left") return false;
	}

	return true;
}

function *getBotRooms(tournament:Tournament<WebSocket>):
	Generator<{ roomkey: string, gameid:string, players:string[] }>
{
	for (const [key, room] of tournament.rooms)
	{
		if (!room.full() || room.ingame === true || room.played === true) continue;

		let allbots = true;
		for (const p of room.players)
		{
			if (!tournament.players.get(p)?.isBot())
			{
				allbots = false;
				break ;
			}
		}

		if (allbots === true) yield { roomkey:key, gameid:room.gameid, players:Array.from(room.players)};
	}
}

// forcefully start a bot room
function startBotRoom(tournament:Tournament<WebSocket>, roomkey:string, gameid:string, players:string[])
{
	// spawn the game
	tournament.forcePlayRoom(roomkey);

	// spawn the bots (As in READY of METHODS.js)
	for (const id of players) {
		if (id.startsWith('BOT')) {
			bunnyPublish('bot', {
				method: 'CREATE',
				game: 'pong', 				// #todo: flexible
				gameid: gameid,
				botid: id,
				level: Number(id.substring(id.lastIndexOf('_') + 1))
			});
		}
	}
}

// loops asyncronously
function LobbiesManager()
{
	setTimeout(() => {
		// check for lobbies to delete
		/* a lobby should be deleted if:
			- All players left
			- No player joined after game (timeout)
			- All player disconnected (timeout)
			If a game is finished a messagge should be sent
			to the Lobby and Match History services */
		// check if the lobby state was updated
		tournaments.forEach((entry, id) => {

			// for convenience
			const { tournament } = entry;
		
			// handle only-bot rooms
			for (const botroom of getBotRooms(tournament)) {
				startBotRoom(tournament,
					botroom.roomkey,
					botroom.gameid,
					botroom.players);
			}

			/* --- DELETE logic --- */
			// check if all players left
			if (tournament.empty()) {
				deleteTournament(id, 'empty');
				return ;
			}

			if (onlyBots(tournament)) {
				deleteTournament(id, 'only-bots');
				return ;
			}

			// check if at least one player is connected
			const hasConnectedPlayer = Array
				.from(tournament.players.values())
				.some(p => p.status !== 'disconnected');
			
			// if not decrement 'timeout'
			if (hasConnectedPlayer) entry.timeout = TIMEOUT;
			else entry.timeout--; 

			// if timeout is passed, delete the game
			if (entry.timeout === 0) {
				deleteTournament(id, 'timeout');
			}

			/* --- UPDATE logic --- */
			// if (entry.update === true) {
			// 	console.log('Broadcasting Lobby');
			// 	lobby.broadcast(lobby.stateJSON);
			// 	entry.update = false;
			// }
		});

		// loop
		LobbiesManager();
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
		if (await bunnySubscribe([ 'game', 'history', 'bot' ]) === false) throw 'Failed to subscribe';

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
	LobbiesManager();
};

// entrypoint
start();