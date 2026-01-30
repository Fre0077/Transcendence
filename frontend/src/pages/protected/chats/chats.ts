import { loadNavbar } from "@/components/navbar";
import { chatService } from "@/services/chatService";
import { loadStoredSession } from "@/services/session";
import type { Chat, Message } from "@/services/storage/chatStorage";
import {
	createNewChatModal,
	openNewChatModal,
} from "@/components/newChatModal";
import {
	createBlockUserModal,
	openBlockUserModal,
} from "@/components/blockUserModal";
import {
	createChatInfoModal,
	openChatInfoModal,
} from "@/components/chatInfoModal";

interface DisplayMessage {
	sender: string;
	content: string;
	timestamp: string;
	userId: number;
	date: Date;
}

export class ChatsPage {
	private chats: Chat[] = [];
	private currentChat: Chat | null = null;
	private messages: DisplayMessage[] = [];
	private currentUserId: number | null = null;
	private unreadCounts: Map<number, number> = new Map();

	private rootElement: HTMLElement | null = null;

	// Event listener references for cleanup
	private chatUpdateListener: any;
	private messageListener: any;
	private unreadListener: any;

	constructor() {
		const session = loadStoredSession();
		this.currentUserId = session.userId;

		// Bind event listeners
		this.chatUpdateListener = this.handleChatsUpdated.bind(this);
		this.messageListener = this.handleMessageReceived.bind(this);
		this.unreadListener = this.handleUnreadUpdated.bind(this);
	}

	async loadChatsPage() {
		const div = document.createElement("div");
		this.rootElement = div;
		div.className =
			"min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col";
		div.innerHTML = /* html */ `
			${loadNavbar().outerHTML}

			<div class="flex-1 container mx-auto px-6 py-8">
				<div class="flex justify-between items-center mb-6">
					<h1 class="text-3xl font-bold text-white">Chats</h1>
					<div class="flex items-center gap-4">
						<button
							id="manageBlockedBtn"
							class="px-4 py-2 rounded-lg font-semibold text-white bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400/50 transition"
							title="Manage blocked users"
						>
							🚫 Blocked Users
						</button>
						<button
							id="newChatBtn"
							class="px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition"
						>
							+ New Chat
						</button>
						<div id="connectionStatus" class="px-3 py-1 rounded-full text-sm font-semibold">
							<span id="statusText">Connecting...</span>
						</div>
					</div>
				</div>
				<div class="bg-white/5 border border-white/10 rounded-xl p-6 text-white flex flex-row gap-4" style="height: calc(100vh - 200px);">
					<!-- Chat List -->
					<div id="chatList" class="w-80 flex flex-col overflow-y-auto pr-2" style="max-height: 100%;">
						<div class="text-white/50 text-center py-8">Loading chats...</div>
					</div>
					
					<!-- Chat Display -->
					<div id="chatDisplay" class="flex-1 flex flex-col">
						<div id="chatHeader" class="mb-4 pb-3 border-b border-white/10 flex justify-between items-center">
							<div class="text-white/50 text-center flex-1 py-4">
								<div class="text-6xl mb-4">💬</div>
								<div class="text-xl font-semibold text-white mb-2">No Chat Selected</div>
								<div class="text-sm">Choose a chat from the list or start a new conversation</div>
							</div>
						</div>
						<div id="chatMessages" class="flex-1 overflow-y-auto mb-4 p-4 bg-white/5 border border-white/10 rounded-lg">
						</div>
						<form id="chatForm" class="flex" style="display: none;">
							<input
								type="text"
								id="chatInput"
								placeholder="Type your message..."
								class="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition"
								required
							/>
							<button
								type="submit"
								class="ml-2 px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition"
								id="sendButton"
							>
								Send
							</button>
						</form>
					</div>
				</div>
			</div>
		`;

		// Add new chat modal to the page
		const modal = createNewChatModal();
		div.appendChild(modal);

		// Add block user modal to the page
		const blockModal = createBlockUserModal();
		div.appendChild(blockModal);

		// Add chat info modal to the page
		const chatInfoModal = createChatInfoModal();
		div.appendChild(chatInfoModal);

		// New chat button handler
		const newChatBtn = div.querySelector("#newChatBtn");
		newChatBtn?.addEventListener("click", () => {
			openNewChatModal();
		});

		// Manage blocked users button handler
		const manageBlockedBtn = div.querySelector("#manageBlockedBtn");
		manageBlockedBtn?.addEventListener("click", () => {
			openBlockUserModal();
		});

		// Subscribe to chat events
		chatService.on("chats-updated", this.chatUpdateListener);
		chatService.on("message-received", this.messageListener);
		chatService.on("unread-updated", this.unreadListener);

		// Update connection status indicator
		this.updateConnectionStatus(div);
		chatService.on("connected", () => this.updateConnectionStatus(div));
		chatService.on("disconnected", () => this.updateConnectionStatus(div));

		// Load initial data from IndexedDB
		await this.loadInitialData(div);

		// Setup form submission
		const chatForm = div.querySelector("#chatForm") as HTMLFormElement;
		const chatInput = div.querySelector("#chatInput") as HTMLInputElement;
		const sendButton = div.querySelector("#sendButton") as HTMLButtonElement;

		chatForm.addEventListener("submit", async (event) => {
			event.preventDefault();
			const message = chatInput.value.trim();
			if (!message || !this.currentChat) return;

			// Disable input while sending
			chatInput.disabled = true;
			sendButton.disabled = true;
			sendButton.textContent = "Sending...";

			const success = await chatService.sendMessage(
				this.currentChat.chatId,
				message,
			);

			// Re-enable input
			chatInput.disabled = false;
			sendButton.disabled = false;
			sendButton.textContent = "Send";

			if (success) {
				chatInput.value = "";
				chatInput.focus();
				// Note: Don't add optimistic UI update here
				// The message will be added via WebSocket when server confirms
			}
		});

		// Handle chat open from notification
		window.addEventListener("chat:open", ((e: CustomEvent) => {
			const chatId = e.detail.chatId;
			const chat = this.chats.find((c) => c.chatId === chatId);
			if (chat) {
				this.selectChat(div, chat);
			}
		}) as EventListener);

		return div;
	}

	private updateConnectionStatus(root: HTMLElement) {
		const statusDiv = root.querySelector("#connectionStatus") as HTMLElement;
		const statusText = root.querySelector("#statusText") as HTMLElement;

		if (!statusDiv || !statusText) return;

		const status = chatService.getConnectionStatus();

		if (status === "connected") {
			statusDiv.className =
				"px-3 py-1 rounded-full text-sm font-semibold bg-green-500/20 text-green-400";
			statusText.textContent = "🟢 Connected";
		} else if (status === "connecting") {
			statusDiv.className =
				"px-3 py-1 rounded-full text-sm font-semibold bg-yellow-500/20 text-yellow-400";
			statusText.textContent = "🟡 Connecting...";
		} else {
			statusDiv.className =
				"px-3 py-1 rounded-full text-sm font-semibold bg-red-500/20 text-red-400";
			statusText.textContent = "🔴 Disconnected";
		}
	}

	private async loadInitialData(root: HTMLElement) {
		try {
			// Load chats from IndexedDB
			this.chats = await chatService.getChats();

			// Load unread counts
			const unreadMap = await chatService.getAllUnreadCounts();
			this.unreadCounts = unreadMap;

			this.renderChatList(root);
		} catch (error) {
			console.error("Failed to load initial data:", error);
		}
	}

	private handleChatsUpdated(data: { chats: Chat[] }) {
		this.chats = data.chats;
		if (this.rootElement) {
			this.renderChatList(this.rootElement);
		}
	}

	private handleMessageReceived(data: { chatId: number; message: Message }) {
		// If viewing this chat, update messages
		if (this.currentChat && this.currentChat.chatId === data.chatId) {
			const msgDate = new Date(data.message.date);
			const displayMsg: DisplayMessage = {
				sender:
					data.message.userId === this.currentUserId
						? "You"
						: "User " + data.message.userId,
				content: data.message.message,
				timestamp: msgDate.toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				}),
				userId: data.message.userId,
				date: msgDate,
			};
			this.messages.push(displayMsg);
			if (this.rootElement) {
				this.appendMessage(this.rootElement, displayMsg);
			}

			// Mark as read if viewing
			chatService.markChatAsRead(data.chatId);
		}
	}

	private handleUnreadUpdated(data: {
		chatId: number;
		count: number;
		total: number;
	}) {
		this.unreadCounts.set(data.chatId, data.count);
		if (this.rootElement) {
			this.renderChatList(this.rootElement);
		}
	}

	private renderChatList(root: HTMLElement) {
		const chatListDiv = root.querySelector("#chatList") as HTMLElement;
		if (!chatListDiv) return;

		if (this.chats.length === 0) {
			chatListDiv.innerHTML =
				'<div class="text-white/50 text-center py-8">No chats yet</div>';
			return;
		}

		const chatElements: string[] = [];
		for (const chat of this.chats) {
			const unread = this.unreadCounts.get(chat.chatId) || 0;
			const isSelected = this.currentChat?.chatId === chat.chatId;
			const selectedClass = isSelected ? " ring-2 ring-purple-400" : "";
			const unreadBadge =
				unread > 0
					? '<div class="bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded-full ml-2">' +
						unread +
						"</div>"
					: "";

			const html =
				'<div class="mb-2 p-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition' +
				selectedClass +
				'" data-chat-id="' +
				chat.chatId +
				'">' +
				'<div class="flex items-center justify-between">' +
				'<div class="flex-1 min-w-0">' +
				'<div class="font-medium truncate">' +
				this.escapeHtml(chat.name) +
				"</div>" +
				'<div class="text-white/70 text-sm truncate">' +
				this.escapeHtml(chat.lastMessage || "No messages") +
				"</div>" +
				"</div>" +
				unreadBadge +
				"</div>" +
				"</div>";

			chatElements.push(html);
		}

		chatListDiv.innerHTML = chatElements.join("");

		// Add click handlers
		chatListDiv.querySelectorAll("[data-chat-id]").forEach((el) => {
			el.addEventListener("click", () => {
				const chatId = parseInt(el.getAttribute("data-chat-id") || "0");
				const chat = this.chats.find((c) => c.chatId === chatId);
				if (chat) {
					this.selectChat(root, chat);
				}
			});
		});
	}

	private async selectChat(root: HTMLElement, chat: Chat) {
		this.currentChat = chat;

		// Clear previous messages from view and state to prevent race conditions
		this.messages = [];
		const messagesDiv = root.querySelector("#chatMessages") as HTMLElement;
		if (messagesDiv) {
			messagesDiv.innerHTML =
				'<div class="chat-placeholder text-white/50 text-center py-8">Loading messages...</div>';
		}

		// Mark as read
		await chatService.markChatAsRead(chat.chatId);

		// Fetch messages from backend (will be cached in IndexedDB)
		await chatService.fetchMessages(chat.chatId);

		// Load messages from IndexedDB
		const messages = await chatService.getMessages(chat.chatId);
		this.messages = messages.map((m) => ({
			sender: m.userId === this.currentUserId ? "You" : "User " + m.userId,
			content: m.message,
			timestamp: new Date(m.date).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
			userId: m.userId,
			date: new Date(m.date),
		}));

		// Sort messages by date to ensure correct order
		this.messages.sort((a, b) => a.date.getTime() - b.date.getTime());

		// Update UI
		this.renderChatHeader(root, chat);
		this.renderMessages(root);
		this.renderChatList(root); // Refresh to update selected state

		// Show form
		const chatForm = root.querySelector("#chatForm") as HTMLFormElement;
		if (chatForm) {
			chatForm.style.display = "flex";
		}
	}

	private renderChatHeader(root: HTMLElement, chat: Chat) {
		const headerDiv = root.querySelector("#chatHeader") as HTMLElement;
		if (!headerDiv) return;

		const chatTypeLabel =
			chat.type === "GROUP" ? "Group Chat" : "Direct Message";
		const chatTypeIcon = chat.type === "GROUP" ? "👥" : "💬";

		headerDiv.className =
			"mb-4 pb-3 border-b border-white/10 flex justify-between items-center";
		headerDiv.innerHTML =
			'<div class="flex items-center gap-3">' +
			'<div class="text-2xl">' +
			chatTypeIcon +
			"</div>" +
			"<div>" +
			'<h2 class="text-xl font-bold text-white">' +
			this.escapeHtml(chat.name) +
			"</h2>" +
			'<div class="text-white/50 text-sm">' +
			chatTypeLabel +
			"</div>" +
			"</div>" +
			"</div>" +
			'<button id="chatInfoBtn" class="px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition" title="Chat Info">' +
			'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
			'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>' +
			"</svg>" +
			"</button>";

		// Add chat info button handler
		const chatInfoBtn = headerDiv.querySelector("#chatInfoBtn");
		chatInfoBtn?.addEventListener("click", () => {
			openChatInfoModal(chat.chatId, chat.name, chat.type, chat.participants);
		});
	}

	private renderMessages(root: HTMLElement) {
		const messagesDiv = root.querySelector("#chatMessages") as HTMLElement;
		if (!messagesDiv) return;

		if (this.messages.length === 0) {
			messagesDiv.innerHTML =
				'<div class="chat-placeholder text-white/50 text-center">No messages yet</div>';
			return;
		}

		const messageElements: string[] = [];
		for (const msg of this.messages) {
			const alignClass = msg.userId === this.currentUserId ? "text-right" : "";
			const bgClass =
				msg.userId === this.currentUserId ? "bg-purple-600" : "bg-white/10";
			const html =
				'<div class="mb-3 ' +
				alignClass +
				'">' +
				'<div class="inline-block max-w-[70%] ' +
				bgClass +
				' rounded-lg px-4 py-2">' +
				'<div class="font-semibold text-sm mb-1">' +
				this.escapeHtml(msg.sender) +
				"</div>" +
				'<div class="break-words">' +
				this.escapeHtml(msg.content) +
				"</div>" +
				'<div class="text-xs text-white/50 mt-1">' +
				msg.timestamp +
				"</div>" +
				"</div>" +
				"</div>";
			messageElements.push(html);
		}
		messagesDiv.innerHTML = messageElements.join("");

		messagesDiv.scrollTop = messagesDiv.scrollHeight;
	}

	private appendMessage(root: HTMLElement, message: DisplayMessage) {
		const messagesDiv = root.querySelector("#chatMessages") as HTMLElement;
		if (!messagesDiv) return;

		// Remove "no messages" placeholder if it exists
		const placeholder = messagesDiv.querySelector(".chat-placeholder");
		if (placeholder) {
			messagesDiv.innerHTML = "";
		}

		const messageDiv = document.createElement("div");
		const alignClass =
			message.userId === this.currentUserId ? "text-right" : "";
		const bgClass =
			message.userId === this.currentUserId ? "bg-purple-600" : "bg-white/10";
		messageDiv.className = "mb-3 " + alignClass;
		messageDiv.innerHTML =
			'<div class="inline-block max-w-[70%] ' +
			bgClass +
			' rounded-lg px-4 py-2">' +
			'<div class="font-semibold text-sm mb-1">' +
			this.escapeHtml(message.sender) +
			"</div>" +
			'<div class="break-words">' +
			this.escapeHtml(message.content) +
			"</div>" +
			'<div class="text-xs text-white/50 mt-1">' +
			message.timestamp +
			"</div>" +
			"</div>";

		messagesDiv.appendChild(messageDiv);
		messagesDiv.scrollTop = messagesDiv.scrollHeight;
	}

	private escapeHtml(text: string): string {
		const div = document.createElement("div");
		div.textContent = text;
		return div.innerHTML;
	}

	// Cleanup when page is destroyed
	destroy() {
		// Unsubscribe from events
		chatService.off("chats-updated", this.chatUpdateListener);
		chatService.off("message-received", this.messageListener);
		chatService.off("unread-updated", this.unreadListener);
	}
}
