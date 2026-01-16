// loadPongPlayerPage.ts
import { router } from "@/router";
// import { load404Page } from "@/pages/errors/404";
import { PongSocket } from "@components/PongBoards/PongSocket";
import { createPongBoard } from "@components/PongBoards/createPongBoard";
import { Game } from "@pages/protected/game/local/GameClass"

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
	let messageHandler: ((msg: any) => void) | null = null;

	return {
		playerid,

		send(data: any) {
			move(game, data);
		},

		onmessage(handler) {
			messageHandler = handler;
		},

		handshake() {
			game.subscribe(playerid, (msg: string) => {
				try {
					const state = JSON.parse(msg);
					// mimic ws.onmessage(JSON)
					messageHandler?.(state);
				} catch (err) {
					/* console.log(err) */;
				}
			});

			// start sending game-states
			game.start();
		},

		close() {
			game.unsubscribe(playerid);
			game.stop();
			messageHandler = null;
		}
	};
}

// local game
const game = new Game([{idx:0, ID:'Guest_1'}, {idx:1, ID:'Guest_2'}]);

export function loadLocalPongPage(): HTMLElement {

	/* ------ BUILD THE BOARD ------ */
	// 1. create 'socket'
	const socket = createLocalSocket(game, 'Guest_1');

	// 2. create UI
	const board = createPongBoard(socket);

	// 3. connect socket → board
	socket.onmessage((state) => {
		// forward game state to board
		board.update(state);
	});

	// local sockets are "instantly open"
	socket.handshake();

	/* --------- BUILD THE PAGE ----------- */

	// #todo pls fix back button

	const div = document.createElement('div');
	// div.className = 'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col';
	div.className = 'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative flex flex-col';
	div.innerHTML = /*html*/ `

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

	// mount board BEFORE socket updates
	const slot = div.querySelector("#pong-board-slot")!;
	slot.appendChild(board.element);

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

	/* --- DESTROY LOGIC --- */
	// Add event listener for leave game button
	const leaveGameBtn = div.querySelector('#leaveGameBtn');
	if (leaveGameBtn) {
		leaveGameBtn.addEventListener('click', () => {
			socket.send({ method: 'LEAVE' });

			// destroy board
			board.destroy();

			// remove the eventlisteners
			document.removeEventListener("keyup", keyup);
			document.removeEventListener("keydown", keydown);

			// back in history
			router.back();
		});
	}

	return div;
}