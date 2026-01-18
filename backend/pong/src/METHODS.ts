import type { Game } from './Game.js';

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

// import type { Player } from './index.js'
// import { findPlayer, joinGame } from './index.js'

// export function AUTH(msg:object, outplayer:string | undefined, listener:(state:string) => void): StandardReturn
// {
// 	// check if already authenticated
// 	if (outplayer !== undefined) {
// 		return {
// 			status: "failure",
// 			reply: JSON.stringify({ method: 'AUTH_REPLY', status: "failure", comment: "Already authenticated"})
// 		}
// 	}

// 	// check for playerID
// 	if (!("playerID" in msg) || typeof msg.playerID !== "string") {
// 		return {
// 			status: "failure",
// 			reply: JSON.stringify({ method: 'AUTH_REPLY', status: "failure", comment: "missing playerID"}),
// 		}
// 	}

// 	/* ! ! ! authentication procedure here ! ! ! */
	
// 	// if already joined previously get the lobby ID
// 	const game = findPlayer((players:Player[]) => { return (players.find(p => p.ID === msg.playerID as string) !== undefined) ? true : false;})
// 	const retgame = (game === undefined) ? undefined : game.ID;
// 	if (retgame) {
// 		// update the websocket if already in a lobby
// 		joinGame(retgame, msg.playerID, listener);
// 	}

// 	// success return
// 	return {
// 		status: "success",
// 		reply: JSON.stringify({ method: 'AUTH_REPLY', status: "success", comment: "Successfully authenticated"}),
// 		player: msg.playerID,
// 		game: retgame
// 	};
// }

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

/* import { findGame, joinGame } from './index.js';

export function JOIN(msg:object, outgame:string | undefined, outplayer:string | undefined, listener:(state:string) => void): StandardReturn
{
	// check if authenticated
	if (outplayer === undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'JOIN_REPLY', status: "failure", cause: 'no-auth', comment: "Authenticate before joining a game pls"})
		}
	}

	// check if already in a game
	if (outgame !== undefined) {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'JOIN_REPLY', status: "failure", cause: 'rejoin', comment: "Already joined a game"})
		}
	}

	// check if the obj has gameID amd playerID
	if (!("gameID" in msg)  || typeof msg.gameID !== "string")
	{
		console.log('invalid JSON message:', msg);
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'JOIN_REPLY', status: "failure", cause: 'no-id', comment: "invalid JSON, missing gameID"})
		};
	}

	// check if game is in array
	const ret = joinGame(msg.gameID, outplayer, listener);

	// join failure
	if (ret.status === "failure") {
		return {
			status: "failure",
			reply: JSON.stringify({ method: 'JOIN_REPLY', status: "failure", cause: 'serv-err', comment: ret.reason })
		};
	}
	
	// send successful join to frontend
	return {
		status: "success",
		reply: JSON.stringify({ method: 'JOIN_REPLY', status: "success", value: msg.gameID}),
		player: outplayer,
		game: msg.gameID
	};
} */


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
// import { GameEntry, leaveGame } from './index.js';

export function LEAVE(outgame:Game, outplayer:string): StandardReturn
{

	// leave the game
	outgame.leave(outplayer);

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

// import { findGame } from './index.js';

export function MOVE(msg:object, outgame:Game, outplayer:string): string
{
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
	const player = outgame.players.find(p => p.ID === outplayer);

	// check if the game is found
	if (outgame === undefined) {
		return JSON.stringify({ method: 'MOVE_REPLY', status: 'failure', comment: "The game was deleted while you where still inside, im sorry" })
	}

	// check if playeris found
	if (player === undefined) {
		return JSON.stringify({ method: 'MOVE_REPLY', status: 'failure', comment: "somehow you got this game's ID, but you aren't in the game" })
	}

	// process sent input
	if (msg.value == "UP_PRESS") outgame.press(player.idx, "Up");
	else if (msg.value == "DW_PRESS") outgame.press(player.idx, "Down");
	else if (msg.value == "UP_RELEASE") outgame.release(player.idx, "Up");
	else if (msg.value == "DW_RELEASE") outgame.release(player.idx, "Down");
	else if (msg.value == "START_PRESS") outgame.launch();
	else if (msg.value == "RESET_PRESS") {
		console.log('User reset disabled');

		// entry.game.reset();
	}

	// no reply
	return "no-reply";
}

/*
Request:
{
  method: 'SPECTATE',
  value: <gameID>
}

Description: asks to receive the gamee updates

Reply:
{
	method: 'SPECTATE_REPLY',
	status: 'failure/success',
	comment: <comment>			(only if status === failure)
}
*/
// export function SPECTATE(msg:object, outplayer:string | undefined, listener:(state:string) => void): string
// {
// 	// check auth
// 	if (outplayer === undefined) {
// 		return JSON.stringify({ method: 'SPECTATE_REPLY', status: 'failure', comment: 'Authenticate before spectating' });
// 	}

// 	// check if the obj has value
// 	if (!("value" in msg) || typeof msg.value !== "string") {
// 		console.log('invalid JSON message: ' + msg);
// 		return JSON.stringify({ method: 'SPECTATE_REPLY', status: 'failure', comment: 'invalid JSON message: ' + msg });
// 	}

// 	// searches the game
// 	const { game, /* player */ } = findGame(msg.value);

// 	// checck if game found
// 	if (game === undefined) {
// 		return JSON.stringify({ method: 'SPECTATE_REPLY', status: 'failure', comment: 'game not found' });
// 	}

// 	// add listner to the game
// 	game.subscribe(outplayer, listener);

// 	return JSON.stringify({ method: 'SPECTATE_REPLY', status: 'success' });
// }
