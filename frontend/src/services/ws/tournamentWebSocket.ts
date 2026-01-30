/* --------------------------------------------------------- */
/*				  SINGLETON SOCKET CONNECTION				 */

// services
import { isauth } from "@services/api/isauth";
import { toastNotification } from "@services/toastNotification";

// URLs and other constants
const TOURNAMENT_WEBSOCKET_URL = `/ws/tournament`;
const TOURNAMENT_FORMAT = 'single-eliminatin';


function connectsocket(onopen: (socket:WebSocket) => void, onerr?: (err:any) => void): WebSocket
{
	const socket = new WebSocket(TOURNAMENT_WEBSOCKET_URL);
	console.log("Websocketing to", TOURNAMENT_WEBSOCKET_URL);

	socket.onopen = () => {
		console.log('Connected to tournament WebSocket');

		onopen(socket);
	};

	socket.onerror = (error) => {
		console.error('Tournament WebSocket error:', error);

		// onerr callback
		onerr?.(error);

		// close socket
		socket.close();
	};

	socket.onclose = () => {
		console.log('Disconnected from Tournament WebSocket');

		// reset tournamentWS every time the websocket is disconnected
		tournamentWS = null;
	};

	return socket;
}

export class TournamentWebSocket {
	// socket ops
	public socket: WebSocket | null;
	public send: (data:any) => void;
	public close: () => void;

	// ping-pong logic
	private ping:any;

	// state setter (to setup later)
	public onmessage: (
			onstart?: (gameid:string) => void,
			onjoin?: (tournamentid:string) =>void,
			onstate?: (state:any) => void
		) => void;

	// tournament ops
	public create: (size:number, format?:string) => void;
	public join: (tournament:string) => void;
	public ready: () => void;
	public leave: () => void;

	// stored variables
	public getid: () => string | undefined;

	// bot ops
	public addbot: (level:number) => void;
	public rembot: () => void;

	// re-enstablish the connection if websocket disconnects automatically
	private persistor: (cb: (socket:WebSocket) => void) => void;

	// the old ConnectTournamentSocket
	constructor(
		ouTournamentId?:string,
		onleave?: () => void,
		onerr?: (err:any) => void
	)
	{
		// connect socket
		this.socket = connectsocket((socket) => {
			if (ouTournamentId) {
				socket.send(JSON.stringify({ method: 'JOIN', tournamentID: ouTournamentId }));
			}
		}, onerr);
		// setup reconnect routine
		this.persistor = (cb: (socket:WebSocket) => void) => {
			if (this.socket?.readyState !== WebSocket.OPEN) {
				isauth().then(auth => {
					if (auth === true) this.socket = connectsocket(cb, onerr);
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


		/* functions definition */
		/* socket */
		this.send = (data:any) => {
			this.persistor((socket) => {
				socket.send(JSON.stringify(data));
			});
		},
		this.close = () => {
			clearInterval(this.ping);
			this.socket?.close();
			tournamentWS = null;
		},
		
		/* player api */
		this.onmessage = (onstart, onjoin, onstate) => {
			if (this.socket) this.socket.onmessage = (event) => {
				try {
					// pong logic
					if (event.data.toString() === 'pong') {
						/* #debug */
						// console.log('We Tournament PONG-ing');
						return ;
					}

					// actual tournament operation
					const data = JSON.parse(event.data);
					console.log('Tournament WebSocket message received:', data);

					// get method
					const method = data.method || undefined;

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
					// tnot handled method
					else if (method === undefined) throw new Error("Didn't understand message");
				} catch (e) {
					console.warn("Error while reading:", event.data, e);
					onerr?.(e);
				}
			};
		},
		this.create = (size:number) => {
			this.send({ method: 'CREATE', size: size, format: TOURNAMENT_FORMAT });
		},
		this.join = (tournamentid:string) => {
			this.send({ method: 'JOIN', tournamentID: tournamentid });
		},
		this.ready = () => {
			this.send({ method: 'READY' });
		},
		this.leave = () => {
			this.send({ method: 'LEAVE' });

			// update tournament_id
			tournament_id = undefined;

			// callback
			onleave?.();
		},
		this.getid = () => {return tournament_id;},
		/* bot api */
		this.addbot = (level:number) => {
			this.send({ method: 'BOT', value: 'ADD', level: level });
		},
		this.rembot = () => {
			this.send({ method: 'BOT', value: 'REMOVE' });
		}

		// start ping-poning
		ping();

	}
}

// Singleton
let tournamentWS:TournamentWebSocket | null = null;
let tournament_id:string | undefined = undefined;

// let's build something good
export function ConnectTournamentSocket(
	ouTournamentId?:string,
	onleave?: () => void,
	onerr?: (err:any) => void	
): TournamentWebSocket
{
	// if already connected don't connect
	if (tournamentWS && tournamentWS.socket?.readyState === WebSocket.OPEN)
	{
		// if an outournament id was passed
		if (ouTournamentId !== undefined && ouTournamentId !== tournament_id)
		{
			// notify the error
			toastNotification.error('Already in a Toruament', 'You must leave a tournament before joining a new one', 10000);
		}
		else
		{
			console.log('Asking for state');
			tournamentWS.send({ method: 'STATE' });
		}

		return tournamentWS;
	}

	tournamentWS = new TournamentWebSocket(ouTournamentId, onleave, onerr);

	// return socket
	return tournamentWS
}

// if you just want to close the websocket
export function DisconnectTournamentSocket() {
	tournamentWS?.close();
	tournamentWS = null;
}