
import { AUTH, JOIN, LEAVE, MOVE } from './METHODS.js'

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

export async function interpreter(
	message:string,
	outgame:string | undefined,
	outplayer:string | undefined,
	listener:(state:string) => void,
	callback :(game:string | undefined, player:string | undefined) => void): Promise<string>
{
			
	// Format and log message
	let msg = isValidObj(message.toString());
	if (msg === undefined) {
		console.log(`invalid JSON message ${message}`);
		return `invalid JSON message ${message}`;
	}

	// logging
	// console.log('Received: ', msg);	/* #debug */

	// Handle methods
	switch (msg.method)
	{
		case "AUTH":
			/* {method: 'AUTH', playerID: <playerID>}
				@playerID: the ID you are logging in
				Description: AUTHenticates the connection, just once per connection.
			*/
			let aret = AUTH(msg, outgame, outplayer);

			// welp...
			if (aret.status === "success") {
				// save variables
				callback(aret.game, aret.player);
			}

			// send reply
			return aret.reply;

		case "JOIN":
			// process JOIN request
			let jret = JOIN(msg, outgame, outplayer, listener);

			// successful JOIN
			if (jret.status === "success")
			{
				/* store variables */
				callback(jret.game, jret.player);
			}

			// send reply to frontend
			return jret.reply;
		
		case "LEAVE":
			// process LEAVE request
			let lret = LEAVE(outgame, outplayer, listener);

			if (lret.status === "success")
			{
				//---
				callback(lret.game, lret.player);
			}

			// send reply to frontend
			return lret.reply;

		case "MOVE":
			// process MOVE request
			let mret = MOVE(msg, outgame, outplayer);

			return mret;
		
		default:
			console.log(`Unhandled method ${msg.method}`);

			// error reply
			return JSON.stringify({ method: `${msg.method}_REPLY`, status: 'failure', comment: `Unhandled method ${msg.method}`});
	}
}