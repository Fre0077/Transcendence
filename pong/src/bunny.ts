import { BUNNYURL, MYURL, MYPASS } from "./index.js";

// client version
export const VERSION:string = "1.0.4";

let MQID:string | undefined = undefined;

/* - - - FT_BUNNY SUBSCRIPTION - - - */
export async function bunnyRegister(): Promise<boolean>
{
	try
	{
		const response = await fetch(`${BUNNYURL}/register?endp=${MYURL}/bunny&pass=${MYPASS}`);
		
		// error on HTTP request formatting
		if (!response.ok) throw `HTTP error: ${response.status}`;
	  
		const res = await response.json();
	  
		// check formatting
		if (!("status" in res) || typeof res.status !== "string"
			|| !("ID" in res) || typeof res.ID !== "string")
			throw 'Invalid JSON';

		// check response status
		if (res.status !== "success") throw new Error(`Register request rejected`);
			
		// save ID
		MQID = res.ID;
	}
	catch (err)
	{
		if (err instanceof SyntaxError) console.log('Error on bunnyRegister():', 'JSON.parse(): SyntaxError');
		else console.log('Error on bunnyRegister():', err);
		return false;
	}

	// all went good
	console.log("Registered to ft_bunny with ID", MQID);

	return true;
}


/* - - - FT_BUNNY SUB - - - */
export async function bunnySubscribe(queues: string[]): Promise<boolean>
{
	// if not registered
	if (MQID === undefined) return false;

	try {
		await Promise.all(
			queues.map(async (q) => {
				const response = await fetch(`${BUNNYURL}/subscribe?queue=${q}&ID=${MQID}`);
  
				// error on HTTP request formatting
				if (!response.ok) throw `HTTP error: ${response.status}`;

		  		const json = await response.json();
  
				// check response format
				if (!("status" in json)) throw new Error("Invalid JSON");
		
				// check response status
				if (json.status !== "success") throw new Error(`Subscription request to '${q}' rejected`);
  
		  		console.log(`Subscribed to '${q}' MessageQueue`);
			})
	  	);
	}
	catch (err)
	{
		if (err instanceof SyntaxError) console.log('Error on bunnySubscribe():', 'JSON.parse(): SyntaxError');
		else console.log('Error on bunnySubscribe():', err);
		return false;
	}

	// If we got here, all succeeded
	return true;
}


/* - - - BUNNY PUBLISH - - - */
function delay(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function publish(queue:string, message:any): Promise<boolean>
{
	try {
		const response = await fetch(`${BUNNYURL}/publish`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ ID: MQID, queue: queue, message: message })
		});
	  
		// error on HTTP request formatting
		if (!response.ok) throw `HTTP error: ${response.status}`;
	  
		const res = await response.json();

		// check response format
		if (!("status" in res)) throw 'Invalid JSON';
	  
		// the 'publish' request was rejected
		if (res.status !== 'success') throw `Publish request on '${queue}' rejected`;
	}
	catch (err)
	{
		if (err instanceof SyntaxError) console.log('Error while publishing:', 'JSON.parse(): SyntaxError');
		else console.log('Error while publishing:', err);
		return false;
	}

	// successful publish
	return true;
}

const MAX_ATTEMPTS:number = 3;

// publish with 3 retries
export async function bunnyPublish(queue:string, message:any): Promise<boolean>
{
	// if not registered
	if (MQID === undefined) return false;

	for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {

		const success = await publish(queue, message);
		if (success) {
			return true;
		}

		// don't wait after the last attempt
		if (attempt < MAX_ATTEMPTS - 1) {
			await delay(1000);
		}
	}

	console.log(`Couldn't publish on ${queue}`);

	return false;
}

/* - - - BUNNY GET - - - */
export async function bunnyGet(queue:string): Promise<any>
{
	// if not registered
	if (MQID === undefined) return null;

	try
	{
		// check if a new games should be added
		const response = await fetch(`${BUNNYURL}/get?queue=${queue}&ID=${MQID}`);

		// error on HTTP request formatting
		if (!response.ok) throw `HTTP error: ${response.status}`;
	  
		const res = await response.json();
	  
		// check response format
		if (!("status" in res) || !("message" in res)) throw 'Invalid JSON';

		// the 'publish' request was rejected
		if (res.status !== 'success') throw `Get request on '${queue}' rejected`;

		// successful return
		return res.message;
	}
	catch (err)
	{
		if (err instanceof SyntaxError) console.log('Error on bunnyGet():', 'JSON.parse(): SyntaxError');
		else console.log('Error on bunnyGet():', err);
		return null;
	}
}