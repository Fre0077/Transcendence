function createProfileDiv() {
  const profileDiv = document.createElement("div")
  profileDiv.className = "profile-section"

  // Profile header
  const profileHeader = document.createElement("div")
  profileHeader.className = "section-header"
  profileHeader.innerHTML = `
        <div class="section-title">USER PROFILE DATA</div>
        <div class="section-status">
            <span class="status-indicator"></span>
            <span>ACTIVE</span>
        </div>
    `
  profileDiv.appendChild(profileHeader)

  // Profile content - CON IMMAGINE
  const profileContent = document.createElement("div")
  profileContent.className = "profile-content"

  // Profile image container
  const imageContainer = document.createElement("div")
  imageContainer.className = "profile-image-container"

  const profileImage = document.createElement("img")
  profileImage.src = "./assets/profile.png"
  profileImage.alt = "Profile Picture"
  profileImage.className = "profile-image"
  imageContainer.appendChild(profileImage)

  // User info container
  const userInfoDiv = document.createElement("div")
  userInfoDiv.className = "user-info"

  const profileUsername = document.createElement("div")
  profileUsername.className = "profile-username"
  profileUsername.innerHTML = `<span class="label">> USERNAME:</span> <span class="value">VAULT_DWELLER</span>`
  userInfoDiv.appendChild(profileUsername)

  const profileEmail = document.createElement("div")
  profileEmail.className = "profile-email"
  profileEmail.innerHTML = `<span class="label">> EMAIL:</span> <span class="value">USER@VAULT-TEC.COM</span>`
  userInfoDiv.appendChild(profileEmail)

  const profileStatus = document.createElement("div")
  profileStatus.className = "profile-status"
  profileStatus.innerHTML = `<span class="label">> STATUS:</span> <span class="value">ONLINE</span>`
  userInfoDiv.appendChild(profileStatus)

  profileContent.appendChild(imageContainer)
  profileContent.appendChild(userInfoDiv)

  // Bio section
  const bioSection = document.createElement("div")
  bioSection.className = "bio-section"
  bioSection.innerHTML = `
        <div class="bio-label">> PERSONAL LOG:</div>
        <div class="bio-text">VAULT-TEC RESIDENT - AUTHORIZED ACCESS LEVEL: ALPHA</div>
    `
  profileContent.appendChild(bioSection)

  profileDiv.appendChild(profileContent)
  return profileDiv
}

function logoutUser() {
  sessionStorage.setItem("userSession", JSON.stringify({}))
  window.location.pathname = "/login"
}

function loadSettingsPage() {
  console.log("Loading settings page...")
}

function loadPlayPage() {
  console.log("Loading play page...")
}

function createNavDiv() {
  const navDiv = document.createElement("div")
  navDiv.className = "nav-section"

  // Navigation header
  const navHeader = document.createElement("div")
  navHeader.className = "section-header"
  navHeader.innerHTML = `
        <div class="section-title">SYSTEM NAVIGATION</div>
        <div class="section-status">
            <span class="status-indicator"></span>
            <span>READY</span>
        </div>
    `
  navDiv.appendChild(navHeader)

  // Navigation content
  const navContent = document.createElement("div")
  navContent.className = "nav-content"

  const navItems = [
    { text: "SETTINGS", onClick: () => loadSettingsPage(), icon: "⚙" },
    { text: "CHAT", onClick: () => (window.location.pathname = "/chat"), icon: "📡" },
    { text: "PLAY", onClick: () => loadPlayPage(), icon: "🎮" },
    { text: "LOGOUT", onClick: () => logoutUser(), icon: "🚪" },
  ]

  navItems.forEach((item) => {
    const navButton = document.createElement("div")
    navButton.className = "pip-nav-item"

    // Create the button content SENZA ICONE
    navButton.innerHTML = `
    <div class="pip-nav-text">${item.text}</div>
  `

    // Add click event
    navButton.addEventListener("click", (e) => {
      e.preventDefault()
      item.onClick()
    })

    navContent.appendChild(navButton)
  })

  navDiv.appendChild(navContent)
  return navDiv
}

function createDashboardDiv() {
  const dashboardDiv = document.createElement("div")
  dashboardDiv.className = "dashboard-section"

  // Dashboard header
  const dashboardHeader = document.createElement("div")
  dashboardHeader.className = "section-header"
  dashboardHeader.innerHTML = `
        <div class="section-title">ENTERTAINMENT MODULES</div>
        <div class="section-status">
            <span class="status-indicator"></span>
            <span>AVAILABLE</span>
        </div>
    `
  dashboardDiv.appendChild(dashboardHeader)

  // Dashboard content
  const dashboardContent = document.createElement("div")
  dashboardContent.className = "dashboard-content"

  // Pong module
  const pongModule = document.createElement("div")
  pongModule.className = "game-module"
  pongModule.innerHTML = `
        <div class="module-header">
            <div class="module-title">PONG.EXE</div>
            <div class="module-status">READY</div>
        </div>
        <div class="module-content">
            <div class="module-description">
                CLASSIC ARCADE SIMULATION
                <br>STATUS: OPERATIONAL
                <br>PLAYERS: 1-2
            </div>
            <button class="module-button pipboy-button">[INITIALIZE]</button>
        </div>
    `

  // Game 2 module
  const game2Module = document.createElement("div")
  game2Module.className = "game-module"
  game2Module.innerHTML = `
        <div class="module-header">
            <div class="module-title">ARCADE.EXE</div>
            <div class="module-status">READY</div>
        </div>
        <div class="module-content">
            <div class="module-description">
                ENTERTAINMENT SUITE
                <br>STATUS: OPERATIONAL
                <br>GAMES: MULTIPLE
            </div>
            <button class="module-button pipboy-button">[INITIALIZE]</button>
        </div>
    `

  dashboardContent.appendChild(pongModule)
  dashboardContent.appendChild(game2Module)
  dashboardDiv.appendChild(dashboardContent)

  return dashboardDiv
}

export function createHomePage() {
  document.title = "Home - Pip-Boy Terminal"

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
        <div class="terminal-subtitle">PERSONAL INFORMATION PROCESSOR - HOME MODULE</div>
        <div class="terminal-version">-TERMINAL 01-</div>
    `

  // Create home container
  const homeContainer = document.createElement("div")
  homeContainer.className = "home-container"

  // Create sections - Navigation first, then profile
  const navDiv = createNavDiv()
  const profileDiv = createProfileDiv()

  homeContainer.appendChild(navDiv)
  homeContainer.appendChild(profileDiv)

  // Create terminal footer
  const terminalFooter = document.createElement("div")
  terminalFooter.className = "terminal-footer"
  terminalFooter.innerHTML = `
        <div class="footer-line">
            <span>VAULT-TEC HOME SYSTEM ACTIVE</span>
            <span class="timestamp" id="timestamp">${new Date().toLocaleTimeString()}</span>
        </div>
    `

  // Assemble terminal
  pipboyTerminal.appendChild(terminalHeader)
  pipboyTerminal.appendChild(homeContainer)
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
    cssLink.href = "./home/home.css"
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
