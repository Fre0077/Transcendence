import { player, gameEntry } from './gameObjs.js'

import { getGameEntry } from './index.js'

/* {method: 'JOIN', gameID: <gameID>, playerID: <playerID> }
	@gameID: the ID of the game as a string
	@playerID: the ID of the player as a string

	Description: Joins the game with the specified ID, if playerID is null it fails
	Reply: { method: 'JOIN_REPLY', status: 'success/failure', value: <gameID>, comment: <comment> }

*/

type joinReply = {
	method: 'JOIN_REPLY',
	status: 'failure' | 'success',
	value?: string,
	comment?: string
}

const defaultReply:joinReply = {
	method: 'JOIN_REPLY',
	status: 'failure',
}

type joinReturn = {
	error:boolean,
	reply:string,
	player?:player,
	entry?:gameEntry
}

export function JOIN(msg:object): joinReturn {
	// check if the obj has gameID amd playerID
	if (!("gameID" in msg)  || typeof msg.gameID !== "string"
		|| !("playerID" in msg) || typeof msg.playerID !== "string")
	{
		console.log('invalid JSON message:', msg);
		return {error: true, reply: JSON.stringify({ ...defaultReply, comment: "invalid JSON"})};
	}

	// check if game is in array
	let myGameEnrty:gameEntry | undefined = getGameEntry(msg.gameID);

	// game not found
	if (myGameEnrty === undefined) {
		return {error: true, reply: JSON.stringify({ ...defaultReply, value: msg.gameID, comment: "game not found"})};
	}

	// check if the player is expected in this game
	/* ! ! ! =============================== ! ! ! */
	/* ! ! ! #todo ALSO ADD SESSION ID CHECK ! ! ! */
	/* ! ! ! =============================== ! ! ! */

	let myPlayer: player | undefined = myGameEnrty.players.find(p => p.ID === msg.playerID && p.joined === false);
	if (myPlayer === undefined) {
		return {error: true, reply: JSON.stringify({ ...defaultReply, value: msg.gameID, comment: "you are not expected in this game"})};
	}

	// update entry status
	myGameEnrty.status = "joining";

	// update player status
	myPlayer.joined = true
	
	// send successful join to frontend
	return {
		error: false,
		reply: JSON.stringify({ ...defaultReply, status: 'success', value: myGameEnrty.ID}),
		player: myPlayer,
		entry: myGameEnrty
	};
}