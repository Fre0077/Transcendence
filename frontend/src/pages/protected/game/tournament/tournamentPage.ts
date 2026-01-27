// defaults
import { router } from "@/router";
import { loadNavbar } from "@/components/navbar";
// import { load404Page } from "@/pages/errors/404";

// services
import { TournamentWebSocket, ConnectTournamentSocket } from "@/services/ws/tournamentWebSocket";

// elements
import { loadPongSpectatorDiv } from "@pages/protected/game/online/loadPongSpectatorDiv";
import { createProfileCard } from "@/components/createProfileCard";
import { Room, renderRoomCard } from "@/components/tournament/renderRoomCard";

// const TOURNAMENT_WEBSOCKET_URL = `ws://${window.location.hostname}:3029/ws/tournament`;


// Keep track of games currently being spectated
const spectatingGames = new Set<string>();

interface Player {
	ID: string;
	status?: string;
}

// 'Room' interface imported from "@/components/tournament/renderRoomCard"

interface TournamentState
{
	ID:string;

	// status
	finished:boolean;
	aborted:boolean;
	winners:string[];
	current_layer:number;
	
	// data
	players: Player[];
	rooms: Room[];
}

let tournamentWS:TournamentWebSocket | null = null;
let tourn_code:string | undefined = undefined;

export function loadOnlineTournamentPage(): HTMLElement
{
	//----

	const div = document.createElement('div');
	div.className = 'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col';
	div.innerHTML = /*html*/ `
	${loadNavbar().outerHTML}
	<!-- Online Tournament Page Content -->
	<div class="flex-1 container mx-auto px-4 flex flex-col items-center justify-center gap-8">
		<div class="text-center mb-8">
			<h1 class="text-5xl font-bold text-white mb-4">Online Tournament</h1>
			<p class="text-lg text-white/60">Get ready to play :3</p>
		</div>

		<!-- Players + Tournament Layout -->
		<div class="w-full max-w-7xl flex flex-col lg:flex-row gap-6">

			<!-- Players list (LEFT) -->
			<div id="tournament-connected-players" class="w-full lg:w-64 shrink-0 sticky top-24 self-start"></div>

			<!-- Tournament board (RIGHT) -->
			<div
				class="flex-1 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20
					border border-purple-500/30 overflow-hidden"
			>
				<!-- Rooms (UP) -->
				<div
					id="tournamentRooms"
					class="p-6 overflow-x-auto"
				></div>

				<!-- Winners (DOWN) -->
				<div
					id="winnersPanel"
					class="p-6 pt-0"
				></div>

			</div>
		</div>

		<div id="spectateGameDiv" class="w-full mt-10"></div>

	</div>
	`;

	// connect to the backend
	tournamentWS = ConnectTournamentSocket(() => router.push('/tournaments'), tourn_code);

	// add listeners to socket messages
	tournamentWS.onmessage(pushToGamePage, () => {}, updateTournamentInfo);

	// update tournament code
	tourn_code = tournamentWS.getid();

	return div;
}

/* -------------------------------------------------------- */
/* ------------------- SOCKET ACTIONS --------------------- */
/* -------------------------------------------------------- */


// add the spectated game
function spectate(gameid: string) {
    // If already spectating this game, do nothing
    if (spectatingGames.has(gameid)) {
        console.log(`Already spectating game ${gameid}`);
        return;
    }

    console.log('Spectating game:', gameid);

    const container = document.getElementById('spectateGameDiv');
    if (!container) return;

    // Mark as spectating
    spectatingGames.add(gameid);

    // Disable the spectate button for this game
    const btn = document.querySelector(`[data-spectate-btn][onclick*="${gameid}"]`) as HTMLElement;
    if (btn) {
        btn.classList.add('opacity-50', 'pointer-events-none');
    }

    // Create spectate view
    const spectateDiv = loadPongSpectatorDiv(gameid);

    spectateDiv.classList.add(
        'mt-10',
        'p-6',
        'max-w-6xl',
        'mx-auto',
        'shadow-xl'
    );

    container.appendChild(spectateDiv);

    // Scroll to newly added spectate
    spectateDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Optional: If spectateDiv has a close button, remove game from set when closed
    const closeBtn = spectateDiv.querySelector('#close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            container.removeChild(spectateDiv);
            spectatingGames.delete(gameid);

            // Re-enable the button
            if (btn) {
                btn.classList.remove('opacity-50', 'pointer-events-none');
            }
        });
    }
}

// Expose global function for HTML string buttons
(window as any).__spectate = (gameid: string) => {
	spectate(gameid);
};









/* --------------------------------------- */
/* --------------------------------------- */
/* ----- Render Tournament (ChatGPT) ----- */

function renderWinnersPanel(status:'aborted' | 'finished', winners: string[]): HTMLElement
{
	const div = document.createElement('div');

	/* aborted div */
	if (status === 'aborted')
	{
		div.innerHTML = /* html */`
			<div class="w-full mt-6">
				<div class="w-full max-w-3xl mx-auto rounded-xl bg-red-900/20 border border-red-500/30 p-6 text-center">
					
					<div class="flex items-center justify-center mb-3">
						<span class="text-3xl">⛔</span>
					</div>

					<h3 class="text-red-300 font-semibold text-lg mb-1">
						Tournament Aborted
					</h3>

					<p class="text-sm text-red-200/70">
						This tournament was stopped before completion.
						No winners were recorded.
					</p>
				</div>
			</div>
		`;

		return div;
	}

	/* finished div */
	div.innerHTML = /* html */`
		<div class="w-full mt-6">
			<div class="w-full max-w-4xl mx-auto rounded-xl bg-white/5 border border-white/10 p-4">
				<h3 class="text-white/80 font-semibold mb-3">Tournament Winners</h3>
				
				<div id="wall-of-fame"class="grid grid-cols-2 md:grid-cols-4 gap-3"></div>
			</div>
		</div>
	`;

	// where to put the cards
	const wall = div.querySelector('#wall-of-fame') as HTMLElement;

	// sad winners
	if (!winners?.length)
	{
		wall.textContent = "No winners... ???";
	}

	// unique winners (just in case)
	const uniqueWinners = Array.from(new Set(winners));

	for (const p of uniqueWinners) {
		wall.appendChild(createProfileCard(p));
	}

	return div;
}

// Render player list on the right, also only place where you can leave the tournament
function renderPlayerList(players:Player[])
{
	 /* ---------------- Players list ---------------- */
	const playersListElem = document.getElementById('tournament-connected-players');
	if (playersListElem) {
		if (players.length > 0) {
			playersListElem.innerHTML = `
				<div class="w-full max-w-xs rounded-xl bg-slate-800/60 border border-white/10 p-4 flex flex-col gap-4">
					<h3 class="text-sm font-semibold text-white/80">
						Players (${players.length})
					</h3>

					<ul class="space-y-2 flex-1">
						${players.map(player => {
							const status = player.status ?? 'idle';
							const statusColor =
								(status === 'disconnected' || status === 'left')
									? 'bg-red-500'
									: status === 'connected'
									? 'bg-green-500'
									: status === 'ready'
									? 'bg-blue-500'
									: 'bg-yellow-400';
							return `
								<li class="flex items-center justify-between text-sm text-white/80">
									<div class="flex items-center gap-2">
										<span class="w-2 h-2 rounded-full ${statusColor}"></span>
										<span class="truncate max-w-[140px]">${player.ID}</span>
									</div>
								</li>
							`;
						}).join('')}
					</ul>

					<!-- Ready + Leave buttons at the end -->
					<div class="flex gap-2 mt-2">
						<button id="readyBtnPlayerList" class="flex-1 py-2 text-sm font-medium text-white bg-green-600/20 hover:bg-green-600/30 rounded transition">
							Ready
						</button>
						<button id="leaveBtnPlayerList" class="flex-1 py-2 text-sm font-medium text-white bg-red-600/20 hover:bg-red-600/30 rounded transition">
							Leave
						</button>
					</div>
				</div>
			`;
		} else {
			playersListElem.innerHTML = `
				<p class="text-sm text-white/40 italic">
					No players connected
				</p>
			`;
		}
	}

	// Attach event listeners immediately after
	const readyBtnPlayerList = document.getElementById('readyBtnPlayerList');
	const leaveBtnPlayerList = document.getElementById('leaveBtnPlayerList');

	if (readyBtnPlayerList) readyBtnPlayerList.addEventListener('click', () => tournamentWS?.ready());
	if (leaveBtnPlayerList) leaveBtnPlayerList.addEventListener('click', () => tournamentWS?.leave());
}


// Render each bracket
function renderBracketColumn(layer: number, rooms: Room[]): string {
	return `
		<div class="flex flex-col gap-6 items-center justify-center">
			<h4 class="text-xs text-white/50 text-center mb-2">
				Round ${layer + 1}
			</h4>
			${rooms
			.sort((a, b) => a.idx - b.idx)
			.map(room => renderRoomCard(room))
			.join('')}
		</div>
	`;
}

function renderTournamentLayout(rooms:Room[])
{
	/* ---------------- Tournament rooms ---------------- */
	const roomsContainer = document.getElementById('tournamentRooms');
	if (!roomsContainer) return;

	roomsContainer.innerHTML = '';

	// Group rooms by layer
	const roomsByLayer: Record<number, Room[]> = {};
	rooms.forEach(room => {
		roomsByLayer[room.layer] ??= [];
		roomsByLayer[room.layer].push(room);
	});

	// Sort layers numerically
	const sortedLayers = Object.keys(roomsByLayer)
		.map(Number)
		.sort((a, b) => a - b);

	// This is the big container that holds all the brackets
	const bracketHtml = `
		<div class="relative overflow-x-auto pb-2">
			<div class="flex gap-6 items-center justify-center min-w-max">
			${sortedLayers
				.map(layer => renderBracketColumn(layer, roomsByLayer[layer]))
				.join('')}
			</div>
		</div>
	`;

	roomsContainer.innerHTML = bracketHtml;
}


	






/* ------------------------------------------------------ */
/*	 					UPDATE LOGIC					  */



function updateTournamentInfo(state:TournamentState) {
	console.log('Updating tournament info ...');

	// read data
	const { players, rooms, finished, aborted, winners } = state;

	// verify
	if (!players || !rooms || finished === undefined || !winners) {
		console.log('Invalid tournament-state', state);
		return ;
	}

	// Render player list
	renderPlayerList(players);

	// render tournament layout
	renderTournamentLayout(rooms);

	// update winners panel
	// update winners panel
	const winnersPanel = document.getElementById('winnersPanel');
	if (winnersPanel && (finished || aborted)) {
		const status = (finished) ? 'finished' : 'aborted';
		winnersPanel.appendChild(renderWinnersPanel(status, winners));
	}
}

/* ---------------------------------------------------- */








function pushToGamePage(gameid:string)
{
	tournamentWS?.close();
				
	router.push(`/game/${gameid}`);
}
