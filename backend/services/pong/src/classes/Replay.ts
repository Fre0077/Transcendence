
export interface Move {
	tick:number;
	player:number;
	move:string;
}

export default class Replay
{
	private _players:string[];
	private _directions:number[];
	private _moves:Move[];

	constructor(__players:string[], __directions:number[]) {
		this._players = __players;
		this._directions = __directions;
		this._moves = [];
	}

	public addmove(tick:number, playeridx:number, move:string) {
		this._moves.push({tick:tick, player:playeridx, move:move});
	}

	public get replaystring() {
		return JSON.stringify({
			players:this._players,
			directions:this._directions,
			moves:this._moves
		});
	}
}