// just for this usecase


/* PLAYER CLASS
Socket operaitions only inside here */
export class Player
{
	private _status: "connected" | "ready" | "away" | "disconnected" | "left";

	constructor()
	{
		this._status = "connected";
	}

	// get the status outside
	public get status() {
		return this._status;
	}

	// leave the player
	public leave()
	{
		if (this._status === "left") return;

		// close socket...
		//... and set status
		this._status = "left";
	}

	// disconnect the player
	public disconnect()
	{
		if (this._status === "disconnected") return;

		// close socket...
		//... and set status
		this._status = "disconnected";
	}

	// go away!!
	public away()
	{
		if (this._status === "away") return;

		// close socket...
		// this._socket.close();
		//... and set status
		this._status = "away";
	}

	// get ready
	public ready()
	{
		if (this._status === "ready") return;

		// close socket...
		// this._socket.close();
		//... and set status
		this._status = "ready";
	}
}