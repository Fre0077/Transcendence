
import { Tournament } from './Tournament.js';
import { createTournament, findTournament, joinTournament } from './index.js';
import type { WebSocket } from "ws";


type StandardReturn = {
	status: "success" | "failure";
	reply:string;
	player?:string;
	tournament?:string;
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
	
	// if already joined previously get the tournament ID
	const tournament = findTournament((tournament:Tournament<WebSocket>) => { return tournament.has(msg.playerID as string);})
	const retournament = (tournament === undefined) ? undefined : tournament.ID;
	if (retournament) {
		// update the websocket if already in a lobby
		console.log('Autojoining', msg.playerID);
		joinTournament(retournament, msg.playerID, ws);
	}


	// success return
	return {
		status: "success",
		reply: JSON.stringify({ method: 'AUTH_REPLY', status: "success", comment: "Successfully authenticated"}),
		player: msg.playerID,
		tournament: retournament
	};
}

/*
{
	method: 'CREATE',     (mandatory)
	size: <size>,		  (optional)
	format: <format>      (optional)
}
@size: the number of player in the tournament (must be compatible with the format)
@format: the format of the tournament as an alias (single-elimination)

Description: Creates a lobby, if 'format' is a valid format the lobby inherits that format. The player automatically joins the lobby that he created
Reply:
{
	method: 'CREATE_REPLY',
	status: 'success/failure',
	value: <tournamentID>,           (only on status === 'success')
	comment: <reason>           (only on status === 'failure')
}
*/

export function CREATE(msg:object,
	outournament:string | undefined,
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

	// check if we already in tournament
	if (outournament !== undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'CREATE_REPLY', status: "failure", comment: "already in a tournament"})
		}
	}

	let tournament:Tournament<WebSocket> | undefined;

	// check if the obj has format
	if ("size" in msg && typeof msg.size === "number" )
	{
		if ("format" in msg && typeof msg.format === "string" )
		{
			// crerate tournamnet with format and size
			tournament = createTournament(/* "pong" */msg.size, msg.format);
		}
		else
		{
			// create tournamennt with default values
			tournament = createTournament(/* "pong" */msg.size);
		}
	}
	else
	{
		// create tournament with format
		tournament = createTournament(/* "pong" */);
	}

	// check if creation was correct
	if (tournament === undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'CREATE_REPLY', status: "failure", comment: "error while creating tournament"})
		}
	}

	// join tournament
	tournament.join(outplayer, ws);

	// success return
	return {
		status: "success",
		reply: JSON.stringify({ method: 'CREATE_REPLY', status: "success", value: tournament.ID}),
		player: outplayer,
		tournament: tournament.ID
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
	outournament:string | undefined,
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
	if (outournament !== undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'JOIN_REPLY', status: "failure", comment: "already in a tournament"})
		}
	}

	// check if the obj has tournamentID and playerID
	if ("tournamentID" in msg === false || typeof msg.tournamentID !== "string")
	{
		console.log(`invalid JSON message ${msg}`);
		return {
			status: "failure",
			reply: JSON.stringify({method: 'JOIN_REPLY', status: 'failure', comment: "invalid JSON: missing 'lobbyID'"})
		};
	}

	// check if lobby is created
	const tournament:Tournament<WebSocket> | undefined = findTournament((tournament:Tournament<WebSocket>) => { return tournament.ID === msg.tournamentID });

	// lobby not found
	if (tournament === undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'JOIN_REPLY', status: 'failure', value: msg.tournamentID, comment: "Tournament not found"})
		};
	}

	// actually join the lobby
	if (tournament.join(outplayer, ws) === false) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'JOIN_REPLY', status: 'failure', value: msg.tournamentID, comment: "Error while joining the tournament, either the lobby is full or you're already connected"})
		};
	}

	// successful return
	return {
		status: "success",
		reply: JSON.stringify({ method: 'JOIN_REPLY', status: 'success', value: msg.tournamentID, comment: `Tournament ${msg.tournamentID} joined successfully!`}),
		player: outplayer,
		tournament: tournament.ID
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

export function LEAVE(outournament:string | undefined, outplayer:string | undefined): StandardReturn
{
	// check auth
	if (outplayer === undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'LEAVE_REPLY', status: 'failure', comment: "Not authenticated yet" })
		};
	}

	// check if you joined a lobby
	if (outournament === undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'LEAVE_REPLY', status: 'failure', comment: "Not in a lobby" })
		};
	}

	// leave the lobby
	const tournament:Tournament<WebSocket> | undefined = findTournament((tournament:Tournament<WebSocket>) => { return tournament.ID === outournament });
	tournament?.leave(outplayer);

	// successfule return
	return {
		status: "success",
		reply: JSON.stringify({ method: 'LEAVE_REPLY', status: 'success', comment: "Left the lobby" }),
		tournament: undefined,
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

export async function READY(outplayer:string | undefined, outournament:string | undefined): Promise<StandardReturn>
{
	// check if authenticated
	if (outplayer === undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'READY_REPLY', status: 'failure', comment: 'Authenticate before getting ready' })
		}
	}

	// check if you joined a tournament
	if (outournament === undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'READY_REPLY', status: 'failure', comment: "Join a tournament before starting the game dumass" })
		};
	}

	// get the lobby
	const tournament:Tournament<WebSocket> | undefined = findTournament((tournament:Tournament<WebSocket>) => { return tournament.ID === outournament });
	if (tournament === undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'READY_REPLY', status: 'failure', comment: "The tournament was deleted while you where still inside, im sorry" })
		};
	}

	// get variables from the callback
	let ret = tournament.ready(outplayer);

	// failed launch
	if (ret.status === 'failure') {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'READY_REPLY', status: 'failure', comment: ret.reason })
		}
	}

	// just another player readyed
	if (ret.gameid === undefined) {
		return {
			status: "success",
			reply: JSON.stringify({ method: 'READY_REPLY', status: 'success', comment: "Readyed successfully"})
		};
	}

	// build successful reply
	const reply:string = JSON.stringify({ method: 'START_REPLY', status: 'success', value: ret.gameid, comment: "The room is now in game"});
	
	// send to all players in room
	tournament.roomcast(outplayer, reply);

	// ask bots to join the game
	for (const id of tournament.roomates(outplayer)) {
		if (id.startsWith('BOT')) {
			bunnyPublish('bot', {
				method: 'CREATE',
				game: 'pong', 				// #todo: flexible
				gameid: ret.gameid,
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

export function BOT(msg:object, outournament:string | undefined)
{
	// check if you joined a lobby
	if (outournament === undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'BOT_REPLY', status: 'failure', comment: "Join a tournament before adding a Bot" })
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
	const tournament:Tournament<WebSocket> | undefined = findTournament((tournament:Tournament<WebSocket>) => { return tournament.ID === outournament });
	if (tournament === undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'BOT_REPLY', status: 'failure', comment: "The tournament was deleted while you where still inside, im sorry" })
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
		if (tournament.full()) {
			return {
				status: "failure",
				reply: JSON.stringify({ method: 'BOT_REPLY', status: 'failure', comment: "The tournament is full, cannot add a BOT" })
			};
		}

		// add the bot
		tournament.join(`BOT_${botcount.length}_${msg.level}`, null);

		// next bot
		botcount.push(msg.level);

		// successful return
		return {
			status: "success",
			reply: JSON.stringify({ method: 'BOT_REPLY', status: 'success', comment: "Added BOT to the tournament" })
		};
	}
	else if (msg.value === "REMOVE")
	{
		// check if bot in lobby
		if (botcount.length === 0) {
			return {
				status: "failure",
				reply: JSON.stringify({ method: 'BOT_REPLY', status: 'failure', comment: "No BOT in the tournament" })
			};
		}

		// remove the bot
		const idx = botcount.length - 1;
		if (tournament.leave(`BOT_${idx}_${botcount[idx]}`) === false) {
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