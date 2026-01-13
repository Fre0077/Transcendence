import amqp from "amqplib";

import { getChannel } from "../rabbit"

const RABBITMQ_URL="amqp://guest:guest@localhost:5672"

export async function publishUserRegistered(username: string | undefined, imageProfile: string | undefined |null, linkId: number) {
  // Reuse existing channel; if missing, create connection/channel using env/default
  let channel = await getChannel();
  if (!channel) {
    const raw = process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";
    const rabbitmqUrl = raw.includes("://") ? raw.trim() : `amqp://guest:guest@${raw.trim()}`;
    const connection = await amqp.connect(rabbitmqUrl);
    channel = await connection.createChannel();
  }

  const msg = JSON.stringify({ username, imageProfile, linkId });

  const queues = [
    "user.registered.profile",
    "user.registered.chat"
  ];

  for (const queue of queues) {
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
  }

  console.log("✔️  Messaggi inviati alle code profile/chat:");
}