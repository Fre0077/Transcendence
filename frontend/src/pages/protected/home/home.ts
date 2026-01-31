import { ChatWidget } from '@/components/chatWidget';
import { loadNavbar } from '../../../components/navbar';
import { loadHeroContent } from './heroContent';
import { toastNotification } from '@/services/toastNotification';
import { router } from "@/router";
import { isauth } from '@/services/api/isauth';


export async function loadHomePage(): Promise<HTMLElement> {

	const div = document.createElement('div');
	div.className = 'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col';
	div.innerHTML = /* html */ `
	<!-- Navigation Bar -->
	${loadNavbar().outerHTML}

	<!-- Hero Section -->
	<div id="heroDiv" class="relative w-full h-96 md:h-[500px] lg:h-[600px]" style="background-image: url('/assets/images/subaru.png'); background-size: cover; background-position: center;">
		<!-- Background Image Overlay -->
		<div class="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/50 to-slate-900"></div>

		<!-- Hero Content -->
		${loadHeroContent()}

		<!-- Global Chat Widget Placeholder -->
		<div id="chatWidgetContainer"></div>
	</div>

	<!-- Content Sections -->
	<div class="container mx-auto px-6 py-16">
		<!-- Quick Actions -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
			<a href="/game" class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 p-8 border border-white/10 hover:border-purple-400/50 transition-all hover:scale-105">
				<div class="relative z-10">
					<div class="text-4xl mb-4">🎮</div>
					<h3 class="text-2xl font-bold text-white mb-2">Quick Match</h3>
					<p class="text-white/70">Start playing instantly</p>
				</div>
				<div class="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/20 group-hover:to-pink-600/20 transition"></div>
			</a>

			<a href="/tournaments" class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-600/30 to-blue-600/30 p-8 border border-white/10 hover:border-cyan-400/50 transition-all hover:scale-105">
				<div class="relative z-10">
					<div class="text-4xl mb-4">🏆</div>
					<h3 class="text-2xl font-bold text-white mb-2">Tournaments</h3>
					<p class="text-white/70">Compete for glory</p>
				</div>
				<div class="absolute inset-0 bg-gradient-to-br from-cyan-600/0 to-blue-600/0 group-hover:from-cyan-600/20 group-hover:to-blue-600/20 transition"></div>
			</a>

			<a href="/stats" class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600/30 to-emerald-600/30 p-8 border border-white/10 hover:border-green-400/50 transition-all hover:scale-105">
				<div class="relative z-10">
					<div class="text-4xl mb-4">📊</div>
					<h3 class="text-2xl font-bold text-white mb-2">Statistics</h3>
					<p class="text-white/70">Track your progress</p>
				</div>
				<div class="absolute inset-0 bg-gradient-to-br from-green-600/0 to-emerald-600/0 group-hover:from-green-600/20 group-hover:to-emerald-600/20 transition"></div>
			</a>

			<a href="/select" class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600/30 to-emerald-600/30 p-8 border border-white/10 hover:border-green-400/50 transition-all hover:scale-105">
				<div class="relative z-10">
					<div class="text-4xl mb-4">🎮</div>
					<h3 class="text-2xl font-bold text-white mb-2">Select</h3>
					<p class="text-white/70">Track your progress</p>
				</div>
				<div class="absolute inset-0 bg-gradient-to-br from-green-600/0 to-emerald-600/0 group-hover:from-green-600/20 group-hover:to-emerald-600/20 transition"></div>
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
	`;

	// Load chat widget asynchronously
	const chatWidget = await new ChatWidget().loadChatWidget();
	const chatWidgetContainer = div.querySelector('#chatWidgetContainer');
	if (chatWidgetContainer) {
		chatWidgetContainer.replaceWith(chatWidget);
	}

	async function checkAuthAndPlay(event: MouseEvent) {
        event.preventDefault();
        // console.log("Controllo autorizzazione per giocare...");

        try {
            const isAuthenticated = await isauth();

			if (!isAuthenticated) {
                throw new Error("Sessione non valida");
			}

            // === SUCCESSO ===
            // console.log("Autorizzazione confermata! Avvio del gioco...");
            router.push('/game'); // Reindirizza alla pagina di gioco

        } catch (error) {
            // === FALLIMENTO ===
            console.error("Autorizzazione fallita:", error);
            alert("La tua sessione è scaduta o non è valida. Effettua nuovamente il login.");
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            router.push('/login');
        }
    }

    const heroPlayButton = div.querySelector<HTMLElement>('#hero-play-button');
    if (heroPlayButton) {
        heroPlayButton.addEventListener('click', checkAuthAndPlay);
    }

	return div;
}
