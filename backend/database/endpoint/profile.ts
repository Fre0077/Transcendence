import type { FastifyInstance } from "fastify";
import { changeUsername, changeEmail, changePassword } from "../dataFunction/profile";

import { PrismaClient as profilePrismaClient } from "../prisma/generate/profile";
const profilePrisma = new profilePrismaClient();

import { changeProfile } from "../../classes/classes"

export async function profileEndpoint(fastify: FastifyInstance) {
	// Endpoint POST per cambiare lo username
	fastify.post("/change-username", async (request, reply) => {
		const userData = request.body as changeProfile;
		if (!userData)
			return reply.status(400).send({ error: "Missing new username" });
		try {
			await changeUsername(userData);
			return reply.status(201).send({ message: "Username changed" });
		} catch (err) {
			return reply
				.status(500)
				.send({ error: err + " Internal server error" });
		}
	});

	// Endpoint POST per cambiare l'email
	fastify.post("/change-email", async (request, reply) => {
		const userData = request.body as changeProfile;
		if (!userData)
			return reply.status(400).send({ error: "Missing new email" });
		try {
			await changeEmail(userData);
			return reply.status(201).send({ message: "email changed" });
		} catch (err) {
			return reply
				.status(500)
				.send({ error: err + " Internal server error" });
		}
	});

	// Endpoint POST per cambiare la password
	fastify.post("/change-password", async (request, reply) => {
		const userData = request.body as changeProfile;
		if (!userData)
			return reply.status(400).send({ error: "Missing new password" });
		try {
			await changePassword(userData);
			return reply.status(201).send({ message: "email changed" });
		} catch (err) {
			return reply
				.status(500)
				.send({ error: err + " Internal server error" });
		}
	});
}
