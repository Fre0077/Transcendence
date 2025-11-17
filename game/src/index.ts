/* ------------------------- */
/* ------------------------- */
/* ------------------------- */


import Fastify from 'fastify';
// import { Game } from "./Game.js";
import { Lobby } from "./Lobby.js";
import { v4 as uuidv4 } from "uuid";

const FPS:number = 60;
const PORT = Number(process.env.PORT) || 3002;

const fastify = Fastify({ 
	logger: false //too much stuff... 
});

// fetching test html
await fastify.register(import('@fastify/static'), {
	root: new URL('../public', import.meta.url).pathname
});

// Register WebSocket plugin
await fastify.register(import('@fastify/websocket'));

// serving test html
fastify.get('/', async (request, reply) => {
	request; // ignore
	return reply.sendFile('fastify_frontend.html');
});

/* ------------- LOBBY ------------- */

// type lobby = {
// 	code: string,
// 	game: Game
// }

// let lobbies: lobby[] =[];

// function addLobby(code: string): Game {
// 	const game = new Game();
// 	lobbies.push({ code, game });
// 	console.log(`added lobby with code '${code}'`);
// 	return game;
// }

// function getLobby(code:string): lobby | undefined {
// 	const lobby = lobbies.find(l => l.code === code);
// 	if (lobby !== undefined) console.log(`found lobby with code '${code}'`);
// 	else console.log(`lobby NOT found for code '${code}'`);
// 	return lobby;
// }
/* --------------------------------- */

let lobbies:Lobby[] = [];
// let playerIDs:string[] = [];

function getLobby(code:string): Lobby {
	let lobby = lobbies.find(l => l.getID() === code);
	if (lobby !== undefined) console.log(`found lobby with code '${code}'`);
	else {
		console.log(`lobby NOT found for code '${code}'\nGenerating new Lobby ...`);
		lobby = new Lobby();
		if (lobbies.find(l => l.getID() === code)) {/* keep the automaticcally generated code */}
		else {lobby.setID(code);}					/* set the custom one */
		lobbies.push(lobby);
	}

	return lobby;
}

// check if the object has 'method' and 'value' properies
function hasMethodAndValue(obj: unknown): obj is { method: string, value: string } {
	return (
		obj !== null
		&& typeof obj === "object"
		&& "method" in obj
		&& "value" in obj
	);
}

// WebSocket route handler
fastify.register(async function (fastify) {
	fastify.get('/websocket', { websocket: true }, (connection, request) => {

		// Logging the connection
		const clientIP = request.socket.remoteAddress;
		console.log(`Client connected from ${clientIP}`);

		// generate player ID (get it from frontend afterwards @aleborghi)
		const playerID = uuidv4();

		//----- finding the right game to log in
		let lobby:Lobby;
		let gotLobby:boolean = false;

		// Send welcome message
		connection.send('Connected to Fastify WebSocket server!');
		// connection.send(game.getPaddingSettingsJSON());          // just padding data se vuoi @aleborghi

		// Handle incoming messages
		connection.on('message', message => {
			try {
				// Format and log message
				// const msg = message.toString().trim();

				let msg: unknown;

				// JSON parse
				try {
					msg = JSON.parse(message.toString());
				} catch (err) {
					console.log("Invalid JSON");
					return;
				}

				console.log(`Received from ${clientIP}:`, msg);

				if (!hasMethodAndValue(msg)) {
					console.log(`invalid JSON message ${msg}`);
					return;
				}
				// log into the lobby or creates it
				// if (text.startsWith('join:')) {
				if (msg.method === 'JOIN') {
					const lobbyID:string = msg.value;

					// join/create lobby
					lobby = getLobby(lobbyID);
					lobby.join(playerID);

					// send lobbyID to frontend @aleborghi
					if (connection.readyState === connection.OPEN) {
						connection.send(lobby.getID());
					}

					// start receiving inputs
					gotLobby = true;
				}
				else if (msg.method === 'MOVE' ) {
					// ignore other inputs if game not found yet
					if (gotLobby === false) return;

					lobby.send(playerID, msg.value);
				}
				else {
					console.log(`Unhandled method ${msg.method}`);
				}

			} catch (error) {
				console.error('Error processing message:', error);
			}
		});

		// Handle WebSocket errors
		connection.on('error', (error) => {
			console.error(`WebSocket error for ${clientIP}:`, error);
		});

		// Handle connection close
		connection.on('close', (code, reason) => {
			if (gotLobby === true) lobby.leave(playerID);
			console.log(`Client ${clientIP} disconnected - Code: ${code}, Reason: ${reason?.toString() || 'none'}`);
		});

		// send gamestate to frontend 'FPS' times per second
		setInterval(() => {
			// Don't send gamestate if the game isn't found
			if (gotLobby === false) return;
	
			if (connection.readyState === connection.OPEN) {
				connection.send(lobby.getGameStateJSON());
			}
		}, 1000 / FPS);	// FPS (delay in ms)

		// let winner = game.end();
		// if (winner !== 0) {
		//     if (winner === 1) connection.send('Player 1 Won!!! Congrats');
		//     else if (winner === 2) connection.send('Player 2 Won!!! Yippye');
		// }

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