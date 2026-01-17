import { loadNavbar } from "@/components/navbar";
import { sendGetRequest } from "@/services/api/sendRequests";
import { generateInitialsAvatar } from "@/components/createDefaultImage";

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
		if (avatarImg) avatarImg.src = user.avatarUrl /* || generateInitialsAvatar(user.name, user.surname) */ || "";

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
  const token = localStorage.getItem('authToken');
  const linkid = localStorage.getItem('userId');

  if (!token || !linkid) {
    throw new Error('No authentication token found');
  }

  const response = await sendGetRequest(`http://localhost:3003/api/user?linkid=${linkid}`, token);
  return response;
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
