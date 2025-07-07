import { createLoginPage } from "../login/login"
import type { userLogin } from "../classes/classes"
import { createButtonElement, createFormElement, createInputElement, createSeparator } from "../generals/createElements"

async function handleSignUp(event?: Event): Promise<void> {
  if (event) {
    event.preventDefault()
  }

  const nameInput = document.getElementById("nameInput") as HTMLInputElement
  const surnameInput = document.getElementById("surnameInput") as HTMLInputElement
  const emailInput = document.getElementById("emailInput") as HTMLInputElement
  const passwordInput = document.getElementById("passwordInput") as HTMLInputElement

  const user: userLogin = {
    name: nameInput?.value.trim(),
    surname: surnameInput?.value.trim(),
    username: nameInput?.value.trim(),
    password: passwordInput?.value.trim(),
    email: emailInput?.value.trim(),
  }

  // Validate input
  if (!user.username || !user.password || !user.email) {
    showMessage("PLEASE FILL IN ALL REQUIRED FIELDS", "error")
    return
  }

  if (user.password.length < 6) {
    showMessage("PASSWORD MUST BE AT LEAST 6 CHARACTERS LONG", "error")
    return
  }

  if (!isValidEmail(user.email)) {
    showMessage("PLEASE ENTER A VALID EMAIL ADDRESS", "error")
    return
  }

  // Disable button and show loading state
  setSignUpButtonState(true, "[CREATING ACCOUNT...]")

  try {
    console.log("Attempting registration for:", user.email)

    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })

    if (response.ok) {
      showMessage("ACCOUNT CREATED SUCCESSFULLY! REDIRECTING TO LOGIN...", "success")
      setTimeout(() => {
        // Pulisci il contenuto e ricarica la pagina di login
        const contentDiv = document.getElementById("content")!
        contentDiv.innerHTML = ""
        createLoginPage()
      }, 2000)
    } else {
      showMessage("REGISTRATION FAILED", "error")
    }
  } catch (error: any) {
    console.error("Registration error:", error)
    showMessage(error.message || "REGISTRATION FAILED. PLEASE TRY AGAIN.", "error")
  } finally {
    setSignUpButtonState(false, "[SIGN UP]")
  }
}

function setSignUpButtonState(disabled: boolean, text: string): void {
  const signUpButton = document.getElementById("signUpButton") as HTMLButtonElement
  if (signUpButton) {
    signUpButton.disabled = disabled
    signUpButton.textContent = text
    if (disabled) {
      signUpButton.classList.add("loading")
    } else {
      signUpButton.classList.remove("loading")
    }
  }
}

function showMessage(message: string, type: "success" | "error"): void {
  // Remove any existing messages
  const existingMessage = document.querySelector(".signup-message")
  if (existingMessage) {
    existingMessage.remove()
  }

  // Create new message element with Pip-Boy styling
  const messageDiv = document.createElement("div")
  messageDiv.className = `signup-message ${type === "success" ? "success-message" : "error-message"}`

  // Create message content with icon (Pip-Boy style)
  const messageIcon = document.createElement("div")
  messageIcon.className = "message-icon"
  messageIcon.textContent = type === "success" ? "✓" : "⚠"

  const messageText = document.createElement("div")
  messageText.className = "message-text"
  messageText.textContent = message

  messageDiv.appendChild(messageIcon)
  messageDiv.appendChild(messageText)

  // Insert message after the signup form
  const signUpForm = document.getElementById("signUpForm")
  if (signUpForm && signUpForm.parentNode) {
    signUpForm.parentNode.insertBefore(messageDiv, signUpForm.nextSibling)
  }

  // Auto-remove error messages after 5 seconds (but keep success messages)
  if (type === "error") {
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.remove()
      }
    }, 5000)
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Enhanced function to handle Enter key press
function handleEnterKeyPress(event: KeyboardEvent): void {
  if (event.key === "Enter") {
    event.preventDefault()
    console.log("Enter key pressed - attempting registration")
    handleSignUp(event)
  }
}

export function openSignUpForm() {
  console.log("Opening Pip-Boy Registration Terminal...")

  // Clear content
  const contentDiv = document.getElementById("content")!
  contentDiv.innerHTML = ""

  // Create Pip-Boy container structure
  const pipboyContainer = document.createElement("div")
  pipboyContainer.className = "pipboy-container"

  const pipboyScreen = document.createElement("div")
  pipboyScreen.className = "pipboy-screen"

  const pipboyTerminal = document.createElement("div")
  pipboyTerminal.className = "pipboy-terminal booting"

  // Create terminal header
  const terminalHeader = document.createElement("div")
  terminalHeader.className = "terminal-header"
  terminalHeader.innerHTML = `
    <div class="terminal-title">ROBCO INDUSTRIES UNIFIED OPERATING SYSTEM</div>
    <div class="terminal-subtitle">NEW USER REGISTRATION MODULE</div>
    <div class="terminal-version">-SERVER 01-</div>
  `

  // Create main signup div with Pip-Boy styling
  const signUpDiv = document.createElement("div")
  signUpDiv.id = "signUpDiv"
  signUpDiv.className = "signup-container"

  // Add status line
  const statusLine = document.createElement("div")
  statusLine.className = "status-line"
  statusLine.innerHTML = `
    <span class="status-indicator"></span>
    <span>REGISTRATION MODULE: ACTIVE</span>
  `
  signUpDiv.appendChild(statusLine)

  const signUpForm = createFormElement("signUpForm", "USER REGISTRATION")

  const nameInput = createInputElement("nameInput", "text", "FIRST NAME", "given-name")

  const surnameInput = createInputElement("surnameInput", "text", "LAST NAME", "family-name")

  const emailInput = createInputElement("emailInput", "email", "EMAIL ADDRESS", "email")

  const passwordInput = createInputElement("passwordInput", "password", "PASSWORD", "new-password")

  const signUpButton = createButtonElement("signUpButton", "[SIGN UP]", handleSignUp)

  const separator = createSeparator("2px", "#00ff00")

  const toLoginButton = createButtonElement("toLoginButton", "[BACK TO LOGIN]", () => {
    createLoginPage()
  })

  // Add form submission handler
  signUpForm.addEventListener("submit", (e) => {
    e.preventDefault()
    handleSignUp()
  })

  // Append elements to form
  signUpForm.appendChild(nameInput)
  signUpForm.appendChild(surnameInput)
  signUpForm.appendChild(emailInput)
  signUpForm.appendChild(passwordInput)
  signUpForm.appendChild(signUpButton)

  // Append elements to div
  signUpDiv.appendChild(signUpForm)
  signUpDiv.appendChild(separator)
  signUpDiv.appendChild(toLoginButton)

  // Create terminal footer
  const terminalFooter = document.createElement("div")
  terminalFooter.className = "terminal-footer"
  terminalFooter.innerHTML = `
    <div class="footer-line">
      <span>VAULT-TEC REGISTRATION PROTOCOL ACTIVE</span>
      <span class="timestamp" id="timestamp">${new Date().toLocaleTimeString()}</span>
    </div>
  `

  // Assemble terminal
  pipboyTerminal.appendChild(terminalHeader)
  pipboyTerminal.appendChild(signUpDiv)
  pipboyTerminal.appendChild(terminalFooter)

  // Create screen effects
  const scanlines = document.createElement("div")
  scanlines.className = "scanlines"
  const screenFlicker = document.createElement("div")
  screenFlicker.className = "screen-flicker"

  // Assemble screen
  pipboyScreen.appendChild(pipboyTerminal)
  pipboyScreen.appendChild(scanlines)
  pipboyScreen.appendChild(screenFlicker)

  // Assemble container
  pipboyContainer.appendChild(pipboyScreen)

  // Add to content
  contentDiv.appendChild(pipboyContainer)

  // Boot-up animation
  setTimeout(() => {
    pipboyTerminal.classList.remove("booting")
    pipboyTerminal.classList.add("ready")
  }, 800) // CAMBIATO: da 2000ms a 800ms

  // Focus on first input
  setTimeout(() => {
    const firstInput = document.getElementById("nameInput") as HTMLInputElement
    if (firstInput) firstInput.focus()
  }, 900) // CAMBIATO: da 2100ms a 900ms

  // Update timestamp every second
  setInterval(() => {
    const timestampEl = document.getElementById("timestamp")
    if (timestampEl) {
      timestampEl.textContent = new Date().toLocaleTimeString()
    }
  }, 1000)

  console.log("Sign up form created and appended to body")
}
