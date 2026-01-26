// services
import { sendGetRequest } from "@services/api/sendRequests";

// 
export async function authWebSocket(endpoint?:string): Promise<WebSocket | null>
{
	// fetch /isauth endpoint to refresh authentication
	const ret = await sendGetRequest(`/api/isauth`);
	if (ret.ok === false) {
		return null;
	}

	const url = (endpoint) ? `/ws/${endpoint}` : `/ws/`;
	return new WebSocket(url);
}
