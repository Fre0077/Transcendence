/* ------------------------- */
/* ------------------------- */
/* ------------------------- */


import Fastify from 'fastify';
import { Game } from "./Game.js";

// my type definitions
import { player, gameEntry } from './gameObjs.js'

// tRPC stuff
// client
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

// server
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import type { lobbyRouter } from 'shared-trpc';
import { gameRouter } from 'shared-trpc';


// reply METHODS
import { JOIN } from './JOIN.js'

const FPS:number = 60;
const PORT = Number(process.env.PORT) || 3002;
const LOBBY_PORT = Number(process.env.LOBBY_PORT) || 3003;


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

/* --------------------------------- */




// TRPC Client
const lobbyService = createTRPCProxyClient<typeof lobbyRouter>({
  links: [
	httpBatchLink({
	  url: `http://localhost:${LOBBY_PORT}/trpc`,
	  async fetch(url, options) {
		try {
		  const res = await fetch(url, options);
		  if (!res.ok) {
			console.error('tRPC server responded with status', res.status);
		  }
		  return res;
		} catch (err) {
		  console.error('tRPC network error: server unreachable', err);
		  throw err; // important to rethrow
		}
	  },
	}),
  ],
});



// array of games
let games:gameEntry[] = [];

export function getGameEntry(code:string): gameEntry | undefined {
	const gameEntry = games.find(g => g.ID === code);
	if (gameEntry !== undefined){
		console.log(`found game with code '${code}'`);
		return gameEntry;
	}
	else
	{
		console.log(`game NOT found for code '${code}'`);
		return undefined;
	}
}


// check if the string is a JSON obj
function isValidObj(message:string): object | undefined {
	let parse: unknown;

	// JSON parse
	try {
		parse = JSON.parse(message.toString());
	} catch (err) {
		return undefined;
	}

	return Object(parse);
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
/* ----------- BACKENT to BACKEND  ----------- */
/* + - + - + - + - + - + - + - + - + - + - +  */
/* __________________________________________ */

type gameDetails = {
	ID: string,
	format:number,
	players:string[]
};

// add a game to the game list
export function addGame(details:gameDetails) {

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


// WebSocket route handler
fastify.register(async function (fastify) {
	fastify.get('/gamesocket', { websocket: true }, (connection, request) => {

		// Storing the SenderIP and logging it
		const clientIP = request.socket.remoteAddress;
		console.log(`Client connected from ${clientIP}`);

		// Storing the Game and the Player
		let kebab:gameEntry;
		let player:player;
		let gotGame:boolean = false;

		// Send welcome message
		connection.send('Connected to Fastify WebSocket server!');

		// Handle incoming messages
		connection.on('message', message => {
			
			// Format and log message
			let msg = isValidObj(message.toString());
			if (msg === undefined || "method" in msg === false) {
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
					let ret = JOIN(msg);

					// type check
					if (!("error" in ret) || typeof ret.error !== "boolean"
						|| !("reply" in ret )|| typeof ret.reply !== "string") {
						console.log("should never happen, if it happened, you're cooked.");
						break ;
					}

					// successful JOIN
					if (ret.error === false)
					{
						if (!("player" in ret) || !("entry" in ret)) {
							console.log("should never happen pt.2, if it happened, you're cooked.");
							break ;
						}

						// store variables
						player = ret.player as player; 
						kebab = ret.entry as gameEntry;

						gotGame = true;
					}

					// send reply to frontend
					if (connection.readyState === connection.OPEN) {
						connection.send(ret.reply);
					}
					break ;

				case "MOVE":

					// ignore other inputs if game not found yet
					if (gotGame === false) return ;

					// check if the game is started
					if (kebab.status !== "ongoing") {
						console.log(`The game ${kebab.ID} is still '${kebab.status}'`);
						return ;
					}

					// check if the obj has value
					if (!("value" in msg) || typeof msg.value !== "string") {
						console.log(`invalid JSON message ${message}`);
						return ;
					}

					// process sent input
					if (msg.value == "UP_PRESS") kebab.game.press(player.position, "Up");
					else if (msg.value == "DW_PRESS") kebab.game.press(player.position, "Down");
					else if (msg.value == "UP_RELEASE") kebab.game.release(player.position, "Up");
					else if (msg.value == "DW_RELEASE") kebab.game.release(player.position, "Down");
					else if (msg.value == "START_PRESS") kebab.game.launch();
					else if (msg.value == "RESET_PRESS") kebab.game.reset();

					break ;
				
				default:
					console.log(`Unhandled method ${msg.method}`);
			}
		});

		// Handle WebSocket errors
		connection.on('error', (error) => {
			console.error(`WebSocket error for ${clientIP}:`, error);
		});

		// Handle connection close
		connection.on('close', (code, reason) => {
			if (gotGame === true) {
				player.joined = false;
				player.left = true;
			}
			console.log(`Client ${clientIP} disconnected - Code: ${code}, Reason: ${reason?.toString() || 'none'}`);
		});

		// send gamestate to frontend 'FPS' times per second
		setInterval(() => {
			// Don't send gamestate if the game isn't found
			if (gotGame === false) return;
	
			if (connection.readyState === connection.OPEN) {
				connection.send(kebab.game.getGameStateJSON());
			}

			// send winner message 
			// #todo single message not spamming

            // let winner = game.end();
            // if (winner !== 0) {
            //     if (winner === 1) connection.send('Player 1 Won!!! Congrats');
            //     else if (winner === 2) connection.send('Player 2 Won!!! Yippye');
            // }


		}, 1000 / FPS);	// FPS (delay in ms)

	});
});

/* ============== GAME STARTER ============ */

function allJoined(entry:gameEntry): boolean {

	if (entry === undefined) {return false};
	if (entry.status !== "joining") {return false;}

	let j = 0;
	while (j < entry.players.length && entry.players[j].joined === true)
		++j;

	return j === entry.players.length;
}

function allLeft(entry:gameEntry): boolean {

	if (entry === undefined) {return false};

	let j = 0;
	while (j < entry.players.length && entry.players[j].left === true)
		++j;

	return j === entry.players.length;
}

/* ---- start server ---- */

const start = async () => {
	try {

		/* #todo da metter dopo il server launch */
		// check game server health
		// if (await checkServerHealth("http://localhost:3002") === true) {
		// 	const res = await gameService.hello.query({ name: 'Alice' });
		// 	console.log(res); // { message: "Hello Alice!" }
		// } else {
		// 	console.log('Shutting down ...');
		// 	throw "Game server offile";
		// }

		await fastify.listen({ port: PORT, host: '0.0.0.0' });
		console.log(`Server running on http://localhost:${PORT}`);
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}

	// Lobby handler
	setInterval(() => {
		// check if all the player joined  the game, if so start the game
		for (let i = 0; i < games.length; ++i) {

			if (allJoined(games[i]) === true)	// check if game isn't started yet
			{
				console.log(`Starting game ${games[i].ID} ...`);
				games[i].status = "ongoing";
				games[i].game.start();
			}
			else if (allLeft(games[i]) === true)
			{
				console.log(`Closing game ${games[i].ID} ...`)
				games[i].status = "finished";
				games[i].game.stop();
				lobbyService.endGame.mutate(games[i].ID);
				games.splice(games.indexOf(games[i]), 1);
			}
		}
	}, 1000);
};


// entrypoint
start();