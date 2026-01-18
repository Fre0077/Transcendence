import { /* AUTH, */ CREATE, JOIN, LEAVE, READY, BOT } from './METHODS.js';

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

/* gets the player and tournament strings (if undefined meaning not AUTH or CREATE/JOIN)
and process the input. Reurns the reply to send to the client as a Promise */
export async function interpreter(
	message:string,
	tournament:string | undefined,
	player:string,
	ws:WebSocket,
	/* the parameters of the callback are the new tournamentID or playerID, or if the tournament was updated (something changed) */
	callback :(tournament:string | undefined) => void): Promise<string>
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
		case "AUTH":
			/* {method: 'AUTH', playerID: <playerID>}
				@playerID: the ID you are logging in
				Description: AUTHenticates the connection, just once per connection.
			*/
			// let aret = AUTH(msg, player, ws);

			// // welp...
			// if (aret.status === "success") {
			// 	// save variables
			// 	callback(aret.tournament, aret.player);
			// }

			// send reply
			// return aret.reply;
			return JSON.stringify({ method: 'AUTH_REPLY', status: "failure", cause: 'deprecated', comment: "AUTH method deprecated"})

		case "CREATE":
			/* { method: 'CREATE', playerID: <playerID>, format: <format> }
				Description: Creates a lobby, if 'format' is a valid format the lobby inherits that format.
				NOTE: automatically JOIN the tournament after a CREATE request
			*/
			let cret = CREATE(msg, tournament, player, ws);

			// welp...
			if (cret.status === "success") {
				// save variables
				callback(cret.tournament/* , cret.player */);
			}

			// send reply
			return cret.reply;

		case "JOIN":
			/* { method: 'JOIN', tournamentID: <tournamentID>, playerID: <playerID> }
				Description: Joins a tournament with the specified ID, if playerID is null it fails
			*/
			let jret = JOIN(msg, tournament, player, ws);

			// welp...
			if (jret.status === "success") {
				// save variables
				callback(jret.tournament/* , jret.player */);
			}
			
			// send reply
			return jret.reply;
		
		case "LEAVE":
			/* { method: 'LEAVE' }
				Description: Leaves the tournament. If not authenticated or not joined a lobby the
				request fails.
			*/
			let lret = LEAVE(tournament, player);

			// welp...
			if (lret.status === "success") {
				// save variables
				callback(lret.tournament/* , lret.player */);
			}

			// send reply
			return lret.reply;

		case "BOT":
			/* { method: 'BOT', value: <command> }
				Description: ADDs or REMOVEs a BOT to the tournament
			*/
			let bret = BOT(msg, tournament);
			
			// just for the update
			callback(tournament/* , player */);

			// send reply
			return bret.reply;
		
		case "READY":
			/* { method: 'START' }
				Description: Starts the tournament. only one player will do that, than the tournament is closed and set to 'in-game'.
				If the tournament started correctly the 'value' of the reply is set to the 'gameID' to join
				Note: the other player will be notified that the tournament was successfully started by the 'ingame' propery of the
				tournamentStatus that gets sent once every second
			*/
			let sret = await READY(player, tournament);

			// just for the update
			callback(tournament/* , player */);

			// send reply
			return sret.reply;
		
		default:
			console.log(`Unhandled method ${msg.method}`);

			return JSON.stringify({ method: `${msg.method}_REPLY`, status: 'failure', comment: `Unhandled method ${msg.method}`});
	}
}