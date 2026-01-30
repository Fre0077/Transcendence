import { router } from "@/router";
import { HttpError, sendGetRequest, sendPostRequest } from "@/services/api/sendRequests";
import { generateInitialsAvatar } from "./createDefaultImage";

// HELPER
function makeDraggable(el: HTMLElement, handle: HTMLElement) {
    let offsetX = 0;
    let offsetY = 0;
    let dragging = false;

    el.style.position = 'fixed';

    handle.addEventListener('pointerdown', (e) => {
        // If the user clicked a button (or anything inside a button), 
        // don't start dragging.
        const target = e.target as HTMLElement;
        if (target.closest('button')) {
            return;
        }

        dragging = true;
        offsetX = e.clientX - el.offsetLeft;
        offsetY = e.clientY - el.offsetTop;
        
        // This is what was "trapping" the events
        handle.setPointerCapture(e.pointerId);
    });

    handle.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        // Use standard Template Literals for the units
        el.style.left = `${e.clientX - offsetX}px`;
        el.style.top = `${e.clientY - offsetY}px`;
    });

    handle.addEventListener('pointerup', (e) => {
        dragging = false;
        // Clean up the capture
        if (handle.hasPointerCapture(e.pointerId)) {
            handle.releasePointerCapture(e.pointerId);
        }
    });
}


async function getFriendsList(){
	try {
		const data = await sendGetRequest(`/api/friends`);
		// const friends = JSON.parse(data);
		// console.log('data', friends);
		return data;
	} catch (err) {
		console.log(err);
		return undefined;
	}
}

export type FriendStatus = "online" | "offline" | "ingame" | "away";

interface Friend {
	username: string,
	avatarUrl: null,
	status: FriendStatus,
	linkId: 2,	// #todo remove
}

function createFriendCard(root:HTMLElement, friend: Friend): HTMLElement {
	const card = document.createElement("div");
	card.className =
		"relative rounded-xl bg-slate-900/70 hover:bg-slate-700/70 " +
		"transition cursor-pointer overflow-hidden";

	const statusColor =
		friend.status === "online"
			? "bg-green-500"
			: friend.status === "away"
			? "bg-yellow-400"
			: "bg-gray-400";

	card.innerHTML = /* html */ `
		<!-- Main clickable area -->
		<div class="flex items-center gap-3 p-3">
			<img
				class="w-10 h-10 rounded-full"
				src="${friend.avatarUrl ?? generateInitialsAvatar(friend.username)}"
			/>
			<div class="flex-1">
				<div class="text-white text-sm font-medium">${friend.username}</div>
				<div class="flex items-center gap-2 text-xs text-white/60">
					<span class="w-2 h-2 rounded-full ${statusColor}"></span>
					<span>${friend.status}</span>
				</div>
			</div>
		</div>

		<!-- Hidden actions -->
		<div class="friend-actions hidden border-t border-white/10 bg-black/20">
			<button class="w-full px-3 py-2 text-sm text-left text-white hover:bg-white/10">
				Send Message
			</button>
			<button class="view-profile w-full px-3 py-2 text-sm text-left text-white hover:bg-white/10">
				View Profile
			</button>
			<button class="remove-btn w-full px-3 py-2 text-sm text-left text-red-400 hover:bg-red-500/10">
				Remove Friend
			</button>
		</div>
	`;

	const actions = card.querySelector(".friend-actions")!;

	card.addEventListener("click", () => {
		actions.classList.toggle("hidden");
	});
	
	const cancelBtn = card.querySelector(".remove-btn")!;
	cancelBtn.addEventListener("click", async () => {
		try {
			await sendPostRequest(
				`/api/friend/remove`,
				{ target: friend.username },
				"application/json"
			);
			// update the UI
			card.dispatchEvent(
				new CustomEvent('update:friends:local', { bubbles: true })
			);
		} catch (err) {
			// console.error(err);

			if (err instanceof HttpError) {
				root.dispatchEvent(
					new CustomEvent('friend-error', {
						detail: { message: `Error [${err.status}] while removing/declining` }
					})
				);
			}
		}
	});

	const viewProfile = card.querySelector(".view-profile")!;
	viewProfile.addEventListener("click", async () => {
		try {
			router.push(`/profile/${friend.username}`)
		} catch (err) {
			// console.error(err);
		}
	});

	return card;
}


interface Request  {
	username: string,
	avatarUrl: string
}

function createIncomingRequestCard(root:HTMLElement, req: Request): HTMLElement {
	const div = document.createElement("div");
	div.className =
		"flex items-center justify-between p-2 rounded-lg bg-slate-900/70";

	div.innerHTML = /* html */ `
		<div class="flex items-center gap-2">
			<img class="w-8 h-8 rounded-full" src="${req.avatarUrl ?? generateInitialsAvatar(req.username)}" />
			<span class="text-sm text-white">${req.username}</span>
		</div>
		<div class="flex gap-2">
			<button class="accept-btn text-green-400 text-xs hover:underline">
				Accept
			</button>
			<button class="decline-btn text-red-400 text-xs hover:underline">
				Decline
			</button>
		</div>
	`;

	const acceptBtn = div.querySelector(".accept-btn")!;
	acceptBtn.addEventListener("click", async () => {
		try {
			await sendPostRequest(
				`/api/friend/accept`,
				{ target: req.username },
				"application/json"
			);
			// update the UI
			div.dispatchEvent(
				new CustomEvent('update:friends:local', { bubbles: true })
			);
		} catch (err) {
			// console.error(err);

			if (err instanceof HttpError) {
				root.dispatchEvent(
					new CustomEvent('friend-error', {
						detail: { message: `Error [${err.status}] while accepting friend request` }
					})
				);
			}
		}
	});

	const declineBtn = div.querySelector(".decline-btn")!;
	declineBtn.addEventListener("click", async () => {
		try {
			await sendPostRequest(
				`/api/friend/remove`,
				{ target: req.username },
				"application/json")
			.then(() => {
				// update the UI
				div.dispatchEvent(
					new CustomEvent('update:friends:local', { bubbles: true })
				);
			});
		} catch (err) {
			// console.error(err);

			if (err instanceof HttpError) {
				root.dispatchEvent(
					new CustomEvent('friend-error', {
						detail: { message: `Error [${err.status}] while removing/declining` }
					})
				);
			}
		}
	});

	return div;
}






function createOutgoingRequestCard(root:HTMLElement, req: Request): HTMLElement {
	const div = document.createElement("div");
	div.className =
		"flex items-center justify-between p-2 rounded-lg bg-slate-900/70";

	div.innerHTML = /* html */ `
		<div class="flex items-center gap-2">
			<img class="w-8 h-8 rounded-full" src="${req.avatarUrl ?? generateInitialsAvatar(req.username)}" />
			<span class="text-sm text-white">${req.username}</span>
		</div>
		<div class="flex gap-2">
			<button class="cancel-btn text-green-400 text-xs hover:underline">
				Cancel
			</button>
		</div>
	`;

	const cancelBtn = div.querySelector(".cancel-btn")!;
	cancelBtn.addEventListener("click", async () => {
		try {
			await sendPostRequest(
				`/api/friend/remove`,
				{ target: req.username },
				"application/json")
			.then(() => {
				// update the UI
				div.dispatchEvent(
					new CustomEvent('update:friends:local', { bubbles: true })
				);
			});
		} catch (err) {
			// console.error(err);

			if (err instanceof HttpError) {
				root.dispatchEvent(
					new CustomEvent('friend-error', {
						detail: { message: `Error [${err.status}] while removing/declining` }
					})
				);
			}
		}
	});

	return div;
}


export function createFriendsBar(): HTMLElement {
	const bar = document.createElement("div");
	bar.id = "FriendBar";
	bar.className =
		"fixed top-6 right-6 w-72 " +
		"bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-2xl " +
		"border border-white/10 flex flex-col overflow-hidden z-40";

	bar.innerHTML = /* html */ `
		<!-- Header -->
		<div id="header" class="flex items-center justify-between px-4 py-3
					bg-gradient-to-r from-purple-600/50 to-pink-600/50
					border-b border-white/10">
			<h3 class="text-white font-semibold">FRIENDS</h3>
			<div class="flex gap-2">
				<button
					id="friend-refresh"
					class="text-white/70 hover:text-white transition text-sm"
					title="Refresh"
				>
					⟳
				</button>
				<button id="close-bar-btn"
					class="text-white/70 hover:text-white transition"
				>
					×
				</button>
			</div>
		</div>

		<!-- Content -->
		<div class="p-3 space-y-4 max-h-[80vh] overflow-y-auto">
			<div>
				<h4 class="text-xs text-white/60 mb-2">Friends</h4>
				<div id="friends-list" class="space-y-2"></div>
			</div>

			<div>
				<h4 class="text-xs text-white/60 mb-2">Incoming Requests</h4>
				<div id="incoming-requests" class="space-y-2"></div>
			</div>

			<div>
				<h4 class="text-xs text-white/60 mb-2">Outgoing Requests</h4>
				<div id="outgoing-requests" class="space-y-2"></div>
			</div>
			<div class="pt-3 border-t border-white/10">
				<h4 class="text-xs text-white/60 mb-2">Send friend request</h4>
				<form id="send-friend-form" class="flex gap-2">
					<input
						type="text"
						name="username"
						required
						placeholder="Username"
						class="flex-1 rounded-md px-3 py-1.5
							bg-slate-900 text-white text-sm
							border border-white/20
							placeholder-white/40
							focus:outline-none focus:ring-1 focus:ring-cyan-400"
					/>
					<button
						type="submit"
						class="px-3 py-1.5 rounded-md
							bg-cyan-600 hover:bg-cyan-500
							text-white text-sm font-medium
							transition"
						title="Send request"
					>
						📨
					</button>
				</form>
			</div>
			<p id="error-msg" class="text-xs text-red-400 hidden"></p>
		</div>
	`;

	// Define form hook
	const sendForm = bar.querySelector("#send-friend-form") as HTMLFormElement;
	sendForm?.addEventListener("submit", async (e) => {
		e.preventDefault();
		const formData = new FormData(sendForm);
		const username = formData.get("username");
		if (typeof username !== "string" || !username.trim()) return;
		try {
			await sendPostRequest(
				"/api/friend/request",
				{ target: username.trim() },
				"application/json"
			);
			sendForm.reset();
			// refresh the bar
			bar.dispatchEvent(
				new CustomEvent("update:friends:local", { bubbles: true })
			);
		} catch (err) {
			// console.error("Error sending friend request:", err);

			if (err instanceof HttpError) {
				bar.dispatchEvent(
					new CustomEvent('friend-error', {
						detail: { message: `Error [${err.status}] while sending friend request` }
					})
				);
			}
		}
	});

	// define for future removal
	const load = () => {
		loadFriendBarContent(bar);
	}


	// Make the bar draggable
	// !!! IMPORTANT TO DO BEFORE ASSIGNING OTHER EVENTLISTENERS !!!
	const header = bar.querySelector('#header') as HTMLElement;

	// cursor styling
	header.style.cursor = 'grab';
	header.addEventListener('pointerdown', () => {
		header.style.cursor = 'grabbing';
	});
	header.addEventListener('pointerup', () => {
		header.style.cursor = 'grab';
	});

	// make the bar draggable
	makeDraggable(bar, header);



	// Refresh button (dev only)
	bar.querySelector("#friend-refresh")?.addEventListener("click", load);

	// refresh friend bar on update
	window.addEventListener('update:friends', load);
	bar.addEventListener('update:friends:local', load);

	// clean closup
	bar.querySelector("#close-bar-btn")?.addEventListener("click", () => {
		// remove listeners
		window.removeEventListener('update:friends', load);
		bar.removeEventListener('update:friends:local', load);
		// remove object
		bar.remove();
	});
	
	// get the elements
	const errorMsg = bar.querySelector('#error-msg')!;

	// Catch errors on friend bar
	bar.addEventListener('friend-error', (e) => {
		const event = e as CustomEvent<{ message: string }>;
		errorMsg.textContent = event.detail.message;
		errorMsg.classList.remove('hidden');
	});

	// Initial load
	load();

	return bar;
}


function loadFriendBarContent(bar: HTMLElement) {
	const friendsList = bar.querySelector("#friends-list")!;
	const incoming = bar.querySelector("#incoming-requests")!;
	const outgoing = bar.querySelector("#outgoing-requests")!;
	const errorMsg = bar.querySelector('#error-msg')!;

	// Clear previous content
	friendsList.innerHTML = "";
	incoming.innerHTML = "";
	outgoing.innerHTML = "";

	// clear error paragraph
	errorMsg.classList.add('hidden');

	getFriendsList().then(data => {
		if(friendsList && data.friends) data.friends.forEach((f: Friend) =>
			friendsList.appendChild(createFriendCard(bar, f))
		);

		if(incoming && data.incomingRequests)data.incomingRequests.forEach((r: Request) =>
			incoming.appendChild(createIncomingRequestCard(bar, r))
		);

		if(outgoing && data.outgoingRequests) data.outgoingRequests.forEach((r: Request) =>
			outgoing.appendChild(createOutgoingRequestCard(bar, r))
		);
	});
}


