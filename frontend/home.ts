function createInputElement(id: string, type: string, placeholder: string): HTMLInputElement {
	let input = document.createElement("input");
	input.id = id;
	input.type = type;
	input.placeholder = placeholder;
	return input;
}

function createButtonElement(id: string, text: string, onClick: () => void): HTMLButtonElement {
	let button = document.createElement("button");
	button.id = id;
	button.innerText = text;
	button.addEventListener("click", onClick);
	return button;
}

function loginFunction(): void {
	let username = (document.getElementById("usernameInput") as HTMLInputElement).value;
	let password = (document.getElementById("passwordInput") as HTMLInputElement).value;
	if (["admin", ""].includes(username) && ["password", ""].includes(password)) {
		alert("Login successful");
	} else {
		alert("Invalid credentials");
	}
}

function createSeparator(height: string, color: string): HTMLHRElement {
	let separator = document.createElement("hr");
	separator.style.width = "100%";
	separator.style.height = height;
	separator.style.border = "none";
	separator.style.backgroundColor = color;
	return separator;
}

async function fetchGoogleUserInfo(accessToken: string): Promise<any> {
	try {
		const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const userInfo = await response.json();
		return userInfo;
	} catch (error) {
		console.error('Error fetching user info:', error);
		throw error;
	}
}

function displayUserInfo(userInfo: any, tokensDiv: HTMLElement): void {
	const userInfoDiv = document.createElement("div");
	userInfoDiv.style.marginTop = "20px";
	userInfoDiv.style.padding = "15px";
	userInfoDiv.style.backgroundColor = "#f0f9ff";
	userInfoDiv.style.borderRadius = "8px";
	userInfoDiv.style.border = "1px solid #0ea5e9";

	if (!userInfo || Object.keys(userInfo).length === 0) {
		userInfoDiv.innerHTML = "<p style='color: red;'>No user information available.</p>";
		tokensDiv.appendChild(userInfoDiv);
		return;
	}
	else if (!userInfo.picture) {
		userInfo.picture = "https://www.gstatic.com/images/branding/product/1x/gsa_48dp.png";
	}

	console.log("User Image URL: ", userInfo.picture);
		
	userInfoDiv.innerHTML = `
		<h3 style="margin: 0 0 10px 0; color: #0369a1;">User Information:</h3>
		<p><strong>Name:</strong> ${userInfo.name || 'N/A'}</p>
		<p><strong>Email:</strong> ${userInfo.email || 'N/A'}</p>
		<p><strong>Picture:</strong> <img src="${userInfo.picture}" alt="Profile" style="width: 50px; height: 50px; border-radius: 50%;"></p>
		<p><strong>Google ID:</strong> ${userInfo.id || 'N/A'}</p>
		<p><strong>Verified Email:</strong> ${userInfo.verified_email ? 'Yes' : 'No'}</p>
		<p><strong>Locale:</strong> ${userInfo.locale || 'N/A'}</p>
	`;
		
	tokensDiv.appendChild(userInfoDiv);
}

function sendPostRequest(url: string, data: any = null, type: string): Promise<any> {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-Type", type);
		xhr.onreadystatechange = function() {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				if (xhr.status === 200) {
					try {
						const response = JSON.parse(xhr.responseText);
						resolve(response);
					} catch (e) {
						reject(new Error("Failed to parse JSON response: " + e.message));
					}
				} else {
					reject(new Error(`HTTP error! status: ${xhr.status}, statusText: ${xhr.statusText}`));
				}
			}
		};
		if (data) {
			xhr.send(JSON.stringify(data));
		} else {
			xhr.send();
		}
	});
}

function sendGetRequest(url: string): Promise<any> {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				if (xhr.status === 200) {
					try {
						const response = JSON.parse(xhr.responseText);
						resolve(response);
					} catch (e) {
						reject(new Error("Failed to parse JSON response: " + e.message));
					}
				} else {
					reject(new Error(`HTTP error! status: ${xhr.status}, statusText: ${xhr.statusText}`));
				}
			}
		};
		xhr.send();
	});
}

function googleLoginFunction(): void {
	const clientId = "444437163420-c7jh572i1kdauafj0nd19hqmr0ddl8a3.apps.googleusercontent.com";
		
	// Use window.location.origin to get the current domain dynamically
	console.log("redirectUri: ", window.location.origin + "/auth/callback");
	const redirectUri = encodeURIComponent(window.location.origin + "/auth/callback");
	const scope = encodeURIComponent("email profile");

	const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;

	const popup = window.open(authUrl, "Google Login", "width=600,height=400");
		
	if (popup) {
		popup.focus();
		
		const checkPopup = setInterval(async () => {
			try {
				// Check for the callback URL
				if (popup.location.href.includes('/auth/callback')) {
					const url = new URL(popup.location.href);
					const token = url.hash.split('&')[0].split('=')[1];
					
					let tokensDiv = document.getElementById("tokensDiv");
					if (tokensDiv) {
						// Fetch and display user information
						try {
							const userInfo = await fetchGoogleUserInfo(token);

							// Prepare data for PHP script
							const accountData = {
								google_id: userInfo.id,
								email: userInfo.email,
								name: userInfo.name,
								picture: userInfo.picture,
								verified_email: userInfo.verified_email,
								locale: userInfo.locale,
								login_type: 'google',
								access_token: token
							};

							console.log("Sending data to PHP:", accountData);
							
							// Call to the php script to save the account info
							sendPostRequest("./save_accounts.php", accountData, "application/json")
								.then(response => {
									console.log("Account saved successfully.");
									// After POST succeeds, fetch the accounts
									console.log("Fetching accounts from PHP script...");
									return sendGetRequest("./save_accounts.php");
								})
								.then(accounts => {
									console.log("Accounts fetched successfully:", accounts);
									refreshTokensDiv(accounts, tokensDiv);
								})
								.catch(error => {
									console.error("Error saving or fetching accounts:", error);
									const errorDiv = document.createElement("p");
									errorDiv.innerText = "Error: " + error.message;
									errorDiv.style.color = "red";
									tokensDiv.appendChild(errorDiv);
								});
						}
						catch (error) {
							if (error instanceof Error) {
								console.error("Error fetching user info:", error);
								const errorDiv = document.createElement("p");
								errorDiv.innerText = "Error fetching user info: " + error.message;
								errorDiv.style.color = "red";
								tokensDiv.appendChild(errorDiv);
							}
						}
					}
					clearInterval(checkPopup);
					popup.close();
				}
			} catch (e) {
				// Cross-origin errors are expected until redirect completes
			}
		}, 100);
	}
}

function refreshTokensDiv(accounts: any[], tokensDiv: HTMLElement): void {
	console.log("Refreshing tokensDiv with accounts:", accounts);
	tokensDiv.innerHTML = "<p>Tokens will be displayed here after login:</p>";
	accounts.forEach(account => {
		const accountDiv = document.createElement("div");
		accountDiv.style.marginTop = "10px";
		accountDiv.style.padding = "10px";
		accountDiv.style.border = "1px solid #ccc";
		accountDiv.style.borderRadius = "5px";
		accountDiv.id = `account-${account.google_id}`;
		accountDiv.innerHTML = `
			<p><strong>Google ID:</strong> ${account.google_id}</p>
			<p><strong>Email:</strong> ${account.email}</p>
			<p><strong>Name:</strong> ${account.name}</p>
			<p><strong>Picture:</strong> <img src="${account.picture}" alt="Profile" style="width: 50px; height: 50px; border-radius: 50%;"></p>
			<p><strong>Verified Email:</strong> ${account.verified_email ? 'Yes' : 'No'}</p>
			<p><strong>Locale:</strong> ${account.locale}</p>
			<p><strong>Login Type:</strong> ${account.login_type}</p>
			<p><strong>Last Login:</strong> ${account.last_login ? new Date(account.last_login).toLocaleString() : 'N/A'}</p>
		`;
		tokensDiv.appendChild(accountDiv);
	});
}

function createLoginDiv()
{
	let loginDiv = document.createElement("div");
	loginDiv.id = "loginDiv";
	let usernameInput = createInputElement("usernameInput", "text", "username");
	let passwordInput = createInputElement("passwordInput", "password", "password");
	let loginButton = createButtonElement("loginButton", "Login", loginFunction);
	let separator = createSeparator("4px", "#07d");
	let googleButton = createButtonElement("googleButton", "Login with Google", googleLoginFunction);
	let tokensDiv = document.createElement("div");
	tokensDiv.id = "tokensDiv";
	tokensDiv.innerHTML = "<p>Tokens will be displayed here after login:</p>";
	sendGetRequest("./save_accounts.php")
		.then(accounts => {
			console.log("Accounts fetched successfully:", accounts);
			refreshTokensDiv(accounts, tokensDiv);
		})
		.catch(error => {
			console.error("Error fetching accounts:", error);
			const errorDiv = document.createElement("p");
			errorDiv.innerText = "Error fetching accounts: " + error.message;
			errorDiv.style.color = "red";
			tokensDiv.appendChild(errorDiv);
		});
	loginDiv.appendChild(usernameInput);
	loginDiv.appendChild(passwordInput);
	loginDiv.appendChild(loginButton);
	loginDiv.appendChild(separator);
	loginDiv.appendChild(googleButton);
	loginDiv.appendChild(tokensDiv);
	document.body.appendChild(loginDiv);
}

document.addEventListener("DOMContentLoaded", () => {
	createLoginDiv();
})