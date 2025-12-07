import type { LobbyEntry } from './index.js';

// removing the lobby if the players didn't come back in 1 minute after game is ended,
// or if the lobby is straight up empty
export function StatusChecker(lobbies:LobbyEntry[])
{
	for (let i = 0; i < lobbies.length; ++i) {
		if (lobbies[i].lobby.empty() === true
			|| (lobbies[i].lobby.players.find(p => p.status === "connected") === undefined
				&& Date.now() - lobbies[i].lastCheck > 60000)) {
			console.log(`Removing lobby ${lobbies[i].lobby.ID} ...`);
			lobbies.splice(i, 1);
		}

		// update check time
		lobbies[i].lastCheck = Date.now();
	}
}