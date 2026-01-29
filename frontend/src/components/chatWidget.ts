import { chatService } from "@/services/chatService";
import type { Chat } from "@/services/storage/chatStorage";

interface RecentChat {
	chatId: number;
	chatName: string;
	lastMessage: string;
	unreadCount: number;
}

export class ChatWidget {
	private recentChats: RecentChat[] = [];
	private totalUnread: number = 0;
	private widgetElement: HTMLElement | null = null;
	
	// Event listeners
	private updateListener: any;
	private unreadListener: any;

	constructor() {
		this.updateListener = this.handleUpdate.bind(this);
		this.unreadListener = this.handleUnreadUpdate.bind(this);
	}

	async loadChatWidget(): Promise<HTMLElement> {
		const chatWidget = document.createElement('div');
		this.widgetElement = chatWidget;
		
		chatWidget.className = 'fixed top-20 right-6 w-80 bg-slate-800/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-40';
		chatWidget.id = 'ChatWidget';
		
		// Load initial data
		await this.loadData();
		
		// Subscribe to updates
		chatService.on('chats-updated', this.updateListener);
		chatService.on('unread-updated', this.unreadListener);
		
		this.render(chatWidget);
		
		return chatWidget;
	}

	private async loadData() {
		try {
			// Get all chats and sort by last message
			const allChats = await chatService.getChats();
			const unreadCounts = await chatService.getAllUnreadCounts();
			
			// Take top 5 most recent chats
			this.recentChats = allChats.slice(0, 5).map(chat => ({
				chatId: chat.chatId,
				chatName: chat.name,
				lastMessage: chat.lastMessage || 'No messages',
				unreadCount: unreadCounts.get(chat.chatId) || 0
			}));
			
			this.totalUnread = await chatService.getTotalUnreadCount();
		} catch (error) {
			console.error('[ChatWidget] Failed to load data:', error);
		}
	}

	private handleUpdate() {
		this.loadData().then(() => {
			if (this.widgetElement) {
				this.render(this.widgetElement);
			}
		});
	}

	private handleUnreadUpdate() {
		this.loadData().then(() => {
			if (this.widgetElement) {
				this.render(this.widgetElement);
			}
		});
	}

	private render(chatWidget: HTMLElement) {
		chatWidget.innerHTML = /* html */ `
			<div class="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-600/50 to-pink-600/50 border-b border-white/10">
				<a href="/chats" data-link class="text-sm flex items-center gap-2">
					<h3 class="text-white font-semibold">CHATS</h3>
					${this.totalUnread > 0 ? `<span class="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">${this.totalUnread}</span>` : ''}
				</a>
				<button id="closeChatWidget" class="text-white/70 hover:text-white transition text-2xl leading-none" title="Close">×</button>
			</div>
			<div class="max-h-80 overflow-y-auto">
				${this.recentChats.length === 0 ? `
					<div class="p-6 text-center text-white/50 text-sm">
						No recent chats
					</div>
				` : this.recentChats.map(chat => `
					<a 
						href="/chats?chat=${chat.chatId}" 
						data-link
						class="flex items-start gap-3 p-4 hover:bg-white/5 transition border-b border-white/5 cursor-pointer"
					>
						<div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0">
							${chat.chatName.charAt(0).toUpperCase()}
						</div>
						<div class="flex-1 min-w-0">
							<div class="flex items-center justify-between mb-1">
								<div class="text-white font-medium text-sm truncate">${this.escapeHtml(chat.chatName)}</div>
								${chat.unreadCount > 0 ? `
									<span class="bg-purple-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full ml-2">${chat.unreadCount}</span>
								` : ''}
							</div>
							<div class="text-white/60 text-xs truncate">${this.escapeHtml(chat.lastMessage)}</div>
						</div>
					</a>
				`).join('')}
			</div>
			<div class="p-3 border-t border-white/10 bg-slate-900/50">
				<a 
					href="/chats" 
					data-link
					class="block text-center text-sm text-purple-400 hover:text-purple-300 transition font-medium"
				>
					View All Chats →
				</a>
			</div>
		`;

		// Add close handler
		const closeBtn = chatWidget.querySelector('#closeChatWidget');
		closeBtn?.addEventListener('click', () => {
			this.destroy();
			chatWidget.remove();
		});
	}

	private escapeHtml(text: string): string {
		const div = document.createElement('div');
		div.textContent = text;
		return div.innerHTML;
	}

	destroy() {
		// Unsubscribe from events
		chatService.off('chats-updated', this.updateListener);
		chatService.off('unread-updated', this.unreadListener);
		this.widgetElement = null;
	}
}