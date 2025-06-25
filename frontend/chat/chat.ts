import {
	createInputElement,
	createButtonElement,
	createSeparator,
	createFormElement,
	createSelectElement
} from '../generals/createElements'

function searchChat(event?: Event) {
	event?.preventDefault();
	console.log("Search button clicked");
}

function createNewChat() {
	console.log("New chat button clicked");
	// Logic to create a new chat can be added here
}

async function getChats()
{
	let userSession = localStorage.getItem('userSession');
	if (!userSession)
		return [];
	let username = JSON.parse(userSession)['username'];
	console.log(username);
	const response = await fetch("http://localhost:3000/chat-list", {
		method: "POST",
		headers: { "Content-Type": "text/plain" },
		body: username,
	});
	if (response.ok)
	{
		let data = JSON.parse(await response.text());
		let chats = JSON.parse(data.chats);
		console.log(chats);
		return chats;
	}
	return [];
}

async function createChatsDiv() {
	let chatsDiv = document.createElement("div");
	chatsDiv.id = "chats";

	let searchChatForm = createFormElement("searchChatForm", "Search Chat");
	let searchInput = createInputElement("searchChatInput", "text", "Search chat by name");
	let searchButton = createButtonElement("searchChatButton", "Search", searchChat);
	searchChatForm.appendChild(searchInput);
	searchChatForm.appendChild(searchButton);
	chatsDiv.appendChild(searchChatForm);

	// TODO: implement the chat get function to fetch chats from the server
	let chatsList: Array<{ id: number, name: string }> = await getChats();
	chatsList.forEach((chat) => {
		let chatDiv = document.createElement("div");
		chatDiv.className = "chat-item";
		chatDiv.innerText = chat.name; // Assuming chat has a 'name' property
		chatDiv.addEventListener("click", async () => {
			console.log("cazzi duri");
		});

		chatsDiv.appendChild(chatDiv);
	});

	let newChatButton = createButtonElement("newChatButton", "New Chat", createNewChat);
	chatsDiv.appendChild(newChatButton);

	return chatsDiv;
}

function createCurrentChatDiv() {
	let currentChatDiv = document.createElement("div");
	currentChatDiv.id = "currentChat";

	let chatTitle = document.createElement("h2");
	chatTitle.innerText = "Current Chat";
	currentChatDiv.appendChild(chatTitle);

	let messagesDiv = document.createElement("div");
	messagesDiv.id = "messages";
	currentChatDiv.appendChild(messagesDiv);

	let messageInputForm = createFormElement("messageInputForm", "Send Message");
	let messageInput = createInputElement("messageInput", "text", "Type your message here");
	let sendButton = createButtonElement("sendButton", "Send", (event?) => {
		event?.preventDefault();
		console.log("Send button clicked");
		// Logic to send the message can be added here
	});
	messageInputForm.appendChild(messageInput);
	messageInputForm.appendChild(sendButton);
	currentChatDiv.appendChild(messageInputForm);

	return currentChatDiv;
}

export async function createChatPage() {
	let contentDiv = document.getElementById("content");
	if (!contentDiv) {
		console.error("Content div not found");
		return;
	}
	let chatsDiv = await createChatsDiv();

	let currentChatDiv = createCurrentChatDiv();

	let cssLink = document.getElementById("content-css") as HTMLLinkElement;
	cssLink.href = "./chat/chat.css";
	contentDiv.innerHTML = "";
	contentDiv.appendChild(chatsDiv);
	contentDiv.appendChild(currentChatDiv);
}

//document.addEventListener("DOMContentLoaded", () => {
//	createChatPage();
//});
