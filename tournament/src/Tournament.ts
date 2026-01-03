/* ----------------- */
/* ----------------- */
/* ----------------- */

import { triggerAsyncId } from "node:async_hooks";
import { captureRejectionSymbol } from "node:events";
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
	private _status: "connected" | "ready" | "away" | "disconnected";
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

	// get ready
	public ready()
	{
		if (this._status === "ready") return;

		// close socket...
		// this._socket.close();
		//... and set status
		this._status = "ready";
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

// interface MyPlayer {
// 	player:Player<WebSocket>;
// 	room:number;
// }

/* what you will receive from the /your-lobby endpoint @aleborghi */
interface TournamentState {
	ID:string;
	// gameID:string;
	players: {
		ID:string;
		status:string;
	}[];
}

class Room {
	public gameid:string = uuidv4();
	public ingame:boolean = false;
	public played:boolean = false;
	public players:Map<string, boolean> = new Map();	// id: ready/not-ready
	public score:number[] = [];							// array of nums

	public has(playerid:string) {
		return this.players.has(playerid);
	}
}

/* LOBBY CLASS */

export class Tournament<T extends MySocket> {
	// tournament specs
	private _size:number;		// number of players
	private	_rsize:number;		// number of players per room

	// private _ingame:boolean;	// are the player playing?
	// private _gameID:string;
	private	_closed:boolean;

	// tournament's unique code
	private readonly _ID:string;

	private _players:Map<string, Player<T>>;	// unique identifier for each player, sent at th beginning of every move. NOTE: the ID is generated when the websocket is connected
	private _rooms:Map<number, Room>;			// each room has multiple players
	
	constructor(__size:number = 3, __rsize = 2) {
		this._size = __size;					// 2 player
		this._rsize = __rsize;
		this._closed = false;

		this._ID = uuidv4();					// lobby code generator.
		this._players = new Map();
		this._rooms = new Map();

		// this._ingame = false;
		// this._gameID = "empty";
	}

	/* ========== GETTERS ========= */
	// getter of ID
	public get ID():string {
		return this._ID;
	}

	private room(idx:number) {
		return this._rooms.get(idx);
	}

	private roomOf(playerid:string): number | undefined
	{
		for (const [idx, room] of this._rooms)
		{
			if (room.has(playerid)) return idx;
		}

		return undefined;
	}

	// getter of gameID
	/* public get gameID():string {
		return this._gameID;
	}

	// getter of ingame
	public get ingame(): boolean {
		return this._ingame;
	} */

	// getter of ingame
	public get players(): Map<string, Player<T>> {
		return this._players;
	}

	// Lobby state to the frontend
	public get state(): TournamentState {
		const players = Array.from(this._players, ([id, player]) => ({
			ID: id,
			status: player.status,
		}));

		const state = {
			ID: this._ID,
			/* gameID: this._gameID,
			ingame: this._ingame, */
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

	/* ---------------------------------------------------- */
	/* ----------- TOURNAMENT STATUS OPERATIONS ----------- */
	/* ---------------------------------------------------- */

	// startup procedure for a room if the room is full
	private async playRoom(idx:number, callback: (gameID:string, players:string[]) => Promise<boolean>):
		Promise<{ status: 'success' | 'failure', reason:string }>
	{
		// check if the tournament is closed
		if (this._closed === false) {
			return {
				status: 'failure',
				reason: "Tournament not closed"
			};
		}

		// get the room idx'ed
		const room = this.room(idx);
		if (room === undefined) {
			return {
				status: 'failure',
				reason: "Room not found"
			};
		}

		// check if room already played
		if (room.played === true) {
			return {
				status: 'failure',
				reason: "Room already played"
			};
		}

		// is room full?
		if (room.players.size !== this._rsize) {
			return {
				status: 'failure',
				reason: "Room not full"
			};
		}

		// check if all the players are connected
		room.players.forEach((ready, player) => {
			const p = this._players.get(player);
			if (p?.status !== "connected" || ready === false) {
				return {
					status: 'failure',
					reason: "Not all players connected, or ready"
				};
			}
		});

		// Prepare object to send to GameService
		const players = Array.from(this._players.keys());

		// callback for external porpouses (send to GameService)
		if (await callback(room.gameid, players) === false) {
			// room.gameID = "empty";
			return {
				status: 'failure',
				reason: "Failed to connect to the Game Service"
			};
		}

		// YEA BOYY
		room.ingame = true;

		// set all the players to away
		for (let [id, ready] of room.players.entries())
		{
			ready = false;	//maybe it doesn't work
			this._players.get(id)?.away();

		}

		return {
			status: 'success',
			reason: "Room launched successfully"
		};
	}

	// reset the lobby
	@SyncTournament
	public finalizeRoom(idx:number)
	{
		// gets the room
		const room = this.room(idx);
		if (room === undefined) {
			console.log('Error: Room not found');
			return ;
		}

		// check if room already played
		if (room.played === true) {
			console.log('Error: Room already played');
			return ;
		}

		// check if not ingame
		if (room.ingame === false) {
			console.log('Error: Room not in-game');
			return ;
		}

		// #todo
		// 1. read the game outcome from bunny (callback maybe?)
		// 2. write the score
		// 3. move players accordingly

		// no game linked to lobby
		room.ingame = false;
		room.played = true;

		// if the socket is still open, set the players to connected
		// set all the players to away
		/* room.players.forEach((player) => {
			this._players.get(player)?.connect();
		}); */
	}

	// moves the player from a room to another (checks on start and end room)
	private movePlayer(playerid:string, from:number, to:number)
	{
		// check player existance
		const player = this._players.get(playerid);
		if (player === undefined) {
			console.log('Error::movePlayer: Player not found');
			return ;
		}

		// check 'from' and 'to' room existance
		const fromRoom = this.room(from);
		const toRoom = this.room(to);
		if (!fromRoom || !toRoom) {
			console.log('Error::movePlayer: Room(s) not found');
			return ;
		}

		/* // check if 'from' is played
		if (fromRoom.played === false) {
			console.log("Error::movePlayer: Origin Room didn't playe yet");
			return ;
		}

		// check if 'to' isn't played
		if (toRoom.played === true) {
			console.log("Error::movePlayer: Destination Room already player");
			return ;
		} */

		console.log(`Moving player ${playerid} from '${from}' to '${to}'`);
		toRoom.players.set(playerid, false);
	}

	// All players joined the torunament, no more joins
	private close()
	{
		if (this._players.size !== this._size) {
			console.log('Failed to close tournament: not enough players');
			return ;
		}

		// closed tournament
		this._closed = true;

		// #todo assign players to rooms

		console.log(`Closing tournament ${this._ID}, no more player allowed, games can now start`);
	}

	/* ----------------------------------------------------- */
	/* ------------------ USER MANAGEMENT ------------------ */
	/* ----------------------------------------------------- */

	public ready(playerid:string)
	{
		// check if player in a room
		const roomIdx = this.roomOf(playerid);
		if (roomIdx === undefined) {
			console.log('Error::Tournnament::Ready: Not in a room');
			return ;
		}

		// check if the room is in game
		const room = this._rooms.get(roomIdx) as Room;
		if (room.ingame === true) {
			console.log('Error::Tournnament::Ready: Room in-game');
			return ;
		}

		// set the player to ready
		const player = this._players.get(playerid);
		player?.ready();
	}

	// function to join the lobby, syntax: 'playerID'
	@SyncTournament
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

		// check if we got all players
		if (this._players.size === this._size) this.close();

		// update state
		return true;
	}


	// The player temporarly left the lobby
	// (connection closed but still inside the lobby)
	@SyncTournament
	public disconnect(playerID:string): boolean
	{
		// check if the player is inside
		const player = this._players.get(playerID);
		if (player === undefined)
		{
			console.log(`player '${playerID}' not in the tournament`);
			return false;
		}

		// find the room
		for (const r of this._rooms.values())
		{
			if (r.played === false && r.players.has(playerID))
			{
				// disconnect player
				if (r.ingame === false) player.disconnect();
				else player.away();

				return true;
			}
		}
	
		console.log(`Player ${playerID} didn't join a room yet`);
		player.disconnect();
		return true;
	}


	// Remove a player from the lobby
	@SyncTournament
	public leave(playerID:string): boolean
	{
		// check if the player is inside
		const player = this._players.get(playerID);
		if (player === undefined)
		{
			console.log(`player '${playerID}' not in the tournament`);
			return false;
		}

		// disconnect player ...
		player.disconnect();
		//... and remove from lobby
		// this._players.delete(playerID);
		// #todo autowin (DNP) procedure

		// logging
		console.log(`${playerID} left the tournament...`);

		return true;
	}

	// broadcast a message to the whole lobby
	public broadcast(message:string)
	{
		this._players.forEach((player) => {
			player.send(message);
		});
	}

	// send to all users the lobby state
	public sync() {
		this.broadcast(this.stateJSON);
	}

}

/* function SyncTournament<T extends MySocket>(
  _target: any,
  _propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value;

  descriptor.value = function (this: Lobby<T>, ...args: any[]) {
    const result = original.apply(this, args);
    this.sync();
    return result;
  };
} */

function SyncTournament(
  originalMethod: Function,
  /* context: ClassMethodDecoratorContext */
) {
  return function (this: { sync(): void }, ...args: any[]) {
    const result = originalMethod.apply(this, args);
    this.sync();
    return result;
  };
}

