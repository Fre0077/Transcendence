
interface keys {
	W: boolean;
	S: boolean;
	I: boolean;
	K: boolean;
}


export function loadLocalGamePage() {
	const keys: keys = { W: false, S: false, I: false, K: false };
	connectToGame(keys);
	const div = document.createElement('div');
	div.className = 'min-h-screen bg-gray-900 text-white flex flex-col';
	div.innerHTML = /* html */ `
		<!-- Main Content -->
		<div id=game-container class="flex-1 flex items-center justify-center">
			<canvas id="gameCanvas" width="600" height="600" class="bg-black border border-white/10 rounded-lg"></canvas>
		</div>
	`;

	return div;
}

/* (outdated)
{
	"score":[0,0],
	"ball":[0.5,0.5],
	"player1":0.5,
	"player2":0.5,
	"paddle":[{"heigth":0.1,"width":0.01,"offset":0.05},
	{"heigth":0.1,"width":0.01,"offset":0.05}]}
*/

// interface paddleInfo {
// 	heigth: number;
// 	width: number;
// 	offset: number;
// 	pos: number;
// }

import { Game } from './GameClass.js'

const game = new Game([{idx:0, ID:'Player1'}, {idx:1, ID:'Player2'}]);

function connectToGame(keys: keys) {
	// const ws = new WebSocket('ws://localhost:3002/websocket');

	// ws.onmessage = function (event) {
	// 	// console.log('Message from server ', event.data);

	// 	try {
	// 		const gameData = JSON.parse(event.data);
	// 		updateGameCanvas(gameData);
	// 	} catch (e) {
	// 		console.log('Received non-JSON message:', event.data);
	// 		return;
	// 	}
	// };
	
	// dummy subscription so that the client (the page) can see the updates
	game.subscribe('Player1', updateGameCanvas);
	game.start();

	document.addEventListener('keydown', function (e) {
		if (e.key === ' ') {
			// console.log("Sending message: SPACE_PRESS");
			// ws.send("SPACE_PRESS");
			game.launch();
			return ;
		}
		if (e.key === 'W' || e.key === 'w') game.press(0, 'Up');
		if (e.key === 'S' || e.key === 's') game.press(0, 'Down');
		if (e.key === 'I' || e.key === 'i') game.press(1, 'Up');
		if (e.key === 'K' || e.key === 'k') game.press(1, 'Down');

		keys[e.key.toUpperCase() as keyof keys] = true;
			/* || e.key === 'I' || e.key === 'i' || e.key === 'K' || e.key === 'k') { */
			// const msg = e.key.toUpperCase() + "_PRESS";
			// console.log("Sending message: " + msg);
			// ws.send(msg);
		// }
	});

	document.addEventListener('keyup', function (e) {
		if (e.key === 'W' || e.key === 'w') game.release(0, 'Up');
		if (e.key === 'S' || e.key === 's') game.release(0, 'Down');
		if (e.key === 'I' || e.key === 'i') game.release(1, 'Up');
		if (e.key === 'K' || e.key === 'k') game.release(1, 'Down');

		keys[e.key.toUpperCase() as keyof keys] = false;
		/* if (e.key === 'W' || e.key === 'w' || e.key === 'S' || e.key === 's'
			|| e.key === 'I' || e.key === 'i' || e.key === 'K' || e.key === 'k') {
			const msg = e.key.toUpperCase() + "_RELEASE";
			// console.log("Sending message: " + msg);
			ws.send(msg); */
		// } 
	});
}

interface BallState {
	pos: number[];
	angle: number;
}

interface PaddleState {
	posY:number;
	offset:number;
	height:number;
	width:number;
}

interface PlayerState {
	ID:string;
	paddle:PaddleState;
}

interface GameState {
	score: number[];
	ball: BallState;
	players:PlayerState[];
	playing:boolean;
	timeout: number;
	winner: number;
}

function updateGameCanvas(gameData: any) {
	const state = JSON.parse(gameData) as GameState;
	// const player1: PlayerState = {
	// 	heigth: gameData.paddle[0].heigth,
	// 	width: gameData.paddle[0].width,
	// 	offset: gameData.paddle[0].offset,
	// 	pos: gameData.player1
	// };
	// const player2: paddleInfo = {
	// 	heigth: gameData.paddle[1].heigth,
	// 	width: gameData.paddle[1].width,
	// 	offset: gameData.paddle[1].offset,
	// 	pos: gameData.player2
	// };
	// const ball = {
	// 	x: gameData.ball[0],
	// 	y: gameData.ball[1]
	// };
	const ball = state.ball;
	const player1 = state.players[0];
	const player2 = state.players[1];


	// Get canvas and ctx
	const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
	const ctx = canvas.getContext('2d');
	if (!canvas || !ctx) return;

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
