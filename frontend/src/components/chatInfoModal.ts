/**
 * Enhanced Chat Info Modal
 * Shows chat details, participants, and actions
 */

import { loadStoredSession } from "@/services/session";
import { chatService } from "@/services/chatService";
import { lobby_id, LobbyWebSocket, lobbyWS } from "@/services/ws/lobbyWebSocket";
import { sendPostRequest } from "@/services/api/sendRequests";

interface ChatParticipant {
	userId: number;
	username: string;
	isOnline?: boolean;
}

export function createChatInfoModal(): HTMLElement {
	const modal = document.createElement("div");
	modal.id = "chatInfoModal";
	modal.className =
		"fixed inset-0 bg-black/60 flex items-center justify-center z-50";
	modal.style.display = "none";

	modal.innerHTML = /* html */ `
		<div class="bg-gradient-to-br from-slate-800 to-purple-900 border border-white/20 rounded-xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
			<div class="flex justify-between items-center mb-4">
				<h2 class="text-2xl font-bold text-white">Chat Info</h2>
				<button id="closeChatInfoModal" class="text-white/50 hover:text-white transition">
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</button>
			</div>
			
			<div id="chatInfoContent">
				<div class="text-white/70 text-center py-8">Loading chat info...</div>
			</div>
		</div>
	`;

	// Close modal on background click
	modal.addEventListener("click", (e) => {
		if (e.target === modal) {
			closeChatInfoModal();
		}
	});

	// Close button
	const closeBtn = modal.querySelector("#closeChatInfoModal");
	closeBtn?.addEventListener("click", () => closeChatInfoModal());

	return modal;
}

function closeChatInfoModal() {
	const modal = document.getElementById("chatInfoModal");
	if (modal) {
		modal.style.display = "none";
	}
}

/*
Object { chatId: "6", users: (1) […] }
	chatId: "6"
	users: Array [ {…} ]
		0: Object { userId: 1, linkId: 1, username: "Borgo" }
			linkId: 1
			userId: 1
			username: "Borgo"
	length: 1
*/

interface UserList {
	linkId: number;
	userId: number;
	username: string;
	online: boolean;
}

export async function openChatInfoModal(
	chatId: number,
	chatName: string,
	chatType: string,
	participants?: any[],
) {
	const modal = document.getElementById("chatInfoModal");
	if (!modal) return;

	modal.style.display = "flex";

	const content = modal.querySelector("#chatInfoContent");
	if (!content) return;

	const responseData = await fetch("/api/chat-users?chatId=" + chatId)
		.then((response) => response.json())
		.catch((error) => {
			console.error("Error fetching player list:", error);
			return { users: [] }; // Return an empty list on error
		});
	const playerList: UserList[] = responseData.users;
	// console.log(playerList);

	renderChatInfo(
		content as HTMLElement,
		chatId,
		chatName,
		chatType,
		participants,
		playerList,
	);
}

function renderChatInfo(
	content: HTMLElement,
	chatId: number,
	chatName: string,
	chatType: string,
	participants?: any[],
	playerList?: UserList[],
) {
	const isGroup = chatType === "GROUP";

	content.innerHTML =
		'<div class="space-y-6">' +
		'<div class="text-center">' +
		'<div class="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-3">' +
		'<span class="text-3xl">' +
		(isGroup ? "👥" : "💬") +
		"</span>" +
		"</div>" +
		'<h3 class="text-xl font-bold text-white">' +
		escapeHtml(chatName) +
		"</h3>" +
		'<p class="text-white/60 text-sm">' +
		(isGroup ? "Group Chat" : "Direct Message") +
		"</p>" +
		"</div>" +
		'<div class="border-t border-white/10 pt-4">' +
		'<h4 class="text-white/80 font-semibold mb-3">Actions</h4>' +
		'<div class="space-y-2">' +
		'<div id="userListContainer" class="space-y-2">' +
		"</div>" +
		"</div>" +
		"</div>";

	const userListContainer = content.querySelector("#userListContainer");
	if (userListContainer && playerList) {
		userListContainer.innerHTML = playerList
			.map((user) => {
				// TODO: change online to be a green or red dot
				return `<div class="flex items-center space-x-2">
				<span
					class="h-3 w-3 rounded-full inline-block ${user.online ? 'bg-green-500' : 'bg-red-500'}"
					title="${user.online ? 'Online' : 'Offline'}"
				></span>
				<span class="text-white">${user.username}</span>
				<a class="user-profile-link text-white/60 hover:text-white transition" href="/profile/${user.username}">
					👤
				</a>
				<button class="invite-to-game-btn text-white/60 hover:text-white transition" data-user-id="${user.userId}">
					🎮
				</button>
			</div>`;
			})
			.join("");
	}

	// Add event listeners
	const leaveBtn = content.querySelector("#leaveChatBtn");
	leaveBtn?.addEventListener("click", async () => {
		if (confirm("Are you sure you want to leave this chat?")) {
			// TODO: Implement leave chat functionality
			alert("Leave chat functionality coming soon!");
			closeChatInfoModal();
		}
	});

	const muteBtn = content.querySelector("#muteChatBtn");
	muteBtn?.addEventListener("click", () => {
		alert("Mute notifications functionality coming soon!");
	});

	const searchBtn = content.querySelector("#searchChatBtn");
	searchBtn?.addEventListener("click", () => {
		alert("Search functionality coming soon!");
	});

	userListContainer?.addEventListener("click", (event) => {
		const target = event.target as HTMLElement;
		const inviteButton = target.closest('.invite-to-game-btn');

		if (inviteButton) {
			const userId = inviteButton.getAttribute('data-user-id');
			if (!lobbyWS || !lobbyWS.getid())
				alert('Join a lobby before inviting');
			else if (userId) {
				sendPostRequest(
					`/api/lobby-invite`,
					{
						lobbyid: lobbyWS.getid(),
						target: userId,
					},
					"application/json",
				);
			}
		}
	});
	
}

function escapeHtml(text: string): string {
	const div = document.createElement("div");
	div.textContent = text;
	return div.innerHTML;
}
