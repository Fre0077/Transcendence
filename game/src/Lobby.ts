/* ----------------- */
/* ----------------- */
/* ----------------- */

import { v4 as uuidv4 } from "uuid";
import { Game } from "./Game.js";

// type Cmd = {
// 	code: string;
// 	func: () => void;
// };

// harcoded functionalities
const hardcoded:string[] = ['START_PRESS', 'RESET_PRESS'];

export class Lobby {
	// lobby specs
	private size:number;
	private format:number;

	// lobby's unique code
	private ID:string;

	private playerID:string[];	// unique identifier for each player, sent at th beginning of every move. NOTE: the ID is generated when the websocket is connected
	
	// where the game is played
	private game:Game;

	constructor() {
		this.size = 2;				// 2 player
		this.format = 3;			// Bo5
		this.ID = uuidv4();			// #todo lobby code generator. for now fixed code
		this.playerID = [];
		this.game = new Game();
	}

	// getter of ID
	public getID() : string {
		return this.ID;
	}

	// set the lobby code (myReallyCoolLobby)
	public setID(code:string) {
		this.ID = code;
	}

	// returns the gamestate of the Game object
	public getGameStateJSON() : string {
		return this.game.getGameStateJSON();
	}

	// startup procedure if we reached the number of players
	private start() {
		this.game.setFormat(this.format);
		this.game.start();
	}

	// cleaanup procedure if no player in lobby
	private close() {
		this.game.stop();
	}

	// function to join the lobby, syntax: 'playerID'
	public join(playerID:string) {
		if (this.playerID.length === this.size) {
			console.log('The lobby is full'); // #todo sendo to the frontend
			return ;
		}

		// add player
		this.playerID.push(playerID);

		// check if we fill the lobby
		if (this.playerID.length === 1) this.start();
		else if (this.playerID.length === this.size) this.game.reset();
	}

	// a player left the lobby
	public leave(playerID:string) {
		const index = this.playerID.indexOf(playerID);
		if (index !== -1) {
			this.playerID.splice(index, 1);

			// game mechanics
			this.game.stop();
			console.log(`${playerID} left the lobby...`); // #todo send to frontend
		}

		if (this.playerID.length === 0) this.close();

	}

	// sends input to game, correct format: 'playerID:move'
	public send(playerID:string, msg:string) {
		console.log(`client ${playerID} tryed to send ${msg}`); // #debug

		const playerNum = this.playerID.findIndex(l => l === playerID) + 1;

		if (playerNum === 0) {
			console.log('impostor, pls prevent');
			return ;
		}
		
		console.log(`msg from player${playerNum}`);	// #debug

		if (msg.startsWith(`P${playerNum}`)) {
			if (msg === `P${playerNum}UP_PRESS`) this.game.press(playerNum, 'Up');
			else if (msg === `P${playerNum}DW_PRESS`) this.game.press(playerNum, 'Down');
			else if (msg === `P${playerNum}UP_RELEASE`) this.game.release(playerNum, 'Up');
			else if (msg === `P${playerNum}DW_RELEASE`) this.game.release(playerNum, 'Down');
		}
		else if (hardcoded.find(hc => hc === msg)) {
			// if the lobby isn't full no status commands
			if (this.playerID.length !== this.size) return;
		
			if (msg === 'START_PRESS') this.game.launch();
			else if (msg === 'RESET_PRESS') this.game.reset();
		}
		else {
			console.log('Invalid msg');
		}
	}
}