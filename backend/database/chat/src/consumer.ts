import amqp from "amqplib";
import { PrismaClient as chatPrismaClient } from "../database/generate/chat"
const chatPrisma = new chatPrismaClient()

import { getChannel } from "../rabbit"

const RABBIT_URL = "amqp://guest:guest@rabbitmq:5672";

//funzione per ricezione dati da auth-register(TEST)
export async function startChatConsumer() {
  // Reuse the configured channel from startRabbit; if missing, create one with env/default
  let channel = await getChannel();
  if (!channel) {
    const rabbitmqUrl = process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";
    const connection = await amqp.connect(rabbitmqUrl);
    channel = await connection.createChannel();
  }

  const queue = "user.registered.chat";

  await channel.assertQueue(queue, { durable: true });
  console.log("📥 Chat service in attesa di messaggi...");

  channel.consume(queue, async (msg: amqp.Message | null) => {
    if (!msg) return;

    const data = JSON.parse(msg.content.toString());
    console.log("📥 Chat ricevuto:", data);

    try {
      await chatPrisma.user.upsert({
        where: { 
          linkId: data.linkId
        },
        update: {
          username: data.username,
        },
        create: {
          linkId: data.linkId,
          username: data.username,
        }
      });

    } catch (err) {
      const e = err as any;
      if (e?.code === "P2002") {
        // Unique constraint violation (e.g., username already taken)
        console.log("⚠️ Conflitto di univocità, creazione ignorata:", e?.meta ?? {});
      } else {
        console.error("❌ Errore nella gestione del messaggio chat:", e);
      }
    } finally {
      // Always ack to avoid requeue loops on duplicates/errors
      channel.ack(msg);
    }
  });
}