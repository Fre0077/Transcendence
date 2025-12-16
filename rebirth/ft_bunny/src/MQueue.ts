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

/* This object creates a Queue for each ID that subscribes.
If you publish a message in this Q all the other followers will
find it in their Queues. */
export class MQueue
{
	private _personal_queues:Map<string, Queue<{ sender:string, message:string }>>;

	constructor() {
		this._personal_queues = new Map();
	}

	public get queues() {
		return this._personal_queues;
	}

	public subscribe(ID:string) {
		if (this._personal_queues.has(ID)) return;
		this._personal_queues.set(ID, new Queue());
	}

	public leave(ID:string) {
		this._personal_queues.delete(ID);
	}

	public publish(ID:string, message:string): boolean {
		if (this._personal_queues.has(ID) === false) return false;
		this._personal_queues.forEach((q, id) => {
			if (id !== ID) q.enqueue({ sender: ID, message: message });
		});
		return true;
	}

	public get(ID:string): { sender:string, message:string } | undefined {
		if (this._personal_queues.has(ID) === false) return undefined;
		return this._personal_queues.get(ID)?.dequeue();
	}

	// public peek(): { sender:string, message:string } | undefined {
	// 	return this._personal_queues.peek();
	// }

	public empty(ID:string) {
		return this._personal_queues.get(ID)?.empty();
	}
}

/* This is a lamer version of the chat above, basiccally you can
pubblish to the queue but only the first one to respond to the notification
will be able to read the message. Perfectly fine for 2 ppl conversations */
/* export class MQueue
{
	private _queue:Queue<{ sender:string, message:string }>;
	private _followers:Set<string>;

	constructor() {
		this._queue = new Queue();
		this._followers = new Set();
	}

	public get followers() {
		return this._followers;
	}

	public subscribe(ID:string) {
		this._followers.add(ID);
	}

	public leave(ID:string) {
		this._followers.delete(ID);
	}

	public publish(ID:string, message:string): boolean {
		if (this._followers.has(ID) === false) return false;
		this._queue.enqueue({ sender: ID, message: message });
		return true;
	}

	public get(ID:string): { sender:string, message:string } | undefined {
		if (this._followers.has(ID) === false) return undefined;
		// if (this._queue.peek()?.sender === ID) return undefined;
		return this._queue.dequeue();
	}

	public peek(): { sender:string, message:string } | undefined {
		return this._queue.peek();
	}

	public empty() {
		return this._queue.empty();
	}
} */