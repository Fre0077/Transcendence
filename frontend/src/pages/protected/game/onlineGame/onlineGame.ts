import { loadNavbar } from "@/components/navbar";
import { load404Page } from "@/pages/errors/404";

const basePongPath = 'http://localhost:3040/';

import { router } from "@/router";

export function loadOnlineGamePage(): HTMLElement {

    const { matchId } = router.getParams();

    // connect socket
    const playerID = localStorage.getItem('playerID') || localStorage.getItem('guestID');
    if (playerID === null) {
        return load404Page();
    }

    // coonnecction with backend (somehow safari does this twice)
    const socket = createWebSocketConnection(playerID, matchId);

    const div = document.createElement('div');
    div.className = 'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col';
    div.innerHTML = /*html*/ `

    <!-- Online Game Page Content -->
    
    <!-- <style>
        canvas { background: #000; display: none; margin: 20px auto; }
        #ui { text-align: center; margin-top: 20px; }
        #gameID { margin-top: 10px; font-weight: bold; }
    </style>

    <div class="flex-1 container mx-auto px-4 flex flex-col items-center justify-center gap-8">
        <div id="scoreboard" align="center" style="display:none;">P1 : P2 </div>

        <canvas id="game" width="600" height="600"></canvas>
        <div id="serverLog"></div>

        <br>
        <div id="leaveGameBtn">Back to Lobby</div>
    </div>  -->

        <!-- (ChatGPT) -->
        <div class="flex-1 container mx-auto px-4 flex flex-col items-center justify-center gap-8">

        <!-- Game Area -->
        <div class="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between gap-6">

            <!-- Player 1 Card -->
            <div class="w-full lg:w-64 rounded-xl bg-gradient-to-br from-cyan-600/20 to-blue-600/20 p-6 border border-cyan-500/30 text-center">
                <div class="text-4xl mb-2">🟦</div>
                <h3 id="player1Name" class="text-lg font-bold text-white mb-1">
                    Player 1
                </h3>
                <p class="text-xs text-white/50 uppercase tracking-wide mb-2">
                    Score
                </p>
                <p id="player1Score" class="text-4xl font-mono text-cyan-400">
                    0
                </p>
            </div>

            <!-- Canvas + Center Area -->
            <div class="flex flex-col items-center gap-4">
                <canvas
                    id="game"
                    width="600"
                    height="600"
                    class="border border-white/20 rounded-lg bg-black shadow-lg"
                ></canvas>

                <div id="serverLog" class="text-sm text-white/50 max-w-md text-center"></div>

                <button
                    id="leaveGameBtn"
                    class="mt-2 px-6 py-2 bg-red-600/20 border border-red-500/30 rounded-lg text-sm text-white hover:bg-red-600/30 transition"
                >
                    Back to Lobby
                </button>
            </div>

            <!-- Player 2 Card -->
            <div class="w-full lg:w-64 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-6 border border-purple-500/30 text-center">
                <div class="text-4xl mb-2">🟥</div>
                <h3 id="player2Name" class="text-lg font-bold text-white mb-1">
                    Player 2
                </h3>
                <p class="text-xs text-white/50 uppercase tracking-wide mb-2">
                    Score
                </p>
                <p id="player2Score" class="text-4xl font-mono text-pink-400">
                    0
                </p>
            </div>

        </div>

    </div>


    <!--
    <div class="flex-1 container mx-auto px-6 py-16 flex flex-col items-center justify-center">
        <h1 class="text-4xl font-bold text-white mb-8">Online Game</h1>
        <p class="text-white/70 mb-12">Create or join an online game to start playing with others!</p>

        <div class="flex flex-row gap-8 w-full max-w-4xl items-center justify-center">
            <a href="/lobby/create" class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600/30 to-teal-600/30 p-8 border border-white/10 hover:border-green-400/50 transition-all hover:scale-105">
                <div class="relative z-10">
                    <div class="text-6xl mb-4">➕</div>
                    <h3 class="text-2xl font-bold text-white mb-2">Create Lobby</h3>
                    <p class="text-white/70">Host a new online game lobby</p>
                </div>
                <div class="absolute inset-0 bg-gradient-to-br from-green-600/0 to-teal-600/0 group-hover:from-green-600/20 group-hover:to-teal-600/20 transition"></div>
            </a>

            <a href="/lobby/join" class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-600/30 to-orange-600/30 p-8 border border-white/10 hover:border-yellow-400/50 transition-all hover:scale-105">
                <div class="relative z-10">
                    <div class="text-6xl mb-4">🔗</div>
                    <h3 class="text-2xl font-bold text-white mb-2">Join Lobby</h3>
                    <p class="text-white/70">Enter a code to join an existing lobby</p>
                </div>
                <div class="absolute inset-0 bg-gradient-to-br from-yellow-600/0 to-orange-600/0 group-hover:from-yellow-600/20 group-hover:to-orange-600/20 transition"></div>
            </a>
        </div>
    </div>
    -->
    `;

    // Add event listener for create game button
    const leaveGameBtn = div.querySelector('#leaveGameBtn');
    if (leaveGameBtn) {
        leaveGameBtn.addEventListener('click', () => {
            // createLobby(/* playerID,  */format, lobbyWS);

            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ method: 'LEAVE' }));
            }
            router.push('/lobby/online');
        });
    }

    // inputs
    document.addEventListener("keydown", (e) => {
        if (e.repeat) return;
        switch (e.key) {
          case "w": socket.send(JSON.stringify({ method: "MOVE", value: "UP_PRESS" })); break;
          case "s": socket.send(JSON.stringify({ method: "MOVE", value: "DW_PRESS" })); break;
          case "Up": socket.send(JSON.stringify({ method: "MOVE", value: "UP_PRESS" })); break;
          case "Down": socket.send(JSON.stringify({ method: "MOVE", value: "DW_PRESS" })); break;
          // case "j": socket.send(JSON.stringify({ method: "MOVE", value: "P2UP_PRESS" })); break;
          // case "n": socket.send(JSON.stringify({ method: "MOVE", value: "P2DW_PRESS" })); break;
          case " ": socket.send(JSON.stringify({ method: "MOVE", value: "START_PRESS" })); break;
        //   case "r": socket.send(JSON.stringify({ method: "MOVE", value: "RESET_PRESS" })); break;
        }
      });
  
      document.addEventListener("keyup", (e) => {
        switch (e.key) {
          case "w": socket.send(JSON.stringify({ method: "MOVE", value: "UP_RELEASE" })); break;
          case "s": socket.send(JSON.stringify({ method: "MOVE", value: "DW_RELEASE" })); break;
          case "Up": socket.send(JSON.stringify({ method: "MOVE", value: "UP_RELEASE" })); break;
          case "Down": socket.send(JSON.stringify({ method: "MOVE", value: "DW_RELEASE" })); break;

          // case "j": socket.send(JSON.stringify({ method: "MOVE", value: "P2UP_RELEASE" })); break;
          // case "n": socket.send(JSON.stringify({ method: "MOVE", value: "P2DW_RELEASE" })); break;
        }
      });

    return div;
}

function sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const serverLog = document.getElementById("serverLog");

function createWebSocketConnection(playerID:string, game_code: string): WebSocket
{
    const ws = new WebSocket(basePongPath.replace('http', 'ws') + 'gamesocket');
    console.log(basePongPath.replace('http', 'ws') + 'gamesocket');

    ws.onopen = () => {
        sleep(1100)
        .then(() => {
            console.log('Connected to lobby WebSocket');
    
            // @topiana- aggiunta la AUTH call all'inizio della connesione #review pls
            ws.send(JSON.stringify({ method: 'AUTH', playerID: playerID }));
            ws.send(JSON.stringify({ method: 'JOIN', gameID: game_code }));
        });
    };

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            console.log('Lobby WebSocket message received:', data);
            const method = data.method || '';
             

            if (method === "JOIN_REPLY")
            {
                if (data.status === "success") console.log("Joined successfully");
                else if (data.status === "failure")
                {
                    console.log("Couldn't connect to server");
                    if(serverLog) serverLog.innerText = `Error trying to connect to: ${data.value}, reason: ${data.reason}`;
        
                    // stop this shit??
                    ws.close();
                }
            }
            else if (method === 'AUTH_REPLY')
            {
                if (data.status === "success") console.log("Authenticated successfully");
                else if (data.status === "failure")
                {
                    console.log("Couldn't Authenticate to Game Service");
                    if(serverLog) serverLog.innerText = `Error trying to connect to: ${data.value}, reason: ${data.reason}`;
        
                    // stop this shit??
                    // ws.close(); #todo maybe not?
                }
            }
            else if (data.paddle && data.ball && data.score) {drawGame(data);}
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

function drawGame(state:{paddle:any, ball:any, score:any} )
{
    const element = document.getElementById('game');
    const canvas:HTMLCanvasElement | null = (element instanceof HTMLCanvasElement) ? element : null;
    const scorePlayer1 = document.getElementById("player1Score");
    const scorePlayer2 = document.getElementById("player2Score");   
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx)
    {
        console.log("Couldn't find canvas/scoreboad/ctx");
        return ;
    }
    
    // clear stuff
    canvas.style.display = "block";
    ctx?.clearRect(0, 0, canvas.width, canvas.height);

    const paddleHeight1 = canvas.height * state.paddle[0].height;
    const paddleHeight2 = canvas.height * state.paddle[1].height;

    // console.log(`height1 ${paddleHeight1}`);
    // console.log(`height2 ${paddleHeight2}`);

    const paddleWidth1 = canvas.width * state.paddle[0].width;
    const paddleWidth2 = canvas.width * state.paddle[1].width;

    const paddleOffset = canvas.width * state.paddle[0].offset;
    const ballSize = 10;

    // scoreboard
    if (scorePlayer1) scorePlayer1.textContent = state.score[0];
    if (scorePlayer2) scorePlayer2.textContent = state.score[1];

    ctx.fillStyle = "white";

    // Midline
    ctx.fillRect(canvas.width / 2, 0, 2, canvas.height);

    // Ball
    ctx.fillRect(
      state.ball.pos[0] * canvas.width - ballSize / 2,
      state.ball.pos[1] * canvas.height - ballSize / 2,
      ballSize,
      ballSize
    );

    // Player 1
    ctx.fillRect(
      paddleOffset,
      state.paddle[0].posY * canvas.height - paddleHeight1 / 2,
      paddleWidth1,
      paddleHeight1
    );

    // Player 2
    ctx.fillRect(
      canvas.width - paddleOffset - paddleWidth2,
      state.paddle[1].posY * canvas.height - paddleHeight2 / 2,
      paddleWidth2,
      paddleHeight2
    );
}