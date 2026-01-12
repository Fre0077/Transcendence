import { loadStoredSession } from "@/services/session";

/**
 * Pagina di Test Chat API - Microservizio Chat:3002
 * 
 * Endpoints:
 * - POST /user-list (HTTP) - ottiene lista utenti disponibili
 * - POST /new-chat (HTTP) - crea nuova chat
 * - GET /chat-list (WebSocket) - mantiene connessione per aggiornamenti chat
 * - GET /message-list (WebSocket) - mantiene connessione per messaggi
 * - POST /new-message (HTTP) - invia messaggio
 */

const CHAT_URL = 'http://localhost:3002/api';
const CHAT_WS_URL = 'ws://localhost:3002/api';

let accessToken: string | null = null;
let currentUserId: number | null = null;
let currentChatId: number | null = null;
let chatListWs: WebSocket | null = null;
let messageWs: WebSocket | null = null;

let rootEl: HTMLElement;
let goBackCb: ((el: HTMLElement) => void) | null = null;

export const renderChatTestPage = (element: HTMLElement, backCallback?: (el: HTMLElement) => void) => {
    rootEl = element;
    goBackCb = backCallback || null;
    
    const session = loadStoredSession();
    accessToken = session.token || null;
    currentUserId = session.userId || null;
    
    rootEl.innerHTML = createHTML();
    attachHandlers();
    
    if (currentUserId) {
        connectToChatList();
    }
};

function createHTML(): string {
    const session = loadStoredSession();
    const username = session.user?.username || '';
    
    return `
        <div style="max-width: 1400px; margin: 0 auto; padding: 20px; font-family: system-ui;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
                <h1 style="margin: 0;">Test Chat API (3002)</h1>
                <button id="btn-back" style="background: white; color: #667eea; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: bold;">← Torna indietro</button>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px;">
                <!-- TEST 1: Crea Gruppo -->
                <div style="background: white; padding: 20px; border-radius: 8px; border: 2px solid #e0e0e0;">
                    <h2 style="margin-top: 0; color: #667eea;">1️⃣ Crea Gruppo</h2>
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <input id="group-name" type="text" placeholder="Nome gruppo" style="padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;" />
                        <input id="group-host" type="number" placeholder="Host linkId" value="${currentUserId || ''}" style="padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;" />
                        <textarea id="group-members" placeholder="Membri linkId (separati da virgola, es: 1,2,3)" style="padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; min-height: 60px; resize: vertical;"></textarea>
                        <button id="btn-create-group" style="background: #667eea; color: white; border: none; padding: 12px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 14px;">Crea Gruppo</button>
                    </div>
                    <div id="create-result" style="margin-top: 15px; padding: 10px; background: #f5f5f5; border-radius: 4px; font-size: 13px; display: none;"></div>
                </div>
                
                <!-- TEST 2: Vedi Gruppi -->
                <div style="background: white; padding: 20px; border-radius: 8px; border: 2px solid #e0e0e0;">
                    <h2 style="margin-top: 0; color: #667eea;">2️⃣ Vedi Gruppi</h2>
                    <div style="padding: 8px; background: #e8f5e9; border-radius: 4px; margin-bottom: 12px; font-size: 12px; color: #2e7d32;">
                        🟢 WebSocket connesso
                    </div>
                    <div id="groups-list" style="border: 1px solid #ddd; border-radius: 4px; background: #fafafa; max-height: 300px; overflow-y: auto; padding: 10px;">
                        <em style="color: #999;">In attesa di dati dal server...</em>
                    </div>
                </div>
                
                <!-- TEST 3: Invia Messaggio -->
                <div style="background: white; padding: 20px; border-radius: 8px; border: 2px solid #e0e0e0;">
                    <h2 style="margin-top: 0; color: #667eea;">3️⃣ Invia Messaggio</h2>
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <select id="chat-select" style="padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                            <option value="">Seleziona un gruppo...</option>
                        </select>
                        <textarea id="message-text" placeholder="Scrivi un messaggio..." style="padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; min-height: 100px; resize: vertical;"></textarea>
                        <button id="btn-send-message" style="background: #667eea; color: white; border: none; padding: 12px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 14px;">Invia Messaggio</button>
                    </div>
                    <div id="send-result" style="margin-top: 15px; padding: 10px; background: #f5f5f5; border-radius: 4px; font-size: 13px; display: none;"></div>
                </div>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border: 2px solid #e0e0e0; margin-top: 20px;">
                <h3 style="margin-top: 0; color: #667eea;">📋 Log Risposte API</h3>
                <pre id="api-log" style="background: #1a1a1a; color: #00ff00; padding: 15px; border-radius: 4px; overflow-x: auto; font-size: 12px; max-height: 300px; overflow-y: auto;">Pronto...</pre>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border: 1px solid #ffc107; margin-top: 20px;">
                <strong>ℹ️ Info:</strong> User ID: <code>${currentUserId || 'Non impostato'}</code> | Token: <code>${accessToken ? 'Presente' : 'Non presente'}</code>
            </div>
        </div>
    `;
}

function attachHandlers() {
    document.getElementById('btn-back')?.addEventListener('click', () => {
        if (goBackCb) goBackCb(rootEl);
    });
    
    document.getElementById('btn-create-group')?.addEventListener('click', createGroup);
    document.getElementById('btn-send-message')?.addEventListener('click', sendMessage);
    
    // Selezionare un gruppo apre la connessione WebSocket ai messaggi
    document.getElementById('chat-select')?.addEventListener('change', (e) => {
        const chatId = parseInt((e.target as HTMLSelectElement).value);
        if (chatId && !isNaN(chatId)) {
            connectToMessages(chatId);
        } else {
            disconnectMessages();
        }
    });
}

// ===== CHAT LIST WebSocket - mantiene la connessione attiva =====
function connectToChatList() {
    if (!currentUserId) {
        logApi('ERROR', '❌ User ID non impostato - impossibile connettersi');
        setTimeout(() => connectToChatList(), 2000);
        return;
    }
    
    disconnectChatList();
    
    const wsUrl = `${CHAT_WS_URL}/chat-list`;
    logApi('WS CONNECTING', `Tentativo connessione a ${wsUrl} (user: ${currentUserId})`);
    
    try {
        chatListWs = new WebSocket(wsUrl);
        
        chatListWs.onopen = () => {
            logApi('WS CONNECT', `🟢 Connesso a /chat-list (user: ${currentUserId})`);
            chatListWs?.send(currentUserId!.toString());
        };
        
        chatListWs.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                
                if (data.error) {
                    logApi('ERROR', `Server error: ${data.error}`);
                    return;
                }
                
                logApi('WS RX', `Ricevuti dati chat-list`);
                
                let chats = data.chats;
                if (typeof chats === 'string') {
                    chats = JSON.parse(chats);
                }
                
                if (Array.isArray(chats)) {
                    renderChats(chats);
                }
            } catch (err: any) {
                logApi('ERROR', `Errore parsing: ${err.message}`);
            }
        };
        
        chatListWs.onerror = (event) => {
            logApi('ERROR WS', `❌ Errore WebSocket /chat-list - provo HTTP fallback`);
            console.error('WebSocket error event:', event);
            // Fallback a HTTP GET
            loadChatsViaHttp();
        };
        
        chatListWs.onclose = () => {
            logApi('WS CLOSED', `Disconnesso - riconnessione tra 3s...`);
            setTimeout(() => connectToChatList(), 3000);
        };
    } catch (err: any) {
        logApi('ERROR', `Impossibile creare WebSocket: ${err.message}`);
        loadChatsViaHttp();
        setTimeout(() => connectToChatList(), 3000);
    }
}

// Fallback: carica le chat via HTTP GET
async function loadChatsViaHttp() {
    if (!currentUserId) return;
    
    try {
        logApi('HTTP FALLBACK', `Caricamento chat via HTTP per user ${currentUserId}`);
        const res = await fetch(`${CHAT_URL}/user-chats/${currentUserId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
            }
        });
        
        if (!res.ok) {
            logApi('ERROR', `HTTP Error: ${res.status}`);
            return;
        }
        
        const data = await res.json();
        logApi('HTTP RX', `Ricevute chat via HTTP`);
        
        let chats = data.chats || data.reply || data;
        if (typeof chats === 'string') {
            chats = JSON.parse(chats);
        }
        
        if (Array.isArray(chats)) {
            renderChats(chats);
        }
    } catch (err: any) {
        logApi('ERROR HTTP', `Fallback fallito: ${err.message}`);
    }
}

function disconnectChatList() {
    if (chatListWs) {
        chatListWs.close();
        chatListWs = null;
    }
}

// ===== MESSAGES WebSocket - connessione per i messaggi di una chat =====
function connectToMessages(chatId: number) {
    if (!currentUserId) {
        alert('User ID non impostato');
        return;
    }
    
    currentChatId = chatId;
    disconnectMessages();
    
    const wsUrl = `${CHAT_WS_URL}/message-list`;
    messageWs = new WebSocket(wsUrl);
    
    messageWs.onopen = () => {
        logApi('WS CONNECT', `Connesso a /message-list per chat ${chatId}`);
        const payload = JSON.stringify({ message: [chatId, 0, currentUserId] });
        messageWs?.send(payload);
    };
    
    messageWs.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            logApi('WS /message-list', data);
            
            let messages = data.reply;
            if (typeof messages === 'string') {
                messages = JSON.parse(messages);
            }
            
            if (Array.isArray(messages)) {
                renderMessages(messages);
            }
        } catch (err: any) {
            logApi('ERROR WS PARSE', err.message);
        }
    };
    
    messageWs.onerror = () => {
        logApi('ERROR WS', 'Errore connessione WebSocket /message-list');
    };
    
    messageWs.onclose = () => {
        logApi('WS CLOSED', '/message-list disconnesso');
    };
}

function disconnectMessages() {
    if (messageWs) {
        messageWs.close();
        messageWs = null;
    }
    currentChatId = null;
}

// ===== POST /new-chat - HTTP =====
async function createGroup() {
    const nameInput = document.getElementById('group-name') as HTMLInputElement;
    const hostInput = document.getElementById('group-host') as HTMLInputElement;
    const membersInput = document.getElementById('group-members') as HTMLTextAreaElement;
    const resultDiv = document.getElementById('create-result') as HTMLDivElement;
    
    const chatName = nameInput.value.trim();
    const host = parseInt(hostInput.value.trim());
    const membersText = membersInput.value.trim();
    
    if (!chatName || !host || isNaN(host)) {
        showResult(resultDiv, '❌ Inserisci nome gruppo e host linkId', 'error');
        return;
    }
    
    const members = membersText ? membersText.split(',').map(m => parseInt(m.trim())).filter(m => !isNaN(m)) : [];
    
    const body = { host, chatName, members };
    
    try {
        const res = await fetch(`${CHAT_URL}/new-chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
            },
            body: JSON.stringify(body)
        });
        
        const data = await res.json();
        logApi('POST /new-chat', data);
        
        if (data.message && data.message.includes('successo')) {
            showResult(resultDiv, `✅ Gruppo creato!`, 'success');
            nameInput.value = '';
            membersInput.value = '';
            // La chat-list WebSocket riceverà l'aggiornamento automaticamente
        } else if (data.error) {
            showResult(resultDiv, `❌ ${data.error}`, 'error');
        } else {
            showResult(resultDiv, `⚠️ ${JSON.stringify(data)}`, 'warning');
        }
    } catch (err: any) {
        showResult(resultDiv, `❌ Errore: ${err.message}`, 'error');
        logApi('ERROR POST', err.message);
    }
}

// ===== POST /chat-message - HTTP =====
async function sendMessage() {
    const selectEl = document.getElementById('chat-select') as HTMLSelectElement;
    const textEl = document.getElementById('message-text') as HTMLTextAreaElement;
    const resultDiv = document.getElementById('send-result') as HTMLDivElement;
    
    const chatId = parseInt(selectEl.value);
    const message = textEl.value.trim();
    
    if (!chatId || isNaN(chatId)) {
        showResult(resultDiv, '❌ Seleziona un gruppo', 'error');
        return;
    }
    
    if (!message) {
        showResult(resultDiv, '❌ Scrivi un messaggio', 'error');
        return;
    }
    
    if (!currentUserId) {
        showResult(resultDiv, '❌ User ID non impostato', 'error');
        return;
    }
    
    const body = { chatId, linkId: currentUserId, message };
    
    try {
        const res = await fetch(`${CHAT_URL}/new-message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
            },
            body: JSON.stringify(body)
        });
        
        const data = await res.json();
        logApi('POST /new-message', data);
        
        if (data.message && data.message.includes('successo')) {
            showResult(resultDiv, `✅ Messaggio inviato!`, 'success');
            textEl.value = '';
            // Il WebSocket /message-list riceverà l'aggiornamento automaticamente
        } else if (data.error) {
            showResult(resultDiv, `❌ ${data.error}`, 'error');
        } else {
            showResult(resultDiv, `⚠️ ${JSON.stringify(data)}`, 'warning');
        }
    } catch (err: any) {
        showResult(resultDiv, `❌ Errore: ${err.message}`, 'error');
        logApi('ERROR POST', err.message);
    }
}

function renderChats(chats: any[]) {
    const listDiv = document.getElementById('groups-list') as HTMLDivElement;
    const selectEl = document.getElementById('chat-select') as HTMLSelectElement;
    
    if (!chats || chats.length === 0) {
        listDiv.innerHTML = '<em style="color: #999;">Nessun gruppo trovato</em>';
        selectEl.innerHTML = '<option value="">Nessun gruppo disponibile</option>';
        return;
    }
    
    listDiv.innerHTML = chats.map(c => {
        const id = c.chatId ?? c.id; // API restituisce chatId
        return `
            <div style="padding: 10px; background: white; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 8px;">
                <strong style="color: #667eea;">${escapeHtml(c.name || 'Chat ' + id)}</strong>
                <div style="font-size: 12px; color: #666; margin-top: 4px;">ID: ${id} | Tipo: ${c.type || 'DM'}</div>
            </div>
        `;
    }).join('');
	
    selectEl.innerHTML = '<option value="">Seleziona un gruppo...</option>' + 
        chats.map(c => {
            const id = c.chatId ?? c.id;
            return `<option value="${id}">${escapeHtml(c.name || 'Chat ' + id)}</option>`;
        }).join('');
}

function renderMessages(messages: any[]) {
    const logEl = document.getElementById('api-log') as HTMLPreElement;
    
    if (!messages || messages.length === 0) {
        logEl.textContent = 'Nessun messaggio in questa chat';
        return;
    }
    
    const formatted = messages.map(msg => {
        const time = new Date(msg.date).toLocaleTimeString();
        return `[${time}] User ${msg.userId}: ${escapeHtml(msg.message || '')}`;
    }).join('\n');
    
    logEl.textContent = formatted;
}

function showResult(el: HTMLDivElement, text: string, type: 'success' | 'error' | 'warning') {
    el.style.display = 'block';
    el.textContent = text;
    el.style.background = type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#fff3cd';
    el.style.color = type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#856404';
}

function logApi(label: string, data: any) {
    const logEl = document.getElementById('api-log') as HTMLPreElement;
    const timestamp = new Date().toLocaleTimeString();
    const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    logEl.textContent = `[${timestamp}] ${label}\n${text}\n\n${logEl.textContent}`;
    console.log(`[Chat Test] ${label}`, data);
}

function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
