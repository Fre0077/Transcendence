/* ------------------------- */
/* ------------------------- */
/* ------------------------- */


import Fastify from 'fastify';
// import { Game } from "./Game.js";
import { Lobby } from "./Lobby.js";

// tRPC stuff
// client
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

// server
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import type { GameRouter } from 'shared-trpc';
import { lobbyRouter } from 'shared-trpc';

// constants
const PORT = Number(process.env.PORT) || 3003;
const GAME_PORT = Number(process.env.LOBBY_PORT) || 3002;


// don't exit silently plsss
// process.on("unhandledRejection", (reason) => {
//     console.error("UNHANDLED REJECTION:", reason);
// });


const fastify = Fastify({ 
	logger: false //too much stuff... 
});

// Register WebSocket plugin
await fastify.register(import('@fastify/websocket'));

// Health-check endpoint (server-side)
fastify.get("/health", async () => ({ status: "ok" }));

// Register tRPC plugin
await fastify.register(fastifyTRPCPlugin, {
	prefix: '/trpc',
	trpcOptions: { router: lobbyRouter, createContext: () => ({ func: gameIsFinished }) },
});



/* ! ! ! TEMP ! ! ! */

// fetching test html
await fastify.register(import('@fastify/static'), {
	root: new URL('../public', import.meta.url).pathname
});

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





// TRPC Client
const gameService = createTRPCProxyClient<GameRouter>({
  links: [
	httpBatchLink({
	  url: `http://localhost:${GAME_PORT}/trpc`,
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

// console.log("client status:", client.hello.query({name: 'tommi'}));

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

// Health checker
async function checkServerHealth(url:string) {

	// console.log(`checking '${url}' health ...`);

	if (url === undefined || url === null) {
		console.log('invalid URL');
		return false;
	}

	const health = await fetch(`${url}/health`)
		.then(r => r.json())
		.catch(() => null);

	if (!health?.status) {
		console.log(`Server '${url}' offline`);
		return false;
	}

	console.log(`Server '${url}' online`);
	return true;
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

/* backend to backend */

function gameIsFinished(gameID:string) {
	let lobby = lobbies.find(l => l.getGameDetails().ID === gameID);
	if (lobby == undefined) return;
	else {
		console.log('Resetting lobby', lobby.getID());
		lobby.reset();
	}
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
						console.log(`Setting format ${msg.format}`);
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
					lobby.launch((state:object, ID:string) => {

						// Send the game details to the Game backend
						try {
							if ("ID" in state === false || typeof state.ID !== "string"
								|| "format" in state === false || typeof state.format !== "number"
								|| "players" in state === false || Array.isArray(state.players) === false)
								throw "Invalid game details";

							// call the createGame rule in the router
							gameService.createGame.mutate({
								ID: state.ID,
								format: state.format,
								players: state.players
							});

						} catch (err) {
							console.log('Error creating game:', err);
						}

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

		// check game server health
		if (await checkServerHealth("http://localhost:3002") === true) {
			const res = await gameService.hello.query({ name: 'Alice' });
			console.log(res); // { message: "Hello Alice!" }
		} else {
			console.log('Shutting down ...');
			throw "Game server offile";
		}

	// start fastify server
	await fastify.listen({ port: PORT, host: '0.0.0.0' });
	console.log(`Server running on http://localhost:${PORT}`);

	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};


// entrypoint
start();