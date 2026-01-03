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
	private _status: "connected" | "ready" | "away" | "disconnected" | "left";
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

	public isBot() {
		return (this._socket === null) ? true : false;
	}

	// leave the player
	public leave()
	{
		if (this._status === "left") return;

		// close socket...
		if (this._socket !== null) this._socket.close();
		//... and set status
		this._status = "left";
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
interface TournamentState
{
	ID:string;
	// gameID:string;
	players: {
		ID:string;
		status:string;
	}[];
	rooms: {
		// id room
		layer:number;
		idx:number;

		players:string/* , boolean */[];

		// outcome
		winner:string[];
		score:number[];
	}[]
}


/* ----------------------- ROOMKEY/ROOMIDX ----------------------- */
interface RoomIdx {
	layer:number;
	idx:number;
}
// formatted like so: 'layer:idx'
type RoomKey = string;


function idxToKey(roomidx:RoomIdx): RoomKey
{
	return `${roomidx.layer}:${roomidx.idx}`;
}

function keyToIdx(key: RoomKey): RoomIdx | null
{
	const parts = key.split(":");
	if (parts.length !== 2) return null;

	const layer = Number(parts[0]);
	const idx = Number(parts[1]);

	if (Number.isNaN(layer) || Number.isNaN(idx)) return null;

	return { layer, idx };
}
/* --------------------------------------------------------------- */

class Room
{
	private _rsize = 2;	// static room size of 2

	public gameid:string = uuidv4();
	public ingame:boolean = false;
	public played:boolean = false;
	public players:Set<string> = new Set();				// id: ready/not-ready
	public score:number[] = [];							// array of nums
	public winner:string[] = ["unkown"];

	public has(playerid:string) {
		return this.players.has(playerid);
	}

	public full() {
		return this.players.size === this._rsize;
	}
}

/* TOURNAMENT CLASS */

export class Tournament<T extends MySocket>
{
	// tournament specs
	private _size:number;		// number of players
	private	_rsize:number;		// number of players per room

	private	_closed:boolean;	// is the tournament closed? (no more player can join)
	private _finished:boolean;
	private _winner:string;

	// tournament's unique code
	private readonly _ID:string;

	private _players:Map<string, Player<T>>;	// unique identifier for each player, sent at th beginning of every move. NOTE: the ID is generated when the websocket is connected
	private _rooms:Map<RoomKey, Room>;			// each room has multiple players
	
	private _gamecallback: (gameID:string, players:string[]) => Promise<boolean>;

	constructor(
		__gamecallback:(gameID:string, players:string[]) => Promise<boolean>,
		__size:number = 4,
		__rsize = 2)
	{
		if (__size <= 0 || __size % 2 !== 0) throw `Tournament::Error: Invalid player size '${__size}'`;
		
		this._gamecallback = __gamecallback;
		this._size = __size;					// 4 player
		this._rsize = __rsize;					// 2 players

		this._closed = false;
		this._finished = false;
		this._winner = '';

		this._ID = uuidv4();					// lobby code generator.
		this._players = new Map();
		this._rooms = new Map();

		// this._ingame = false;
		// this._gameID = "empty";
	}

	/* --- CORE FUNCTION FOR TOURNAMENT STRUCTURE --- */

	//	6ppl			  2ppl				2ppl			  2ppl

	/* for now single elimination */
	private nextRoom(idx:RoomIdx): { winner:RoomIdx, loser:RoomIdx }
	{
		return {
			winner: { layer: idx.layer + 1, idx: Math.floor(idx.idx / 2) },
			loser: { layer: -1, idx: -1 }
		}
	}

	/* ---------------------------------------------- */

	private roomOf(playerid:string): RoomKey | undefined
	{
		let roomidx = undefined;
		for (const [idx, room] of this._rooms)
		{
			if (room.has(playerid)) {roomidx = idx};
		}

		return roomidx;
	}

	/* ========== GETTERS ========= */

	// getter of ID
	public get ID():string {
		return this._ID;
	}

	public get rooms() {
		return this._rooms;
	}

	public get finished() {
		return this._finished;
	}

	public get winner() {
		return this._winner;
	}

	// getter of players
	public get players(): Map<string, Player<T>> {
		return this._players;
	}

	// Lobby state to the frontend
	public get state(): TournamentState
	{
		const players = Array.from(this._players, ([id, player]) => ({
			ID: id,
			status: player.status,
		}));

		const rooms = Array.from(this._rooms, ([idx, room]) => ({
			layer: Number(idx.split(':')[0]),
			idx: Number(idx.split(':')[1]),
			players: Array.from(room.players),
			winner: room.winner,
			score: room.score
		}));


		const state = {
			ID: this._ID,
			/* gameID: this._gameID,
			ingame: this._ingame, */
			players: players,
			rooms:rooms
		};

		return state;
	}

	public get stateJSON():string {
		return JSON.stringify(this.state);
	}

	/* ---------------------------------------------- */

	// return true if the tournament is full, false if it isn't... duh?
	public full(): boolean {
		if (this._players.size === this._size) return true;
		else return false
	}

	// is the player in the tournament?
	public has(player:string): boolean {
		const p = this._players.get(player);
		return (p !== undefined && p.status !== "left") ? true : false;
	}

	// is the game part of the tournament rooms?
	public game(gameid:string): boolean {
		for (const r of this._rooms.values()) {
			if (r.gameid === gameid) return true;
		}
		return false;
	}

	// return true if the empty is full, false if it isn't... are you dumb?
	public empty(): boolean {
		if (this._players.size === 0) return true;
		else return false;
	}

	// all the players in the same room !!!
	public roomates(playerid:string): string[] {
		const roomkey = this.roomOf(playerid);
		if (roomkey === undefined) return [];
		const room = this._rooms.get(roomkey) as Room;
		return Array.from(room.players);
	}

	/* ---------------------------------------------------- */
	/* ----------- TOURNAMENT STATUS OPERATIONS ----------- */
	/* ---------------------------------------------------- */

	// force the room start (for bots)
	public forcePlayRoom(roomkey:RoomKey) { this.playRoom(roomkey);}

	// startup procedure for a room if the room is full
	private async playRoom(roomkey:RoomKey):
		Promise<{ status: 'success' | 'failure', reason:string }>
	{
		// get the room roomkey'ed
		const room = this._rooms.get(roomkey);
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
		room.players.forEach((player) => {
			const p = this._players.get(player);
			if (p?.status !== "ready") {
				return {
					status: 'failure',
					reason: "Not all players connected, or ready"
				};
			}
		});

		// Prepare object to send to GameService
		const players = Array.from(room.players);

		// callback for external porpouses (send to GameService)
		if (await this._gamecallback(room.gameid, players) === false) {
			// room.gameID = "empty";
			return {
				status: 'failure',
				reason: "Failed to connect to the Game Service"
			};
		}

		// YEA BOYY
		room.ingame = true;

		// set all the players to away
		room.players.forEach((player) => {
			// room.players.set(player, false);
			this._players.get(player)?.away();

		});

		return {
			status: 'success',
			reason: "Room launched successfully"
		};
	}

	// reset the room (hardcoded 1 winner)
	@SyncTournament
	public finalizeRoom(winner:string, score:number[])
	{
		/* ---------- BASE CHECK --------- */
		// check if tournament finished
		if (this._finished === true) {
			return ;
		}

		// check if the tournament is closed
		if (this._closed === false) {
			return ;
		}
		/* ------------------------------ */

		// gets the room
		const roomkey = this.roomOf(winner);
		if (roomkey === undefined) {
			console.log('Tournament::finalizeRoom::Error: Player not found');
			return ;
		}
		const roomidx = keyToIdx(roomkey) as RoomIdx;

		const room = this._rooms.get(roomkey);
		if (room === undefined) {
			console.log('Tournament::finalizeRoom::Error: Room not found');
			return ;
		}

		// check if room already played
		if (room.played === true) {
			console.log('Tournament::finalizeRoom::Error: Room already played');
			return ;
		}

		// check if not ingame
		if (room.ingame === false) {
			console.log('Tournament::finalizeRoom::Error: Room not in-game');
			return ;
		}

		// 1. read the game outcome // from bunny (callback maybe?)
		// 2. write the score
		// 3. move players accordingly

		// 1.
		room.winner = [ winner ];
		// 2.
		room.score = score;
		// 3.
		if (/* finals */roomidx.layer === (this._size / this._rsize) - 1)
		{
			console.log('Tournament finished, winner', winner);
		}
		else
		{
			const nextroom = this.nextRoom(roomidx);
			this.movePlayer(winner, roomkey, idxToKey(nextroom.winner))
			// loser just dies
		}

		// no game linked to lobby
		room.ingame = false;
		room.played = true;
	}

	// moves the player from a room to another (checks on start and end room)
	private movePlayer(playerid:string, from:RoomKey, to:RoomKey)
	{
		console.log(`moving ${playerid}, from '${from}' to '${to}' ...`);

		// check player existance
		const player = this._players.get(playerid);
		if (player === undefined) {
			console.log('Error::movePlayer: Player not found');
			return ;
		}

		// check 'from' and 'to' room existance
		const fromRoom = this._rooms.get(from);
		const toRoom = this._rooms.get(to);
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

		console.log(`Moved player ${playerid} from '${from}' to '${to}'`);
		toRoom.players.add(playerid);
	}

	// All players joined the torunament, no more joins
	private close()
	{
		if (this._players.size !== this._size) {
			console.log('Failed to close tournament: not enough players');
			return ;
		}

		/* build all rooms for a single elimination tournament */
		const layers = this._size / this._rsize;
		for (let i = 0; i < layers; ++i)
		{
			const rooms = layers / Math.pow(2, i);
			for (let r = 0; r < rooms; ++r)
			{
				console.log(`Adding room { layer:${i}, idx:${r} }`);
				this._rooms.set(idxToKey({ layer:i, idx:r }), new Room());
			}
		}

		// assign players to rooms
		let i = 0;
		let idx = 0;
		for (const id of this._players.keys())
		{
			if (idx !== 0 && idx % this._rsize == 0) ++i;
			const room = this._rooms.get(idxToKey({ layer:0, idx:i }));
			if (room === undefined)
			{
				console.log('Error while assigning players to the rooms. Room not found', { layer:0, idx:i });
				// clear all rooms
				return ;
			}

			room.players.add(id);
			++idx;
		}

		// closed tournament
		this._closed = true;
		console.log(`Closed tournament ${this._ID}, no more player allowed, games can now start`);
	}

	/* ----------------------------------------------------- */
	/* ------------------ USER MANAGEMENT ------------------ */
	/* ----------------------------------------------------- */

	public ready(playerid:string): { status: "success" | "failure", reason:string, gameid?:string }
	{
		/* ---------- BASE CHECK --------- */
		// check if tournament finished
		if (this._finished === true) {
			return {
				status: "failure",
				reason: 'Tournament is finished'
			};
		}

		// check if the tournament is closed
		if (this._closed === false) {
			return {
				status: "failure",
				reason: "Tournament isn't closed"
			};
		}
		/* ------------------------------ */
	
		// check if player in a room
		const roomIdx = this.roomOf(playerid);
		if (roomIdx === undefined) {
			console.log('Error::Tournnament::Ready: Not in a room');
			return {
				status: "failure",
				reason: 'Not in a room'
			};
		}

		// check if the room is in game
		const room = this._rooms.get(roomIdx) as Room;
		if (room.ingame === true) {
			console.log('Error::Tournnament::Ready: Room in-game');
			return {
				status: "failure",
				reason: 'Room in-game'
			};
		}

		// check if room already played
		if (room.played === true) {
			console.log('Error::Tournnament::Ready: Room already played');
			return {
				status: "failure",
				reason: 'Room already played'
			};
		}

		// set the player to ready
		const player = this._players.get(playerid);
		player?.ready();

		// if all players ready, play room
		// #todo layer check, don't start a layer 2 game if layer 1 games are still to be played
		let allready = true;
		for (const player of room.players)
		{
			const p = this._players.get(player);
			if (p?.isBot() === false && p?.status !== "ready") {
				allready = false;
				break;
			}
		}

		if (room.players.size === this._rsize && allready === true)
		{
			// #todo loop if failed
			// prepare the Game Service
			const ret = this.playRoom(roomIdx);
			console.log('PlayRoom', ret);

			// also the room is full ready
			return {
				status: "success",
				reason: 'Successful readyed',
				gameid: room.gameid
			};
		}

		// successful ready
		return {
			status: "success",
			reason: 'Successful readyed'
		};
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
		player.leave();
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

	// send messages to all players in the same room of 'player'
	public roomcast(playerid:string, message:string)
	{
		// get the room
		const roomkey = this.roomOf(playerid);
		if (roomkey === undefined) return;
		const room = this._rooms.get(roomkey);
		if (room === undefined) return ;
	
		room.players.forEach((player) => {
			this._players.get(player)?.send(message);
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
  return function (this: { sync(): void, players:Map<string, Player<WebSocket>> }, ...args: any[]) {
    const result = originalMethod.apply(this, args);
    this.sync();

	// ready all bots // #todo lame, make it better
	// for (const p of this.players.values()) {
	// 	if (p.isBot()) p.ready();
	// }
    return result;
  };
}

