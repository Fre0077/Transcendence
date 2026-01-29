
// lame fix
let id = 0;
function uuidv4()
{
	++id;
	return `local_${id}`;
}

/* this is basicall a struct with steroids, having all properties
public and with default initializations. */
type PlayerID = string;

export interface RoomPlayerController {
	canStart(players: Set<PlayerID>): boolean;
	onGameStart(players: Set<PlayerID>): void;
}
export class Room
{
	private _rsize = 2;

	public gameid:string = uuidv4();

	// status flags
	public ingame:boolean = false;
	public tosend:boolean = false;
	public played:boolean = false;
	public advanced:boolean = false;

	public aborted:boolean = false;						// if both the players of the room quitted
	public justwin:boolean = false;						// if a contender for this room quitted

	public score:number[] = [];							// final score of the room
	public winners:string[] = [];

	public players:Set<string> = new Set();				// set of players ids

	constructor(__rsize:number = 2)
	{
		this._rsize = __rsize;
	}

	// checkers
	public has(playerid:string) {
		return this.players.has(playerid);
	}

	public full() {
		return this.players.size === this._rsize;
	}

	// executors
	public async play(
		playersCtrl: RoomPlayerController,
	):
		Promise<{ status: 'success' | 'failure', reason:string }>
	{
		// check if room already played
		if (this.played === true) {
			return {
				status: 'failure',
				reason: "Room already played"
			};
		}

		// is room full?
		if (!this.full()) {
			return {
				status: 'failure',
				reason: "Room not full"
			};
		}

		// check if all the players are connected
		if (!playersCtrl.canStart(this.players)) {
			return {
				status: 'failure',
				reason: "Not all players connected, or ready"
			};
		}

		// YEA BOYY
		this.ingame = true;
		this.tosend = true;

		// set all the players to away
		playersCtrl.onGameStart(this.players);

		return {
			status: 'success',
			reason: "Room launched successfully"
		};
	}

	// writes all the data at the end of a match
	public finalize(winners:string[], score:number[])
	{
		if (this.played === true) {
			console.log('Room:finalize(): Room already played');
			return ;
		}

		// check if not ingame
		if (this.ingame === false && this.justwin === false) {
			console.log('Room:finalize():: Room not in-game');
			return ;
		}

		// set the scores
		this.winners = winners;
		this.score = score;

		// update the statuses
		this.ingame = false;
		this.played = true;
	}

	// quanto qualcuno se ne va...
	public autowin()
	{
		// the idea is that if just one team left, the other will win
		// but if both team leave, the room is aborted
		if (this.justwin === true) this.aborted = true;
		else this.justwin = true;
	}
}
