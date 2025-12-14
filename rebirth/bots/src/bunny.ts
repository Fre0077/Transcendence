import { BUNNYURL, MYURL, MYPASS } from "./index.js";

// client version
export const VERSION:string = "1.0.3";

let MQID:string;

/* - - - FT_BUNNY SUBSCRIPTION - - - */
export async function bunnyRegister(): Promise<boolean>
{
	try
	{
		await fetch(`${BUNNYURL}/register?endp=${MYURL}/bunny&pass=${MYPASS}`)
		.then(r => r.json())
		.then((json) =>{
			if ("status" in json === false || typeof json.status !== "string"
				|| "ID" in json == false || typeof json.ID !== "string")
				throw 'Invalid JSON';

			// check if subscription went well
			if (json.status !== 'success') throw `Failed to register to bunnyMQ, reason: ${json.reason}`
			
			// save ID
			MQID = json.ID;

			console.log("Registered to ft_bunny with ID", MQID);
		});
		// catched below

	} catch (err) {
		console.log(err);
		return false;
	}

	// all went good
	return true;
}


/* - - - FT_BUNNY SUB - - - */
export async function bunnySubscribe(queues: string[]): Promise<boolean>
{
	try {
	  await Promise.all(
		queues.map(async (q) => {
		  const res = await fetch(
			`${BUNNYURL}/subscribe?queue=${q}&ID=${MQID}`
		  );
  
		  const json = await res.json();
  
		  if (!("status" in json)) {
			throw new Error("Invalid JSON");
		  }
  
		  if (json.status !== "success") {
			throw new Error(`Unsuccessful subscription to '${q}'`);
		  }
  
		  console.log(`Subscribed to '${q}' MessageQueue`);
		})
	  );
  
	  // If we got here, all succeeded
	  return true;
	} catch (err) {
	  console.error("Failed to subscribe:", err);
	  return false;
	}
}


/* - - - BUNNY PUBLISH - - - */
export async function bunnyPublish(queue:string, message:any): Promise<boolean>
{
	try {
		const res = await fetch(`${BUNNYURL}/publish`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ ID: MQID, queue: queue, message: message })
		})
		.then(r => r.json())
		.catch((err) => console.log(err));

		// error on publish
		if (!res?.status) return false;
	} catch (err) {
		console.log("Failed to connect to MessageQueue service:", err);
		return false;
	}

	return true;
}

/* - - - BUNNY GET - - - */
export async function bunnyGet(queue:string): Promise<any>
{
	let msg:any;

	// check if a new games should be added
	await fetch(`${BUNNYURL}/get?queue=${queue}&ID=${MQID}`)
	.then(r => r.json())
	.then((json) =>{
		if ("status" in json === false) throw "Invalid JSON";
		if (json.status !== 'success') return ;

		json = Object(json);

		// check if the message is there
		if ("message" in json === false) throw 'Invalid JSON (with successful get)';

		msg =  json.message;

	})
	.catch((err) => console.log(err));

	return msg;
}