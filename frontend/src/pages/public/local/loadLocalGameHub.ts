
export function loadLocalGameHub(): HTMLElement
{
	const div = document.createElement('div');
	div.className = 'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col';
	div.innerHTML = /* html */`

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
					<div class="text-6xl mb-4">👑</div>
					<h3 class="text-2xl font-bold text-white mb-2">Local Tournament</h3>
					<p class="text-white/70">Play against friends locally</p>
				</div>
				<div class="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/20 group-hover:to-pink-600/20 transition"></div>
			</a>

		</div>
		<!-- Rules and Controls Section -->
		<div class="mt-16 text-center">
			<h2 class="text-4xl font-bold text-white mb-8">Pong Rules & Controls</h2>
			<div class="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 text-left">

				<!-- Rules Card -->
				<div class="bg-slate-800/50 border border-white/10 rounded-2xl p-8">
					<h3 class="text-2xl font-bold text-white mb-4">Rules</h3>
					<p class="text-white/70 leading-relaxed">
						The game is played with two paddles, one on each side of the screen. The objective is to hit the ball with your paddle and make your opponent miss it. The first player to score 11 points wins the game.
					</p>
				</div>

				<!-- Controls Card -->
				<div class="bg-slate-800/50 border border-white/10 rounded-2xl p-8">
					<h3 class="text-2xl font-bold text-white mb-4">Controls</h3>
					<div class="space-y-4">
						<div>
							<h4 class="font-semibold text-white">Local Game</h4>
							<p class="text-white/70">Player 1: <kbd class="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">W</kbd> and <kbd class="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">S</kbd></p>
							<p class="text-white/70">Player 2: <kbd class="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">↑</kbd> and <kbd class="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">↓</kbd></p>
						</div>
						<div>
							<h4 class="font-semibold text-white">Online Game</h4>
							<p class="text-white/70">Use either <kbd class="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">W</kbd>/<kbd class="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">S</kbd> or <kbd class="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">↑</kbd>/<kbd class="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">↓</kbd></p>
						</div>
						<div>
							<h4 class="font-semibold text-white">Start Round</h4>
							<p class="text-white/70">Press <kbd class="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Space</kbd> to start the round in any game mode.</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	`;
	return div;
}
