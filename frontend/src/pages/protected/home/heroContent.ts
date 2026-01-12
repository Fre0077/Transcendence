export function loadHeroContent(): string {
	return /* html */ `
		<div class="relative container px-6 py-24">
			<div class="max-w-4xl mx-auto text-center">
				<h1 class="text-6xl font-bold text-white mb-4 tracking-tight">
					THE TRANSCENDENCE
					<span class="block text-4xl mt-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">PONG PROJECT</span>
				</h1>
				<p class="text-xl text-white/80 mb-8">Ascend to New Realms</p>
				
				<a id="hero-play-button" style="cursor: pointer;" class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all transform hover:scale-110 shadow-lg shadow-cyan-500/50">
					<svg class="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
						<path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
					</svg>
				</a>
			</div>
		</div>
	`;
}
