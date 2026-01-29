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
		<!-- Section Tabs
		<div class="flex justify-center space-x-8 mb-12">
			<button class="text-white text-lg font-semibold pb-2 border-b-2 border-purple-400">POPULAR THIS WEEK</button>
			<button class="text-white/60 hover:text-white text-lg font-semibold pb-2 border-b-2 border-transparent hover:border-white/30 transition">NEWLY ADDED</button>
			<button class="text-white/60 hover:text-white text-lg font-semibold pb-2 border-b-2 border-transparent hover:border-white/30 transition">RECOMMENDED FOR YOU</button>
		</div>

		Players Grid
		<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 gap-6 mb-16">
			${generatePlayerCards()}
		</div> -->

		<!-- Quick Actions -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
			<!-- Test Notifications Button -->
			<button id="test-toast-btn" class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-600/30 to-yellow-600/30 p-8 border border-white/10 hover:border-orange-400/50 transition-all hover:scale-105">
				<div class="relative z-10">
					<div class="text-4xl mb-4">🔔</div>
					<h3 class="text-2xl font-bold text-white mb-2">Test Notifications</h3>
					<p class="text-white/70">Click to see toast demos</p>
				</div>
				<div class="absolute inset-0 bg-gradient-to-br from-orange-600/0 to-yellow-600/0 group-hover:from-orange-600/20 group-hover:to-yellow-600/20 transition"></div>
			</button>

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
		</div>
	</div>
	`;

	// Generate player cards function
	function generatePlayerCards() {
		const players = [
			{ name: 'Pong Master', rank: 'Diamond', color: 'from-purple-400 to-pink-400' },
			{ name: 'Speed Demon', rank: 'Platinum', color: 'from-blue-400 to-cyan-400' },
			{ name: 'Ball Wizard', rank: 'Gold', color: 'from-yellow-400 to-orange-400' },
			{ name: 'Paddle Pro', rank: 'Silver', color: 'from-gray-400 to-slate-400' },
			{ name: 'Court King', rank: 'Diamond', color: 'from-green-400 to-emerald-400' },
			{ name: 'Ace Player', rank: 'Platinum', color: 'from-red-400 to-pink-400' },
			{ name: 'Net Ninja', rank: 'Gold', color: 'from-indigo-400 to-purple-400' },
			{ name: 'Rally Master', rank: 'Diamond', color: 'from-cyan-400 to-blue-400' },
			{ name: 'Bounce Boss', rank: 'Platinum', color: 'from-orange-400 to-red-400' },
		];

		return players.map(player => `
			<a href="/profile/${player.name}" class="group flex flex-col items-center">
				<div class="w-24 h-24 rounded-full bg-gradient-to-br ${player.color} mb-3 ring-4 ring-white/10 group-hover:ring-white/30 transition-all transform group-hover:scale-110 shadow-lg"></div>
				<h3 class="text-white font-semibold text-sm text-center group-hover:text-purple-300 transition">${player.name}</h3>
				<p class="text-white/60 text-xs">${player.rank}</p>
			</a>
		`).join('');
	}

	// Load chat widget asynchronously
	const chatWidget = await new ChatWidget().loadChatWidget();
	const chatWidgetContainer = div.querySelector('#chatWidgetContainer');
	if (chatWidgetContainer) {
		chatWidgetContainer.replaceWith(chatWidget);
	}

	async function checkAuthAndPlay(event: MouseEvent) {
        event.preventDefault(); 
        console.log("Controllo autorizzazione per giocare...");

        try {
            const isAuthenticated = await isauth();

			if (!isAuthenticated) {
                throw new Error("Sessione non valida");
			}

            // === SUCCESSO ===
            console.log("Autorizzazione confermata! Avvio del gioco...");
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

	// Test toast notifications button
	const testToastBtn = div.querySelector('#test-toast-btn');
	if (testToastBtn) {
		testToastBtn.addEventListener('click', () => {
			// Show different types of notifications
			toastNotification.success('Success!', 'Your action was completed successfully.', 5000);
			
			setTimeout(() => {
				toastNotification.info('Info', 'This is an informational message.', 5000);
			}, 500);
			
			setTimeout(() => {
				toastNotification.warning('Warning', 'Please be careful with this action.', 5000);
			}, 1000);
			
			setTimeout(() => {
				toastNotification.message(
					'New Message 💬', 
					'John Doe: Hey, want to play a match?',
					() => {
						alert('Navigating to chat...');
					},
					5000
				);
			}, 1500);

			setTimeout(() => {
				toastNotification.friend(
					'Friend Request',
					'Diventiamo amici?',
					() => { alert('Div cliccato');},
					() => { alert('Accept cliccato');},
					() => { alert('Decline cliccato');},
					5000
				);
			}, 1500)
		});
	}

	return div;
}
