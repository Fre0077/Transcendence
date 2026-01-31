/* ---------------------------------------- */
/* ---------------------------------------- */
/* ---------- RENDER ROOM CARDS ------------*/

import { sendGetRequest } from "@/services/api/sendRequests";

export interface Room {
	// id room
	layer:number;
	idx:number;

	// players
	players:string[];

	// status
	status:string;
	gameid:string;

	// outcome
	winner:string[];
	score:number[];

}

type RoomStatus = Room['status'];

function getRoomStyles(status: RoomStatus) {
	switch (status) {
		case 'in-game':
			return {
				container:
					'bg-blue-900/30 border-blue-400/70 shadow-lg shadow-blue-500/20 animate-pulse-slow',
				badge:
					'bg-blue-500 text-white',
				label: 'LIVE',
			};

		case 'finished':
			return {
				container:
					'bg-slate-800/85 border-white/25',
				badge:
					'bg-slate-600 text-white',
				label: 'FINISHED',
			};

		case 'waiting':
			return {
				container:
					'bg-slate-800/30 border-white/5 opacity-70',
				badge:
					'bg-slate-500/60 text-white/80',
				label: 'WAITING',
			};

		case 'autowin':
			return {
				container:
					'bg-teal-900/30 border-teal-400/50',
				badge:
					'bg-teal-500 text-white',
				label: 'AUTOWIN',
			};

		case 'aborted':
			return {
				container:
					'bg-red-900/30 border-red-500/60',
				badge:
					'bg-red-500 text-white',
				label: 'ABORTED',
			};

		default:
			return {
				container:
					'bg-slate-800/70 border-white/10',
				badge:
					'bg-slate-600 text-white',
				label: '',
			};
	}
}


// IMPORTANT: the global event __spectate(gameid:string) should be defined for the specate button to work
export async function renderRoomCard(
	room: Room,
	type: "local" | "online" = "online",
): Promise<string> {
	const styles = getRoomStyles(room.status);

	const containerClasses =
	`relative min-w-[180px] rounded-lg border p-3 transition ${styles.container} overflow-hidden`;

	let usernames:Map<string, string> = new Map();
	if (room.players.length) {
		for (const id of room.players) {
			if (id.startsWith('BOT')) usernames.set(id, id);
			else {
				const uname = await sendGetRequest('/api/userinfo?linkId=' + id);
				if (uname) usernames.set(id, uname.username);
				else usernames.set(id, id);
			}

		}
	}

	/* -------- Players -------- */
	const playersHtml = room.players.length
		? room.players
				.map(player => {
					let cls = 'text-xs';

					if (room.status === 'aborted') {
						cls += ' line-through text-white/40';
					} else if (
						room.status === 'autowin' &&
						!room.winner.includes(player)
					) {
						cls += ' line-through text-white/40';
					} else {
						cls += ' text-white/70';
					}

					return `<li class="${cls}">• ${usernames.get(player)}</li>`;
				})
				.join('')
		: `<li class="text-xs text-white/40 italic">Waiting...</li>`;

	/* -------- Footer -------- */
	let footerHtml = '';

	if (room.status === 'aborted') {
		footerHtml = `
			<p class="text-xs text-red-400 mt-2 font-semibold">
				Aborted
			</p>
		`;
	} else if (room.winner.length) {
		footerHtml = `
			<p class="text-xs text-emerald-400 mt-2">
				Winner: ${room.winner.map(w => usernames.get(w)).join(', ')}
			</p>
		`;
	} else {
		footerHtml = `
			<p class="text-xs text-white/40 mt-2 italic">
				Not played yet
			</p>
		`;
	}

	/* -------- Spectate -------- */
	const spectateButton =
		room.status === 'in-game'
			? `
			<button data-spectate-btn
				class="absolute bottom-2 right-2 w-7 h-7 rounded-md bg-blue-600/80 hover:bg-blue-600 text-white transition flex items-center justify-center text-sm"
				onclick="__spectate('${room.gameid}')">
				👁
			</button>
		`
			: '';

	/* -------- Start (local only) -------- */
	const startButton =
		room.status === 'waiting' && type === "local" && room.players.length >= 2
			? `
			<button
				class="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs transition"
				onclick="__startGame('${room.gameid}', '${room.players[0]}', '${room.players[1]}')">
				▶ Start
			</button>
		`
			: '';

	/* -------- Status badge -------- */
	const badgeHtml = styles.label
	? `
		<span class="inline-block text-[9px] font-semibold px-1.5 py-0.5 rounded-s-xl rounded-e-none ${styles.badge}">
			${styles.label}
		</span>
	`
	: '';

	/* ---------- Score ---------- */
	const scoreText =
	room.score && room.score.length === 2
		? `${room.score[0]} - ${room.score[1]}`
		: 'N/A';

	return `
		<div class="${containerClasses}" data-room data-layer="${room.layer}" data-idx="${room.idx}">
			${spectateButton}
			${startButton}

			<div class="flex">
				<!-- Left content -->
				<div class="flex-1">
					<div class="flex items-center mb-1 -mr-3 gap-6">
						<p class="text-xs text-white/50">
							Round ${room.layer + 1} · Match ${room.idx}
						</p>
						${badgeHtml}
					</div>

					<ul class="space-y-1">
						${playersHtml}
					</ul>

					${footerHtml}
				</div>

				<!-- Right score (only for finished) -->
				${room.status === 'finished' ? `
					<div class="flex flex-col justify-center items-center ml-4 pl-4 border-l border-white/10">
						<p class="text-xs text-white/50">Score</p>
						<p class="text-xl font-semibold text-white">
							${scoreText}
						</p>
					</div>
				` : ''}
			</div>
		</div>
	`;
}