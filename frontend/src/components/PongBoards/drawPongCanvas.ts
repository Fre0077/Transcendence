
// (ChatGPT)
function drawCountdown(
	ctx: CanvasRenderingContext2D,
	timeout: number,
	canvasWidth: number,
	canvasHeight: number
) {
	if (timeout <= 0) return;

	const FPS = 60;

	// Which number to show (3,2,1...)
	const secondsLeft = Math.ceil(timeout / FPS);

	// Progress within the current second (0 → 1)
	const frameInSecond = timeout % FPS;
	const t = 1 - frameInSecond / FPS;

	// Ease-out for smooth fade
	const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

	const alpha = easeOut(t);           // fade out
	const scale = 0.8 + 0.4 * easeOut(t); // subtle zoom

	ctx.save();
	ctx.translate(
		Math.round(canvasWidth / 2),
		Math.round(canvasHeight / 2)
	);
	ctx.scale(scale, scale);

	ctx.globalAlpha = alpha * 0.9;
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.font = "81px 'Press Start 2P', monospace";

	// Optional glow
	ctx.shadowColor = "rgba(255,255,255,0.35)";
	ctx.shadowBlur = 14;

	ctx.fillText(String(secondsLeft), 0, 0);
	ctx.restore();
}


export default function drawPongCanvas(root: HTMLElement)
{
	// gets the canvas
	const canvas = root.querySelector<HTMLCanvasElement>("#game");
	if (!canvas) throw new Error("Canvas not found");

	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Canvas ctx not found");

	// default setups
	ctx.fillStyle = "white";
	canvas.style.display = "block";

	// constants
	const ballSize = 0.02;
	const ballWidth = ballSize * canvas.width;
	const ballHeight = ballSize * canvas.height;
	const ballWidthSubtr = ballSize * canvas.width / 2;
	const ballHeightSubtr = ballSize * canvas.width / 2;

	// returns a function
	return function draw(state: any) {

		// // console.log('Drawing', state);

		// clear the board
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		/* ---- GAME BOARD ---- */
		const { ball, players } = state;
		// if (!players || players.length !== 2) return;

		// player 1
		const p1 = players[0].paddle;
		ctx.fillRect(
			p1.offset * canvas.width,
			(p1.posY - p1.height / 2) * canvas.height,
			p1.width * canvas.width,
			p1.height * canvas.height
		);

		// player 2
		const p2 = players[1].paddle;
		ctx.fillRect(
			canvas.width - (p2.offset + p2.width) * canvas.width,
			(p2.posY - p2.height / 2) * canvas.height,
			p2.width * canvas.width,
			p2.height * canvas.height
		);

		// If we're on timeout
		if (state.timeout > 0)
		{
			// ⏱ countdown overlay (ChatGPT)
			drawCountdown(ctx, state.timeout, canvas.width, canvas.height);
		}
		// if we aren't
		else
		{
			// draw ball
			ctx.fillRect(
				ball.pos[0] * canvas.width - ballWidthSubtr,
				ball.pos[1] * canvas.height - ballHeightSubtr,
				ballWidth,
				ballHeight
			);
		}
	};
}
