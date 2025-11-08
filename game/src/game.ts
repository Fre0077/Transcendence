
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

// game.ts

const	playerStep: number = 0.01;
// const ballSpeed: number = 1;

export class Game {
	// private started: boolean;
	private ball: number[];
	// private ballSpeed: number;
	private ballVel: number[];
	private player1: number;
	private player2: number;
	private player1Up: boolean;
	private player1Down: boolean;
	private player2Up: boolean;
	private player2Down: boolean;
	private gameLoopInterval?: NodeJS.Timeout;

	constructor() {
		// this.started = false;
		this.ball = [0.5, 0.5];
		// this.ballSpeed = 0.02;
		this.ballVel = [0.01, 0.01]; //#todo randomize?
		this.player1 = 0.5;
		this.player2 = 0.5;
		this.player1Up = false;
		this.player1Down = false;
		this.player2Up = false;
		this.player2Down = false;
	}

	private bounce(axis:string, angle:number) {
		if (axis === 'x')
		{
			this.ballVel[0] = this.ballVel[0] * Math.sin(angle) * -1;
			// this.ballVel[1] = this.ballVel[1] * Math.sin(angle);
		}
		else if (axis === 'y')
		{
			// this.ballVel[0] = this.ballVel[0] * Math.sin(angle);
			this.ballVel[1] = this.ballVel[1] * Math.sin(angle) * -1;
		}
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

			// Move ball
			this.ball[0] = this.ball[0] + this.ballVel[0];
			this.ball[1] = this.ball[1] + this.ballVel[1];

			// bounce ball
			if (this.ball[1] < 0) {this.ball[1] == 0; this.bounce('y', 90);}
			if (this.ball[1] > 1) {this.ball[1] == 1; this.bounce('y', 90);}

			if (this.ball[0] < 0) {this.ball[0] == 0; this.bounce('x', 90);}
			if (this.ball[0] > 1) {this.ball[0] == 1; this.bounce('x', 90);}

			console.log(this.ball);

		}, tickInterval);
	}

	public stop() {
		if (this.gameLoopInterval) clearInterval(this.gameLoopInterval);
	}
}



// class Person {
// 	private readonly name: string;
  
// 	public constructor(name: string) {
// 	  // name cannot be changed after this initial definition, which has to be either at its declaration or in the constructor.
// 	  this.name = name;
// 	}
  
// 	public getName(): string {
// 	  return this.name;
// 	}
//   }
  
//   const person = new Person("Jane");
//   console.log(person.getName());