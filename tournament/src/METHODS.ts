

import { Lobby } from './Tournament.js';
import { createLobby, findLobby, joinLobby } from './index.js';
import type { WebSocket } from "ws";


type StandardReturn = {
	status: "success" | "failure";
	reply:string;
	player?:string;
	lobby?:string;
}

/*
{
	method: 'AUTH',    		(mandatory)
	playerID: <playerID>    (mandatory)
}
@playerID: the ID you are logging in

Description: AUTHenticates the connection, just once per connection.
Reply:
{
	method: 'AUTH_REPLY',
	status: 'success/failure',
	comment: <reason>
}
*/
export function AUTH(msg:object, outplayer:string | undefined, ws:WebSocket): StandardReturn
{
	// check if already authenticated
	if (outplayer !== undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'AUTH_REPLY', status: "failure", comment: "Already authenticated"})
		}
	}

	// check for playerID
	if (!("playerID" in msg) || typeof msg.playerID !== "string") {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'AUTH_REPLY', status: "failure", comment: "missing playerID"})
		}
	}

	/* ! ! ! authentication procedure here ! ! ! */
	
	// if already joined previously get the lobby ID
	const lobby = findLobby((lobby:Lobby<WebSocket>) => { return lobby.players.has(msg.playerID as string);})
	const retlobby = (lobby === undefined) ? undefined : lobby.ID;
	if (retlobby) {
		// update the websocket if already in a lobby
		joinLobby(retlobby, msg.playerID, ws);
	}


	// success return
	return {
		status: "success",
		reply: JSON.stringify({ method: 'AUTH_REPLY', status: "success", comment: "Successfully authenticated"}),
		player: msg.playerID,
		lobby: retlobby
	};
}

/*
{
	method: 'CREATE',     (mandatory)
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

export function CREATE(msg:object,
	outlobby:string | undefined,
	outplayer:string | undefined,
	ws:WebSocket): StandardReturn
{
	// check if AUTHenticated
	if (outplayer === undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'CREATE_REPLY', status: "failure", comment: "Not authenticated"})
		}
	}

	// check if we already in lobby
	if (outlobby !== undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'CREATE_REPLY', status: "failure", comment: "already in a lobby"})
		}
	}

	//create lobby
	const lobby:Lobby<WebSocket> = createLobby(/* "pong" */);

	// check if the obj has format
	if ("format" in msg && typeof msg.format === "number" ) {
		console.log(`#todo Set format ${msg.format}`);
		// lobby.format(msg.format);
	}

	// join lobby
	lobby.join(outplayer, ws);

	// success return
	return {
		status: "success",
		reply: JSON.stringify({ method: 'CREATE_REPLY', status: "success", value: lobby.ID}),
		player: outplayer,
		lobby: lobby.ID
	};
}

/*
{
	method: 'JOIN',       (mandatory)
	lobbyID: <lobbyID>,   (mandatory)
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

export function JOIN(msg:object,
	outlobby:string | undefined,
	outplayer:string | undefined,
	ws:WebSocket): StandardReturn
{
	// check if AUTHenticated
	if (outplayer === undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'JOIN_REPLY', status: "failure", comment: "Not authenticated"})
		}
	}

	// check if we already in lobby
	if (outlobby !== undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'JOIN_REPLY', status: "failure", comment: "already in a lobby"})
		}
	}

	// check if the obj has lobbyID and playerID
	if ("lobbyID" in msg === false || typeof msg.lobbyID !== "string")
	{
		console.log(`invalid JSON message ${msg}`);
		return {
			status: "failure",
			reply: JSON.stringify({method: 'JOIN_REPLY', status: 'failure', comment: "invalid JSON: missing 'lobbyID'"})
		};
	}

	// check if lobby is created
	const lobby:Lobby<WebSocket> | undefined = findLobby((lobby:Lobby<WebSocket>) => { return lobby.ID === msg.lobbyID });

	// lobby not found
	if (lobby === undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'JOIN_REPLY', status: 'failure', value: msg.lobbyID, comment: "Lobby not found"})
		};
	}

	// actually join the lobby
	if (lobby.join(outplayer, ws) === false) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'JOIN_REPLY', status: 'failure', value: msg.lobbyID, comment: "Error while joining the lobby, either the lobby is full or you're already connected"})
		};
	}

	// successful return
	return {
		status: "success",
		reply: JSON.stringify({ method: 'JOIN_REPLY', status: 'success', value: msg.lobbyID, comment: `Lobby ${msg.lobbyID} joined successfully!`}),
		player: outplayer,
		lobby: lobby.ID
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

export function LEAVE(outlobby:string | undefined, outplayer:string | undefined): StandardReturn
{
	// check auth
	if (outplayer === undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'LEAVE_REPLY', status: 'failure', comment: "Not authenticated yet" })
		};
	}

	// check if you joined a lobby
	if (outlobby === undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'LEAVE_REPLY', status: 'failure', comment: "Not in a lobby" })
		};
	}

	// leave the lobby
	const lobby:Lobby<WebSocket> | undefined = findLobby((lobby:Lobby<WebSocket>) => { return lobby.ID === outlobby });
	lobby?.leave(outplayer);

	// successfule return
	return {
		status: "success",
		reply: JSON.stringify({ method: 'LEAVE_REPLY', status: 'success', comment: "Left the lobby" }),
		lobby: undefined,
		player: outplayer
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

import { bunnyPublish } from './bunny.js';

export async function START(outlobby:string | undefined): Promise<StandardReturn>
{
	// check if you joined a lobby
	if (outlobby === undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'START_REPLY', status: 'failure', comment: "Join a lobby before starting the game dumass" })
		};
	}

	// get the lobby
	const lobby:Lobby<WebSocket> | undefined = findLobby((lobby:Lobby<WebSocket>) => { return lobby.ID === outlobby });
	if (lobby === undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'START_REPLY', status: 'failure', comment: "The lobby was deleted while you where still inside, im sorry" })
		};
	}

	// check if lobby is full
	if (lobby.full() === false) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'START_REPLY', status: 'failure', comment: "The lobby isnt full, cannot start game" })
		};
	}

	// get variables from the callback
	let ret = await lobby.launch( async (gameID:string, players:string[]): Promise<boolean> => {
		// signal the GameService to create a Game
		return bunnyPublish('game', { ID: gameID, players: players });
	});

	// failed launch
	if (ret.status === 'failure') {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'START_REPLY', status: 'failure', comment: ret.reason })
		}
	}

	// build successful reply
	const reply:string = JSON.stringify({ method: 'START_REPLY', status: 'success', value: lobby.gameID, comment: "The lobby is now in game"});
	
	// broadcast to everyone
	lobby.broadcast(reply);

	// #debg
	console.log(`Starting lobby ${lobby.ID} ...`);

	// ask bots to join the game
	for (const id of lobby.players.keys()) {
		if (id.startsWith('BOT')) {
			bunnyPublish('bot', {
				method: 'CREATE',
				game: 'pong', 				// #todo: flexible
				gameid: lobby.gameID,
				botid: id,
				level: Number(id.substring(id.lastIndexOf('_') + 1))
			});
		}
	}

	// send game started reply
	return {
		status: "success",
		reply: reply,
	};

}

/*
{
	method: 'BOT',	(mandatory)
	value: <action>	(mandatory)
	level: <level>	(only if <action> === ADD)
}

Description: ADDs or REMOVEs bots to the lobby. If you are not in a lobby the request will fail.
Reply:
{
	method: 'BOT_REPLY',
	status: 'success/failure',
	comment: <comment>
}
*/
let botcount:number[] = [];

export function BOT(msg:object, outlobby:string | undefined)
{
	// check if you joined a lobby
	if (outlobby === undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'BOT_REPLY', status: 'failure', comment: "Join a lobby before adding a Bot" })
		};
	}

	// check if the obj has value
	if (!("value" in msg) || typeof msg.value !== "string")
	{
		console.log(`invalid JSON message ${msg}`);
		return {
			status: "failure",
			reply: JSON.stringify({method: 'BOT_REPLY', status: 'failure', comment: "invalid JSON"})
		};
	}

	// get the lobby
	const lobby:Lobby<WebSocket> | undefined = findLobby((lobby:Lobby<WebSocket>) => { return lobby.ID === outlobby });
	if (lobby === undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'BOT_REPLY', status: 'failure', comment: "The lobby was deleted while you where still inside, im sorry" })
		};
	}

	// check action expected
	if (msg.value === "ADD")
	{
		// check if the obj has value
		if (!("level" in msg) || typeof msg.level !== "number"
			|| msg.level < 0 || msg.level > 100)
		{
			console.log(`invalid JSON message ${msg}`);
			return {
				status: "failure",
				reply: JSON.stringify({method: 'BOT_REPLY', status: 'failure', comment: "invalid JSON, missing or invalid 'level'"})
			};
		}

		// check if lobby is full
		if (lobby.full()) {
			return {
				status: "failure",
				reply: JSON.stringify({ method: 'BOT_REPLY', status: 'failure', comment: "The lobby is full, cannot add a BOT" })
			};
		}

		// add the bot
		lobby.join(`BOT_${botcount.length}_${msg.level}`, null);

		// next bot
		botcount.push(msg.level);

		// successful return
		return {
			status: "success",
			reply: JSON.stringify({ method: 'BOT_REPLY', status: 'success', comment: "Added BOT to the lobby" })
		};
	}
	else if (msg.value === "REMOVE")
	{
		// check if bot in lobby
		if (botcount.length === 0) {
			return {
				status: "failure",
				reply: JSON.stringify({ method: 'BOT_REPLY', status: 'failure', comment: "No BOT in the lobby" })
			};
		}

		// remove the bot
		const idx = botcount.length - 1;
		if (lobby.leave(`BOT_${idx}_${botcount[idx]}`) === false) {
			return {
				status: "failure",
				reply: JSON.stringify({ method: 'BOT_REPLY', status: 'failure', comment: `Bot name 'BOT_${idx}_${botcount[idx]}'not found` })
			};
		}
	
		// back one bot
		botcount.pop();

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