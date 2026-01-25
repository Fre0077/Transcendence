// defaults
import { router } from "@/router";
import { loadNavbar } from "@/components/navbar";
// import { load404Page } from "@/pages/errors/404";

// servicets
import { TournamentWebSocket, ConnectTournamentSocket } from "@/services/ws/tournamentWebSocket";

// const TOURNAMENT_WEBSOCKET_URL = `ws://${window.location.hostname}:3029/ws/tournament`;

let tournamentWS:TournamentWebSocket | null = null;
let tourn_code:string | undefined = undefined;

export function loadTournamentHubPage(): HTMLElement
{

    /* --------------- GET QUERY --------------- */
    const query = router.getQuery().get("tourn-id");
    if (query) tourn_code = query;

    console.log('Got query', tourn_code);
    /* ----------------------------------------- */

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
                            <button class="format-option w-full text-left text-white font-mono px-3 py-2 hover:bg-cyan-600/20" data-value="single-elimination">
                                Single Elimination
                            </button>
                            <button class="format-option w-full text-left text-white font-mono px-3 py-2 hover:bg-cyan-600/20" data-value="double-elimination">
                                Double Elimination
                            </button>
                            <button class="format-option w-full text-left text-white font-mono px-3 py-2 hover:bg-cyan-600/20" data-value="round-robin">
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
                                <span class="ml-2">(0: Easy, 100: Hard)</span>
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

            <!-- Rejoin Tourn Card -->
            <a id="rejoin-tourn-btn"
                class="hidden group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-600/20 to-teal-600/20 p-8 border border-green-500/30 hover:border-green-400/70 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20">
            </a>
        
        
        </div>
    </div>
    `;

    // connect to the backend
    tournamentWS = ConnectTournamentSocket(() => {}, tourn_code);

    // add listeners to socket messages
    tournamentWS.onmessage(() => {}, pushToTournament);

    // update tournament code
    tourn_code = tournamentWS.getid();

    // eventually load rejoin button
    if (tourn_code) {
        const reJoinBtn = div.querySelector('#rejoin-tourn-btn') as HTMLAnchorElement;

        // Set the button content
        reJoinBtn.innerHTML = `
            <div class="relative z-10 text-center">
                <div class="text-5xl mb-4">↩️</div>
                <h3 class="text-xl font-bold text-white mb-2">Re-Join Tournament</h3>
                <p class="text-sm text-white/70">Resume your last tourament</p>
                <p class="text-xs text-white/50 mt-1">Tournament ID: <span class="font-mono">${tourn_code}</span></p>
            </div>
        `;

        // Make it visible
        reJoinBtn.classList.remove('hidden');

        // Make it work
        reJoinBtn.onclick = (e) => {
            e.preventDefault();
            if (tourn_code) pushToTournament(tourn_code);
        };
    }


    // JOIN button code
    const joinTournBtn = div.querySelector('#joinTournBtn');
    if (joinTournBtn) {
        joinTournBtn.addEventListener('click', () => {
            const tourn_code = prompt('Enter Toruament Code:');
			if (tourn_code) {

				// leave old toruament
				tournamentWS?.leave();

				// join new lobby
				tournamentWS?.join(tourn_code);
			}
        });
    }
    

    /* --------------------------------------------------------- */
    /*                      CREATE FORM LOGIC                    */

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
    div.querySelectorAll('.format-option').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedFormat = (btn as HTMLElement).dataset.value!;
            selectedFormatSpan.textContent = selectedFormat;
        });
    });

    const formatButtons = div.querySelectorAll('.format-option');

    formatButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            selectedFormat = (btn as HTMLElement).dataset.value!;
            selectedFormatSpan.textContent = selectedFormat;

            // Reset all buttons
            formatButtons.forEach(b => {
                b.classList.remove('font-extrabold', 'text-green-300', 'bg-cyan-600/20');
                b.classList.add('text-white');
            });

            // Highlight selected one
            btn.classList.remove('text-white');
            btn.classList.add('font-extrabold', 'text-green-300', 'bg-cyan-600/20');
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
        tournamentWS?.create(playerCount, selectedFormat);

        // add bots if requested
        for (let i = 0; i < botCount; i++) {
            tournamentWS?.addbot(100 - botLevel);
        }
        
    });

    return div;
}

/* ------------------------------------------------ */

// move to tournament page
function pushToTournament(tournamentID:string)
{
    // close connection
    tournamentWS?.close();

    // go to tournament page
    router.push(`/tournament/${tournamentID}`);
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