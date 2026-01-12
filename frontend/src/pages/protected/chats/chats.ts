import { loadNavbar } from "@/components/navbar";

interface chatList {
	name: string;
	toRead: number;
	lastMessage: string;
}

interface Message {
	sender: string;
	content: string;
	timestamp: string;
}

interface chatMessages {
	chatName: string;
	messages: Message[];
}

var defChatList: chatList[] = [
	{
		name: "lmicheli",
		toRead: 2,
		lastMessage: "Yes, see you at 2 PM."
	},
	{
		name: "glancell",
		toRead: 5,
		lastMessage: "Don't forget our meeting tomorrow."
	},
	{
		name: "fde-sant",
		toRead: 1,
		lastMessage: "Happy Birthday!"
	}
]

var defChatMessages: chatMessages =
{
	chatName: "lmicheli",
	messages: [
		{ sender: "you", content: "Hey, are we still on for the meeting?", timestamp: "10:30 AM" },
		{ sender: "lmicheli", content: "Yes, see you at 2 PM.", timestamp: "10:32 AM" }
	]
}

export class ChatsPage {

	chatList: chatList[];
	chatMessages: chatMessages;

	constructor (chatList?: chatList[]) {
		this.chatList = chatList || defChatList;
		this.chatMessages = defChatMessages;
	}

	loadChatsPage() {
		const div = document.createElement('div');
		div.className = 'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col';
		div.innerHTML = /* html */ `
			${loadNavbar().outerHTML}

			<div class="flex-1 container mx-auto px-6 py-8">
				<h1 class="text-3xl font-bold text-white mb-6">Chats</h1>
				<div class="bg-white/5 border border-white/10 rounded-xl p-6 text-white flex flex-row">
					<div id="chatList" class="">
						${this.chatList.map(chat => `
							<div class="mt-1 p-4 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between">
								<div>
									<div class="font-medium">${chat.name}</div>
									<div class="text-white/70 text-sm">${chat.lastMessage}</div>
								</div>
								${chat.toRead > 0 ? `<div class="bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded-full">${chat.toRead}</div>` : ''}
							</div>
						`).join('')}
					</div>
					<div id="chatDisplay" class="ml-4 flex-grow">
						<div id="chatMessages" class="h-64 overflow-y-auto mb-4 p-4 bg-white/5 border border-white/10 rounded-lg">
							${this.chatMessages.messages.map(msg => `
								<div class="mb-2">
									<span class="font-semibold">${msg.sender}</span>: ${msg.content} <span class="text-white/70 text-sm">${msg.timestamp}</span>
								</div>
							`).join('')}
						</div>
						<form id="chatForm" class="flex">
							<input
								type="text"
								id="chatInput"
								placeholder="Type your message..."
								class="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition"
								required
							/>
							<button
								type="submit"
								class="ml-1 px-3 py-1 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:ring-offset-2 focus:ring-offset-slate-900 transition"
							>
								<img src="/assets/icons/send.svg" alt="Send" class="w-7 h-7" />
							</button>
						</form>
					</div>
				</div>
			</div>
		`;

		const chatForm = div.querySelector('#chatForm') as HTMLFormElement;
		const chatInput = div.querySelector('#chatInput') as HTMLInputElement;

		chatForm.addEventListener('submit', (event) => {
			event.preventDefault();
			const message = chatInput.value.trim();
			if (!message) return;
			window.dispatchEvent(new CustomEvent('sendMessage', { detail: { message } }));
			chatInput.value = '';
		});

		window.addEventListener('sendMessage', (e: any) => {
			const newMessageContent = e.detail.message;
			const newMessage: Message = {
				sender: "you",
				content: newMessageContent,
				timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
			};
			this.chatMessages.messages.push(newMessage);

			const chatMessagesDiv = div.querySelector('#chatMessages') as HTMLElement;
			const messageDiv = document.createElement('div');
			messageDiv.className = 'mb-2';
			messageDiv.innerHTML = `<span class="font-semibold">${newMessage.sender}</span>: ${newMessage.content} <span class="text-white/70 text-sm">${newMessage.timestamp}</span>`;
			chatMessagesDiv.appendChild(messageDiv);
			chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
		});

		return div;
	}
}