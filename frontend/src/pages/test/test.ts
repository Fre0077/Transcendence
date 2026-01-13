import { renderChatTestPage } from './chatTest';
import { clearSession, persistSession } from '@/services/session';

/**
 * Pagina di Test API v4 (Microservizi: Auth:3001, Profile:3003)
 */

// --- CONFIGURAZIONE PORTE ---
const AUTH_URL = `http://${window.location.hostname}:3001/api`;
const PROFILE_URL = `http://${window.location.hostname}:3003/api`;

let accessToken: string | null = null;
let currentRefreshToken: string | null = null;
let loginEmailFor2FA: string | null = null;

// --- Elementi DOM ---
let log: HTMLPreElement;
let accessTokenDisplay: HTMLDivElement;
let refreshTokenDisplay: HTMLDivElement;

// Fieldsets
let profileFieldset: HTMLFieldSetElement;
let tfaFieldset: HTMLFieldSetElement;
let tfaVerifyFieldset: HTMLFieldSetElement;
let logoutFieldset: HTMLFieldSetElement;
let socialFieldset: HTMLFieldSetElement;
let avatarFieldset: HTMLFieldSetElement;

// 2FA Elements
let qrImg: HTMLImageElement;
let manualSecret: HTMLElement;

// Avatar Elements
let avatarImg: HTMLImageElement;
let avatarForm: HTMLFormElement;
let avatarFileInput: HTMLInputElement;

// Social Elements
let socialTargetInput: HTMLInputElement;
let friendsListDisplay: HTMLDivElement;
let rootElement: HTMLElement;

// User Remote Elements (Nuovi)
let userRemoteDisplay: HTMLDivElement;
let userRemoteAvatar: HTMLImageElement;
let userRemoteUsername: HTMLElement;


export const renderTestPage = (element: HTMLElement) => {
    rootElement = element;
    injectStyles();
    rootElement.innerHTML = createHTMLStructure();
    bindDOMElements();
    attachEventListeners();
    setLoggedOut(); 
};

/**
 * Funzione helper per decidere a quale microservizio mandare la richiesta
 */
function getServiceUrl(endpoint: string): string {
    // Le rotte AMICIZIE e USER (profilo remoto) vanno sulla 3003
    if (endpoint.startsWith('/friends') || endpoint.startsWith('/friend/') || endpoint === '/user') {
        return PROFILE_URL;
    }
    // Tutto il resto (Login, 2FA, Avatar, Update Profile PATCH) va su AUTH (3001)
    return AUTH_URL;
}

function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
        :root { --accent-color: #007bff; --danger-color: #dc3545; --success-color: #28a745; --warning-color: #ffc107; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f4f7f6; margin: 0; padding: 20px; color: #333; }
        .container { max-width: 900px; margin: 0 auto; background: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        fieldset { border: 2px solid var(--accent-color); border-radius: 8px; margin: 20px; padding: 20px; }
        legend { font-weight: bold; font-size: 1.2em; color: var(--accent-color); padding: 0 10px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .form-group { display: flex; flex-direction: column; gap: 5px; }
        label { font-weight: 500; }
        input[type="text"], input[type="email"], input[type="password"] { padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 1em; }
        button { padding: 10px 15px; font-size: 1em; font-weight: bold; color: #fff; background-color: var(--accent-color); border: none; border-radius: 4px; cursor: pointer; transition: background-color 0.2s; }
        button:hover { background-color: #0056b3; }
        button.danger { background-color: var(--danger-color); }
        button.danger:hover { background-color: #c82333; }
        button.success { background-color: var(--success-color); }
        button.success:hover { background-color: #218838; }
        button:disabled { background-color: #ccc; cursor: not-allowed; }
        
        #response-log { background: #222; color: #0f0; font-family: "Courier New", Courier, monospace; padding: 15px; margin: 20px; border-radius: 4px; white-space: pre-wrap; word-wrap: break-word; min-height: 100px; max-height: 400px; overflow-y: auto; }
        .token-display { background: #e9ecef; padding: 10px; border-radius: 4px; font-family: monospace; word-break: break-all; border: 1px solid #ccc; margin-top: 5px; }
        
        /* Avatar Styles */
        #avatar-img { max-width: 150px; max-height: 150px; border-radius: 50%; border: 2px solid var(--accent-color); background: #eee; margin-bottom: 15px; display: block; object-fit: cover; }
        
        /* Social List Styles */
        .friend-item { display: flex; align-items: center; gap: 10px; padding: 8px; border-bottom: 1px solid #ddd; }
        .friend-item:last-child { border-bottom: none; }
        .mini-avatar { width: 30px; height: 30px; border-radius: 50%; object-fit: cover; border: 1px solid #ccc; }
        .list-section { margin-bottom: 15px; }
        .list-title { font-weight: bold; margin-bottom: 5px; color: #555; text-transform: uppercase; font-size: 0.8em; }
        .empty-msg { font-style: italic; color: #999; font-size: 0.9em; }
    `;
    document.head.appendChild(style);
}

function createHTMLStructure(): string {
    return `
        <div class="container">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <div>
                    <h1 style="margin: 0;">Pannello Test Microservizi</h1>
                    <p style="text-align: center; color: #666; margin: 5px 0;">Auth (3001) | Profile (3003)</p>
                </div>
                <button id="btn-to-chat-test" style="padding: 12px 24px; font-size: 1em; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Test Chat →</button>
            </div>

            <fieldset>
                <legend>Risposta dal Server</legend>
                <pre id="response-log">Pronto a ricevere...</pre>
            </fieldset>

            <fieldset>
                <legend>1. Registrazione (Auth 3001)</legend>
                <form id="register-form" class="form-grid">
                    <input type="text" id="reg-name" placeholder="Nome" value="Test">
                    <input type="text" id="reg-surname" placeholder="Cognome" value="User">
                    <input type="text" id="reg-username" placeholder="Username" value="user${Math.floor(Math.random() * 1000)}">
                    <input type="email" id="reg-email" placeholder="Email" value="user${Math.floor(Math.random() * 1000)}@test.com">
                    <input type="password" id="reg-password" placeholder="Password" value="Password123!">
                    <button type="submit">Registrati</button>
                </form>
            </fieldset>

            <fieldset>
                <legend>2. Login (Auth 3001)</legend>
                <form id="login-form" class="form-grid">
                    <input type="email" id="login-email" placeholder="Email">
                    <input type="password" id="login-password" placeholder="Password" value="Password123!">
                    <button type="submit" style="grid-column: span 2;">Login</button>
                </form>
            </fieldset>

            <fieldset id="2fa-verify-fieldset">
                <legend>2b. Verifica 2FA (Auth 3001)</legend>
                <form id="2fa-verify-form" class="form-grid">
                    <input type="text" id="2fa-verify-code" placeholder="Codice 2FA a 6 cifre" maxlength="6">
                    <button type="submit">Verifica</button>
                </form>
            </fieldset>

            <fieldset>
                <legend>3. Tokens (Auth 3001)</legend>
                <div class="form-group">
                    <label>Access Token:</label>
                    <div id="access-token-display" class="token-display">...</div>
                </div>
                <div class="form-group">
                    <label>Refresh Token:</label>
                    <div id="refresh-token-display" class="token-display">...</div>
                </div>
                <button id="btn-refresh" style="margin-top: 10px;">Refresh Token</button>
            </fieldset>
            
            <fieldset id="avatar-fieldset">
                <legend>4. Avatar (Auth 3001)</legend>
                <img id="avatar-img" src="" />
                <form id="avatar-upload-form">
                    <input type="file" id="avatar-file-input" accept="image/*">
                    <button type="submit">Carica</button>
                </form>
            </fieldset>

            <fieldset id="profile-fieldset">
                <legend>5. Profilo (Auth 3001)</legend>
                <form id="profile-form" class="form-grid">
                    <input type="text" id="profile-username" placeholder="Nuovo Username">
                    <input type="text" id="profile-bio" placeholder="Bio">
                    <button type="submit">Aggiorna</button>
                </form>
            </fieldset>

            <fieldset id="2fa-fieldset">
                <legend>6. Configurazione 2FA (Auth 3001)</legend>
                <button id="btn-2fa-generate">Genera QR</button>
                <div id="qr-container" style="display:none; margin-top:10px;">
                    <img id="qr-code-img" width="150"><br>
                    Secret: <code id="manual-secret"></code>
                </div>
                <form id="2fa-enable-form" style="margin-top:10px;">
                    <input type="text" id="2fa-code" placeholder="Codice OTP">
                    <button type="submit">Abilita</button>
                </form>
                <form id="2fa-disable-form" style="margin-top:10px;">
                    <input type="password" id="2fa-disable-password" placeholder="Password">
                    <button type="submit" class="danger">Disabilita</button>
                </form>
            </fieldset>

            <fieldset id="social-fieldset">
                <legend>7. Social & Amicizie (Profile 3003)</legend>
                
                <div class="form-group" style="background: #eef; padding: 10px; border-radius: 4px; margin-bottom: 15px;">
                    <label>Verifica Profilo Remoto (/user):</label>
                    <div style="display: flex; align-items: center; gap: 15px; margin-top: 5px;">
                        <button id="btn-get-user-data" style="font-size: 0.9em;">Scarica Dati Utente</button>
                        
                        <div id="user-remote-display" style="display: none; align-items: center; gap: 10px; border: 1px solid #ccc; padding: 5px 10px; background: #fff; border-radius: 20px;">
                            <img id="user-remote-avatar" src="" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
                            <span id="user-remote-username" style="font-weight: bold; color: #333;">-</span>
                        </div>
                    </div>
                </div>
                <hr>

                <div class="form-group">
                    <label>Gestione Richieste:</label>
                    <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                        <input type="text" id="social-target-user" placeholder="Username altro utente" style="flex: 1;">
                        <button id="btn-friend-req" class="success">Invia</button>
                        <button id="btn-friend-accept">Accetta</button>
                        <button id="btn-friend-remove" class="danger">Rifiuta/Rimuovi</button>
                    </div>
                </div>
                <hr>
                <div class="form-group">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <label>La tua cerchia:</label>
                        <button id="btn-get-friends" style="font-size: 0.8em; padding: 5px 10px;">Aggiorna Lista</button>
                    </div>
                    <div id="friends-list-display" style="background: #f9f9f9; padding: 10px; border: 1px solid #ddd; min-height: 50px; margin-top: 5px; border-radius: 4px;">
                        <em>Clicca "Aggiorna Lista" per vedere i dati.</em>
                    </div>
                </div>
            </fieldset>

            <fieldset id="logout-fieldset">
                <legend>8. Logout (Auth 3001)</legend>
                <button id="btn-logout" class="danger">Logout</button>
            </fieldset>

            <fieldset>
                <legend>9. Database Management</legend>
                <div style="display: flex; gap: 10px;">
                    <button id="btn-empty-database" class="danger">Empty Database</button>
                    <button id="btn-setup-test" class="success">Setup Test Data</button>
                </div>
            </fieldset>
        </div>
    `;
}

function bindDOMElements() {
    log = document.getElementById('response-log') as HTMLPreElement;
    accessTokenDisplay = document.getElementById('access-token-display') as HTMLDivElement;
    refreshTokenDisplay = document.getElementById('refresh-token-display') as HTMLDivElement;
    
    profileFieldset = document.getElementById('profile-fieldset') as HTMLFieldSetElement;
    tfaFieldset = document.getElementById('2fa-fieldset') as HTMLFieldSetElement;
    tfaVerifyFieldset = document.getElementById('2fa-verify-fieldset') as HTMLFieldSetElement;
    logoutFieldset = document.getElementById('logout-fieldset') as HTMLFieldSetElement;
    avatarFieldset = document.getElementById('avatar-fieldset') as HTMLFieldSetElement;
    socialFieldset = document.getElementById('social-fieldset') as HTMLFieldSetElement; 

    qrImg = document.getElementById('qr-code-img') as HTMLImageElement;
    manualSecret = document.getElementById('manual-secret') as HTMLElement;
    
    avatarImg = document.getElementById('avatar-img') as HTMLImageElement;
    avatarForm = document.getElementById('avatar-upload-form') as HTMLFormElement;
    avatarFileInput = document.getElementById('avatar-file-input') as HTMLInputElement;

    socialTargetInput = document.getElementById('social-target-user') as HTMLInputElement;
    friendsListDisplay = document.getElementById('friends-list-display') as HTMLDivElement;

    // Nuovi Binding per User Data
    userRemoteDisplay = document.getElementById('user-remote-display') as HTMLDivElement;
    userRemoteAvatar = document.getElementById('user-remote-avatar') as HTMLImageElement;
    userRemoteUsername = document.getElementById('user-remote-username') as HTMLElement;
}

function logResponse(data: any) {
    log.textContent = JSON.stringify(data, null, 2);
}

function updateAvatarDisplay(avatarUrl: string | null) {
    const defaultAvatar = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2NjYyI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTQgMTQgMTQgOC41Mi00LjQ4IDgtMTBTMTcuNTIgMiAxMiAyem0wIDE4Yy0yLjA0IDAtMy44Ny0uODYtNS4yMy0yLjI0QzguNTIgMTYuMjUgMTAuMjEgMTYgMTIgMTZjMS43OSAwIDMuNDgtLjI1IDUuMjMuNzZDMTUuODcgMTcuMTQgMTQuMDQgMTggMTIgMTh6bTAtMTRjMS45MyAwIDMuNSA0LjAxIDMuNSA3LjVTMTMuOTMgMTQgMTIgMTQgMTAuNSAxMCAxMC41IDcuNVMxMC4wNyA0IDEyIDR6Ii8+PC9zdmc+";
    avatarImg.src = avatarUrl || defaultAvatar;
}

function setAuthenticated(access: string, refresh: string, user: any) {
    console.log("%cLOGGED IN", "color: green"); 
    accessToken = access;
    currentRefreshToken = refresh;
    
    accessTokenDisplay.textContent = access;
    refreshTokenDisplay.textContent = refresh;
    
    profileFieldset.disabled = false;
    tfaFieldset.disabled = false;
    logoutFieldset.disabled = false;
    avatarFieldset.disabled = false;
    socialFieldset.disabled = false; 
    tfaVerifyFieldset.disabled = true;

    updateAvatarDisplay(user.avatarUrl);
    persistSession(access, user, refresh);
}

function setLoggedOut() {
    accessToken = null;
    currentRefreshToken = null;
    loginEmailFor2FA = null;

    accessTokenDisplay.textContent = "...";
    refreshTokenDisplay.textContent = "...";
    
    profileFieldset.disabled = true;
    tfaFieldset.disabled = true;
    logoutFieldset.disabled = true;
    avatarFieldset.disabled = true;
    socialFieldset.disabled = true; 
    tfaVerifyFieldset.disabled = true;
    
    updateAvatarDisplay(null);
    clearSession();
}

// AGGIORNATO API CALL PER SUPPORTARE I MICROSERVIZI
async function apiCall(endpoint: string, method: 'GET' | 'POST' | 'PATCH' | 'DELETE', body: any = null, token: string | null = accessToken) {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config: RequestInit = {
        method: method,
        headers: headers,
    };

    if (body && method !== 'GET') {
        config.body = JSON.stringify(body);
    }
    
    // Determina l'URL base corretto in base all'endpoint
    const baseUrl = getServiceUrl(endpoint);
    const fullUrl = `${baseUrl}${endpoint}`;

    try {
        const res = await fetch(fullUrl, config);
        const data = await res.json();
        console.log(`API [${method} ${fullUrl}]`, data);
        logResponse(data); 
        return data; 
    } catch (err: any) {
        console.error("Errore fetch:", err);
        logResponse({ error: `Errore chiamata a ${fullUrl}: ${err.message}` });
    }
}

function renderFriendList(data: any) {
    if (!data) return;

    const createListHTML = (title: string, users: any[]) => {
        if (!users || users.length === 0) return `<div class="list-section"><div class="list-title">${title}</div><div class="empty-msg">Nessuno</div></div>`;
        
        const items = users.map(u => {
            const av = u.avatarUrl || "https://via.placeholder.com/30";
            return `
                <div class="friend-item">
                    <img src="${av}" class="mini-avatar" />
                    <span><strong>${u.username}</strong></span>
                </div>
            `;
        }).join('');

        return `<div class="list-section"><div class="list-title">${title}</div>${items}</div>`;
    };

    let html = "";
    html += createListHTML("Amici Confermati", data.friends);
    html += createListHTML("Richieste in Arrivo (Inbox)", data.incomingRequests);
    html += createListHTML("Richieste Inviate (Pending)", data.outgoingRequests);

    friendsListDisplay.innerHTML = html;
}

function attachEventListeners() {
    
    // --- NAVIGAZIONE ---
    document.getElementById('btn-to-chat-test')?.addEventListener('click', () => {
        renderChatTestPage(rootElement, renderTestPage);
    });
    
    // --- AUTH (3001) ---
    document.getElementById('register-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const body = {
            name: (document.getElementById('reg-name') as HTMLInputElement).value,
            surname: (document.getElementById('reg-surname') as HTMLInputElement).value,
            username: (document.getElementById('reg-username') as HTMLInputElement).value,
            email: (document.getElementById('reg-email') as HTMLInputElement).value,
            password: (document.getElementById('reg-password') as HTMLInputElement).value,
        };
        (document.getElementById('login-email') as HTMLInputElement).value = body.email;
        await apiCall('/register', 'POST', body, null);
    });

    document.getElementById('login-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        setLoggedOut();
        const email = (document.getElementById('login-email') as HTMLInputElement).value;
        const body = {
            email: email,
            password: (document.getElementById('login-password') as HTMLInputElement).value,
        };
        const data = await apiCall('/login', 'POST', body, null);
        
        if (data?.accessToken) {
            setAuthenticated(data.accessToken, data.refreshToken, data.user);
        } else if (data?.twoFactorRequired) {
            loginEmailFor2FA = email;
            tfaVerifyFieldset.disabled = false;
            logResponse({ msg: "Richiesto codice 2FA..." });
        }
    });

    document.getElementById('2fa-verify-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!loginEmailFor2FA) return;
        const body = {
            email: loginEmailFor2FA,
            code: (document.getElementById('2fa-verify-code') as HTMLInputElement).value,
        };
        const data = await apiCall('/2fa/verify', 'POST', body, null);
        if (data?.accessToken) setAuthenticated(data.accessToken, data.refreshToken, data.user);
    });

    document.getElementById('btn-refresh')?.addEventListener('click', async (e) => {
        e.preventDefault();
        if (!currentRefreshToken) return;
        const data = await apiCall('/refresh', 'POST', { refreshToken: currentRefreshToken }, null);
        if (data?.accessToken) {
            accessToken = data.accessToken;
            currentRefreshToken = data.refreshToken;
            accessTokenDisplay.textContent = data.accessToken;
            refreshTokenDisplay.textContent = data.refreshToken;
            persistSession(data.accessToken, null, data.refreshToken);
        } else {
            setLoggedOut();
        }
    });

    // --- AUTH (3001 - Avatar & Profile Update) ---
    
    // Upload Avatar (Fetch diretto perché usa FormData)
    avatarForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!accessToken) return;
        const file = avatarFileInput.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file); 

        // Modificato: Punta ad AUTH_URL (3001)
        const res = await fetch(`${AUTH_URL}/profile/avatar`, { 
            method: 'POST',
            headers: { 'Authorization': `Bearer ${accessToken}` },
            body: formData,
        });
        const data = await res.json();
        logResponse(data);
        if (res.ok && data.avatarUrl) {
            updateAvatarDisplay(data.avatarUrl);
            avatarFileInput.value = "";
        }
    });

    document.getElementById('profile-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const body: any = {};
        const username = (document.getElementById('profile-username') as HTMLInputElement).value;
        const bio = (document.getElementById('profile-bio') as HTMLInputElement).value;
        if (username) body.username = username;
        if (bio) body.bio = bio;
        
        await apiCall('/profile', 'PATCH', body, accessToken);
    });

    // --- 2FA CONFIG (Auth 3001) ---
    document.getElementById('btn-2fa-generate')?.addEventListener('click', async (e) => {
        e.preventDefault();
        const data = await apiCall('/2fa/generate', 'POST', {}, accessToken);
        if (data.qrCodeUrl) {
            qrImg.src = data.qrCodeUrl;
            document.getElementById('qr-container')!.style.display = 'block';
            manualSecret.textContent = data.secret;
        }
    });
    document.getElementById('2fa-enable-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const body = { code: (document.getElementById('2fa-code') as HTMLInputElement).value };
        await apiCall('/2fa/enable', 'POST', body, accessToken);
    });
    document.getElementById('2fa-disable-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const body = { password: (document.getElementById('2fa-disable-password') as HTMLInputElement).value };
        await apiCall('/2fa/disable', 'POST', body, accessToken);
    });

    // --- SOCIAL (Profile 3003) ---
    
    // 0. Get user data (Endpoint: /user)
    document.getElementById('btn-get-user-data')?.addEventListener('click', async (e) => {
        e.preventDefault();
        
        // Nascondi il display prima della chiamata per pulizia UI
        if (userRemoteDisplay) userRemoteDisplay.style.display = 'none';

        try {
            // La chiamata andrà su 3003 grazie alla modifica in getServiceUrl
            const data = await apiCall('/user', 'GET', null, accessToken);

            if (data && !data.error) {
                // Gestione robusta dei dati
                if (userRemoteUsername) userRemoteUsername.textContent = data.username || "Sconosciuto";
                
                if (userRemoteAvatar) {
                    // Fallback se avatarUrl è null
                    userRemoteAvatar.src = data.avatarUrl 
                        ? data.avatarUrl 
                        : "https://via.placeholder.com/32?text=U";
                }

                // Mostra il risultato
                if (userRemoteDisplay) {
                    userRemoteDisplay.style.display = 'flex';
                    // Feedback visivo temporaneo (verde)
                    userRemoteDisplay.style.borderColor = 'green';
                    setTimeout(() => userRemoteDisplay.style.borderColor = '#ccc', 1000);
                }
            }
        } catch (error) {
            console.error("Errore recupero dati utente:", error);
            alert("Impossibile recuperare i dati utente dal servizio Profile.");
        }
    });

    // 1. Aggiorna Lista
    document.getElementById('btn-get-friends')?.addEventListener('click', async (e) => {
        e.preventDefault();
        const data = await apiCall('/friends', 'GET', null, accessToken);
        renderFriendList(data);
    });

    // 2. Invia Richiesta
    document.getElementById('btn-friend-req')?.addEventListener('click', async (e) => {
        e.preventDefault();
        const target = socialTargetInput.value;
        if (!target) return alert("Inserisci username");
        await apiCall('/friend/request', 'POST', { targetUsername: target }, accessToken);
        // Refresh automatico lista per vedere Pending
        setTimeout(() => document.getElementById('btn-get-friends')?.click(), 500);
    });

    // 3. Accetta Richiesta
    document.getElementById('btn-friend-accept')?.addEventListener('click', async (e) => {
        e.preventDefault();
        const target = socialTargetInput.value;
        if (!target) return alert("Inserisci username da accettare");
        await apiCall('/friend/accept', 'POST', { targetUsername: target }, accessToken);
        setTimeout(() => document.getElementById('btn-get-friends')?.click(), 500);
    });

    // 4. Rimuovi/Rifiuta Richiesta
    document.getElementById('btn-friend-remove')?.addEventListener('click', async (e) => {
        e.preventDefault();
        const target = socialTargetInput.value;
        if (!target) return alert("Inserisci username da rimuovere");
        await apiCall('/friend/remove', 'DELETE', { targetUsername: target }, accessToken);
        setTimeout(() => document.getElementById('btn-get-friends')?.click(), 500);
    });

    // --- LOGOUT (Auth 3001) ---
    document.getElementById('btn-logout')?.addEventListener('click', async (e) => {
        e.preventDefault();
        if (currentRefreshToken) {
            await apiCall('/logout', 'POST', { refreshToken: currentRefreshToken }, accessToken);
        }
        setLoggedOut();
    });

    // --- DATABASE MANAGEMENT ---
    document.getElementById('btn-empty-database')?.addEventListener('click', async (e) => {
        e.preventDefault();
        if (confirm('Sei sicuro di voler cancellare TUTTI i dati dal database?')) {
            await apiCall('/empty-database', 'POST', {}, accessToken);
        }
    });

    document.getElementById('btn-setup-test')?.addEventListener('click', async (e) => {
        e.preventDefault();
        await apiCall('/setup-test', 'POST', {}, accessToken);
    });
}