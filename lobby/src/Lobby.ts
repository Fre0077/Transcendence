/* ----------------- */
/* ----------------- */
/* ----------------- */

import { v4 as uuidv4 } from "uuid";
// import { WebSocket } from "ws";

// just for this usecase
const OPEN = WebSocket.OPEN;

interface MySocket {
	close(): void;
	send(message:string): void;
	readyState:number;
}


/* PLAYER CLASS
Socket operaitions only inside here */
class Player<T extends MySocket>
{
	private _status: "connected" | "away" | "disconnected";
	private _socket:T | null;

	constructor(__socket:T | null)
	{
		this._status = "connected";
		this._socket = __socket;
	}

	// get the status outside
	public get status() {
		return this._status;
	}

	// disconnect the player
	public disconnect()
	{
		if (this._status === "disconnected") return;

		// close socket...
		if (this._socket !== null) this._socket.close();
		//... and set status
		this._status = "disconnected";
	}

	// go away!!
	public away()
	{
		if (this._status === "away") return;

		// close socket...
		// this._socket.close();
		//... and set status
		this._status = "away";
	}

	// update socket
	public connect(__socket:T | null | void)
	{
		if (__socket) {this._socket = __socket};
		this._status = "connected";
	}

	// send message
	public send(message:string)
	{
		if (this._socket !== null && this._socket.readyState === OPEN) {
			this._socket.send(message);
		};
	}

	// returns the state of the socket
	public get state() {
		return this._socket?.readyState;
	}
}

/* what you will receive from the /your-lobby endpoint @aleborghi */
interface LobbyState {
	ID:string;
	gameID:string;
	players: {
		ID:string;
		status:string;
	}[];
}


/* LOBBY CLASS */

export class Lobby<T extends MySocket> {
	// lobby specs
	private _size:number;		// number of players

	private _ingame:boolean;	// are the player playing?
	private _gameID:string;

	// lobby's unique codes
	private readonly _ID:string;

	private _players:Map<string, Player<T>>;	// unique identifier for each player, sent at th beginning of every move. NOTE: the ID is generated when the websocket is connected
	
	constructor(__size:number = 2) {
		this._size = __size;					// 2 player

		this._ID = uuidv4();					// lobby code generator.
		this._players = new Map();

		this._ingame = false;
		this._gameID = "empty";
	}

	/* ========== GETTERS ========= */
	// getter of ID
	public get ID():string {
		return this._ID;
	}

	// getter of gameID
	public get gameID():string {
		return this._gameID;
	}

	// getter of ingame
	public get ingame(): boolean {
		return this._ingame;
	}

	// getter of ingame
	public get players(): Map<string, Player<T>> {
		return this._players;
	}

	// Lobby state to the frontend
	public get state(): LobbyState {
		const players = Array.from(this._players, ([id, player]) => ({
			ID: id,
			status: player.status,
		}));

		const state = {
			ID: this._ID,
			gameID: this._gameID,
			ingame: this._ingame,
			players: players
		};

		return state;
	}

	public get stateJSON():string {
		return JSON.stringify(this.state);
	}

	/* ---------------------------------------------- */

	// return true if the lobby is full, false if it isn't... duh?
	public full(): boolean {
		if (this._players.size === this._size) return true;
		else return false
	}

	// is the player in the lobby?
	public has(player:string): boolean {
		return this._players.has(player);
	}

	// return true if the empty is full, false if it isn't... are you dumb?
	public empty(): boolean {
		if (this._players.size === 0) return true;
		else return false;
	}

	/* ----------------------------------------------------- */
	/* -------------- LOBBY STATUS OPERATIONS -------------- */
	/* ----------------------------------------------------- */

	// startup procedure if we reached the number of players
	public async launch(callback: (gameID:string, players:string[]) => Promise<boolean>):
		Promise<{ status: 'success' | 'failure', reason:string }>
	{
		// is lobby full?
		if (this.full() === false) {
			return {
				status: 'failure',
				reason: "Lobby not full"
			};
		}

		// check if all the players are connected
		this._players.forEach((player) => {
			if (player.status !== "connected") {
				return {
					status: 'failure',
					reason: "Not all players connected"
				};
			}
		});

		// ! ! ! CREATING GAME ID ! ! ! 
		this._gameID = uuidv4();


		// Prepare object to send to GameService
		const players = Array.from(this._players.keys());

		// callback for external porpouses (send to GameService)
		if (await callback(this._gameID, players) === false) {
			this._gameID = "empty";
			return {
				status: 'failure',
				reason: "Failed to connect to the Service"
			};
		}

		// YEA BOYY
		this._ingame = true;

		// set all the players to away
		this._players.forEach((player) => {
			player.away();
		});

		return {
			status: 'success',
			reason: "Lobby launched successfully"
		};
	}

	// reset the lobby
	public reset() {
		if (this._ingame == false) {return ;}

		// no game linked to lobby
		this._gameID = "empty";
		this._ingame = false;

		// if the socket is still open, set the players to connected
		this._players.forEach((player) => {
			if (player.state === OPEN) {
				player.connect();
			}
		});
	}

	// cleanup procedure if no player in lobby
	private close() {
		if (this._ingame === true) {return ;}

		this._players.forEach((player, ID) => {
			player.disconnect();
			this._players.delete(ID);
		});

		console.log(`Closing lobby ${this._ID} ...`);
	}

	/* ----------------------------------------------------- */
	/* ------------------ USER MANAGEMENT ------------------ */
	/* ----------------------------------------------------- */

	// function to join the lobby, syntax: 'playerID'
	public join(outPlayerID:string, ws:T | null): boolean {
		// if (this._ingame === true) {return false;}

		const target = this._players.get(outPlayerID);
		// check if player already in
		if (target !== undefined)
		{
			if (target.status === "connected")
			{
				console.log('Player already joined');
				return false;
			}
			else
			{
				// add player
				this._players.set(outPlayerID, new Player(ws));
				return true;
			}
		}

		// check if lobby is full
		if (this._players.size === this._size)
		{
			console.log('The lobby is full');
			return false;
		}

		// add player
		this._players.set(outPlayerID, new Player(ws));

		return true;
	}


	// The player temporarly left the lobby
	// (connection closed but still inside the lobby)
	public disconnect(playerID:string): boolean
	{
		// check if the player is inside
		const player = this._players.get(playerID);
		if (player === undefined)
		{
			console.log(`player '${playerID}' not in the lobby`);
			return false;
		}

		// disconnect player
		if (this._ingame === false) player.disconnect();
		if (this._ingame === true) player.away();
	
		return true;
	}


	// Remove a player from the lobby
	public leave(playerID:string): boolean
	{
		// check if the player is inside
		const player = this._players.get(playerID);
		if (player === undefined)
		{
			console.log(`player '${playerID}' not in the lobby`);
			return false;
		}

		// disconnect player ...
		player.disconnect();
		//... and remove from lobby
		this._players.delete(playerID);

		// logging
		console.log(`${playerID} left the lobby...`);

		// close the lobby if the last player left
		if (this._players.size === 0) this.close();
		return true;
	}

	// broadcast a message to the whole lobby
	public broadcast(message:string)
	{
		this._players.forEach((player) => {
			player.send(message);
		});
	}

}