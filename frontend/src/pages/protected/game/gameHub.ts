import { loadNavbar } from "@/components/navbar";


export function loadGameHub(): HTMLElement {
	const div = document.createElement('div');
	div.className = 'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col';
	div.innerHTML = /* html */`
	${loadNavbar().outerHTML}

	<!-- Game Page Content -->
	<div class="flex-1 container mx-auto px-6 py-16 flex flex-col items-center justify-center">
		<h1 class="text-4xl font-bold text-white mb-8">Choose Your Game</h1>
		<p class="text-white/70 mb-12">Select a game mode to start playing!</p>

		<div class="flex flex-row gap-8 w-full max-w-4xl items-center justify-center">
			<a href="/game/local" class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 p-8 border border-white/10 hover:border-purple-400/50 transition-all hover:scale-105">
				<div class="relative z-10">
					<div class="text-6xl mb-4">🕹️</div>
					<h3 class="text-2xl font-bold text-white mb-2">Local Match</h3>
					<p class="text-white/70">Play against friends locally</p>
				</div>
				<div class="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/20 group-hover:to-pink-600/20 transition"></div>
			</a>

			<a href="/tournament/local" class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 p-8 border border-white/10 hover:border-purple-400/50 transition-all hover:scale-105">
				<div class="relative z-10">
					<div class="text-6xl mb-4">🕹️</div>
					<h3 class="text-2xl font-bold text-white mb-2">Local Tournament</h3>
					<p class="text-white/70">Play against friends locally</p>
				</div>
				<div class="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/20 group-hover:to-pink-600/20 transition"></div>
			</a>

			<a href="/lobby/online" class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-600/30 to-blue-600/30 p-8 border border-white/10 hover:border-cyan-400/50 transition-all hover:scale-105">
				<div class="relative z-10">
					<div class="text-6xl mb-4">🎮</div>
					<h3 class="text-2xl font-bold text-white mb-2">Online Game</h3>
					<p class="text-white/70">Create or join an online game</p>
				</div>
				<div class="absolute inset-0 bg-gradient-to-br from-cyan-600/0 to-blue-600/0 group-hover:from-cyan-600/20 group-hover:to-blue-600/20 transition"></div>
			</a>
		</div>
	</div>
	`;
	return div;
}
