import { createChatPage } from "../chat/chat";


function createProfileDiv() {
	const profileDiv = document.createElement("div");
	profileDiv.className = "profile-div";

	let profileImage = document.createElement("img");
	profileImage.src = "./assets/profile.png"; // Placeholder image
	profileImage.alt = "Profile Picture";
	profileDiv.appendChild(profileImage);

	let UserDiv = document.createElement("div");
	UserDiv.className = "user-div";
	profileDiv.appendChild(UserDiv);

	let profileUsername = document.createElement("h2");
	profileUsername.textContent = "Username"; // Placeholder username
	UserDiv.appendChild(profileUsername);

	let profileEmail = document.createElement("p");
	profileEmail.textContent = "Email:\nuser@example.com"; // Placeholder email
	UserDiv.appendChild(profileEmail);

	let profileBio = document.createElement("p");
	profileBio.textContent = "This is a short bio about the user."; // Placeholder bio
	profileDiv.appendChild(profileBio);

	return profileDiv;
}

function logoutUser() {
	sessionStorage.setItem("userSession", JSON.stringify({}));
	window.location.pathname = "/login";
	// window.location.reload();
}

function loadSettingsPage() {
	// Placeholder for loading the settings page
	console.log("Loading settings page...");
}

function loadPlayPage() {
	// Placeholder for loading the play page
	console.log("Loading play page...");
}

function createNavDiv() {
	const navDiv = document.createElement("div");
	navDiv.className = "nav-div";

	let navList = document.createElement("ul");
	navDiv.appendChild(navList);

	let navItems = [
		{ text: "Settings", onClick: () => loadSettingsPage() },
		{ text: "Chat", onClick: () => window.location.pathname = "/chat" },
		{ text: "Play", onClick: () => loadPlayPage() },
		{ text: "Logout", onClick: () => logoutUser() }
	];

	navItems.forEach(item => {
		let listItem = document.createElement("li");
		let link = document.createElement("a");
		link.textContent = item.text;
		link.href = "#";
		link.addEventListener("click", (e) => {
			e.preventDefault();
			item.onClick();
		});
		listItem.appendChild(link);
		navList.appendChild(listItem);
	});

	return navDiv;
}

function createDashboardDiv() {
	const dashboardDiv = document.createElement("div");
	dashboardDiv.className = "dashboard-div";

	let pongDiv = document.createElement("div");
	pongDiv.className = "pong-div";

	let game2Div = document.createElement("div");
	game2Div.className = "game2-div";

	dashboardDiv.appendChild(pongDiv);
	dashboardDiv.appendChild(game2Div);
	return dashboardDiv;
}

export function createHomePage() {
	document.title = "Home - My Application";
	const homePage = document.createElement("div");
	homePage.className = "home-page";

	let profileDiv = createProfileDiv();
	let dashboardDiv = createDashboardDiv();
	let navDiv = createNavDiv();

	let headerDiv = document.createElement("div");
	headerDiv.className = "header-div";

	headerDiv.appendChild(profileDiv);
	headerDiv.appendChild(navDiv);
	homePage.appendChild(headerDiv);
	homePage.appendChild(dashboardDiv);

	let content = document.getElementById("content");
	if (content) {
		let cssLink = document.getElementById("content-css") as HTMLLinkElement;
		cssLink.href = "./home/home.css";
		content.innerHTML = "";
		content.appendChild(homePage);
	}
}
