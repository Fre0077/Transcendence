import { loadNavbar } from "@/components/navbar";

const basePath = `http://${window.location.hostname}:3032/`;

interface Player {
	id: string;
	name: string;
	status?: string;
}

interface Room {
	// id room
	gameid:string;
	layer:number;
	idx:number;

	// players
	players:string[];

	// outcome
	winner:string[];
	score:number[];

}

export function loadOnlineTournamentPage(): HTMLElement {
	// let tournment_code = '';
	// let connected_players: Player[] = [];

	// @topiana- we need playerID to authenticate the connection, so I passed it to createWebSocketConnection 

	const playerID = localStorage.getItem('playerID') || sessionStorage.getItem('guestID') || 'Guest_' + Math.floor(Math.random() * 1000);
	
	let tournamentWS = createWebSocketConnection(playerID);

	//----

	const div = document.createElement('div');
	div.className = 'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col';
	div.innerHTML = /*html*/ `
	${loadNavbar().outerHTML}
	<!-- Online Lobby Page Content -->
	<div class="flex-1 container mx-auto px-4 flex flex-col items-center justify-center gap-8">
		<div class="text-center mb-8">
			<h1 class="text-5xl font-bold text-white mb-4">Online Tournament</h1>
			<p class="text-lg text-white/60">Get ready to play :3</p>
		</div>

		<div class="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- Tournament Info Card (ChatGPT) -->
			<div class="flex flex-col h-full lg:col-span-2 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 overflow-hidden">

				<div id="tournamentRooms" class="p-6 flex flex-col gap-6 overflow-x-auto"></div>

			</div>
		</div>


		<!-- ACTION BAR (STUCK TO BOTTOM, FULL WIDTH) -->
		<div class="border-t border-white/10">
			<div class="flex w-full">

				<!-- Ready Game -->
				<a id="readyBtn" class="flex-1 flex items-center justify-center py-3 text-sm font-medium text-white bg-green-600/20 hover:bg-green-600/30 transition">
					Ready
				</a>

				<!-- Leave Tournament -->
				<a id="leaveBtn" class="flex-1 flex items-center justify-center py-3 text-sm font-medium text-white bg-red-600/20 hover:bg-red-600/30 transition">
					Leave Tournament
				</a>

			</div>
		</div>

		<!-- BOT card (ChatGPT) -->
		<div class="flex flex-col rounded-xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 overflow-hidden">

			<!-- CARD CONTENT -->
			<div class="p-6 flex-1 flex flex-col items-center">
				<h3 class="text-lg font-bold text-white mb-2">BOT</h3>
				<p class="text-xs text-white/70 mb-6">Difficulty</p>

				<!-- Slider container -->
				<div class="flex flex-col items-center gap-2 flex-1 justify-center">
					<span class="text-xs text-white/50">Gremlin</span>

					<input
						id="botLevelSlider"
						type="range"
						min="0"
						max="100"
						value="50"
						class="h-40 w-2 accent-blue-500 cursor-pointer [writing-mode:vertical-rl] [direction:rtl]"/>

					<span class="text-xs text-white/50">Demigod</span>
				</div>
			</div>

			<!-- ACTION BAR (FULL WIDTH, 2 BUTTONS) -->
			<div class="border-t border-white/10">
				<div class="flex w-full">

					<!-- ADD button -->
					<button
						id="addBotBtn"
						class="flex-1 flex items-center justify-center py-3 text-sm font-medium text-white bg-green-600/20 hover:bg-green-600/30 transition"
					>
						ADD
					</button>

					<!-- LEAVE button -->
					<button
						id="remBotBtn"
						class="flex-1 flex items-center justify-center py-3 text-sm font-medium text-white bg-red-600/20 hover:bg-red-600/30 transition"
					>
						REMOVE
					</button>

				</div>
			</div>
		</div>

		<div id="connectedPlayersList"></div>

	</div>
	`;

	
	const leaveBtn = div.querySelector('#leaveBtn');
	if (leaveBtn) {
		leaveBtn.addEventListener('click', () => {
			console.log('Leave Tournament Button clicked');
			leave(tournamentWS);

			tournamentWS.close();
			//#todo reroute to tournament HUB (or home)

		});
		console.log('Leave Lobby Button found and event listener added');
	}

	const readyBtn = div.querySelector('#readyBtn');
	if (readyBtn) {
		readyBtn.addEventListener('click', () => {
			ready(tournamentWS);
		});
	}

	//----------------------
	// @topiana-
	const slider = div.querySelector("#botLevelSlider") as HTMLInputElement;
	const addBotBtn = div.querySelector('#addBotBtn');
	if (addBotBtn && slider) {
		addBotBtn.addEventListener('click', () => {
			const level = slider.value;
			addBot(Number(level), tournamentWS);
		});
	}

	const remBotBtn = div.querySelector('#remBotBtn');
	if (remBotBtn) {
		remBotBtn.addEventListener('click', () => {
			remBot(tournamentWS);
		});
	}

	return div;
}



function leave(socket: WebSocket)
{
	// @topiana- check on socket state
	if (socket.readyState === WebSocket.OPEN) {
		socket.send(JSON.stringify({ method: 'LEAVE' }));
	} else {
		console.log("Socket closed, couldn't leave tournament");
		return ;
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

// @topiana- add a bot
function addBot(level:number, ws:WebSocket)
{
	if (ws.readyState === WebSocket.OPEN) {
		ws.send(JSON.stringify({ method: 'BOT', value: 'ADD', level: level }))
	}
}

// @topiana- remove a bot
function remBot(ws:WebSocket)
{
	if (ws.readyState === WebSocket.OPEN) {
		ws.send(JSON.stringify({ method: 'BOT', value: 'REMOVE'}))
	}
}





/* --------------------------------------- */
/* ----- Render Tournament (ChatGPT) ----- */

function updateTournamentInfo(
    connected_players: Player[] = [],
    rooms: Room[]
) {
	console.log('Updating tournament info ...');

    /* ---------------- Players list ---------------- */
    const playersListElem = document.getElementById('connectedPlayersList');
    if (playersListElem) {
        if (connected_players.length > 0) {
            playersListElem.innerHTML = `
                <ul class="space-y-1">
                    ${connected_players.map(player =>
                        `<li class="text-sm text-white/80">• ${player.name} - ${player.status}</li>`
                    ).join('')}
                </ul>
            `;
        } else {
            playersListElem.innerHTML =
                '<p class="text-sm text-white/40 italic">No players connected</p>';
        }
    }

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
        layerWrapper.className = 'flex flex-col gap-3';

        layerWrapper.innerHTML = `
            <h3 class="text-white/80 font-semibold">
                Round ${layer + 1}
            </h3>

            <div class="flex gap-4 overflow-x-auto pb-2">
                ${roomsByLayer[layer]
                    .sort((a, b) => a.idx - b.idx)
                    .map(room => renderRoomCard(room))
                    .join('')}
            </div>
        `;

        roomsContainer.appendChild(layerWrapper);
    });
}

function renderRoomCard(room: Room): string {
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

    return `
        <div class="min-w-[180px] rounded-lg bg-slate-800/70 border border-white/10 p-3">
            <p class="text-xs text-white/50 mb-1">
                Layer ${room.layer} · Match ${room.idx}
            </p>

            <ul class="space-y-1">
                ${playersHtml}
            </ul>

            ${winnerHtml}
        </div>
    `;
}


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
			console.log('Tournament WebSocket message received:', data);
			// let updateNeeded = false; // (outdated)
			const method = data.method || '';
			if (method === 'START_REPLY' && data.status === 'success') {
				console.log('Room is starting the game:', data.comment);


				// @topiana- load the game page #review pls
				// window.location.href = `/game:${data.value}`;

				// #remove
				window.sessionStorage.setItem('guestID', playerID);

				
				router.push(`/game/${data.value}`);

			}
			// @topiana-
			else if (method === 'AUTH_REPLY' && data.status === 'success') {
				console.log('Authenticatd successfully');


				// reset lobbycode
				// tournment_code = ''; // (not necessary)

			}
			/* interface TournamentState {
                ID:string;
                // gameID:string;
                players: {
                    ID:string;
                    status:string;
                }[];
                rooms: {
                    // id room
                    layer:number;
                    idx:number;

                    players:string[];

                    // outcome
                    winner:string[];
                    score:number[];
                }[]
            } */
			if (data.ID && data.players)
			{
				// update tournament
				updateTournamentInfo(data.players, data.rooms);
			}
		} catch (e) {
			console.log("message received:", event.data);
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