import { loadStoredSession } from "@/services/session";

interface User {
	linkId: number;
	username: string;
}

export function createBlockUserModal(): HTMLElement {
	const modal = document.createElement('div');
	modal.id = 'blockUserModal';
	modal.className = 'fixed inset-0 bg-black/60 flex items-center justify-center z-50';
	modal.style.display = 'none';
	
	modal.innerHTML = /* html */ `
		<div class="bg-gradient-to-br from-slate-800 to-purple-900 border border-white/20 rounded-xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
			<div class="flex justify-between items-center mb-4">
				<h2 class="text-2xl font-bold text-white">Blocked Users</h2>
				<button id="closeBlockModal" class="text-white/50 hover:text-white transition">
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</button>
			</div>
			
			<div id="blockModalContent">
				<div class="text-white/70 text-center py-8">Loading blocked users...</div>
			</div>
		</div>
	`;
	
	// Close modal on background click
	modal.addEventListener('click', (e) => {
		if (e.target === modal) {
			closeBlockModal(modal);
		}
	});
	
	// Close button
	const closeBtn = modal.querySelector('#closeBlockModal');
	closeBtn?.addEventListener('click', () => closeBlockModal(modal));
	
	return modal;
}

function closeBlockModal(modal: HTMLElement) {
	modal.style.display = 'none';
}

export async function openBlockUserModal() {
	const modal = document.getElementById('blockUserModal');
	if (!modal) return;
	
	modal.style.display = 'flex';
	
	// Load blocked users
	const content = modal.querySelector('#blockModalContent');
	if (!content) return;
	
	await loadBlockedUsers(content as HTMLElement);
}

async function loadBlockedUsers(content: HTMLElement) {
	try {
		const session = loadStoredSession();
		
		if (!session.userId) {
			throw new Error('Not authenticated');
		}
		
		// Fetch blocked users
		const blockedResponse = await fetch('/api/blocked-users', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ linkId: session.userId }),
			credentials: 'include'
		});
		
		if (!blockedResponse.ok) {
			throw new Error('Failed to fetch blocked users');
		}
		
		const blockedData = await blockedResponse.json();
		const blockedUsers: User[] = JSON.parse(blockedData.reply);
		
		// Fetch all users for the block action
		const allUsersResponse = await fetch('/api/user-list', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ linkId: session.userId }),
			credentials: 'include'
		});
		
		if (!allUsersResponse.ok) {
			throw new Error('Failed to fetch users');
		}
		
		const allUsersData = await allUsersResponse.json();
		const allUsers: User[] = JSON.parse(allUsersData.reply);
		const blockedIds = new Set(blockedUsers.map(u => u.linkId));
		const availableToBlock = allUsers.filter(u => !blockedIds.has(u.linkId));
		
		renderBlockUI(content, blockedUsers, availableToBlock);
	} catch (error) {
		console.error('Error loading blocked users:', error);
		content.innerHTML = '<div class="text-red-400 text-center py-4">Failed to load blocked users</div>';
	}
}

function renderBlockUI(content: HTMLElement, blockedUsers: User[], availableToBlock: User[]) {
	content.innerHTML = /* html */ `
		<div class="mb-6">
			<h3 class="text-white/90 font-semibold mb-3">Currently Blocked (${blockedUsers.length})</h3>
			<div id="blockedList" class="space-y-2 max-h-64 overflow-y-auto">
				${blockedUsers.length === 0 
					? '<div class="text-white/50 text-center py-4">No blocked users</div>'
					: blockedUsers.map(user => `
						<div class="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
							<span class="text-white">${escapeHtml(user.username)}</span>
							<button
								data-user-id="${user.linkId}"
								data-action="unblock"
								class="px-3 py-1 rounded-lg text-sm font-semibold text-white bg-green-600 hover:bg-green-500 transition"
							>
								Unblock
							</button>
						</div>
					`).join('')
				}
			</div>
		</div>
		
		<div>
			<h3 class="text-white/90 font-semibold mb-3">Block a User</h3>
			<div class="mb-2">
				<input
					type="text"
					id="blockUserSearch"
					placeholder="Search users to block..."
					class="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition"
				/>
			</div>
			<div id="availableList" class="space-y-2 max-h-48 overflow-y-auto">
				${availableToBlock.length === 0
					? '<div class="text-white/50 text-center py-4">No users available to block</div>'
					: availableToBlock.map(user => `
						<div class="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg user-to-block" data-username="${escapeHtml(user.username)}">
							<span class="text-white">${escapeHtml(user.username)}</span>
							<button
								data-user-id="${user.linkId}"
								data-action="block"
								class="px-3 py-1 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-500 transition"
							>
								Block
							</button>
						</div>
					`).join('')
				}
			</div>
		</div>
	`;
	
	// Search functionality
	const searchInput = content.querySelector('#blockUserSearch') as HTMLInputElement;
	const userItems = content.querySelectorAll('.user-to-block');
	
	searchInput?.addEventListener('input', (e) => {
		const searchTerm = (e.target as HTMLInputElement).value.toLowerCase();
		userItems.forEach(item => {
			const username = item.getAttribute('data-username')?.toLowerCase() || '';
			const element = item as HTMLElement;
			element.style.display = username.includes(searchTerm) ? 'flex' : 'none';
		});
	});
	
	// Block/unblock button handlers
	const buttons = content.querySelectorAll('button[data-action]');
	buttons.forEach(btn => {
		btn.addEventListener('click', async (e) => {
			const button = e.target as HTMLButtonElement;
			const userId = parseInt(button.dataset.userId || '0');
			const action = button.dataset.action;
			
			if (action === 'block') {
				await blockUser(userId);
			} else if (action === 'unblock') {
				await unblockUser(userId);
			}
			
			// Reload the list
			await loadBlockedUsers(content);
		});
	});
}

async function blockUser(userId: number) {
	try {
		const session = loadStoredSession();
		
		if (!session.userId) {
			throw new Error('Not authenticated');
		}
		
		const response = await fetch('/api/block-user', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ users: [session.userId, userId] }),
			credentials: 'include'
		});
		
		if (!response.ok) {
			throw new Error('Failed to block user');
		}
		
		console.log('User blocked successfully');
	} catch (error) {
		console.error('Error blocking user:', error);
		alert('Failed to block user. Please try again.');
	}
}

async function unblockUser(userId: number) {
	try {
		const session = loadStoredSession();
		
		if (!session.userId) {
			throw new Error('Not authenticated');
		}
		
		const response = await fetch('/api/sblock-user', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ users: [session.userId, userId] }),
			credentials: 'include'
		});
		
		if (!response.ok) {
			throw new Error('Failed to unblock user');
		}
		
		console.log('User unblocked successfully');
	} catch (error) {
		console.error('Error unblocking user:', error);
		alert('Failed to unblock user. Please try again.');
	}
}

function escapeHtml(text: string): string {
	const div = document.createElement('div');
	div.textContent = text;
	return div.innerHTML;
}
