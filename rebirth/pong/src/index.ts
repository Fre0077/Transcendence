import Fastify from 'fastify';
import { Game } from './Game.js'
// import type { WebSocket } from "ws";
import { Bot } from './Bot.js'


// Where the Queue will listen
const PORT = Number(process.env.PORT) || 3032;
const FPS:number = 60;

/* ------- LOAD STUFF ------- */
const fastify = Fastify({ 
	logger: false //too much stuff... 
});

// Register WebSocket plugin
await fastify.register(import('@fastify/websocket'));

// Health-check endpoint (server-side)
fastify.get("/health", async () => ({ status: "ok" }));



/* ----------- GAMES DataBase ---------- */

type Player = {
	ID:string;
	idx:number;
	status: "connected" | "disconnected";
}

let games:Map<string, {game: Game, players:Player[]}> = new Map();

export function createGame(ID:string, playerIDs:string[]): Game
{
	// #debug
	console.log(`Creating game ${ID} ...`);

	const players = Array.from(playerIDs, (playerID, idx) => ({
		ID:playerID,
		idx: idx,
		status: "disconnected" as "connected" | "disconnected"
	}));

	const game:Game = new Game();
	games.set(ID, { game: game, players: players });
	return game;
}

export function findGame(ID:string, playerID:string | void): {game: Game | undefined, idx:number | undefined}
{
	// check if game is there
	const game = games.get(ID);
	if (game === undefined) return { game: undefined, idx: undefined };

	// check if also the player Idx is asked
	if (!playerID) return { game: game.game, idx: undefined };

	// check if player is there
	const player = game.players.find(p => p.ID === playerID);
	if (player === undefined) return { game: game.game, idx: undefined };

	// return the idx
	return { game: game.game, idx: player.idx };
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
	player.status = "disconnected";
	return {
		status: "success",
		reason: "Player left successfully"
	};
}

export function deleteGame(ID:string)
{
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
		// bot instance, 1 for connection
		let bot:Bot | undefined = undefined;
		// bot interval
		let interval:NodeJS.Timeout;	/* :D */

		// Send welcome message
		connection.send('Connected to Fastify WebSocket server!');

		// Handle incoming messages
		connection.on('message', (message:string) => {
			
			interpreter(message, gameID, playerID, bot, (retGame:string | undefined, retPlayer:string | undefined, botRet:Bot | undefined) => {
				gameID = retGame;
				playerID = retPlayer;
				bot = botRet;
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
			// kill the spammer and the bot if needed
			if (interval) clearInterval(interval);

			// leave procedure (just leave from the connected sockets, not from the lobby)
			if (gameID !== undefined && playerID !== undefined) leaveGame(gameID, playerID);

			console.log(`Client ${clientIP} disconnected - Code: ${code}, Reason: ${reason?.toString() || 'none'}`);
		});

		// send gamestate to frontend 'FPS' times per second
		interval = setInterval(() => {
			// Don't send gamestate if the game isn't found
			if (gameID === undefined) return;
			const { game, idx } = findGame(gameID, "BOT");
			if (game === undefined) return;
	
			/* Spawn a Bot if needed */
			if (bot !== undefined && idx !== undefined) {
		
				if (game.playing === true)
				{
					/* calculate next move */
					const state = game.state;
					bot.play(state.ball, state.paddle[1]);
					const move:string = bot.move;
			
					/* let the bot move */
					if (move === "null") {}
					else if (move === "UP_PRESS") game.press(idx, "Up");
					else if (move === "DW_PRESS") game.press(idx, "Down");
					else if (move === "UP_RELEASE") game.release(idx, "Up");
					else if (move === "DW_RELEASE") game.release(idx, "Down");
				}
				else {bot.reset();}
			}

			if (connection.readyState === connection.OPEN) {
				connection.send(game.stateJSON);
			}

		}, 1000 / FPS);	// FPS (delay in ms)
		
	});
});

export let MQID:string;

/* ------------------------------------------ */
const start = async () => {
	try {
		// start fastify server
		await fastify.listen({ port: PORT, host: '0.0.0.0' });
		console.log(`Server running on http://localhost:${PORT}`);

		/* - - - FT_RABBIT SUBSCRIPTION - - - */
		await fetch('http://localhost:3030/register')
		.then(r => r.json())
		.then((json) =>{
			if ("ID" in json == false) throw "Invalid JSON";
			MQID = json.ID;

			console.log("Registered to ft_bunny with ID", MQID);
		});
		// catched below

		await fetch(`http://localhost:3030/subscribe?queue=game&ID=${MQID}`)
		.then(r => r.json())
		.then((json) =>{
			if ("status" in json == false) throw "Invalid JSON";
			if (json.status !== 'success') throw "Unsuccessful subscription";

			console.log("Subscribed to 'game' MessageQueue");
		});
		// catched below

	} catch (err) {
		console.log(err);
		fastify.log.error(err);
		process.exit(1);
	}

	// routine check
	setInterval((() => {
		// adds/removes games
		StatusChecker();

	}), 1000);

};

function StatusChecker()
{
	// check if a new games should be added
	fetch(`http://localhost:3030/get?queue=game&ID=${MQID}`)
	.then(r => r.json())
	.then((json) =>{
		if ("status" in json === false) throw "Invalid JSON";
		if (json.status !== 'success') return ;

		json = Object(json);

		// check if the message is there
		if ("message" in json === false) throw 'Invalid JSON (with successful get)';

		const msg = Object(json.message);

		// check if we got the gameID ad the players
		if ("ID" in msg === false
			|| typeof msg.ID !== "string"
			|| "players" in msg === false
			|| Array.isArray(msg.players) === false
			|| !msg.players.every((p: unknown) => typeof p === "string"))
		{
			console.log(json);
			throw 'Invalid JSON (with successful get)';
		}

		createGame(msg.ID, msg.players);

		
	})
	.catch((err) => console.log(err));

}

// entrypoint
start();