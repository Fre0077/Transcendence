/* ------------------------- */
/* ------------------------- */
/* ------------------------- */


import Fastify from 'fastify';
import { Game } from "./Game.js";
import { Bot } from "./Bot.js";

// tRPC stuff
// server
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { gameRouter } from 'shared-trpc';
// client
import { getLobbyService } from './trpc.js';

// reply METHODS
import { JOIN, LEAVE } from './METHODS.js'

const FPS:number = 60;
const PORT = Number(process.env.PORT) || 3002;
const LOBBY_PORT = Number(process.env.LOBBY_PORT) || 3003;
const LOBBY_URL = `http://localhost:${LOBBY_PORT}`;


/* -------- LOAD ELEMENTS -------- */
const fastify = Fastify({ 
	logger: false //too much stuff... 
});

// Register WebSocket plugin
await fastify.register(import('@fastify/websocket'));

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

/* --------------- GAME DB --------------- */

export type player = {
	ID: string;
	joined: boolean;
	left:boolean;
	position: number;
};

type GameStatus = "created" | "joining" | "ongoing" | "paused" | "finished";

export type GameEntry = {
	ID: string;
	players: player[];
	game: Game;
	status:GameStatus;
};

// array of games
let games:GameEntry[] = [];

export function getGameEntry(code:string): GameEntry | undefined
{
	const GameEntry = games.find(g => g.ID === code);
	if (GameEntry !== undefined){
		console.log(`found game with code '${code}'`);
		return GameEntry;
	}
	else
	{
		console.log(`game NOT found for code '${code}'`);
		return undefined;
	}
}

/* ---------------------------------------------------------- */
/*                                                           */
/*                                                          */
/*                                                         */
/*                                                        */
/*                                                       */
/*                                                      */
/*                      : )                            */
/*                                                    */
/*                                                   */
/*                                                  */
/*                                                 */
/*                                                */
/*                                               */
/*                                              */
/*                                             */
/*                                            */
/* * * * * * * * * * * * * * * * * * * * * * */

/* __________________________________________ */
/* 											  */
/* ----------- BACKENT to BACKEND  ---------- */
/* + - + - + - + - + - + - + - + - + - + - +  */
/* __________________________________________ */

type gameDetails = {
	ID: string,
	format:number,
	players:string[]
};

// add a game to the game list
function addGame(details:gameDetails)
{
	// logging
	console.log(`Adding game ${details.ID}`);

	// create the player list
	const playerList: player[] = details.players.map((id, index) => ({
		ID: id,
		joined: false,
		left:false,
		position: index + 1
	}));

	// add the game to the array
	games.push({
		ID: details.ID,
		players: playerList,
		game: new Game(details.format),
		status: "created"
	});
}


/* --------------------------------------------- */
/* 												 */
/* 			FRONTEND to BACKEND WebSocket	 	 */
/* 												 */
/* --------------------------------------------- */

// check if the string is a JSON obj with the 'method' property
function isValidObj(message:string): { method: string } | undefined
{
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
	fastify.get('/gamesocket', { websocket: true }, (connection, request) => {

		// Storing the SenderIP and logging it
		const clientIP = request.socket.remoteAddress;
		console.log(`Client connected from ${clientIP}`);

		// Storing the Game and the Player
		let entry:GameEntry | undefined = undefined;
		let player:player;
		let bot:Bot | undefined = undefined;
		let interval:NodeJS.Timeout;	/* :D */

		// Send welcome message
		connection.send('Connected to Fastify WebSocket server!');

		// Handle incoming messages
		connection.on('message', message => {
			
			// Format and log message
			let msg = isValidObj(message.toString());
			if (msg === undefined) {
				console.log(`invalid JSON message ${message}`);
				return;
			}

			// logging
			console.log(`Received from ${clientIP}:`, msg);

			// Handle methods
			switch (msg.method)
			{
				case "JOIN":

					// process JOIN request
					let jret = JOIN(msg);

					// successful JOIN
					if (jret.status === "success")
					{
						/* store variables */
						player = jret.player as player; 
						entry = jret.entry as GameEntry;

						/* spawn bot if necessary */
						if (entry.players.find(p => p.ID === "BOT")) {
							bot = new Bot();
						}
					}

					// send reply to frontend
					if (connection.readyState === connection.OPEN) {
						connection.send(jret.reply);
					}
					break ;
				
				case "LEAVE":
					// process LEAVE request
					let lret = LEAVE(entry, player);

					if (lret.status === "succcess")
					{
						// leave the game
						player.joined = false;
						player.left = true;
						//---
						entry = undefined;
					}

					// send reply to frontend
					if (connection.readyState === connection.OPEN) {
						connection.send(lret.reply);
					}
					break ;

				case "MOVE":

					// ignore other inputs if game not found yet
					if (entry === undefined) return ;

					// check if the game is started
					if (entry.status !== "ongoing") {
						console.log(`The game ${entry.ID} status is '${entry.status}'`);
						return ;
					}

					// check if the obj has value
					if (!("value" in msg) || typeof msg.value !== "string") {
						console.log(`invalid JSON message ${message}`);
						return ;
					}

					// process sent input
					if (msg.value == "UP_PRESS") entry.game.press(player.position, "Up");
					else if (msg.value == "DW_PRESS") entry.game.press(player.position, "Down");
					else if (msg.value == "UP_RELEASE") entry.game.release(player.position, "Up");
					else if (msg.value == "DW_RELEASE") entry.game.release(player.position, "Down");
					else if (msg.value == "START_PRESS") entry.game.launch();
					else if (msg.value == "RESET_PRESS") {
						// #todo send to DB
						saveGameIntoMatchHistory();

						entry.game.reset();
					}

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
		connection.on('error', (error) => {
			console.error(`WebSocket error for ${clientIP}:`, error);
		});

		// Handle connection close
		connection.on('close', (code, reason) => {
			if (interval) {clearInterval(interval);}
			
			// leave procedure
			let lret = LEAVE(entry, player);

			if (lret.status === "success")
			{
				// leave the game
				player.joined = false;
				player.left = true;
			}

			// logging
			console.log(`Client ${clientIP} disconnected - Code: ${code}, Reason: ${reason?.toString() || 'none'}`);
		});

		// send gamestate to frontend 'FPS' times per second
		interval = setInterval(() => {
			// Don't send gamestate if the game isn't found
			if (entry === undefined) return;
	
			/* Spawn a Bot if needed */
			if (bot !== undefined) {

				if (entry.game.playing === true)
				{
					/* calculate next move */
					const state = entry.game.state;
					bot.play(state.ball, state.paddle[1], state.player2);
					const move:string = bot.move;
			
					/* let the bot move */
					if (move === "null") {}
					else if (move === "UP_PRESS") entry.game.press(bot.position, "Up");
					else if (move === "DW_PRESS") entry.game.press(bot.position, "Down");
					else if (move === "UP_RELEASE") entry.game.release(bot.position, "Up");
					else if (move === "DW_RELEASE") entry.game.release(bot.position, "Down");
				}
				else {bot.reset();}
			}

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
		StatusChecker(games);
	}, 1000);
};

// entrypoint
start();