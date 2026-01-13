// just for this usecase
const OPEN = WebSocket.OPEN;

export interface MySocket {
	close(): void;
	send(message:string): void;
	readyState:number;
}


/* PLAYER CLASS
Socket operaitions only inside here */
export class Player<T extends MySocket>
{
	private _status: "connected" | "ready" | "away" | "disconnected" | "left";
	private _socket:T | null;

	constructor(__socket:T | null)
	{
		this._status = "connected";
		this._socket = __socket;
	}

	// get the status outside
	public get status() {
		return this._status;
	}

	public isBot() {
		return (this._socket === null) ? true : false;
	}

	// leave the player
	public leave()
	{
		if (this._status === "left") return;

		// close socket...
		if (this._socket !== null) this._socket.close();
		//... and set status
		this._status = "left";
	}

	// disconnect the player
	public disconnect()
	{
		if (this._status === "disconnected") return;

		// close socket...
		if (this._socket !== null) this._socket.close();
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

	// update socket
	public connect(__socket:T | null | void)
	{
		if (__socket) {this._socket = __socket};
		this._status = "connected";
	}

	// send message
	public send(message:string)
	{
		if (this._socket !== null && this._socket.readyState === OPEN) {
			this._socket.send(message);
		};
	}

	// returns the state of the socket
	public get state() {
		return this._socket?.readyState;
	}
}