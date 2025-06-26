import Fastify from "fastify";
import { createChat, deletemessages, handleMessage, userChatList, userList, listMessage } from "./chat";
import { createUser, loginUser } from "./user";
import cors from "@fastify/cors";

import { userLogin, newChat } from "../classes/classes";

import { PrismaClient as userPrismaClient } from "./prisma/generate/user";
const userPrisma = new userPrismaClient();
import { PrismaClient as chatPrismaClient } from "./prisma/generate/chat";
const chatPrisma = new chatPrismaClient();
const fastify = Fastify();

fastify.register(cors, {
	origin: (origin, cb) => {
		const allowedOrigins = [
			"http://localhost:4269", // frontend
			"http://localhost:3000", // eventualmente anche il backend stesso
		];

		if (!origin || allowedOrigins.includes(origin)) {
			cb(null, true); // ok
		} else {
			cb(new Error("Not allowed by CORS"), false);
		}
	},
	credentials: true, // se usi cookie o autenticazione
});

fastify.addContentTypeParser(
	"text/plain",
	{ parseAs: "string" },
	function (req, body, done) {
		done(null, body);
	}
);

// ENDPOINT PER GESTIRE LE REQUEST

// Endpoint POST per avere la lista di user dentro chat
fastify.post("/user-list", async (request, reply) => {
	const { host } = request.body as { host?: string };
	if (!host) return reply.status(400).send({ error: "Missing host" });
	try {
		const output = await userList(host);
		return reply.status(201).send({ reply: output });
	} catch (err) {
		// console.log("Error fetching user list:", err);
		return reply
			.status(500)
			.send({ error: err + " Internal server error" });
	}
});

// Endpoint POST per creare nuova chat
fastify.post("/new-chat", async (request, reply) => {
	const chatData = request.body as newChat;
	if (!chatData) return reply.status(400).send({ error: "Missing chat info" });
	try {
		const output = await createChat(chatData);
		return { reply: output };
	} catch (err) {
		// console.error("Error creating chat:", err);
		return reply
			.status(500)
			.send({ error: err + " Internal server error" });
	}
});

// Endpoint POST per avere la lista di chat di uno user
fastify.post("/chat-list", async (request, reply) => {
	const username = request.body as string ;
	if (!username) return reply.status(400).send({ error: "No username provided" });
	try {
		const output = await userChatList(username);
		return reply.status(201).send({ chats: output });
	} catch (err) {
		console.log("Error fetching chat list:", err);
		return reply
			.status(500)
			.send({ error: err + " Internal server error" });
	}
});

// Endpoint POST per avere la lista degli ultimi 100 messaggi a partire da un certo indice
fastify.post("/index-message", async (request, reply) => {
    const { message } = request.body as { message?: number[] };
    if (!message || !Array.isArray(message))
        return reply.status(400).send({ error: "No valid index array provided" });
    try {
        const output = await listMessage(message);
        return reply.status(201).send({ reply: output });
    } catch (err) {
        return reply
            .status(500)
            .send({ error: err + " Internal server error" });
    }
});

// Endpoint POST per ricevere il messaggio
fastify.post("/chat-message", async (request, reply) => {
	const { message } = request.body as { message?: string };
	if (!message)
		return reply.status(400).send({ error: "No message provided" });
	try {
		const output = await handleMessage(message);
		return { reply: output };
	} catch (err) {
		return reply
			.status(500)
			.send({ error: err + " Internal server error" });
	}
});

// Endpoint POST per eliminare una chat
fastify.post("/delete-chat", async (request, reply) => {
	const { chatId } = request.body as { chatId?: string | number };
	if (!chatId) return reply.status(400).send({ error: "No ID provided" });
	try {
		const id = typeof chatId === "string" ? parseInt(chatId, 10) : chatId;
		if (isNaN(id)) return reply.status(400).send({ error: "Invalid ID" });
		await deletemessages(id);
		return { reply: `🗑️ messages deleted from chat ${id}\n` };
	} catch (err) {
		return reply
			.status(500)
			.send({ error: err + " Internal server error" });
	}
});

// Endpoint POST per registrarsi
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

// Avvia il server
fastify.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
	if (err) throw err;
	console.log(`Server Fastify avviato su ${address}`);
});



