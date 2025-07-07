import { openSignUpForm } from "../signUp/signUp"
import { googleLoginFunction } from "./googleLogin"
import type { userLogin } from "../classes/classes"
import { getUsername } from "../chat/chat"

async function loginFunction(event?: Event): Promise<void> {
  if (event) {
    event.preventDefault()
  }

  const emailInput = document.getElementById("emailInput") as HTMLInputElement
  const passwordInput = document.getElementById("passwordInput") as HTMLInputElement

  const user: userLogin = {
    name: "",
    surname: "",
    username: "",
    password: passwordInput.value.trim(),
    email: emailInput.value.trim(),
  }

  // Validate input
  if (!user.email || !user.password) {
    showMessage("PLEASE ENTER BOTH EMAIL AND PASSWORD", "error")
    return
  }

  // Disable button and show loading state
  setLoginButtonState(true, "[AUTHENTICATING...]")

  try {
    console.log("Attempting login for:", user.email)

    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })

    if (response.ok) {
      const data = await response.json()
      sessionStorage.setItem(
        "userSession",
        JSON.stringify({
          username: data.message,
        }),
      )
      showMessage("LOGIN SUCCESSFUL! ACCESSING SYSTEM...", "success")
      setTimeout(() => {
        window.location.pathname = "/home"
      }, 1000)
    } else {
      showMessage("ACCESS DENIED - INVALID CREDENTIALS", "error")
    }
  } catch (error: any) {
    console.error("Login error:", error)
    showMessage("SYSTEM ERROR - CONNECTION FAILED", "error")
  } finally {
    setLoginButtonState(false, "[LOGIN]")
  }
}

function setLoginButtonState(disabled: boolean, text: string): void {
  const loginButton = document.getElementById("loginButton") as HTMLButtonElement
  if (loginButton) {
    loginButton.disabled = disabled
    loginButton.textContent = text
    if (disabled) {
      loginButton.classList.add("loading")
    } else {
      loginButton.classList.remove("loading")
    }
  }
}

function showMessage(message: string, type: "success" | "error"): void {
  // Remove any existing messages
  const existingMessage = document.querySelector(".login-message")
  if (existingMessage) {
    existingMessage.remove()
  }

  // Create new message element
  const messageDiv = document.createElement("div")
  messageDiv.className = `login-message ${type === "success" ? "success-message" : "error-message"}`

  // Create message content with icon
  const messageIcon = document.createElement("div")
  messageIcon.className = "message-icon"
  messageIcon.textContent = type === "success" ? "✓" : "⚠"

  const messageText = document.createElement("div")
  messageText.className = "message-text"
  messageText.textContent = message

  messageDiv.appendChild(messageIcon)
  messageDiv.appendChild(messageText)

  // Inserisce il messaggio SOPRA "ALTERNATIVE ACCESS"
  const separator = document.querySelector(".separator")
  if (separator && separator.parentNode) {
    separator.parentNode.insertBefore(messageDiv, separator)
  } else {
    // Fallback: inserisce dopo il form se non trova separator
    const loginForm = document.getElementById("loginForm")
    if (loginForm && loginForm.parentNode) {
      loginForm.parentNode.insertBefore(messageDiv, loginForm.nextSibling)
    }
  }

  // Auto-remove error messages after 5 seconds
  if (type === "error") {
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.remove()
      }
    }, 5000)
  }
}

// Enhanced function to handle Enter key press
function handleEnterKeyPress(event: KeyboardEvent): void {
  if (event.key === "Enter") {
    event.preventDefault()
    console.log("Enter key pressed - attempting login")
    loginFunction(event)
  }
}

// Function to create Pip-Boy styled elements
function createPipBoyElement(tag: string, id: string, className: string, textContent?: string): HTMLElement {
  const element = document.createElement(tag)
  element.id = id
  element.className = className
  if (textContent) {
    element.textContent = textContent
  }
  return element
}

function createPipBoyInput(id: string, type: string, placeholder: string, autocomplete?: string): HTMLInputElement {
  const input = document.createElement("input") as HTMLInputElement
  input.id = id
  input.type = type
  input.className = "pipboy-input"
  input.placeholder = placeholder
  if (autocomplete) {
    input.autocomplete = autocomplete
  }
  return input
}

function createPipBoyButton(
  id: string,
  text: string,
  clickHandler: Function,
  className = "pipboy-button",
): HTMLButtonElement {
  const button = document.createElement("button") as HTMLButtonElement
  button.id = id
  button.className = className
  button.textContent = text
  button.addEventListener("click", (e) => clickHandler(e))
  return button
}

export function createLoginPage() {
  const username = getUsername()
  if (username !== "" && username !== null && username !== undefined) {
    console.log("User already logged in, redirecting to home page")
    window.location.pathname = "/home"
    return
  }

  // Clear content
  const contentDiv = document.getElementById("content")!
  contentDiv.innerHTML = ""

  // Create main container
  const pipboyContainer = createPipBoyElement("div", "pipboy-container", "pipboy-container")

  // Create screen
  const pipboyScreen = createPipBoyElement("div", "pipboy-screen", "pipboy-screen")

  // Create terminal
  const pipboyTerminal = createPipBoyElement("div", "pipboy-terminal", "pipboy-terminal booting")

  // Create terminal header
  const terminalHeader = createPipBoyElement("div", "terminal-header", "terminal-header")
  const terminalTitle = createPipBoyElement(
    "div",
    "terminal-title",
    "terminal-title",
    "ROBCO INDUSTRIES UNIFIED OPERATING SYSTEM",
  )
  const terminalSubtitle = createPipBoyElement(
    "div",
    "terminal-subtitle",
    "terminal-subtitle",
    "COPYRIGHT 2075-2077 ROBCO INDUSTRIES",
  )
  const terminalVersion = createPipBoyElement("div", "terminal-version", "terminal-version", "-SERVER 01-")

  terminalHeader.appendChild(terminalTitle)
  terminalHeader.appendChild(terminalSubtitle)
  terminalHeader.appendChild(terminalVersion)

  // Create login container
  const loginContainer = createPipBoyElement("div", "login-container", "login-container")

  // Create login header
  const loginHeader = createPipBoyElement("div", "login-header", "login-header")
  const loginTitle = createPipBoyElement("h1", "login-title", "login-title", "USER AUTHENTICATION REQUIRED")
  const statusLine = createPipBoyElement("div", "status-line", "status-line")
  const statusIndicator = createPipBoyElement("span", "status-indicator", "status-indicator")
  const statusText = createPipBoyElement("span", "status-text", "", "SYSTEM STATUS: ONLINE")

  statusLine.appendChild(statusIndicator)
  statusLine.appendChild(statusText)
  loginHeader.appendChild(loginTitle)
  loginHeader.appendChild(statusLine)

  // Create form
  const loginForm = createPipBoyElement("form", "loginForm", "login-form") as HTMLFormElement

  // Create input groups
  const emailGroup = createPipBoyElement("div", "email-group", "input-group")
  const emailLabel = createPipBoyElement("label", "email-label", "input-label", "> EMAIL ADDRESS:")
  ;(emailLabel as HTMLLabelElement).htmlFor = "emailInput"
  const emailInput = createPipBoyInput("emailInput", "email", "USER@VAULT-TEC.COM", "email")

  emailGroup.appendChild(emailLabel)
  emailGroup.appendChild(emailInput)

  const passwordGroup = createPipBoyElement("div", "password-group", "input-group")
  const passwordLabel = createPipBoyElement("label", "password-label", "input-label", "> PASSWORD:")
  ;(passwordLabel as HTMLLabelElement).htmlFor = "passwordInput"
  const passwordInput = createPipBoyInput("passwordInput", "password", "••••••••••••", "current-password")

  passwordGroup.appendChild(passwordLabel)
  passwordGroup.appendChild(passwordInput)

  // Create button group
  const buttonGroup = createPipBoyElement("div", "button-group", "button-group")
  const loginButton = createPipBoyButton("loginButton", "[LOGIN]", loginFunction, "pipboy-button primary")
  loginButton.type = "submit"

  buttonGroup.appendChild(loginButton)

  // Assemble form
  loginForm.appendChild(emailGroup)
  loginForm.appendChild(passwordGroup)
  loginForm.appendChild(buttonGroup)

  // Create separator
  const separator = createPipBoyElement("div", "separator", "separator")
  const separatorLine1 = createPipBoyElement("div", "separator-line-1", "separator-line")
  const separatorText = createPipBoyElement("span", "separator-text", "separator-text", "ALTERNATIVE ACCESS")
  const separatorLine2 = createPipBoyElement("div", "separator-line-2", "separator-line")

  separator.appendChild(separatorLine1)
  separator.appendChild(separatorText)
  separator.appendChild(separatorLine2)

  // Create alternative buttons
  const altButtons = createPipBoyElement("div", "alt-buttons", "alt-buttons")
  const googleButton = createPipBoyButton("googleButton", "[GOOGLE AUTH MODULE]", googleLoginFunction, "pipboy-button")

  // Aggiunta linea divisoria tra i pulsanti
  const buttonDivider = createPipBoyElement("div", "button-divider", "button-divider")

  const signUpButton = createPipBoyButton("signUpButton", "[NEW USER REGISTRATION]", openSignUpForm, "pipboy-button")

  altButtons.appendChild(googleButton)
  altButtons.appendChild(buttonDivider)
  altButtons.appendChild(signUpButton)

  // Assemble login container (SENZA il footer qui)
  loginContainer.appendChild(loginHeader)
  loginContainer.appendChild(loginForm)
  loginContainer.appendChild(separator)
  loginContainer.appendChild(altButtons)

  // RISOLTO: Create terminal footer SEPARATAMENTE e aggiungilo direttamente al terminal
  const terminalFooter = createPipBoyElement("div", "terminal-footer", "terminal-footer")
  const footerLine = createPipBoyElement("div", "footer-line", "footer-line")
  const footerText = createPipBoyElement("span", "footer-text", "", "VAULT-TEC SECURITY PROTOCOL ACTIVE")
  const timestamp = createPipBoyElement("span", "timestamp", "timestamp", new Date().toLocaleTimeString())

  footerLine.appendChild(footerText)
  footerLine.appendChild(timestamp)
  terminalFooter.appendChild(footerLine)

  // RISOLTO: Assemble terminal - footer viene aggiunto DOPO il login container
  pipboyTerminal.appendChild(terminalHeader)
  pipboyTerminal.appendChild(loginContainer)
  pipboyTerminal.appendChild(terminalFooter) // Footer aggiunto qui, non dentro loginContainer

  // Create screen effects
  const scanlines = createPipBoyElement("div", "scanlines", "scanlines")
  const screenFlicker = createPipBoyElement("div", "screen-flicker", "screen-flicker")

  // Assemble screen
  pipboyScreen.appendChild(pipboyTerminal)
  pipboyScreen.appendChild(scanlines)
  pipboyScreen.appendChild(screenFlicker)

  // Assemble container
  pipboyContainer.appendChild(pipboyScreen)

  // Add to content
  contentDiv.appendChild(pipboyContainer)

  // Add event listeners
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault()
    console.log("Form submitted - attempting login")
    loginFunction(e)
  })

  // Add Enter key listeners to both input fields
  emailInput.addEventListener("keypress", handleEnterKeyPress)
  passwordInput.addEventListener("keypress", handleEnterKeyPress)

  emailInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      loginFunction(e)
    }
  })

  passwordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      loginFunction(e)
    }
  })

  // Boot-up animation
  setTimeout(() => {
    pipboyTerminal.classList.remove("booting")
    pipboyTerminal.classList.add("ready")
  }, 800) // CAMBIATO: da 2000ms a 800ms

  // Focus on the email input when the page loads
  setTimeout(() => {
    emailInput.focus()
  }, 900) // CAMBIATO: da 2100ms a 900ms

  // Update timestamp every second
  setInterval(() => {
    timestamp.textContent = new Date().toLocaleTimeString()
  }, 1000)
}
