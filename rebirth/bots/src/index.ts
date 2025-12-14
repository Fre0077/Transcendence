import Fastify from 'fastify';
import { PongBot } from './PongBot.js'
import { WebSocket } from "ws";


// Where the Queue will listen
const PORT = Number(process.env.PORT) || 3032;
export const BUNNYURL = process.env.BUNNYURL ?? 'http://localhost:3030';
export const MYURL = process.env.MYURL ?? `http://localhost:${PORT}`;
export const MYPASS = process.env.MYPASS ?? 'password';

// array of games
const GAMEURL = [
	{
		game: 'pong',
		url: process.env.PONGURL ?? 'ws://localhost:3040/gamesocket',
		type: PongBot
	}
];

// service varaibles
// const TIMEOUT:number = 10;	// timeout in seconds to wait before deleeting the game

// bunny client
import { bunnyRegister, bunnySubscribe, bunnyGet } from './bunny.js'

/* ------- LOAD STUFF ------- */
const fastify = Fastify({ 
	logger: false //too much stuff... 
});

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
/* 
{
	method: 'CREATE'
	game: 'pong', 
	gameid: <gameid>,
	botid: id,
}
{
	method: 'DELETE'
	botid: <botid>,
}
*/
fastify.get<{ Querystring: BunnyQuery }>(
	"/bunny",
	async (request) => {
		const { queue } = request.query;

		// a new message in bot means new bot to create
		if (queue === 'bot') {
			const message = await bunnyGet('bot');
			const msg = Object(message);

			// check if the method is present
			if (!("method" in msg) || typeof msg.method !== "string")
				return { status: 'ko' };

							// check if we got a 'create bot' message

			if (msg.method === 'CREATE')
			{
				if (!("game" in msg) || typeof msg.game !== "string"
					|| !("gameid" in msg) || typeof msg.gameid !== "string"
					|| !("botid" in msg) || typeof msg.botid !== "string")
				{
					console.log('Invalid JSON (with successful get)', message);
					// throw 'Invalid JSON (with successful get)';
					return { status: 'ko' };
				}
	
				// check if level is specified
				const level = ("level" in msg && typeof msg.level === "number") ? msg.level : undefined;

				/* Create a bot and join the game */
				createBot(msg.game, msg.botid, msg.gameid, level);

				// successful return
				return { status: 'ok' };
			}
			// check if we got a 'delete bot' message
			else if (msg.method === 'DELETE')
			{
				if (!("botid" in msg) || typeof msg.botid !== "string")
				{
					console.log('Invalid JSON (with successful get)', message);
					// throw 'Invalid JSON (with successful get)';
					return { status: 'ko' };
				}

				/* delete the bot */
				deleteBot(msg.botid);

				// successful return
				return { status: 'ok' };
			}
		}

		// not expected
		return { status: 'ko' };
	}
);

/* ============================================== */











/* ----------- BOT DataBase ---------- */
let bots:Map<string, { bot:PongBot, ws:WebSocket }> = new Map();

export function createBot(gamestr:string, botid:string, gameid:string, level:number | undefined): boolean
{
	let myurl:string | undefined = undefined;
	let bot:any | undefined = undefined;

	// get the URL of the game the bot is supposed to join
	for (const { game, url, type } of GAMEURL)
	{
		if (game === gamestr)
		{
			myurl = url;
			bot = (level === undefined) ? new type() : new type(level);
			break ;
		}
	}

	// no game with said name
	if (myurl === undefined) return false;

	try {
		// #debug
		console.log('Bot connecting to', myurl);

		// create and Socket
		const socket = new WebSocket(myurl);

		// authentication and join game
		socket.on('open', () => {
			socket.send(JSON.stringify({ method: 'AUTH', playerID: botid }));
			socket.send(JSON.stringify({ method: 'JOIN', gameID: gameid }));
		});

		// process incoming messages (just GameState JSON)
		socket.on('message', (message:string) => {
			try
			{
				const msg = Object(JSON.parse(message.toString()));

				// game behaviour depending on wich game is played
				if (!("playing" in msg) || typeof msg.playing !== "boolean"
					|| !("winner" in msg) || typeof msg.winner !== "number")
					throw 'Invalid GameState: ' + message;
			
				// check if game is finished
				if (msg.winner !== -1) {
					socket.close();
					return ;
				}
				
				// check if we are playing
				if (msg.playing === true)
				{
					// calculate the move
					bot.play(msg);
					const move:string = bot.peek();

					// send move to Game
					if (move !== "null" && socket.readyState === WebSocket.OPEN) {
						// sends the move
						socket.send(JSON.stringify({ method: 'MOVE', value: move }));
						// performs the move
						bot.move();
					}
				} else {bot.reset();}	// reset the bot's data

			} catch (err) {
				if (err instanceof SyntaxError) console.log('Error on bot:', 'JSON.parse(): SyntaxError');
				else console.log('Error on bot:', err);
			}

		});

		/* --- Store Bot's variables --- */
		bots.set(botid, { bot:bot, ws:socket });

		// #debug
		console.log(`Created bot ${botid} of level ${level} and connecting to game of \'${gamestr}\' with id`, gameid);

	} catch (err) {
		console.log('Error creating bot', err);
		return false;
	}
	// successful return
	return true;
}

function deleteBot(id:string): boolean
{
	const mybot = bots.get(id);
	if (mybot === undefined) return false;

	// #debug
	console.log(`Deleting bot ${id} ...`);

	// close socket
	mybot.ws.close();

	// remove from bots
	bots.delete(id);

	// success
	return true;
}












/* =============== LobbiesManager =============== */

// #todo kill hanging bots (bots in games alone)
function BotsManager()
{
	// check for bots to delete
	/* a lobby should be deleted if:
		- All players left
		- No player joined after game (timeout)
		- All player disconnected (timeout)
		If a game is finished a messagge should be sent
		to the Lobby and Match History services */
}

/* ============================================= */

/* ------------------------------------------ */

import { VERSION } from './bunny.js';

const start = async () => {
	try {

		// register to bunny service
		if (await bunnyRegister() === false) throw 'Failed to register';

		// subscribe to bunny queues
		if (await bunnySubscribe([ 'bot' ]) === false) throw 'Failed to subscribe';

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
		BotsManager();
	})
};

// entrypoint
start();