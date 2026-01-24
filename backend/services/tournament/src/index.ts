import Fastify from 'fastify';
import fastifyMetrics from "fastify-metrics";
import { Tournament } from './classes/Tournament.js'
import type { WebSocket } from "ws";


// Where the Queue will listen
const PORT = Number(process.env.PORT) || 3032;
export const BUNNYURL = process.env.BUNNYURL ?? 'http://ft_bunny:3030';
export const MYURL = process.env.MYURL ?? `http://tournament:${PORT}`;
export const MYPASS = process.env.MYPASS ?? 'password';

// per controllare che i messaggi vengano dal gateway
const GATEWAY_SECRET = process.env.GATEWAY_SECRET ?? 'biscottini';

// service varaibles
const TIMEOUT:number = 120;	// timeout in seconds to wait before deleting the lobby

// bunny client
import { bunnyRegister, bunnySubscribe, bunnyGet, bunnyPublish } from './bunny.js'

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

		// gets the message
		const message = await bunnyGet(queue);

		// a new message in history means the match concluded
		if (queue === 'history') {
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
				|| !msg.score.every((n:unknown) => typeof n === "number"))			{
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
				tournament.finalizeRoom(msg.ID, msg.winner, msg.score);
			}
			
			// successful get
			return { status: 'ok' };
		}

		// a new message in tournament means the match was aborted
		if (queue === 'tournament') {
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

			// successfully finished games reaad from history
			if (msg.status === 'finished') return ;

			/* #debug */
			console.log('Searching room of', msg.gameID);

			// find the tournament
			const tournament = findTournament((t:Tournament<WebSocket>) => {
				return t.game(msg.gameID);
			})

			// kill the room
			if (tournament !== undefined) {

				/* #debug */
				console.log('Killing room');
			
				tournament.killRoom(msg.gameID);
			}


			// successful get
			return { status: 'ok' };
		}

		// not expected
		return { status: 'ko' };
	}
);

/* ============================================== */















const spawngame = async (gameid:string, players:string[], metadata:any): Promise<boolean> => {
	// signal the GameService to create a Game
	return bunnyPublish('game', {
		ID: gameid,
		players: players,
		metadata: metadata
	});
}

const spawnbot = async (/* game:string */gameid:string, botid:string): Promise<boolean> => {
	// signal the GameService to create a Game
	return bunnyPublish('bot', {
		method: 'CREATE',
		game: 'pong', 				// #todo: flexible
		gameid: gameid,
		botid: botid,
		level: Number(botid.substring(botid.lastIndexOf('_') + 1))
	});
} 



/* ----------- LOBBY DataBase ---------- */
let tournaments:Map<string, { tournament:Tournament<WebSocket>, timeout:number}> = new Map();

export function createTournament(/* game:string,  */ size:number = 4, format:string = 'single-elimination'): Tournament<WebSocket> | undefined
{
	let tournament:Tournament<WebSocket> | undefined = undefined;

	try
	{
		tournament = new Tournament(spawngame, spawnbot, size, 2, format);

	} catch (err) {
		console.log('Error while creating tournament');
		return undefined;
	}

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

	// get the tournament status
	ws.send(tournament.stateJSON);
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
	fastify.get('/ws', { websocket: true }, (connection, request) => {

		// Logging the connection
		const clientIP = request.socket.remoteAddress;
		console.log(`Client connected from ${clientIP}`);


		/* --------- CHECK AUTH --------- */
		const userid = request.headers['x-user-id'] as string;
  		const secret = request.headers['x-gateway-secret'];

		if (!userid || secret !== GATEWAY_SECRET) {
			connection.close(1008, "Invalid user authentication");
			return ;
		}

		/* --------- AUTO JOIN  --------- */

		const checktour = findTournament((t) => t.has(userid));
		checktour?.join(userid, connection);

		/* ------------------------------ */

		// playerID not verified with JWT yet
		const player:string = userid;
		// lobbyID
		let tournament:string | undefined = checktour?.ID;

		// Send welcome message
		connection.on('open', () => {
			connection.send('Connected to Tournament WebSocket server!');
		});

		// Handle incoming messages
		connection.on('message', (message:string) => {
			
			interpreter(message, tournament, player, connection, (retlobby:string | undefined) => {

				tournament = retlobby;
				// player = retPlayer;
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







/* =============== TournamenntsManager =============== */

function onlyBots(tournament:Tournament<WebSocket>): boolean
{
	for (const p of tournament.players.values())
	{
		if (p.isBot() === false && p.status !== "left") return false;
	}

	return true;
}

function *startedRooms(tournament:Tournament<WebSocket>): Generator<{ roomkey:string, gameid:string }>
{
	for (const [id, room] of tournament.rooms)
	{
		// room is started
		if (room.tosend === true)
		{
			room.tosend = false;
			yield { roomkey:id, gameid:room.gameid };
		}
	}
}

// loops asyncronously
function TournamentsManager()
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

			/* --- START LOGIC --- */
			for (const {roomkey, gameid} of startedRooms(tournament)) {
				const reply:string = JSON.stringify({ method: 'START_REPLY', status: 'success', value: gameid, comment: "The room is now in game"});
				tournament.roomcast(roomkey, reply);
			}

			/* --- DELETE logic --- */
			// check if all players left
			if (tournament.empty()) {
				deleteTournament(id, 'empty');
				return ;
			}

			// check if only bots in tournament
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
		});

		// loop
		TournamentsManager();
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
		if (await bunnySubscribe([ 'tournament', 'game', 'history', 'bot' ]) === false) throw 'Failed to subscribe';

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
	TournamentsManager();
};

// entrypoint
start();