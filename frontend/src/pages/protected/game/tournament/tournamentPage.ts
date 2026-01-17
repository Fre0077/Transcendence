import { loadNavbar } from "@/components/navbar";
// import { loadSpectateGamePage } from "../online/spectateGame";
import { loadPongSpectatorDiv } from "@pages/protected/game/online/loadPongSpectatorDiv";
import { load404Page } from "@/pages/errors/404";

const basePath = `http://${window.location.hostname}:3032/`;

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

function renderRoomCard(room: Room & { status?: string }): string {
	const playersHtml = room.players.length
		? room.players.map(p =>
			`<li class="text-xs text-white/70">• ${p}</li>`
		).join('')
		: `<li class="text-xs text-white/40 italic">Waiting...</li>`;

	const winnerHtml = room.winner.length
		? `<p class="text-xs text-green-400 mt-2">
				Winner: ${room.winner.join(', ')}
			</p>`
		: `<p class="text-xs text-white/40 mt-2 italic">
				Not played yet
			</p>`;

	const spectateButton =
		room.status === 'in-game'
			? `
			<button data-spectate-btn
				class="absolute top-2 right-2 rounded-md bg-red-600/80 hover:bg-red-600 text-white p-1 transition"
				onclick="window.__spectate('${room.gameid}')">
				👁
			</button>
		`
			: '';

	return `
		<div class="relative min-w-[180px] rounded-lg bg-slate-800/70 border border-white/10 p-3">
			${spectateButton}

			<p class="text-xs text-white/50 mb-1">
				Round ${room.layer + 1} · Match ${room.idx}
			</p>

			<ul class="space-y-1">
				${playersHtml}
			</ul>

			${winnerHtml}
		</div>
	`;
}
	
// Expose spectate for inline buttons
(window as any).__spectate = (gameid: string) => {
	spectate(gameid);
};

/* ----------------------------------------- */











/* ----------------------------------------- */
/* 		Socket creation and connection		 */

import { router } from "@/router";

function createWebSocketConnection(playerID:string): WebSocket
{
	const ws = new WebSocket(basePath.replace('http', 'ws') + 'tournamentsocket');
	console.log(basePath.replace('http', 'ws') + 'tournamentsocket');

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
				window.sessionStorage.setItem('guestID', playerID);

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