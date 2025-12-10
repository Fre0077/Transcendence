import { lobbies } from './lobbyDB.js'

// removing the lobby if the players didn't come back in 1 minute after game is ended,
// or if the lobby is straight up empty
export function StatusChecker()
{
	lobbies.forEach((entry, idx) => {
		if (entry.lobby.empty() === true
			|| entry.lobby.players.find(p => p.ID !== "BOT") === undefined
			|| Date.now() - entry.lastCheck > 60000) {
			console.log(`Removing lobby ${entry.lobby.ID} ...`);
			lobbies.splice(idx, 1);
		}
		else if (entry.lobby.players.find(p => p.status === "connected") !== undefined
				|| entry.lobby.players.find(p => p.status === "ingame") !== undefined)
        {
            // update check time
            entry.lastCheck = Date.now();
        }
	});
}