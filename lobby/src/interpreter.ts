import { CREATE, JOIN, LEAVE, START, BOT } from './METHODS.js';
import { gameService } from './index.js'
import type { Lobby, Player } from './Lobby.js'

import type { WebSocket } from "ws";

/* HELPERS */

// check if the string is a JSON obj
function isValidObj(message:string): { method: string } | undefined {
	let parse: unknown;

	// JSON parse
	try {
		parse = JSON.parse(message.toString());
	} catch (err) {
		return undefined;
	}

	const obj:{ method: string } = Object(parse);

	// check 'method' property
	if (obj === undefined
		|| !("method" in obj)
		|| typeof obj.method !== "string")
	{
		console.log(`invalid JSON message ${message}`);
		return undefined;
	}

	return obj;
}

export async function interpreter(
	message:string,
	lobby:Lobby | undefined,
	player:Player | undefined,
	ws:WebSocket,
	callback :(lobby:Lobby | undefined, player:Player | undefined) => void): Promise<string>
{
	// Format and log message
	let msg = isValidObj(message.toString());
	if (msg === undefined) {
		console.log(`invalid JSON message ${message}`);
		return `invalid JSON message ${message}`;
	}

	// loggigng message
	console.log("Received: ", msg);
	
	// various lobby operations
	switch (msg.method)
	{
		case "CREATE":
			/* { method: 'CREATE', playerID: <playerID>, format: <format> }
				Description: Creates a lobby, if 'format' is a valid format the lobby inherits that format.
				NOTE: automatically JOIN the lobby after a CREATE request
			*/
			let cret = CREATE(msg, lobby, ws);

			// welp...
			if (cret.status === "success") {
				// save variables
				callback(cret.lobby, cret.player);
			}

			// send reply
			return cret.reply;

		case "JOIN":
			/* { method: 'JOIN', lobbyID: <lobbyID>, playerID: <playerID> }
				Description: Joins a lobby with the specified ID, if playerID is null it fails
			*/
			let jret = JOIN(msg, lobby, ws);

			// welp...
			if (jret.status === "success") {
				// save variables
				callback(jret.lobby, jret.player);
			}
			
			// send reply
			return jret.reply;
		
		case "LEAVE":
			/* { method: 'LEAVE' }
				Description: Leaves the lobby. If not authenticated or not joined a lobby the
				request fails.
			*/
			let lret = LEAVE(lobby, player/* , ws */);

			// welp...
			if (lret.status === "success") {
				// save variables
				callback(lret.lobby, lret.player);
			}

			// send reply
			return lret.reply;

		case "BOT":
			/* { method: 'BOT', value: <command> }
				Description: ADDs or REMOVEs a BOT to the lobby
			*/
			let bret = BOT(msg, lobby);
			
			// send reply
			return bret.reply;
		
		case "START":
			/* { method: 'START' }
				Description: Starts the lobby. only one player will do that, than the lobby is closed and set to 'in-game'.
				If the lobby started correctly the 'value' of the reply is set to the 'gameID' to join
				Note: the other player will be notified that the lobby was successfully started by the 'ingame' propery of the
				lobbyStatus that gets sent once every second
			*/
			let sret = await START(lobby, gameService.service, gameService.url);

			// send reply
			return sret.reply;
		
		default:
			console.log(`Unhandled method ${msg.method}`);

			return JSON.stringify({ method: `${msg.method}_REPLY`, status: 'failure', comment: `Unhandled method ${msg.method}`});
	}
}