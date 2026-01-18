
const BUTLER_URL = `ws://${window.location.hostname}:3029/ws`;

let socket: WebSocket | null = null

export function butlerSocket(): WebSocket
{

	// if already initialized
	if (socket && socket.readyState !== WebSocket.CLOSED) {
		return socket;
	}

	socket = new WebSocket(BUTLER_URL);

	// if (socket === null) {
	// 	console.log('Error while connecting to', BUTLER_URL);
	// 	return ;
	// }

	socket.onopen = () => {
		console.log('[WS] connected to \'' + BUTLER_URL + '\'');
		if (socket) socket.send("Ciao Butler");
	}

	/* #friend-request
		#lobby-invite
		#tournament-invite
	 */

	/* notify format: { what: 'NOTIFY, type: 'friend-request/...', data:any } */
	socket.onmessage = (ev: MessageEvent<string>) => {
		try
		{
			const msg = JSON.parse(ev.data);

			// handle notifications
			if (msg?.what === "NOTIFY")
			{
				if (!msg.type) throw new Error("Missin Notification type");
				
				switch (msg.type)
				{
					case "friend-request":
						console.log("Friend request", msg.data);
						break ;
					case "lobby-invite":
						console.log("Lobby invite", msg.data);
						break ;
					case "tournament-invite":
						console.log("Tournament invite", msg.data);
						break ;
					default:
						console.log(`Unknown type ${msg.type}`, msg.data);
				}
			}
		}
		catch (err)
		{
			console.log('Error while receiving from butler', err);
		}
	}


	socket.onclose = () => {
		console.log("Addio butler");
		socket = null;
	}

	socket.onerror = (err) => {
		console.log("Socket error", err);
	}

	return socket;
}

// TODO quando fai il logout
export function closeButlerSocket() {
	socket?.close();
	socket = null;
}