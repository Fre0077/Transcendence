// import type { Game } from './Game.js';

type StandardReturn = {
	status: "success" | "failure";
	reply:string;
	player?:string;
	game?:string;
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
export function AUTH(msg:object, outgame:string | undefined, outplayer:string | undefined): StandardReturn
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
			reply: JSON.stringify({ method: 'AUTH_REPLY', status: "failure", comment: "missing playerID"}),
		}
	}

	/* ! ! ! authentication procedure here ! ! ! */

	// success return
	return {
		status: "success",
		reply: JSON.stringify({ method: 'AUTH_REPLY', status: "success", comment: "Successfully authenticated"}),
		player: msg.playerID,
		game: outgame
	};
}

/* {
	method: 'JOIN',       (mandatory)
	gameID: <gameID>,     (mandatory)
}
@gameID: the ID of the game as a string

Description: Joins a game with the specified ID, if any of the property is missing
or invalid or there is no game with the gameID requested, it fails.
Reply:
{
	method: 'JOIN_REPLY',
	status: 'success/failure',
	value: <gameID>,
	comment: <comment>		(only on status === 'failure')
} */	

import { findGame, joinGame } from './index.js';

export function JOIN(msg:object, outgame:string | undefined, outplayer:string | undefined, listener:(state:string) => void): StandardReturn
{
	// check if authenticated
	if (outplayer === undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'JOIN_REPLY', status: "failure", comment: "Authenticate before joining a game pls"})
		}
	}

	// check if already in a game
	if (outgame !== undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'JOIN_REPLY', status: "failure", comment: "Already joined a game"})
		}
	}

	// check if the obj has gameID amd playerID
	if (!("gameID" in msg)  || typeof msg.gameID !== "string")
	{
		console.log('invalid JSON message:', msg);
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'JOIN_REPLY', status: "failure", comment: "invalid JSON, missing gameID"})
		};
	}

	// check if game is in array
	const ret = joinGame(msg.gameID, outplayer, listener);

	// join failure
	if (ret.status === "failure") {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'JOIN_REPLY', status: "failure", value: msg.gameID, comment: ret.reason })
		};
	}
	
	// send successful join to frontend
	return {
		status: "success",
		reply: JSON.stringify({ method: 'JOIN_REPLY', status: "success", value: msg.gameID}),
		player: outplayer,
		game: msg.gameID
	};
}
/* 
{
	method: 'LEAVE'
}
Description: Leaves the game. If not authenticated or not joined a game the
request fails
Reply:
{
	method: 'LEAVE_REPLY',
	status: 'success/failure',
	comment: <comment>
}
*/
import { leaveGame } from './index.js';

export function LEAVE(outgame:string | undefined, outplayer:string | undefined, listener:(state:string) => void): StandardReturn
{
	// check auth
	if (outplayer === undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'LEAVE_REPLY', status: "failure", comment: "Not authenticated yet"})
		};
	}

	// check if in game
	if (outgame === undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'LEAVE_REPLY', status: "failure", comment: "Not in a game"})
		};
	}

	// leave the game
	const ret = leaveGame(outgame, outplayer, listener);

	// join failure
	if (ret.status === "failure") {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'LEAVE_REPLY', status: "failure", comment: ret.reason })
		};
	}

	// successfful reply
	return {
		status: "success",
		reply: JSON.stringify({ method: 'LEAVE_REPLY', status: "success", comment: "Left the game"}),
		player: outplayer,
		game: undefined
	};
}
/*
Request:
{
  method: 'MOVE',
  value: <moveType>
}
@value is the kind of move the player wants to do as a string, the options are:
  "UP_PRESS"    (the player pressed the Up key)
  "DW_PRESS"    (the player pressed the Down key)
  "UP_RELEASE"  (the player releaased the Up key)
  "DW_RELEASE"  (the player releaased the Down key)
  "START_PRESS" (the player requested the round to begin)
  "RESET_PRESS" (the player requested the game to be resetted) (maybe to remove)

Description: this is how the player interacts with the game mechanics and some basic match management.
Reply:
{
	method: 'MOVE_REPLY',
	status: 'failure',
	comment: <comment>	
}
Only replies in case of failure
*/

export function MOVE(msg:object, outgame:string | undefined, outplayer:string | undefined): string
{
	// check auth
	if (outplayer === undefined) {
		return JSON.stringify({ method: 'MOVE_REPLY', status: 'failure', comment: 'Authenticate before moving' });
	}

	// ignore other inputs if game not found yet
	if (outgame === undefined) {
		return JSON.stringify({ method: 'MOVE_REPLY', status: 'failure', comment: 'Join a game before moving' });
	}

	// check if the game is started
	// if (entry.status !== "ongoing") {
	// 	console.log(`The game ${entry.ID} status is '${entry.status}'`);
	// 	return JSON.stringify({ method: 'MOVE_REPLY', status: 'failure', comment: `The game ${entry.ID} status is '${entry.status}'` });
	// }

	// check if the obj has value
	if (!("value" in msg) || typeof msg.value !== "string") {
		console.log('invalid JSON message: ' + msg);
		return JSON.stringify({ method: 'MOVE_REPLY', status: 'failure', comment: 'invalid JSON message: ' + msg });
	}

	// get the game instance
	const { game, player } = findGame(outgame, outplayer);

	// check if the game is found
	if (game === undefined) {
		return JSON.stringify({ method: 'MOVE_REPLY', status: 'failure', comment: "The game was deleted while you where still inside, im sorry" })
	}

	// check if playeris found
	if (player === undefined) {
		return JSON.stringify({ method: 'MOVE_REPLY', status: 'failure', comment: "somehow you got this game's ID, but you aren't in the game" })
	}

	// check if the player is found

	// process sent input
	if (msg.value == "UP_PRESS") game.press(player.idx, "Up");
	else if (msg.value == "DW_PRESS") game.press(player.idx, "Down");
	else if (msg.value == "UP_RELEASE") game.release(player.idx, "Up");
	else if (msg.value == "DW_RELEASE") game.release(player.idx, "Down");
	else if (msg.value == "START_PRESS") game.launch();
	else if (msg.value == "RESET_PRESS") {
		console.log('User reset disabled');

		// entry.game.reset();
	}

	// no reply
	return "no-reply";
}