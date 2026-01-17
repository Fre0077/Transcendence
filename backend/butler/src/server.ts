import Fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyWebsocket from '@fastify/websocket';

// import { WebSocket } from "ws";
import { verifyAccessToken } from './middleware.js';


// Where the Queue will listen
const PORT = Number(process.env.PORT) || 3029;
// const MYURL = process.env.MYURL ?? `http://butler:${PORT}`;


/* ------- LOAD STUFF ------- */
const fastify = Fastify({ 
	logger: false //too much stuff... 
});

// Register WebSocket plugin
await fastify.register(fastifyWebsocket);
// Register Cookies plugin
await fastify.register(fastifyCookie);

// Health-check endpoint (server-side)
fastify.get("/health", async () => ({ status: "ok" }));

/*	#TODO LATER 
	home : { auth: false, container: 'frontend', url:"http://frontend/home" }
	game : { auth: true, container: 'frontend', url:"http://frontend/game" }
*/

/* let connected_users:Map<string, WebSocket> = new Map();

async function sendNotify(username: string, ) {

} */







// WebSocket route handler
fastify.register(async function (fastify) {
	fastify.get('/websocket', { websocket: true }, (connection, request) => {

		// Logging the connection
		const clientIP = request.socket.remoteAddress;
		console.log(`Client connected from ${clientIP}`);

		/* --- AUTH CHECK --- */
		// get the token
		try {
			const token = request.cookies.token;

			console.log('got token', token);

			if (!token) {
				connection.close(1008, 'Missing token');

				/* #debug */
				console.log(`Closed socket of '${clientIP}' for:`, 'Missing token');

				return ;
			}

			// verify the token
			const user = verifyAccessToken(token);

			if (!user) {
				connection.close(1008, 'Invalid token');

				/* #debug */
				console.log(`Closed socket of '${clientIP}' for:`, 'Invalid token');

				return ;
			}

			console.log('WS connected with Authorized user:', user);
		} catch (err) {
			console.log('Error while authenticating', err);
			connection.close(1008, "Internal server error");
		}

		/* ------------------- */

		// Handle incoming messages
		connection.on('message', (message:string) => {
			console.log('Message received', message.toString());
		});

		// Handle WebSocket errors
		connection.on('error', (error:string) => {
			console.error(`WebSocket error for ${clientIP}:`, error);
		});

		// Handle connection close
		connection.on('close', (code:number, reason:string) => {

			console.log(`Client ${clientIP} disconnected - Code: ${code}, Reason: ${reason?.toString() || 'none'}`);
		});
	});
});


/* ------------------------------------------ */

const start = async () => {
	try {

		// start fastify server
		await fastify.listen({ port: PORT, host: '0.0.0.0' });
		
		// logging version for info and compatibility
		console.log(`Server running on http://localhost:${PORT}`);

	} catch (err) {
		console.log(err);
		fastify.log.error(err);
		process.exit(1);
	}

};

// entrypoint
start();