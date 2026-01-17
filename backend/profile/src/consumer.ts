import amqp from "amqplib";
import { PrismaClient as profilePrismaClient, Prisma} from "../database/generate/profile"
const profilePrisma = new profilePrismaClient()
import { getChannel } from "../rabbit"
import { setTournamentScore } from "./function"

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
	const queues = ["user.registered.profile", "user.history.profile"];

	for (const queue of queues) {
		await channel.assertQueue(queue, { durable: true });
		console.log("📥 profile service in attesa di messaggi...");
		channel.consume(queue, async (msg: amqp.Message | null) => {
			if (!msg) return;
			const data = JSON.parse(msg.content.toString());
			console.log("📥 profile ricevuto:", data);
			if (queue === "user.registered.profile")
			{
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
			}
			else if (queue === "user.history.profile") {
				try {
					const historyData = data.history;
					
					if (!historyData || !Array.isArray(historyData.players)) {
						console.warn("⚠️ Messaggio history malformato o senza giocatori, scartato:", data);
						channel!.ack(msg); 
						return;
					}
					const potentialUserIds = historyData.players.map((id: any) => {
							// Se è una stringa che inizia con Guest, BOT la scarto perchè non è presente nel DB
							if (typeof id === 'string' && (id.startsWith('Guest') || id.startsWith('BOT'))) {
								return null;
							}
							const parsed = parseInt(id, 10);
							return isNaN(parsed) ? null : parsed;
						})
						.filter((id: number | null): id is number => id !== null);
					// Eseguiamo la query solo se abbiamo trovato almeno un numero valido
					let validLinkIds: number[] = [];
					if (potentialUserIds.length > 0) {
						const existingUsers = await profilePrisma.user.findMany({
							where: {
								linkId: { in: potentialUserIds }
							},
							select: { linkId: true }
						});
						validLinkIds = existingUsers.map(u => u.linkId);
					}
					if (validLinkIds.length === 0) {
						console.log("ℹ️ Nessun utente registrato coinvolto (es. Guest vs Bot). History non salvata su Profile.");
						channel!.ack(msg);
						if (historyData.metadata?.room === 'finals')
							setTournamentScore(historyData);
						return;
					}
					for (const player of validLinkIds){
						if (historyData.winner.includes(String(player))){
							await profilePrisma.user.update({
								where: { linkId: player},
								data: {wins: {increment: 1}}
							})
						}
						else {
							await profilePrisma.user.update({
								where: { linkId: player},
								data: {losses: {increment: 1}}
							})
						}
					}
					await profilePrisma.game.create({
						data: {
							game: historyData.game,
							gameId: historyData.ID,
							// Salviamo i dati raw (inclusi i nomi "Guest_...") nel JSON per mantenere lo storico visivo corretto
							winner: JSON.stringify(historyData.winner), 
							score: JSON.stringify(historyData.score), 
							replay: historyData.replay || "",
							players: {
								connect: validLinkIds.map(linkId => ({ linkId }))
							},
							gamePlayers: JSON.stringify(historyData.players),
							metadata: {
								create: {
									origin: historyData.metadata?.origin || "unknown",
									originId: historyData.metadata?.id || "",
									room: historyData.metadata?.room
								}
							}
						}
					});
					if (historyData.metadata?.room === 'finals')
                        setTournamentScore(historyData);
					console.log(`✅ Game ${historyData.ID} salvato. Collegato agli utenti: ${validLinkIds.join(", ")}`);
					channel!.ack(msg);
				} catch (err) {
					console.error("❌ Errore critico salvataggio history:", err);
					channel!.ack(msg); 
				}
			}
		});
	}
}