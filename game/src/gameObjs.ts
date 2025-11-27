import { Game } from './Game.js'

export type player = {
	ID: string;
	joined: boolean;
	left:boolean;
	position: number;
};

export type GameStatus = "created" | "joining" | "ongoing" | "finished";

export type gameEntry = {
	ID: string;
	players: player[];
	game: Game;
	status:GameStatus;
};