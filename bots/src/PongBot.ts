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

type Player = {
	ID:string;
	paddle:Paddle;
}

/* NOTE: BOT is always Player2 */
export class PongBot
{
	// 0 = demon, ..., 100 = dumb
	private _level:number;

	// move variables
	private _lastmove:string;
	private _move:string;
	private _nextmove:string;

	// ingame variables
	private _exp:number;
	private _calculated:boolean;
	private _timeout:number;

	constructor(__level:number = 50)
	{
		this._level = __level;
		this._lastmove = "null";
		this._move = "null";
		this._nextmove = "null";
		this._exp = 0.5;
		this._calculated = false;
		this._timeout = 0;
	}

	// returns the move the bot should make
	public move(): string {
		if (this._move === "null") return this._move;

		// #debug
		// console.log(`BOT: ${this._move}`);

		this._lastmove = this._move;
		this._move = this._nextmove;
		this._nextmove = "null";
		return this._lastmove;
	}

	// checks the move the bot is about to make
	public peek(): string {
		return this._move;
	}

	public reset() {
		if (this._exp === 0.5) return;

		// #debug
		// console.log("BOT: resetting ...");

		this._lastmove = "null";
		this._move = "null";
		this._nextmove = "null";
		this._exp = 0.5;
		this._calculated = false;
		this._timeout = 0;
	}





	/* PARSE OBJECT */
	
	private parse(state:object): { ball:Ball, paddle:Paddle } | undefined {
		// ball is a Ball
		if (!("ball" in state) || !isBall(state.ball)) return undefined;
		// paddle is an array of Paddles
		if (!("players" in state) || !Array.isArray(state.players)
			|| !state.players.every((p: unknown) => isPlayer(p))) return undefined;

		return { ball: state.ball, paddle: state.players[1].paddle };
	}

	public play(state:object)
	{
		let ball:Ball, paddle:Paddle;
	
		try {
			// parse state
			const data = this.parse(state);
			if (data === undefined) return;

			// save ball
			ball = data.ball;
			// clamp ball (shouldn't be neccesary)
			ball.angle = ball.angle % (2 * Math.PI);

			// save paddle
			paddle = data.paddle;
		
		} catch(err) {
			console.log('Error while parsing', err);
			return ;
		}
	
		// calculate coordinate of bot paddle
		const botX = 1 - (paddle.offset + paddle.width);

		// calculate hitY of the ball
		if (ball.angle < Math.PI / 2 || ball.angle > 3 * Math.PI / 2)
		{
			// if not in timeout
			if (this._timeout > 0)
			{
				// #debug
				// console.log('timer', this._timeout);

				--this._timeout;
			}
			// and point not calculated yet
			else if (!this._calculated)
			{
				// #todo maybe error too small
				this._exp = expectedPos(ball.pos, ball.angle, botX) + error(this._level / 500);
				
				// #debug
				// console.log('exp', this._exp);

				this._calculated = true;
			}
		}
		else
		{
			if (this._calculated === true)
			{
				// #debug
				// console.log('Resetting');

				// reset stats
				this._exp = 0.5;
				this._calculated = false;
				this._timeout = Math.floor(this._level) / 1.5;

			}
		}

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
	// console.log('pos', pos);
	// console.log('angle', angle);
	
    const x0 = pos[0];
    const y0 = pos[1];

    // Convert angle into normalized velocity
    const vx = Math.cos(angle);
    const vy = Math.sin(angle);

    // How far horizontally until target
    const dx = targetX - x0;
    if (vx === 0) return y0; // ball not moving horizontally → fallback

    // Raw, unbounded Y at that X
	// (y = mx + q)
    const y = (vy / vx ) * dx + y0;

	// console.log('unbound Y', y);

    // Apply vertical reflection inside [0,1]
    const mod = (y < 0) ? (y % 2) * -1 : y % 2;
    const reflected = mod <= 1 ? mod : 2 - mod;

    return reflected;
}



/* - - - - - - - PARSING - - - - - - - */

function isBall(value: unknown): value is Ball {
	return (
		typeof value === "object" &&
		value !== null &&
		Array.isArray((value as any).pos) &&
		(value as any).pos.every((n: unknown) => typeof n === "number") &&
		typeof (value as any).angle === "number"
	);
}

function isPaddle(value: unknown): value is Paddle {
	return (
		typeof value === "object" &&
		value !== null &&
		"posY" in value && typeof value.posY === "number" && 
		"height" in value && typeof value.height === "number" && 
		"width" in value && typeof value.width === "number" && 
		"offset" in value && typeof value.offset === "number"
	);
}


function isPlayer(value: unknown): value is Player {
	return (
		typeof value === "object" &&
		value !== null &&
		"ID" in value && typeof value.ID === "string" && 
		"paddle" in value && isPaddle(value.paddle)
	);
}

/* - - - - - - - BOT ERROR - - - - - */
// returns a number in [-max, max]
function error(max:number): number
{
	let ret = Math.random() * max;
	if (Math.floor(Math.random() * 10) % 2 == 0) ret = -ret;

	// #debug
	// console.log('imprecision', ret);

	return ret;
}