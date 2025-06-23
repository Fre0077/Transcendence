import { openSignUpForm } from "../signUp/signUp";
import {
    createButtonElement,
    createFormElement,
    createInputElement,
    createSeparator,
} from "../generals/createElements";
import { googleLoginFunction } from "./googleLogin";
import { sendPostRequest } from "../generals/generalUse";
import { createChatPage } from "../chat/chat";

async function loginFunction(event?: Event): Promise<void> {
    if (event) {
        event.preventDefault();
    }

    const usernameInput = document.getElementById("usernameInput") as HTMLInputElement;
    const passwordInput = document.getElementById("passwordInput") as HTMLInputElement;
    const loginButton = document.getElementById("loginButton") as HTMLButtonElement;

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Validate input
    if (!username || !password) {
        showMessage("Please enter both username and password", "error");
        return;
    }

    // Disable button and show loading state
    setLoginButtonState(true, "Logging in...");

    try {
        console.log('Attempting login for:', username);
        
        const response = await sendPostRequest(
            'http://localhost:3000/api/auth/login',
            { username, password },
            'application/json'
        );

        if (response.success && response.user) {
            console.log('Login successful:', response.user);
            
            // Store user session data
            localStorage.setItem('userSession', JSON.stringify({
                id: response.user.id,
                username: response.user.username,
                email: response.user.email,
                name: response.user.name,
                picture: response.user.picture,
                role: response.user.role,
                loginType: 'local',
                loginTime: new Date().toISOString()
            }));

            showMessage("Login successful! Redirecting...", "success");
            
            // Redirect to chat page after a short delay
            setTimeout(() => {
                createChatPage();
            }, 1000);

        } else {
            console.error('Login failed:', response);
            showMessage(response.error || 'Login failed', "error");
        }

    } catch (error: any) {
        console.error('Login error:', error);
        showMessage(error.message || 'Login failed. Please try again.', "error");
    } finally {
        setLoginButtonState(false, "Login");
    }
}

function setLoginButtonState(disabled: boolean, text: string): void {
    const loginButton = document.getElementById("loginButton") as HTMLButtonElement;
    if (loginButton) {
        loginButton.disabled = disabled;
        loginButton.textContent = text;
        if (disabled) {
            loginButton.classList.add("loading");
        } else {
            loginButton.classList.remove("loading");
        }
    }
}

function showMessage(message: string, type: "success" | "error"): void {
    // Remove any existing messages
    const existingMessage = document.querySelector('.login-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `login-message ${type === 'success' ? 'success-message' : 'error-message'}`;
    messageDiv.textContent = message;

    // Insert message after the login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm && loginForm.parentNode) {
        loginForm.parentNode.insertBefore(messageDiv, loginForm.nextSibling);
    }

    // Auto-remove error messages after 5 seconds
    if (type === 'error') {
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// Enhanced function to handle Enter key press
function handleEnterKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
        event.preventDefault();
        console.log('Enter key pressed - attempting login');
        loginFunction(event);
    }
}

export function createLoginPage() {
    let loginDiv = document.createElement("div");
    loginDiv.id = "loginDiv";
    
    let loginForm = createFormElement("loginForm", "Login Form");
    
    let usernameInput = createInputElement(
        "usernameInput",
        "text",
        "Username or Email",
        "username"
    );
    
    let passwordInput = createInputElement(
        "passwordInput",
        "password",
        "Password",
        "current-password webauthn"
    );
    
    let loginButton = createButtonElement("loginButton", "Login", loginFunction);
    
    let separator = createSeparator("4px", "#07d");
    
    let googleButton = createButtonElement(
        "googleButton",
        "Login with Google",
        googleLoginFunction
    );
    
    let signUpButton = createButtonElement(
        "signUpButton",
        "Sign Up",
        openSignUpForm
    );

    // Add form submission handler for Enter key
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Form submitted - attempting login');
        loginFunction(e);
    });

    // Add Enter key listeners to both input fields
    usernameInput.addEventListener('keypress', handleEnterKeyPress);
    passwordInput.addEventListener('keypress', handleEnterKeyPress);

    // Also add keydown listener for better compatibility
    usernameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            loginFunction(e);
        }
    });

    passwordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            loginFunction(e);
        }
    });

    // Set the login button as the default submit button
    loginButton.type = "submit";

    loginForm.appendChild(usernameInput);
    loginForm.appendChild(passwordInput);
    loginForm.appendChild(loginButton);
    
    loginDiv.appendChild(loginForm);
    loginDiv.appendChild(separator);
    loginDiv.appendChild(googleButton);
    loginDiv.appendChild(separator.cloneNode(true));
    loginDiv.appendChild(signUpButton);

    document.getElementById("content")!.innerHTML = "";
    document.getElementById("content")!.appendChild(loginDiv);

    // Focus on the username input when the page loads
    setTimeout(() => {
        usernameInput.focus();
    }, 100);
}

document.addEventListener("DOMContentLoaded", () => {
    let cssBase = document.createElement("link");
    cssBase.rel = "stylesheet";
    let loginCss = cssBase.cloneNode() as HTMLLinkElement;
    loginCss.href = "/src/components/login/login.css";
    document.head.appendChild(loginCss);
    let signUpCss = cssBase.cloneNode() as HTMLLinkElement;
    signUpCss.href = "/src/components/signUp/signUp.css";
    document.head.appendChild(signUpCss);
    let homeCss = cssBase.cloneNode() as HTMLLinkElement;
    homeCss.href = "/src/components/home/home.css";
    document.head.appendChild(homeCss);
    createLoginPage();
});
