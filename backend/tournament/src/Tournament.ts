/* ----------------- */
/* ----------------- */
/* ----------------- */

import { v4 as uuidv4 } from "uuid";
import { Player, MySocket } from './Player.js';
import { Room, RoomPlayerController } from './Room.js';


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

		// status
		status:string;
		gameid:string;

		// outcome
		winner:string[];
		score:number[];
	}[]
}

/* --------------------------------------------------------------- */

/* --------------------------------------------------------------- */
/* 						 FORMAT BUILDER 						   */

function isPowOf(num:number, base:number): number
{
	let pow = 0;

	while (num !== 1)
	{
		pow++;
		num /= base;
		if (num !== 1 && num % base !== 0) return 0;
	}

	return pow;
}

function buildSE(players:number, roomsize:number): string
{
	const pow = isPowOf(players / roomsize, 2);

	/* #debug */
	// console.log(`2^${pow} = ${players}`);
	
	if (!pow) throw `Invalid player size for 'single-elimination' format: ${players}`;

	// one layer per pow of 2
	const layers:number = pow;
	
	let format:string = '';
	for (let l = 0; l < layers; ++l)
	{
		for (let c = 0; c < Math.pow(2, layers - l)/*  / 2 */; ++c)
		{
			// build a single cell
			format += `|(${l},${c})-(${l + 1},${Math.floor(c / 2)})-X`;
		}
	}

	// adding final
	format += `|(${layers},0)-W-X|`;

	/* #debug */
	console.log(`Single elimination for '${players}' players:\n`, format);

	return format;
}

/* @throw errors if invalid players size */
function buildformat(alias:string, players:number, roomsize:number): string
{
	switch (alias)
	{
		default:
			return buildSE(players, roomsize);
	}
	// if (alias === 'single-elimination') return buildSE(players);
}

/* 						FORMAT INTERPRETER 						   */

/* format string example:
	'explicit:|(0,0)-(1,0)-X|(0,1)-(1,0)-X| ...'
	'alias:#todolater'
*/

// string is a valid formatted format-string as the above example
// in case of an elimination, the 'loser' will have the same idx as the starting idx
// NOTA: se format non torna, si rompre tutto
function nextroom(format:string, idx:RoomIdx): { winner:RoomIdx, loser:RoomIdx }
{
	const key:string = idxToKey(idx);
	const cells = format.split('|');

	for (const c of cells)
	{
		// first and last split
		if (c.length === 0) continue;
	
		const nexts = c.split('-');
		
		/* #debug */
		// console.log('splitted cells', nexts);

		if (nexts[0] !== key) continue;

		// (-1, -1) for winner
		const winner = (nexts[1] === 'W') ? { layer:-1, idx:-1 } : keyToIdx(nexts[1]);
		const loser = (nexts[2] === 'X') ? idx : keyToIdx(nexts[2]);
		
		return {
			winner: winner,
			loser: loser
		}
	}

	// return same cell on invalid cells
	/* #debug */
	console.log('Invalid cell asked in nextroom() DANGER!!!!', idx);
	return {
		winner: idx,
		loser: idx
	};
}

// returns all the rooms needed for the tournnament to work
function *allrooms(format:string): Generator<RoomKey>
{
	const cells = format.split('|');

	for (const c of cells)
	{
		// first and last split
		if (c.length === 0) continue;
	
		const nexts = c.split('-');
		
		/* #debug */

		// const idx = keyToIdx(nexts[0]);
		// yield idx;
		yield nexts[0]
	}
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
	return `(${roomidx.layer},${roomidx.idx})`;
}

function keyToIdx(key: RoomKey): RoomIdx
{
	/* #debug */
	// console.log('KeyToIdx-ing:', key);
	
	const parts = key.substring(1, key.length - 1).split(",");

	/* #debug */
	// console.log('KeyToIndx removed brackets:', parts);

	const layer = Number(parts[0]);
	const idx = Number(parts[1]);

	return { layer:layer, idx:idx };
}
/* --------------------------------------------------------------- */

/* TOURNAMENT CLASS */

export class Tournament<T extends MySocket>
{
	// tournament specs
	private _size:number;		// number of players
	private	_rsize:number;		// number of players per room
	private _format:string;		// format of the tournament

	private	_closed:boolean;	// is the tournament closed? (no more player can join)
	private _finished:boolean;
	private _winner:string;

	// tournament's unique code
	private readonly _ID:string;

	private _players:Map<string, Player<T>>;	// unique identifier for each player, sent at th beginning of every move. NOTE: the ID is generated when the websocket is connected
	private _rooms:Map<RoomKey, Room>;			// each room has multiple players
	
	private _gamecallback: (gameid:string, players:string[], metadata:any) => Promise<boolean>;
	private _botcallback: (gameid:string, botid:string) => Promise<boolean>;


	constructor(
		__gamecallback:(gameid:string, players:string[], metadata:any) => Promise<boolean>,
		__botcallback: (gameid:string, botid:string) => Promise<boolean>,
		__size:number = 4,
		__rsize = 2,
		__format:string = 'single-elimination')
	{
		if (__size <= 0 || __size % __rsize !== 0) throw `Tournament::Error: Invalid player size '${__size}'`;
		
		this._gamecallback = __gamecallback;
		this._botcallback = __botcallback;
		this._size = __size;					// 4 player
		this._rsize = __rsize;					// 2 players
		this._format = buildformat(__format, __size, __rsize);
		// NOTE: format at this point is a valid format, no further controls needed

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
		return nextroom(this._format, idx);
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

		const rooms = Array.from(this._rooms, ([key, room]) => ({
			layer: keyToIdx(key).layer,
			idx: keyToIdx(key).idx,
			players: Array.from(room.players),
			status: (room.ingame === true) ? 'in-game' : 'waiting',
			gameid: room.gameid,
			winner: room.winners,
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
	/* 		  STATUS UPDATER and OPRATION EXECUTER	 	    */
	/* ---------------------------------------------------- */

	private async routine()
	{
		let changed = false;

		changed ||= await this.startReadyRooms();
		changed ||= this.advanceFinishedRooms();
		changed ||= this.checkTournamentEnd();

		if (changed) this.sync();
	}

	private async startReadyRooms(): Promise<boolean>
	{
		let changed = false;

		for (const room of this._rooms.values())
		{
			/* ------ IS ROOM READY? ------ */
			if (room.ingame || room.played) continue;
			if (!room.full()) continue;

			const players = Array.from(room.players);

			const allReady = players.every(id => {
				const p = this._players.get(id);
				return p && (p.isBot() || p.status === "ready");
			});

			if (!allReady) continue;
			/* ---------------------------- */

			// spawn the room
			const ok = await room.play(
				this.roomPlayerController(),
				this._gamecallback
			);

			// if room spawnned ...
			if (ok.status === "success")
			{
				// new stuff to send
				changed = true;

				// ...spawn the bots
				for (const id of room.players) {
					const p = this._players.get(id);
					if (p && p.isBot()) this._botcallback(room.gameid, id);
				}
			}

		}

		return changed;
	}

	// move the players if they played a match
	private advanceFinishedRooms(): boolean
	{
		let changed = false;

		for (const [key, room] of this._rooms)
		{
			/* check if the room is played */
			if (!room.played) continue;
			if (room.winners.length === 0) continue;
			if (room.advanced) continue;

			// gets the next room
			const idx = keyToIdx(key);
			const next = this.nextRoom(idx);

			// move the players
			room.players.forEach(player => {
				if (room.winners.includes(player)) {
					this.move(player, key, idxToKey(next.winner));
				} else {
					this.move(player, key, idxToKey(next.loser));
				}
			});

			// set the room as advanced
			room.advanced = true;
			changed = true;
		}

		return changed;
	}

	// checks if the tournament finished
	private checkTournamentEnd(): boolean
	{
		const finalskey = [...this._rooms.keys()].sort((a:string, b:string) => {
			const aidx = keyToIdx(a);
			const bidx = keyToIdx(b);

			return aidx.layer - bidx.layer;
		})[0];

		const finals = this._rooms.get(finalskey);
		if (finals === undefined) return false;

		this._finished = true;
		this._winner = finals.winners[0];
		return true;
	}

	/* ---------------------------------------------------- */
	/* ----------- TOURNAMENT STATUS OPERATIONS ----------- */
	/* ---------------------------------------------------- */

	// let's the room understand statuses of the player
	private roomPlayerController(): RoomPlayerController
	{
		return {
			// routine check for a room to start
			canStart: (players: Set<string>) => {
				for (const id of players)
				{
					const p = this._players.get(id);
					if (!p) return false;
					return (p.status === "ready" || p.isBot());
				}

				return false;
			},
	  
			// what to do once the room started
			onGameStart: (players: Set<string>) => {
				for (const id of players)
				{
					this._players.get(id)?.away();
				}
			}
		}
	}

	// // force the room start (for bots)
	// public async forcePlayRoom(roomkey:RoomKey): Promise<boolean>
	// {
	// 	const room = this._rooms.get(roomkey);
	// 	if (room === undefined) {
	// 		console.log('Trying to forcePlay() an undefined room', roomkey);
	// 		return false;
	// 	}

	// 	// play the room
	// 	const ok = await room.play(
	// 		this.roomPlayerController(),
	// 		this._gamecallback
	// 	);

	// 	// failed to start room
	// 	if (ok.status === 'failure') {
	// 		return false;
	// 	}

	// 	// sync state
	// 	this.sync();

	// 	// successful return
	// 	return true;
	// }

	// reset the room (hardcoded 1 winner)
	public finalizeRoom(gameid:string, winners:string[], score:number[])
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

		const room = [...this._rooms.values()].find(r => r.gameid === gameid);
		if (room === undefined) {
			console.log('Tournament::finalizeRoom::Error: Room not found');
			return ;
		}

		// set the scores
		room.finalize(winners, score);

		// 'connect' bots
		for (const id of room.players)
		{
			const p = this._players.get(id);
			if (p?.isBot()) p?.connect();
		}

		// routine check
		this.routine();
	}

	// All players joined the torunament, no more joins
	private close()
	{
		if (this._players.size !== this._size) {
			console.log('Failed to close tournament: not enough players');
			return ;
		}

		/* build all rooms for the tournament */
		for (const r of allrooms(this._format))
		{
			console.log(`Adding room ${r}`);
			this._rooms.set(r, new Room(this._rsize, {
				origin: 'tournament',
				ID: this._ID,
				room: r
			}));

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

		// send the rooms
		this.routine();
	}

	/* ----------------------------------------------------- */
	/* ------------------ USER MANAGEMENT ------------------ */
	/* ----------------------------------------------------- */

	// moves the player from a room to another (checks on start and end room)
	private move(playerid:string, from:RoomKey, to:RoomKey)
	{
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

		console.log(`Moved player ${playerid} from '${from}' to '${to}'`);
		toRoom.players.add(playerid);
	}

	public ready(playerid:string): { status: "success" | "failure", reason:string }
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

		// routine check
		this.routine();

		// successful ready
		return {
			status: "success",
			reason: 'Successful readyed'
		};
	}

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
				// update player
				this._players.set(outPlayerID, new Player(ws));

				// update status
				this.sync();

				return true;
			}
		}

		// check if tournament is full
		if (this._players.size === this._size)
		{
			console.log('The tournament is full');
			return false;
		}

		// add player
		this._players.set(outPlayerID, new Player(ws));

		// check if we got all players
		if (this._players.size === this._size) this.close();

		// update status
		this.sync();

		// update state
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

				// update status
				this.sync();

				return true;
			}
		}
	
		console.log(`Player ${playerID} didn't join a room yet`);
		player.disconnect();

		// update status
		this.sync();

		return true;
	}


	// Remove a player from the lobby
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

		// update status
		this.sync();

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
	public roomcast(roomkey:string, message:string)
	{
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
