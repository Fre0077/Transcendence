// defaults
import { router } from "@/router";
import { loadNavbar } from "@/components/navbar";
// import { load404Page } from "@/pages/errors/404";

// services
// import type { TournamentWebSocket } from "@/services/ws/tournamentWebSocket";

import { Tournament } from "./classes/Tournament/Tournament";

// elements
import { PlayerData, createPlayerSelectDiv } from "@components/tournament/createPlayerSelectDiv";
import { createProfileCard } from "@/components/createProfileCard";
import { Room, renderRoomCard } from "@/components/tournament/renderRoomCard";
import { loadLocalPongPage } from "./loadLocalPongPage";

// const TOURNAMENT_WEBSOCKET_URL = `ws://${window.location.hostname}:3029/ws/tournament`;


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

let tournament:Tournament | null = null;
let playersData: Record<string, PlayerData> | null = null;

function deleteTournament() {
	tournament = null;
	playersData = null;
}

export function loadLocalTournamentPage(): HTMLElement
{
	// create div
	const div = document.createElement('div');
	div.className =
		'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col';

	div.innerHTML = /*html*/ `
		${loadNavbar().outerHTML}
		<div id="page-content" class="flex-1 container mx-auto px-4"></div>
	`;

	const pageContent = div.querySelector('#page-content') as HTMLElement;
	
	/* ---------------- Player selection FIRST ---------------- */

	if (tournament === null)
	{
		const playerSelect = createPlayerSelectDiv((players:any) => {

			{
				// initialize player data
				playersData = {}

				// save player data
				for (const p of players) {
					playersData[p.username] = p;
				}
			}
			{
				// ✅ players are ready, now create tournament
				tournament = new Tournament(players.length, 2, 'single-elimination');

				for (const p of players) {
					tournament.join(p.username);
				}
			}

			// remove form + render tournament UI
			playerSelect.remove();
			renderTournamentUI(pageContent);

			// start listening
			tournament.onupdate(updateTournamentInfo);
			setTimeout(() => tournament?.sync(), 0);
		});

		div.appendChild(playerSelect);
		return div; // ⛔ stop here until players are selected
	}

	/* ---------------- Already initialized ---------------- */
	
	renderTournamentUI(pageContent);

	// automatically update on events
	tournament.onupdate(updateTournamentInfo);

	// fist update
	setTimeout(() => tournament?.sync(), 0);

	// abort ingame rooms
	for (const r of tournament.rooms.values()) {
		if (r.ingame === true) {
			// abort room
			tournament.killRoom(r.gameid);
			// and reconnect players
			r.players.forEach(p => tournament?.join(p));
		}
	}

	// if tournament finished or aborted, after rendering, reset the tournament
	if (tournament?.finished === true || tournament?.aborted === true) {
		setTimeout(() => deleteTournament(), 1);
	}

	return div;

	// div.innerHTML = /*html*/ `
	// ${loadNavbar().outerHTML}
	// <!-- Online Tournament Page Content -->
	// <div class="flex-1 container mx-auto px-4 flex flex-col items-center justify-center gap-8">
	// 	<div class="text-center mb-8">
	// 		<h1 class="text-5xl font-bold text-white mb-4">Online Tournament</h1>
	// 		<p class="text-lg text-white/60">Get ready to play :3</p>
	// 	</div>

	// 	<!-- Players + Tournament Layout -->
	// 	<div class="w-full max-w-7xl flex flex-col lg:flex-row gap-6">

	// 		<!-- Players list (LEFT) -->
	// 		<div id="tournament-connected-players" class="w-full lg:w-64 shrink-0 sticky top-24 self-start"></div>

	// 		<!-- Tournament board (RIGHT) -->
	// 		<div
	// 			class="flex-1 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20
	// 				border border-purple-500/30 overflow-hidden"
	// 		>
	// 			<!-- Rooms (UP) -->
	// 			<div
	// 				id="tournamentRooms"
	// 				class="p-6 overflow-x-auto"
	// 			></div>

	// 			<!-- Winners (DOWN) -->
	// 			<div
	// 				id="winnersPanel"
	// 				class="p-6 pt-0"
	// 			></div>

	// 		</div>
	// 	</div>

	// 	<div id="spectateGameDiv" class="w-full mt-10"></div>

	// </div>
	// `;

	// // automatically update on events
	// tournament.onupdate(updateTournamentInfo);

	// // fist update
	// setTimeout(() => tournament?.sync(), 0);

	// // abort ingame rooms
	// for (const r of tournament.rooms.values()) {
	// 	if (r.ingame === true) {
	// 		// abort room
	// 		tournament.killRoom(r.gameid);
	// 		// and reconnect players
	// 		r.players.forEach(p => tournament?.join(p));
	// 	}
	// }

	// // if tournament finished or aborted, after rendering, reset the tournament
	// if (tournament?.finished === true || tournament?.aborted === true) {
	// 	setTimeout(() => tournament = null, 1);
	// }


	// // NOTE the pc is fuming, maybe the tournament class is heavy? (ro maybe just discord)

	// return div;
}

function renderTournamentUI(container: HTMLElement)
{
	container.innerHTML = /*html*/`
		<div class="flex flex-col items-center justify-center gap-8">
			<div class="text-center mb-8">
				<h1 class="text-5xl font-bold text-white mb-4">Local Tournament</h1>
				<p class="text-lg text-white/60">Get ready to play</p>
			</div>

			<div class="w-full max-w-7xl flex flex-col lg:flex-row gap-6">
				<div
					id="tournament-connected-players"
					class="w-full lg:w-64 shrink-0 sticky top-24 self-start">
				</div>

				<div
					class="flex-1 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20
						border border-purple-500/30 overflow-hidden"
				>
					<div id="tournamentRooms" class="p-6 overflow-x-auto"></div>
					<div id="winnersPanel" class="p-6 pt-0"></div>
				</div>
			</div>

			<div id="spectateGameDiv" class="w-full mt-10"></div>
		</div>
	`;
}









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

// Render player list on the right, also you can delete the tournament
function renderPlayerList(players: Player[])
{
	console.log('players', players);

	const playersListElem = document.getElementById('tournament-connected-players');
	if (!playersListElem) return;

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

				<!-- Delete tournament button -->
				<button
					id="delete-tournament-btn"
					class="w-full mt-2 rounded-md bg-red-600/80 hover:bg-red-600 text-white text-sm font-semibold py-2 transition">
					Delete Tournament
				</button>
			</div>
		`;

		// attach onclick
		const deleteBtn = document.getElementById('delete-tournament-btn');
		if (deleteBtn) {
			deleteBtn.onclick = () => {
				deleteTournament();
				router.back();
			};
		}
	}
	else {
		playersListElem.innerHTML = `
			<p class="text-sm text-white/40 italic">
				No players connected
			</p>
		`;
	}
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
			.map(room => renderRoomCard(room, "local"))
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
	console.log('Updating tournament info ...', state);

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

	// update winners panel and reset tournament (local)
	const winnersPanel = document.getElementById('winnersPanel');
	if (winnersPanel && (finished || aborted)) {
		const status = (finished) ? 'finished' : 'aborted';
		winnersPanel.appendChild(renderWinnersPanel(status, winners));

		// reset tournament
		deleteTournament();
	}
}

/* ---------------------------------------------------- */







const root = document.getElementById('app') as HTMLElement;

function pushToGamePage(gameid:string, player1:string, player2:string)
{
	// ready the room
	tournament?.ready(player1);
	tournament?.ready(player2);

	// Clear and render new component
	root.innerHTML = '';
	const component = loadLocalPongPage(playersData?.[player1], playersData?.[player2], gameid, (gameid:string, winners:string[], score:number[]) => {
		
		// set the score and winners
		tournament?.finalizeRoom(gameid, winners, score);

		// re-connect players
		tournament?.join(player1);
		tournament?.join(player2);
	});

	window.history.pushState({}, '', '/game/local');
	root.appendChild(component);

	// Scroll to top
	window.scrollTo(0, 0);
}

// expose once per render (id is enough to avoid collisions)
(window as any).__startGame = (gameid: string, player1:string, player2:string) => {
	pushToGamePage(gameid, player1, player2);
};
