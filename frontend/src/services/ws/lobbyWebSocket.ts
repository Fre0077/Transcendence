/* --------------------------------------------------------- */
/*				  SINGLETON SOCKET CONNECTION				 */

const LOBBY_WEBSOCKET_URL = `ws://${window.location.hostname}:3029/ws/lobby`;

const LOBBY_FORMAT = 3;

export interface LobbyWebSocket {
	// socket ops
	socket: WebSocket,
	send: (data:any) => void,
	close: () => void,

	// lobby ops
	create: () => void,
	join: (lobbyid:string) => void,
	start: () => void,
	leave: () => void,

	// stored variables
	getid: () => string | undefined,

	// bot ops
	addbot: (level:number) => void,
	rembot: () => void,
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
	if (lobbyWS && lobbyWS.socket.readyState === WebSocket.OPEN) return lobbyWS;

	const socket = new WebSocket(LOBBY_WEBSOCKET_URL);
	console.log("Websocketing to", LOBBY_WEBSOCKET_URL);

	socket.onopen = () => {
		console.log('Connected to lobby WebSocket');

		// join lobby if id was passed
		if (outlobbyid) {
			socket.send(JSON.stringify({ method: 'JOIN', lobbyID: outlobbyid }));
		} /* else {
			createLobby(3, ws);
		} */
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
				else console.log('Failed to start lobby');
			}
			else if (data.ID && data.players) onstate(data);
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


	// build LobbyWebSocket
	return {
		socket: socket,

		/* socket */
		send: (data:any) => {
			if (socket.readyState === WebSocket.OPEN) {
				socket.send(JSON.stringify(data));
			}
		},
		close: () => socket.close(),
		/* player api */
		create: () => {
			if (socket.readyState === WebSocket.OPEN) {
				socket.send(JSON.stringify({ method: 'CREATE', format: LOBBY_FORMAT }));
			}
		},
		join: (lobbyid:string) => {
			if (socket.readyState === WebSocket.OPEN) {
				socket.send(JSON.stringify({ method: 'JOIN', lobbyID: lobbyid }));
			}
		},
		start: () => {
			if (socket.readyState === WebSocket.OPEN) {
				socket.send(JSON.stringify({ method: 'START' }));
			}
		},
		leave: () => {
			if (socket.readyState === WebSocket.OPEN) {
				socket.send(JSON.stringify({ method: 'LEAVE' }));
			}

			// update lobby id
			lobby_id = undefined;

			// update the state as empty
			onstate({ ID:'', players:[] });

			// call passed function
			onleave();
		},
		getid: () => {return lobby_id;},
		/* bot api */
		addbot: (level:number) => {
			if (socket.readyState === WebSocket.OPEN) {
				socket.send(JSON.stringify({ method: 'BOT', value: 'ADD', level: level }));
			}
		},
		rembot: () => {
			if (socket.readyState === WebSocket.OPEN) {
				socket.send(JSON.stringify({ method: 'BOT', value: 'REMOVE' }));
			}
		}
	}
}

// if you just need to disconnect
export function DisconnectLobbySocket() {
	lobbyWS?.close();
}