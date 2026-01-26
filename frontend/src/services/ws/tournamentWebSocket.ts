/* --------------------------------------------------------- */
/*				  SINGLETON SOCKET CONNECTION				 */

import { toastNotification } from "@services/toastNotification";

const TOURNAMENT_WEBSOCKET_URL = `/ws/tournament`;

const TOURNAMENT_FORMAT = 'single-eliminatin';

export interface TournamentWebSocket {
	// socket ops
	socket: WebSocket,
	send: (data:any) => void,
	close: () => void,

	// state setter (to setup later)
	onmessage: (
			onstart?: (gameid:string) => void,
			onjoin?: (tournamentid:string) =>void,
			onstate?: (state:any) => void
		) => void,

	// tournament ops
	create: (size:number, format?:string) => void,
	join: (tournament:string) => void,
	ready: () => void,
	leave: () => void,

	// stored variables
	getid: () => string | undefined,

	// bot ops
	addbot: (level:number) => void,
	rembot: () => void,
}

// Singleton
let tournamentWS:TournamentWebSocket | null = null;
let tournament_id:string | undefined = undefined;

// let's build something good
export function ConnectTournamentSocket(
	onleave?: () => void,
	ouTournamentId?:string
): TournamentWebSocket
{
	// if already connected don't connect
	if (tournamentWS && tournamentWS.socket.readyState === WebSocket.OPEN)
	{
		// if an outournament id was passed
		if (ouTournamentId !== undefined)
		{
			// notify the error
			toastNotification.error('Already in a Toruament', 'You must leave a tournament before joining a new one', 10000);
		}

		return tournamentWS;
	}

	const socket = new WebSocket(TOURNAMENT_WEBSOCKET_URL);
	console.log("Websocketing to", TOURNAMENT_WEBSOCKET_URL);

	socket.onopen = () => {
		console.log('Connected to tournament WebSocket');

		// join lobby if id was passed
		if (ouTournamentId) {
			socket.send(JSON.stringify({ method: 'JOIN', tournamentID: ouTournamentId }));
		} /* else {
			createLobby(3, ws);
		} */
	};

	socket.onerror = (error) => {
		console.error('Lobby WebSocket error:', error);

		// close socket
		socket.close();
	};

	socket.onclose = () => {
		console.log('Disconnected from lobby WebSocket');

		// reset tournamentWS every time the websocket is disconnected
		tournamentWS = null;
	};



	// build&assign lobbyWS
	tournamentWS = {
		socket: socket,

		/* socket */
		send: (data:any) => {
			if (socket.readyState === WebSocket.OPEN) {
				socket.send(JSON.stringify(data));
			}
		},
		close: () => socket.close(),
		
		/* player api */
		onmessage: (onstart, onjoin, onstate) => {
			socket.onmessage = (event) => {
				try {
					const data = JSON.parse(event.data);
					console.log('Tournament WebSocket message received:', data);

					// get method
					const method = data.method || '';

					// successful START reply
					if (method === 'START_REPLY') {
						if (data.status === 'success') onstart?.(data.value);
						else console.log('Failed to start room');
					}
					// successful JOIN reply
					else if (method === 'JOIN_REPLY') {
						if (data.status === 'success') {
							// save tournament id
							tournament_id = data.value;

							// callback
							onjoin?.(data.value);
						}
						else {
							console.log('Failed to join tourament');

							// clear tournament id
							tournament_id = undefined;
						}
					}
					// successful CREATE reply
					else if (method === 'CREATE_REPLY') {
						if (data.status === 'success') {
							// save tournament id
							tournament_id = data.value;

							// callback
							onjoin?.(data.value);
						}
						else console.log('Failed to create tourament');
					}
					// 
					else if (data.ID && data.players) {
						// save tournament id (just to be safe)
						tournament_id = data.ID;

						// callback
						onstate?.(data);
					}
					else
					{
						console.log("Received this message that I didn't understand", data);
					}
				} catch (e) {
					console.log("Error while reading:", event.data, e);
				}
			};
		},
		create: (size:number) => {
			if (socket.readyState === WebSocket.OPEN) {
				socket.send(JSON.stringify({ method: 'CREATE', size: size, format: TOURNAMENT_FORMAT }));
			}
		},
		join: (lobbyid:string) => {
			if (socket.readyState === WebSocket.OPEN) {
				socket.send(JSON.stringify({ method: 'JOIN', lobbyID: lobbyid }));
			}
		},
		ready: () => {
			if (socket.readyState === WebSocket.OPEN) {
				socket.send(JSON.stringify({ method: 'READY' }));
			}
		},
		leave: () => {
			if (socket.readyState === WebSocket.OPEN) {
				socket.send(JSON.stringify({ method: 'LEAVE' }));
			}

			// update tournament_id
			tournament_id = undefined;

			// callback
			onleave?.();
		},
		getid: () => {return tournament_id;},
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

	// return socket
	return tournamentWS
}

// if you just want to close the websocket
export function DisconnectTournamentSocket() {
	tournamentWS?.close();
	tournamentWS = null;
}