/* {method: 'CREATE', plaayerID: <playerID>, format: <format> }
	@format: the number of rounds a player need to win to win the match

	Description: Creates a lobby, if 'format' is a valid format the lobby inherits that format.
	Reply: { method: 'CREATE_REPLY', status: 'success/failure', value: <lobbyID> }
*/

import { Lobby } from './Lobby.js';
import { createLobby } from './index.js';

type CreateReturn = {
	status: "success" | "failure",
	reply:string,
	playerID?:string
	lobby?:Lobby,
}

// lobby here is just to check if wwe joined or not
export function CREATE(msg:object, outlobby:Lobby | undefined): CreateReturn
{
	// check if we already in lobby
	if (outlobby !== undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'CREATE_REPLY', status: "failure", comment: "already in a lobby"}),
		}
	}

	// check for playerID
	if (!("playerID" in msg) || typeof msg.playerID !== "string") {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'CREATE_REPLY', status: "failure", comment: "missing playerID"}),
		}
	}

	//create lobby
	let lobby:Lobby = createLobby();

	// check if the obj has format
	if ("format" in msg && typeof msg.format === "number" ) {
		console.log(`Setting format ${msg.format}`);
		lobby.setFormat(msg.format);
	}

	// join lobby
	lobby.join(msg.playerID);

	// success return
	return {
		status: "success",
		reply: JSON.stringify({ method: 'CREATE_REPLY', status: "success", value: lobby.getID()}),
		playerID: msg.playerID,
		lobby: lobby
	};
}

/* {method: 'JOIN', lobbyID: <lobbyID>, playerID: <playerID> }
	@lobbyID: the ID of the lobby as a string
	@playerID: the ID of the player as a string

	Description: Joins a lobby with the specified ID, if playerID is null it fails
	Reply: { method: 'JOIN_REPLY', status: 'success/failure', value: <lobbyID>, comment: <comment> }

*/

import { getLobby } from './index.js';

type JoinReturn = {
	status: "success" | "failure",
	reply:string,
	playerID?:string,
	lobby?:Lobby
}

export function JOIN(msg:object, outlobby:Lobby | undefined): JoinReturn
{
	// check if we already in lobby
	if (outlobby !== undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'CREATE_REPLY', status: "failure", comment: "already in a lobby"}),
		}
	}

	// check if the obj has lobbyID and playerID
	if ("lobbyID" in msg === false || typeof msg.lobbyID !== "string"
		|| "playerID" in msg === false || typeof msg.playerID !== "string")
	{
		console.log(`invalid JSON message ${msg}`);
		return {
			status: "failure",
			reply: JSON.stringify({method: 'JOIN_REPLY', status: 'failure', comment: "invalid JSON"})
		};
	}

	// check if lobby is created
	let lobby:Lobby | undefined = getLobby(msg.lobbyID);

	// lobby not found
	if (lobby === undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'JOIN_REPLY', status: 'failure', value: msg.lobbyID, comment: "Lobby not found"})
		};
	}

	// actually join the lobby
	lobby.join(msg.playerID);

	// successful return
	return {
		status: "success",
		reply: JSON.stringify({ method: 'JOIN_REPLY', status: 'success', value: msg.lobbyID, comment: `Lobby ${msg.lobbyID} joined successfully!`}),
		playerID: msg.playerID,
		lobby: lobby
	}
}

/* {method: 'START' }
	Description: Starts the lobby. only one player will do that, than the lobby is closed and set to 'in-game'.
					If the lobby started correctly the 'value' of the reply is set to the 'gameID' to join
					Note: the other player will be notified that the lobby was successfully started by the 'ingame' propery of the
					lobbyStatus that gets sent once every second
	Reply (failure): { method: 'START_REPLY', status: 'failure', comment: <comment> }
	Reply (success): { method: 'START_REPLY', status: 'success', comment: <comment>, value: <gameID> }

*/

/* helper */
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

type StartReturn = {
	status: "success" | "failure",
	reply:string,
	format?:number,
	gameID?:string,
	players?:string[]
}

export async function START(lobby:Lobby | undefined, gameService:any | undefined, url:string): Promise<StartReturn>
{
	// check if you joined a lobby
	if (lobby === undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'START_REPLY', status: 'failure', comment: "Join a lobby before starting the game dumass" })
		};
	}

	// check if lobby is full
	if (!lobby.full()) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'START_REPLY', status: 'failure', comment: "The lobby isnt full, cannot start game" })
		};
	}
	
	// welp...
	if (await checkServiceHealth(url) === false) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'START_REPLY', status: 'failure', comment: "The Game service is unavailable" })
		};
	}

	// get variables from the callback
	let ret = lobby.launch((ID:string, format:number, players:string[]): boolean => {
		try {
			gameService.createGame.mutate({
				ID: ID,
				format: format,
				players: players
			});
		} catch (err) {
			console.log("Failed to connect to Game service:", err);
			return false
		}
		return true;
	});

	// failed launch
	if (ret.status === "failure") {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'START_REPLY', status: 'failure', comment: ret.reply })
		}
	}

	// send game started reply
	return {
		status: "success",
		reply: JSON.stringify({ method: 'START_REPLY', status: 'success', value: ret.ID, comment: "The lobby is now in game"}),
		gameID: ret.ID,
	};

}