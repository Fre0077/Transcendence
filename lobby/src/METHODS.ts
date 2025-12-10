/*
{
	method: 'CREATE',     (mandatory)
	playerID: <playerID>, (mandatory)
	format: <format>      (optional)
}
@format: the number of rounds a player need to win to win the match

Description: Creates a lobby, if 'format' is a valid format the lobby inherits that format. The player automatically joins the lobby that he created
Reply:
{
	method: 'CREATE_REPLY',
	status: 'success/failure',
	value: <lobbyID>,           (only on status === 'success')
	comment: <reason>           (only on status === 'failure')
}
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
		reply: JSON.stringify({ method: 'CREATE_REPLY', status: "success", value: lobby.ID}),
		playerID: msg.playerID,
		lobby: lobby
	};
}

/*
{
	method: 'JOIN',       (mandatory)
	lobbyID: <lobbyID>,   (mandatory)
	playerID: <playerID>  (mandatory)
}
@lobbyID: the ID of the lobby as a string
@playerID: the ID of the player as a string

Description: Joins a lobby with the specified ID, if any of the property is missing
or invalid or there is no lobby with the lobbyID requested, it fails.
Reply:
{
	method: 'JOIN_REPLY',
	status: 'success/failure',
	value: <lobbyID>,           (only on status === 'success')
	comment: <comment>          (only on status === 'failure')
}
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
			reply: JSON.stringify({ method: 'JOIN_REPLY', status: "failure", comment: "already in a lobby"}),
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
	if (lobby.join(msg.playerID) === false) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'JOIN_REPLY', status: 'failure', value: msg.lobbyID, comment: "Error while joining the lobby, either the lobby is full or in-game"})
		};
	}

	// successful return
	return {
		status: "success",
		reply: JSON.stringify({ method: 'JOIN_REPLY', status: 'success', value: msg.lobbyID, comment: `Lobby ${msg.lobbyID} joined successfully!`}),
		playerID: msg.playerID,
		lobby: lobby
	}
}

/*
{
	method: 'LEAVE'
} 
Description: Leaves the lobby. If not authenticated or not joined a lobby the
request fails
Reply:
{
	method: 'LEAVE_REPLY',
	status: 'success/failure',
	comment: <comment>
}
*/
export function LEAVE(lobby:Lobby | undefined, playerID:string | undefined)
{
	// check if you joined a lobby
	if (lobby === undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'LEAVE_REPLY', status: 'failure', comment: "Not in a lobby" })
		};
	}

	// check auth
	if (playerID === undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'LEAVE_REPLY', status: 'failure', comment: "Not authenticated yet" })
		};
	}

	// leave the lobby
	lobby.leave(playerID);

	// successfule return
	return {
		status: "success",
		reply: JSON.stringify({ method: 'LEAVE_REPLY', status: 'success', comment: "Left the lobby" })
	};
}

/*
{
	method: 'START'
}

Description: Starts the lobby. only one player will do that, than the lobby is closed and set to 'in-game'.
If the lobby started correctly the 'value' of the reply is set to the 'gameID' to join
Note: the other player will be notified that the lobby was successfully started by the 'ingame' propery of the "lobbyStatus" that gets sent once every second
Reply:
{
	method: 'START_REPLY',
	status: 'success/failure',
	comment: <comment>,
	value:<gameID>      (only on status === 'success')
}
*/

/* helper */
// Health checker
async function checkServiceHealth(url:string)
{

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

/*
{
	method: 'BOT',
	value: <action>
}

Description: ADDs or REMOVEs bots to the lobby. If you are not in a lobby the request will fail.
Reply:
{
	method: 'BOT_REPLY',
	status: 'success/failure',
	comment: <comment>
}
*/
export function BOT(msg:object, lobby:Lobby | undefined)
{
	// check if you joined a lobby
	if (lobby === undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'BOT_REPLY', status: 'failure', comment: "Join a lobby before starting the game dumass" })
		};
	}

	// check if the obj has lobbyID and playerID
	if ("value" in msg === false || typeof msg.value !== "string")
	{
		console.log(`invalid JSON message ${msg}`);
		return {
			status: "failure",
			reply: JSON.stringify({method: 'BOT_REPLY', status: 'failure', comment: "invalid JSON"})
		};
	}

	// check action expected
	if (msg.value === "ADD")
	{
		// check if lobby is full
		if (lobby.full()) {
			return {
				status: "failure",
				reply: JSON.stringify({ method: 'BOT_REPLY', status: 'failure', comment: "The lobby is full, cannot add a BOT" })
			};
		}

		// add the bot
		lobby.join("BOT");

		// successful return
		return {
			status: "success",
			reply: JSON.stringify({ method: 'BOT_REPLY', status: 'success', comment: "Added BOT to the lobby" })
		};
	}
	else if (msg.value === "REMOVE")
	{
		// check if bot in lobby
		if (lobby.players.find(p => p.ID === "BOT") === undefined) {
			return {
				status: "failure",
				reply: JSON.stringify({ method: 'BOT_REPLY', status: 'failure', comment: "No BOT in the lobby" })
			};
		}

		// remove the bot
		lobby.leave("BOT");

		// successful return
		return {
			status: "success",
			reply: JSON.stringify({ method: 'BOT_REPLY', status: 'success', comment: "Removed BOT from the lobby" })
		};
	}
	else
	{
		// successful return
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'BOT_REPLY', status: 'failure', comment: "Invalid BOT action, try ADD or REMOVE" })
		};
	}
}