var defaultMessages = [
	{ username: 'Player_42', message: 'Ready for a match!', icon: 'https://i.pravatar.cc/150?img=1' },
	{ username: 'PongMaster', message: 'GG everyone', icon: 'https://i.pravatar.cc/150?img=2' },
	{ username: 'AcePlayer', message: 'Tournament starts soon!', icon: 'https://i.pravatar.cc/150?img=3' },
];
interface ChatMessage {
	username: string;
	message: string;
	icon: string;
}

export class ChatWidget {
	messages: ChatMessage[];

	constructor( messages?: ChatMessage[]) {
		this.messages = messages || defaultMessages;
	}

	loadChatWidget(): HTMLElement {
		const chatWidget = document.createElement('div');
		chatWidget.className = 'absolute top-6 right-6 w-80 bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/10 overflow-hidden';
		chatWidget.id = 'ChatWidget';
		chatWidget.innerHTML = /* html */ `
			<div class="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-600/50 to-pink-600/50 border-b border-white/10">
				<a href="/chats" data-link class="text-sm">
					<h3 class="text-white font-semibold">CHATS</h3>
				</a>
				<button class="text-white/70 hover:text-white transition" onClick="document.getElementById('ChatWidget').remove()">×</button>
			</div>
			<div class="p-4 space-y-3 max-h-64 overflow-y-auto">
				${this.messages.map(msg => `
					<div class="flex items-center space-x-3 text-sm">
						<div class="w-8 h-8 rounded-full bg-gradient-to-br" style="background-image: url('${msg.icon}'); background-size: cover;"></div>
						<div>
							<div class="text-white/90 font-medium">${msg.username}</div>
							<div class="text-white/60 text-xs">${msg.message}</div>
						</div>
					</div>
				`).join('')}
			</div>
		`;
		return chatWidget;
	}
}