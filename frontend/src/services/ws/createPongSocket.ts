
// interface Handler {
// 	updater(state:any): void;
// 	secretary(message:any): void;
// }


const PONG_BACKEND_URL = `ws://${window.location.hostname}:3029/ws/pong`;

// PongSocket.ts
export interface PongSocket {
	socket:WebSocket;
	matchid?:string;
	replay?:string;
	send(data: unknown): void;
	handshake(): void;
	onmessage(handler: (state: any, /* ... */) => void): void;
	close(): void;
}

// HELPER
function sleep(ms:number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/* --------------------------------------- */
/* 				PLAYER SOCKET			   */
/* --------------------------------------- */

// already parsed message
const playerSecretary = (data:any, ws:WebSocket) => {
	console.log('Player Socket got', data);
	ws;
}

let playerWS:PongSocket | null = null;

// behaviour of the player socket
export function createPlayerSocket(): PongSocket
{
	if (playerWS && playerWS.socket.readyState === WebSocket.OPEN) {
		return playerWS;
	}

	const ws = new WebSocket(`${PONG_BACKEND_URL}/play`);

	playerWS = {
		socket:ws,
		// data
		// playerid: playerid,

		// functions
		handshake() {},
		send(data) {
			ws.send(JSON.stringify(data));
		},
		onmessage(handler) {
			ws.onmessage = (e) => {
				try {
					const msg = JSON.parse(e.data);
					
					/* #debug */
					// console.log('Msg received', msg);

					if (msg.method) playerSecretary(msg, ws);
					else handler(msg);
				} catch (err) {
					// console.log(err);
				}
			};
		},
		close() {
			ws.close();
			playerWS = null;
		}
	};

	return playerWS;
}


/* --------------------------------------- */
/* 			  SPECTATOR SOCKET			   */
/* --------------------------------------- */


// already parsed message
const spectateSecretary = (data:any, ws:WebSocket) => {
	console.log('Spectator Socket got', data);
	ws;
}

let spectatorWS:PongSocket | null = null;

// behaviour of the spectator socket
export function createSpectatorSocket(/* , playerid:string */matchid:string): PongSocket
{
	if (spectatorWS && spectatorWS.socket.readyState === WebSocket.OPEN) {
		return spectatorWS;
	}

	const ws = new WebSocket(`${PONG_BACKEND_URL}/spectate`);

	spectatorWS = {
		socket:ws,
		// data
		// playerid: playerid,
		matchid: matchid,

		// functions
		handshake() {
			sleep(200)
			.then(() => {
				ws.send(JSON.stringify({ matchid: matchid }));
			});
		},
		send() {},
		onmessage(handler) {
			ws.onmessage = (e) => {
				try {
					const msg = JSON.parse(e.data);

					/* #debug */
					// console.log('Msg received', msg);

					if (msg.method) spectateSecretary(msg, ws);
					else handler(msg);
				} catch (err) {
					// console.log(err);
				}
			};
		},
		close() {
			ws.close();
			spectatorWS = null;
		}
	};

	return spectatorWS;
}

/* --------------------------------------- */
/* 			  SPECTATOR SOCKET			   */
/* --------------------------------------- */


// already parsed message
const replaySecretary = (data:any, ws:WebSocket) => {
	console.log('Spectator Socket got', data);
	ws;
}

let replayWS:PongSocket | null = null;

// behaviour of the spectator socket
export function createReplaySocket(/* , playerid:string */replaystring:string): PongSocket
{
	if (replayWS && replayWS.socket.readyState === WebSocket.OPEN) {
		return replayWS;
	}

	const ws = new WebSocket(`${PONG_BACKEND_URL}/replay`);

	replayWS = {
		socket: ws,
		// data
		replay:replaystring,

		// functions
		handshake() {
			sleep(200)
			.then(() => {
				ws.send(replaystring);
			});
		},
		send() {},
		onmessage(handler) {
			ws.onmessage = (e) => {
				try {
					const msg = JSON.parse(e.data);

					/* #debug */
					// console.log('Msg received', msg);

					if (msg.method) replaySecretary(msg, ws);
					else handler(msg);
				} catch (err) {
					// console.log(err);
				}
			};
		},
		close() {
			ws.close();
			replayWS = null;
		}
	};

	return replayWS;
}