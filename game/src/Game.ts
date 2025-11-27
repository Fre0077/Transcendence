/* README
	Basic functioning:
	0. set data (format, directions, ...)

	--- PUBLIC GAMEPLAY METHODS --- (bottom of the file)
	1. start(): to enable player input and ball movement
	2. launch(): to start the round (the ball moves)
	(optional) reset(): restart as if no round was played
	3. stop(): stop processing player inputs and ball movement

*/


//----------------
/* GAME MECHANICS */

/* the ball hit an object!, change the angle of the ball based
	 on the direction which the surface is facing when hitting the ball. */
// function bounce_90_deg(axis:string, angle:number) : number {
// 	if (axis === 'x') 
// 	else if (axis === 'y') angle = angle * -1;

// 	// clamp angle
// 	if (angle < 0) angle = 2 * Math.PI + angle;
// 	else if (angle > 2 * Math.PI) angle = angle - 2 * Math.PI;

// 	return angle;
// }

import { randIntM } from './random.js'

// array of number angles between +PI / 4 and -PI / 4
function randomAngle(N:number = 1) : number[]
{
	let arr:number[] = [];

	for (let i = 0; i < N; ++i) {
		let angle:number = Math.PI / (randIntM(10) + 4);	// rangle between Pi / 4 and Pi / 14
		if (randIntM(2) === 0) {angle *= -1;}
		arr.push(angle);
	}
	return arr;
}


/* ------------------- Ball Class ------------------- */
/* all data relative to the ball */

class Ball
{
	public pos:number[];			/* coordinates (x,y) of the ball */
	public angle:number;			/* angle on which the ball is moving (clamped 0 -> 2PI) */
	public speed:number;			/* module of the peed */

	constructor () {
		this.angle = 0;
		this.pos = [0.5, 0.5];
		this.speed = 0.01;
	}

	// resets the parameters to the default ones
	public reset() {
		this.angle = 0;
		this.pos = [0.5, 0.5];
		this.speed = 0.01;
	}

	// this function bounces ann object that changes the X
	// component of the ball's direction
	// @offsetDeg is the angle we want to add to a perfect reflection
	public bounceX(offsetDeg:number = 0) {

		// convert offset to radians
		const delta = offsetDeg * (Math.PI / 180);

		// perfect reflection off vertical wall
		const perfectReflection = Math.PI - this.angle;
	
		// apply your custom offset
		this.angle = perfectReflection + delta;
		this.clampAngle();
	}

	public bounceY(offsetDeg:number = 0) {

		// convert offset to radians
		const delta = offsetDeg * (Math.PI / 180);

		// perfect reflection off vertical wall
		const perfectReflection = -this.angle;

		// apply your custom offset
		this.angle = perfectReflection + delta;
		this.clampAngle();
	}

	// clamp angle between 0 -> 2PI
	private clampAngle() {
		if (this.angle < 0) this.angle = 2 * Math.PI + this.angle;
		else if (this.angle > 2 * Math.PI) this.angle = this.angle - 2 * Math.PI;
	}
}


/* -------------------------------------------------- */
/* ------------------- Game Class ------------------- */
/* -------------------------------------------------- */


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

export class Game
{
	private timeout:number			/* number of ms the game should halt between rouds */

	// match variables
	private round:number			/* number of round (0 - > target * 2 - 1) */
	private roundStart: boolean;	/* should the ball move? */
	private score:number[];			/* player's score */
	private lastScored:number;		/* the last player that scored (either 1 or 2) */
	private targetScore:number;		/* score a player must reach to win */
	private winner:number;			/* who won the match? match ongoing: 0, player1: 1, player2: 2 */

	// ball variables
	private ball:Ball;
	private directions:number[];	/* array of launch directions (length = targetScore * 2 - 1) */

	// players variables
	private player1: number;		/* Y-Coordinate of player1 (0 -> 1) */
	private player2: number;		/* Y-Coordinate of player2 (0 -> 1) */
	private player1Up: boolean;		/* is player1 pressing the UP key? */
	private player1Down: boolean;	/* is player1 pressing the DOWN key? */
	private player2Up: boolean;		/* is player2 pressing the UP key? */
	private player2Down: boolean;	/* is player2 pressing the DOWN key? */

	private gameLoopInterval?: NodeJS.Timeout;	/* :D */

	/* ======================== CONSTRUCTORS ======================== */
	// the constructor expliccitly wants the variables initialized
	constructor(format:number = 3) {
		this.timeout = 60;				// 1 sec of timeout
	
		this.round = 0;					// start at round 0
		this.roundStart = false;			// ball not moving
		this.score = [0, 0];			// match score to 0;
		this.lastScored = 0;			// default
		this.targetScore = format;				// Bo5
		this.winner = 0;				// noone won just yet
		
		this.ball = new Ball();
		this.directions = randomAngle((this.targetScore * 2) - 1);

		this.player1 = 0.5;				// player1 in the middle
		this.player2 = 0.5;				// player2 in the middle
		this.player1Up = false;			// Noone is moving...
		this.player1Down = false;
		this.player2Up = false;
		this.player2Down = false;
	}




	/* ----------------------------------------------------------------- */
	/*		PUBLIC FUNCTIONS	PUBLIC FUNCTIONS	PUBLIC FUNCTIONS	 */
	/*		PUBLIC FUNCTIONS	PUBLIC FUNCTIONS	PUBLIC FUNCTIONS	 */
	/*		PUBLIC FUNCTIONS	PUBLIC FUNCTIONS	PUBLIC FUNCTIONS	 */
	/* ----------------------------------------------------------------- */



	/* ----------------------------------------------------------------- */
	/* 								GET DATA							 */
	/* ----------------------------------------------------------------- */

	// @aleborghi qui' viene formattato il gamestate per il frontend.
	public getGameStateJSON(): string {
		const state = {
			score: this.score,		/* score of the match [player1, player2] */
			ball: this.ball.pos,	/* array of 2 coordinates [X, Y] of the CENTER of the ball */
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
	/* 								SET DATA							 */
	/* ----------------------------------------------------------------- */

	/* sets the score a player must reach to win the game */
	public setFormat(format:number) {
		if (format <= 0) {console.log(`Error: Invalid format ${format}`);}	// #todo send to the frontend
		else {this.targetScore = format;}
	}

	/* set the launch directions for the match */
	public setDirections(dirs:number[]) {
		if (dirs.length != (this.targetScore * 2) - 1)
		{
			console.log(`Error: Invalid directions number: ${dirs.length}, expected: ${(this.targetScore * 2) - 1}`);
			return ;		// #todo send to the frontend
		}
		for (let i = 0; i < dirs.length; ++i) {
			if (Math.abs(dirs[i]) > Math.PI / 4
			|| Math.abs(dirs[i]) < 0)
			{
				console.log(`Error: Invalid direction value: ${Math.abs(dirs[i])}, expected: 0 < value < PI / 4`);
				return ;	// #todo send to the frontend
			}
		}
		this.directions = dirs;
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



	/* ------------------------------------------------------------ */
	/* 		-----	-----	||	\		/	 ^	---------	-----	*/
	/* 		|	 |  |    |  ||   \     /   /   \    |       |       */
	/*      |----   |----   ||    \   /   /_____\   |       -----   */
	/*      |       |    \  ||     \ /   /       \  |       |       */
	/*      |       |     \ ||      v   /         \ |       -----   */
	/* ------------------------------------------------------------ */
	

	/* -------------------------------------------------------- */
	/* -------------------------------------------------------- */
	/* 					CORE GAME MECHANIC					    */
	/* -------------------------------------------------------- */
	/* -------------------------------------------------------- */


	private moveBall()
	{
		/* --- BALL MOVEMENT --- */
		const newPos:number[] = [
			this.ball.pos[0] + this.ball.speed * Math.cos(this.ball.angle),
			this.ball.pos[1] + this.ball.speed * Math.sin(this.ball.angle)
		];
		
		/* --- PAD COLLISION --- */
		// point of collision with the ball
		const collision:number = paddleOffset + paddleWidth;

		// player1
		if (this.ball.pos[0] > collision
			&& newPos[0] < collision)
		{
			// approximation since the real collision point is where the
			// oldpos-newpos line intersect the collision line
			if (newPos[1] > this.player1 - paddleHeight_2
				&& newPos[1] < this.player1 + paddleHeight_2)
			{
				// this.ball.angle = bounce_90_deg('x', this.ball.angle);
				this.ball.bounceX();
				this.ball.speed += 0.001;
				this.ball.pos[0] = collision/*  + this.ball.speed */;
			}
			else	// let the ball move
			{
				this.ball.pos[0] = newPos[0];
			}
		}
		// player2
		else if (this.ball.pos[0] < (1 - collision)
			&& newPos[0] > (1 - collision))
		{
			if (newPos[1] > this.player2 - paddleHeight_2
				&& newPos[1] < this.player2 + paddleHeight_2)
			{
				// this.ball.angle = bounce_90_deg('x', this.ball.angle);
				this.ball.bounceX();
				this.ball.speed += 0.001;
				this.ball.pos[0] = 1 - collision/*  - this.ball.speed */;
			}
			else	// let the ball move
			{
				this.ball.pos[0] = newPos[0];
			}
		}
		else {this.ball.pos[0] = newPos[0];}
		// Move ball

		// this.ball.pos[0] = newPos[0];
		this.ball.pos[1] = newPos[1];

		// bounce ball on top/bottom of screen
		if (this.ball.pos[1] < 0 || this.ball.pos[1] > 1) {this.ball.bounceY();}
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
		this.timeout = 180;				// 3 sec of timeout
	
		this.round += 1;				// go to next round
		this.roundStart = false;		// round not started
		this.ball.reset();				// reset ball to default state

		this.player1 = 0.5;				// reset player to default state
		this.player2 = 0.5;
		this.player1Up = false;
		this.player1Down = false;
		this.player2Up = false;
		this.player2Down = false;

		if (this.score[0] === this.targetScore)
		{
			this.winner = 1;
			this.stop();
		}
		else if (this.score[1] === this.targetScore)
		{
			this.winner = 2;
			this.stop();
		}
	}





	/* ========================================================================= */
	/* ======================== PUBLIC GAMEPLAY METHODS ======================== */
	/* ========================================================================= */





	// reset the game to the beginning
	public reset() {

		/* ! ! ! KEEP THIS THE SAME AS THE CONSTRUCTOR ! ! ! */
		this.timeout = 60;				// 1 sec of timeout
	
		this.round = 0;					// start at round 0
		this.roundStart = false;			// ball not moving
		this.score = [0, 0];			// match score to 0;
		this.lastScored = 0;			// default
		this.targetScore = 3;				// Bo5
		this.winner = 0;				// noone won just yet
		
		this.ball = new Ball();
		this.directions = randomAngle((this.targetScore * 2) - 1);

		this.player1 = 0.5;				// player1 in the middle
		this.player2 = 0.5;				// player2 in the middle
		this.player1Up = false;			// Noone is moving...
		this.player1Down = false;
		this.player2Up = false;
		this.player2Down = false;
		
		// start the game again
		this.start();
	}

	// starts the ball
	public launch() {
		// don't double launch
		if (this.roundStart === true) return;
	
		// tell the game loop that the ball needs to move
		this.roundStart = true;

		// randomize ball direction
		this.ball.angle = this.directions[this.round];

		// which player the ball goes to?
		if (this.lastScored === 2) {this.ball.angle += Math.PI;}
		if (this.lastScored === 1) {/* do nothing */;}

		console.log(`launching ball with angle ${this.ball.angle}`);
	}


	//-----------------------
	// Non-blocking GAME LOOP
	public start(tickRate = 60) {

		console.log(`Starting game with format ${this.targetScore}`);

		const tickInterval = 1000 / tickRate;

		// Prevent multiple loops 
		if (this.gameLoopInterval) clearInterval(this.gameLoopInterval);

		this.gameLoopInterval = setInterval(() => {
			if (this.timeout > 0) {this.timeout--; return;}
			// Move players
			if (this.player1Up) this.player1 -= playerStep;
			if (this.player1Down) this.player1 += playerStep;
			if (this.player2Up) this.player2 -= playerStep;
			if (this.player2Down) this.player2 += playerStep;

			// Clamp players positions
			this.player1 = Math.max(0 + paddleHeight_2, Math.min(1 - paddleHeight_2, this.player1));
			this.player2 = Math.max(0 + paddleHeight_2, Math.min(1 - paddleHeight_2, this.player2));

			if (this.roundStart === true) {
				
				/* --- BALL MOVEMENT --- */
				this.moveBall();

				/* --- END of MATCH --- */
				// if the ball reached the border
				if (this.ball.pos[0] <= -0.1)
				{
					// player2 scored a point
					this.score[1] += 1;
					this.lastScored = 2;
					this.ballInTheMiddle();
				}
				else if (this.ball.pos[0] >= 1.1)
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
