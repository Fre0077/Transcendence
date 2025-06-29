import type { RawData } from "ws";
import type { FastifyInstance } from "fastify";
import { createUser, loginUser } from "../dataFunction/user";

import { PrismaClient as userPrismaClient } from "../prisma/generate/user";
const userPrisma = new userPrismaClient();

import { userLogin } from "../../classes/classes";

export async function userEndpoint(fastify: FastifyInstance) {
	fastify.post("/register", async (request, reply) => {
		const userData = request.body as userLogin;
		if (!userData)
			return reply.status(400).send({ error: "Missing user data" });
		try {
			await createUser(userData);
			return reply.status(201).send({ message: "User created" });
		} catch (err) {
			return reply
				.status(500)
				.send({ error: err + " Internal server error" });
		}
	});

	// Endpoint POST per fare il login
	fastify.post("/login", async (request, reply) => {
		const userData = request.body as userLogin;
		if (!userData)
			return reply.status(400).send({ error: "Missing user data" });
		try {
			const output = await loginUser(userData);
			return reply.status(201).send({ message: output });
		} catch (err) {
			return reply
				.status(500)
				.send({ error: err + " Internal server error" });
		}
	});
}
