/* --------------------------------------------------------- */
/*				  SINGLETON SOCKET CONNECTION				 */

const LOBBY_WEBSOCKET_URL = `/ws/lobby`;

const LOBBY_FORMAT = 3;

import { isauth } from "@services/api/isauth";

// export interface LobbyWebSocket {
// 	// socket ops
// 	socket: WebSocket;
// 	send: (data:any) => void;
// 	close: () => void;

// 	// lobby ops
// 	create: () => void;
// 	join: (lobbyid:string) => void;
// 	start: () => void;
// 	leave: () => void;

// 	// stored variables
// 	getid: () => string | undefined;

// 	// bot ops
// 	addbot: (level:number) => void;
// 	rembot: () => void;
// }

function connectsocket(
	onstart: (gameid:string) => void,
	onstate: (data:any) => void,
	onopen: (socket:WebSocket) => void): WebSocket
{
	const socket = new WebSocket(LOBBY_WEBSOCKET_URL);
	console.log("Websocketing to", LOBBY_WEBSOCKET_URL);

	socket.onopen = () => {
		console.log('Connected to lobby WebSocket');

		// join lobby if id was passed
		 /* else {
			createLobby(3, ws);
		} */

		// callback
		onopen(socket);
	};

	socket.onmessage = (event) => {
		try {
			const data = JSON.parse(event.data);
			console.log('Lobby WebSocket message received:', data);


			const method = data.method || '';
			if (method === 'START_REPLY') {
				if (data.status === 'success') onstart(data.value);
				else console.log('Failed to start lobby');
			}
			else if (method === 'JOIN_REPLY' || method === 'CREATE_REPLY') {
				if (data.status === 'success') {
					// save lobby id
					lobby_id = data.value;
				}
				else {
					console.log('Failed to create/start the lobby');
					// clear lobby id
					if (data.reason !== 'rejoin') lobby_id = undefined;
				}
			}
			else if (data.ID && data.players) {
				// save lobby id (just to be safe)
				lobby_id = data.ID;
				
				// callback
				onstate(data);
			}
			else
			{
				console.log("Received this message that I didn't understand", data);
			}
		} catch (e) {
			console.log("Error while reading:", event.data, e);
		}
	};

	socket.onerror = (error) => {
		console.error('Lobby WebSocket error:', error);

		// close socket
		socket.close();
	};

	socket.onclose = () => {
		console.log('Disconnected from lobby WebSocket');

		// reset lobbyWS
		lobbyWS = null;
	};

	return socket;
}

// This is a WebSocket wrapper that reconnects if the socket disconnects silently
export class LobbyWebSocket {
	// socket ops
	public socket: WebSocket;
	public send: (data:any) => void;
	public close: () => void;

	// lobby ops
	public create: () => void;
	public join: (lobbyid:string) => void;
	public start: () => void;
	public leave: () => void;

	// stored variables
	public getid: () => string | undefined;

	// bot ops
	public addbot: (level:number) => void;
	public rembot: () => void;

	// reenstablish the connection if websocket disconnects automatically
	private persistor: (cb: (socket:WebSocket) => void) => void;


	// the old connectLobbyWebSocket
	constructor(
		onstart: (gameid:string) => void,
		onleave: () => void,
		onstate: (data:any) => void,
		outlobbyid?:string)
	{
		// connect socket
		this.socket = connectsocket(onstart, onstate, (socket) => {
			if (outlobbyid) {
				socket.send(JSON.stringify({ method: 'JOIN', lobbyID: outlobbyid }));
			}
		});
		// setup reconnect routine
		this.persistor = (cb: (socket:WebSocket) => void) => {
			if (this.socket.readyState !== WebSocket.OPEN) {
				isauth().then(auth => {
					if (auth === true) this.socket = connectsocket(onstart, onstate, cb);
				});
			}
			else {
				cb(this.socket);
			}
		}


		/* socket operations */
		this.send = (data:any) => {
			this.persistor((socket) => {
				socket.send(JSON.stringify(data));
			});
		},
		this.close = () => {
			this.socket.close();
			lobbyWS = null;
		},
		/* player api */
		this.create = () => {
			this.send({ method: 'CREATE', format: LOBBY_FORMAT });
		},
		this.join = (lobbyid:string) => {
			this.send({ method: 'JOIN', lobbyID: lobbyid });
		},
		this.start = () => {
			this.send({ method: 'START'});
		},
		this.leave = () => {
			this.send({ method: 'LEAVE'});

			// update lobby id
			lobby_id = undefined;

			// update the state as empty
			onstate({ ID:'', players:[] });

			// call passed function
			onleave();
		},
		this.getid = () => {return lobby_id;},
		/* bot api */
		this.addbot = (level:number) => {
			this.send({ method: 'BOT', value: 'ADD', level: level });
		},
		this.rembot = () => {
			this.send({ method: 'BOT', value: 'REMOVE' });
		}
	}
}

// Singleton
let lobbyWS:LobbyWebSocket | null = null;
let lobby_id:string | undefined = undefined;


// let's build something good
export function ConnectLobbySocket(
	onstart: (gameid:string) => void,
	onleave: () => void,
	onstate: (data:any) => void,
	outlobbyid?:string
): LobbyWebSocket
{
	// if already connected don't connect
	if (lobbyWS && lobbyWS.socket.readyState === WebSocket.OPEN)
	{
		console.log('Valid lobbyWS with ids', outlobbyid, lobby_id);
		// if an outlobby id was passed
		if (outlobbyid !== undefined && outlobbyid !== lobby_id)
		{
			// leave previous lobby
			if (lobby_id !== undefined) lobbyWS.send({ method: 'LEAVE' });
			// then join the new one
			lobbyWS.send({ method: 'JOIN', lobbyID: outlobbyid});
		}
		else	// ask for the state
		{
			console.log('Asking for state');
			lobbyWS.send({ method: 'STATE' });
		}

		return lobbyWS;
	}

	// create the WebSocket
	lobbyWS = new LobbyWebSocket(onstart, onleave, onstate, outlobbyid);

	return lobbyWS;
}

// if you just need to disconnect
export function DisconnectLobbySocket() {
	lobbyWS?.close();
	lobbyWS = null;
}

// // let's build something good
// export function ConnectLobbySocket(
// 	onstart: (gameid:string) => void,
// 	onleave: () => void,
// 	onstate: (data:any) => void,
// 	outlobbyid?:string
// ): LobbyWebSocket
// {
// 	// if already connected don't connect
// 	if (lobbyWS && lobbyWS.socket.readyState === WebSocket.OPEN)
// 	{
// 		console.log('Valid lobbyWS with ids', outlobbyid, lobby_id);
// 		// if an outlobby id was passed
// 		if (outlobbyid !== undefined && outlobbyid !== lobby_id)
// 		{
// 			// leave previous lobby
// 			if (lobby_id !== undefined) lobbyWS.send({ method: 'LEAVE' });
// 			// then join the new one
// 			lobbyWS.send({ method: 'JOIN', lobbyID: outlobbyid});
// 		}
// 		else	// ask for the state
// 		{
// 			console.log('Asking for state');
// 			lobbyWS.send({ method: 'STATE' });
// 		}

// 		return lobbyWS;
// 	}

// 	// create the WebSocket
// 	const socket = connectsocket(onstart, onstate, outlobbyid);

// 	// assign lobbyWS
// 	lobbyWS = {
// 		socket: socket,

// 		/* socket */
// 		send: (data:any) => {
// 			if (socket.readyState === WebSocket.OPEN) {
// 				socket.send(JSON.stringify(data));
// 			}
// 		},
// 		close: () => socket.close(),
// 		/* player api */
// 		create: () => {
// 			if (socket.readyState === WebSocket.OPEN) {
// 				socket.send(JSON.stringify({ method: 'CREATE', format: LOBBY_FORMAT }));
// 			}
// 		},
// 		join: (lobbyid:string) => {
// 			if (socket.readyState === WebSocket.OPEN) {
// 				socket.send(JSON.stringify({ method: 'JOIN', lobbyID: lobbyid }));
// 			}
// 		},
// 		start: () => {
// 			if (socket.readyState === WebSocket.OPEN) {
// 				socket.send(JSON.stringify({ method: 'START' }));
// 			}
// 		},
// 		leave: () => {
// 			if (socket.readyState === WebSocket.OPEN) {
// 				socket.send(JSON.stringify({ method: 'LEAVE' }));
// 			}

// 			// update lobby id
// 			lobby_id = undefined;

// 			// update the state as empty
// 			onstate({ ID:'', players:[] });

// 			// call passed function
// 			onleave();
// 		},
// 		getid: () => {return lobby_id;},
// 		/* bot api */
// 		addbot: (level:number) => {
// 			if (socket.readyState === WebSocket.OPEN) {
// 				socket.send(JSON.stringify({ method: 'BOT', value: 'ADD', level: level }));
// 			}
// 		},
// 		rembot: () => {
// 			if (socket.readyState === WebSocket.OPEN) {
// 				socket.send(JSON.stringify({ method: 'BOT', value: 'REMOVE' }));
// 			}
// 		}
// 	}

// 	// build LobbyWebSocket
// 	return lobbyWS;
// }

// // if you just need to disconnect
// export function DisconnectLobbySocket() {
// 	lobbyWS?.close();
// 	lobbyWS = null;
// }