/* README
	Basic functioning:
	0. set data (format, directions, ...)

	--- PUBLIC GAMEPLAY METHODS --- (bottom of the file)
	1. start(): to enable player input and ball movement
	2. launch(): to start the round (the ball moves)
	(optional) reset(): restart as if no round was played
	3. stop(): stop processing player inputs and ball movement

*/



/* ------------------- Player Class ------------------- */

class Player
{
	public pos:[number, number];
	
	// paddle stats
	private _height;
	private _width;

	// keys
	public Up:boolean;		/* key held by the player */
	public Down:boolean;
	public Left:boolean;
	public Right:boolean;

	constructor ()
	{
		this.pos = [100, 100];
		this._height = 10;
		this._width = 10;
		this.Up = false;
		this.Down = false;
		this.Left = false;
		this.Right = false;
	}

	/* same as constructor */
	public reset() {
		// this.status = "disconnected"; // leave the status as it is
		this.pos = [100, 100];
		this._height = 10;
		this._width = 10;
		this.Up = false;
		this.Down = false;
		this.Left = false;
		this.Right = false;
	}

	public get height() {
		return this._height;
	}

	public get width() {
		return this._width;
	}
}

/* -------------------------------------------------- */
/* ------------------- Game Class ------------------- */
/* -------------------------------------------------- */

interface PlayerState {
	pos:[number, number];
	height:number;
	width:number;
}

interface GameState {
	score: number[];
	players:PlayerState[];
	playing:boolean;
	timeout: number;
	finished: boolean;
	winner: number;
}


const	playerStep: number = 10;		// how much the player moves each game tick

/* Top-down multiplayer tower defense game */

export class Game
{
	private timeout:number;			/* number of ms the game should halt between rouds */
	private tick:number;			/* number of in-game tick passed till the beginning of the match */
	// private log:string;				// list of movements #todo

	// match variables
	private score:number[];			/* player's score */
	private _playing:boolean;
	private finished:boolean;		/* who won the match? match ongoing: 0, player1: 1, player2: 2 */
	private winner:number;

	// players variables
	private players:Player[];

	// monsters
	private monsters:Monsters[];

	private gameLoopInterval?: NodeJS.Timeout;	/* :D */

	/* ======================== CONSTRUCTORS ======================== */
	// the constructor expliccitly wants the variables initialized
	constructor() {
		this.timeout = 60;				// 1 sec of timeout
		this.tick = 0;					// start -> 0
	
		this.score = [0, 0];			// match score to 0;
		this._playing = false;
		this.finished = false;				// noone won just yet
		this.winner = -1;
		
		// just 2 players for now
		this.players = [new Player(), new Player()];
	}




	/* ----------------------------------------------------------------- */
	/*		PUBLIC FUNCTIONS	PUBLIC FUNCTIONS	PUBLIC FUNCTIONS	 */
	/*		PUBLIC FUNCTIONS	PUBLIC FUNCTIONS	PUBLIC FUNCTIONS	 */
	/*		PUBLIC FUNCTIONS	PUBLIC FUNCTIONS	PUBLIC FUNCTIONS	 */
	/* ----------------------------------------------------------------- */


	

	/* ----------------------------------------------------------------- */
	/* 								GET DATA							 */
	/* ----------------------------------------------------------------- */

	// is the game halted?
	public get playing(): boolean {
		return this._playing
	}

	// state non JSON
	// @aleborghi qui' viene formattato il gamestate per il frontend.
	public get state(): GameState
	{
		const players = Array.from(this.players, (player) => ({
			pos: player.pos,
			height: player.height,
			width: player.width
		}));
		return {
			score: this.score,				/* score of the match [player1, player2] */
			players: players,
			playing: !this.finished,
			timeout: this.timeout,
			finished: this.finished,
			winner: this.winner
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
	// Input handling
	public press(idx: number, direction: string)
	{
		const player = this.players[idx];
		if (player === undefined) return ;

		if (direction === 'Up') player.Up = true;
		else if (direction === 'Down') player.Down = true;
		else if (direction === 'Left') player.Left = true;
		else if (direction === 'Right') player.Right = true;
	}

	public release(idx: number, direction: string)
	{
		const player = this.players[idx];
		if (player === undefined) return ;

		if (direction === 'Up') player.Up = false;
		else if (direction === 'Down') player.Down = false;
		else if (direction === 'Left') player.Left = false;
		else if (direction === 'Right') player.Right = false;
	}



	/* ------------------------------------------------------------ */
	/* 		-----	-----	||	\		/	 ^	---------	-----	*/
	/* 		|	 |  |    |  ||   \     /   /   \    |       |       */
	/*      |----   |----   ||    \   /   /_____\   |       -----   */
	/*      |       |    \  ||     \ /   /       \  |       |       */
	/*      |       |     \ ||      v   /         \ |       -----   */
	/* ------------------------------------------------------------ */




	/* ========================================================================= */
	/* ======================== PUBLIC GAMEPLAY METHODS ======================== */
	/* ========================================================================= */





	// reset the game to the beginning
	public reset() {

		/* ! ! ! KEEP THIS THE SAME AS THE CONSTRUCTOR ! ! ! */
		this.timeout = 60;				// 1 sec of timeout
		this.tick = 0;					// start -> 0
	
		this.score = [0, 0];			// match score to 0;
		
		this.players.forEach((player) => {
			player.reset();
		});
		
		// start the game again
		this.start();
	}

	// starts the ball
	public launch() {
		// don't double launch
		if (this._playing === true || this.timeout !== 0) return;

		// tell the game loop that the ball needs to move
		this._playing = true;

		console.log('Launching round ...');
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

			// Move players
			this.players.forEach((player) => {
				if (player.Up === true) player.pos[1] -= playerStep;
				if (player.Down === true) player.pos[1] += playerStep;
				if (player.Left === true) player.pos[0] -= playerStep;
				if (player.Right === true) player.pos[0] += playerStep;
	
				// Clamp players positions
				player.pos[0] = Math.max(0, Math.min(1000, player.pos[0]));
				player.pos[1] = Math.max(0, Math.min(1000, player.pos[1]));
			});


			if (this.playing === true) {
				
				/* --- BALL MOVEMENT --- */
				// this.moveBall();

				/* --- END of MATCH --- */
				// if the ball reached the border
				
				// console.log(this.ball);
			}

		}, tickInterval);
	}

	public stop() {
		if (this.gameLoopInterval) clearInterval(this.gameLoopInterval);
	}
}