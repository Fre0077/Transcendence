// default
import { router } from "@/router";
// import { load404Page } from "@/pages/errors/404";

// services
import { PongSocket } from "@/services/ws/createPongSocket";
import { Game } from "@/pages/public/local/game/classes/Pong/GameClass"

// elements
import { createPongBoard } from "@components/PongBoards/createPongBoard";
import { PlayerData, createPlayerSelectDiv } from "@/components/tournament/createPlayerSelectDiv";

function move(game:Game, data:any)
{
	if (data?.method !== "MOVE") return;
	if (!data?.value) return;

	// START
	if (data.value === "START_PRESS") game.launch();

	// P1
	if (data.value === "P1UP_PRESS") game.press(0, "Up");
	else if (data.value === "P1DW_PRESS") game.press(0, "Down");
	else if (data.value === "P1UP_RELEASE") game.release(0, "Up");
	else if (data.value === "P1DW_RELEASE") game.release(0, "Down");

	// P2
	if (data.value === "P2UP_PRESS") game.press(1, "Up");
	else if (data.value === "P2DW_PRESS") game.press(1, "Down");
	else if (data.value === "P2UP_RELEASE") game.release(1, "Up");
	else if (data.value === "P2DW_RELEASE") game.release(1, "Down");
}

function createLocalSocket(game: Game, playerid: string): PongSocket
{
	let stateHandler: ((msg: any) => void) | null = null;

	return {
		socket: null,

		send(data: any) {
			move(game, data);
		},

		onmessage(handler) {
			stateHandler = handler;
		},

		handshake() {
			game.subscribe(playerid, (msg: string) => {
				try {
					const state = JSON.parse(msg);
					// mimic ws.onmessage(JSON)
					stateHandler?.(state);
				} catch (err) {
					/* // console.log(err) */;
				}
			});

			// start sending game-states
			game.start();
		},

		close() {
			game.unsubscribe(playerid);
			game.stop();
			stateHandler = null;
		}
	};
}

export function loadLocalPongPage(
	P1?:PlayerData,
	P2?:PlayerData,
	gameid?:string,
	cb?: (gameid:string, winners:string[], score:number[]) => void): HTMLElement
{
	/* --------- BUILD THE PAGE ----------- */

	// #todo pls fix back button

	const div = document.createElement('div');
	div.className = 'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative flex flex-col';

	/* --- get Players if not passed */
	if (!P1 || !P2) {
		const playerSelect = createPlayerSelectDiv((players:any) => {
		
			// initialize player data
			P1 = players[0] as PlayerData;
			P2 = players[1] as PlayerData;

			// render UI
			renderPongUI(div, P1, P2, gameid, cb);
		}, 2);

		div.appendChild(playerSelect);
		return div; // ⛔ stop here until players are selected
	}

	renderPongUI(div, P1, P2, gameid, cb);

	return div;
}

function renderPongUI(
	container: HTMLElement,
	P1:PlayerData,
	P2:PlayerData,
	gameid?:string,
	cb?: (gameid:string, winners:string[], score:number[]) => void)
{
	container.innerHTML = /*html*/ `

		<!-- Centered board -->
		<div class="flex-1 container mx-auto px-4 flex flex-col items-center justify-center gap-8 pb-8">
			<!-- PONG BOARD -->
			<div id="pong-board-slot"></div>
		</div>

		<!-- Back button at bottom -->
		<button
			id="leaveGameBtn"
			class="px-6 py-2 bg-red-600/20 border border-red-500/30 rounded-lg text-sm text-white hover:bg-red-600/30 transition shadow-lg active:scale-95"
		>
			Back
		</button>
	`;

	/* ------ BUILD THE BOARD ------ */

	// get usernames
	const player1 = (P1.username);
	const player2 = (P2.username);

	// local game
	const game = new Game([{idx:0, ID:player1}, {idx:1, ID:player2}]);

	// 1. create 'socket'
	const socket = createLocalSocket(game, player1);

	// 2. create UI
	const board = createPongBoard(socket, {p1: { local:true, icon:P1?.icon, phrase:P1?.phrase }, p2: { local:true, icon:P2?.icon, phrase:P2?.phrase }});

	// 3. connect socket → board
	socket.onmessage((state) => {

		// check if the game is finished
		if (state.winner !== -1) {
			cb?.(gameid ?? "no-id", [state.players[state.winner].ID], state.score);
		}

		// lame fix to set player-status on local
		state.players[0].status = "local";
		state.players[1].status = "local";

		// forward game state to board
		board.update(state);
	});

	// local sockets are "instantly open"
	socket.handshake();

	// mount board BEFORE socket updates
	const slot = container.querySelector("#pong-board-slot")!;
	slot.appendChild(board.element);

		/* --- DESTROY LOGIC --- */
	// Add event listener for leave game button
	const leaveGameBtn = container.querySelector('#leaveGameBtn');
	if (leaveGameBtn) {
		leaveGameBtn.addEventListener('click', () => {

			// destroy board
			board.destroy();

			// remove the eventlisteners
			document.removeEventListener("keyup", keyup);
			document.removeEventListener("keydown", keydown);		

			// back in history
			router.back();
		});
	}

	/* --- REGISTER INPUTS --- */

	// listeners
	const keydown = (e:KeyboardEvent) => {
		e.preventDefault(); // 🚫 stop page scrolling
		if (e.repeat) return;
		switch (e.key) {
			case "w": socket.send({ method: "MOVE", value: "P1UP_PRESS" }); break;
			case "s": socket.send({ method: "MOVE", value: "P1DW_PRESS" }); break;
			case "ArrowUp": socket.send({ method: "MOVE", value: "P2UP_PRESS" }); break;
			case "ArrowDown": socket.send({ method: "MOVE", value: "P2DW_PRESS" }); break;
			case " ": socket.send({ method: "MOVE", value: "START_PRESS" }); break;
		}
	}

	const keyup = (e:KeyboardEvent) => {
		switch (e.key) {
			case "w": socket.send({ method: "MOVE", value: "P1UP_RELEASE" }); break;
			case "s": socket.send({ method: "MOVE", value: "P1DW_RELEASE" }); break;
			case "ArrowUp": socket.send({ method: "MOVE", value: "P2UP_RELEASE" }); break;
			case "ArrowDown": socket.send({ method: "MOVE", value: "P2DW_RELEASE" }); break;
		}
	}
	
	// inputs
	document.addEventListener("keydown", keydown);
	document.addEventListener("keyup", keyup);
}
