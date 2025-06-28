import {
	createInputElement,
	createButtonElement,
	createSeparator,
	createFormElement,
	createSelectElement
} from '../generals/createElements'
import { newChat } from '../classes/classes';

function searchChat(event?: Event) {
	event?.preventDefault();
	console.log("Search button clicked");
}

async function getUserList(): Promise<Array<{ id: number, linkId: number, name: string }>> {
	let userList = await fetch("http://localhost:3000/user-list", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ host: getUsername() })
	});
	if (userList.ok) {
		let data = await userList.json();
		// The issue is here - data.reply is probably a JSON string, not an array
		// Parse it if it's a string
		if (typeof data.reply === 'string') {
			return JSON.parse(data.reply);
		}
		return data.reply;
	}
	return [];
}

async function createChat(chatData: newChat) {
	try {
		const response = await fetch("http://localhost:3000/new-chat", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(chatData),
		});
		if (response.ok) {
			let data = await response.json();
			createChatPage(); // Refresh the chat page to show the new chat
			console.log("Chat created successfully:", data);
		} else {
			let errorData = await response.json();
			console.error("Error creating chat:", errorData);
		}
	} catch (error) {
		console.error("Network error while creating chat:", error);
		alert("Network error while creating chat.");
	}
}

async function createNewChat() {
	let popup = document.createElement("div");
	popup.id = "newChatPopup";
	popup.style.position = "fixed";
	popup.style.top = "0";
	popup.style.left = "0";
	popup.style.width = "100vw";
	popup.style.height = "100vh";
	popup.style.background = "rgba(0, 0, 0, 0.5)";
	popup.style.display = "flex";
	popup.style.alignItems = "center";
	popup.style.justifyContent = "center";
	popup.style.zIndex = "9999";

	let usersList: Array<{ id: number, linkId: number, name: string }> = await getUserList();
	console.log("Users List:", usersList);
	console.log("Users List type:", typeof usersList);
	
	// Add additional check to ensure it's an array
	if (!Array.isArray(usersList) || usersList.length === 0) {
		alert("No users found to create a chat with.");
		return;
	}

	let popupContent = document.createElement("div");
	popupContent.id = "newChatContent";
	popupContent.style.background = "#fff";
	popupContent.style.padding = "2rem";
	popupContent.style.borderRadius = "8px";
	popupContent.style.boxShadow = "0 2px 16px rgba(0,0,0,0.3)";
	popupContent.innerHTML = `
		<h2>Create New Chat</h2>
		<form id="newChatForm">
			<label for="chatName">Chat Name:</label>
			<input type="text" id="chatName" name="chatName" required>
			<label for="members">Select Members:</label>
			<ul id="membersList"></ul>
			<button type="submit" id="submitButton">Create Chat</button>
		</form>
		<button id="closePopup">Close</button>
	`;
	popup.appendChild(popupContent);

	let submitButton = popupContent.querySelector("#submitButton") as HTMLButtonElement;
	submitButton.addEventListener("click", (event) => {
		event.preventDefault();
		let chatName = (popupContent.querySelector("#chatName") as HTMLInputElement).value;
		
		// Get selected members
		let selectedMembers: string[] = [];
		let checkboxes = popupContent.querySelectorAll('input[type="checkbox"]:checked') as NodeListOf<HTMLInputElement>;
		checkboxes.forEach(checkbox => {
			selectedMembers.push(checkbox.value);
		});
		
		let newChatData: newChat = {
			host: getUsername(),
			chatName: chatName,
			members: selectedMembers
		};

		createChat(newChatData);

		// Close popup after creation
		document.body.removeChild(popup);
	});

	let closeButton = popupContent.querySelector("#closePopup") as HTMLButtonElement;
	closeButton.addEventListener("click", () => {
		document.body.removeChild(popup);
	});

	let membersList = popupContent.querySelector("#membersList") as HTMLUListElement;
	usersList.forEach((user) => {
		let listItem = document.createElement("li");
		listItem.style.listStyle = "none";
		listItem.style.marginBottom = "8px";
		
		let checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.value = user.name;
		checkbox.id = `member-${user.linkId || user.id}`;
		checkbox.style.marginRight = "8px";
		
		let label = document.createElement("label");
		label.htmlFor = `member-${user.linkId || user.id}`;
		label.innerText = user.name;
		label.style.cursor = "pointer";

		listItem.appendChild(checkbox);
		listItem.appendChild(label);
		membersList.appendChild(listItem);
	});

	// Close popup when clicking outside
	popup.addEventListener("click", (event) => {
		if (event.target === popup) {
			document.body.removeChild(popup);
		}
	});

	document.body.appendChild(popup);
}

export function getUsername(): string {
	let userSession = sessionStorage.getItem('userSession');
	if (!userSession)
		return "";
	let username = JSON.parse(userSession)['username'];
	console.log(username);
	return username;
}

async function getChats()
{
	let username = getUsername();
	if (!username)
		return [];
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

function createHeaderDiv() {
	let headerDiv = document.createElement("div");
	headerDiv.id = "header";

	let TopDiv = document.createElement("div");
	TopDiv.id = "top";
	
	let title = document.createElement("h2");
	title.innerText = "Search Chat";
	let homeButton = document.createElement("img");
	homeButton.src = "./assets/shared/home.png";
	homeButton.alt = "Home";
	homeButton.addEventListener("click", () => {
		window.location.pathname = "/home";
	});

	TopDiv.appendChild(title);
	TopDiv.appendChild(homeButton);

	let searchInput = createInputElement("searchChatInput", "text", "Search chat by name");
	let searchButton = createButtonElement("searchChatButton", "Search", searchChat);
	headerDiv.appendChild(TopDiv);
	headerDiv.appendChild(searchInput);
	headerDiv.appendChild(searchButton);

	return headerDiv;
}

async function openChat(chat: { id: number, name: string }) {
	
}

async function createChatsDiv() {
	let chatsDiv = document.createElement("div");
	chatsDiv.id = "chats";

	let headerDiv = createHeaderDiv();
	chatsDiv.appendChild(headerDiv);

	let chatsList: Array<{ id: number, name: string }> = await getChats();
	chatsList.forEach((chat) => {
		let chatDiv = document.createElement("div");
		chatDiv.className = "chat-item";
		chatDiv.innerText = chat.name; // Assuming chat has a 'name' property
		chatDiv.addEventListener("click", async () => {
			openChat(chat);
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
