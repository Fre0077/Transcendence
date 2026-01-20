
import { PongBoard } from "./createPongBoard";

// import { createProfileCard } from "@components/createProfileCard";
import drawPongCanvas from "./drawPongCanvas";
import type { PongSocket } from "./PongSocket";
import { InteractiveWidget, createProfileWidget } from "@components/createProfileWidget";

export function createPongBoardWidget(socket: PongSocket): PongBoard {
	const root = document.createElement("div");
	root.className =
		"w-full flex flex-col items-center gap-4 " +
		"bg-slate-900/80 border border-white/10 p-4";

	root.innerHTML = /* html */ `
		<!-- TOP BAR -->
		<div class="w-full max-w-3xl flex items-center justify-between px-4">
			<div id="p1" class="flex-1 flex justify-start"></div>

			<div id="score" class="text-xl font-mono font-bold text-white">
				0 — 0
			</div>

			<div id="p2" class="flex-1 flex justify-end"></div>
		</div>

		<!-- CANVAS -->
		<canvas
			id="game"
			width="600"
			height="600"
			class="border border-white/20 rounded-lg bg-black shadow-lg"
		></canvas>

		<div id="serverLog" class="text-xs text-white/50"></div>
	`;

	const p1Slot = root.querySelector("#p1")!;
	const p2Slot = root.querySelector("#p2")!;
	const scoreEl = root.querySelector("#score")!;

	let playersInitialized = false;
	let p1Widget: InteractiveWidget;
	let p2Widget: InteractiveWidget;

	const draw = drawPongCanvas(root);

	async function update(state: any) {
		// init players once
		if (!playersInitialized && state.players.length === 2) {
			p1Widget = await createProfileWidget(state.players[0].ID, {
				compact: true,
			});
			p2Widget = await createProfileWidget(state.players[1].ID, {
				compact: true,
			});

			p1Slot.appendChild(p1Widget.element);
			p2Slot.appendChild(p2Widget.element);

			playersInitialized = true;
		}

		// update score
		const s1 = Number(state.score[0]);
		const s2 = Number(state.score[1]);
		scoreEl.textContent = `${s1} — ${s2}`;

		if (p1Widget) p1Widget.setScore(s1);
		if (p2Widget) p2Widget.setScore(s2);

		draw(state);
	}

	return {
		element: root,
		update,
		destroy() {
			socket.close();
			root.remove();
		},
	};
}