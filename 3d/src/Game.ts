/* -------------------------------------------------- */
/* ------------------- Game Class ------------------- */
/* -------------------------------------------------- */

interface keys {
	Up:boolean;
	Down:boolean;
	Left:boolean;
	Right:boolean;
}

interface Player {
	ID:string;
	pos:[number, number, number];
	hp:number;
	keys:keys;
}

interface GameState {
	score: number[];
	players: Map<number, Player>;
	playing:boolean;
	timeout: number;
}


const	playerSpeed: number = 1;		// how mucch the player moves each game tick

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
	private timeout:number;			/* number of ms the game should halt between rouds */
	private tick:number;			/* number of in-game tick passed till the beginning of the match */
	// private log:string;				// list of movements #todo
	private _playing:boolean;

	// match variables
	private score:number[];			/* player's score */
	private winner:number;			/* who won the match? match ongoing: 0, player1: 1, player2: 2 */

	// players variables
	private players:Map<number, Player>;

	private gameLoopInterval?: NodeJS.Timeout;	/* :D */

	/* ======================== CONSTRUCTORS ======================== */
	// the constructor expliccitly wants the variables initialized
	constructor() {
		this.timeout = 60;				// 1 sec of timeout
		this.tick = 0;					// start -> 0
		this._playing = false;

		this.score = [0, 0];			// match score to 0;
		this.winner = 0;				// noone won just yet
		
		this.players = new Map();
	}




	/* ----------------------------------------------------------------- */
	/*		PUBLIC FUNCTIONS	PUBLIC FUNCTIONS	PUBLIC FUNCTIONS	 */
	/*		PUBLIC FUNCTIONS	PUBLIC FUNCTIONS	PUBLIC FUNCTIONS	 */
	/*		PUBLIC FUNCTIONS	PUBLIC FUNCTIONS	PUBLIC FUNCTIONS	 */
	/* ----------------------------------------------------------------- */


	

	/* ----------------------------------------------------------------- */
	/* 								GET DATA							 */
	/* ----------------------------------------------------------------- */

	// is the ball moving?
	public get playing(): boolean {
		return this._playing;
	}

	// state non JSON
	// @aleborghi qui' viene formattato il gamestate per il frontend.
	public get state(): GameState
	{
		return {
			score: this.score,				/* score of the match [player1, player2] */
			players: this.players,			/* single Y coordinate of the CENTER of the paddle */
			playing: this._playing,
			timeout: this.timeout
		};
	}

	public get stateJSON(): string {
		return JSON.stringify(this.state);
	}

	// returns 0 (or false) if the game is ongoing, 1 if player1 won, 2 if player2 won
	public end(): number {
		return this.winner;
	}

	/* ----------------------------------------------------------------- */
	/* 								SET DATA							 */
	/* ----------------------------------------------------------------- */


	// Input handling
	public press(idx: number, direction: string)
	{
		let player = this.players.get(idx);
		if (player === undefined) return ;

		if (direction === 'Up') player.keys.Up = true;
		else if (direction === 'Down') player.keys.Down = true;
		else if (direction === 'Left') player.keys.Left = true;
		else if (direction === 'Right') player.keys.Right = true;
	}

	public release(idx: number, direction: string)
	{
		let player = this.players.get(idx);
		if (player === undefined) return ;

		if (direction === 'Up') player.keys.Up = false;
		else if (direction === 'Down') player.keys.Down = false;
		else if (direction === 'Left') player.keys.Left = false;
		else if (direction === 'Right') player.keys.Right = false;
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






	/* ========================================================================= */
	/* ======================== PUBLIC GAMEPLAY METHODS ======================== */
	/* ========================================================================= */


	// starts the ball
	public launch() {
		// don't double launch
		if (this._playing === true || this.timeout !== 0) return;
	
		// tell the game loop that the ball needs to move
		this._playing = true;

		console.log(`launching round with angle (SAIK)`);
	}


	//-----------------------
	// Non-blocking GAME LOOP
	public start(tickRate = 60) {
		const tickInterval = 1000 / tickRate;

		// Prevent multiple loops 
		if (this.gameLoopInterval) clearInterval(this.gameLoopInterval);

		this.gameLoopInterval = setInterval(() => {
			// advance the tick
			++this.tick;

			if (this.timeout > 0) {this.timeout--; return;}

			// Move players (assuming (0,0) is top-left)
			this.players.forEach((player) => {
				if (player.keys.Up === true) player.pos[1] += Math.sin(playerSpeed);
				if (player.keys.Down === true) player.pos[1] -= Math.sin(playerSpeed);
				if (player.keys.Left === true) player.pos[0] -= Math.sin(playerSpeed);
				if (player.keys.Right === true) player.pos[1] += Math.sin(playerSpeed);
			});

			// Clamp players positions #todo
			// this.player1 = Math.max(0 + paddleHeight_2, Math.min(1 - paddleHeight_2, this.player1));
			// this.player2 = Math.max(0 + paddleHeight_2, Math.min(1 - paddleHeight_2, this.player2));

			if (this._playing === true) {
				
				/* --- BALL MOVEMENT --- */

				/* --- END of MATCH --- */
				
				// console.log(this.ball);
			}

		}, tickInterval);
	}

	public stop() {
		if (this.gameLoopInterval) clearInterval(this.gameLoopInterval);
	}
}
