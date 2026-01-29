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

		// application-level ping-pong
		if (message.toString() === 'ping') {
			if (socket.readyState === WebSocket.OPEN) {
				socket.send('pong');
			}
		}

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


// this function appends the status of the friend looking at the connected_users map
/* expecting
data {
	...
	friends: {
			linkId: number;
			username: string | null;
			avatarUrl: string | null;
		}[];
	...
} */
// the return of this function is what will be sent back to the client
export function attachFriendStatus(data:any)
{
	if (!data.friends) {
		console.log("couldn't find 'friends' when trying to attach status", data);
		return data;
	}

	// check status on each friend
	data.friends = data.friends.map((f:any) => ({
		...f,
		status: connected_users.has(f.username) ? 'online' : 'offline'
	}));

	/* #debug */
	console.log('--> data after attaching friends', data);

	return data;
}


/* ------------------------------------- */
/* 			WEBSOCKET SENDERS			 */
/* ------------------------------------- */

interface Message {
	what: "NOTIFY" | "INFO",
	type:string,
	content?:string,
	message?:string,
	sender:string
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
	target:string,
	lobbyid:string,
}

export async function sendLobbyInvite(request:FastifyRequest, reply:FastifyReply)
{
	// get target data
	const { target, lobbyid } = request.body as LobbyInviteBody;
	if (!target || !lobbyid)
	{
		// #todo send error page?
		reply
			.code(400)
			.send("Invalid body");
		return ; // important
	}

	// send lobby invite
	const ret = sendMessageTo(target, {
		what: "NOTIFY",
		type: 'lobby-invite',
		content: lobbyid,
		message: 'Sei stato invitato in una lobby!',
		sender: (request as any).user.username
	});

	if (ret === false) reply.code(404).send(JSON.stringify({ ok:false, comment:"The user isn't connected" }));
	else reply.code(200).send(JSON.stringify({ ok:true, comment:"Message sent correctly" }));
}

interface FriendRequestBody {
	target:string
}

// HELPER
// function sleep(ms:number) {
// 	return new Promise(resolve => setTimeout(resolve, ms));
// }

export async function sendFriendRequest(request:FastifyRequest, reply:FastifyReply)
{
	// get target data
	const { target } = request.body as FriendRequestBody;
	if (!target)
	{
		// #todo send error page?
		reply
			.code(400)
			.send("Invalid body");
		return ; // important
	}

	// await sleep(1000);

	// send lobby invite
	const ret = sendMessageTo(target, {
		what: "NOTIFY",
		type: 'friend-request',
		sender: (request as any).user.username
	});

	if (ret === false) reply.code(200).send(JSON.stringify({ ok:false, comment:"The user isn't connected" }));
	else reply.code(200).send(JSON.stringify({ ok:true, comment:"Message sent correctly" }));
}
