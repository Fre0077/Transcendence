import { sendGetRequest } from "./sendRequests";

const GATEWAY_URL = `/api/isauth`;

export async function isauth(): Promise<boolean> {
	try {
		const auth = await sendGetRequest(GATEWAY_URL).catch((err) => console.log('Fetching error', err));
		if (auth?.ok === false) return false;
		if (auth?.ok === true) return true;
		throw new Error('Invalid server response');
	} catch (err) {
		console.log('Error while checking auth', err);
		return false;
	}
}