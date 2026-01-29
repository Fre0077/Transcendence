import { chatService } from "@/services/chatService";
import { loadStoredSession } from "@/services/session";

interface User {
	linkId: number;
	username: string;
}

export function createNewChatModal(): HTMLElement {
	const modal = document.createElement('div');
	modal.id = 'newChatModal';
	modal.className = 'fixed inset-0 bg-black/60 flex items-center justify-center z-50';
	modal.style.display = 'none';
	
	modal.innerHTML = /* html */ `
		<div class="bg-gradient-to-br from-slate-800 to-purple-900 border border-white/20 rounded-xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
			<div class="flex justify-between items-center mb-4">
				<h2 class="text-2xl font-bold text-white">New Chat</h2>
				<button id="closeModal" class="text-white/50 hover:text-white transition">
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</button>
			</div>
			
			<div id="modalContent">
				<div class="text-white/70 text-center py-8">Loading users...</div>
			</div>
		</div>
	`;
	
	// Close modal on background click
	modal.addEventListener('click', (e) => {
		if (e.target === modal) {
			closeModal(modal);
		}
	});
	
	// Close button
	const closeBtn = modal.querySelector('#closeModal');
	closeBtn?.addEventListener('click', () => closeModal(modal));
	
	return modal;
}

function closeModal(modal: HTMLElement) {
	modal.style.display = 'none';
}

export async function openNewChatModal() {
	const modal = document.getElementById('newChatModal');
	if (!modal) return;
	
	modal.style.display = 'flex';
	
	// Load users
	const content = modal.querySelector('#modalContent');
	if (!content) return;
	
	try {
		const session = loadStoredSession();
		
		if (!session.userId) {
			throw new Error('Not authenticated');
		}
		
		// Fetch all users
		const response = await fetch('/api/user-list', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ linkId: session.userId }),
			credentials: 'include'
		});
		
		if (!response.ok) {
			throw new Error('Failed to fetch users');
		}
		
		const data = await response.json();
		const allUsers: User[] = JSON.parse(data.reply);
		
		// Fetch blocked users
		const blockedResponse = await fetch('/api/blocked-users', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ linkId: session.userId }),
			credentials: 'include'
		});
		
		let blockedUserIds: Set<number> = new Set();
		if (blockedResponse.ok) {
			const blockedData = await blockedResponse.json();
			const blockedUsers: User[] = JSON.parse(blockedData.reply);
			blockedUserIds = new Set(blockedUsers.map(u => u.linkId));
		}
		
		// Filter out blocked users
		const availableUsers = allUsers.filter(user => !blockedUserIds.has(user.linkId));
		
		renderUserSelection(content as HTMLElement, availableUsers);
	} catch (error) {
		console.error('Error loading users:', error);
		content.innerHTML = '<div class="text-red-400 text-center py-4">Failed to load users</div>';
	}
}

function renderUserSelection(content: HTMLElement, users: User[]) {
	const selectedUsers = new Set<number>();
	
	content.innerHTML = /* html */ `
		<div class="mb-4">
			<label class="block text-white/80 text-sm font-medium mb-2">Chat Name</label>
			<input
				type="text"
				id="chatNameInput"
				placeholder="Enter chat name"
				class="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition"
				required
			/>
		</div>
		
		<div class="mb-4">
			<label class="block text-white/80 text-sm font-medium mb-2">Select Users</label>
			<div class="mb-2">
				<input
					type="text"
					id="userSearch"
					placeholder="Search users..."
					class="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition"
				/>
			</div>
			<div id="userList" class="max-h-64 overflow-y-auto space-y-2">
				${users.map(user => `
					<label class="flex items-center p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 cursor-pointer transition user-item" data-username="${escapeHtml(user.username)}">
						<input
							type="checkbox"
							data-user-id="${user.linkId}"
							class="w-4 h-4 text-purple-600 bg-white/5 border-white/30 rounded focus:ring-purple-500 focus:ring-2"
						/>
						<span class="ml-3 text-white">${escapeHtml(user.username)}</span>
					</label>
				`).join('')}
			</div>
		</div>
		
		<div id="selectedCount" class="text-white/60 text-sm mb-4">
			0 users selected
		</div>
		
		<div class="flex gap-2">
			<button
				id="createChatBtn"
				class="flex-1 px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
				disabled
			>
				Create Chat
			</button>
		</div>
	`;
	
	// User search functionality
	const searchInput = content.querySelector('#userSearch') as HTMLInputElement;
	const userItems = content.querySelectorAll('.user-item');
	
	searchInput?.addEventListener('input', (e) => {
		const searchTerm = (e.target as HTMLInputElement).value.toLowerCase();
		userItems.forEach(item => {
			const username = item.getAttribute('data-username')?.toLowerCase() || '';
			const element = item as HTMLElement;
			element.style.display = username.includes(searchTerm) ? 'flex' : 'none';
		});
	});
	
	// Checkbox selection tracking
	const checkboxes = content.querySelectorAll('input[type="checkbox"]');
	const selectedCountEl = content.querySelector('#selectedCount');
	const createBtn = content.querySelector('#createChatBtn') as HTMLButtonElement;
	
	checkboxes.forEach(checkbox => {
		checkbox.addEventListener('change', () => {
			selectedUsers.clear();
			checkboxes.forEach(cb => {
				if ((cb as HTMLInputElement).checked) {
					selectedUsers.add(parseInt((cb as HTMLInputElement).dataset.userId || '0'));
				}
			});
			
			if (selectedCountEl) {
				selectedCountEl.textContent = `${selectedUsers.size} user${selectedUsers.size !== 1 ? 's' : ''} selected`;
			}
			
			// Enable button only if at least one user is selected and chat name is provided
			const chatName = (content.querySelector('#chatNameInput') as HTMLInputElement)?.value.trim();
			createBtn.disabled = selectedUsers.size === 0 || !chatName;
		});
	});
	
	// Chat name input validation
	const chatNameInput = content.querySelector('#chatNameInput') as HTMLInputElement;
	chatNameInput?.addEventListener('input', () => {
		const chatName = chatNameInput.value.trim();
		createBtn.disabled = selectedUsers.size === 0 || !chatName;
	});
	
	// Create chat button
	createBtn?.addEventListener('click', async () => {
		const chatName = chatNameInput?.value.trim();
		if (!chatName || selectedUsers.size === 0) return;
		
		createBtn.disabled = true;
		createBtn.textContent = 'Creating...';
		
		try {
			const success = await chatService.createChat(chatName, Array.from(selectedUsers));
			
			if (success) {
				const modal = document.getElementById('newChatModal');
				if (modal) {
					closeModal(modal);
				}
				
				// Reset form
				chatNameInput.value = '';
				selectedUsers.clear();
				checkboxes.forEach(cb => {
					(cb as HTMLInputElement).checked = false;
				});
			} else {
				throw new Error('Failed to create chat');
			}
		} catch (error) {
			console.error('Error creating chat:', error);
			alert('Failed to create chat. Please try again.');
		} finally {
			createBtn.disabled = false;
			createBtn.textContent = 'Create Chat';
		}
	});
}

function escapeHtml(text: string): string {
	const div = document.createElement('div');
	div.textContent = text;
	return div.innerHTML;
}
