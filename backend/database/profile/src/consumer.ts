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
					console.log('data.player', historyData.players);
					const potentialLinkId = historyData.players.map((username: string) => {
							// Se è una stringa che inizia con Guest, BOT la scarto perchè non è presente nel DB
							if (username.startsWith('Guest') || username.startsWith('BOT'))
								return null;
							return username;
						})
						.filter((username: string | null): username is string => username !== null);
					// Eseguiamo la query solo se abbiamo trovato almeno un numero valido
					let validUsername: string[] = [];
					if (potentialLinkId.length > 0) {
						const existingUsers = await profilePrisma.user.findMany({
							where: {
								linkId: { in: potentialLinkId }
							},
							select: { username: true }
						});
						validUsername = existingUsers.map(u => u.username!);
					}
					if (validUsername.length === 0) {
						console.log("ℹ️ Nessun utente registrato coinvolto (es. Guest vs Bot). History non salvata su Profile.");
						channel!.ack(msg);
						if (historyData.metadata?.room === 'finals')
							setTournamentScore(historyData);
						return;
					}
					for (const player of validUsername){
						if (historyData.winner.includes(player)){
							await profilePrisma.user.update({
								where: { linkId: Number(player)},
								data: {wins: {increment: 1}}
							})
						}
						else {
							await profilePrisma.user.update({
								where: { linkId: Number(player)},
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
								connect: validUsername.map(username => ({ username }))
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
					console.log(`✅ Game ${historyData.ID} salvato. Collegato agli utenti: ${validUsername.join(", ")}`);
					channel!.ack(msg);
				} catch (err) {
					console.error("❌ Errore critico salvataggio history:", err);
					channel!.ack(msg); 
				}
			}
		});
	}
}