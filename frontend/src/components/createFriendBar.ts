import { sendGetRequest } from "@/services/api/sendRequests";
import { sendPostRequest } from "@/services/api/sendRequests";

const BACKEND_APIS_URL = `http://${window.location.hostname}:3029/api`;

async function getFriendsList(){
	try {
		const data = await sendGetRequest(`http://${window.location.hostname}:3029/api/friends`);
		console.log('data', data);
		// const friends = JSON.parse(data);
		// console.log('data', friends);
		return data;
	} catch (err) {
		console.log(err);
		return undefined;
	}
}

export type FriendStatus = "online" | "offline" | "ingame";

interface Friend {
	username: string,
	avatarUrl: null,
	status: FriendStatus,
	linkId: 2,	// #todo remove
}

function createFriendCard(friend: Friend): HTMLElement {
	const card = document.createElement("div");
	card.className =
		"relative rounded-xl bg-slate-900/70 hover:bg-slate-700/70 " +
		"transition cursor-pointer overflow-hidden";

	const statusColor =
		friend.status === "online"
			? "bg-green-500"
			: friend.status === "ingame"
			? "bg-yellow-400"
			: "bg-gray-400";

	card.innerHTML = /* html */ `
		<!-- Main clickable area -->
		<div class="flex items-center gap-3 p-3">
			<img
				class="w-10 h-10 rounded-full"
				src="${friend.avatarUrl ?? "https://i.pravatar.cc/100"}"
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
			<button class="w-full px-3 py-2 text-sm text-left text-white hover:bg-white/10">
				Invite to Game
			</button>
			<button class="decline-btn w-full px-3 py-2 text-sm text-left text-red-400 hover:bg-red-500/10">
				Remove Friend
			</button>
		</div>
	`;

	const actions = card.querySelector(".friend-actions")!;

	card.addEventListener("click", () => {
		actions.classList.toggle("hidden");
	});
	
	const cancelBtn = card.querySelector(".decline-btn")!;
	cancelBtn.addEventListener("click", async () => {
		try {
			await sendPostRequest(
				`${BACKEND_APIS_URL}/friend/remove`,
				{ target: friend.username },
				"application/json"
			);
			console.log("Friend request remove:", friend.username);
		} catch (err) {
			console.error(err);
		}
	});

	return card;
}


interface Request  {
	username: true,
	avatarUrl: true
}

function createIncomingRequestCard(req: Request): HTMLElement {
	const div = document.createElement("div");
	div.className =
		"flex items-center justify-between p-2 rounded-lg bg-slate-900/70";

	div.innerHTML = /* html */ `
		<div class="flex items-center gap-2">
			<img class="w-8 h-8 rounded-full" src="${req.avatarUrl ?? "https://i.pravatar.cc/100"}" />
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
				`${BACKEND_APIS_URL}/friend/accept`,
				{ target: req.username },
				"application/json"
			);
			console.log("Friend request accepted:", req.username);
		} catch (err) {
			console.error(err);
		}
	});

	const declineBtn = div.querySelector(".decline-btn")!;
	declineBtn.addEventListener("click", async () => {
		try {
			await sendPostRequest(
				`${BACKEND_APIS_URL}/friend/remove`,
				{ target: req.username },
				"application/json"
			);
			console.log("Friend request remove:", req.username);
		} catch (err) {
			console.error(err);
		}
	});

	return div;
}






function createOutgoingRequestCard(req: Request): HTMLElement {
	const div = document.createElement("div");
	div.className =
		"flex items-center justify-between p-2 rounded-lg bg-slate-900/70";

	div.innerHTML = /* html */ `
		<div class="flex items-center gap-2">
			<img class="w-8 h-8 rounded-full" src="${req.avatarUrl ?? "https://i.pravatar.cc/100"}" />
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
				`${BACKEND_APIS_URL}/friend/remove`,
				{ target: req.username },
				"application/json"
			);
			console.log("Friend request remove:", req.username);
		} catch (err) {
			console.error(err);
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
		<div class="flex items-center justify-between px-4 py-3
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
		</div>
	`;

	// define for future removal
	const load = () => loadFriendBarContent(bar);

	// Initial load
	load();

	// Refresh button (dev only)
	bar.querySelector("#friend-refresh")?.addEventListener("click", load);

	// refresh friend bar on update
	window.addEventListener('update:friends', load);

	// clean closup
	bar.querySelector("#close-bar-btn")?.addEventListener("click", () => {
		// remove listener
		window.removeEventListener('update:friends', load);
		// remove object
		bar.remove();
	});

	return bar;
}


function loadFriendBarContent(bar: HTMLElement) {
	const friendsList = bar.querySelector("#friends-list")!;
	const incoming = bar.querySelector("#incoming-requests")!;
	const outgoing = bar.querySelector("#outgoing-requests")!;

	// Clear previous content
	friendsList.innerHTML = "";
	incoming.innerHTML = "";
	outgoing.innerHTML = "";

	getFriendsList().then(data => {
		if(friendsList && data.friends) data.friends.forEach((f: Friend) =>
			friendsList.appendChild(createFriendCard(f))
		);

		if(incoming && data.incomingRequests)data.incomingRequests.forEach((r: Request) =>
			incoming.appendChild(createIncomingRequestCard(r))
		);

		if(outgoing && data.outgoingRequests) data.outgoingRequests.forEach((r: Request) =>
			outgoing.appendChild(createOutgoingRequestCard(r))
		);
	});
}


