/* ----------------- */
/* ----------------- */
/* ----------------- */

import { Player } from './Player.js';
import { Room, RoomPlayerController } from './Room.js';


/* what you will receive from the /your-lobby endpoint @aleborghi */
interface TournamentState
{
	ID:string;

	// status
	finished:boolean;
	aborted:boolean;
	winners:string[];
	current_layer:number;

	// data
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
	}[];
}

/* --------------------------------------------------------------- */

/* --------------------------------------------------------------- */
/* 						 FORMAT BUILDER 						   */

function getPowOfTwo(n: number): number | null {
    if (n <= 0) return null; // negative numbers or zero aren't powers of 2
    const exp = Math.log2(n);
    return Number.isInteger(exp) ? exp : null;
}

function buildSE(players:number, roomsize:number): string
{
	const pow = getPowOfTwo(players / roomsize);

	/* #debug */
	// // console.log(`2^${pow} = ${players}`);
	
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
	// console.log(`Single elimination for '${players}' players:\n`, format);

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

function getfinals(format:string): RoomKey
{
	for (const room of format.split('|'))
	{
		if (room.length === 0) continue;
		if (room.includes('W')) return room.split('-')[0];
	}

	// if this happens I resign. by @topiana-
	return "Error";
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
		// // console.log('splitted cells', nexts);

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
	// console.log('Invalid cell asked in nextroom() DANGER!!!!', idx);
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
	// // console.log('KeyToIdx-ing:', key);
	
	const parts = key.substring(1, key.length - 1).split(",");

	/* #debug */
	// // console.log('KeyToIndx removed brackets:', parts);

	const layer = Number(parts[0]);
	const idx = Number(parts[1]);

	return { layer:layer, idx:idx };
}
/* --------------------------------------------------------------- */

/* TOURNAMENT CLASS */

export class Tournament
{
	// tournament specs
	private _size:number;		// number of players
	private	_rsize:number;		// number of players per room
	private _format:string;		// format of the tournament
	private _finals:RoomKey;	// key of the Finals

	private	_closed:boolean;	// is the tournament closed? (no more player can join)
	private _current_layer:number;
	private _finished:boolean;
	private _aborted:boolean;
	private _winners:string[];

	// tournament's unique code
	private readonly _ID:string;

	private _players:Map<string, Player>;	// unique identifier for each player, sent at th beginning of every move. NOTE: the ID is generated when the websocket is connected
	private _rooms:Map<RoomKey, Room>;			// each room has multiple players
	
	private listeners:Set<any> = new Set();

	constructor(
		__size:number = 4,
		__rsize = 2,
		__format:string = 'single-elimination')
	{
		if (__size <= 0 || __size % __rsize !== 0) throw `Tournament::Error: Invalid player size '${__size}'`;
		
		this._size = __size;					// 4 player
		this._rsize = __rsize;					// 2 players
		this._format = buildformat(__format, __size, __rsize);
		// NOTE: format at this point is a valid format, no further controls needed
		this._finals = getfinals(this._format);

		this._closed = false;
		this._current_layer = 0;
		this._finished = false;
		this._aborted = false;
		this._winners = [];

		this._ID = "local";					// lobby code generator.
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

	public get aborted() {
		return this._aborted;
	}

	public get finished() {
		return this._finished;
	}

	public get winners() {
		return this._winners;
	}

	// getter of players
	public get players(): Map<string, Player> {
		return this._players;
	}

	// Lobby state to the frontend
	public get state(): TournamentState
	{
		const players = Array.from(this._players, ([id, player]) => ({
			ID: id,
			status: player.status,
		}));

		function getstatus(room:Room): string {
			if (room.aborted) return 'aborted';
			if (room.ingame) return 'in-game';
			if (room.justwin) return 'autowin';
			if (room.played) return 'finished';
			return 'waiting';
		}

		const rooms = Array.from(this._rooms, ([key, room]) => ({
			layer: keyToIdx(key).layer,
			idx: keyToIdx(key).idx,
			players: Array.from(room.players),
			status: getstatus(room),
			gameid: room.gameid,
			winner: room.winners,
			score: room.score
		}));


		const state = {
			ID: this._ID,
			finished: this._finished,
			aborted: this._aborted,
			winners: this._winners,
			current_layer: this._current_layer,
			/* gameID: this._gameID,
			ingame: this._ingame, */
			players: players,
			rooms:rooms,
		};

		return state;
	}

	public get stateJSON():string {
		return JSON.stringify(this.state);
	}

	public onupdate(fn:any) {
		this.listeners.add(fn);
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

		// check if players need to be moved
		if (this.advanceFinishedRooms()) changed = true;
		if (this.advanceAbortedRooms()) changed = true;
		if (this.advanceJustWinRooms()) changed = true;

		// check if we can go to the next layer
		if (await this.checkCurrentLayer()) changed = true;

		// check if tournament finished
		if (this.checkTournamentEnd()) changed = true;

		// start rooms
		if (await this.startReadyRooms()) changed = true;

		if (changed) this.sync();
	}

	private async startReadyRooms(): Promise<boolean>
	{
		let changed = false;

		for (const [key, room] of this._rooms/* .values() */)
		{
			/* ------ IS ROOM READY? ------ */
			if (room.ingame || room.played) continue;
			if (!room.full()) continue;

			// check if the room is on the current played layer
			const layer = keyToIdx(key).layer;
			if (layer !== this._current_layer) continue;

			// check player readyness
			const players = Array.from(room.players);

			const allReady = players.every(id => {
				const p = this._players.get(id);
				return p && (p.status === "ready");
			});

			if (!allReady) continue;
			/* ---------------------------- */

			// spawn the room
			const ok = await room.play(
				this.roomPlayerController(),
			);

			// if room spawnned ...
			if (ok.status === "success")
			{
				// new stuff to send
				changed = true;

				/* #debug */
				// // console.log('Started room of', room.players);
			}

		}

		return changed;
	}

	private advanceJustWinRooms(): boolean
	{
		let changed = false;

		for (const [key, room] of this._rooms)
		{
			if (room.advanced) continue ;
			if (room.aborted) continue ;
			if (!room.justwin) continue ;
			if (room.players.size === 0) continue ;	// assuming the whole team gets moved at once
			
			// set the room as ingame so it can be finalized
			room.ingame = true;

			// create winners array
			const winners = Array.from(room.players).filter(p => this._players.get(p)?.status !== "left")

			// finalize the room
			room.finalize(winners, [0,0]);

			// gets the next rooms
			const idx = keyToIdx(key);
			const next = this.nextRoom(idx)

			// move the players
			winners.forEach((player) => {
				this.move(player, key, idxToKey(next.winner));
			});

			// set the room as advanced
			room.advanced = true;
			changed = true;
		}

		return changed;
	}

	private advanceAbortedRooms(): boolean
	{
		let changed = false;

		for (const [key, room] of this._rooms)
		{
			if (room.advanced) continue ;
			if (!room.aborted) continue ;
			
			// gets the next rooms
			const idx = keyToIdx(key);
			const next = this.nextRoom(idx)

			// finalize the room
			room.finalize(["----"], [0,0]);
			
			// set the winner and the loser room to 'justwin' rooms
			{
				const winkey = idxToKey(next.winner);
				const losekey = idxToKey(next.loser);
				if (winkey !== key) this._rooms.get(winkey)?.autowin();
				if (losekey !== key) this._rooms.get(losekey)?.autowin();
			}

			// set the room as advanced
			room.advanced = true;
			changed = true;
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
			if (room.advanced) continue;
			if (!room.played) continue;
			if (room.aborted) continue;
			if (room.winners.length === 0) continue;
			
			// gets the next rooms
			const idx = keyToIdx(key);
			const next = this.nextRoom(idx);
			
			// move the winner players and the loser players
			room.players.forEach(player => {
				if (room.winners.includes(player)) {
					this.move(player, key, idxToKey(next.winner));
				} else {
					this.move(player, key, idxToKey(next.loser));
				}
			});

			/* #debug */
			// // console.log('Advanced room', key);

			// set the room as advanced
			room.advanced = true;
			changed = true;
		}

		return changed;
	}

	private async checkCurrentLayer(): Promise<boolean>
	{
		let changed = false;
		let allplayed = true;

		// wait a bit inbetween rounds
		function sleep(ms: number) {
			return new Promise(resolve => setTimeout(resolve, ms));
		}

		for (const [key, room] of this._rooms)
		{
			const layer = keyToIdx(key).layer;
			if (layer !== this._current_layer) continue;

			// if someone didn't play, don't advance the layer
			if (room.played === false)
			{
				allplayed = false;
				break ;
			}
		}
		
		if (allplayed === true)
		{
			// little sleep (1s)
			await sleep(1000);
		
			// advance current layer
			this._current_layer++;

			// register the status change
			changed = true;
		}

		return changed;
	}

	// checks if the tournament finished
	private checkTournamentEnd(): boolean
	{
		/* get the finals */
		const finals = this._rooms.get(this._finals);
		if (finals === undefined) return false;

		/* check if played */
		if (finals.played === false) return false;

		/* save data */
		if (finals.aborted === true) this._aborted = true;
		else this._finished = true;
		this._winners = finals.winners;
		
		/* #debug */
		// console.log('Tournament finished, winner(s)', this._winners);

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
					return (p.status === "ready");
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
			// console.log('Tournament::finalizeRoom::Error(): Room not found');
			return ;
		}

		// set the scores
		room.finalize(winners, score);

		// routine check
		this.routine();
	}

	// all the players in the room disconnected or the game was aborted
	public killRoom(gameid:string)
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
			// console.log('Tournament::killRoom()::Error: Room not found');
			return ;
		}

		// set the room to aborted
		room.aborted = true;

		/* #debug */
		// console.log(`Room of ${room.players.values()} aborted`);

		// routine check
		this.routine();
	}

	// All players joined the torunament, no more joins
	private close()
	{
		if (this._players.size !== this._size) {
			// console.log('Failed to close tournament: not enough players');
			return ;
		}

		/* build all rooms for the tournament */
		for (const r of allrooms(this._format))
		{
			/* #debug */
			// console.log(`Adding room ${r}`);

			// adding room
			this._rooms.set(r, new Room(this._rsize));

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
				// console.log('Error while assigning players to the rooms. Room not found', { layer:0, idx:i });
				// clear all rooms
				return ;
			}

			room.players.add(id);
			++idx;
		}

		// closed tournament
		this._closed = true;
		// console.log(`Closed tournament ${this._ID}, no more player allowed, games can now start`);

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
			// console.log('Error::movePlayer: Player not found');
			return ;
		}

		// check 'from' and 'to' room existance
		const fromRoom = this._rooms.get(from);
		const toRoom = this._rooms.get(to);
		if (!fromRoom || !toRoom) {
			// console.log('Error::movePlayer: Room(s) not found');
			return ;
		}

		// console.log(`Moved player ${playerid} from '${from}' to '${to}'`);
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
			// console.log('Error::Tournnament::Ready: Not in a room');
			return {
				status: "failure",
				reason: 'Not in a room'
			};
		}

		// check if the room is in game
		const room = this._rooms.get(roomIdx) as Room;
		if (room.ingame === true) {
			// console.log('Error::Tournnament::Ready: Room in-game');
			return {
				status: "failure",
				reason: 'Room in-game'
			};
		}

		// check if room already played
		if (room.played === true) {
			// console.log('Error::Tournnament::Ready: Room already played');
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

	// function to join the lobby, syntax: 'playerid'
	public join(outPlayerid:string): boolean {
		// if (this._ingame === true) {return false;}

		const target = this._players.get(outPlayerid);
		// check if player already in
		if (target !== undefined)
		{
			if (target.status === "connected")
			{
				// console.log('Player already joined');
				return false;
			}
			else if (target.status === "left")
			{
				// console.log('Player previously left the tournament');
				return false;
			}
			else
			{
				// update player
				this._players.set(outPlayerid, new Player());

				// update status
				this.sync();

				return true;
			}
		}

		// check if tournament is full
		if (this._players.size === this._size)
		{
			// console.log('The tournament is full');
			return false;
		}

		// add player
		this._players.set(outPlayerid, new Player());

		// check if we got all players
		if (this._players.size === this._size) this.close();

		// update status
		this.sync();

		// update state
		return true;
	}


	// The player temporarly left the lobby
	// (connection closed but still inside the lobby)
	public disconnect(playerid:string): boolean
	{
		// check if the player is inside
		const player = this._players.get(playerid);
		if (player === undefined)
		{
			// console.log(`player '${playerid}' not in the tournament`);
			return false;
		}

		// find the room
		for (const r of this._rooms.values())
		{
			if (r.played === false && r.players.has(playerid))
			{
				// disconnect player
				if (r.ingame === false) player.disconnect();
				else player.away();

				// update status
				this.sync();

				return true;
			}
		}
	
		// console.log(`Player ${playerid} didn't join a room yet`);
		player.disconnect();

		// update status
		this.sync();

		return true;
	}


	// Remove a player from the lobby
	public leave(playerid:string): boolean
	{
		// check if the player is inside
		const player = this._players.get(playerid);
		if (player === undefined)
		{
			// console.log(`player '${playerid}' not in the tournament`);
			return false;
		}

		// disconnect player ...
		player.leave();
		// ... and DNF procedure
		const roomkey = this.roomOf(playerid);
		if (roomkey !== undefined) this._rooms.get(roomkey)?.autowin();

		// logging
		// console.log(`${playerid} left the tournament...`);

		// update status
		this.routine();

		return true;
	}

	// send to all users the lobby state
	public sync() {
		// also add to all listeners
		this.listeners.forEach((l) => l(this.state));
	}

}
