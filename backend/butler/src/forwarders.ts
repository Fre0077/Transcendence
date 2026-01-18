import { FastifyReply, FastifyRequest/* , FastifyReply */ } from 'fastify';
// import { SocketStream } from '@fastify/websocket';
import { isCookieAuthenticated, getCookieUser } from './middleware.js';

/* ------------------------ */
/* 		  WEBSOCKETS		*/
/* ------------------------ */

import WebSocket/* , { RawData } */ from 'ws';	// important to use backend websockets


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
	console.log('WS connected with Authorized user');

	// Handle incoming messages
	socket.on('message', (message:any) => {
		console.log(`Message received '${message.toString()}'`);
	});

	// Handle WebSocket errors
	socket.on('error', (error:any) => {
		console.error(`WebSocket error for ${clientIP}:`, error);
	});

	// Handle connection close
	socket.on('close', (code:any, reason:any) => {
		console.log(`Client ${clientIP} disconnected - Code: ${code}, Reason: ${reason?.toString() || 'none'}`);
	});
}

/* 
	@service:
		lobby
		tournament
		pong 
*/
export function fwdWebSocket(connection:WebSocket, request:FastifyRequest, endpoint:string)
{
	// Logging the connection
	const clientIP = request.socket.remoteAddress;
	const clientSocket/* :WebSocket */ = connection/* .socket */;
	console.log(`Client connected from ${clientIP}`);

	/* --- AUTH CHECK --- */
	const auth = getCookieUser(request);
	if (auth.ok === false)
	{
		clientSocket.close(1008, auth.reason);
		return ; // important
	}
	/* ------------------- */

	/* #debug */
	console.log('WS connected with Authorized user:', {user: auth.userId, email: auth.email});

	/* --- FORWARDING --- */

	// connect to backend
	const backendSocket = new WebSocket(
		endpoint,
		{
			headers: {
				'x-user-id': String(auth.userId),
				'x-gateway-secret': process.env.GATEWAY_SECRET ?? 'biscottini',
			}
		}
	);

	let backendReady = false;

	// we are ready to send to backend
	backendSocket.on('open', () => {
		backendReady = true;
		console.log('Connected to backend:', endpoint);
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

	clientSocket.on('message', (message) => {
		if (backendReady && backendSocket.readyState === WebSocket.OPEN) {
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

// forward request to backend services afterr checking authourization
export async function authForward(request:FastifyRequest, reply:FastifyReply, endpoint:string)
{
	/* --- AUTH CHECK --- */
	const auth = getCookieUser(request);
	if (auth.ok === false)
	{
		// #todo send error page?
		reply
			.code(401)
			.send(auth.reason || "Unauthorized");
		return ; // important
	}
	/* ------------------- */

	// --- PREPARE REQUEST FOR BACKEND ---
	const headers: Record<string, string> = {};

	// Forward original headers (optional)
	if (request.headers)
	{
		for (const [key, value] of Object.entries(request.headers)) {
			if (value && typeof value === 'string') {headers[key] = value};
		}
	}

	// Add your auth info to backend
	headers['x-user-id'] = String(auth.userId);

	// set options as fetch() likes it
	const fetchOptions: any = {
		method: request.method,
		headers,
	};

	// If there is a body, forward it
	if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
		fetchOptions.body = request.body ? JSON.stringify(request.body) : undefined;
		headers['content-type'] = 'application/json';
	}

	// --- CALL BACKEND ---
	let backendResponse;
	try {
		backendResponse = await fetch(endpoint, fetchOptions);
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
	if (contentType?.includes('application/json')) {
		const data = await backendResponse.json();
		reply.send(data);
	} else {
		const data = await backendResponse.text();
		reply.send(data);
	}
}

// forward to backend without checking authourization
export async function noAuthForward(
	request:FastifyRequest,
	reply:FastifyReply, endpoint:string,
	callback?: (data: any, reply: FastifyReply) => void)	// only called on succccessful fetch
{
	// --- PREPARE REQUEST FOR BACKEND ---
	const headers: Record<string, string> = {};

	// Forward original headers (optional)
	if (request.headers)
	{
		for (const [key, value] of Object.entries(request.headers)) {
			if (value && typeof value === 'string') {headers[key] = value};
		}
	}

	// set options as fetch() likes it
	const fetchOptions: any = {
		method: request.method,
		headers,
	};

	// If there is a body, forward it
	if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
		fetchOptions.body = request.body ? JSON.stringify(request.body) : undefined;
		headers['content-type'] = 'application/json';
	}

	// --- CALL BACKEND ---
	let backendResponse;
	try {
		backendResponse = await fetch(endpoint, fetchOptions);
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
	if (contentType?.includes('application/json')) {
		data = await backendResponse.json();
	} else {
		data = await backendResponse.text();
	}

	/* #debug */
	console.log('Fetched from backend', data);

	// call the post-process callback
	if (callback) callback(data, reply);

	reply.send(data);
}

