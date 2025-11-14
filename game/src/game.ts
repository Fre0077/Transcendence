
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

const	paddleHeight: number = 0.3;		// long side
const	paddleWidth: number = 0.02		// short side
const	paddleOffset: number = 0.05;	// distance from the border

const	paddleHeight_2: number = paddleHeight / 2;

/* #todo
	change angle bases on player movement

	bugfix: ball enters the paddle from above (DONE)
	player collision (DONE)
	different bounce based on which part of the paddle was hit (DONE)
	Point counter? (DONE)
	Randomize the start (DONE)
	Start when pressing space (DONE)
*/

export class Game {
	private setStart: boolean;		/* should the ball move? */
	private score:number[];			/* player's score */
	private lastScored:number;		/* the last player that scored (either 1 or 2) */
	private winScore:number;		/* score a player must reach to win */
	private winner:number;			/* who won the match? match ongoing: 0, player1: 1, player2: 2 */

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

	/* ======================== CONSTRUCTORS ======================== */
	// keep this the same as the default constructor
	private init() {
		this.winner = 0;				// noone won just yet
		this.winScore = 3;				// Bo5
		this.setStart = false;			// ball not moving
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

	// the constructor expliccitly wants the variables initialized
	constructor() {
		this.winner = 0;				// noone won just yet
		this.winScore = 3;				// Bo5
		this.setStart = false;			// ball not moving
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
			ball: this.ball,		/* array of 2 coordinates [X, Y] of the CENTER of the ball */
			player1: this.player1,	/* single Y coordinate of the CENTER of the paddle*/
			player2: this.player2,	/* single Y coordinate of the CENTER of the paddle*/
			paddle: [				/* paddle size for both players: [player1, player2] */
				{
					height: paddleHeight,
					width: paddleWidth,
					offset: paddleOffset	/* single X coordinate of the CENTER of the paddle */
				},
				{
					height: paddleHeight,
					width: paddleWidth,
					offset: paddleOffset	/* single X coordinate of the CENTER of the paddle (could need a readjustment for player2*/
				}
			]
		};
		return JSON.stringify(state);
	}

	// If you just want the paddle stats
	public getPaddleSettingsJSON(): string {
		const paddle = [				/* paddle size for both players: [player1, player2] */
			{
				height: paddleHeight,
				width: paddleWidth,
				offset: paddleOffset
			},
			{
				height: paddleHeight,
				width: paddleWidth,
				offset: paddleOffset
			}
		];
		return JSON.stringify(paddle);
	}

	// returns 0 (or false) if the game is ongoing, 1 if player1 won, 2 if player2 won
	public end(): number {
		return this.winner;
	}
	/* ----------------------------------------------------------------- */

	/* ======================== PUBLIC INPUT METHODS ======================== */

	/* sets the score a player must reach to win the game */
	public setFormat(format:number) {
		this.winScore = format;
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

	// concord == -1, 0, 1
	// speed needs to be adjusted but it kinda workds
	// speeds is from 0 to 1. 1 max intensity, 0 no intensity
	// private dynamicBounce(axis:string, speed:number, concord:number) {
	// 	if (axis === 'x') this.ballAngle = Math.PI - this.ballAngle + concord * (this.ballAngle * speed / 4);
	// 	else if (axis === 'y') this.ballAngle = this.ballAngle * -1;

	// 	// clamp angle
	// 	if (this.ballAngle < 0) this.ballAngle = 2 * Math.PI + this.ballAngle;
	// 	else if (this.ballAngle > 2 * Math.PI) this.ballAngle = this.ballAngle - 2 * Math.PI;
	// }

	// bring the gamestate back to the start not affecting the score
	private ballInTheMiddle() {
		// this.winner = 0;				// not resetting the winner
		// this.winScore = 3;			// not resetting the format
		this.setStart = false;
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

		if (this.score[0] === this.winScore)
		{
			// this.matchOver = true;
			this.winner = 1;
			this.stop();
		}
		else if (this.score[1] === this.winScore)
		{
			this.winner = 2;
			this.stop();
		}
	}

	/* ======================== PUBLIC GAMEPLAY METHODS ======================== */

	// reset the game to the beginning
	public reset() {
		this.init();
		this.start();
	}

	// starts the ball
	public launch() {
		// don't double launch
		if (this.setStart === true) return;
	
		// tell the game loop that the ball needs to move
		this.setStart = true;

		// randomize ball direction
		this.ballAngle = Math.PI / (randIntT(10) + 4);
		if (randIntT(2) === 0) {this.ballAngle *= -1;}

		// which player the ball goes to?
		if (this.lastScored === 2) {this.ballAngle += Math.PI;}
		if (this.lastScored === 1) {/* do nothing */;}

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
			this.player1 = Math.max(0 + paddleHeight_2, Math.min(1 - paddleHeight_2, this.player1));
			this.player2 = Math.max(0 + paddleHeight_2, Math.min(1 - paddleHeight_2, this.player2));

			if (this.setStart === true) {
				
				/* --- PAD COLLISION --- */
				const newPos:number[] = [
					this.ball[0] + this.ballSpeed * Math.cos(this.ballAngle),
					this.ball[1] + this.ballSpeed * Math.sin(this.ballAngle)
				];

				// point of collision with the ball
				const collision:number = paddleOffset + paddleWidth;

				// player1
				if (this.ball[0] > collision
					&& newPos[0] < collision)
				{
					if (newPos[1] > this.player1 - paddleHeight_2
						&& newPos[1] < this.player1 + paddleHeight_2)
					{
						this.bounce('x');
						this.ballSpeed += 0.001;
					}
				}
				// player2
				else if (this.ball[0] < 1 - (collision)
					&& newPos[0] > 1 - (collision))
				{
					if (newPos[1] > this.player2 - paddleHeight_2
						&& newPos[1] < this.player2 + paddleHeight_2)
					{
						this.bounce('x');
						this.ballSpeed += 0.001;
					}
				}

				// Move ball
				this.ball = newPos;

				// bounce ball on top/bottom of screen
				if (this.ball[1] < 0 || this.ball[1] > 1) this.bounce('y');

				/* --- END of MATCH --- */
				// if the ball reached th border
				if (this.ball[0] <= -0.1)
				{
					// player2 scored a point
					this.score[1] += 1;
					this.lastScored = 2;
					this.ballInTheMiddle();
				}
				else if (this.ball[0] >= 1.1)
				{
					// player1 scored a point
					this.score[0] += 1;
					this.lastScored = 1;
					this.ballInTheMiddle();
				}
				
				// console.log(this.ball);
			}

		}, tickInterval);
	}

	public stop() {
		if (this.gameLoopInterval) clearInterval(this.gameLoopInterval);
	}
}
