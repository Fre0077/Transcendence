import amqp from "amqplib";

const RABBITMQ_URL="amqp://guest:guest@localhost:5672"

let connection: any = null;
let channel: any = null;

export async function startRabbit() {
	// Default to localhost for local dev; override with RABBITMQ_URL (e.g. docker hostname)
	const rabbitmqUrl = process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";
	connection = await amqp.connect(rabbitmqUrl);
	channel = await connection.createChannel();
}

export function getChannel() {
	return channel;
}
