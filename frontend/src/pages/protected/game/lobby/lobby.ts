import { loadNavbar } from "@/components/navbar";
import { createProfileCard } from "@components/createProfileCard.js";
import { sendPostRequest } from "@/services/api/sendRequests";

// const baseLobbyPath = `http://${window.location.hostname}:3031/`;
const LOBBY_WEBSOCKET_URL = `ws://${window.location.hostname}:3029/ws/lobby`;
const BACKEND_APIS_URL = `http://${window.location.hostname}:3029/api`;

interface Player {
    id: string;
    name: string;
    status?: string;
}

// globally accessible lobby code
let lobby_code:string = "";

//ritorna il linkid di un utente
// async function checkAuth() : Promise<number> {
//     console.log("Controllo autorizzazione per giocare...");

//     const token = localStorage.getItem('authToken');

//     if (!token) {
//         console.warn("Nessun token trovato. L'utente deve fare il login.");
//         alert("Devi essere loggato per giocare!");
//         router.push('/login'); // Reindirizza al login
//         return -1;
//     }

//     try {
//         const response = await fetch(`http://${window.location.hostname}:3001/api/profile`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             }
//         });

//         const data = await response.json();

//         if (!response.ok) {
//             throw new Error(data.error || "Sessione non valida");
//         }

//         // === SUCCESSO ===
//         console.log("Autorizzazione confermata! Avvio del gioco...");
//         return data.id;

//     } catch (error) {
//         // === FALLIMENTO ===
//         console.error("Autorizzazione fallita:", error);
//         alert("La tua sessione è scaduta o non è valida. Effettua nuovamente il login.");
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('user');
//         router.push('/login');
//     }
//     return -1;
// }

export function loadOnlineLobbyPage(): HTMLElement {
    let connected_players: Player[] = [];
   
    // get lobby code if present
    const query = router.getQuery().get("lobby-id");
    if (query) lobby_code = query;

    console.log('Got param', lobby_code);

    // @topiana- we need playerID to authenticate the connection, so I passed it to createWebSocketConnection 

    const playerID = localStorage.getItem('userId'/* ) || sessionStorage.getItem('guestID') || 'Guest_' + Math.floor(Math.random() * 1000 */);
    if (!playerID)
            return load404Page();
        
    const format = 3; // Best of 3 rounds
    
    let lobbyWS = createWebSocketConnection(connected_players, lobby_code);

    //----

    const div = document.createElement('div');
    div.className = 'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col';
    div.innerHTML = /*html*/ `
    ${loadNavbar().outerHTML}
    <!-- Online Lobby Page Content -->
    <div class="flex-1 container mx-auto px-4 flex flex-col items-center justify-center gap-8">
        <div class="text-center mb-8">
            <h1 class="text-5xl font-bold text-white mb-4">Online Game Lobby</h1>
            <p class="text-lg text-white/60">Create or join an online game lobby!</p>
        </div>

        <div class="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Create Game Card -->
            <a id="create-game-btn" class="group relative overflow-hidden rounded-xl bg-gradient-to-br from-cyan-600/20 to-blue-600/20 p-8 border border-cyan-500/30 hover:border-cyan-400/70 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20">
                <div class="relative z-10 text-center">
                    <div class="text-5xl mb-4">🎮</div>
                    <h3 class="text-xl font-bold text-white mb-2">Create Game</h3>
                    <p class="text-sm text-white/70">Set up a new online lobby</p>
                </div>
            </a>
            
            <!-- Join Game Card -->
            <a id="join-game-btn" class="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-600/20 to-teal-600/20 p-8 border border-green-500/30 hover:border-green-400/70 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20">
                <div class="relative z-10 text-center">
                    <div class="text-5xl mb-4">🔗</div>
                    <h3 class="text-xl font-bold text-white mb-2">Join Game</h3>
                    <p class="text-sm text-white/70">Enter a lobby code</p>
                </div>
            </a>





            <!-- Invite Player Card -->
            <section
            id="invite-player-card"
            class="relative rounded-xl p-8 border border-white/20
                    bg-slate-800/60 backdrop-blur
                    transition-all duration-300
                    hover:shadow-lg hover:shadow-white/10
                    focus-within:ring-2 focus-within:ring-cyan-400"
            >
                <div class="text-center">
                    <!-- Icon -->
                    <div class="text-5xl mb-4" aria-hidden="true">👤➕</div>

                    <!-- Title -->
                    <h3 class="text-xl font-bold text-white mb-2">
                        Invite Player
                    </h3>

                    <!-- Description -->
                    <p class="text-sm text-white/70 mb-4">
                        Invite a player by their username
                    </p>

                    <!-- Form -->
                    <form id="invite-form" class="flex flex-col gap-3">
                        <label for="invite-player-username" class="sr-only">
                            Player username
                        </label>

                        <input
                            id="invite-player-username"
                            name="username"
                            type="text"
                            required
                            placeholder="Username"
                            class="rounded-md px-4 py-2
                                bg-slate-900 text-white
                                border border-white/20
                                placeholder-white/40
                                focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        />

                        <button
                            type="submit"
                            class="mt-2 inline-flex items-center justify-center gap-2
                                rounded-md px-4 py-2
                                bg-cyan-600 hover:bg-cyan-500
                                text-white font-semibold
                                transition-colors
                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400"
                        >
                            <span aria-hidden="true">✉️</span>
                            Send Invite
                        </button>
                    </form>
                </div>
            </section>






            <!-- Lobby Info Card (ChatGPT) -->
            <div class="flex flex-col h-full lg:col-span-2 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 overflow-hidden">

                <!-- CARD CONTENT -->
                <div class="p-8 flex-1">
                    <h3 class="text-lg font-bold text-white mb-4">Lobby Info</h3>

                    <div class="space-y-4" id="lobbyInfo">
                        <div>
                            <p class="text-xs text-white/50 uppercase tracking-wide mb-1">Lobby Code</p>
                            <p id="lobbyCode" class="text-sm font-mono text-cyan-400">
                                ${lobby_code || 'Waiting...'}
                            </p>

                            <div class="flex items-center gap-2 mt-4">
                                <button id="copyLobbyCodeBtn" class="px-4 py-2 bg-cyan-600/20 border border-cyan-500/30 rounded-lg text-sm text-white hover:bg-cyan-600/30 transition flex items-center gap-2">
                                    <img src="/assets/icons/copy.png" alt="Copy" class="w-4 h-4">
                                </button>
                                <span id="copyStatus" class="text-sm text-white/60"></span>
                            </div>
                        </div>

                        <div>
                            <p class="text-xs text-white/50 uppercase tracking-wide mb-2">Connected Players</p>
                            <div id="connectedPlayersList" class="grid grid-cols-1 gap-4">
                                </div>
                        </div>
                    </div>
                </div>

                <!-- ACTION BAR (STUCK TO BOTTOM, FULL WIDTH) -->
                <div class="border-t border-white/10">
                    <div class="flex w-full">

                        <!-- Start Game -->
                        <a id="start-game-btn" class="flex-1 flex items-center justify-center py-3 text-sm font-medium text-white bg-green-600/20 hover:bg-green-600/30 transition">
                            Start Game
                        </a>

                        <!-- Leave Lobby -->
                        <a id="leave-lobby-btn" class="flex-1 flex items-center justify-center py-3 text-sm font-medium text-white bg-red-600/20 hover:bg-red-600/30 transition">
                            Leave Lobby
                        </a>

                    </div>
                </div>
            </div>



            <!-- BOT card (ChatGPT) -->
            <div class="flex flex-col rounded-xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 overflow-hidden">

                <!-- CARD CONTENT -->
                <div class="p-6 flex-1 flex flex-col items-center">
                    <h3 class="text-lg font-bold text-white mb-2">BOT</h3>
                    <p class="text-xs text-white/70 mb-6">Difficulty</p>

                    <!-- Slider container -->
                    <div class="flex flex-col items-center gap-2 flex-1 justify-center">
                        <span class="text-xs text-white/50">Gremlin</span>

                        <input
                            id="botLevelSlider"
                            type="range"
                            min="0"
                            max="100"
                            value="50"
                            class="h-40 w-2 accent-blue-500 cursor-pointer
                                [writing-mode:vertical-rl]
                                [direction:rtl]"
                        />

                        <span class="text-xs text-white/50">Demigod</span>
                    </div>
                </div>

                <!-- ACTION BAR (FULL WIDTH, 2 BUTTONS) -->
                <div class="border-t border-white/10">
                    <div class="flex w-full">

                        <!-- ADD button -->
                        <button
                            id="add-bot-btn"
                            class="flex-1 flex items-center justify-center py-3 text-sm font-medium text-white bg-green-600/20 hover:bg-green-600/30 transition"
                        >
                            ADD
                        </button>

                        <!-- LEAVE button -->
                        <button
                            id="rem-bot-btn"
                            class="flex-1 flex items-center justify-center py-3 text-sm font-medium text-white bg-red-600/20 hover:bg-red-600/30 transition"
                        >
                            REMOVE
                        </button>

                    </div>
                </div>
            </div>



        </div>
    </div>
    `;

    // Add event listener for create game button
    const createGameBtn = div.querySelector('#create-game-btn');
    if (createGameBtn) {
        createGameBtn.addEventListener('click', () => {
            createLobby(/* playerID,  */format, lobbyWS);
        });
    }

    const joinGameBtn = div.querySelector('#join-game-btn');
    if (joinGameBtn) {
        joinGameBtn.addEventListener('click', () => {
            const lobby_code = prompt('Enter Lobby Code:');
            if (lobby_code) {
                joinLobby(lobby_code, /* playerID, */ lobbyWS);
            }
        });
    }
    
    const leaveLobbyBtn = div.querySelector('#leave-lobby-btn');
    if (leaveLobbyBtn) {
        leaveLobbyBtn.addEventListener('click', () => {
            console.log('Leave Lobby Button clicked');
            leaveLobby(lobby_code, connected_players, lobbyWS);
            lobbyWS = createWebSocketConnection(/* playerID,  */connected_players);
        });
        console.log('Leave Lobby Button found and event listener added');
    }

    const startGameBtn = div.querySelector('#start-game-btn');
    if (startGameBtn) {
        startGameBtn.addEventListener('click', () => {
            startGame(/* lobby_code, */ lobbyWS);
        });
    }


    /* -------------------------------- */
    /*          PLAYER INVITE           */

    //invite-player-btn
    const inviteform = div.querySelector("#invite-form") as HTMLFormElement;
    // const usernamediv = div.querySelector("#invite-player-username") as HTMLInputElement;
    // const invitebtn = div.querySelector("#invite-player-btn");
    inviteform.addEventListener("submit", (event) => {
        event.preventDefault(); // stop page reload

        // check if we are in a lobby
        if (!lobby_code) {
            alert("(#todo bertter) join a lobby/create before inviting");
            return ;
        }

        // get the username
        const form = event.currentTarget as HTMLFormElement;
        const data = new FormData(form);

        const username = data.get("username");

        if (typeof username !== "string" || username.trim() === "") {
            console.error("Invalid username");
            return;
        }

        /* #debug */
        console.log('Inviting', username, "to", lobby_code);

        // send the request to the backend
        sendPostRequest(`${BACKEND_APIS_URL}/lobby-invite`, {
            lobbyid: lobby_code,
            username: username
        }, 'application/json');
    });


    //----------------------
    // @topiana-
    const slider = div.querySelector("#botLevelSlider") as HTMLInputElement;
    const addBotBtn = div.querySelector('#add-bot-btn');
    if (addBotBtn && slider) {
        addBotBtn.addEventListener('click', () => {
            const level = slider.value;
            addBot(Number(level), lobbyWS);
        });
    }

    const remBotBtn = div.querySelector('#rem-bot-btn');
    if (remBotBtn) {
        remBotBtn.addEventListener('click', () => {
            remBot(lobbyWS);
        });
    }

    return div;
}

// @topiana- (outdated, now sending lobbystate only on update)
/* function checkPlayerListChanged(oldList: Player[], newList: any[]): boolean {
    if (oldList.length !== newList.length) {
        return true;
    }
    const oldIds = oldList.map(p => p.id).sort();
    const newIds = newList.map(p => p.ID).sort();
    for (let i = 0; i < oldIds.length; i++) {
        if (oldIds[i] !== newIds[i]) {
            return true;
        }
    }
    return false;
} */

/* 
    Request:
    {
        method: 'CREATE',     (mandatory)
        playerID: <playerID>, (mandatory) (outdated)
        format: <format>      (optional)
    }
    @format: the number of rounds a player need to win to win the match
*/
function createLobby(/* playerID: string, */ format: number, lobbyWS: WebSocket) {
    const createLobbyRequest = {
        method: 'CREATE',
        // playerID: playerID, // outdated
        format: format
    };
    lobbyWS.send(JSON.stringify(createLobbyRequest));
}

function joinLobby(lobby_code: string, /* playerID: string, */ lobbyWS: WebSocket) {
    const joinLobbyRequest = {
        method: 'JOIN',
        lobbyID: lobby_code
        // playerID: playerID      // outdated
    };
    lobbyWS.send(JSON.stringify(joinLobbyRequest));
}

function leaveLobby(lobby_code: string, connected_players: Player[], lobbyWS: WebSocket) {
    
    // @topiana- check on socket state
    if (lobbyWS.readyState === WebSocket.OPEN) {
        lobbyWS.send(JSON.stringify({ method: 'LEAVE' }));
    } else {
        console.log("Socket closed, couldn't leave lobby");
        return ;
    }

    // cleanup
    lobbyWS.close();
    lobby_code = '';
    connected_players = [];
    updateLobbyInfo(lobby_code, connected_players);
}

// message received: {"method":"START_REPLY","status":"success","value":"00d78701-cb70-4535-81f3-c7b96bcd757b","comment":"The lobby is now in game"}
function startGame(/* lobby_code: string,  */lobbyWS: WebSocket) {
    const startGameRequest = {
        method: 'START',
        // lobbyID: lobby_code // outdated
    };
    lobbyWS.send(JSON.stringify(startGameRequest));
}

// @topiana- add a bot
function addBot(level:number, ws:WebSocket)
{
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ method: 'BOT', value: 'ADD', level: level }))
    }
}

// @topiana- remove a bot
function remBot(ws:WebSocket)
{
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ method: 'BOT', value: 'REMOVE'}))
    }
}

function updateLobbyInfo(lobby_code?: string, connected_players: Player[] = []) {
    const lobbyCodeElem = document.getElementById('lobbyCode');
    if (lobbyCodeElem) {
        lobbyCodeElem.textContent = lobby_code || 'Waiting...';
    }

    const playersListElem = document.getElementById('connectedPlayersList');
    //credito a Gemini che ci ha donato questo else/if
    if (playersListElem) {
    // 1. Pulisci il contenitore vecchio
    playersListElem.innerHTML = ''; 

    if (connected_players.length > 0) {
        // 2. Modifica la classe del contenitore per visualizzare le card (Grid invece di lista semplice)
        // Rimuovi 'space-y-1' se presente, perché le card sono grandi
        playersListElem.className = "grid grid-cols-1 md:grid-cols-2 gap-4 mt-2"; 

        // 3. Itera e "appendi" gli elementi DOM reali
        connected_players.forEach(player => {
            // Qui ottieni l'elemento HTML vivo
            const cardDOM = createProfileCard(player.id); 
            
            // Lo inserisci nella pagina
            playersListElem.appendChild(cardDOM);
        });
    } else {
        // Caso lista vuota
        playersListElem.className = "space-y-1"; // Ripristina stile lista semplice per il messaggio
        playersListElem.innerHTML = '<li class="text-sm text-white/40 italic">No players connected</li>';
    }
}

    const copyLobbyCodeBtn = document.getElementById('copyLobbyCodeBtn');
    if (copyLobbyCodeBtn) {
        copyLobbyCodeBtn.addEventListener('click', () => {
            if (lobby_code) {
                navigator.clipboard.writeText(lobby_code).then(() => {
                    const copyStatus = document.getElementById('copyStatus');
                    if (copyStatus) {
                        copyStatus.textContent = 'Copied!';
                        setTimeout(() => {
                            copyStatus.textContent = '';
                        }, 2000);
                    }
                }).catch(err => {
                    console.error('Failed to copy lobby code: ', err);
                });
            }
        });
    }
}

// #review pls (ChatGPT)
import { router } from "@/router";
import { load404Page } from "@/pages/errors/404";

function createWebSocketConnection(connected_players: Player[], lobbyid?:string): WebSocket {
    const ws = new WebSocket(LOBBY_WEBSOCKET_URL);
    console.log("Websocketing to", LOBBY_WEBSOCKET_URL);

    ws.onopen = () => {
        console.log('Connected to lobby WebSocket');

        // join lobby if id was passed
        if (lobbyid) {
            joinLobby(lobbyid, ws);
        }
    };

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            console.log('Lobby WebSocket message received:', data);


            const method = data.method || '';
            if (method === 'START_REPLY') {
                if (data.status === 'success')
                {
                    console.log('Lobby is starting the game:', data.comment);
                    // close socket when leaving window
                    ws.close();
                    console.log('data value', data.value);
                    router.push(`/game/${data.value}`);
                }
                else console.log('Failed to start lobby');
            }
            /* interface LobbyState {
                ID:string;
                gameID:string;
                players: {
                    ID:string;
                    status:string;
                }[];
            } */
            else if (data.ID && data.players)
            {
                // save lobbyID
                if (lobby_code !== data.ID) {
                    lobby_code = data.ID;
                }

                // update players
                connected_players = data.players.map((p: any) => ({
                    id: p.ID,
                    name: p.ID,
                    status: p.status
                }));

                // update lobby
                updateLobbyInfo(lobby_code, connected_players);
            }
            else
            {
                console.log("Received this message that I didn't understand", data);
            }
        } catch (e) {
            console.log("message received:", event.data);
        }
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
        console.log('Disconnected from lobby WebSocket');
    };

    return ws;
}