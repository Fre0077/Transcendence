/* --------------------------------------------------------- */
/*				  SINGLETON SOCKET CONNECTION				 */

// services
import { isauth } from "@services/api/isauth";

// URLs and other constants
const LOBBY_WEBSOCKET_URL = `/ws/lobby`;
const LOBBY_FORMAT = 3;


function connectsocket(
	onstart: (gameid:string) => void,
	onstate: (data:any) => void,
	onopen: (socket:WebSocket) => void,
	onerr?: (err:any) => void): WebSocket
{
	const socket = new WebSocket(LOBBY_WEBSOCKET_URL);
	console.log("Websocketing to", LOBBY_WEBSOCKET_URL);

	socket.onopen = () => {
		console.log('Connected to lobby WebSocket');

		// callback
		onopen(socket);
	};

	socket.onmessage = (event) => {
		try {
			// pong logic
			if (event.data.toString() === 'pong') {
				/* #debug */
				// console.log('We Lobby PONG-ing');
				return ;
			}

			// actual lobby operation
			const data = JSON.parse(event.data);
			console.log('Lobby WebSocket message received:', data);

			const method = data.method || undefined;
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
			else if (method === undefined) throw new Error("Didn't understand message");
		} catch (e) {
			console.warn("Error while reading:", event.data, e);
			onerr?.(e);
		}
	};

	socket.onerror = (error) => {
		console.error('Lobby WebSocket error:', error);

		// error callback
		onerr?.(error);

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

	// ping-pong logic
	private ping:any;

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

	// re-enstablish the connection if websocket disconnects automatically
	private persistor: (cb: (socket:WebSocket) => void) => void;


	// the old connectLobbyWebSocket
	constructor(
		onstart: (gameid:string) => void,
		onleave: () => void,
		onstate: (data:any) => void,
		outlobbyid?:string,
		onerr?: (err:any) => void)
	{
		// connect socket
		this.socket = connectsocket(onstart, onstate, (socket) => {
			if (outlobbyid) {
				socket.send(JSON.stringify({ method: 'JOIN', lobbyID: outlobbyid }));
			}
		}, onerr);
		// setup reconnect routine
		this.persistor = (cb: (socket:WebSocket) => void) => {
			if (this.socket.readyState !== WebSocket.OPEN) {
				isauth().then(auth => {
					if (auth === true) this.socket = connectsocket(onstart, onstate, cb, onerr);
				});
			}
			else {
				cb(this.socket);
			}
		}


		/* define ping-pong logic */
		const ping = () => {

			this.ping = setTimeout(() => {
				if (this.socket?.readyState === WebSocket.OPEN) {
					this.socket.send('ping');
				}
				// loop back
				ping();

			// ping every 20s
			}, 20_000);
		}


		/* socket operations */
		this.send = (data:any) => {
			this.persistor((socket) => {
				socket.send(JSON.stringify(data));
			});
		},
		this.close = () => {
			clearInterval(this.ping);
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

		// loop the ping pong
		ping();

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
			if (lobby_id !== undefined) lobbyWS.leave();
			// then join the new one
			lobbyWS.join(outlobbyid);
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