import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import bcrypt from 'bcrypt';

import { PrismaClient as AuthClient } from "../auth/database/generate/auth";
const AuthPrisma = new AuthClient();
import { PrismaClient as ChatClient } from "../chat/database/generate/chat";
const ChatPrisma = new ChatClient();
import { PrismaClient as ProfileClient } from "../profile/database/generate/profile";
const ProfilePrisma = new ProfileClient();

import { publishUserRegistered } from "../auth/src/publisher";
import { logError, logInfo } from "./logger";

export async function emptyDatabase(): Promise<void> {
	await AuthPrisma.account.deleteMany({});
	await ChatPrisma.messages.deleteMany({});
	await ChatPrisma.chats.deleteMany({});
	await ChatPrisma.user.deleteMany({});
	await ProfilePrisma.user.deleteMany({});
}

export async function setUpTest(): Promise<void> {
	await emptyDatabase();
	const salt = await bcrypt.genSalt(10);
	const newAccounts = await AuthPrisma.account.createMany({
		data: [
			{
				name: "Giova",
				surname: "Scemo più scemo",
				username: "userA",
				email: "userA@gmail.com",
				passwordHash: await bcrypt.hash("Password", salt)
			},
			{
				name: "Tommy",
				surname: "ritardato",
				username: "userB",
				email: "userB@gmail.com",
				passwordHash: await bcrypt.hash("Password", salt)
			},
			{
				name: "Enrico",
				surname: "Addormentato",
				username: "userC",
				email: "userC@gmail.com",
				passwordHash: await bcrypt.hash("Password", salt)
			}
		]
	});
	publishUserRegistered("Giova", null, 1);
	publishUserRegistered("Tommy", null, 2);
	publishUserRegistered("Enrico", null, 3);
}

export async function utilsEndpoint(fastify: FastifyInstance) {
	fastify.post("/empty-database", async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const user = await emptyDatabase();
			logInfo('{utils} [200] Dati del database cancellati con successo');
			reply.code(200).send({ message: "Dati del database cancellati con successo"});

		} catch (err) {
			if (err instanceof Error) {
				reply.code((err as any).statusCode).send({ error: err.message });
			} else {
				logError('{auth} [500] errore interno del server');
				reply.code(500).send({ error: "Internal server error" });
			}
		}
	});

	fastify.post("/setup-test", async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const user = await setUpTest();
			logInfo('{auth} [200] Database setuppati per i test con successo');
			reply.code(200).send({ message: "token generato con successo" });

		} catch (err) {
			if (err instanceof Error) {
				reply.code((err as any).statusCode).send({ error: err.message });
			} else {
				logError('{auth} [500] errore interno del server');
				reply.code(500).send({ error: "Internal server error" });
			}
		}
	});
}