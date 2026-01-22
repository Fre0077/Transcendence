import { DisconnectLifecycleSocket } from "./lifecycleWebSocket";
import { DisconnectLobbySocket } from "./lobbyWebSocket";
import { DisconnectTournamentSocket } from "./tournamentWebSocket";


export function DisconnectAllWebSockets()
{
	DisconnectLifecycleSocket();
	DisconnectLobbySocket();
	DisconnectTournamentSocket();
}

// should be runned often
export function DisconnectUtilityWebSockets()
{
	DisconnectLobbySocket();
	DisconnectTournamentSocket();
}