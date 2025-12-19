import { loadNavbar } from "@/components/navbar";

const baseLobbyPath = 'http://localhost:3031/';

interface Player {
    id: string;
    name: string;
    status?: string;
}

export function loadOnlineLobbyPage(): HTMLElement {
    let lobby_code = '';
    let connected_players: Player[] = [];

    // @topiana- we need playerID to authenticate the connection, so I passed it to createWebSocketConnection 

    const playerID = localStorage.getItem('playerID') || sessionStorage.getItem('guestID') || 'Guest_' + Math.floor(Math.random() * 1000);
    const format = 3; // Best of 3 rounds
    
    let lobbyWS = createWebSocketConnection(playerID, lobby_code, connected_players);

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
            <a id="createGameBtn" class="group relative overflow-hidden rounded-xl bg-gradient-to-br from-cyan-600/20 to-blue-600/20 p-8 border border-cyan-500/30 hover:border-cyan-400/70 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20">
                <div class="relative z-10 text-center">
                    <div class="text-5xl mb-4">🎮</div>
                    <h3 class="text-xl font-bold text-white mb-2">Create Game</h3>
                    <p class="text-sm text-white/70">Set up a new online lobby</p>
                </div>
            </a>
            
            <!-- Join Game Card -->
            <a id="joinGameBtn" class="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-600/20 to-teal-600/20 p-8 border border-green-500/30 hover:border-green-400/70 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20">
                <div class="relative z-10 text-center">
                    <div class="text-5xl mb-4">🔗</div>
                    <h3 class="text-xl font-bold text-white mb-2">Join Game</h3>
                    <p class="text-sm text-white/70">Enter a lobby code</p>
                </div>
            </a>

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
                            <ul id="connectedPlayersList" class="space-y-1">
                                ${connected_players.length > 0 ? connected_players.map(player => `<li class="text-sm text-white/80">• ${player.name}</li>`).join('') : '<li class="text-sm text-white/40 italic">No players connected</li>'}
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- ACTION BAR (STUCK TO BOTTOM, FULL WIDTH) -->
                <div class="border-t border-white/10">
                    <div class="flex w-full">

                        <!-- Start Game -->
                        <a id="startGameBtn" class="flex-1 flex items-center justify-center py-3 text-sm font-medium text-white bg-green-600/20 hover:bg-green-600/30 transition">
                            Start Game
                        </a>

                        <!-- Leave Lobby -->
                        <a id="leaveLobbyBtn" class="flex-1 flex items-center justify-center py-3 text-sm font-medium text-white bg-red-600/20 hover:bg-red-600/30 transition">
                            Leave Lobby
                        </a>

                    </div>
                </div>
            </div>



            <!-- BOT card (ChatGPT) -->
            <div class="flex flex-col h-full rounded-xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 overflow-hidden">

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
                            id="addBotBtn"
                            class="flex-1 flex items-center justify-center py-3 text-sm font-medium text-white bg-green-600/20 hover:bg-green-600/30 transition"
                        >
                            ADD
                        </button>

                        <!-- LEAVE button -->
                        <button
                            id="remBotBtn"
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
    const createGameBtn = div.querySelector('#createGameBtn');
    if (createGameBtn) {
        createGameBtn.addEventListener('click', () => {
            createLobby(/* playerID,  */format, lobbyWS);
        });
    }

    const joinGameBtn = div.querySelector('#joinGameBtn');
    if (joinGameBtn) {
        joinGameBtn.addEventListener('click', () => {
            const lobby_code = prompt('Enter Lobby Code:');
            if (lobby_code) {
                joinLobby(lobby_code, /* playerID, */ lobbyWS);
            }
        });
    }
    
    const leaveLobbyBtn = div.querySelector('#leaveLobbyBtn');
    if (leaveLobbyBtn) {
        leaveLobbyBtn.addEventListener('click', () => {
            console.log('Leave Lobby Button clicked');
            leaveLobby(lobby_code, connected_players, lobbyWS);
            lobbyWS = createWebSocketConnection(playerID, lobby_code, connected_players);
        });
        console.log('Leave Lobby Button found and event listener added');
    }

    const startGameBtn = div.querySelector('#startGameBtn');
    if (startGameBtn) {
        startGameBtn.addEventListener('click', () => {
            startGame(/* lobby_code, */ lobbyWS);
        });
    }

    //----------------------
    // @topiana-
    const slider = div.querySelector("#botLevelSlider") as HTMLInputElement;
    const addBotBtn = div.querySelector('#addBotBtn');
    if (addBotBtn && slider) {
        addBotBtn.addEventListener('click', () => {
            const level = slider.value;
            addBot(Number(level), lobbyWS);
        });
    }

    const remBotBtn = div.querySelector('#remBotBtn');
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
    if (playersListElem) {
        if (connected_players.length > 0) {
            playersListElem.innerHTML = connected_players.map(player => `<li class="text-sm text-white/80">• ${player.name} - ${player.status}</li>`).join('');
        } else {
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

function createWebSocketConnection(playerID:string, lobby_code: string, connected_players: Player[]): WebSocket {
    const ws = new WebSocket(baseLobbyPath.replace('http', 'ws') + 'lobbysocket');
    console.log(baseLobbyPath.replace('http', 'ws') + 'lobbysocket');

    ws.onopen = () => {
        console.log('Connected to lobby WebSocket');

        // @topiana- aggiunta la AUTH call all'inizio della connesione #review pls
        ws.send(JSON.stringify({ method: 'AUTH', playerID: playerID }));
    };

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            console.log('Lobby WebSocket message received:', data);
            // let updateNeeded = false; // (outdated)
            const method = data.method || '';
            if (method === 'START_REPLY' && data.status === 'success') {
                console.log('Lobby is starting the game:', data.comment);


                // @topiana- load the game page #review pls
                // window.location.href = `/game:${data.value}`;

                // #remove
                window.sessionStorage.setItem('guestID', playerID);

                
                router.push(`/game/${data.value}`);

            }
            // @topiana-
            else if (method === 'AUTH_REPLY' && data.status === 'success') {
                console.log('Authenticatd successfully');


                // reset lobbycode
                // lobby_code = ''; // (not necessary)

            }
            /* interface LobbyState {
                ID:string;
                gameID:string;
                players: {
                    ID:string;
                    status:string;
                }[];
            } */
            if (data.ID && data.players)
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
            /* lobby_code = data.ID;
            if (checkPlayerListChanged(connected_players, data.players)) {
                updateNeeded = true;
                connected_players = data.players.map((p: any) => ({
                    id: p.ID,
                    name: p.ID,
                    status: p.status
                }));
            }
            if (updateNeeded)
                updateLobbyInfo(lobby_code, connected_players); */
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