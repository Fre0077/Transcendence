/* ----------------- */
/* ----------------- */
/* ----------------- */

import { v4 as uuidv4 } from "uuid";

// type Cmd = {
// 	code: string;
// 	func: () => void;
// };

// harcoded functionalities
// const hardcoded:string[] = ['START_PRESS', 'RESET_PRESS'];

export class Lobby {
	// lobby specs
	private size:number;		// number of players
	private format:number;		// target score for the winner

	private ingame:boolean;		// are the player playing?

	// lobby's unique codes
	private lobbyID:string;
	private gameID:string;

	private playerID:string[];	// unique identifier for each player, sent at th beginning of every move. NOTE: the ID is generated when the websocket is connected
	
	constructor() {
		this.size = 2;				// 2 player
		this.format = 3;			// Bo5

		this.ingame = false;
		this.lobbyID = uuidv4();	// #todo lobby code generator. for now fixed code
		this.gameID = "empty";
		this.playerID = [];
	}

	// getter of ID
	public getID() : string {
		return this.lobbyID;
	}

	// getter of ingame
	public isInGame(): boolean {
		return this.ingame;
	}

	// sets the format of the lobby
	public setFormat(format:number) {
		if (this.ingame === true) {return ;}

		if (format <= 0) {
			console.log(`Error: invalid format`);
			return ;
		}
		this.format = format;
	}

	/* ---------------------------------------------- */
	// data to send to the GAME module

	public getLobbyStateJSON(): string {
		// const status:string = (this.ingame) ? "playing" : "creating";
		const state = {
			ID: this.gameID,
			ingame: this.ingame,
			format: this.format,
			players: this.playerID
		};

		return JSON.stringify(state);
	}

	/* ---------------------------------------------- */

	// return true if the lobby is full, false if it isn't... duh?
	public full() : boolean {
		if (this.playerID.length === this.size) return true;
		else return false
	}

	// startup procedure if we reached the number of players
	public launch(callback: (state: string, ID:string) => void) {
		if (this.ingame === true) {return ;}

		if (this.playerID.length !== this.size) {
			console.log('Not enough players!');	// #todo send to frontend
			return ;
		}
		console.log(`Starting lobby ${this.lobbyID} ...`);

		/* ! ! ! CREATING GAME ID ! ! ! */
		this.gameID = uuidv4();
		this.ingame = true;

		callback(this.getLobbyStateJSON(), this.gameID); // call when finished
	}

	// cleanup procedure if no player in lobby
	private close() {
		if (this.ingame === true) {return ;}

		console.log(`Closing lobby ${this.lobbyID} ...`);
	}

	// function to join the lobby, syntax: 'playerID'
	public join(outPlayerID:string) {
		if (this.ingame === true) {return ;}

		// check if lobby is full
		if (this.playerID.length === this.size) {
			console.log('The lobby is full'); // #todo sendo to the frontend
			return ;
		}


		// check if player already in
		if (this.playerID.find(p => p === outPlayerID)) {
			console.log('Player already joined'); // #todo sendo to the frontend
			return ;
		}

		// add player
		this.playerID.push(outPlayerID);
	}

	// a player left the lobby
	public leave(playerID:string) {
		if (this.ingame === true) {return ;}
		if (playerID === null) {return ;}

		const index = this.playerID.indexOf(playerID);
		if (index !== -1) {
			this.playerID.splice(index, 1);

			// game mechanics
			// this.game.stop();
			console.log(`${playerID} left the lobby...`); // #todo send to frontend
		}

		// close the lobby if the last player left
		if (this.playerID.length === 0) this.close();

	}

	// sends input to game, correct format: 'playerID:move'
	// public send(playerID:string, msg:string) {}
}