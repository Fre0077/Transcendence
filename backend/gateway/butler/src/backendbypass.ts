import { FastifyReply, FastifyRequest } from 'fastify';
import { /* isCookieAuthenticated, */ isCookieAuthenticated } from './middleware.js';

import WebSocket/* , { RawData } */ from 'ws';	// important to use backend websockets

import { ConnectedUser } from './classes/ConnectedUser.js';

// mapping username to websocket connection
const connected_users:Map<string, ConnectedUser> = new Map();

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
	console.log(`[WS] connected with Authorized user '${auth.user.username}'`);

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
	
		// send update to all related users
		sendFriendUpdate(auth.user);

		// set as offline
		const user = connected_users.get(auth.user.linkId);
		if (user) user.status = "offline";
	});


	// check if already stored
	const user = connected_users.get(auth.user.linkId);

	// store the connection
	if (user === undefined)
		connected_users.set(auth.user.linkId as string /* in god we trust pt.2*/, new ConnectedUser(auth.user.username, connection));
	else
	{
		// save new socket
		user.new_socket(socket);
		// send update to all related users
		sendFriendUpdate(auth.user);
	}
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
	if (data.friends === undefined) {
		console.log("couldn't find 'friends' when trying to attach status", data);
		return data;
	}

	// #relation scrape friend relations #todo maybe in some other places
	if (data.linkId === undefined) {
		console.log("Missing username of '/api/friend' return");
	} else {
		const user = connected_users.get(data.linkId);
		console.log('updating relations for', data.linkId);
		if (!user) return ;	// user not connected

		// clearing relations
		user.relations.clear();

		// getting all relations
		const friends = Array.from(data.friends.map((f:any) => f.linkId)) as string[];
		const incoming = Array.from(data.incomingRequests.map((f:any) => f.linkId)) as string[];
		const outgoing = Array.from(data.outgoingRequests.map((f:any) => f.linkId)) as string[];
	
		// adding all relations
		user.relations.add_block(friends);
		user.relations.add_block(incoming);
		user.relations.add_block(outgoing);

		console.log('>>>new relations', user.relations.data);
	}
		

	// check status on each friend
	data.friends = data.friends.map((f:any) => {
		const connected = connected_users.get(f.linkId);

		return {
			...f,
			status: connected?.status ?? 'offline',
		};
	});

	/* #debug */
	console.log('--> data after attaching friends', data);

	return data;
}


/* ------------------------------------- */
/* 			WEBSOCKET SENDERS			 */
/* ------------------------------------- */

interface Message {
	what: "NOTIFY" | "INFO" | "UPDATE",
	type:string,
	content?:string,
	message?:string,
	sender:string
}

/* actually send  the message to the user */
/* export  */function sendMessageTo(username:string, message:Message): boolean
{
	// searches the user
	const user = connected_users.get(username);

	console.log('sendMessageTo', username, user?.ID, user?.status);

	if (!user || user.status !== "online") {
		// error back to the frontend
		return false;
	}

	// get the socket
	const socket = user.socket;

	// send the message
	if (socket.readyState === WebSocket.OPEN) {
		socket.send(JSON.stringify(message));

		// successfule send
		return true;
	}

	// failed to send
	return false;
}

// send an update to all ppl related to usernam
function updateRelatedUsers(username:string, data:Message)
{
	console.log('about to send updates for', username);
	const user = connected_users.get(username);
	if (user === undefined || user.status !== "online") return ;	// no notifications will be sent if the user is offline

	console.log('user got updates', user.ID);
	connected_users.forEach(u => {
		if (u.ID !== user.ID && user.relations.has(u.ID)) {
			console.log('sending message to', u.ID);
			sendMessageTo(u.ID, data);
		}
	});
	console.log('sent update for', username);
}
/* ------------------------------------------------------------------------- */



/* ------------------------- */
/* 		CUSTOM SENDERS		 */


/* --- Lobby Invite message --- */
interface LobbyInviteBody {
	target:string,
	lobbyid:string,
}

export function sendLobbyInvite(request:FastifyRequest, reply:FastifyReply)
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

	if (ret === false) reply.code(404).send(JSON.stringify({ ok:false, error:"The user isn't connected" }));
	else reply.code(200).send(JSON.stringify({ ok:true, comment:"Message sent correctly" }));
}

// interface FriendRequestBody {
// 	target:string
// }

// HELPER
// function sleep(ms:number) {
// 	return new Promise(resolve => setTimeout(resolve, ms));
// }

// export function sendFriendRequest(request:FastifyRequest, reply:FastifyReply)
// {
// 	// get target data
// 	const { target } = request.body as FriendRequestBody;
// 	if (!target)
// 	{
// 		// #todo send error page?
// 		reply
// 			.code(400)
// 			.send("Invalid body");
// 		return ; // important
// 	}


// 	// send lobby invite
// 	const ret = sendMessageTo(target, {
// 		what: "NOTIFY",
// 		type: 'friend-request',
// 		sender: (request as any).user.username
// 	});

// 	if (ret === false) reply.code(200).send(JSON.stringify({ ok:false, comment:"The user isn't connected" }));
// 	else reply.code(200).send(JSON.stringify({ ok:true, comment:"Message sent correctly" }));
// }

// /api/friend/request endpoint in PROFILE database returns { target:string, message:string }
export function sendFriendNotification(sender:string, data:any)
{
	const target = data.target;
	if (!target) {
		console.log('target not found in [PROFILE] return', data);
		return;
	}

	// #relation (welp, we add also here)
	const user1 = connected_users.get(sender);
	const user2 = connected_users.get(target);
	if (user1 && user2) {
		user1.relations.add(user2.ID)
		user2.relations.add(user1.ID)
	}

	// send friend request
	sendMessageTo(target, {
		what: "NOTIFY",
		type: 'friend-request',
		sender: sender
	});
}

// sends a fried update to all connected users related to the target
export function sendFriendUpdate(user:any)
{
	if (!user.username) {
		console.log("Missing user.username");
		return ;
	}

	updateRelatedUsers(user.username, {
		what: "UPDATE",
		type: 'friend',
		sender: user.username
	});
}

