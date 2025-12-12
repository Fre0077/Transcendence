import Fastify from 'fastify';
import { Lobby } from './Lobby.js'
import type { WebSocket } from "ws";


// Where the Queue will listen
const PORT = Number(process.env.PORT) || 3031;

/* ------- LOAD STUFF ------- */
const fastify = Fastify({ 
	logger: false //too much stuff... 
});

// Register WebSocket plugin
await fastify.register(import('@fastify/websocket'));

// Health-check endpoint (server-side)
fastify.get("/health", async () => ({ status: "ok" }));

/* ======= ALL LOBBIES ====== */
// fastify.get("/lobbies", async () => ({ states: getAllLobbyStates() }));
// #todo

/* ======== YOUR LOBBY ====== */
interface MyLobbyQuery {
	ID: string;	// ID of the lobby
}

fastify.get<{ Querystring: MyLobbyQuery }>(
	"/my-lobby",
	async (request) => {
		const { ID } = request.query;

		const lobby = findLobby(ID);
		if (lobby === undefined)
			return { status: 'failure' };
		else
			return { status: 'success', state: lobby.state };
	}
);


/* ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! */

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

/* ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! */




/* ----------- LOBBY DataBase ---------- */
let lobbies:Map<string, Lobby<WebSocket>> = new Map();

export function createLobby(/* game:string,  */size:number = 2): Lobby<WebSocket>
{
	const lobby:Lobby<WebSocket> = new Lobby(size);
	lobbies.set(lobby.ID, lobby);
	return lobby;
}

export function findLobby(ID:string): Lobby<WebSocket> | undefined
{
	return lobbies.get(ID);
}

export function joinLobby(ID:string, playerID:string, ws:WebSocket)
{
	const lobby = lobbies.get(ID);
	if (lobby === undefined) return;
	lobby.join(playerID, ws);
}

export function deleteLobby(ID:string)
{
	lobbies.delete(ID);
}












import { interpreter } from './interpreter.js';

// WebSocket route handler
fastify.register(async function (fastify) {
	fastify.get('/lobbysocket', { websocket: true }, (connection, request) => {

		// Logging the connection
		const clientIP = request.socket.remoteAddress;
		console.log(`Client connected from ${clientIP}`);

		// playerID not verified with JWT yet
		let player:string | undefined = undefined;
		// lobbyID
		let lobby:string | undefined = undefined;

		// Send welcome message
		connection.send('Connected to Fastify WebSocket server!');

		// Handle incoming messages
		connection.on('message', (message:string) => {
			
			interpreter(message, lobby, player, connection, (retLobby:string | undefined, retPlayer:string | undefined) => {
				lobby = retLobby;
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
			if (lobby !== undefined && player !== undefined)
			{
				const lobbyObj= findLobby(lobby);
				lobbyObj?.disconnect(player);
			}

			console.log(`Client ${clientIP} disconnected - Code: ${code}, Reason: ${reason?.toString() || 'none'}`);
		});
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

};

// entrypoint
start();