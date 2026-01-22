import { FastifyReply, FastifyRequest } from 'fastify';
import { /* isCookieAuthenticated, */ isCookieAuthenticated } from './middleware.js';

import WebSocket/* , { RawData } */ from 'ws';	// important to use backend websockets

// mapping username to websocket connection
const connected_users:Map<string, WebSocket> = new Map();

// Check if the user is authenticated and adds the connection to the map
export function authWebSocket(connection:WebSocket, request:FastifyRequest)
{
	// Logging the connection
	const clientIP = request.socket.remoteAddress;
	const socket/* :WebSocket */ = connection/* .socket */;
	console.log(`Client connected from ${clientIP}`);

	/* --- AUTH CHECK --- */
	const auth = isCookieAuthenticated(request);
	if (auth.ok === false)
	{
		socket.close(1008, auth.reason);
		return ; // important
	}
	/* ------------------- */

	/* #debug */
	console.log(`WS connected with Authorized user '${auth.user.username}'`);

	// Handle incoming messages
	socket.on('message', (message:any) => {
		console.log(`Message received '${message.toString()}'`);
	});

	// Handle WebSocket errors
	socket.on('error', (error:any) => {
		// close connection
		console.error(`WebSocket error for ${clientIP}:`, error);
	});

	// Handle connection close
	socket.on('close', (code:any, reason:any) => {
		console.log(`Client ${clientIP} disconnected - Code: ${code}, Reason: ${reason?.toString() || 'none'}`);
	
		// remove from stored connections
		connected_users.delete(auth.user.username as string/* in god we trust */);
	});


	// store the connection
	connected_users.set(auth.user.username as string /* in god we trust pt.2*/, connection);
}

/* ------------------------------------- */
/* 			WEBSOCKET SENDERS			 */
/* ------------------------------------- */

interface Message {
	what: "NOTIFY" | "INFO",
	type:string,
	content:string,
	message?:string
}

/* actually send  the message to the user */
/* export  */function sendMessageTo(username:string, message:Message): boolean
{
	// searches the user
	const socket = connected_users.get(username);
	if (!socket) {
		// error back to the frontend
		return false;
	}

	// send the message
	if (socket.readyState === WebSocket.OPEN) {
		socket.send(JSON.stringify(message));

		// successfule send
		return true;
	}

	// failed to send
	return false;
}


/* --- Lobby Invite message --- */
interface LobbyInviteBody {
	username:string,
	lobbyid:string,
}

export async function sendLobbyInvite(request:FastifyRequest, reply:FastifyReply)
{
	// get target data
	const { username, lobbyid } = request.body as LobbyInviteBody;
	if (!username || !lobbyid)
	{
		// #todo send error page?
		reply
			.code(400)
			.send("Invalid body");
		return ; // important
	}

	// send lobby invite
	const ret = sendMessageTo(username, {
		what: "NOTIFY",
		type: 'lobby-invite',
		content: lobbyid,
		message: 'Sei stato invitato in una lobby!'
	});

	if (ret === false) reply.code(404).send(JSON.stringify({ ok:false, comment:"The user isn't connected" }));
	else reply.code(200).send(JSON.stringify({ ok:true, comment:"Message sent correctly" }));
}
