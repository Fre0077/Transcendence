import type { GameEntry } from './gameDB.js';
import { games } from './gameDB.js';

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

export function StatusChecker()
{
	games.forEach((entry, idx) => {
		if (allJoined(entry) === true && entry.status !== "ongoing")	// check if game isn't started yet
		{
			/* start procedure */
			console.log(`Starting game ${entry.ID} ...`);
			entry.status = "ongoing";
			entry.game.start();
		}
		// update kill timer if someone joined
		else if (entry.players.find(p => p.joined === true) !== undefined)
        {
            // update check time
            entry.lastCheck = Date.now();
        }
		else if (allLeft(entry) === true
			|| Date.now() - entry.lastCheck > 60000)
		{
			/* close procedure */
			console.log(`Closing game ${entry.ID} ...`)
			entry.status = "finished";
			entry.game.stop();

			// check if lobby backend is alive ...
			// ... and tell to lobby backend
			safeTRPC(entry.ID);
			
			// #todo send to DB
			saveGameIntoMatchHistory();

			// remove from array
			console.log(`Removing game ${entry.ID} ...`);
			games.splice(idx, 1);
		}
	});
}