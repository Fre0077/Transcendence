import WebSocket from "ws";

class Relations<T>
{
	private _data:T[] = [];

	public get data() {
		return this._data;
	}

	public set(__data:T[]) {
		this._data = __data;
	}

	public clear() {
		this._data = [];
	}

	public has(__elem:T):boolean {
		if (this._data.find(e => e === __elem)) return true;
		return false;
	}

	public add(__elem:T) {
		this._data.push(__elem);
	}

	public add_block(__block:T[]) {
		this._data = this._data.concat(__block);
	}

	public remove(__elem:T) {
		const idx = this._data.indexOf(__elem);
		if (idx !== undefined) this._data.splice(idx, 1);
	}
}

/* class that stores a socket connection, an unique key
and an array of related unique keys */
export class ConnectedUser
{
	private readonly _ID:string;
	private _socket:WebSocket;
	public status:"online" | "offline" | "away" = "online";

	private _relations:Relations<string>;

	constructor(__ID:string, __socket:WebSocket) {
		this._ID = __ID;
		this._socket = __socket;
		this._relations = new Relations();
	}

	/* getters */
	public get ID() {
		return this._ID;
	}

	public get relations() {
		return this._relations;
	}

	public get socket() {
		return this._socket;
	}

	public new_socket(__socket:WebSocket) {
		this.status = "online";
		this._socket = __socket;
	}
	//---------
}