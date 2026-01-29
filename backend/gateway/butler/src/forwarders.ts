import { FastifyReply, FastifyRequest/* , FastifyReply */ } from 'fastify';
// import { SocketStream } from '@fastify/websocket';
import { AuthReply, isCookieAuthenticated/* , getCookieUser */ } from './middleware.js';


const GATEWAY_SECRET = process.env.GATEWAY_SECRET ?? 'biscottini';

/* ------------------------ */
/* 		  WEBSOCKETS		*/
/* ------------------------ */

import WebSocket, { RawData } from 'ws';	// important to use backend websockets

/* 
	@service:
		lobby
		tournament
		pong 
*/
export function fwdWebSocket(
	connection:WebSocket,
	request:FastifyRequest,
	endpoint:string)
{
	// Logging the connection
	const clientIP = request.socket.remoteAddress;
	const clientSocket/* :WebSocket */ = connection/* .socket */;
	console.log(`Client connected from ${clientIP}`);

	/* --- AUTH CHECK --- */
	const auth = isCookieAuthenticated(request);
	if (auth.ok === false) {
		connection.close(1008, auth.reason);
		return ; // important
	}
	/* ------------------- */

	/* #debug */
	console.log('WS connected with Authorized user:', auth.user, '...');

	/* --- FORWARDING --- */

	console.log('... and connecting to', endpoint);

	// connect to backend
	const backendSocket = new WebSocket(
		endpoint,
		{
			headers: {
				'x-user-id': String(auth.user.userId),
				'x-user-username': String(auth.user.username),
				'x-gateway-secret': String(GATEWAY_SECRET),
				// 'x-ws-query': JSON.stringify(request.query),
			}
		}
	);

	let backendReady = false;
	const presentMessages:RawData[] = [];

	// we are ready to send to backend
	backendSocket.on('open', () => {
		backendReady = true;
		console.log('Connected to backend:', endpoint);

		// send all the present messages
		for (const msg of presentMessages) {
			if (backendSocket.readyState === WebSocket.OPEN)
				backendSocket.send(msg.toString());
		}
		// clear the array
		presentMessages.splice(0, presentMessages.length);
	});

	// close client socket on backend error
	backendSocket.on('error', (err) => {
		console.error('Backend WS error:', err);
		if (clientSocket.readyState === WebSocket.OPEN) {
			clientSocket.close(1011, 'Backend error');
		}
	});

	// close client socket on backend close
	backendSocket.on('close', () => {
		if (clientSocket.readyState === WebSocket.OPEN) {
			clientSocket.close();
		}
	});


	/* --- BRIDGE CLIENT → BACKEND --- */

	// since the 'open' event on the client will happen before
	// the 'open' event here on the gateway, we store the messages
	// sent before the gateway connects to the backend and we send them
	// afterwards

	clientSocket.on('message', (message) => {

		// if backend not ready or we still sending present messages
		if (backendReady === false || presentMessages.length !== 0)
		{
			// store the message
			presentMessages.push(message);
		}
		// else if the connection is ready
		else if (backendSocket.readyState === WebSocket.OPEN)
		{
			// send the message
			backendSocket.send(message.toString());
		}
	});
	
	/* --- BRIDGE BACKEND → CLIENT --- */
	
	backendSocket.on('message', (data) => {
		if (clientSocket.readyState === WebSocket.OPEN) {
			clientSocket.send(data.toString());
		}
	});

	/* --- CLIENT LIFECYCLE --- */

	// close backend connection on client close
	clientSocket.on('close', () => {
		if (backendSocket.readyState === WebSocket.OPEN) {
			backendSocket.close();
		}
	});
	
	// close backend connection on client error
	clientSocket.on('error', (err:any) => {
		console.error(`Client WS error for ${clientIP}:`, err);
		if (backendSocket.readyState === WebSocket.OPEN) {
			backendSocket.close();
		}
	});
}


/* -------------------------------- */
/* 		  	HTTP ENDPOINTS			*/
/* -------------------------------- */

// import fetch from 'node-fetch'; // or global fetch in Node 18+

import { URLSearchParams } from 'node:url';

function buildQuery(query:any):string {
	return new URLSearchParams(query).toString();
}

// Careful, it throws errors
export async function fetchBackend(request:FastifyRequest, endpoint:string, type:string, auth?:AuthReply): Promise<Response>
{
	// --- PREPARE REQUEST FOR BACKEND ---
	const headers: Record<string, string> = {};

	// Forward original headers (optional)
	if (request.headers)
	{
		for (const [key, value] of Object.entries(request.headers)) {
			if (value && typeof value === 'string') {
				if (key.toLowerCase() !== 'content-type')
					headers[key] = value
			};
		}
	}

	// Add your auth info to backend
	if (auth) {
		headers['x-user-id'] = String(auth.user.userId);
		headers['x-gateway-secret'] = String(GATEWAY_SECRET);
	}

	// set options as fetch() likes it
	const fetchOptions: any = {
		method: request.method,
		headers,
	};

	// If there is a body, forward it
	if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
		if (type.includes('multipart/form-data')) {
            fetchOptions.body = request.raw;
            headers['content-type'] = request.headers['content-type']!;
            fetchOptions.duplex = 'half';
        } else {
            fetchOptions.body = request.body ? JSON.stringify(request.body) : undefined;
            headers['content-type'] = type;
        }
	}

	// if there is a query, add it
	if (Object.keys(request.query as object).length !== 0) {
		endpoint += `?${buildQuery(request.query)}`;
	}

	/* #debug */
	console.log('Fetching', endpoint, 'with', fetchOptions);

	// --- CALL BACKEND ---
	return await fetch(endpoint, fetchOptions);
}

// forward request to backend services afterr checking authourization
export async function authForward(
	request:FastifyRequest,
	reply:FastifyReply,
	endpoint:string,
	type:string,
	callback?: (data: any, reply: FastifyReply) => void)
{
	/* --- AUTH CHECK --- */
	const auth = isCookieAuthenticated(request, reply);
	if (auth.ok === false) return ; // important
	/* ------------------- */

	// --- CALL BACKEND ---
	let backendResponse;
	try {
		backendResponse = await fetchBackend(request, endpoint, type, auth);
	} catch (err) {
		reply.code(502).send("Backend service unreachable");
		return;
	}

	// --- FORWARD RESPONSE ---
	const contentType = backendResponse.headers.get('content-type');
	reply.code(backendResponse.status);

	// Copy headers if needed
	backendResponse.headers.forEach((value, key) => {
		reply.header(key, value);
	});
	
	/* #debug */
	// console.log('>Backend fetch', backendResponse);

	let data;
	// parse body
	if (contentType?.includes(type)) {
		data = await backendResponse.json();
	} else {
		data = await backendResponse.text();
	}

	// call the post-process callback
	if (callback && backendResponse.status === 200) {
		const newdata = callback(data, reply);
		// and hold the data
		console.log('---> sending', newdata);
		reply.send(newdata);
	}
	else reply.send(data);	// send the fetched reply
}

// forward to backend without checking authourization
export async function noAuthForward(
	request:FastifyRequest,
	reply:FastifyReply,
	endpoint:string,
	type:string,
	callback?: (data: any, reply: FastifyReply) => void)	// only called on succccessful fetch
{

	// --- CALL BACKEND ---
	let backendResponse;
	try {
		backendResponse = await fetchBackend(request, endpoint, type);
	} catch (err) {
		reply.code(502).send("Backend service unreachable");
		return;
	}

	// --- FORWARD RESPONSE ---
	const contentType = backendResponse.headers.get('content-type');
	reply.code(backendResponse.status);

	// Copy headers if needed
	backendResponse.headers.forEach((value, key) => {
		reply.header(key, value);
	});
	
	// Send body
	let data:any;
	if (contentType?.includes(type)) {
		data = await backendResponse.json();
	} else {
		data = await backendResponse.text();
	}

	/* #debug */
	// console.log('>Backend fetch', backendResponse);

	// call the post-process callback
	if (callback && backendResponse.status === 200) {
		const newdata = callback(data, reply);
		// and hold the data
		reply.send(newdata);
	}
	else reply.send(data);	// send the fetched reply
}

