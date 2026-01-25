// defaults
import { router } from "@/router";
// import { load404Page } from "@/pages/errors/404";

// services
import { sendPostRequest } from "@/services/api/sendRequests";
// import { } from "@/services/ws/lobbyWebSocket";

// components
import { loadNavbar } from "@/components/navbar";

// URLS
const BACKEND_APIS_URL = `http://${window.location.hostname}:3029/api`;


export function loadChatApiTest(): HTMLElement
{

	const div = document.createElement('div');
	div.className = 'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col';
	div.innerHTML = /*html*/ `
	${loadNavbar().outerHTML}
	<!-- Online Lobby Page Content -->
	<div class="gap-6 container mx-auto flex flex-col items-center justify-center">
		<div class="text-center mt-6">
			<h1 class="text-5xl font-bold text-white mb-4">Chat API Test</h1>
			<p class="text-lg text-white/60">Vediamo se Fra ha lavorato bene :D</p>
		</div>

		
		<!-- Chat card -->
		<div class="flex flex-col lg:flex-row w-full rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 overflow-hidden">

			<!-- CHAT INFO CARD -->
			<div class="flex flex-col flex-1 p-8 pb-2 gap-6">
				<h3 class="text-lg font-bold text-white mb-4">Chat info</h3>

				<div id="chat-info"></div>

				<!-- MESSAGES (grow & scroll) -->
				<div
					id="messages"
					class="flex-1 space-y-4 overflow-y-auto"
				>
				</div>

				<!-- FOOTER (sticks to bottom) -->
				<div id="chat-footer"></div>
			</div>


			<!-- ACTION CARDS -->
			<div class="max-w-xl grid grid-cols-1 grid-rows-2 items-center justify-center p-8 border-l border-white/10">
			
				<!-- Invite Player Card -->
				<div id="create-chat-card"></div>
			
			</div>

		</div>

		<br>
	</div>
	`;

	const createDiv = div.querySelector('#create-chat-card') as HTMLElement;
	createDiv.appendChild(loadCreateChatCard());

	const chatFooter = div.querySelector('#chat-footer') as HTMLElement;
	chatFooter.appendChild(loadSendMessageBar());

	const messagesHost = div.querySelector('#messages') as HTMLElement;
	messagesHost.replaceWith(loadMessagesPanel());

	return div;
}







// HELPER
function removeAllChildNodes(parent:HTMLElement) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

// HELPER
function sleep(ms:number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}


/* -------------------------------------------------------------------- */

function loadMessagesPanel(): HTMLElement
{
	const container = document.createElement('div');
	container.id = 'messages';
	container.className = 'flex-1 space-y-3 overflow-y-auto min-h-0';

	let socket: WebSocket | null = null;

	function renderMessage(msg: any)
	{
		const row = document.createElement('div');
		row.className = `
			max-w-[75%] rounded-lg px-3 py-2 text-sm
			bg-slate-800 text-white border border-white/10
		`;

		row.innerHTML = `
			<div class="text-xs text-white/50 mb-1">
				User ${msg.linkId}
			</div>
			<div>${msg.message}</div>
		`;

		container.appendChild(row);
	}

	function scrollToBottom() {
		container.scrollTop = container.scrollHeight;
	}

	function connect() {
		socket = new WebSocket(`ws://${location.hostname}:3029/ws/broadcast`);

		socket.onopen = () => {
			console.log('Dispatching chat event');
			sleep(100).then(() => socket?.send(JSON.stringify({ chatId:1, index:0 })));
			// socket?.dispatchEvent(
			// 	new CustomEvent('chat', { detail: { chatId: 1, startIndex: 0 } })
			// );
		};

		socket.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);

				if (data.error) {
					console.error('WS error:', data.error);
					return;
				}

				console.log('parsed data', data);

				if (data.type === "ChatList")
				{
					console.log('New Chat list');
				}
				else if (data.type === "MessageList")
				{
					console.log('New Message list');
				}

				// E` una chatlist?
				// E` una message list?

				// const messages = JSON.parse(data.reply);

				// if (!messages || !Array.isArray(messages)) return;

				// container.innerHTML = '';
				
				// for (const msg of messages.reverse()) {
				// 	console.log('rendering message', msg);
				// 	renderMessage(msg);
				// }

				// scrollToBottom();
			} catch (err) {
				console.log('Error while parsing message', err);
			}
		};

		socket.onclose = () => {
			console.warn('WebSocket closed');
		};

		socket.onerror = (err) => {
			console.error('WebSocket error', err);
		};
	}

	connect();

	return container;
}



/* -------------------------------------------------------------------- */



// create chat card
function loadCreateChatCard(): HTMLElement
{
	const div = document.createElement('div');

	div.innerHTML = /* html */`
	<section
		class="relative rounded-lg p-4 border border-white/20
			   bg-slate-800/60 backdrop-blur
			   transition-all duration-300
			   hover:shadow-md hover:shadow-white/10
			   focus-within:ring-2 focus-within:ring-cyan-400"
	>
		<div class="text-center">
			<!-- Icon -->
			<div class="text-3xl mb-2" aria-hidden="true">💬➕</div>

			<!-- Title -->
			<h3 class="text-base font-semibold text-white mb-1">
				Create Chat
			</h3>

			<!-- Description -->
			<p class="text-xs text-white/70 mb-3">
				Simple test for /new-chat
			</p>

			<form id="create-chat-form" class="flex flex-col gap-2 text-left">
				<input
					name="chatName"
					type="text"
					required
					placeholder="Chat name"
					class="rounded-md px-3 py-1.5
						bg-slate-900 text-sm text-white
						border border-white/20
						placeholder-white/40
						focus:outline-none focus:ring-2 focus:ring-cyan-400"
				/>

				<input
					name="members"
					type="text"
					placeholder="Member IDs (comma separated)"
					class="rounded-md px-3 py-1.5
						bg-slate-900 text-sm text-white
						border border-white/20
						placeholder-white/40
						focus:outline-none focus:ring-2 focus:ring-cyan-400"
				/>

				<button
					type="submit"
					class="inline-flex items-center justify-center gap-1.5
						rounded-md px-3 py-1.5
						bg-cyan-600 hover:bg-cyan-500
						text-sm font-medium text-white
						transition-colors
						focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400"
				>
					<span aria-hidden="true">🚀</span>
					Create
				</button>

				<p id="create-chat-result" class="text-xs mt-1 text-center"></p>
			</form>
		</div>
	</section>
	`;

	const form = div.querySelector("#create-chat-form") as HTMLFormElement;
	const result = div.querySelector("#create-chat-result") as HTMLParagraphElement;

	form.addEventListener("submit", async (event) => {
		event.preventDefault();

		const formData = new FormData(form);
		const chatName = formData.get("chatName") as string;
		const membersRaw = formData.get("members") as string;

		const members = membersRaw
			? membersRaw.split(",").map(id => Number(id.trim())).filter(Boolean)
			: [];

		try {
			/* const res =  */await sendPostRequest(`${BACKEND_APIS_URL}/new-chat`, {
				chatName,
				members,
			});

			result.textContent = "✅ Chat created successfully";
			result.className = "text-xs mt-1 text-green-400";

			form.reset();
		} catch (err) {
			result.textContent = `❌ ${(err as Error).message}`;
			result.className = "text-xs mt-1 text-red-400";
		}
	});

	return div;
}


/* -------------------------------------------------------------------- */


function loadSendMessageBar(): HTMLElement
{
	const div = document.createElement('div');

	div.innerHTML = /* html */`
	<div
		class="mt-6 flex flex-col gap-2 border-t border-white/10 pt-4"
	>
		<form
			id="send-message-form"
			class="flex flex-col sm:flex-row gap-2 items-stretch"
		>
			<input
				name="chatId"
				type="number"
				required
				placeholder="Chat ID"
				class="w-28 rounded-md px-3 py-2
					bg-slate-900 text-sm text-white
					border border-white/20
					placeholder-white/40
					focus:outline-none focus:ring-2 focus:ring-cyan-400"
			/>

			<input
				name="message"
				type="text"
				required
				placeholder="Type a message..."
				class="flex-1 rounded-md px-3 py-2
					bg-slate-900 text-sm text-white
					border border-white/20
					placeholder-white/40
					focus:outline-none focus:ring-2 focus:ring-cyan-400"
			/>

			<button
				type="submit"
				class="inline-flex items-center justify-center gap-2
					rounded-md px-4 py-2
					bg-cyan-600 hover:bg-cyan-500
					text-sm font-medium text-white
					transition-colors
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400"
			>
				<span aria-hidden="true">📨</span>
				Send
			</button>
		</form>

		<p id="send-message-result" class="text-xs text-center"></p>
	</div>
	`;

	const form = div.querySelector('#send-message-form') as HTMLFormElement;
	const result = div.querySelector('#send-message-result') as HTMLParagraphElement;

	form.addEventListener('submit', async (event) => {
		event.preventDefault();

		const formData = new FormData(form);
		const chatId = Number(formData.get('chatId'));
		const message = formData.get('message') as string;

		try {

			/* const res =  */await sendPostRequest(`${BACKEND_APIS_URL}/new-message`, {
				chatId,
				message,
			});

			result.textContent = '✅ Message sent';
			result.className = 'text-xs text-green-400';

			form.reset();
		} catch (err) {
			result.textContent = `❌ ${(err as Error).message}`;
			result.className = 'text-xs text-red-400';
		}
	});

	return div;
}
