import { chatService } from "@/services/chatService";

document.addEventListener('logout', () => {
	localStorage.removeItem('authToken');
	window.location.href = '/login';
});

let navbarElement: HTMLElement | null = null;
let unreadBadge: HTMLElement | null = null;
let connectionIndicator: HTMLElement | null = null;

// Update unread count badge
async function updateUnreadBadge() {
	if (!unreadBadge) return;
	
	try {
		const total = await chatService.getTotalUnreadCount();
		if (total > 0) {
			unreadBadge.textContent = total > 99 ? '99+' : total.toString();
			unreadBadge.style.display = 'flex';
		} else {
			unreadBadge.style.display = 'none';
		}
	} catch (error) {
		console.error('[Navbar] Failed to update unread badge:', error);
	}
}

// Update connection status indicator
function updateConnectionStatus() {
	if (!connectionIndicator) return;
	
	const status = chatService.getConnectionStatus();
	
	if (status === 'connected') {
		connectionIndicator.className = 'w-2 h-2 rounded-full bg-green-400 animate-pulse';
		connectionIndicator.title = 'Chat connected';
	} else if (status === 'connecting') {
		connectionIndicator.className = 'w-2 h-2 rounded-full bg-yellow-400 animate-pulse';
		connectionIndicator.title = 'Chat connecting...';
	} else {
		connectionIndicator.className = 'w-2 h-2 rounded-full bg-red-400';
		connectionIndicator.title = 'Chat disconnected';
	}
}

// Subscribe to chat events
chatService.on('unread-updated', updateUnreadBadge);
chatService.on('connected', updateConnectionStatus);
chatService.on('disconnected', updateConnectionStatus);

export function loadNavbar(): HTMLElement {
	const nav = document.createElement('nav');
	navbarElement = nav;
	
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
					<!-- Chat button with unread badge -->
					<a href="/chats" class="relative">
						<button class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-white">
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
							</svg>
						</button>
						<!-- Unread badge -->
						<span id="chatUnreadBadge" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center" style="display: none;">0</span>
						<!-- Connection status indicator -->
						<span id="connectionIndicator" class="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-gray-400" title="Chat status"></span>
					</a>
					
					<a href="/profile/me" class="text-white/70 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition">
						<button class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-white">
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
							</svg>
						</button>
					</a>
					<button class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-white" onClick="document.dispatchEvent(new Event('logout'))">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
						</svg>
					</button>
				</div>
			</div>
		</div>`;
	
	// Get references to dynamic elements
	unreadBadge = nav.querySelector('#chatUnreadBadge');
	connectionIndicator = nav.querySelector('#connectionIndicator');
	
	// Initial updates
	updateUnreadBadge();
	updateConnectionStatus();
	
	return nav;
}