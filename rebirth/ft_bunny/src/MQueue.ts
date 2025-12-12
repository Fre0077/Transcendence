class Queue<T> {
	private _items: { [key: number]: T } = {};
	private _head = 0;
	private _tail = 0;

	// add another element
	public enqueue(item: T): void {
		this._items[this._tail] = item;
		this._tail++;
	}

	// get the first element
	public dequeue(): T | undefined {
		if (this.empty()) return undefined;
			const item = this._items[this._head];
			delete this._items[this._head];
			this._head++;
		return item;
	}

	// check without removing
	peek(): T | undefined {
		return this._items[this._head];
	}

	// is the queue empty?
	empty(): boolean {
		return this._tail === this._head;
	}

	// size of the queue
	size(): number {
	return this._tail - this._head;
	}
}


export class MQueue
{
	private _queue:Queue<string>;
	private _followers:Set<string>;

	constructor() {
		this._queue = new Queue();
		this._followers = new Set();
	}

	public subscribe(ID:string) {
		this._followers.add(ID);
	}

	public leave(ID:string) {
		this._followers.delete(ID);
	}

	public publish(ID:string, message:string):boolean {
		if (this._followers.has(ID) === false) return false;
		this._queue.enqueue(message);
		return true;
	}

	public get(ID:string):string | undefined {
		if (this._followers.has(ID) === false) return undefined;
		return this._queue.dequeue();
	}

	public empty() {
		return this._queue.empty();
	}
}