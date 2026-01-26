import { sendGetRequest } from "./sendRequests";

const GATEWAY_URL = `/api/isauth`;

export async function isauth(): Promise<boolean> {
	try {
		const auth = await sendGetRequest(GATEWAY_URL);
		if (auth.ok === false) throw new Error(auth.reason || 'Authentication failed');
		if (auth.ok === true) return true;
		throw new Error('Invalid server response');
	} catch (err) {
		console.log('Error while checking auth', err);
		return false;
	}
}