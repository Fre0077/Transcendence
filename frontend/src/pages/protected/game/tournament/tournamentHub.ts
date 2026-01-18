import { loadNavbar } from "@/components/navbar";
import { load404Page } from "@/pages/errors/404";

const TOURNAMENT_WEBSOCKET_URL = `ws://${window.location.hostname}:3029/ws/tournament`;

export function loadTournamentHubPage(): HTMLElement
{

    // @topiana- we need playerID to authenticate the connection, so I passed it to createWebSocketConnection 

    const playerID = localStorage.getItem('userId'/* ) || sessionStorage.getItem('guestID') || 'Guest_' + Math.floor(Math.random() * 1000 */);
        if (!playerID)
                return load404Page();
            
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

                    <!-- Bots Section -->
                    <div class="mb-4 border-t border-white/10 pt-4">
                        <label class="block text-sm text-white/70 mb-1">
                            Bots (<span id="botCountLabel">0</span>)
                        </label>

                        <input
                            id="botCountInput"
                            type="range"
                            min="0"
                            value="0"
                            class="w-full accent-cyan-500"/>

                        <p class="text-xs text-white/50 mt-1">
                            Max bots: <span id="botMaxLabel">7</span>
                        </p>

                        <!-- Bot Level -->
                        <div class="mt-3">
                            <label class="block text-sm text-white/70 mb-1">
                                Bot Strength
                            </label>

                            <input
                                id="botLevelInput"
                                type="range"
                                min="0"
                                max="100"
                                value="50"
                                class="w-full accent-cyan-500"/>

                            <p class="text-xs text-white/50 mt-1">
                                Level: <span id="botLevelLabel">50</span>
                                <span class="ml-2">(0 = strong, 100 = weak)</span>
                            </p>
                        </div>
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

    /* -------------------- BOTS (ChatGPT) --------------------- */
    const botCountInput = div.querySelector('#botCountInput') as HTMLInputElement;
    const botCountLabel = div.querySelector('#botCountLabel')!;
    const botMaxLabel = div.querySelector('#botMaxLabel')!;
    const botLevelInput = div.querySelector('#botLevelInput') as HTMLInputElement;
    const botLevelLabel = div.querySelector('#botLevelLabel')!;


    function updateBotLimits() {
        const maxBots = Math.max(0, Number(playerCountInput.value) - 1);
        botCountInput.max = String(maxBots);
        botMaxLabel.textContent = String(maxBots);
    
        if (Number(botCountInput.value) > maxBots) {
            botCountInput.value = String(maxBots);
        }
    
        botCountLabel.textContent = botCountInput.value;
    }
    
    // Initial sync
    updateBotLimits();
    
    playerCountInput.addEventListener('input', updateBotLimits);    


    botCountInput.addEventListener('input', () => {
        botCountLabel.textContent = botCountInput.value;
    });
    
    botLevelInput.addEventListener('input', () => {
        botLevelLabel.textContent = botLevelInput.value;
    });

    /* -------------------------------------------------------- */

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
        const botCount = Number(botCountInput.value);
        const botLevel = Number(botLevelInput.value);

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

        // add bots if requested
        for (let i = 0; i < botCount; i++) {
            addbot(botLevel, tournamentWS);
        }
        
    });

    return div;
}

// @topiana- add a bot
function addbot(level:number, ws:WebSocket)
{
	if (ws.readyState === WebSocket.OPEN) {
		ws.send(JSON.stringify({ method: 'BOT', value: 'ADD', level: level }))
	}
}


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

// move to tournament page
function pushToTournament(socket:WebSocket, /* playerID:string, */ tournamentID:string)
{
    // #remove
    // window.sessionStorage.setItem('guestID', playerID);

    // disconnect the websocket
    socket.close();
    
    router.push(`/tournament/${tournamentID}`);
}

// #review pls (ChatGPT)
import { router } from "@/router";

function createWebSocketConnection(playerID:string): WebSocket
{
    const ws = new WebSocket(TOURNAMENT_WEBSOCKET_URL);
    console.log('Websocketing to', TOURNAMENT_WEBSOCKET_URL);

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

            /* go to the created tournament */
            if (method === 'CREATE_REPLY' && data.status === 'success') {
                console.log('Tournament created:', data.comment);

                pushToTournament(ws, /* playerID, */ data.value);

            }
            /* go to the joined tournament */
            else if (method === 'JOIN_REPLY' && data.status === 'success') {
                console.log('Tournament joined:', data.comment);

                pushToTournament(ws, /* playerID, */ data.value);

            }
            // just logging
            else if (method === 'AUTH_REPLY' && data.status === 'success') {
                console.log('Authenticatd successfully');

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