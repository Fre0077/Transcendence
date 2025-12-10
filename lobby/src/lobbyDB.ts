import { Lobby } from './Lobby.js'
import type { WebSocket } from "ws";

/* --------------- LOBBY DB --------------- */

type GameType = "pong" | "3D";

export type LobbyEntry = {
	game: GameType;
	lastCheck:number;
	lobby:Lobby;
	sockets: Map<string, WebSocket>;
}

/* ACTUAL ARRAY OF LOBBIES */
export let lobbies:LobbyEntry[] = [];	// lobby array
/* ! ! ! ONLY IMPORTED IN StatusChecker() ! ! ! */

/* ---------------------------------------- */

export function createLobby(type:GameType): Lobby
{
	const lobby:Lobby = new Lobby();
	lobbies.push({ game: type, lastCheck: Date.now(), lobby: lobby, sockets: new Map()});
	return lobby;
}

// returns the lobby in the 'lobbies' array
export function getLobby(lobbyID:string): Lobby | undefined
{

	if (lobbyID === null) return undefined;

	let entry;

	// join the first lobby with an empty space
	if (lobbyID === 'ANY'){
		entry = lobbies.find(e => e.lobby.full() === false);
		if (entry === undefined) return undefined;
		else return entry.lobby;
	}

	// check the specific lobby
	entry = lobbies.find(e => e.lobby.ID === lobbyID);
	if (entry === undefined) return undefined;
	else return entry.lobby;
}


export function getAllLobbyStates(): object[]
{
	let ret:object[] = [];

	lobbies.forEach((entry) => {
		ret.push(entry.lobby.state);
	});

	return ret;
}

/* ============== CLEAN JOIN/LEAVE ============== */

// clean leave playerID from lobbyID procedure
export function cleanJoinLobby(lobbyID:string, playerID:string, ws:WebSocket): boolean
{
	let entry = lobbies.find(e => e.lobby.ID === lobbyID);
	if (entry === undefined) return false;

	// join lobby
	if (entry.lobby.join(playerID) === false) return false;

	// add websocket
	entry.sockets.set(playerID, ws);

	// #debug
	console.log(`we now got ${entry.sockets.size} sockets`);

	// success
	return true;
}

// clean leave playerID from lobbyID procedure
export function cleanLeaveLobby(lobbyID:string, playerID:string)
{
	// remove from lobby
	let entry = lobbies.find(e => e.lobby.ID === lobbyID);
	if (entry === undefined) return;
	entry.lobby.leave(playerID);

	// remove from sockets
	entry.sockets.delete(playerID);
}

// just leave the socket
export function leaveLobbySocket(lobbyID:string, playerID:string)
{
	// remove from lobby
	let entry = lobbies.find(e => e.lobby.ID === lobbyID);
	if (entry === undefined) return;

	// remove from sockets
	entry.sockets.delete(playerID);
}

/* ================================================= */


// sends message to everyone in the lobby
export function lobbyBroadcast(lobbyID:string, message:string)
{
	// not ANY
	if (lobbyID === 'ANY') return;

	// check if lobbyID is valid
	let entry = lobbies.find(e => e.lobby.ID === lobbyID);
	if (entry === undefined) return;

	// broadcast
	entry.sockets.forEach(user => {
		console.log("broadcasting '" + message + "'");
		if (user.readyState === user.OPEN) {
			user.send(message);
		}
	});
}







/* __________________________________________ */
/* 											  */
/* ----------- BACKENT to BACKEND  ---------- */
/* + - + - + - + - + - + - + - + - + - + - +  */
/* __________________________________________ */

export function gameIsFinished(gameID:string)
{
	let entry = lobbies.find(e => e.lobby.getGameDetails().ID === gameID);
	if (entry == undefined) return;
	else {
		console.log('Resetting lobby', entry.lobby.ID);
		entry.lobby.reset();
		
		// 'connect' the bots
		entry.lobby.players.forEach((player) => {
			if (player.ID === "BOT") player.status = "connected";
		});
	}
}

/* --------------------------------------- */