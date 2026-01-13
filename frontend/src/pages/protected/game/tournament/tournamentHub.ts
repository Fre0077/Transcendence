import { loadNavbar } from "@/components/navbar";

const baseTournamentPath = `http://${window.location.hostname}:3032/`;

export function loadTournamentHubPage(): HTMLElement
{

    // @topiana- we need playerID to authenticate the connection, so I passed it to createWebSocketConnection 

    const playerID = localStorage.getItem('playerID') || sessionStorage.getItem('guestID') || 'Guest_' + Math.floor(Math.random() * 1000);
    
    let tournamentWS = createWebSocketConnection(playerID);

    //----

    const div = document.createElement('div');
    div.className = 'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col';
    div.innerHTML = /*html*/ `
    ${loadNavbar().outerHTML}
    <!-- Online Lobby Page Content -->
    <div class="flex-1 container mx-auto px-4 flex flex-col items-center justify-center gap-8">
        <div class="text-center mb-8">
            <h1 class="text-5xl font-bold text-white mb-4">Online Tournament HUB</h1>
            <p class="text-lg text-white/60">Create or join an online tournament!</p>
        </div>

        <div class="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Join Tourn Card -->
            <a id="joinTournBtn" class="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-600/20 to-teal-600/20 p-8 border border-green-500/30 hover:border-green-400/70 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20">
                <div class="relative z-10 text-center">
                    <div class="text-5xl mb-4">🔗</div>
                    <h3 class="text-xl font-bold text-white mb-2">Join Tournament</h3>
                    <p class="text-sm text-white/70">Enter a lobby code</p>
                </div>
            </a>
        
            <!-- Create Tourn Card -->
            <div id="createTournCard" class="relative overflow-hidden rounded-xl bg-gradient-to-br from-cyan-600/20 to-blue-600/20 p-8 border border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
                <div class="text-center cursor-pointer" id="createTournHeader">
                    <div class="text-5xl mb-4">🎮</div>
                    <h3 class="text-xl font-bold text-white mb-2">Create Tournament</h3>
                    <p class="text-sm text-white/70">Set up a new online Tournament</p>
                </div>

                <!-- EXPANDABLE CONTENT -->
                <div id="createTournOptions" class="mt-6 hidden">

                    <!-- Player Count -->
                    <div class="mb-4">
                        <label class="block text-sm text-white/70 mb-1">Number of Players</label>
                        <input
                            id="playerCountInput"
                            type="number"
                            min="2"
                            max="128"
                            value="8"
                            class="w-full rounded-lg bg-slate-800 text-white px-3 py-2 outline-none border border-white/10 focus:border-cyan-400"/>
                    </div>

                    <!-- Format Selector -->
                    <div class="mb-4">
                        <label class="block text-sm text-white/70 mb-1">Tournament Format</label>
                        <div id="formatList" class="max-h-32 overflow-y-auto rounded-lg bg-slate-800 border border-white/10">
                            <button class="format-option w-full text-left px-3 py-2 hover:bg-cyan-600/20" data-value="single-elimination">
                                Single Elimination
                            </button>
                            <button class="format-option w-full text-left px-3 py-2 hover:bg-cyan-600/20" data-value="double-elimination">
                                Double Elimination
                            </button>
                            <button class="format-option w-full text-left px-3 py-2 hover:bg-cyan-600/20" data-value="round-robin">
                                Round Robin
                            </button>
                        </div>

                        <p class="text-xs text-white/50 mt-1">
                            Selected: <span id="selectedFormat">single-elimination</span>
                        </p>
                    </div>

                    <!-- Create Button -->
                    <button
                        id="confirmCreateTourn" class="w-full mt-4 rounded-lg bg-cyan-600 py-2 text-white font-semibold hover:bg-cyan-500">
                        Create Tournament
                    </button>
                </div>
            </div>
        
        </div>
    </div>
    `;

    // Add event listener for create game button
    /* const createTournBtn = div.querySelector('#createTournBtn');
    if (createTournBtn) {
        createTournBtn.addEventListener('click', () => {
            create(tournamentWS);
        });
    } */

    const joinTournBtn = div.querySelector('#joinTournBtn');
    if (joinTournBtn) {
        joinTournBtn.addEventListener('click', () => {
            const tourn_conde = prompt('Enter Tournament Code:');
            if (tourn_conde) {
                join(tourn_conde, tournamentWS);
            }
        });
    }

    /* Chat-GPT does it's things: select a number of players and tournament stats */
    const createHeader = div.querySelector('#createTournHeader')!;
    const options = div.querySelector('#createTournOptions') as HTMLDivElement;
    const playerCountInput = div.querySelector('#playerCountInput') as HTMLInputElement;
    const selectedFormatSpan = div.querySelector('#selectedFormat')!;
    let selectedFormat = 'single-elimination';

    // Expand / collapse
    createHeader.addEventListener('click', () => {
        options.classList.toggle('hidden');
    });

    // Format selection
    /* div.querySelectorAll('.format-option').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedFormat = (btn as HTMLElement).dataset.value!;
            selectedFormatSpan.textContent = selectedFormat;
        });
    }); */

    const formatButtons = div.querySelectorAll('.format-option');

    formatButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            selectedFormat = (btn as HTMLElement).dataset.value!;
            selectedFormatSpan.textContent = selectedFormat;

            // Reset all buttons
            formatButtons.forEach(b => {
                b.classList.remove('font-bold', 'text-cyan-400', 'bg-cyan-600/20');
            });

            // Highlight selected one
            btn.classList.add('font-bold', 'text-cyan-400', 'bg-cyan-600/20');
        });
    });

    // Create tournament
    div.querySelector('#confirmCreateTourn')?.addEventListener('click', () => {
        const playerCount = Number(playerCountInput.value);

        // check on the player count
        if (playerCount < 2) {
            alert('At least 2 players required.');
            return;
        }

        // type check
        if (selectedFormat !== 'single-elimination')
        {
            alert('Only single-elimination supported yet');
            return ;
        }

        // player check specific for each format
        if (selectedFormat === 'single-elimination')
        {
            if (!isPowOf(2, playerCount))
            {
                alert('In Single elimination only power of 2 player count allowed');
                return ;
            }
        }

        // assemble and send the create ruequest
        create(playerCount, selectedFormat, tournamentWS);
    });

    
    /* const leaveTournBtn = div.querySelector('#leaveTournBtn');
    if (leaveTournBtn) {
        leaveTournBtn.addEventListener('click', () => {
            console.log('Leave Lobby Button clicked');
            leaveTourn(tournament_code, connected_players, tournamentWS);
            tournamentWS = createWebSocketConnection(playerID, tournament_code, connected_players);
        });
        console.log('Leave Lobby Button found and event listener added');
    } */

    /* const startGameBtn = div.querySelector('#startGameBtn');
    if (startGameBtn) {
        startGameBtn.addEventListener('click', () => {
            startGame(tournamentWS);
        });
    } */

    //----------------------
    // @topiana-
    /* const slider = div.querySelector("#botLevelSlider") as HTMLInputElement;
    const addBotBtn = div.querySelector('#addBotBtn');
    if (addBotBtn && slider) {
        addBotBtn.addEventListener('click', () => {
            const level = slider.value;
            addBot(Number(level), tournamentWS);
        });
    }

    const remBotBtn = div.querySelector('#remBotBtn');
    if (remBotBtn) {
        remBotBtn.addEventListener('click', () => {
            remBot(tournamentWS);
        });
    } */

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
function create(size:number = 4, format:string = 'single-elimination', socket:WebSocket)
{
    // assemble create request
    const createRequest = {
        method: 'CREATE',
        size: size,
        format: format
    };

    // send create request
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(createRequest));
    }
}

function join(code: string, socket:WebSocket)
{
    // assemble join request
    const joinRequest = {
        method: 'JOIN',
        tournamentID: code
    };

    // send join request
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(joinRequest));
    }
}

/* function leave(code: string, connected_players: Player[], socket:WebSocket) {
    
    // @topiana- check on socket state
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ method: 'LEAVE' }));
    } else {
        console.log("Socket closed, couldn't leave lobby");
        return ;
    }

    // cleanup
    socket.close();
    code = '';
    connected_players = [];
    // updateLobbyInfo(code, connected_players);
}

// message received: {"method":"START_REPLY","status":"success","value":"00d78701-cb70-4535-81f3-c7b96bcd757b","comment":"The lobby is now in game"}
function ready(socket: WebSocket) {
    const startGameRequest = {
        method: 'READY',
        // lobbyID: lobby_code // outdated
    };
    socket.send(JSON.stringify(startGameRequest));
}

// @topiana- add a bot
function addBot(level:number, socket:WebSocket)
{
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ method: 'BOT', value: 'ADD', level: level }))
    }
}

// @topiana- remove a bot
function remBot(socket:WebSocket)
{
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ method: 'BOT', value: 'REMOVE'}))
    }
} */

// #review pls (ChatGPT)
import { router } from "@/router";

function createWebSocketConnection(playerID:string): WebSocket
{
    const ws = new WebSocket(baseTournamentPath.replace('http', 'ws') + 'tournamentsocket');
    console.log(baseTournamentPath.replace('http', 'ws') + 'tournamentsocket');

    ws.onopen = () => {
        console.log('Connected to tournament WebSocket');

        // @topiana- aggiunta la AUTH call all'inizio della connesione #review pls
        ws.send(JSON.stringify({ method: 'AUTH', playerID: playerID }));
    };

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            console.log('Tournament WebSocket message received:', data);
            // let updateNeeded = false; // (outdated)
            const method = data.method || '';
            if (method === 'CREATE_REPLY' && data.status === 'success') {
                console.log('Tournament created:', data.comment);


                // @topiana- load the game page #review pls
                // window.location.href = `/game:${data.value}`;

                // #remove
                window.sessionStorage.setItem('guestID', playerID);

                
                router.push(`/tournament/${data.value}`);

            }
            // @topiana-
            else if (method === 'AUTH_REPLY' && data.status === 'success') {
                console.log('Authenticatd successfully');


                // reset lobbycode
                // lobby_code = ''; // (not necessary)

            }
            /* interface TournamentState {
                ID:string;
                // gameID:string;
                players: {
                    ID:string;
                    status:string;
                }[];
                rooms: {
                    // id room
                    layer:number;
                    idx:number;

                    players:string[];

                    // outcome
                    winner:string[];
                    score:number[];
                }[]
            } */

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


/* ---------------------------------------- */
/*                  UTILS                   */
/* ---------------------------------------- */

function isPowOf(base:number, num:number): number
{
	let pow = 0;

	while (num !== 1)
	{
		pow++;
		num /= base;
		if (num !== 1 && num % base !== 0) return 0;
	}

	return pow;
}