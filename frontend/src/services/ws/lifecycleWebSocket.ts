// defaults
import { router } from "@/router";

// services
import { toastNotification } from "@services/toastNotification";
import { /* sendGetRequest,  */sendPostRequest } from "../api/sendRequests";
import { authWebSocket } from "@services/ws/authWebSocket";

// URLs
const BUTLER_URL = `ws://${window.location.hostname}:3029/ws`;
const BACKEND_APIS_URL = `http://${window.location.hostname}:3029/api`;

let socket:WebSocket | null = null;


// this function is async because authWebSocket() fetch()es the '/isauth' endpoint to refresh tokens.
// If it didn't the connection could fail
export async function ConnectLifecycleSocket(): Promise<WebSocket | null>
{

	// if already initialized
	if (socket && socket.readyState === WebSocket.OPEN) {
		return socket;
	}

	// connect with auth refresh
	socket = await authWebSocket('');
	if (!socket) {
		console.log("User not authenticated, can't connect to lifecycle websocket");
		return null;
	}

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
							() => { sendPostRequest(`${BACKEND_APIS_URL}/friend/remove`, {
										target : msg.sender
									}, 'application/json');},
							5000);

						// update the UI
						window.dispatchEvent(
							new CustomEvent('update:friends', { bubbles: true })
						);
						break ;
					case "lobby-invite":
						console.log("Lobby invite", msg.content);
						toastNotification.invite('Lobby Invite', `${msg.sender} ti ha invitato nella sua lobby`,
							undefined,
							() => router.push(`/lobby/online?lobby-id=${msg.content}`),
							() => {},
							10000);
						break ;
					case "tournament-invite":
						console.log("Tournament invite", msg.content);
						toastNotification.invite('TEST', 'X e\' dietro di te',
							() => {alert('SAIK')},
							undefined,
							undefined,
							10000);
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
		console.log("Closing lifecycle websocket");
		socket = null;
	}

	socket.onerror = (err) => {
		console.log("Socket error", err);
		socket?.close();
	}

	return socket;
}

// TODO quando fai il logout
export function DisconnectLifecycleSocket() {
	socket?.close();
	socket = null;
}
