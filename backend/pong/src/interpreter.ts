
import { /* AUTH,  *//* JOIN, */ LEAVE, MOVE/* , SPECTATE */ } from './METHODS.js'
import { Game } from './Game.js';
// import { GameEntry } from './index.js';


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
	outgame:Game,
	outplayer:string,
	/* listener:(state:string) => void *//* ,
	callback :(game:string | undefined) => void */): Promise<string>
{
			
	// Format and log message
	let msg = isValidObj(message.toString());
	if (msg === undefined) {
		console.log(`invalid JSON message ${message}`);
		return `invalid JSON message ${message}`;
	}

	// logging
	if (msg.method !== 'MOVE') console.log('Received: ', msg);	/* #debug */

	// Handle methods
	switch (msg.method)
	{
		case "AUTH":
			/* {method: 'AUTH', playerID: <playerID>}
				@playerID: the ID you are logging in
				Description: AUTHenticates the connection, just once per connection.
			*/
			// let aret = AUTH(msg, outplayer, listener);

			// // welp...
			// if (aret.status === "success") {
			// 	// save variables
			// 	callback(aret.game, aret.player);
			// }

			// send reply
			// return aret.reply;
			return JSON.stringify({ method: 'AUTH_REPLY', status: "failure", cause: 'deprecated', comment: "AUTH method deprecated"})

		case "JOIN":
			// process JOIN request
			// let jret = JOIN(msg, outgame, outplayer, listener);

			// // successful JOIN
			// if (jret.status === "success")
			// {
			// 	/* store variables */
			// 	callback(jret.game, jret.player);
			// }

			// send reply to frontend
			// return jret.reply;
			return JSON.stringify({ method: 'JOIN_REPLY', status: "failure", cause: 'deprecated', comment: "JOIN method deprecated"})
		
		case "LEAVE":
			// process LEAVE request
			let lret = LEAVE(outgame, outplayer);

			// if (lret.status === "success")
			// {
			// 	//---
			// 	callback(lret.game/* , lret.player */);
			// }

			// send reply to frontend
			return lret.reply;

		case "MOVE":
			// process MOVE request
			let mret = MOVE(msg, outgame, outplayer);

			return mret;
		
		case "SPECTATE":
			// process SPECTATE request
			// let sret = SPECTATE(msg, outplayer, listener);

			// return sret;
			return JSON.stringify({ method: 'SPECTATE_REPLY', status: "failure", cause: 'deprecated', comment: "SPECTATE method deprecated (check different endpoint)"})
		
		default:
			console.log(`Unhandled method ${msg.method}`);

			// error reply
			return JSON.stringify({ method: `${msg.method}_REPLY`, status: 'failure', comment: `Unhandled method ${msg.method}`});
	}
}