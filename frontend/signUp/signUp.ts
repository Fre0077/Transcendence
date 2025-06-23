import {
    createButtonElement,
    createFormElement,
    createInputElement,
    createSeparator,
} from "../generals/createElements";
import { createLoginPage } from "../login/login";
import { sendPostRequest } from "../generals/generalUse";

async function handleSignUp(event?: Event): Promise<void> {
    if (event) {
        event.preventDefault();
    }

    const usernameInput = document.getElementById("usernameInput") as HTMLInputElement;
    const passwordInput = document.getElementById("passwordInput") as HTMLInputElement;
    const emailInput = document.getElementById("emailInput") as HTMLInputElement;
    const nameInput = document.getElementById("nameInput") as HTMLInputElement;
    const signUpButton = document.getElementById("signUpButton") as HTMLButtonElement;

    const username = usernameInput?.value.trim();
    const password = passwordInput?.value.trim();
    const email = emailInput?.value.trim();
    const name = nameInput?.value.trim();

    console.log("Sign up attempt:", { username, email, name });

    // Validate input
    if (!username || !password || !email) {
        showMessage("Please fill in all required fields", "error");
        return;
    }

    if (password.length < 6) {
        showMessage("Password must be at least 6 characters long", "error");
        return;
    }

    if (!isValidEmail(email)) {
        showMessage("Please enter a valid email address", "error");
        return;
    }

    // Disable button and show loading state
    setSignUpButtonState(true, "Creating account...");

    try {
        const response = await sendPostRequest(
            'http://localhost:3000/api/auth/register',
            { username, password, email, name: name || username },
            'application/json'
        );

        if (response.success && response.user) {
            console.log('Registration successful:', response.user);
            showMessage("Account created successfully! Redirecting to login...", "success");
            
            // Redirect to login page after a short delay
            setTimeout(() => {
                createLoginPage();
            }, 2000);

        } else {
            console.error('Registration failed:', response);
            showMessage(response.error || 'Registration failed', "error");
        }

    } catch (error: any) {
        console.error('Registration error:', error);
        showMessage(error.message || 'Registration failed. Please try again.', "error");
    } finally {
        setSignUpButtonState(false, "Sign Up");
    }
}

function setSignUpButtonState(disabled: boolean, text: string): void {
    const signUpButton = document.getElementById("signUpButton") as HTMLButtonElement;
    if (signUpButton) {
        signUpButton.disabled = disabled;
        signUpButton.textContent = text;
        if (disabled) {
            signUpButton.classList.add("loading");
        } else {
            signUpButton.classList.remove("loading");
        }
    }
}

function showMessage(message: string, type: "success" | "error"): void {
    // Remove any existing messages
    const existingMessage = document.querySelector('.signup-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `signup-message ${type === 'success' ? 'success-message' : 'error-message'}`;
    messageDiv.textContent = message;

    // Insert message after the signup form
    const signUpForm = document.getElementById('signUpForm');
    if (signUpForm && signUpForm.parentNode) {
        signUpForm.parentNode.insertBefore(messageDiv, signUpForm.nextSibling);
    }

    // Auto-remove error messages after 5 seconds (but keep success messages)
    if (type === 'error') {
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function openSignUpForm() {
    console.log("Sign Up Form Opened");

    let signUpDiv = document.createElement("div");
    signUpDiv.id = "signUpDiv";

    let signUpForm = createFormElement("signUpForm", "Create Account");

    let nameInput = createInputElement(
        "nameInput",
        "text",
        "Full Name (Optional)",
        "name"
    );

    let usernameInput = createInputElement(
        "usernameInput",
        "text",
        "Username",
        "username"
    );

    let emailInput = createInputElement(
        "emailInput", 
        "email", 
        "Email Address", 
        "email"
    );

    let passwordInput = createInputElement(
        "passwordInput",
        "password",
        "Password (min. 6 characters)",
        "new-password"
    );

    let signUpButton = createButtonElement(
        "signUpButton",
        "Sign Up",
        handleSignUp
    );

    let separator = createSeparator("4px", "#07d");

    let toLoginButton = createButtonElement(
        "toLoginButton",
        "Back to Login",
        () => {
            createLoginPage();
        }
    );

    // Add form submission handler
    signUpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSignUp();
    });

    // Append elements to form
    signUpForm.appendChild(nameInput);
    signUpForm.appendChild(usernameInput);
    signUpForm.appendChild(emailInput);
    signUpForm.appendChild(passwordInput);
    signUpForm.appendChild(signUpButton);

    // Append elements to div
    signUpDiv.appendChild(signUpForm);
    signUpDiv.appendChild(separator);
    signUpDiv.appendChild(toLoginButton);

    document.getElementById("content")!.innerHTML = "";
    document.getElementById("content")!.appendChild(signUpDiv);

    console.log("Sign up form created and appended to body");
}
