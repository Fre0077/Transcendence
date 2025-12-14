type Ball = {
	pos:number[],
	angle:number
}

type Paddle = {
	posY:number;
	offset:number;
	height:number;
	width:number;
}

/* NOTE: BOT is always Player2 */
export class Bot
{
	private _lastmove:string;
	private _move:string;
	private _nextmove:string;
	private _exp:number;

	constructor()
	{
		this._lastmove = "null";
		this._move = "null";
		this._nextmove = "null";
		this._exp = -1;
	}

	public get move(): string {
		if (this._move === "null") return this._move;
		console.log(`BOT: ${this._move}`);
		this._lastmove = this._move;
		this._move = this._nextmove;
		this._nextmove = "null";
		return this._lastmove;
	}

	// public get position(): number {
	// 	return 2;
	// }

	public reset() {
		if (this._exp === -1) return;
		console.log("BOT: resetting ...");
		this._lastmove = "null";
		this._move = "null";
		this._nextmove = "null";
		this._exp = -1;
	}

	public play(ball:Ball, paddle:Paddle)
	{
		// calculate coordinate of bot paddle
		const botX = 1 - paddle.offset + paddle.width;

		// calculate hitY of the ball
		this._exp = expectedPos(ball.pos, ball.angle, botX);

		const height_4 = paddle.height / 4;

		// stop the paddle if we reached the expected position
		if (paddle.posY - height_4 < this._exp
			&& paddle.posY + height_4 > this._exp)
		{
			if (this._lastmove === "UP_PRESS")
				this._move = "UP_RELEASE";
			if (this._lastmove === "DW_PRESS")
				this._move = "DW_RELEASE";
		}
		// move Up or Down to reach the expected position
		else if (paddle.posY > this._exp)
		{
			switch (this._lastmove)
			{
				case "UP_PRESS":
					break;
				case "DW_PRESS":
					this._move = "DW_RELEASE";	
					this._nextmove = "UP_PRESS";
					break;
				default:
					this._move = "UP_PRESS";	
			}
		}
		else if (paddle.posY < this._exp)
		{
			switch (this._lastmove)
			{
				case "DW_PRESS":
					break;
				case "UP_PRESS":
					this._move = "UP_RELEASE";	
					this._nextmove = "DW_PRESS";
					break;
				default:
					this._move = "DW_PRESS";	
			}
		}
	}
}

/* calculates the expected position (ChatGPT) */
function expectedPos(pos:number[], angle: number, targetX: number): number
{
    const x0 = pos[0];
    const y0 = pos[1];

    // Convert angle into normalized velocity
    const vx = Math.cos(angle);
    const vy = Math.sin(angle);

    // How far horizontally until target
    const dx = targetX - x0;
    if (vx === 0) return y0; // ball not moving horizontally → fallback
	if (vy === 0) return y0; // ball not moving vertically

    // Raw, unbounded Y at that X
	// (y = mx + q)
    const y = (vy / vx )* dx + y0;

    // Apply vertical reflection inside [0,1]
    const mod = y % 2;
    const reflected = mod <= 1 ? mod : 2 - mod;

    return reflected;
}

