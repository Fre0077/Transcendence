import { loadNavbar } from "@/components/navbar";


export function loadProfilePage(): HTMLElement {
	const div = document.createElement('div');
	div.className = 'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col';
	div.innerHTML = `
	${loadNavbar().outerHTML}

	<div class="flex items-center flex-grow flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
		<div class="text-center flex flex-row flex-grow items-center">
			<img src="https://i.pravatar.cc/150?img=1" alt="Under Construction" class="w-32 h-32 mb-6 rounded-full" />
			<div class="ml-8 text-left">
				<h1 class="text-4xl font-bold text-white mb-4">Username</h1>
				<p class="text-white/70 mb-6">Brief description about the user.</p>
			</div>
		</div>
		<div id="userStats" class="ml-8 text-left flex-grow">
			<h2 class="text-2xl font-bold text-white mb-2 text-center">User Statistics</h2>
			<div class="flex flex-row space-x-6 justify-center">
				<p class="text-white/70">Games Played: 100</p>
				<p class="text-white/70">Wins: 75</p>
				<p class="text-white/70">Losses: 25</p>
			</div>
			<div class="flex flex-row space-x-6 justify-center">
				<!-- here will be displayed some graphs -->
				<div class="rounded-lg p-4">
					${createDonutChart(200, 45, "Games W/L").outerHTML}
				</div>
				<div class="rounded-lg p-4">
					${createDonutChart(23, 13, "Tournament W/L").outerHTML}
				</div>
			</div>
		</div>
	</div>
	`;
	return div;
}

export function createDonutChart(wins: number, losses: number, text:string): HTMLElement {
	const total = wins + losses;
	const winPercentage = (wins / total) * 100;

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