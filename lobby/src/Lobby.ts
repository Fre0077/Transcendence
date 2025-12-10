/* ----------------- */
/* ----------------- */
/* ----------------- */

import { v4 as uuidv4 } from "uuid";

type Player = {
	ID:string,
	status: "connected" | "disconnected" | "ingame" | "joining"
}

export class Lobby {
	// lobby specs
	private _size:number;		// number of players
	private _format:number;		// target score for the winner

	private _ingame:boolean;		// are the player playing?

	// lobby's unique codes
	private readonly _ID:string;
	private _gameID:string;

	private _players:Player[];	// unique identifier for each player, sent at th beginning of every move. NOTE: the ID is generated when the websocket is connected
	
	constructor() {
		this._size = 2;				// 2 player
		this._format = 3;			// Bo5

		this._ID = uuidv4();	// #todo lobby code generator. for now fixed code
		this._players = [];

		this._ingame = false;
		this._gameID = "empty";
	}

	// getter of ID
	public get ID():string {
		return this._ID;
	}

	// getter of ingame
	public get ingame(): boolean {
		return this._ingame;
	}

	// getter of ingame
	public get players(): Player[] {
		return this._players;
	}

	// sets the format of the lobby
	public setFormat(format:number) {
		if (this._ingame === true) {return ;}

		if (format <= 0) {
			console.log(`Error: invalid format`);
			return ;
		}
		this._format = format;
	}

	/* ---------------------------------------------- */
	// data to send to the GAME module

	public get lobbyJSON(): string {
		// const status:string = (this._ingame) ? "playing" : "creating";
		const state = {
			ID: this._ID,
			gameID: this._gameID,
			ingame: this._ingame,
			format: this._format,
			players: this._players
		};

		return JSON.stringify(state);
	}

	public getGameDetails() {
		const details = {
			ID: this._gameID,
			format: this._format,
			players: this._players
		};

		return details;
	}

	/* ---------------------------------------------- */

	// return true if the lobby is full, false if it isn't... duh?
	public full(): boolean {
		if (this._players.length === this._size) return true;
		else return false
	}

	// return true if the empty is full, false if it isn't... are you dumb?
	public empty(): boolean {
		if (this._players.length === 0) return true;
		else return false;
	}

	// startup procedure if we reached the number of players
	public launch(callback: (ID:string, format:number, players:string[]) => boolean): { status: "success" | "failure", reply: string, ID?: string } {
		if (this._ingame === true) {
			console.log("Lobby already started");
			return {
				status: "failure",
				reply: "Lobby already started"
			};
		}

		if (this._players.length !== this._size) {
			console.log('Not enough players!');	// #todo send to frontend
			return {
				status: "failure",
				reply: "Not enough players"
			};
		}
		console.log(`Starting lobby ${this._ID} ...`);

		/* ! ! ! CREATING GAME ID ! ! ! */
		this._gameID = uuidv4();

		if (callback(this._gameID, this._format, this._players.map(p => p.ID)) === false) {
			this._gameID = "empty";
			return {
				status: "failure",
				reply: "Failed to create game"
			};
		}

		// YEA BOYY
		this._ingame = true;

		// set all player to ingame
		for (let i = 0; i < this._players.length; ++i) {
			this._players[i].status = "ingame";
		}

		// successful return
		return {
			status: "success",
			reply: "Game started succcessfuly",
			ID: this._gameID,
		};
	}

	// reset the lobby
	public reset() {
		if (this._ingame == false) {return ;}

		// no game linked to lobby
		this._gameID = "empty";
		this._ingame = false;

		// all the players are expected to reconnect
		for (let i = 0; i < this._players.length; ++i) {
			this._players[i].status = "joining";
		}
	}

	// cleanup procedure if no player in lobby
	private close() {
		if (this._ingame === true) {return ;}

		console.log(`Closing lobby ${this._ID} ...`);
	}

	// function to join the lobby, syntax: 'playerID'
	public join(outPlayerID:string): boolean {
		// if (this._ingame === true) {return false;}

		const target = this._players.find(p => p.ID === outPlayerID);
		// check if player already in
		if (target !== undefined) {
			if (target.status !== "connected")		// if not connected
			{
				if (target.status !== "ingame")		// if not ingame ...
					target.status = "connected";	// ... set status to connected
				return true;
			}
			else {
				console.log('Player already joined');
				return false;
			}
		}

		// check if lobby is full
		if (this._players.length === this._size) {
			console.log('The lobby is full');
			return false;
		}

		// add player
		this._players.push({ ID: outPlayerID, status: "connected" });

		return true;
	}

	// a player left the lobby
	public leave(playerID:string) {
		if (this._ingame === true) {return ;}
		if (playerID === null) {return ;}

		const player = this._players.find(p => p.ID === playerID);
		if (player === undefined) {
			console.log(`player '${playerID}' not in the lobby`);
			return ;
		}

		const index = this._players.indexOf(player);
		if (index !== -1) {
			this._players.splice(index, 1);

			// game mechanics
			// this._game.stop();
			console.log(`${playerID} left the lobby...`); // #todo send to frontend
		}

		// close the lobby if the last player left
		if (this._players.length === 0) this.close();

	}

	// sends input to game, correct format: 'playerID:move'
	// public send(playerID:string, msg:string) {}
}