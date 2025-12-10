import { Game } from './Game.js'

/* --------------- GAME DB --------------- */

export type Player = {
	ID:string;
	joined:boolean;
	left:boolean;
	position: number;
};

type GameStatus = "created" | "joining" | "ongoing" | "paused" | "finished";

export type GameEntry = {
	ID:string;
	players:Player[];
	game:Game;
	status:GameStatus;
	lastCheck:number;
};

// array of games
export let games:GameEntry[] = [];
/* ! ! ! ONLY IMPORTED IN StatusChecker() ! ! ! */

export function getGameEntry(code:string): GameEntry | undefined
{
	const GameEntry = games.find(g => g.ID === code);
	if (GameEntry !== undefined){
		console.log(`found game with code '${code}'`);
		return GameEntry;
	}
	else
	{
		console.log(`game NOT found for code '${code}'`);
		return undefined;
	}
}


/* __________________________________________ */
/* 											  */
/* ----------- BACKENT to BACKEND  ---------- */
/* + - + - + - + - + - + - + - + - + - + - +  */
/* __________________________________________ */

type gameDetails = {
	ID: string,
	format:number,
	players:string[]
};

// add a game to the game list
export function addGame(details:gameDetails)
{
	// logging
	console.log(`Adding game ${details.ID}`);

	// create the player list
	const playerList: Player[] = details.players.map((id, index) => ({
		ID: id,
		joined: false,
		left:false,
		position: index + 1
	}));

	// add the game to the array
	games.push({
		ID: details.ID,
		players: playerList,
		game: new Game(details.format),
		status: "created",
		lastCheck: Date.now()
	});
}