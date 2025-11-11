
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

import { randIntT } from './random.js'

const	playerStep: number = 0.01;		// how mucch the player moves each game tick

const	paddleHeigth: number = 0.1;	// long side
const	paddleWidth: number = 0.01		// short side
const	paddleOffset: number = 0.05;	// distance from the border

/* #todo
	bugfix: ball enters the paddle from above

	player collision (DONE)
	different bounce based on which part of the paddle was hit (DONE)
	Point counter? (DONE)
	Randomize the start (DONE)
	Start when pressing space (DONE)
*/

export class Game {
	private matchStart: boolean;	/* should the ball move? */
	private score:number[];			/* player's score */
	private lastScored:number;		/* the last player that scored (either 1 or 2) */

	// ball variables
	private ball: number[];			/* coordinates (x,y) of the ball */
	private ballSpeed: number;		/* module of the peed */
	private ballAngle: number;		/* angle on which the ball is moving (clamped 0 -> 2PI) */

	// players variables
	private player1: number;		/* Y-Coordinate of player1 (0 -> 1) */
	private player2: number;		/* Y-Coordinate of player2 (0 -> 1) */
	private player1Up: boolean;		/* is player1 pressing the UP key? */
	private player1Down: boolean;	/* is player1 pressing the DOWN key? */
	private player2Up: boolean;		/* is player2 pressing the UP key? */
	private player2Down: boolean;	/* is player2 pressing the DOWN key? */

	private gameLoopInterval?: NodeJS.Timeout;	/* :D */

	constructor() {
		this.matchStart = false;		// ball not moving
		this.lastScored = 0;			// default
		this.score = [0, 0];			// match score to 0;
		this.ball = [0.5, 0.5];			// ball in the middle
		this.ballSpeed = 0.01;			// arbitrary speed
		this.ballAngle = 0; 			// arbitrary angle
		this.player1 = 0.5;				// player1 in the middle
		this.player2 = 0.5;				// player2 in the middle
		this.player1Up = false;			// Noone is moving...
		this.player1Down = false;
		this.player2Up = false;
		this.player2Down = false;
	}

	/* ----------------------------------------------------------------- */
	// @aleborghi qui' viene formattato il gamestate per il frontend.
	public getGameStateJSON(): string {
		const state = {
			score: this.score,		/* score of the match [player1, player2] */
			ball: this.ball,		/* array of 2 coordinates [X, Y] */
			player1: this.player1,	/* single Y coordinate */
			player2: this.player2,	/* single Y coordinate */
			paddle: [				/* paddle size for both players: [player1, player2] */
				{
					heigth: paddleHeigth,
					width: paddleWidth,
					offset: paddleOffset
				},
				{
					heigth: paddleHeigth,
					width: paddleWidth,
					offset: paddleOffset
				}
			]
		};
		return JSON.stringify(state);
	}

	// If you just want the paddle stats
	public getPaddleSettingsJSON(): string {
		const paddle = [				/* paddle size for both players: [player1, player2] */
			{
				heigth: paddleHeigth,
				width: paddleWidth,
				offset: paddleOffset
			},
			{
				heigth: paddleHeigth,
				width: paddleWidth,
				offset: paddleOffset
			}
		];
		return JSON.stringify(paddle);
	}
	/* ----------------------------------------------------------------- */


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
	

	//----------------
	/* GAME MECHANICS */
	
	/* the ball hit an object!, change the angle of the ball based
	 on the direction which the surface is facing when hitting the ball. */
	private bounce(axis:string) {
		if (axis === 'x') this.ballAngle = Math.PI - this.ballAngle;
		else if (axis === 'y') this.ballAngle = this.ballAngle * -1;

		// clamp angle
		if (this.ballAngle < 0) this.ballAngle = 2 * Math.PI + this.ballAngle;
		else if (this.ballAngle > 2 * Math.PI) this.ballAngle = this.ballAngle - 2 * Math.PI;
	}

	// bring the gamestate back to the start not affecting the score
	private reset() {
		this.matchStart = false;
		// this.score = [0, 0];			// not resetting the score
		// this.lastScored = 0;			// not resetting lastScored
		this.ball = [0.5, 0.5];
		this.ballSpeed = 0.01;
		this.ballAngle = 0;
		this.player1 = 0.5;
		this.player2 = 0.5;
		this.player1Up = false;
		this.player1Down = false;
		this.player2Up = false;
		this.player2Down = false;
	}

	// starts the ball
	public launch() {
		this.matchStart = true;

		// randomize ball direction
		this.ballAngle = Math.PI / (randIntT(10) + 4);
		if (randIntT(2) === 0) {this.ballAngle *= -1;}

		// which player the ball goes to?
		if (this.lastScored === 1) {this.ballAngle += Math.PI;}
		if (this.lastScored === 2) {/* do nothing */;}

		console.log(`launching ball with angle ${this.ballAngle}`);
	}



	//-----------------------
	// Non-blocking GAME LOOP
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

			// Clamp players positions
			this.player1 = Math.max(0 + paddleHeigth, Math.min(1 - paddleHeigth, this.player1));
			this.player2 = Math.max(0 + paddleHeigth, Math.min(1 - paddleHeigth, this.player2));

			if (this.matchStart === true) {
				// Move ball
				this.ball[0] = this.ball[0] + this.ballSpeed * Math.cos(this.ballAngle);
				this.ball[1] = this.ball[1] + this.ballSpeed * Math.sin(this.ballAngle);

				// bounce ball
				if (this.ball[1] < 0 || this.ball[1] > 1) this.bounce('y');


				// check for pad collision

				// Player1
				if (this.ball[0] < 0 + paddleOffset + paddleWidth
					&& this.ball[0] > 0 + paddleOffset - paddleWidth)
				{
					if (this.ball[1] > this.player1 - paddleHeigth
						&& this.ball[1] < this.player1 + paddleHeigth)
					{
						this.bounce('x');
					}
				}	// Player2
				else if (this.ball[0] < 1 - paddleOffset + paddleWidth
					&& this.ball[0] > 1 - paddleOffset - paddleWidth)
				{
					if (this.ball[1] > this.player2 - paddleHeigth
						&& this.ball[1] < this.player2 + paddleHeigth)
					{
						this.bounce('x');
					}
				}

				// if the ball reached th border
				if (this.ball[0] <= -0.1)
				{
					// player2 scored a point
					this.score[1] += 1;
					this.lastScored = 2;
					this.reset();
				}
				if (this.ball[0] >= 1.1)
				{
					// player1 scored a point
					this.score[0] += 1;
					this.lastScored = 1;
					this.reset();
				}
				

				// console.log(this.ball);
			}

		}, tickInterval);
	}

	public stop() {
		if (this.gameLoopInterval) clearInterval(this.gameLoopInterval);
	}
}
