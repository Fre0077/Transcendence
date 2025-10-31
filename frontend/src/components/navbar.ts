document.addEventListener('logout', () => {
	localStorage.removeItem('authToken');
	window.location.href = '/login';
});

export function loadNavbar(): HTMLElement {
	const nav = document.createElement('nav');
	nav.className = 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border-b border-white/10';
	nav.innerHTML = /* html */ `
		<div class="container mx-auto px-6 py-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center space-x-8">
					<a href="/" class="text-white font-bold text-xl hover:text-purple-300 transition">ft_transcendence</a>
					<div class="hidden md:flex space-x-6">
						<a href="/dashboard" class="text-white/90 hover:text-white px-4 py-2 rounded-lg bg-white/10 transition">HOME</a>
						<a href="/game" class="text-white/70 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition">PLAY</a>
						<a href="/tournaments" class="text-white/70 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition">TOURNAMENTS</a>
						<a href="/leaderboard" class="text-white/70 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition">LEADERBOARD</a>
					</div>
				</div>
				<div class="flex items-center space-x-4">
					<a href="/profile/me" class="text-white/70 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition">
						<button class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-white">
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
							</svg>
						</button>
					</a>
					<button class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-white" onClick="document.dispatchEvent(new Event('logout'))">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H9m6 0a6 6 0 01-6 6m6-6a6 6 0 00-6-6m6 6V6m0 6v6" />
						</svg>
					</button>
				</div>
			</div>
		</div>`;
	return nav;
}