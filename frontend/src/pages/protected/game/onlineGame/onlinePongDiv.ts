// import { load404Page } from "@/pages/errors/404";

// import { router } from "@/router";

export function loadPongDiv(socket:WebSocket): HTMLElement {

	// @aleborghi actually il codice del game non serve che il frontend lo abbia
	// dato che la lobby dice al game che player deve aspettarsi
	// const { matchId } = router.getParams();

	// // connect socket
	// const playerID = localStorage.getItem('playerID') || sessionStorage.getItem('guestID');
	// if (playerID === null) {
	// 	return load404Page();
	// }

	const div = document.createElement('div');

	// connection with backend (somehow safari does this twice)
	// const socket = createWebSocketConnection(div, playerID, matchId);

	// build div
	div.className = 'relative w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col rounded-xl border border-white/10';
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

	// socket.onmessage(message)

	return div;
}

// function sleep(ms:number) {
// 	return new Promise(resolve => setTimeout(resolve, ms));
// }

// const serverLog = document.getElementById("serverLog");

// function createWebSocketConnection(root: HTMLElement, playerID:string, matchId: string): WebSocket
// {
// 	const ws = new WebSocket(basePongPath.replace('http', 'ws') + 'gamesocket');
// 	console.log(basePongPath.replace('http', 'ws') + 'gamesocket');

// 	ws.onopen = () => {
// 		sleep(1100)
// 		.then(() => {
// 			console.log('Connected to lobby WebSocket');
	
// 			// @topiana- aggiunta la AUTH call all'inizio della connesione #review pls
// 			ws.send(JSON.stringify({ method: 'AUTH', playerID: playerID }));
// 			ws.send(JSON.stringify({ method: 'SPECTATE', value: matchId }));
// 		});
// 	};

// 	ws.onmessage = (event) => {
// 		try {
// 			const data = JSON.parse(event.data);
// 			const method = data.method || '';
// 			const finished = (data.winner) ? (data.winner !== -1) ? true : false : false;

// 			// if game finished, remove the dib
// 			if (finished)
// 			{
// 				// always close socket
// 				ws.close();

// 				// remove div
// 				root.remove()
// 			}
			
// 			/* #debug */
// 			if (data.method) console.log('Game WebSocket message received:', data);

// 			if (method === 'AUTH_REPLY')
// 			{
// 				if (data.status === "success") console.log("Authenticated successfully");
// 				else if (data.status === "failure")
// 				{
// 					console.log("Couldn't Authenticate to Game Service");
// 					if(serverLog) serverLog.innerText = `Error trying to connect to: ${data.value}, reason: ${data.reason}`;
		
// 					// stop this shit??
// 					ws.close(); // #todo maybe not?
// 				}
// 			}
// 			else if (data.players && data.ball && data.score) {drawGame(root, data);}
// 		} catch (e) {
// 			console.log("message received:", event.data);
// 		}
// 	};

// 	ws.onerror = (error) => {
// 		console.error('WebSocket error:', error);
// 	};

// 	ws.onclose = () => {
// 		console.log('Disconnected from lobby WebSocket');
// 	};

// 	return ws;
// }

function drawGame(
	root: HTMLElement,
	state:{players:any, ball:any, score:any} 
) {
	// BOARD
	// const element = document.getElementById('game');
	// const canvas:HTMLCanvasElement | null = (element instanceof HTMLCanvasElement) ? element : null;
	const canvas = root.querySelector<HTMLCanvasElement>('#game');
	const ctx = canvas?.getContext("2d");

	// DATA
	const scorePlayer1 = root.querySelector('#player1Score');
	const scorePlayer2 = root.querySelector('#player2Score');
	const player1Name = root.querySelector('#player1Name');
	const player2Name = root.querySelector('#player2Name');

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