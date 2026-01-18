// loadPongPlayerPage.ts
import { load404Page } from "@/pages/errors/404";
import { createSpectatorSocket } from "@components/PongBoards/PongSocket";
import { createPongBoard } from "@components/PongBoards/createPongBoard";

const PONG_SPECTATE_URL = `ws://${window.location.hostname}:3029/ws/pong/spectate`;

export function loadPongSpectatorDiv(matchid:string): HTMLElement {

	const playerid = localStorage.getItem('userId') || sessionStorage.getItem('guestID');
	if (playerid === null) {
		return load404Page();
	}

	/* ------ BUILD THE BOARD ------ */
	// 1. create raw websocket
	const ws = new WebSocket(PONG_SPECTATE_URL);

	// 2. wrap it
	const socket = createSpectatorSocket(ws, /* playerid, */ matchid);

	// 3. create UI
	const board = createPongBoard(socket);

	// 4. connect socket → board
	socket.onmessage((state) => {
		// forward game state to board
		board.update(state);
	});

	// 5. handshake when ready
	ws.onopen = () => {
		socket.handshake();
	};

	ws.onclose = () => {
		console.log("Disconnected from game");
	};

	/* --------- BUILD THE PAGE ----------- */

	// <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center py-8 px-4">

	const div = document.createElement('div');
	div.className = 'relative w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col rounded-xl border border-white/10';
	div.innerHTML = /*html*/ `
		<!-- Spectate Page Wrapper -->
		

			<!-- Stop Button -->
			<button
				id="close-btn"
				class="absolute top-4 left-4 z-50 flex items-center gap-2 rounded-lg
					bg-red-600/90 hover:bg-red-600 px-4 py-2 text-sm font-semibold text-white
					shadow-lg transition active:scale-95"
			>
				⛔ Stop spectating
			</button>

			<!-- Spectate Header -->
			<div class="w-full max-w-6xl mb-6">
				<h2 class="text-center text-xl font-semibold text-white/90">
				Spectating match
				</h2>
			</div>

			<!-- PONG BOARD -->
			<div id="pong-board-slot"></div>
	`;

	// mount board BEFORE socket updates
	const slot = div.querySelector("#pong-board-slot")!;
	slot.appendChild(board.element);

	// stop spectating
	const closeBtn = div.querySelector('#close-btn');
	if (closeBtn) {
		closeBtn.addEventListener('click', () => {
			console.log('Stopped spectating');

			// destroy board
			board.destroy();
		});
	}

	/* --- REGISTER INPUTS --- */

	// inputs

	return div;
}
