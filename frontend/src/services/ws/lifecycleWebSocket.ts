
import { router } from "@/router";
<<<<<<< HEAD:frontend/src/services/lifecycleWebSocket.ts
import { toastNotification } from "./toastNotification";
import { sendPostRequest, sendDeleteRequest } from "@/services/api/sendRequests";
=======
import { toastNotification } from "@services/toastNotification";
>>>>>>> refs/remotes/origin/feature__notify:frontend/src/services/ws/lifecycleWebSocket.ts

const BUTLER_URL = `ws://${window.location.hostname}:3029/ws`;
const BACKEND_APIS_URL = `http://${window.location.hostname}:3029/api`;

let socket:WebSocket | null = null;


// function joinLobby(lobbyid:string)
// {
// 	router.push(`/lobby/online?lobby-id=${}`);
// }

export function ConnectLifecycleSocket(): WebSocket
{

	// if already initialized
	if (socket && socket.readyState === WebSocket.OPEN) {
		return socket;
	}

	/* const  */socket = new WebSocket(BUTLER_URL);

	socket.onopen = () => {
		console.log('[WS] connected to \'' + BUTLER_URL + '\'');
		// if (socket) socket.send("Ciao Butler");
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
						console.log("Friend request", msg.sender);
						toastNotification.friend('Friend Request', `${msg.sender} vorrebbe essere tuo amico`, 
							() => { alert('Pagina Friends');},
							() => { sendPostRequest(`${BACKEND_APIS_URL}/friend/accept`, {
										target : msg.sender
									}, 'application/json');},
							() => { sendDeleteRequest(`${BACKEND_APIS_URL}/friend/remove`, {
										target : msg.sender
									}, 'application/json');}, 5000);
						break ;
					case "lobby-invite":
						console.log("Lobby invite", msg.content);
						toastNotification.message('TEST', 'X ha trovato l\'indirizzo di casa tua', () => router.push(`/lobby/online?lobby-id=${msg.content}`), 10000);
						break ;
					case "tournament-invite":
						console.log("Tournament invite", msg.content);
						toastNotification.message('TEST', 'X e\' dietro di te', () => {alert('SAIK')}, 10000);
						break ;
					default:
						console.log(`Unknown type ${msg.type}`, msg.content);
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
export function DisconnectLifecycleSocket() {
	socket?.close();
	socket = null;
}
