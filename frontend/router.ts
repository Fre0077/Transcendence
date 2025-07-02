import { createChatPage, getUsername } from "./chat/chat";
import { createHomePage } from "./home/home";
import { createLoginPage } from "./login/login";

document.addEventListener('DOMContentLoaded', () => {
	let url = window.location.pathname;
	console.log('Current URL:', url);

	let username = getUsername();
	console.log('Username:', username);
	if (url != '/login' && (username === "" || username === null || username === undefined)) {
		console.log('No username found, redirecting to login page');
		window.location.pathname = "/login";
		return;
	}

	switch (url) {
		case '/login':
			createLoginPage();
			break;
		case '/':
			createHomePage();
			break;
		case '/home':
			createHomePage();
			break;
		case '/chat':
			createChatPage();
			break;
		default:
			console.error('Page not found:', url);
			document.body.innerHTML = '<h1>404 Not Found</h1>';
			break;
	}
});