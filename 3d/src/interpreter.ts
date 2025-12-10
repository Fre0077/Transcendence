
import { JOIN, LEAVE, MOVE } from './METHODS.js'
import { GameEntry, Player } from './gameDB.js';
import { Bot } from './Bot.js'

// check if the string is a JSON obj with the 'method' property
function isValidObj(message:string): { method: string } | undefined
{
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

export function interpreter(
	message:string,
	entry:GameEntry | undefined,
	player:Player | undefined,
	callback :(entry:GameEntry | undefined, player:Player | undefined) => void): string | null
{
			
	// Format and log message
	let msg = isValidObj(message.toString());
	if (msg === undefined) {
		console.log(`invalid JSON message ${message}`);
		return `invalid JSON message ${message}`;
	}

	// logging
	console.log('Received: ', msg);

	// Handle methods
	switch (msg.method)
	{
		case "JOIN":
			// process JOIN request
			let jret = JOIN(msg);

			// successful JOIN
			if (jret.status === "success")
			{
				const retEntry = jret.entry as GameEntry;
				const retPlayer = jret.player as Player;
				/* store variables */
				callback(retEntry, retPlayer);
			}

			// send reply to frontend
			return jret.reply;
		
		case "LEAVE":
			// process LEAVE request
			let lret = LEAVE(entry, player);

			if (lret.status === "success")
			{
				//---
				callback(undefined, player);
			}

			// send reply to frontend
			return lret.reply;

		case "MOVE":
			// process MOVE request
			let mret = MOVE(msg, entry, player);

			return mret;
		
		default:
			console.log(`Unhandled method ${msg.method}`);

			// error reply
			return JSON.stringify({ method: `${msg.method}_REPLY`, status: 'failure', comment: `Unhandled method ${msg.method}`});
	}
}