import { Lobby } from './Lobby.js';

export function StatusChecker(lobbies:Lobby[])
{
	for (let i = 0; i < lobbies.length; ++i) {
		if (lobbies[i].empty() === true) {
			lobbies.splice(lobbies.indexOf(lobbies[i]), 1);
		}
	}
}