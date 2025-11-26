/* ------------------------- */
/* ------------------------- */
/* ------------------------- */


import Fastify from 'fastify';
// import { Game } from "./Game.js";
import { Lobby } from "./Lobby.js";

import WebSocket from 'ws';  // comunication between lobby ang game modules

// import { v4 as uuidv4 } from "uuid"; // temp, jsut for playerID

// constants
const PORT = Number(process.env.PORT) || 3003;
const GAMESERVER_IP:string = "localhost";				// IP where the game container is
const GAMESOCKET:string = "gameprivsocket";
const GAMESERVER_PORT = 3002;




const fastify = Fastify({ 
	logger: false //too much stuff... 
});

// fetching test html
await fastify.register(import('@fastify/static'), {
	root: new URL('../public', import.meta.url).pathname
});

// Register WebSocket plugin
await fastify.register(import('@fastify/websocket'));

// serving lobby test html
fastify.get('/', async (request, reply) => {
	request; // ignore
	return reply.sendFile('fastify_lobby.html');
});

// serving game test html
fastify.get('/game', async (request, reply) => {
	request; // ignore
	return reply.sendFile('fastify_game.html');
});


/* HELPERS */

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




/* --------------- LOBBY --------------- */

let lobbies:Lobby[] = [];	// lobby array

function createLobby(): Lobby {
	const lobby:Lobby = new Lobby();
	lobbies.push(lobby);
	return lobby;
}

// // returns the index of the lobby in the 'lobbies' array
function getLobby(lobbyID:string): Lobby | undefined {

	if (lobbyID === null) return undefined;

	let myLobby;

	// join the first lobby with an empty space
	if (lobbyID === 'ANY'){
		myLobby = lobbies.find(l => l.full() === false);
		if (myLobby === undefined) return undefined;
		else return myLobby;
	}

	// check the specific lobby
	myLobby = lobbies.find(l => l.getID() === lobbyID);
	if (myLobby === undefined) return undefined;
	else return myLobby;
}

/* --------------------------------------- */


// WebSocket route handler
fastify.register(async function (fastify) {
	fastify.get('/lobbysocket', { websocket: true }, (connection, request) => {

		// Logging the connection
		const clientIP = request.socket.remoteAddress;
		console.log(`Client connected from ${clientIP}`);

		// generate player ID (get it from frontend afterwards @aleborghi)
		let playerID:string;	// as of now saved nly on JOIN requests

		//----- finding the right lobby to log in
		let lobby:Lobby;
		let gotLobby:boolean = false;

		// Send welcome message
		connection.send('Connected to Fastify WebSocket server!');

		// Handle incoming messages
		connection.on('message', (message:string) => {
			
			// Format and log message
			let msg = isValidObj(message.toString());
			if (msg === undefined
				|| "method" in msg === false
				|| typeof msg.method !== "string")
			{
				console.log(`invalid JSON message ${msg}`);
				return;
			}

			// loggigng message
			console.log(`Received from ${clientIP}:`, msg);
				
			// various lobby operations
			switch (msg.method)
			{
				case "CREATE":
					/* {method: 'CREATE', format: 3 }
						@format: the number of rounds a player need to win to win the match
					
						Description: Creates a lobby, if 'format' is a valid format the lobby inherits that format.
						Reply: { method: 'CREATE_REPLY', status: 'success/failure', value: <lobbyID> }
					*/


					//create lobby
					lobby = createLobby();


					// check if the obj has format
					if ("format" in msg && typeof msg.format === "number" ) {
						lobby.setFormat(msg.format);
					}

					// send lobbyID to frontend @aleborghi
					if (connection.readyState === connection.OPEN) {
						connection.send(JSON.stringify({ method: 'CREATE_REPLY', status: 'success', value: lobby.getID()}));
					}
					break ;
				case "JOIN":
					/* {method: 'JOIN', lobbyID: <lobbyID>, playerID: <playerID> }
						@lobbyID: the ID of the lobby as a string
						@playerID: the ID of the player as a string

						Description: Joins a lobby with the specified ID, if playerID is null it fails
						Reply: { method: 'JOIN_REPLY', status: 'success/failure', value: <lobbyID>, comment: <comment> }

					*/

					// check if the obj has lobbyID and playerID
					if ("lobbyID" in msg === false || typeof msg.lobbyID !== "string"
						|| "playerID" in msg === false || typeof msg.playerID !== "string")
					{
						console.log(`invalid JSON message ${msg}`);
						return;
					}

					// save playerID
					playerID = msg.playerID;
					
					// check if lobby is created
					let tmpLobby = getLobby(msg.lobbyID);

					// lobby not found
					if (tmpLobby === undefined) {
						if (connection.readyState === connection.OPEN) {
							connection.send(JSON.stringify({ method: 'JOIN_REPLY', status: 'failure', value: msg.lobbyID, comment: "Lobby not found"}));
						}
						return ;
					}

					// actually join the lobby
					lobby = tmpLobby;
					lobby.join(playerID);

					// send lobbyID to frontend @aleborghi
					if (connection.readyState === connection.OPEN) {
						connection.send(JSON.stringify({ method: 'JOIN_REPLY', status: 'success', value: msg.lobbyID, comment: `Lobby ${lobby.getID()} joined successfully!`}));
					}

					// start receiving inputs
					gotLobby = true;
					break ;
				
				case "START":
					/* {method: 'START' }

						Description: Starts the lobby. only one player will do that, than the lobby is closed and set to 'in-game'.
									 If the lobby started correctly the 'value' of the reply is set to the 'gameID' to join
									 Note: the other player will be notified that the lobby was successfully started by the 'ingame' propery of the
									 lobbyStatus that gets sent once every second
						Reply (failure): { method: 'START_REPLY', status: 'failure', comment: <comment> }
						Reply (success): { method: 'START_REPLY', status: 'success', comment: <comment>, value: <gameID> }

					*/

					// check if you joined a lobby
					if (gotLobby === false) {
                        if (connection.readyState === connection.OPEN) {
                            connection.send(JSON.stringify({ method: 'START_REPLY', status: 'failure', comment: "Join a lobby before starting the game dumass" }));
                        }
                        return;
                    }
                
					// check if lobby is full
                    if (!lobby.full()) {
                        if (connection.readyState === connection.OPEN) {
                            connection.send(JSON.stringify({ method: 'START_REPLY', status: 'failure', comment: "The lobby isnt full, cannot start game" }));
                        }
                        return;
                    }

					// set the lobby as in game
					lobby.launch((state:string, ID:string) => {
						const gamesocket = new WebSocket(`ws://${GAMESERVER_IP}:${GAMESERVER_PORT}/${GAMESOCKET}`);

						gamesocket.on('open', () => {
							// now safe to send
							gamesocket.send(state);
						});

						gamesocket.on('error', (err) => {
							console.error("WebSocket error:", err);
						});

						// disconnect
						// gamesocket.close();

						// send game started reply
						if (connection.readyState === connection.OPEN) {
							connection.send(JSON.stringify({ method: 'START_REPLY', status: 'success', value: ID, comment: `The lobby ${lobby.getID()} is now in game`}));
						}
					});

					break ;
				
				default:
					console.log(`Unhandled method ${msg.method}`);
			}
		});

		// Handle WebSocket errors
		connection.on('error', (error:string) => {
			console.error(`WebSocket error for ${clientIP}:`, error);
		});

		// Handle connection close
		connection.on('close', (code:number, reason:string) => {
			if (gotLobby === true) lobby.leave(playerID);
			console.log(`Client ${clientIP} disconnected - Code: ${code}, Reason: ${reason?.toString() || 'none'}`);
		});


		// send lobby state to frontend once per second
		setInterval(() => {
			// Don't send gamestate if the game isn't found
			if (gotLobby === false) return;
	
			if (connection.readyState === connection.OPEN) {
				// send lobby state
				connection.send(lobby.getLobbyStateJSON());
			}

		}, 1000);	// (delay in ms)

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