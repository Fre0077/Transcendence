export interface PongBoard {
	element: HTMLElement;
	update(state: any): void;
	destroy(): void;
}

// import { createProfileCard } from "@components/createProfileCard";
import drawPongCanvas from "./drawPongCanvas";
import type { PongSocket } from "./PongSocket";
import { InteractiveWidget, createProfileWidget } from "@components/createProfileWidget";


export function createPongBoard(socket:PongSocket): PongBoard {

	
	const div = document.createElement('div');
	
	// build div
	div.className = 'relative w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col rounded-xl border border-white/10 p-6 lg:p-10';
	div.innerHTML = /*html*/ `

	<!-- Online Game Page Content -->

	<!-- Game Area -->
  	<div class="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between gap-8">

		<!-- Player 1 Card -->
		<div class="w-full lg:w-64 rounded-xl bg-gradient-to-br from-cyan-600/20 to-blue-600/20 p-6 border border-cyan-500/30 text-center">
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
		<div class="w-full lg:w-64 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-6 border border-purple-500/30 text-center">
			<div id="player2-card"></div>
		</div>

	</div>
	`;

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
		console.log('Updating board...');

		// 1️⃣ one-time player setup
		if (!playersInitialized && state.players.length === 2) {

			/* #debug */
			console.log('Drawing cards...');

			// save widgets
			player1Widget = await createProfileWidget(state.players[0].ID);
			player2Widget = await createProfileWidget(state.players[1].ID);

			console.log('got widget of', state.players[0].ID, state.players[1].ID);

			// append elements (the check on child is for sync problems)
			if (player1Slot.childElementCount === 0) player1Slot.appendChild(player1Widget.element);
			if (player2Slot.childElementCount === 0) player2Slot.appendChild(player2Widget.element);
			
			// save first time score
			if (player1Widget) player1Widget.setScore(Number(state.score[0]));
			if (player2Widget) player2Widget.setScore(Number(state.score[1]));

			// block further things
			playersInitialized = true;
		}

		// 2️⃣ score updates (cheap)
		if (player1Widget) player1Widget.setScore(Number(state.score[0]));
		if (player2Widget) player2Widget.setScore(Number(state.score[1]));

		// 3️⃣ pure canvas draw
		draw(state);
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