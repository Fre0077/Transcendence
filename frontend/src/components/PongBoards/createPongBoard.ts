export interface PongBoard {
	element: HTMLElement;
	update(state: any): void;
	destroy(): void;
}

// import { createProfileCard } from "@components/createProfileCard";
import drawPongCanvas from "./drawPongCanvas";
import type { PongSocket } from "@services/ws/createPongSocket";
import { InteractiveWidget, createProfileWidget } from "@components/createProfileWidget";


export function createPongBoard(socket:PongSocket, widget_opts?:any): PongBoard {

	const div = document.createElement('div');
	
	// build div
	div.className = 'relative w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col rounded-xl border border-white/10 p-6 pt-0 lg:p-10 lg:pt-2';
	div.innerHTML = /*html*/`

	<!-- Top content -->
	<div class="w-full max-w-6xl flex flex-col lg:flex-col items-center justify-between gap-8 my-auto">
		<div
			id="status-box"
			class="mx-auto w-full max-w-xl text-center
					text-3xl md:text-4xl
					font-arcade uppercase tracking-widest
					text-yellow-300
					[text-shadow:
					-2px_-2px_0_#000,
						2px_-2px_0_#000,
					-2px_2px_0_#000,
						2px_2px_0_#000,
						0_0_12px_rgba(250,204,21,0.8)]"
		>
			STATUS
		</div>
	</div>

	<!-- Game Area -->
  	<div class="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between gap-8">

		<!-- Player 1 Card -->
		<div class="relative w-full lg:w-64 rounded-xl bg-gradient-to-br from-cyan-600/20 to-blue-600/20 p-6 border border-cyan-500/30 text-center">

			<!-- Outcome label -->
			<div
				id="outcome-p1"
				class="hidden absolute inset-0 items-center justify-center
					text-4xl font-arcade uppercase tracking-widest
					bg-black/60 rounded-xl z-10">
			</div>

			<!-- Card content -->
			<div id="player1-card"></div>
		</div>

		<!-- Canvas + Center Area -->
		<div class="flex flex-col items-center gap-4">
			<canvas
				id="game"
				width="600"
				height="600"
				class="border border-white/20 rounded-lg bg-black shadow-lg"
			></canvas>
	
			<div id="serverLog" class="text-sm text-white/50 max-w-md text-center"></div>
		</div>

		<!-- Player 2 Card -->
		<div class="relative w-full lg:w-64 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-6 border border-purple-500/30 text-center">

			<div
				id="outcome-p2"
				class="hidden absolute inset-0 items-center justify-center
					text-4xl font-arcade uppercase tracking-widest
					bg-black/60 rounded-xl z-10">
			</div>

			<div id="player2-card"></div>
		</div>

	</div>
	`;

	// whwere to update the stauts
	const statusBox = div.querySelector('#status-box') as HTMLElement;

	// where to put the winners
	const outcomeP1 = div.querySelector('#outcome-p1') as HTMLElement;
	const outcomeP2 = div.querySelector('#outcome-p2') as HTMLElement;

	// where to draw the card UI
	const player1Slot = div.querySelector("#player1-card")!;
	const player2Slot = div.querySelector("#player2-card")!;

	// 🧠 cache
	let playersInitialized = false;
	let player1Widget:InteractiveWidget,
		player2Widget:InteractiveWidget;

	// wrap the drawer
	const draw = drawPongCanvas(div);

	// the update function to call everytime you get a socket message
	async function update(state: any)
	{
		/* #debug */
		// // console.log('Updating board...', state);

		try {

			// 1️⃣ one-time player setup
			if (!playersInitialized && state.players.length === 2) {

				/* #debug */
				// // console.log('Drawing cards...');

				// save widgets
				let player1, player2;
				if (widget_opts) {
					const { p1 } = widget_opts;
					const { p2 } = widget_opts;
					player1 = p1;
					player2 = p2;
				}
				player1Widget = await createProfileWidget(state.players[0].ID, player1);
				player2Widget = await createProfileWidget(state.players[1].ID, player2);

				// append elements (the check on child is for sync problems)
				if (player1Slot.firstChild) player1Slot.removeChild(player1Slot.firstChild);
				if (player2Slot.firstChild) player2Slot.removeChild(player2Slot.firstChild);
				player1Slot.appendChild(player1Widget.element);
				player2Slot.appendChild(player2Widget.element);
				
				// block further things
				playersInitialized = true;
			}

			// 2️⃣ players score/status updates (cheap)
			if (player1Widget) {
				player1Widget.setScore(Number(state.score[0]));
				player1Widget.setStatus?.(String(state.players[0].status));
			}
			if (player2Widget) {
				player2Widget.setScore(Number(state.score[1]));
				player2Widget.setStatus?.(String(state.players[1].status));
			};


			/* ---- STATUS UPDATES ---- */
			function makeWinner(div:HTMLElement) {
				div.textContent = "WINNER";
				div.classList.add("text-red-300", "animate-pulse");
				div.classList.replace("hidden", "flex");
			}

			function makeLoser(div:HTMLElement) {
				div.textContent = "LOSER";
				div.classList.add("text-blue-300", "animate-pulse");
				div.classList.replace("hidden", "flex");
			}

			// GAME PAUSED
			if (state.paused === true) statusBox.textContent = "GAME PAUSED";
			else if (state.winner !== -1) {
				statusBox.textContent = "GAME FINISHED";
				if (state.winner === 0) {
					makeWinner(outcomeP1);
					makeLoser(outcomeP2);
				} else {
					makeWinner(outcomeP2);
					makeLoser(outcomeP1);
				}
			}
			// GAME OK
			else statusBox.textContent = "GOOD LUCK!";

			// 3️⃣ pure canvas draw
			draw(state);

		} catch (err) {
			// console.log('Error while drawing board', err);
		}

	}

	// build the wrapper
	return {
		element: div,
		update,
		destroy() {
			socket.close();
			div.remove();
		},
	};

}