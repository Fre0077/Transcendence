import amqp from "amqplib";
import { PrismaClient as profilePrismaClient, Prisma} from "../database/generate/profile"
const profilePrisma = new profilePrismaClient()
import { getChannel } from "../rabbit"

const RABBIT_URL = "amqp://guest:guest@rabbitmq:5672";

//funzione per ricezione dati da auth-register(TEST)
export async function startprofileConsumer() {
	// Reuse the configured channel from startRabbit; if missing, create one with env/default
	let channel = await getChannel();
	if (!channel) {
		const rabbitmqUrl = process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";
		const connection = await amqp.connect(rabbitmqUrl);
		channel = await connection.createChannel();
	}

	const queue = "user.registered.profile";

	await channel.assertQueue(queue, { durable: true });
	console.log("📥 profile service in attesa di messaggi...");

	channel.consume(queue, async (msg: amqp.Message | null) => {
		if (!msg) return;

		const data = JSON.parse(msg.content.toString());
		console.log("📥 profile ricevuto:", data);

		try {
			await profilePrisma.user.upsert({
                where: { 
                    linkId: data.linkId
                },
                update: {
                    username: data.username,
                    ...(data.imageProfile !== undefined ? { avatarUrl: data.imageProfile } : {})
                },
                create: {
                    linkId: data.linkId,
                    username: data.username,
                    avatarUrl: data.imageProfile || null
                }
            });
            channel!.ack(msg);
		} catch (err) {
			const e = err as any;
			if (e?.code === "P2002") {
				console.log("⚠️ Conflitto di univocità, creazione ignorata:", e?.meta ?? {});
			} else {
				console.error("❌ Errore nella gestione del messaggio profile:", e);
			}
		}
	});
}