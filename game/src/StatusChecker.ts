import type { GameEntry } from "./index.js";

// Health checker
async function checkServiceHealth(url:string) {

	// console.log(`checking '${url}' health ...`);

	if (url === undefined || url === null) {
		console.log('invalid URL');
		return false;
	}

	const health = await fetch(`${url}/health`)
		.then(r => r.json())
		.catch(() => null);

	if (!health?.status) {
		console.log(`Server '${url}' offline`);
		return false;
	}

	console.log(`Server '${url}' online`);
	return true;
}

function allJoined(entry:GameEntry): boolean {

	if (entry === undefined) {return false};
	if (entry.status !== "joining") {return false;}

	let j = 0;
	while (j < entry.players.length && entry.players[j].joined === true)
		++j;

	return j === entry.players.length;
}

function allLeft(entry:GameEntry): boolean {

	if (entry === undefined) {return false};

	let j = 0;
	while (j < entry.players.length && entry.players[j].left === true)
		++j;

	return j === entry.players.length;
}

export function StatusChecker(games:GameEntry[], lobbyService:any, url:string)
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

			// check if lobby backend is alive
			checkServiceHealth(url)
				.then((value) => {
					// tell to lobby backend
					if (value === true) lobbyService.endGame.mutate(games[i].ID);
					// remove from array
					games.splice(games.indexOf(games[i]), 1);
				})
				.catch((err) => {
					console.log("StatusChecker Promise error:", err);
				});
		}
	}
}