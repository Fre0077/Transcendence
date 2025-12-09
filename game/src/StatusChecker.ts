import type { GameEntry } from "./index.js";

import { safeTRPC, saveGameIntoMatchHistory } from "./index.js";

function allJoined(entry:GameEntry): boolean {

	if (entry === undefined) {return false};
	if (entry.status !== "joining") {return false;}

	let j = 0;
	while (j < entry.players.length
		&& (entry.players[j].joined === true || entry.players[j].ID === "BOT"))
		++j;

	return j === entry.players.length;
}

function allLeft(entry:GameEntry): boolean {

	if (entry === undefined) {return false};

	let j = 0;
	while (j < entry.players.length
		&& (entry.players[j].left === true || entry.players[j].ID === "BOT"))
		++j;

	return j === entry.players.length;
}

export function StatusChecker(games:GameEntry[])
{
	for (let i = 0; i < games.length; ++i) {

		if (allJoined(games[i]) === true)	// check if game isn't started yet
		{
			/* start procedure */
			console.log(`Starting game ${games[i].ID} ...`);
			games[i].status = "ongoing";
			games[i].game.start();
		}
		else if (allLeft(games[i]) === true)
		{
			/* close procedure */
			console.log(`Closing game ${games[i].ID} ...`)
			games[i].status = "finished";
			games[i].game.stop();

			// check if lobby backend is alive ...
			// ... and tell to lobby backend
			safeTRPC(games[i].ID);
			
			// #todo send to DB
			saveGameIntoMatchHistory();

			// remove from array
			console.log(`Removing game ${games[i].ID} ...`);
			games.splice(games.indexOf(games[i]), 1);
		}
	}
}