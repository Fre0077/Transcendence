
// services
// import { isauth } from "@/services/api/isauth";

// components
import { loadPongReplayDiv } from "@pages/protected/game/online/laodPongReplayDiv";

export interface GameData {
	id:number;			// id nella tabella delle history
	createdAt:string; 
	game:string;		// pong, chess, ...
	gameId:string;		// id della partita lato backend
	gamePlayers:string;	// who played the game (parse as string array)
	metadataId:string;	// id del metadata
	replay:string;		// replay (duh)
	score:string		// score (parse number array)
	updatedAt:string;	// time updated
	winner:string;		// winner as a string array
}

// export function createHistoryBar(data:GameData): HTMLElement
// {
// 	const div = document.createElement('div');
	
// 	// build div
// 	div.className = 'relative w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col rounded-xl border border-white/10 p-6 lg:p-10';
// 	div.innerHTML = /* html */`
// 		<div>
// 			<h1> ${data.game} : ${data.createdAt} </h1>
// 			<p> Players: ${data.gamePlayers} </p>
// 			<p> Winner: ${data.winner}, score: ${data.score} </p>
// 		</div>
	
// 	`;

// 	return div;
// }

function safeParseArray(value: string): any[] {
	try {
		const parsed = JSON.parse(value);
		return Array.isArray(parsed) ? parsed : [value];
	} catch {
		return [value];
	}
}

function getGameIcon(game: string): string {
	switch (game.toLowerCase()) {
		case "pong":
			return "🏓";
		case "chess":
			return "♟️";
		default:
			return "🎮";
	}
}

export function createHistoryBar(data: GameData): HTMLElement {
	const div = document.createElement('div');

	div.className =
		'relative w-full bg-slate-800/70 backdrop-blur-md rounded-xl border border-white/10 px-6 py-4 hover:border-purple-400/40 transition';

	const players = safeParseArray(data.gamePlayers);
	const scores = safeParseArray(data.score);
	const winners = safeParseArray(data.winner);
	const gameIcon = getGameIcon(data.game);

	const p1 = players[0] ?? "Player 1";
	const p2 = players[1] ?? "Player 2";
	const s1 = scores[0] ?? "-";
	const s2 = scores[1] ?? "-";

	const p1Win = winners.includes(p1);
	const p2Win = winners.includes(p2);

	div.innerHTML = /* html */ `
		<!-- TOP ROW -->
		<div class="flex items-center justify-between mb-2 text-xs text-white/50">
			<span>
				${new Date(data.createdAt).toLocaleString()}
			</span>

			<span class="text-green-400 font-semibold">
				Winner: ${winners.join(", ")}
			</span>
		</div>

		<!-- MAIN ROW -->
		<div class="flex items-center justify-between gap-4">
			
			<!-- GAME -->
			<div class="flex items-center gap-2 min-w-[120px]">
				<span class="text-xl">${gameIcon}</span>
				<span class="text-white font-semibold uppercase tracking-wide">
					${data.game}
				</span>
			</div>

			<!-- MATCH INFO -->
			<div class="flex items-center justify-center gap-4 flex-1">
				<span class="${p1Win ? "text-green-400 font-semibold" : "text-red-400"}">
					${p1}
				</span>

				<span class="text-white font-bold tabular-nums">
					${s1}
					<span class="text-white/50 mx-1">/</span>
					${s2}
				</span>

				<span class="${p2Win ? "text-green-400 font-semibold" : "text-red-400"}">
					${p2}
				</span>
			</div>

			<!-- ACTION -->
			<div class="flex items-center min-w-[100px] justify-end">
				<button
					class="flex items-center gap-1 px-3 py-1.5 rounded-md bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-sm transition
						disabled:opacity-50 disabled:cursor-not-allowed"
					data-replay="${data.replay}"
				>
					<span>▶</span>
					<span>Replay</span>
				</button>
			</div>
		</div>

		<!-- REPLAY ROW -->
		<div id="replay-slot"></div>
	`;

	let replayContainer: HTMLElement | null = null;

	const replayBtn = div.querySelector('button');
	replayBtn?.addEventListener("click", async () => {
		// if replay already exists → ignore
		if (replayContainer) return;

		// refresh cookies
		// await isauth();

		replayBtn.disabled = true;
		replayBtn.classList.add("opacity-50", "cursor-not-allowed");

		replayContainer = document.createElement("div");
		replayContainer.className = "mt-4";

		const replayDiv = loadPongReplayDiv(data.replay);

		const destroyReplay = () => {
			(replayDiv as any).destroy?.();
			replayContainer?.remove();
			replayContainer = null;

			replayBtn.disabled = false;
			replayBtn.classList.remove("opacity-50", "cursor-not-allowed");
		};

		// internal close button
		replayDiv.addEventListener("replay:close", destroyReplay);

		replayContainer.appendChild(replayDiv);
		div.appendChild(replayContainer);
	});

	return div;
}

