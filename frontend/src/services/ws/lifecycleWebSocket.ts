// defaults
import { router } from "@/router";

// services
import { toastNotification } from "@services/toastNotification";
import { /* sendGetRequest,  */sendPostRequest } from "../api/sendRequests";
import { authWebSocket } from "@services/ws/authWebSocket";

// URLs
const BUTLER_URL = `/ws`;
const BACKEND_APIS_URL = `/api`;

let socket:WebSocket | null = null;


/* HELPERS */
function acceptFriendRequest(target:string)
{
	sendPostRequest(`${BACKEND_APIS_URL}/friend/accept`, {
			target : target
		}, 'application/json')
	.then(() => {

		// update the UI
		window.dispatchEvent(
			new CustomEvent('update:friends', { bubbles: true })
		);
	});
}

function declineFriendRequest(target:string)
{
	sendPostRequest(`${BACKEND_APIS_URL}/friend/remove`, {
			target : target
		}, 'application/json')
	.then(() => {

		// update the UI
		window.dispatchEvent(
			new CustomEvent('update:friends', { bubbles: true })
		);
	});
}

// this function is async because authWebSocket() fetch()es the '/isauth' endpoint to refresh tokens.
// If it didn't the connection could fail
export async function ConnectLifecycleSocket(): Promise<WebSocket | null>
{

	// if already initialized
	if (socket && socket.readyState === WebSocket.OPEN) {
		return socket;
	}

	// connect with auth refresh
	socket = await authWebSocket();
	if (!socket) {
		console.log("User not authenticated, can't connect to lifecycle websocket");
		return null;
	}

	socket.onopen = () => {
		console.log('[WS] connected to \'' + BUTLER_URL + '\'');
		// if (socket) socket.send("Ciao Butler");
	}

	/*  #friend-request
		#lobby-invite
		#tournament-invite
	 */

	/* notify format: { what: 'NOTIFY/UPDATE', type: 'friend-request/...', sender?:<username>, content?:any } */
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
							() => acceptFriendRequest(msg.sender),
							() => declineFriendRequest(msg.sender),
							5000);
						
						break ;
					case "lobby-invite":
						console.log("Lobby invite", msg.content);
						toastNotification.invite('Lobby Invite', `${msg.sender} ti ha invitato nella sua lobby`,
							undefined,
							() => router.push(`/lobby/online?lobby-id=${msg.content}`),
							() => {},
							10_000);
						break ;
					case "tournament-invite":
						console.log("Tournament invite", msg.content);
						toastNotification.invite('TEST', 'X e\' dietro di te',
							() => {alert('SAIK')},
							undefined,
							undefined,
							10_000);
						break ;
					default:
						console.log(`Unknown type ${msg.type}`, msg.content);
				}
			}

			// status update
			if (msg?.what === "UPDATE")
			{
				if (!msg.type) throw new Error("Missin Update type");
				
				switch (msg.type)
				{
					case "friend":
						console.log("Friend update", msg.sender);
						// update the UI
						window.dispatchEvent(
							new CustomEvent('update:friends', { bubbles: true })
						);
						
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
		console.log("Closing Lifecycle WebSocket");
		socket = null;
	}

	socket.onerror = (err) => {
		console.log("Lifecycle WebSocket error", err);
		socket?.close();
	}

	return socket;
}

// TODO quando fai il logout
export function DisconnectLifecycleSocket() {
	socket?.close();
	socket = null;
}
