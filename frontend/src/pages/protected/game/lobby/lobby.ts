// defaults
import { router } from "@/router";
// import { load404Page } from "@/pages/errors/404";

// services
import { sendPostRequest } from "@/services/api/sendRequests";
import { LobbyWebSocket,
	ConnectLobbySocket, DisconnectLobbySocket } from "@/services/ws/lobbyWebSocket";

// components
import { loadNavbar } from "@/components/navbar";
import { createProfileCard } from "@components/createProfileCard.js";

// URLS
const BACKEND_APIS_URL = `http://${window.location.hostname}:3029/api`;

// globals
interface Player {
	username: string;
	status?: string;
}

let lobbyWS:LobbyWebSocket | null = null;
let lobby_code:string = "";

export function loadOnlineLobbyPage(): HTMLElement
{
	/* --------------- GET QUERY --------------- */
	const query = router.getQuery().get("lobby-id");
	if (query) lobby_code = query;

	console.log('Got query', lobby_code);
	/* ----------------------------------------- */
	
	// connect to backend
	lobbyWS = ConnectLobbySocket(
		pushToGamePage,
		pushToHubPage,
		updateLobbyInfo,
	);

	//----

	const div = document.createElement('div');
	div.className = 'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col';
	div.innerHTML = /*html*/ `
	${loadNavbar().outerHTML}
	<!-- Online Lobby Page Content -->
	<div class="gap-6 container mx-auto flex flex-col items-center justify-center">
		<div class="text-center mt-6">
			<h1 class="text-5xl font-bold text-white mb-4">Online Game Lobby</h1>
			<p class="text-lg text-white/60">Create or join an online game lobby!</p>
		</div>

		
		<div id="top-cards" class="flex flex-row items-end justify-between gap-8 mb-6">
			
			<!-- Join Game Card -->
			<a id="join-lobby-btn" class="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-600/20 to-teal-600/20 p-3 border border-green-500/30 hover:border-green-400/70 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20">
				<div class="relative z-6 text-center min-w-56">
					<div class="text-3xl mb-2">🔗</div>
					<h2 class="text-xl font-bold text-white mb-2">Join Lobby</h3>
					<p class="text-sm text-white/70">Enter a lobby code</p>
				</div>
			</a>

			<!-- Create/Leave Lobby Card -->
			<div id="create-leave-card"></div>

		</div>

		<!-- Lobby Info Card (ChatGPT) -->
		<div class="flex flex-col lg:flex-row w-full rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 overflow-hidden">

			<!-- LOBBY INFO CARD -->
			<div class="flex flex-col flex-1 p-8 gap-6">
				<h3 class="text-lg font-bold text-white mb-4">Lobby Info</h3>
				<div class="space-y-4" id="lobbyInfo">
					<div>
						<p class="text-xs text-white/50 uppercase tracking-wide mb-1">Lobby Code</p>
						<p id="lobbyCode" class="text-sm font-mono text-cyan-400">${lobby_code || 'Waiting...'}</p>
						<div class="flex items-center gap-2 mt-4">
							<button id="copyLobbyCodeBtn" class="px-4 py-2 bg-cyan-600/20 border border-cyan-500/30 rounded-lg text-sm text-white hover:bg-cyan-600/30 transition flex items-center gap-2">
								<img src="/assets/icons/copy.png" alt="Copy" class="w-4 h-4">
							</button>
							<span id="copyStatus" class="text-sm text-white/60"></span>
						</div>
					</div>
	
					<div>
						<p class="text-xs text-white/50 uppercase tracking-wide mb-2">Connected Players</p>
						<div id="connectedPlayersList" class="grid gap-2"></div>
					</div>
				</div>
	
				<!-- START BUTTON -->
				<div class="mt-auto p-2 border-t border-white/20 bg-slate-900/20 rounded-xl flex justify-center">
					<a id="start-game-btn" class="px-4 py-3 bg-green-600/30 hover:bg-green-600/50 rounded-lg text-white font-bold transition">
						Start Game
					</a>
				</div>

			</div>


			<!-- ACTION CARDS -->
			<div class="max-w-xl grid grid-cols-1 grid-rows-2 items-center justify-center p-8 border-l border-white/10">
			
				<!-- Invite Player Card -->
				<div id="invite-player-card"></div>

				<!-- BOT card (ChatGPT) -->
				<div id="bot-card"></div>
			
			</div>

		</div>

		<br>
	</div>
	`;

	// div with switched stuff
	const topcards = div.querySelector('#top-cards') as HTMLElement;

	// switch to CREATE card
	function showCreate() {
		const toswitch = topcards.lastChild;
		if (toswitch) topcards.replaceChild(loadCreateLobbyCard(showLeave), toswitch);
	}

	// switch to LEAVE card
	function showLeave() {
		const toswitch = topcards.lastChild;
		if (toswitch) topcards.replaceChild(loadLeaveLobbyCard(showCreate), toswitch);
	}

	// load correct card
	if (lobby_code === "") showCreate();
	else showLeave();

	// JOIN an existing lobby
	const joinLobbyBtn = div.querySelector('#join-lobby-btn');
	if (joinLobbyBtn) {
		joinLobbyBtn.addEventListener('click', () => {
			const lobby_code = prompt('Enter Lobby Code:');
			if (lobby_code) {

				// leave old lobby (lame)
				lobbyWS?.send({ method:'LEAVE' });

				// join new lobby
				lobbyWS?.join(lobby_code);
			}
		});
	}

	// Add event listener for START game button
	const startGameBtn = div.querySelector('#start-game-btn');
	if (startGameBtn) startGameBtn.addEventListener('click', () => lobbyWS?.start());

	return div;
}






function pushToGamePage(gameid:string)
{
	// close socket when leaving window
	DisconnectLobbySocket();

	/* #debug */
	console.log('data value', gameid);

	router.push(`/game/${gameid}`);
}

function pushToHubPage()
{
	// close socket when leaving window
	DisconnectLobbySocket();

	router.push('/game');
}







// HELPER
function removeAllChildNodes(parent:HTMLElement) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


/* -------------------------------------------------------------------- */

function updateLobbyInfo(state:any)
{
	if (state.ID === undefined || state.players === undefined) {
		console.log('Invalid lobby state')
	}

	// save lobby code
	lobby_code = state.ID;
	// save players
	const players:Player[] = state.players.map((p:any) => ({
		username: p.ID,
		status: p.status
	}));

	// get divs
	const invitediv = document.getElementById('invite-player-card');
	const botdiv = document.getElementById('bot-card');
	const playersListElem = document.getElementById('connectedPlayersList');
	const lobbyCodeElem = document.getElementById('lobbyCode');

	// There is data to update
	if (lobby_code !== "" && players.length !== 0 && lobbyWS !== null)
	{
		// Update lobby code
		if (lobbyCodeElem) lobbyCodeElem.textContent = lobby_code;

		/* --- PLAYER CARDS --- */
		// credito a Gemini che ci ha donato questo else/if
		if (playersListElem)
		{
			// 1. Pulisci il contenitore vecchio
			playersListElem.innerHTML = ''; 
	
			if (players.length > 0)
			{
				// 2. Modifica la classe del contenitore per visualizzare le card (Grid invece di lista semplice)
				// Rimuovi 'space-y-1' se presente, perché le card sono grandi
				playersListElem.className = "grid grid-cols-3 md:grid-cols-3 gap-4 mt-2"; 
	
				// 3. Itera e "appendi" gli elementi DOM reali
				players.forEach(player => {
					// Qui ottieni l'elemento HTML vivo
					const cardDOM = createProfileCard(player.username); 
					
					// initial state
					cardDOM.classList.add(
						"opacity-0",
						"translate-y-20",
						"transition-all",
						"duration-1000",
						"ease-out"
					);
	
					// Lo inserisci nella pagina
					playersListElem.appendChild(cardDOM);
	
					// next frame → trigger transition
					requestAnimationFrame(() => {
						cardDOM.classList.remove("opacity-0", "translate-y-20");
						cardDOM.classList.add("opacity-100", "translate-y-0");
					});
	
				});
			} else {
				// Caso lista vuota
				playersListElem.className = "space-y-1"; // Ripristina stile lista semplice per il messaggio
				playersListElem.innerHTML = '<li class="text-sm text-white/40 italic">No players connected</li>';
			}
		}

		// Spawn invite card
		if (invitediv && !invitediv.hasChildNodes()) invitediv.appendChild(createUserInviteDiv(sendLobbyInvite));

		// Spawn bot card
		if (botdiv && !botdiv.hasChildNodes()) botdiv.appendChild(createBotCard(lobbyWS.addbot, lobbyWS.rembot));

		// add copy lobby code button
		const copyLobbyCodeBtn = document.getElementById('copyLobbyCodeBtn');
		if (copyLobbyCodeBtn) {
			copyLobbyCodeBtn.addEventListener('click', () => {
				if (lobby_code) {
					navigator.clipboard.writeText(lobby_code).then(() => {
						const copyStatus = document.getElementById('copyStatus');
						if (copyStatus) {
							copyStatus.textContent = 'Copied!';
							setTimeout(() => {
								copyStatus.textContent = '';
							}, 2000);
						}
					}).catch(err => {
						console.error('Failed to copy lobby code: ', err);
					});
				}
			});
		}
	}
	// Cleanup
	else
	{
		if (lobbyCodeElem) lobbyCodeElem.textContent = "Waiting...";
		if (playersListElem) playersListElem.innerHTML = "";
		if (invitediv) removeAllChildNodes(invitediv);
		if (botdiv) removeAllChildNodes(botdiv);
	}
}












/* --------------------------------- */
/* 		  CREATE/LEAVE LOBBY		 */

function loadCreateLobbyCard(onclick?: () => void): HTMLElement
{
	const div = document.createElement('div');
	div.innerHTML = /* html */`
		<a id="create-lobby-btn" class="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-600/20 to-teal-600/20 p-3 border border-green-500/30 hover:border-green-400/70 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20">
			<div class="relative z-6 text-center min-w-56">
				<div class="text-3xl mb-2">🎮</div>
				<h2 class="text-xl font-bold text-white mb-2">Create Lobby</h3>
				<p class="text-sm text-white/70">Create your private lobby</p>
			</div>
		</a>
	`;

	// Add event listener for CREATE lobby button
	const card = div.firstElementChild as HTMLElement;
	if (card) card.addEventListener('click', () => {lobbyWS?.create(); onclick?.();});

	return card;
}

function loadLeaveLobbyCard(onclick?: () => void): HTMLElement
{
	const div = document.createElement('div');
	div.innerHTML = /* html */`
		<a id="leave-lobby-btn" class="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-600/20 to-teal-600/20 p-3 border border-green-500/30 hover:border-green-400/70 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20">
			<div class="relative z-6 text-center min-w-56">
				<div class="text-3xl mb-2">⬅️</div>
				<h2 class="text-xl font-bold text-white mb-2">Leave Lobby</h3>
				<p class="text-sm text-white/70">Leave the current lobby</p>
			</div>
		</a>
	`;

	// Add event listener for LEAVE lobby button
	const card = div.firstElementChild as HTMLElement;
	if (card) card.addEventListener('click', () => {lobbyWS?.leave(); onclick?.();});

	return card;
}


/* -------------------------------- */
/*          PLAYER INVITE           */

// invite-player-btn event
function sendLobbyInvite(event:SubmitEvent)
{
	event.preventDefault(); // stop page reload

	// check if we are in a lobby
	if (!lobby_code) {
		alert("(#todo bertter) join a lobby/create before inviting");
		return ;
	}

	// get the username
	const form = event.currentTarget as HTMLFormElement;
	const data = new FormData(form);

	const username = data.get("username");

	if (typeof username !== "string" || username.trim() === "") {
		console.error("Invalid username");
		return;
	}

	/* #debug */
	console.log('Inviting', username, "to", lobby_code);

	// send the request to the backend
	sendPostRequest(`${BACKEND_APIS_URL}/lobby-invite`, {
		lobbyid: lobby_code,
		username: username
	}, 'application/json');
}

// create invite card
function createUserInviteDiv(onclick: (event:SubmitEvent) => void): HTMLElement
{
	const div = document.createElement('div');

	div.innerHTML = /* html */`
	<!-- Invite Player Card (Compact) -->
	<section
		id="invite-player-card"
		class="relative rounded-lg p-4 border border-white/20
				bg-slate-800/60 backdrop-blur
				transition-all duration-300
				hover:shadow-md hover:shadow-white/10
				focus-within:ring-2 focus-within:ring-cyan-400"
	>
		<div class="text-center">
			<!-- Icon -->
			<div class="text-3xl mb-2" aria-hidden="true">👤➕</div>

			<!-- Title -->
			<h3 class="text-base font-semibold text-white mb-1">
				Invite Player
			</h3>

			<!-- Description -->
			<p class="text-xs text-white/70 mb-3">
				Invite by username
			</p>

			<!-- Form -->
			<form id="invite-form" class="flex flex-col gap-2">
				<label for="invite-player-username" class="sr-only">
					Player username
				</label>

				<input
					id="invite-player-username"
					name="username"
					type="text"
					required
					placeholder="Username"
					class="rounded-md px-3 py-1.5
						bg-slate-900 text-sm text-white
						border border-white/20
						placeholder-white/40
						focus:outline-none focus:ring-2 focus:ring-cyan-400"
				/>

				<button
					type="submit"
					class="inline-flex items-center justify-center gap-1.5
						rounded-md px-3 py-1.5
						bg-cyan-600 hover:bg-cyan-500
						text-sm font-medium text-white
						transition-colors
						focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400"
				>
					<span aria-hidden="true">✉️</span>
					Send
				</button>
			</form>
		</div>
	</section>
`;


	// Add event listener
	const inviteform = div.querySelector("#invite-form") as HTMLFormElement;
	inviteform.addEventListener("submit", (event) => onclick(event));
	
	return div;
}



/* ----------------------------------------- */
/* 					BOT CARD 				 */

function createBotCard(
	add: (level:number, event:MouseEvent) => void,
	remove: (event:MouseEvent) => void): HTMLElement
{
	const div = document.createElement('div');

	div.innerHTML = /* html */`
	<!-- BOT Card (Compact, Color-blind Safe) -->
	<div
		class="flex flex-col rounded-lg
			bg-slate-800/60 backdrop-blur
			border border-white/15
			overflow-hidden
			transition hover:shadow-md hover:shadow-white/10"
	>

		<!-- CARD CONTENT -->
		<div class="p-4 flex flex-col items-center gap-2">
			<h3 class="text-sm font-semibold text-white tracking-wide">
				BOT
			</h3>

			<p class="text-xs text-white/60">
				Difficulty
			</p>

			<!-- Slider -->
			<div class="flex items-center gap-2 w-full justify-center mt-1">
				<span class="text-xl" aria-hidden="true">💩</span>

				<input
					id="bot-level-slider"
					type="range"
					min="0"
					max="100"
					value="50"
					class="w-32 h-1.5
						accent-sky-500
						cursor-pointer"
					aria-label="Bot difficulty"
				/>

				<span class="text-xl" aria-hidden="true">🐐</span>
			</div>

			<!-- Difficulty hint -->
			<span class="text-[10px] text-white/50">
				Easy → Hard
			</span>
		</div>

		<!-- ACTION BAR -->
		<div class="flex border-t border-white/10 text-xs font-medium">

			<button
				type="button"
				id="add-bot-btn"
				class="flex-1 flex items-center justify-center gap-1.5
					py-2
					text-white
					bg-sky-600/20 hover:bg-sky-600/30
					transition
					disabled:opacity-40
					disabled:cursor-not-allowed
					disabled:hover:bg-slate-600/20"
			>
				<span class="text-base leading-none drop-shadow-sm" aria-hidden="true">➕</span>
				Add
			</button>

			<button
				type="button"
				id="rem-bot-btn"
				class="flex-1 flex items-center justify-center gap-1.5
					py-2
					text-white
					bg-slate-600/20 hover:bg-slate-600/30
					transition
					disabled:opacity-40
					disabled:cursor-not-allowed
					disabled:hover:bg-slate-600/20"
			>
				<span class="text-base leading-none drop-shadow-sm" aria-hidden="true">➖</span>
				Remove
			</button>

		</div>
	</div>
`;

	let botcount = 0;

	// ADD bot event listener
	const addbtn = div.querySelector("#add-bot-btn") as HTMLButtonElement;
	const slider = div.querySelector("#bot-level-slider") as HTMLInputElement;
	addbtn.addEventListener('click', (event) => {
		const level = slider.value;
		add(100 - Number(level), event);

		// disable logic
		botcount++;
		rembtn.disabled = false;
	});

	// RMEOVE bot event listener
	const rembtn = div.querySelector("#rem-bot-btn") as HTMLButtonElement;
	rembtn.disabled = true;	// disable at first
	rembtn.addEventListener('click', (event) => {
		remove(event);

		// disable logic
		if (botcount > 0) botcount--;
		if (botcount === 0) rembtn.disabled = true;
	});
	
	return div;
}