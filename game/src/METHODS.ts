import type { player, GameEntry } from './index.js'

import { getGameEntry } from './index.js'

/* {method: 'JOIN', gameID: <gameID>, playerID: <playerID> }
	@gameID: the ID of the game as a string
	@playerID: the ID of the player as a string

	Description: Joins the game with the specified ID, if playerID is null it fails
	Reply: { method: 'JOIN_REPLY', status: 'success/failure', value: <gameID>, comment: <comment> }

*/

type JoinReturn = {
	status: "success" | "failure",
	reply:string,
	player?:player,
	entry?:GameEntry
}

export function JOIN(msg:object): JoinReturn {
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
	/* ! ! ! =============================== ! ! ! */
	/* ! ! ! #todo ALSO ADD SESSION ID CHECK ! ! ! */
	/* ! ! ! =============================== ! ! ! */

	let myPlayer: player | undefined = myGameEnrty.players.find(p => p.ID === msg.playerID && p.joined === false);
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