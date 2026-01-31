// loadPongPlayerPage.ts
import { router } from "@/router";
// import { load404Page } from "@/pages/errors/404";
import { createPlayerSocket } from "@/services/ws/createPongSocket";
import { createPongBoard } from "@components/PongBoards/createPongBoard";

// #needs-auth-check
// import { isauth } from "@/services/api/isauth";

export function loadPongPlayerPage(): HTMLElement
{
	/* ------ BUILD THE BOARD ------ */
	// 1. create socket
	const socket = createPlayerSocket(/* ws, playerID */);

	// 2. create UI
	const board = createPongBoard(socket);

	// 3. connect socket → board
	socket.onmessage((state) => {
		// forward game state to board
		board.update(state);
	});

	// 4. handshake when ready
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
			LEAVE
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
			case "w": socket.send({ method: "MOVE", value: "UP_PRESS" }); break;
			case "s": socket.send({ method: "MOVE", value: "DW_PRESS" }); break;
			case "ArrowUp": socket.send({ method: "MOVE", value: "UP_PRESS" }); break;
			case "ArrowDown": socket.send({ method: "MOVE", value: "DW_PRESS" }); break;
			case " ": socket.send({ method: "MOVE", value: "START_PRESS" }); break;
		}
	}

	const keyup = (e:KeyboardEvent) => {
		switch (e.key) {
			case "w": socket.send({ method: "MOVE", value: "UP_RELEASE" }); break;
			case "s": socket.send({ method: "MOVE", value: "DW_RELEASE" }); break;
			case "ArrowUp": socket.send({ method: "MOVE", value: "UP_RELEASE" }); break;
			case "ArrowDown": socket.send({ method: "MOVE", value: "DW_RELEASE" }); break;
		}
	}
	
	// event listeners for inputs
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


	(div as any).destroy=() => {
		board.destroy();
	}

	return div;
}
