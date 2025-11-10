
// const GameInterface = {
// 	ball: [0, 0],
// 	player1: 0,
// 	player2: 0,
// 	player1Up: false,
// 	player1Down: false,
// 	player2Up: false,
// 	player2Down: false,
// 	// launchGame: function() { },
// 	// getGameStateJSON: function () { },
// }

// const playerStep: number = 0.1;

// export class Game {
// 	private ball: number[];
// 	private player1: number;
// 	private player2: number;
// 	private player1Up: boolean;
// 	private player1Down: boolean;
// 	private player2Up: boolean;
// 	private player2Down: boolean;

// 	public constructor() {
// 		this.ball = [0.5, 0.5];
// 		this.player1 = 0.5;
// 		this.player2 = 0.5;
// 		this.player1Up = false;
// 		this.player1Down = false;
// 		this.player2Up = false;
// 		this.player2Down = false;
// 	}

// 	// Input handling
// 	public press(player:number, direction:string) {
// 		if (player === 1) {
// 			if (direction === 'Up') {this.player1Up = true;}
// 			if (direction === 'Down') {this.player1Down = true;}
// 		}
// 		else if (player === 2) {
// 			if (direction === 'Up') {this.player2Up = true;}
// 			if (direction === 'Down') {this.player2Down = true;}
// 		}
// 	}

// 	public release(player:number, direction:string) {
// 		if (player === 1) {
// 			if (direction === 'Up') {this.player1Up = false;}
// 			if (direction === 'Down') {this.player1Down = false;}
// 		}
// 		else if (player === 2) {
// 			if (direction === 'Up') {this.player2Up = false;}
// 			if (direction === 'Down') {this.player2Down = false;}
// 		}
// 	}

// 	// Gamestat to pass to froontend
// 	public getGameStateJSON(): string {
// 		const state = {ball: this.ball, player1: this.player1, player2: this.player2};
// 		return JSON.stringify(state);
// 	}
	
// 	// game processing
// 	public async launchGame() {
// 		while (true)
// 		{
// 			// move the players
// 			if (this.player1Up === true) {this.player1 -= playerStep;}
// 			if (this.player1Down === true) {this.player1 += playerStep;}
// 			if (this.player2Up === true) {this.player2 -= playerStep;}
// 			if (this.player2Down === true) {this.player2 += playerStep;}
// 			// confine to the border
// 			if (this.player1 < 0) {this.player1 = 0;}
// 			if (this.player1 > 1) {this.player1 = 1;}
// 			if (this.player2 < 0) {this.player2 = 0;}
// 			if (this.player2 > 1) {this.player2 = 1;}
// 		}
// 	}
// }

const	playerStep: number = 0.01;			// how mucch the player moves each game tick
// const	playerOffset: number = 20 / 600;	// distance from the border
// const ballSpeed: number = 1;

/* #todo player collision, different bounce based on
which part of the paddle was hit.
Point counter?
Randomize the start
Start when pressing space */

export class Game {
	private moveBall: boolean;		/* should the ball move? */

	private ball: number[];			/* coordinates (x,y) of the ball */
	private ballSpeed: number;		/* module of the peed */
	private ballAngle: number;		/* angle on which the ball is moving (clamped 0 -> 2PI) */
	private player1: number;		/* Y-Coordinate of player1 (0 -> 1) */
	private player2: number;		/* Y-Coordinate of player2 (0 -> 1) */
	private player1Up: boolean;		/* is player1 pressing the UP key? */
	private player1Down: boolean;	/* is player1 pressing the DOWN key? */
	private player2Up: boolean;		/* is player2 pressing the UP key? */
	private player2Down: boolean;	/* is player2 pressing the DOWN key? */
	private gameLoopInterval?: NodeJS.Timeout;	/* :D */

	constructor() {
		this.moveBall = false;		// ball not moving
		this.ball = [0.5, 0.5];		// ball in the middle
		this.ballSpeed = 0.01;		// arbitrary speed
		this.ballAngle = Math.PI / 3; //#todo randomize?
		this.player1 = 0.5;			// player1 in the middle
		this.player2 = 0.5;			// player2 in the middle
		this.player1Up = false;		// Noone is moving...
		this.player1Down = false;
		this.player2Up = false;
		this.player2Down = false;
	}

	private bounce(axis:string) {
		if (axis === 'x') this.ballAngle = Math.PI - this.ballAngle;
		else if (axis === 'y') this.ballAngle = this.ballAngle * -1;

		// clamp angle
		if (this.ballAngle < 0) this.ballAngle = 2 * Math.PI + this.ballAngle;
		else if (this.ballAngle > 2 * Math.PI) this.ballAngle = this.ballAngle - 2 * Math.PI;
	}

	// Input handling
	public press(player: number, direction: string) {
		if (player === 1) {
			if (direction === 'Up') this.player1Up = true;
			if (direction === 'Down') this.player1Down = true;
		} else if (player === 2) {
			if (direction === 'Up') this.player2Up = true;
			if (direction === 'Down') this.player2Down = true;
		}
	}

	public release(player: number, direction: string) {
		if (player === 1) {
			if (direction === 'Up') this.player1Up = false;
			if (direction === 'Down') this.player1Down = false;
		} else if (player === 2) {
			if (direction === 'Up') this.player2Up = false;
			if (direction === 'Down') this.player2Down = false;
		}
	}

	// start the ball
	public launch() {
		this.moveBall = true;
		// eventually randomply initialize the ball angle
	}

	public getGameStateJSON(): string {
		const state = { ball: this.ball, player1: this.player1, player2: this.player2 };
		return JSON.stringify(state);
	}

	// ✅ Non-blocking game loop
	public start(tickRate = 60) {
		const tickInterval = 1000 / tickRate;

		// Prevent multiple loops
		if (this.gameLoopInterval) clearInterval(this.gameLoopInterval);

		this.gameLoopInterval = setInterval(() => {
			// Move players
			if (this.player1Up) this.player1 -= playerStep;
			if (this.player1Down) this.player1 += playerStep;
			if (this.player2Up) this.player2 -= playerStep;
			if (this.player2Down) this.player2 += playerStep;

			// Clamp positions
			this.player1 = Math.max(0, Math.min(1, this.player1));
			this.player2 = Math.max(0, Math.min(1, this.player2));

			if (this.moveBall === true) {
				// Move ball
				this.ball[0] = this.ball[0] + this.ballSpeed * Math.cos(this.ballAngle);
				this.ball[1] = this.ball[1] + this.ballSpeed * Math.sin(this.ballAngle);

				// bounce ball
				if (this.ball[1] < 0 || this.ball[1] > 1) this.bounce('y');
				if (this.ball[0] < 0 || this.ball[0] > 1) this.bounce('x');

				// console.log(this.ball);
			}

		}, tickInterval);
	}

	public stop() {
		if (this.gameLoopInterval) clearInterval(this.gameLoopInterval);
	}
}
