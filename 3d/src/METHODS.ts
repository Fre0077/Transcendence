import type { Player, GameEntry } from './gameDB.js'

import { getGameEntry } from './gameDB.js'

/* {
	method: 'JOIN',       (mandatory)
	gameID: <gameID>,     (mandatory)
	playerID: <playerID>  (mandatory)
}
@gameID: the ID of the game as a string
@playerID: the ID of the player as a string

Description: Joins a game with the specified ID, if any of the property is missing
or invalid or there is no game with the gameID requested, it fails.
Reply:
{
	method: 'JOIN_REPLY',
	status: 'success/failure',
	value: <gameID>,
	comment: <comment>
} */

type JoinReturn = {
	status: "success" | "failure",
	reply:string,
	player?:Player,
	entry?:GameEntry
}

export function JOIN(msg:object): JoinReturn
{
	// check if the obj has gameID amd playerID
	if (!("gameID" in msg)  || typeof msg.gameID !== "string"
		|| !("playerID" in msg) || typeof msg.playerID !== "string")
	{
		console.log('invalid JSON message:', msg);
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'JOIN_REPLY', status: "failure", comment: "invalid JSON"})
		};
	}

	// check if game is in array
	let myGameEnrty:GameEntry | undefined = getGameEntry(msg.gameID);

	// game not found
	if (myGameEnrty === undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'JOIN_REPLY', status: "failure", value: msg.gameID, comment: "game not found"})
		};
	}

	// check if the player is expected in this game
	let myPlayer: Player | undefined = myGameEnrty.players.find(p => p.ID === msg.playerID && p.joined === false);
	if (myPlayer === undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'JOIN_REPLY', status: "failure", value: msg.gameID, comment: "you are not expected in this game"})
		};
	}

	// update entry status
	myGameEnrty.status = "joining";

	// update player status
	myPlayer.joined = true
	
	// send successful join to frontend
	return {
		status: "success",
		reply: JSON.stringify({ method: 'JOIN_REPLY', status: "success", value: myGameEnrty.ID}),
		player: myPlayer,
		entry: myGameEnrty
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
export function LEAVE(entry:GameEntry | undefined, player:Player | undefined)
{
	// check if in game
	if (entry === undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'LEAVE_REPLY', status: "failure", comment: "Not in a game"})
		};
	}

	// check auth
	if (player === undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'LEAVE_REPLY', status: "failure", comment: "Not authenticated yet"})
		};
	}

	// leave the game
	player.joined = false;
	player.left = true;
	// pause the game
	entry.status = "paused";
	entry.game.stop();

	// successfful reply
	return {
		status: "success",
		reply: JSON.stringify({ method: 'LEAVE_REPLY', status: "success", comment: "Left the game"})
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
import { saveGameIntoMatchHistory } from './index.js';

export function MOVE(msg:object, entry:GameEntry | undefined, player:Player | undefined): string | null
{
	// check auth
	if (player === undefined) {
		return JSON.stringify({ method: 'MOVE_REPLY', status: 'failure', comment: 'Authenticate before moving' });
	}

	// ignore other inputs if game not found yet
	if (entry === undefined) {
		return JSON.stringify({ method: 'MOVE_REPLY', status: 'failure', comment: 'Join a game before moving' });
	}

	// check if the game is started
	if (entry.status !== "ongoing") {
		console.log(`The game ${entry.ID} status is '${entry.status}'`);
		return JSON.stringify({ method: 'MOVE_REPLY', status: 'failure', comment: `The game ${entry.ID} status is '${entry.status}'` });
	}

	// check if the obj has value
	if (!("value" in msg) || typeof msg.value !== "string") {
		console.log('invalid JSON message: ' + msg);
		return JSON.stringify({ method: 'MOVE_REPLY', status: 'failure', comment: 'invalid JSON message: ' + msg });
	}

	// process sent input
	if (msg.value == "UP_PRESS") entry.game.press(player.position, "Up");
	else if (msg.value == "DW_PRESS") entry.game.press(player.position, "Down");
	else if (msg.value == "UP_RELEASE") entry.game.release(player.position, "Up");
	else if (msg.value == "DW_RELEASE") entry.game.release(player.position, "Down");
	else if (msg.value == "START_PRESS") entry.game.launch();
	else if (msg.value == "RESET_PRESS") {
		// #todo send to DB
		saveGameIntoMatchHistory();

		entry.game.reset();
	}

	// no reply
	return null;
}