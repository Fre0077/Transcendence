import { loadNavbar } from "@/components/navbar";
import { sendGetRequest } from "@/services/api/sendRequests";
import { generateInitialsAvatar } from "@/components/createDefaultImage";

import { GameData, createHistoryBar } from "@/components/createHistoryBar";
import { createFriendsBar } from "@/components/createFriendBar";
import { sendPostRequest, sendPatchRequest } from "@/services/api/sendRequests";
import { router } from "@/router";

let mainUsername:string = '';

export function loadProfilePage(): HTMLElement {

	const params = router.getParams();
	mainUsername = params.username
	console.log('params', mainUsername);


	const div = document.createElement('div');
	div.className = 'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col';
	div.innerHTML = /* html */ `
	${loadNavbar().outerHTML}

	<div class="flex items-center flex-grow flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
		<!-- this div will only expand vertically -->
		<div class="flex flex-row space-x-8 mt-12 p-8 bg-slate-800/70 backdrop-blur-sm rounded-lg max-w-4xl w-full">
			<button
				id="edit-profile-btn"
				class="absolute top-4 left-4 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg text-sm">
				✏️ Edit
			</button>
			<div class="text-center flex flex-row flex-grow items-center">
				<div class="relative w-32 h-32 mb-6">
					<img
						id="avatar-img"
						class="w-32 h-32 rounded-full select-none"
						draggable="false"
						style="-webkit-user-drag: none; user-select: none;"
						src="https://i.pravatar.cc/150?img=1"
						alt="Avatar"
					/>

					<!-- Pallino -->
					<button
						id="change-avatar-btn"
						title="Change avatar"
						class="absolute bottom-1 right-1 w-8 h-8
							rounded-full bg-cyan-600 hover:bg-cyan-500
							border-2 border-slate-900
							flex items-center justify-center
							text-white text-sm
							transition-transform hover:scale-110"
					>
						✏️
					</button>
					<input id="avatar-file-input" type="file" accept="image/*" class="hidden"/>
				</div>
				<div class="ml-8 text-left flex-grow">
					<div class="flex items-center justify-between mb-4">
						<h1 class="text-4xl font-bold text-white">Username</h1>
						<a href="/settings/2fa" class="ml-4 p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all" title="Security Settings">
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
							</svg>
						</a>
					</div>
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

		<br>

		<!-- EDIT PROFILE -->
		<div id="edit-profile-modal"
			class="fixed inset-0 hidden items-center justify-center bg-black/60 z-50">

			<div class="bg-slate-900 p-6 rounded-xl w-full max-w-md text-white">
				<h2 class="text-xl font-bold mb-4">Edit profile</h2>

				<form id="edit-profile-form" class="space-y-3">
					<input name="name" class="w-full p-2 rounded bg-slate-800" placeholder="Name">
					<input name="surname" class="w-full p-2 rounded bg-slate-800" placeholder="Surname">
					<input name="username" class="w-full p-2 rounded bg-slate-800" placeholder="Username">
					<textarea name="bio" class="w-full p-2 rounded bg-slate-800" placeholder="Bio"></textarea>

					<div class="flex justify-end gap-2">
						<button type="button" id="close-edit-modal"
							class="px-4 py-2 bg-slate-700 rounded">Cancel</button>
						<button type="submit"
							class="px-4 py-2 bg-cyan-600 rounded">Save</button>
					</div>
				</form>
			</div>
		</div>
	</div>
	`;

	let currentUser: UserProfile;

	getUserProfile().then(user => {
		console.log("server response:", user);
		currentUser = user;
		const usernameElem = div.querySelector('h1');
		const bioElem = div.querySelector('p');
		if (usernameElem) usernameElem.textContent = user.username;
		if (bioElem) bioElem.textContent = user.bio || "This user has no bio.";

		// Update avatar
		const avatarImg = div.querySelector('img');
		if (avatarImg) avatarImg.src = user.avatarUrl || generateInitialsAvatar(user.username) || "";

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
	if (!document.getElementById("FriendBar"))
		document.body.appendChild(createFriendsBar());

	// EDIT PROFILE BTN
	const editBtn = div.querySelector('#edit-profile-btn') as HTMLButtonElement;
	const modal = div.querySelector('#edit-profile-modal') as HTMLDivElement;
	const closeBtn = div.querySelector('#close-edit-modal') as HTMLButtonElement;
	const form = div.querySelector('#edit-profile-form') as HTMLFormElement;
	
	// EDIT AVATAR BTN
	const changeAvatarBtn = div.querySelector('#change-avatar-btn') as HTMLButtonElement;
	const avatarFileInput = div.querySelector('#avatar-file-input') as HTMLInputElement;
	const avatarImgElement = div.querySelector('#avatar-img') as HTMLImageElement;

	try {
		editBtn.addEventListener('click', () => {
			modal.classList.remove('hidden');
			modal.classList.add('flex');
	
			form.name.value = currentUser.name;
			form.surname.value = currentUser.surname;
			form.username.value = currentUser.username;
			form.bio.value = currentUser.bio ?? '';
		});
	
		closeBtn.addEventListener('click', () => {
			modal.classList.add('hidden');
			modal.classList.remove('flex');
		});
	
		form.addEventListener('submit', async (e) => {
			e.preventDefault();
	
			const data = Object.fromEntries(new FormData(form).entries());

			const updated = await sendPatchRequest(`/api/profile`, data);
	
			if (currentUser.username !== updated.username) {
				// delete all cookies

				// send to login
				router.push('/logout');
			}
			else
				// reaload
				router.push('/profile/me');
		});

		changeAvatarBtn?.addEventListener('click', () => {
			avatarFileInput.click();
		});

		avatarFileInput?.addEventListener('change', async () => {
			const file = avatarFileInput.files?.[0];
			if (!file) return;
			const formData = new FormData();
			console.log('formData', formData);
			formData.append('file', file);
			const response = await fetch('/api/profile/avatar', {
				method: 'POST',
				credentials: 'include',
				body: formData
			});
			if (response.ok) {
				const data = await response.json();
				// 3. Aggiorniamo l'immagine nella UI
				if (data.avatarUrl) {
					avatarImgElement.src = data.avatarUrl;
					console.log("Avatar aggiornato con successo!");
				}
			} else {
				const errorData = await response.json();
				console.error("Errore durante l'upload:", errorData.error);
				alert("Errore nel caricamento dell'immagine.");
			}
		});
	} catch (err) {
		console.log('Erro while trying to update profile', err);
	}

	/* -------------------------------- */
	/*          FRIEND REQUEST          */

	const friendCard = div.querySelector("#friend-request-card") as HTMLElement;

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
			sendPostRequest(`/api/friend-request`, {
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

	// MYSELF or NOT logic
	if (mainUsername !== 'me'){
		editBtn.classList.add('hidden');
		friendCard.classList.add('hidden');
		changeAvatarBtn.classList.add('hidden');
	}
	return div;
}

interface UserProfile {
	id: number;
	email?: string;
	username: string;
	name?: string;
	surname?: string;
	wins: number;
	losses: number;
	tournamentWins: number;
	tournamentLosses: number;
	bio: string | null;
	avatarUrl: string | null;
}

export async function getUserProfile(): Promise<UserProfile> {
	/* ----- get username (todo better) ----- */
	let username;
	if (mainUsername === 'me') {
		const user = await sendGetRequest(`/api/isauth`);
		if (user.ok === false) {
			throw new Error('No authentication token found');
		}
		username = user.user.username;
		if (!username) throw new Error('username not found')
	}
	else
		username = mainUsername;

	/* --------------------------------- */
	const profileResponse = await sendGetRequest(`/api/user?username=${username}`);
	const butlerResponse = await sendGetRequest(`/api/profile?username=${username}`);
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
	let username;
	if (mainUsername === 'me') {
		const user = await sendGetRequest(`/api/isauth`);
		if (user.ok === false) {
			throw new Error('No authentication token found');
		}
		console.log('got cookie from butler', user);
		username = user.user.username;
		if (!username) throw new Error('username not found')
	}
	else
		username = mainUsername;
	/* --------------------------------- */


	const response = await sendGetRequest(`/api/game?username=${username}`);
	return response;
}

