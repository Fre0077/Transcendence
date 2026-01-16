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

		console.log('Drawing', state);

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

		// ball
		ctx.fillRect(
			ball.pos[0] * canvas.width - ballWidthSubtr,
			ball.pos[1] * canvas.height - ballHeightSubtr,
			ballWidth,
			ballHeight
		);
	};
}
