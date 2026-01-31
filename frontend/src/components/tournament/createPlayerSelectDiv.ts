export interface PlayerData {
	username: string;
	icon: string;
	phrase: string;
}

import { createProfileWidget } from "@components/createProfileWidget";


export function createPlayerSelectDiv(cb: (players: PlayerData[]) => void, totplayers?:number): HTMLElement {
	const div = document.createElement('div');
	div.className = 'fixed inset-0 z-50 bg-black/60 flex items-center justify-center';

	const players: PlayerData[] = [];
	const ICONS = ['🐱','🐶','🦊','🐼','🐸','🦁','🐵','🐧','🐯','🐮','🦄','🐙'];
	let selectedIcon: string | null = null;
	let totalPlayers: number | null = (totplayers !== undefined) ? totplayers : null;

	div.innerHTML = /* html */`
		<div class="w-full max-w-md rounded-xl bg-slate-900 border border-white/10 p-6 space-y-4 relative">
			<h2 id="title" class="text-lg font-semibold text-white text-center">How many players?</h2>

			<div id="step-container" class="space-y-3">
				<input
					id="player-count-input"
					type="number"
					placeholder="Enter number of players"
					min="1"
					class="w-full rounded-md bg-slate-800 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
				/>
				<p id="error-msg" class="text-xs text-red-400 hidden"></p>
			</div>

			<div class="flex gap-2 pt-2">
				<button
					id="next-btn"
					class="flex-1 rounded-md bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold py-2 transition">
					Next
				</button>
			</div>
		</div>
	`;

	const stepContainer = div.querySelector('#step-container') as HTMLElement;
	const nextBtn = div.querySelector('#next-btn') as HTMLButtonElement;
	const title = div.querySelector('#title') as HTMLElement;
	let errorMsg = div.querySelector('#error-msg') as HTMLElement;

	/* ---------------- Icon picker popup ---------------- */
	const picker = document.createElement('div');
	picker.className =
		'hidden absolute z-50 mt-2 grid grid-cols-6 gap-2 p-3 rounded-xl bg-slate-800 border border-white/10';
	const modal = div.querySelector('.rounded-xl') as HTMLElement;
	modal.classList.add('relative');
	modal.appendChild(picker);

	function renderPicker() {
		picker.innerHTML = ICONS.map(icon => {
			const disabled = players.some(p => p.icon === icon);
			return `
				<button
					class="text-xl p-2 rounded-md transition
						${disabled
							? 'opacity-30 cursor-not-allowed'
							: 'hover:bg-slate-700'}"
					${disabled ? 'disabled' : ''}
					data-icon="${icon}">
					${icon}
				</button>
			`;
		}).join('');
	}

	/* ---------------- Player form elements ---------------- */
	let usernameInput: HTMLInputElement;
	let phraseInput: HTMLInputElement;
	let iconBtn: HTMLButtonElement;

	function showPlayerForm() {
		title.textContent = `Add Player ${players.length + 1} of ${totalPlayers}`;
		stepContainer.innerHTML = `
			<input
				id="player-username"
				type="text"
				placeholder="Username"
				class="w-full rounded-md bg-slate-800 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
			/>
			<button
				id="icon-picker-btn"
				class="w-full rounded-md bg-slate-800 border border-white/10 px-3 py-2 text-left text-white/70 hover:bg-slate-700 transition"
			>
				Choose icon
			</button>
			<input
				id="player-phrase"
				type="text"
				placeholder="Victory phrase"
				class="w-full rounded-md bg-slate-800 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
			/>
			<p id="error-msg" class="text-xs text-red-400 hidden"></p>
		`;

		usernameInput = div.querySelector('#player-username') as HTMLInputElement;
		phraseInput = div.querySelector('#player-phrase') as HTMLInputElement;
		iconBtn = div.querySelector('#icon-picker-btn') as HTMLButtonElement;

		// re-query the error message
		errorMsg = div.querySelector('#error-msg') as HTMLElement;

		iconBtn.onclick = () => {
			renderPicker();
			picker.classList.toggle('hidden');
		};

		picker.onclick = (e) => {
			const btn = (e.target as HTMLElement).closest('button');
			if (!btn) return;
			selectedIcon = btn.dataset.icon!;
			iconBtn.innerHTML = `<span class="flex items-center gap-2"><span>${selectedIcon}</span><span class="text-white/70">Change icon</span></span>`;
			picker.classList.add('hidden');
		};
	}

	/* ---------------- Skip player count if passed ---------------- */
	if (totalPlayers !== null) {
		// Skip the number input step and go straight to adding players
		showPlayerForm();
	}

	/* ---------------- Next button ---------------- */
	nextBtn.onclick = () => {
		errorMsg.classList.add('hidden');

		// Step 1: Set total players
		if (totalPlayers === null) {
			const val = parseInt((div.querySelector('#player-count-input') as HTMLInputElement).value);
			if (!val || val < 4 || !isPowerOfTwo(val)) {
				errorMsg.textContent = 'Enter a valid number of players (at least 4 players, power of 2)';
				errorMsg.classList.remove('hidden');
				return;
			}
			totalPlayers = val;
			showPlayerForm();
			return;
		}

		// Step 2: Add player
		if (!usernameInput.value || !phraseInput.value || !selectedIcon) {
			errorMsg.textContent = 'All fields are required';
			errorMsg.classList.remove('hidden');
			return;
		}

		// check if username already exists
		if (players.find(p => p.username === usernameInput.value)) {
			errorMsg.textContent = 'Username already exists';
			errorMsg.classList.remove('hidden');
			return;
		}

		// add correct player
		players.push({
			username: usernameInput.value.trim(),
			icon: selectedIcon,
			phrase: phraseInput.value.trim()
		});

		if (players.length < totalPlayers) {
			// reset for next player
			usernameInput.value = '';
			phraseInput.value = '';
			selectedIcon = null;
			iconBtn.textContent = 'Choose icon';
			renderPicker();
			title.textContent = `Add Player ${players.length + 1} of ${totalPlayers}`;
		} else {
			// remove next button
			nextBtn.remove();

			// All players added -> show profiles
			stepContainer.innerHTML = `
				<div class="flex flex-col items-center gap-4">
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center" id="players-grid"></div>
					<button id="lets-play" class="mt-4 w-full max-w-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded-md">
						Press To Play
					</button>
				</div>
			`;
			const grid = div.querySelector('#players-grid') as HTMLElement;
			for (const p of players) {
				createProfileWidget(p.username, { local:true, ...p})
				.then(widget => {
					grid.appendChild(widget.element);
				});
			}
			const startBtn = div.querySelector('#lets-play') as HTMLButtonElement;
			startBtn.onclick = () => {
				div.remove();
				cb(players);
			};
			title.textContent = `All players ready!`;
		}
	};

	return div;
}

// HELPERS
function isPowerOfTwo(n: number): boolean {
    // Must be positive
    if (n <= 0) return false;
    // Check if only one bit is set
    return (n & (n - 1)) === 0;
}