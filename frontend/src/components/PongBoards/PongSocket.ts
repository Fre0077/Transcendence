
// interface Handler {
// 	updater(state:any): void;
// 	secretary(message:any): void;
// }

// PongSocket.ts
export interface PongSocket {
	playerid:string;
	matchid?:string;
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
	const method = data.method;
	
	if (method === 'AUTH_REPLY')
	{
		if (data.status === "success") console.log("Authenticated successfully");
		else if (data.status === "failure")
		{
			console.log("Couldn't Authenticate to Game Service");

			// stop this shit??
			ws.close(); // #todo maybe not?
		}
	}
}

// behaviour of the player socket
export function createPlayerSocket(ws: WebSocket, playerid:string): PongSocket
{
	return {
		// data
		playerid: playerid,

		// functions
		handshake() {
			sleep(1100)
			.then(() => ws.send(JSON.stringify({ method: 'AUTH', playerID: playerid })));
		},
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
		}
	};
}


/* --------------------------------------- */
/* 			  SPECTATOR SOCKET			   */
/* --------------------------------------- */


// already parsed message
const spectateSecretary = (data:any, ws:WebSocket) => {
	const method = data.method;
	if (method === 'AUTH_REPLY')
	{
		if (data.status === "success") console.log("Authenticated successfully");
		else if (data.status === "failure")
		{
			console.log("Couldn't Authenticate to Game Service");

			// stop this shit??
			ws.close();
		}
	}
}

// behaviour of the spectator socket
export function createSpectatorSocket(ws: WebSocket, playerid:string, matchid:string): PongSocket
{
	return {
		// data
		playerid: playerid,
		matchid: matchid,

		// functions
		handshake() {
			sleep(1100)
			.then(() => {
				ws.send(JSON.stringify({ method: 'AUTH', playerID: playerid }));
				ws.send(JSON.stringify({ method: 'SPECTATE', value: matchid }));
			});
		},
		send(data) {
			ws.send(JSON.stringify(data));
		},
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
		}
	};
}