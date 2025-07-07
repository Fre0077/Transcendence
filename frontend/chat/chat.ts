import type { newChat } from "../classes/classes"

function searchChat(event?: Event) {
  event?.preventDefault()
  console.log("Search button clicked")
}

async function getUserList(): Promise<Array<{ id: number; linkId: number; name: string }>> {
  const userList = await fetch("http://localhost:3000/user-list", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ host: getUsername() }),
  })

  if (userList.ok) {
    const data = await userList.json()
    if (typeof data.reply === "string") {
      return JSON.parse(data.reply)
    }
    return data.reply
  }
  return []
}

async function createChat(chatData: newChat) {
  try {
    const response = await fetch("http://localhost:3000/new-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(chatData),
    })

    if (response.ok) {
      const data = await response.json()
      createChatPage()
      console.log("Chat created successfully:", data)
    } else {
      const errorData = await response.json()
      console.error("Error creating chat:", errorData)
    }
  } catch (error) {
    console.error("Network error while creating chat:", error)
    alert("Network error while creating chat.")
  }
}

async function createNewChat() {
  const popup = document.createElement("div")
  popup.id = "newChatPopup"
  popup.className = "pipboy-popup"

  const usersList: Array<{ id: number; linkId: number; name: string }> = await getUserList()
  console.log("Users List:", usersList)

  if (!Array.isArray(usersList) || usersList.length === 0) {
    alert("No users found to create a chat with.")
    return
  }

  const popupContent = document.createElement("div")
  popupContent.id = "newChatContent"
  popupContent.className = "pipboy-popup-content"
  popupContent.innerHTML = `
        <div class="popup-header">
            <div class="popup-title">CREATE NEW COMMUNICATION CHANNEL</div>
            <div class="popup-status">
                <span class="status-indicator"></span>
                <span>READY</span>
            </div>
        </div>
        <form id="newChatForm" class="pipboy-form">
            <div class="input-group">
                <label for="chatName" class="pipboy-label">CHANNEL NAME:</label>
                <input type="text" id="chatName" name="chatName" class="pipboy-input" required>
            </div>
            <div class="input-group">
                <label class="pipboy-label">SELECT MEMBERS:</label>
                <ul id="membersList" class="members-list"></ul>
            </div>
            <div class="button-group">
                <button type="submit" id="submitButton" class="pipboy-button primary">CREATE CHANNEL</button>
                <button type="button" id="closePopup" class="pipboy-button">CANCEL</button>
            </div>
        </form>
    `

  popup.appendChild(popupContent)

  const submitButton = popupContent.querySelector("#submitButton") as HTMLButtonElement
  submitButton.addEventListener("click", (event) => {
    event.preventDefault()
    const chatName = (popupContent.querySelector("#chatName") as HTMLInputElement).value

    const selectedMembers: string[] = []
    const checkboxes = popupContent.querySelectorAll('input[type="checkbox"]:checked') as NodeListOf<HTMLInputElement>
    checkboxes.forEach((checkbox) => {
      selectedMembers.push(checkbox.value)
    })

    const newChatData: newChat = {
      host: getUsername(),
      chatName: chatName,
      members: selectedMembers,
    }

    createChat(newChatData)
    document.body.removeChild(popup)
  })

  const closeButton = popupContent.querySelector("#closePopup") as HTMLButtonElement
  closeButton.addEventListener("click", () => {
    document.body.removeChild(popup)
  })

  const membersList = popupContent.querySelector("#membersList") as HTMLUListElement
  usersList.forEach((user) => {
    const listItem = document.createElement("li")
    listItem.className = "member-item"

    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.value = user.name
    checkbox.id = `member-${user.linkId || user.id}`
    checkbox.className = "pipboy-checkbox"

    const label = document.createElement("label")
    label.htmlFor = `member-${user.linkId || user.id}`
    label.innerText = `> ${user.name.toUpperCase()}`
    label.className = "pipboy-checkbox-label"

    listItem.appendChild(checkbox)
    listItem.appendChild(label)
    membersList.appendChild(listItem)
  })

  popup.addEventListener("click", (event) => {
    if (event.target === popup) {
      document.body.removeChild(popup)
    }
  })

  document.body.appendChild(popup)
}

export function getUsername(): string {
  const userSession = sessionStorage.getItem("userSession")
  if (!userSession) return ""
  const username = JSON.parse(userSession)["username"]
  console.log(username)
  return username
}

async function getChats() {
  const username = getUsername()
  if (!username) return []

  const response = await fetch("http://localhost:3000/chat-list", {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: username,
  })

  if (response.ok) {
    const data = JSON.parse(await response.text())
    const chats = JSON.parse(data.chats)
    console.log(chats)
    return chats
  }
  return []
}

function createHeaderDiv() {
  const headerDiv = document.createElement("div")
  headerDiv.className = "chat-header"

  const topDiv = document.createElement("div")
  topDiv.className = "header-top"

  const title = document.createElement("div")
  title.className = "header-title"
  title.innerText = "COMMUNICATION CHANNELS"

  const homeButton = document.createElement("div")
  homeButton.className = "home-button"
  homeButton.innerHTML = "[HOME]"
  homeButton.addEventListener("click", () => {
    window.location.pathname = "/home"
  })

  topDiv.appendChild(title)
  topDiv.appendChild(homeButton)

  const searchGroup = document.createElement("div")
	searchGroup.className = "search-group"

	const searchInput = document.createElement("input")
	searchInput.id = "searchChatInput"
	searchInput.type = "text"
	searchInput.placeholder = "SEARCH CHANNELS..."
	searchInput.className = "pipboy-input"

	const searchButton = document.createElement("button")
	searchButton.id = "searchChatButton"
	searchButton.className = "pipboy-button"
	searchButton.innerText = "SEARCH"
	searchButton.addEventListener("click", searchChat)

	searchGroup.appendChild(searchInput)
	searchGroup.appendChild(searchButton)

	headerDiv.appendChild(topDiv)
	headerDiv.appendChild(searchGroup)

  return headerDiv
}

async function openChat(chat: { id: number; name: string }) {
  // Implementation for opening a chat
}

async function createChatsDiv() {
  const chatsDiv = document.createElement("div")
  chatsDiv.id = "chats"
  chatsDiv.className = "chat-sidebar"

  const headerDiv = createHeaderDiv()
  chatsDiv.appendChild(headerDiv)

  const chatsList: Array<{ id: number; name: string }> = await getChats()

  const chatsContainer = document.createElement("div")
  chatsContainer.className = "chats-container"

  chatsList.forEach((chat) => {
    const chatDiv = document.createElement("div")
    chatDiv.className = "chat-item"
    chatDiv.innerHTML = `
            <div class="chat-name">> ${chat.name.toUpperCase()}</div>
            <div class="chat-status">ACTIVE</div>
        `
    chatDiv.addEventListener("click", async () => {
      // Remove active class from all items
      document.querySelectorAll(".chat-item").forEach((item) => item.classList.remove("active"))
      // Add active class to clicked item
      chatDiv.classList.add("active")
      openChat(chat)
    })
    chatsContainer.appendChild(chatDiv)
  })

  chatsDiv.appendChild(chatsContainer)

  const newChatButton = document.createElement("button")
  newChatButton.id = "newChatButton"
  newChatButton.className = "pipboy-button primary"
  newChatButton.innerText = "NEW CHANNEL"
  newChatButton.addEventListener("click", createNewChat)

  chatsDiv.appendChild(newChatButton)

  return chatsDiv
}

function createCurrentChatDiv() {
  const currentChatDiv = document.createElement("div")
  currentChatDiv.id = "currentChat"
  currentChatDiv.className = "chat-main"

  const chatHeader = document.createElement("div")
  chatHeader.className = "chat-main-header"
  chatHeader.innerHTML = `
        <div class="chat-title">COMMUNICATION TERMINAL</div>
        <div class="chat-status">
            <span class="status-indicator"></span>
            <span>STANDBY</span>
        </div>
    `

  const messagesDiv = document.createElement("div")
  messagesDiv.id = "messages"
  messagesDiv.className = "messages-container"

  const messageInputForm = document.createElement("form")
  messageInputForm.id = "messageInputForm"
  messageInputForm.className = "message-input-form"

  const messageInput = document.createElement("input")
  messageInput.id = "messageInput"
  messageInput.type = "text"
  messageInput.placeholder = "ENTER MESSAGE..."
  messageInput.className = "pipboy-input message-input"

  const sendButton = document.createElement("button")
  sendButton.id = "sendButton"
  sendButton.className = "pipboy-button"
  sendButton.innerText = "SEND"
  sendButton.addEventListener("click", (event) => {
    event?.preventDefault()
    console.log("Send button clicked")
  })

  messageInputForm.appendChild(messageInput)
  messageInputForm.appendChild(sendButton)

  currentChatDiv.appendChild(chatHeader)
  currentChatDiv.appendChild(messagesDiv)
  currentChatDiv.appendChild(messageInputForm)

  return currentChatDiv
}

export async function createChatPage() {
  document.title = "Chat - Pip-Boy Terminal"

  // Clear content
  const contentDiv = document.getElementById("content")!
  contentDiv.innerHTML = ""

  // Create main container
  const pipboyContainer = document.createElement("div")
  pipboyContainer.className = "pipboy-container"

  // Create screen
  const pipboyScreen = document.createElement("div")
  pipboyScreen.className = "pipboy-screen"

  // Create terminal
  const pipboyTerminal = document.createElement("div")
  pipboyTerminal.className = "pipboy-terminal booting"

  // Create terminal header
  const terminalHeader = document.createElement("div")
  terminalHeader.className = "terminal-header"
  terminalHeader.innerHTML = `
        <div class="terminal-title">ROBCO INDUSTRIES UNIFIED OPERATING SYSTEM</div>
        <div class="terminal-subtitle">COMMUNICATION HUB</div>
        <div class="terminal-version">-TERMINAL 01-</div>
    `

  // Create chat container
  const chatContainer = document.createElement("div")
  chatContainer.className = "chat-container"

  const chatsDiv = await createChatsDiv()
  const currentChatDiv = createCurrentChatDiv()

  chatContainer.appendChild(chatsDiv)
  chatContainer.appendChild(currentChatDiv)

  // Create terminal footer
  const terminalFooter = document.createElement("div")
  terminalFooter.className = "terminal-footer"
  terminalFooter.innerHTML = `
        <div class="footer-line">
            <span>VAULT-TEC COMMUNICATION SYSTEM ACTIVE</span>
            <span class="timestamp" id="timestamp">${new Date().toLocaleTimeString()}</span>
        </div>
    `

  // Assemble terminal
  pipboyTerminal.appendChild(terminalHeader)
  pipboyTerminal.appendChild(chatContainer)
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

  // Update CSS link
  const cssLink = document.getElementById("content-css") as HTMLLinkElement
  if (cssLink) {
    cssLink.href = "./chat/chat.css"
  }

  // Boot-up animation
  setTimeout(() => {
    pipboyTerminal.classList.remove("booting")
    pipboyTerminal.classList.add("ready")
  }, 800)

  // Update timestamp every second
  setInterval(() => {
    const timestampEl = document.getElementById("timestamp")
    if (timestampEl) {
      timestampEl.textContent = new Date().toLocaleTimeString()
    }
  }, 1000)
}
