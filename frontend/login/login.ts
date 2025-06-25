import { openSignUpForm } from "../signUp/signUp";
import {
    createButtonElement,
    createFormElement,
    createInputElement,
    createSeparator,
} from "../generals/createElements";
import { googleLoginFunction } from "./googleLogin";
//import { sendPostRequest } from "../generals/generalUse";
import { createChatPage } from "../chat/chat";
import { userLogin } from "../classes/userLogin";

async function loginFunction(event?: Event): Promise<void> {
    if (event) {
        event.preventDefault();
    }

    const emailInput = document.getElementById("emailInput") as HTMLInputElement;
    const passwordInput = document.getElementById("passwordInput") as HTMLInputElement;
    //const loginButton = document.getElementById("loginButton") as HTMLButtonElement;

    const user: userLogin = {
            name: '',
            surname: '',
            username: '',
            password: passwordInput.value.trim(),
            email: emailInput.value.trim(),
        };

    // Validate input
    if (!user.email || !user.password) {
        showMessage("Please enter both email and password", "error");
        return;
    }

    // Disable button and show loading state
    setLoginButtonState(true, "Logging in...");

    try {
        console.log('Attempting login for:', user.email);
        
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });

        if (response.ok) {
            showMessage(
                "Login success!",
                "success"
            );
            setTimeout(() => {
                createChatPage();
            }, 1000);
        } else {
            showMessage("Login failed", "error");
        }

        //if (response.success && response.user) {
        //    console.log('Login successful:', response.user);
            
        //    // Store user session data
        //    localStorage.setItem('userSession', JSON.stringify({
        //        id: response.user.id,
        //        username: response.user.username,
        //        email: response.user.email,
        //        name: response.user.name,
        //        picture: response.user.picture,
        //        role: response.user.role,
        //        loginType: 'local',
        //        loginTime: new Date().toISOString()
        //    }));

        //    showMessage("Login successful! Redirecting...", "success");
            
        //    // Redirect to chat page after a short delay
        //    setTimeout(() => {
        //        createChatPage();
        //    }, 1000);

        //} else {
        //    console.error('Login failed:', response);
        //    showMessage(response.error || 'Login failed', "error");
        //}

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
    
    let emailInput = createInputElement(
        "emailInput",
        "text",
        "email",
        "email"
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
    emailInput.addEventListener('keypress', handleEnterKeyPress);
    passwordInput.addEventListener('keypress', handleEnterKeyPress);

    // Also add keydown listener for better compatibility
    emailInput.addEventListener('keydown', (e) => {
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

    loginForm.appendChild(emailInput);
    loginForm.appendChild(passwordInput);
    loginForm.appendChild(loginButton);
    
    loginDiv.appendChild(loginForm);
    loginDiv.appendChild(separator);
    loginDiv.appendChild(googleButton);
    loginDiv.appendChild(separator.cloneNode(true));
    loginDiv.appendChild(signUpButton);

    document.getElementById("content")!.innerHTML = "";
    document.getElementById("content")!.appendChild(loginDiv);

    // Focus on the email input when the page loads
    setTimeout(() => {
        emailInput.focus();
    }, 100);
}

document.addEventListener("DOMContentLoaded", () => {
    createLoginPage();
});
