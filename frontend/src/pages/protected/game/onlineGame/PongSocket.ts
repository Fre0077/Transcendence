
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
	onmessage(handler: (state: any) => void, secretary: (message:any) => void): void;
	close(): void;
}

// behaviour of the player socket
export function createPlayerSocket(ws: WebSocket, playerid:string): PongSocket
{
	return {
		send(data) {
			ws.send(JSON.stringify(data));
		},
		onmessage(handler) {
			ws.onmessage = (e) => {
				const msg = JSON.parse(e.data);
				handler(msg);
			};
		},
		close() {
			ws.close();
		}
	};
}

// behaviour of the spectator socket
export function createSpectatorSocket(ws: WebSocket, playerid:string, matchid:string): PongSocket
{
	return {
		// data
		playerid: playerid,
		matchid:matchid,

		// function
		handshake() {
			ws.send(JSON.stringify({ method: 'AUTH', playerID: playerid }));
			ws.send(JSON.stringify({ method: 'SPECTATE', value: matchid }));
		},
		send(data) {
			ws.send(JSON.stringify(data));
		},
		onmessage(handler) {
			ws.onmessage = (e) => {
				const state = JSON.parse(e.data);
				handler(state);
			};
		},
		close() {
			ws.close();
		}
	};
}