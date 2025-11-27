/* ------------------------- */
/* ------------------------- */
/* ------------------------- */


import Fastify from 'fastify';
import { Game } from "./Game.js";
// import { v4 as uuidv4 } from "uuid";

const FPS:number = 60;
const PORT = Number(process.env.PORT) || 3002;
const BACKSOCKET:string = "gameprivsocket";
const FRONTSOCKET:string = "gamesocket";



const fastify = Fastify({ 
	logger: false //too much stuff... 
});

// Register WebSocket plugin
await fastify.register(import('@fastify/websocket'));

/* --------------------------------- */

type player = {
	ID: string;
	joined: boolean;
	position: number;
};

type GameStatus = "created" | "joining" | "ongoing" | "finished";

type gameEntry = {
	ID: string;
	players: player[];
	game: Game;
	status:GameStatus;
};

// array of games
let games:gameEntry[] = [];

function getGameEntry(code:string): gameEntry | undefined {
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
/* ------ BACKENT to BACKEND websocket ------ */
/* + - + - + - + - + - + - + - + - + - + - +  */
/* __________________________________________ */

fastify.register(async function (fastify) {
	fastify.get(`/${BACKSOCKET}`, { websocket: true }, (connection, request) => {

		request;

		let ID:string = "empty";
		// 
		connection.on('message', message => {
			/* check properies, expected:
			{
				ID: string,
				status: string,
				format: number,
				players: string[]
			};
			*/

			// parse message as JSON
			let msg = isValidObj(message.toString());
			if (msg === undefined
				|| "ID" in msg === false
				|| typeof msg.ID !== "string"
				|| "format" in msg === false
				|| typeof msg.format !== "number"
				|| "players" in msg === false
				|| Array.isArray(msg.players) === false)
			{
				console.log(`Invalid JSON ${message}`);
				return;
			}

			// logging
			console.log(`Received Lobby Backend:`, msg);

			// create the player list
			const playerList: player[] = msg.players.map((id, index) => ({
				ID: id,
				joined: false,
				position: index + 1
			}));

			// add the game to the array
			games.push({
				ID: msg.ID,
				players: playerList,
				game: new Game(),
				status: "created"
			});

			// save gameID
			ID = msg.ID;
		});

		// Handle WebSocket errors
		connection.on('error', (error) => {
			console.error(`WebSocket error for ${ID}:`, error);
		});

		// Handle connection close
		connection.on('close', (code, reason) => {
			console.log(`Client ${ID} disconnected - Code: ${code}, Reason: ${reason?.toString() || 'none'}`);
		});

		setInterval(() => {

			// check if all the player joined  the game, if so start the game
			for (let i = 0; i < games.length; ++i) {
				let p = 0;
				for (;p < games[i].players.length; ++p)
					if (games[i].players[p].joined === false) break;
				if (p === games[i].players.length		// check if game is full
					&& games[i].status === "joining")	// check if game isn't started yet
				{
					games[i].status = "ongoing";
					games[i].game.start();
				}
			}


		}, 1000 );

	})
});

/* --------------------------------------------- */
/* 												 */
/* 			FRONTEND to BACKEND WebSocket	 	 */
/* 												 */
/* --------------------------------------------- */


// WebSocket route handler
fastify.register(async function (fastify) {
	fastify.get(`/${FRONTSOCKET}`, { websocket: true }, (connection, request) => {

		// Storing the SenderIP and logging it
		const clientIP = request.socket.remoteAddress;
		console.log(`Client connected from ${clientIP}`);

		// Storing the Game and the Player
		let kebab:gameEntry;
		let game:Game;
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

			console.log(`Received from ${clientIP}:`, msg);


			// Handle methods
			switch (msg.method)
			{
				case "JOIN":
					/* {method: 'JOIN', gameID: <gameID>, playerID: <playerID> }
						@gameID: the ID of the game as a string
						@playerID: the ID of the player as a string

						Description: Joins the game with the specified ID, if playerID is null it fails
						Reply: { method: 'JOIN_REPLY', status: 'success/failure', value: <gameID>, comment: <comment> }

					*/

					// check if the obj has gameID amd playerID
					if ("gameID" in msg === false || typeof msg.gameID !== "string"
						|| "playerID" in msg === false || typeof msg.playerID !== "string")
					{
						console.log(`invalid JSON message ${message}`);
						return;
					}

					// check if lobby is created
					let myGameEnrty = getGameEntry(msg.gameID);

					// game not found
					if (myGameEnrty === undefined) {
						if (connection.readyState === connection.OPEN) {
							connection.send(JSON.stringify({ method: 'JOIN_REPLY', status: 'failure', value: msg.gameID, comment: "game not found"}));
						}
						return ;
					}

					// check if the player is expected in this game
					/* ! ! ! =============================== ! ! ! */
					/* ! ! ! #todo ALSO ADD SESSION ID CHECK ! ! ! */
					/* ! ! ! =============================== ! ! ! */

					let myPlayer: player | undefined = myGameEnrty.players.find(p => p.ID === msg.playerID && p.joined === false);
					if (myPlayer === undefined) {
						if (connection.readyState === connection.OPEN) {
							connection.send(JSON.stringify({ method: 'JOIN_REPLY', status: 'failure', value: msg.gameID, comment: 'you are not expected in this game'}));
						}
						return ;
					}

					// save the game enrty
					kebab = myGameEnrty;
					// save the idx of the game for this socket connection
					game = kebab.game;
					// update entry status
					kebab.status = "joining";

					// save player for this connection
					player = myPlayer
					// update player status
					player.joined = true;

					// send successful join to frontend
					if (connection.readyState === connection.OPEN) {
						connection.send(JSON.stringify({ method: 'JOIN_REPLY', status: 'success', value: myGameEnrty.ID}));
					}

					// start receiving inputs
					gotGame = true;
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
					if ("value" in msg === false || typeof msg.value !== "string") {
						console.log(`invalid JSON message ${message}`);
						return ;
					}

					// process sent input
					if (msg.value == "UP_PRESS") game.press(player.position, "Up");
					else if (msg.value == "DW_PRESS") game.press(player.position, "Down");
					else if (msg.value == "UP_RELEASE") game.release(player.position, "Up");
					else if (msg.value == "DW_RELEASE") game.release(player.position, "Down");
					else if (msg.value == "START_PRESS") game.launch();
					else if (msg.value == "RESET_PRESS") game.reset();

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
			if (gotGame === true) player.joined = false;
			console.log(`Client ${clientIP} disconnected - Code: ${code}, Reason: ${reason?.toString() || 'none'}`);
		});

		// send gamestate to frontend 'FPS' times per second
		setInterval(() => {
			// Don't send gamestate if the game isn't found
			if (gotGame === false) return;
	
			if (connection.readyState === connection.OPEN) {
				connection.send(game.getGameStateJSON());
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

/* ---- start server ---- */

const start = async () => {
	try {
		await fastify.listen({ port: PORT, host: '0.0.0.0' });
		console.log(`Server running on http://localhost:${PORT}`);
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};


// entrypoint
start();