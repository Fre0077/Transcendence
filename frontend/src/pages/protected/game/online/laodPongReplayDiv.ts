// loadPongPlayerPage.ts
import { createPongBoardWidget } from "@/components/PongBoards/createPongBoardWidget";
import { load404Page } from "@/pages/errors/404";
import { createReplaySocket } from "@components/PongBoards/PongSocket";
// import { createPongBoard } from "@components/PongBoards/createPongBoard";

// #needs-auth-check
// import { isauth } from "@/services/api/isauth";

export function loadPongReplayDiv(replay:string): HTMLElement {

	// obsolete
	const playerid = localStorage.getItem('userId') || sessionStorage.getItem('guestID');
	if (playerid === null) {
		return load404Page();
	}

	/* ------ BUILD THE BOARD ------ */

	// 1. create socket
	const socket = createReplaySocket(/* playerid, */ replay);

	// 2. create UI
	const board = createPongBoardWidget(socket);

	// 3. connect socket → board
	socket.onmessage((state) => {
		// forward game state to board
		board.update(state);
	});

	// 4. handshake when ready
	socket.handshake();

	/* --------- BUILD THE PAGE ----------- */

	const div = document.createElement('div');
	div.className = 'relative w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col rounded-xl border border-white/10';
	div.innerHTML = /* html */ `
		<!-- Replay Wrapper -->
		<div class="w-full max-w-4xl mx-auto flex flex-col">

			<!-- Top Controls -->
			<div
				class="flex items-center justify-between
					px-4 py-2
					bg-slate-800/60 border border-white/10
					rounded-t-xl"
			>
				<button
					id="close-btn"
					class="flex items-center gap-1 rounded-md
						bg-red-600/80 hover:bg-red-600
						px-3 py-1.5 text-xs font-semibold text-white
						transition active:scale-95"
				>
					Close
				</button>

				<h2 class="text-sm font-semibold text-white/80">
					Replaying game
				</h2>

				<!-- spacer to keep title centered -->
				<div class="w-12"></div>
			</div>

			<!-- Board Wrapper (no gap, no rounding on top) -->
			<div
				id="pong-board-slot"
				class="w-full flex justify-center
					bg-slate-900/80
					border-x border-b border-white/10
					rounded-b-xl rounded-t-none"
			></div>
		</div>
	`;

	// mount board BEFORE socket updates
	const slot = div.querySelector("#pong-board-slot")!;
	slot.appendChild(board.element);

	// stop spectating
	const closeBtn = div.querySelector('#close-btn');
	if (closeBtn) {
		closeBtn.addEventListener('click', () => {
			console.log('Stopped watching replay');

			// destroy board
			board.destroy();

			// notify parent
			div.dispatchEvent(
				new CustomEvent("replay:close", { bubbles: true })
			);
		});
	}

	/* --- REGISTER INPUTS --- */

	// inputs

	return div;
}
