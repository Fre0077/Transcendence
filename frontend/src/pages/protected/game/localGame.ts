
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
			<canvas id="gameCanvas" width="800" height="600" class="bg-black border border-white/10 rounded-lg"></canvas>
		</div>
	`;

	return div;
}

/*
{
	"score":[0,0],
	"ball":[0.5,0.5],
	"player1":0.5,
	"player2":0.5,
	"paddle":[{"heigth":0.1,"width":0.01,"offset":0.05},
	{"heigth":0.1,"width":0.01,"offset":0.05}]}
*/

interface paddleInfo {
	heigth: number;
	width: number;
	offset: number;
	pos: number;
}

function connectToGame(keys: keys) {
	const ws = new WebSocket('ws://localhost:3002/websocket');

	ws.onmessage = function (event) {
		// console.log('Message from server ', event.data);

		try {
			const gameData = JSON.parse(event.data);
			updateGameCanvas(gameData);
		} catch (e) {
			console.log('Received non-JSON message:', event.data);
			return;
		}
	};

	document.addEventListener('keydown', function (e) {
		if (e.key === ' ') {
			// console.log("Sending message: SPACE_PRESS");
			ws.send("SPACE_PRESS");
		}
		if (e.key === 'W' || e.key === 'w' || e.key === 'S' || e.key === 's'
			|| e.key === 'I' || e.key === 'i' || e.key === 'K' || e.key === 'k') {
			const msg = e.key.toUpperCase() + "_PRESS";
			// console.log("Sending message: " + msg);
			ws.send(msg);
			keys[e.key.toUpperCase() as keyof keys] = true;
		}
	});

	document.addEventListener('keyup', function (e) {
		if (e.key === 'W' || e.key === 'w' || e.key === 'S' || e.key === 's'
			|| e.key === 'I' || e.key === 'i' || e.key === 'K' || e.key === 'k') {
			const msg = e.key.toUpperCase() + "_RELEASE";
			// console.log("Sending message: " + msg);
			ws.send(msg);
			keys[e.key.toUpperCase() as keyof keys] = false;
		}
	});
}

function updateGameCanvas(gameData: any) {
	const player1: paddleInfo = {
		heigth: gameData.paddle[0].heigth,
		width: gameData.paddle[0].width,
		offset: gameData.paddle[0].offset,
		pos: gameData.player1
	};
	const player2: paddleInfo = {
		heigth: gameData.paddle[1].heigth,
		width: gameData.paddle[1].width,
		offset: gameData.paddle[1].offset,
		pos: gameData.player2
	};
	const ball = {
		x: gameData.ball[0],
		y: gameData.ball[1]
	};

	const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
	const ctx = canvas.getContext('2d');
	if (!ctx) return;

	// Clear canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw paddles
	ctx.fillStyle = 'white';
	// Player 1
	ctx.fillRect(
		player1.offset * canvas.width,
		player1.pos * canvas.height,
		player1.width * canvas.width,
		player1.heigth * canvas.height
	);
	// Player 2
	ctx.fillRect(
		canvas.width - (player2.offset + player2.width) * canvas.width,
		player2.pos * canvas.height,
		player2.width * canvas.width,
		player2.heigth * canvas.height
	);

	// Draw ball
	const ballSize = 0.02; // 2% of canvas size
	ctx.fillRect(
		ball.x * canvas.width - (ballSize * canvas.width) / 2,
		ball.y * canvas.height - (ballSize * canvas.height) / 2,
		ballSize * canvas.width,
		ballSize * canvas.height
	);
}
