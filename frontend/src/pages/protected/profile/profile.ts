import { loadNavbar } from "@/components/navbar";
import { sendGetRequest } from "@/services/api/sendRequests";
import { generateInitialsAvatar } from "@/components/createDefaultImage";

import { GameData, createHistoryBar } from "@/components/createHistoryBar";
import { createFriendsBar } from "@/components/createFriendBar";
import { sendPostRequest } from "@/services/api/sendRequests";

const BACKEND_APIS_URL = `http://${window.location.hostname}:3029/api`;

export function loadProfilePage(): HTMLElement {
	const div = document.createElement('div');
	div.className = 'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col';
	div.innerHTML = /* html */ `
	${loadNavbar().outerHTML}

	<div class="flex items-center flex-grow flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
		<!-- this div will only expand vertically -->
		<div class="flex flex-row space-x-8 mt-12 p-8 bg-slate-800/70 backdrop-blur-sm rounded-lg max-w-4xl w-full">
			<div class="text-center flex flex-row flex-grow items-center">
				<img class="w-32 h-32 mb-6 rounded-full select-none" draggable="false" ondragstart="return false;" style="-webkit-user-drag: none; user-select: none;" src="https://i.pravatar.cc/150?img=1" alt="Under Construction" />
				<div class="ml-8 text-left">
					<h1 class="text-4xl font-bold text-white mb-4">Username</h1>
					<p class="text-white/70 mb-6">Brief description about the user.</p>
				</div>
			</div>
			<div id="userStats" class="text-left flex-grow">
				<h2 class="text-2xl font-bold text-white mb-2 text-center">User Statistics</h2>
				<div class="flex flex-row space-x-6 justify-center">
					<p class="text-white/70">Games Played: 100</p>
					<p class="text-white/70">Wins: 75</p>
					<p class="text-white/70">Losses: 25</p>
				</div>
				<div class="flex flex-row space-x-6 justify-center">
					<div class="rounded-lg p-4">
						${createDonutChart(200, 45, "Games W/L").outerHTML}
					</div>
					<div class="rounded-lg p-4">
						${createDonutChart(23, 13, "Tournament W/L").outerHTML}
					</div>
				</div>
			</div>

		</div>

		<br>

		<!-- Friend Request -->
		<section
            id="friend-request-card"
            class="relative rounded-xl p-8 border border-white/20
                    bg-slate-800/60 backdrop-blur
                    transition-all duration-300
                    hover:shadow-lg hover:shadow-white/10
                    focus-within:ring-2 focus-within:ring-cyan-400"
            >
                <div class="text-center">
                    <!-- Icon -->
                    <div class="text-5xl mb-4" aria-hidden="true">👤➕</div>

                    <!-- Title -->
                    <h3 class="text-xl font-bold text-white mb-2">
                        Friend request
                    </h3>

                    <!-- Description -->
                    <p class="text-sm text-white/70 mb-4">
                        Send a friend request
                    </p>

                    <!-- Form -->
                    <form id="friend-request-form" class="flex flex-col gap-3">
                        <label for="friend-request-username" class="sr-only">
                            Player username
                        </label>

                        <input
                            id="friend-request-username"
                            name="username"
                            type="text"
                            required
                            placeholder="Username"
                            class="rounded-md px-4 py-2
                                bg-slate-900 text-white
                                border border-white/20
                                placeholder-white/40
                                focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        />

                        <button
                            type="submit"
                            class="mt-2 inline-flex items-center justify-center gap-2
                                rounded-md px-4 py-2
                                bg-cyan-600 hover:bg-cyan-500
                                text-white font-semibold
                                transition-colors
                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400"
                        >
                            <span aria-hidden="true">✉️</span>
                            Send Request
                        </button>
                    </form>
                </div>
            </section>


		<!-- MATCH HISTORY -->
		<div id="match-history" class="mt-12 w-full max-w-4xl flex flex-col space-y-3 font-mono">
		</div>
	</div>
	`;

	// Load user stats
	getUserProfile().then(user => {
		console.log("server response:", user);
		const usernameElem = div.querySelector('h1');
		const bioElem = div.querySelector('p');
		if (usernameElem) usernameElem.textContent = user.username;
		if (bioElem) bioElem.textContent = user.bio || "This user has no bio.";

		// Update avatar
		const avatarImg = div.querySelector('img');
		if (avatarImg) avatarImg.src = user.avatarUrl || generateInitialsAvatar(user.name, user.surname) || "";

		// Update stats
		const statsDiv = div.querySelector('#userStats');
		if (statsDiv) {
			statsDiv.innerHTML = /* html */ `
			<h2 class="text-2xl font-bold text-white mb-2 text-center">User Statistics</h2>
			<div class="flex flex-row space-x-6 justify-center">
				<p class="text-white/70">Games Played: ${user.wins + user.losses}</p>
				<p class="text-white/70">Wins: ${user.wins}</p>
				<p class="text-white/70">Losses: ${user.losses}</p>
			</div>
			<div class="flex flex-row space-x-6 justify-center">
				<!-- here will be displayed some graphs -->
				<div class="rounded-lg p-4">
					${createDonutChart(user.wins, user.losses, "Games W/L").outerHTML}
				</div>
				<div class="rounded-lg p-4">
					${createDonutChart(user.tournamentWins, user.tournamentLosses, "Tournament W/L").outerHTML}
				</div>
			</div>
			`;
		}
	}).catch(error => {
		console.error("Error loading user profile:", error);
	});
	
	getUserGames().then(games => {
		console.log("game response:", games);

		const history = div.querySelector('#match-history');
		if (!history) throw Error("History div not found");

		// loops through games and adds them
		for (const g of games.reverse()/* .history */) {
			history.appendChild(createHistoryBar(g));
		}
	}).catch(error => {
		console.error("Error loading user profile:", error);
	});

	
	// AGGIUNGI LA BAR DEGLI AMICI
	document.body.appendChild(createFriendsBar());



	/* -------------------------------- */
	/*          FRIEND REQUEST          */

	// friend request btn
	const freqform = div.querySelector("#friend-request-form") as HTMLFormElement;
	freqform.addEventListener("submit", (event) => {
		event.preventDefault(); // stop page reload

		// get the username
		const form = event.currentTarget as HTMLFormElement;
		const data = new FormData(form);

		const username = data.get("username");

		if (typeof username !== "string" || username.trim() === "") {
			console.error("Invalid username");
			return;
		}


		// send the request to the backend
		try{
			sendPostRequest(`${BACKEND_APIS_URL}/friend-request`, {
				target: username
			}, 'application/json')
			.then(() => {
				// update the UI
				window.dispatchEvent(
					new CustomEvent('update:friends', { bubbles: true })
				);
			});
		} catch (err) {
			console.log('Erro while trying to friend request', err);
		}
	});


	return div;
}

interface UserProfile {
	id: number;
	email: string;
	username: string;
	name: string;
	surname: string;
	wins: number;
	losses: number;
	tournamentWins: number;
	tournamentLosses: number;
	bio: string | null;
	avatarUrl: string | null;
}

export async function getUserProfile(): Promise<UserProfile> {
	/* ----- get username (todo better) ----- */
	const user = localStorage.getItem('user');
	if (!user) {
		throw new Error('No authentication token found');
	}
	const { username } = JSON.parse(user);
	/* --------------------------------- */

	const profileResponse = await sendGetRequest(`http://localhost:3029/api/user?username=${username}`);
	// const authResponse = await sendGetRequest(`http://localhost:3001/api/profile`, token);
	const butlerResponse = await sendGetRequest(`http://localhost:3029/api/profile?username=${username}`);
	return {
		id: profileResponse.id,
		email: butlerResponse.email,
		username: profileResponse.username,
		name: butlerResponse.name,
		surname: butlerResponse.surname,
		wins: profileResponse.wins,
		losses: profileResponse.losses,
		tournamentWins: profileResponse.tournamentWins,
		tournamentLosses: profileResponse.tournamentLosses,
		bio: butlerResponse.bio,
		avatarUrl: profileResponse.avatarUrl
	};
}

export function createDonutChart(wins: number, losses: number, text:string): HTMLElement {
	const total = wins + losses;
	let winPercentage = (wins / total) * 100;
	if (winPercentage != winPercentage) winPercentage = 0; // NaN check

	// SVG circle calculations
	const radius = 60;
	const circumference = 2 * Math.PI * radius;
	const winOffset = circumference - (winPercentage / 100) * circumference;

	const chart = document.createElement('div');
	// make the background transparent
	chart.className = 'relative w-48 h-48';
	chart.innerHTML = /* html */ `
	<svg class="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
		<!-- Background circle -->
		<circle
		cx="80"
		cy="80"
		r="${radius}"
		fill="none"
		stroke="rgba(239, 68, 68, 0.8)"
		stroke-width="20"
		/>
		
		<!-- Win percentage circle -->
		<circle
		cx="80"
		cy="80"
		r="${radius}"
		fill="none"
		stroke="rgba(34, 197, 94, 0.8)"
		stroke-width="20"
		stroke-dasharray="${circumference}"
		stroke-dashoffset="${winOffset}"
		class="transition-all duration-1000"
		/>
	</svg>

	<!-- Center text -->
	<div class="absolute inset-0 flex flex-col items-center justify-center">

		<div class="text-3xl font-bold text-white">${winPercentage.toFixed(0)}%</div>
		<div class="text-sm text-white/70">Win Rate</div>
	</div>
	<h2 class="text-xl font-bold text-white text-center">${text}</h2>
	`;

	return chart;
}

// @topiana- ecarbona collab
export async function getUserGames(): Promise</* { history:  */GameData[]/*  } */> {
	// const token = localStorage.getItem('authToken');
	// const linkid = localStorage.getItem('userId');

	/* ----- get username (todo better) ----- */
	const user = localStorage.getItem('user');
	if (!user) {
		throw new Error('No authentication token found');
	}
	const { username } = JSON.parse(user);
	/* --------------------------------- */


	const response = await sendGetRequest(`http://localhost:3029/api/game?username=${username}`);
	return response;
}

