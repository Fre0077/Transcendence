import { load404Page } from "@/pages/errors/404";

const basePongPath = `http://${window.location.hostname}:3040/`;

import { router } from "@/router";

export function loadOnlineGamePage(): HTMLElement {

    // @aleborghi actually il codice del game non serve che il frontend lo abbia
    // dato che la lobby dice al game che player deve aspettarsi
    // const { matchId } = router.getParams();

    // connect socket
    const playerID = localStorage.getItem('playerID') || sessionStorage.getItem('guestID');
    if (playerID === null) {
        return load404Page();
    }

    // coonnecction with backend (somehow safari does this twice)
    const socket = createWebSocketConnection(playerID/* , matchId */);

    const div = document.createElement('div');
    div.className = 'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col';
    div.innerHTML = /*html*/ `

    <!-- Online Game Page Content -->

        <!-- (ChatGPT) -->
        <br>
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
                    Back
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
    `;

    // Add event listener for create game button
    const leaveGameBtn = div.querySelector('#leaveGameBtn');
    if (leaveGameBtn) {
        leaveGameBtn.addEventListener('click', () => {
            // createLobby(/* playerID,  */format, lobbyWS);

            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ method: 'LEAVE' }));

                // IMPORTANT becouse some browse open 1231234 sockets
                socket.close();
            }
            router.back();
        });
    }

    // inputs
    document.addEventListener("keydown", (e) => {
        if (e.repeat) return;
        if (e.code === "Space" || e.code === "ArrowUp" || e.code === "ArrowDown") e.preventDefault(); // 🚫 stop page scrolling
        switch (e.key) {
          case "w": socket.send(JSON.stringify({ method: "MOVE", value: "UP_PRESS" })); break;
          case "s": socket.send(JSON.stringify({ method: "MOVE", value: "DW_PRESS" })); break;
          case "ArrowUp": socket.send(JSON.stringify({ method: "MOVE", value: "UP_PRESS" })); break;
          case "ArrowDown": socket.send(JSON.stringify({ method: "MOVE", value: "DW_PRESS" })); break;
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
          case "ArrowUp": socket.send(JSON.stringify({ method: "MOVE", value: "UP_RELEASE" })); break;
          case "ArrowDown": socket.send(JSON.stringify({ method: "MOVE", value: "DW_RELEASE" })); break;

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

function createWebSocketConnection(playerID:string/* , game_code: string */): WebSocket
{
    const ws = new WebSocket(basePongPath.replace('http', 'ws') + 'gamesocket');
    console.log(basePongPath.replace('http', 'ws') + 'gamesocket');

    ws.onopen = () => {
        sleep(1100)
        .then(() => {
            console.log('Connected to lobby WebSocket');
    
            // @topiana- aggiunta la AUTH call all'inizio della connesione #review pls
            ws.send(JSON.stringify({ method: 'AUTH', playerID: playerID }));
            // ws.send(JSON.stringify({ method: 'JOIN', gameID: game_code }));  // (outdated)
        });
    };

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            const method = data.method || '';
            
            /* #debug */
            if (data.method) console.log('Lobby WebSocket message received:', data);

            if (method === "JOIN_REPLY")
            {
                if (data.status === "success") console.log("Joined successfully");
                else if (data.status === "failure" && data.cause !== 'rejoin' /* really important since some browsers rejoin a bunch of times */)
                {
                    console.log("Couldn't connect to server");
                    if(serverLog) serverLog.innerText = `Error trying to connect to game, reason: ${data.reason}`;
        
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
                    ws.close(); // #todo maybe not?
                }
            }
            else if (data.players && data.ball && data.score) {drawGame(data);}
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

function drawGame(state:{players:any, ball:any, score:any} )
{
    // BOARD
    const element = document.getElementById('game');
    const canvas:HTMLCanvasElement | null = (element instanceof HTMLCanvasElement) ? element : null;
    const ctx = canvas?.getContext("2d");

    // DATA
    const scorePlayer1 = document.getElementById("player1Score");
    const scorePlayer2 = document.getElementById("player2Score");   
    const player1Name = document.getElementById("player1Name");
    const player2Name = document.getElementById("player2Name");

    if (!canvas || !ctx)
    {
        console.log("Couldn't find canvas/scoreboad/ctx");
        return ;
    }
    
    // clear stuff
    canvas.style.display = "block";
    ctx?.clearRect(0, 0, canvas.width, canvas.height);

    // const paddleHeight1 = canvas.height * state.players[0].paddle.height;
    // const paddleHeight2 = canvas.height * state.players[1].paddle.height;

    // // console.log(`height1 ${paddleHeight1}`);
    // // console.log(`height2 ${paddleHeight2}`);

    // const paddleWidth1 = canvas.width * state.players[0].paddle.width;
    // const paddleWidth2 = canvas.width * state.players[1].paddle.width;

    // const paddleOffset1 = canvas.width * state.players[0].paddle.offset;
    // const paddleOffset2 = canvas.width * state.players[1].paddle.offset;
    // const ballSize = 10;

    /* ---- GAME DATA ----- */
    if (scorePlayer1) scorePlayer1.textContent = state.score[0];
    if (scorePlayer2) scorePlayer2.textContent = state.score[1];
    // @aleborghi: aggiorna mettendo l'username e nn l'ID
    if (player1Name) player1Name.textContent = state.players[0].ID;
    if (player2Name) player2Name.textContent = state.players[1].ID;

    /* ---- GAME BOARD ---- */
    const ball = state.ball;
	const player1 = state.players[0];
	const player2 = state.players[1];

	// Clear canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	canvas.style.display = "block";

	// Draw paddles
	ctx.fillStyle = 'white';

	// Player 1
	ctx.fillRect(
		player1.paddle.offset * canvas.width,
		(player1.paddle.posY - player1.paddle.height / 2) * canvas.height,
		player1.paddle.width * canvas.width,
		player1.paddle.height * canvas.height
	);
	// Player 2
	ctx.fillRect(
		canvas.width - (player2.paddle.offset + player2.paddle.width) * canvas.width,
		(player2.paddle.posY - player2.paddle.height / 2) * canvas.height,
		player2.paddle.width * canvas.width,
		player2.paddle.height * canvas.height
	);

	// Draw ball
	const ballSize = 0.02; // 2% of canvas size
	ctx.fillRect(
		ball.pos[0] * canvas.width - (ballSize * canvas.width) / 2,
		ball.pos[1] * canvas.height - (ballSize * canvas.height) / 2,
		ballSize * canvas.width,
		ballSize * canvas.height
	);
}