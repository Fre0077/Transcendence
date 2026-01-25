// services
import { sendGetRequest } from "@services/api/sendRequests";

// URLs
const BACKEND_APIS_URL = `http://${window.location.hostname}:3029/api`;
const BACKEND_WS_URL = `ws://${window.location.hostname}:3029/ws`;

// 
export async function authWebSocket(endpoint?:string): Promise<WebSocket | null>
{
	// fetch /isauth endpoint to refresh authentication
	const ret = await sendGetRequest(`${BACKEND_APIS_URL}/isauth`);
	if (ret.ok === false) {
		return null;
	}

	const url = (endpoint) ? `${BACKEND_WS_URL}/${endpoint}` : BACKEND_WS_URL

	return new WebSocket(url);
}
