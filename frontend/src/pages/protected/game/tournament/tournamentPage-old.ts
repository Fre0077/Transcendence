import { loadNavbar } from "@/components/navbar";
// import { loadSpectateGamePage } from "../online/spectateGame";
import { loadPongSpectatorDiv } from "@pages/protected/game/online/loadPongSpectatorDiv";
import { load404Page } from "@/pages/errors/404";

const TOURNAMENT_WEBSOCKET_URL = `ws://${window.location.hostname}:3029/ws/tournament`;


// Keep track of games currently being spectated
const spectatingGames = new Set<string>();

interface Player {
	ID: string;
	name: string;
	status?: string;
}

interface Room {
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

export function loadOnlineTournamentPage(): HTMLElement {
	// let tournment_code = '';
	// let connected_players: Player[] = [];

	// @topiana- we need playerID to authenticate the connection, so I passed it to createWebSocketConnection 

	const playerID = localStorage.getItem('userId'/* ) || sessionStorage.getItem('guestID') || 'Guest_' + Math.floor(Math.random() * 1000 */);
		if (!playerID)
				return load404Page();
			
	
	/* const tournamentWS =  */createWebSocketConnection(playerID);

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
			<div id="connectedPlayersList" class="w-full lg:w-64 shrink-0 sticky top-24 self-start"></div>

			<!-- Tournament board (RIGHT) -->
			<div
				class="flex-1 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20
					border border-purple-500/30 overflow-hidden"
			>
				<div
					id="tournamentRooms"
					class="p-6 flex flex-col gap-6 overflow-x-auto"
				></div>
			</div>

		</div>

		<div id="connectedPlayersList"></div>

		<div id="spectateGameDiv" class="w-full mt-10"></div>

	</div>
	`;

	return div;
}



function leave(socket: WebSocket): boolean
{
	// @topiana- check on socket state
	if (socket.readyState === WebSocket.OPEN) {
		socket.send(JSON.stringify({ method: 'LEAVE' }));
		return true;
	} else {
		console.log("Socket closed, couldn't leave tournament");
		return false;
	}
}

// message received: {"method":"START_REPLY","status":"success","value":"00d78701-cb70-4535-81f3-c7b96bcd757b","comment":"The lobby is now in game"}
function ready(socket: WebSocket)
{
	// build request
	const startGameRequest = {
		method: 'READY',
		// lobbyID: tournment_code // outdated
	};

	// send requests
	if (socket.readyState === WebSocket.OPEN) {
		socket.send(JSON.stringify(startGameRequest));
	} else {
		console.log("Socket closed, couldn't get ready");
		return ;
	}
}

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









/* --------------------------------------- */
/* --------------------------------------- */
/* ----- Render Tournament (ChatGPT) ----- */

function updateTournamentInfo(
    connected_players: Player[] = [],
    rooms: Room[],
	socket:WebSocket
) {
	console.log('Updating tournament info ...');

    /* ---------------- Players list ---------------- */
	const playersListElem = document.getElementById('connectedPlayersList');
	if (playersListElem) {
		if (connected_players.length > 0) {
			playersListElem.innerHTML = `
				<div class="w-full max-w-xs rounded-xl bg-slate-800/60 border border-white/10 p-4 flex flex-col gap-4">
					<h3 class="text-sm font-semibold text-white/80">
						Players (${connected_players.length})
					</h3>

					<ul class="space-y-2 flex-1">
						${connected_players.map(player => {
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

	if (readyBtnPlayerList) readyBtnPlayerList.addEventListener('click', () => ready(socket));
	if (leaveBtnPlayerList) leaveBtnPlayerList.addEventListener('click', () => {
		console.log('Leave Tournament Button clicked');
		if (leave(socket) === false) return;

		// close socket while leaving the page
		socket.close();
		
		// backc to tournament HUB
		router.back();
	});

    /* ---------------- Tournament rooms ---------------- */
    const roomsContainer = document.getElementById('tournamentRooms');
    if (!roomsContainer) return;

    roomsContainer.innerHTML = '';

    // Group rooms by layer
    const roomsByLayer: Record<number, Room[]> = {};
    rooms.forEach(room => {
        if (!roomsByLayer[room.layer]) {
            roomsByLayer[room.layer] = [];
        }
        roomsByLayer[room.layer].push(room);
    });

    // Sort layers numerically
    const sortedLayers = Object.keys(roomsByLayer)
        .map(Number)
        .sort((a, b) => a - b);

    // Render layers
	sortedLayers.forEach(layer => {
		const layerWrapper = document.createElement('div');
		layerWrapper.className = 'flex flex-col gap-3 border-b border-white/20 pb-4 mb-4';
	
		layerWrapper.innerHTML = `
			<h3 class="text-white/80 font-semibold text-center">
				Round ${layer + 1}
			</h3>
	
			<div class="flex flex-wrap justify-center gap-4 overflow-x-auto pb-2">
				${roomsByLayer[layer]
					.sort((a, b) => a.idx - b.idx)
					.map(room => renderRoomCard(room))
					.join('')}
			</div>
		`;
	
		roomsContainer.appendChild(layerWrapper);
	});
}

	



/* ---------------------------------------- */
/* ---------------------------------------- */
/* ---------- RENDER ROOM CARDS ------------*/

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


function renderRoomCard(room: Room): string {
	const styles = getRoomStyles(room.status);

	// const containerClasses =
	// 	`relative min-w-[180px] rounded-lg border p-3 transition ${styles.container}`;

	const containerClasses =
	`relative min-w-[180px] rounded-lg border p-3 transition ${styles.container} overflow-hidden`;


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

					return `<li class="${cls}">• ${player}</li>`;
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
				Winner: ${room.winner.join(', ')}
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
				onclick="window.__spectate('${room.gameid}')">
				👁
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
		<div class="${containerClasses}">
			${spectateButton}

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


(window as any).__spectate = (gameid: string) => {
	spectate(gameid);
};

/* ----------------------------------------- */











/* ----------------------------------------- */
/* 		Socket creation and connection		 */

import { router } from "@/router";

function createWebSocketConnection(playerID:string): WebSocket
{
    const ws = new WebSocket(TOURNAMENT_WEBSOCKET_URL);
    console.log('Websocketing to', TOURNAMENT_WEBSOCKET_URL);

	ws.onopen = () => {
		console.log('Connected to tournament WebSocket');

		// @topiana- aggiunta la AUTH call all'inizio della connesione #review pls
		ws.send(JSON.stringify({ method: 'AUTH', playerID: playerID }));
	};

	ws.onmessage = (event) => {
		try {
			const data = JSON.parse(event.data);

			/* #debug */
			console.log('Tournament WebSocket message received:', data);

			const method = data.method || '';
			if (method === 'START_REPLY' && data.status === 'success') {
				console.log('Room is starting the game:', data.comment);


				// @topiana- load the game page #review pls
				// window.location.href = `/game:${data.value}`;

				// #remove
				// window.sessionStorage.setItem('guestID', playerID);

				// close the websocket when leaving the page
				ws.close();
				
				router.push(`/game/${data.value}`);

			}
			// @topiana-
			else if (method === 'AUTH_REPLY' && data.status === 'success') {
				console.log('Authenticatd successfully');


				// reset lobbycode
				// tournment_code = ''; // (not necessary)

			}
		
		   	// console.log('checking for updates...');
			if (data.ID && data.players)
			{
				// update tournament
				updateTournamentInfo(data.players, data.rooms, ws);
			}
		} catch (e) {
			console.log("error on message received:", event.data);
		}
	};

	ws.onerror = (error) => {
		console.error('WebSocket error:', error);
	};

	ws.onclose = () => {
		console.log('Disconnected from lobby WebSocket');
	};

	return ws;
}