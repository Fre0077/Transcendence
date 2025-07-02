import type { RawData } from "ws";
import type { FastifyInstance } from "fastify";
import { createChat, deletemessages, handleMessage } from "../dataFunction/chat";
import { userChatList, userList, listChatMessage } from "../dataFunction/chat";
import { deletemessage, searchMessage, searchChat } from "../dataFunction/chat";

import { PrismaClient as chatPrismaClient } from "../prisma/generate/chat";
const chatPrisma = new chatPrismaClient();

import { newChat, newMessage, srcChat } from "../../classes/classes";

export async function chatEndpoint(fastify: FastifyInstance) {
	// Endpoint POST per avere la lsita degli user
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

	// Endpoint WebSocket per ottenere la lista delle chat di uno user
	fastify.get("/chat-list", { websocket: true }, (connection: any, req) => {
		connection.socket.on('message', async (rawMessage: RawData) => {
			try {
				const userId = Number(rawMessage.toString());
				if (isNaN(userId)) {
					connection.socket.send(JSON.stringify({ error: "Invalid userId" }));
					return;
				}
				const output = await userChatList(userId);
				connection.socket.send(JSON.stringify({ chats: output }));
			} catch (err) {
				connection.socket.send(JSON.stringify({ error: err + " Internal server error" }));
			}
		});
	});

	// Endpoint WebSocket per ottenere gli ultimi 100 messaggi a partire da un certo indice
	fastify.get("/index-message", { websocket: true }, (connection: any, req) => {
		connection.socket.on('message', async (rawMessage: RawData) => {
			try {
				const { message } = JSON.parse(rawMessage.toString()) as { message?: number[] };
				if (!message || !Array.isArray(message)) {
					connection.socket.send(JSON.stringify({ error: "Invalid index array provided" }));
					return;
				}
				const output = await listChatMessage(message);
				connection.socket.send(JSON.stringify({ reply: output }));
			} catch (err) {
				connection.socket.send(JSON.stringify({ error: err + " Internal server error" }));
			}
		});
	});

	// Endpoint POST per eliminare una chat
	fastify.post("/delete-chat-messages", async (request, reply) => {
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

	// Endpoint POST per eliminare una chat
	fastify.post("/delete-message", async (request, reply) => {
		const { messageId } = request.body as { messageId?: string | number };
		if (!messageId) return reply.status(400).send({ error: "No ID provided" });
		try {
			const id = typeof messageId === "string" ? parseInt(messageId, 10) : messageId;
			if (isNaN(id)) return reply.status(400).send({ error: "Invalid ID" });
			await deletemessage(id);
			return { reply: `🗑️ messages deleted from chat ${id}\n` };
		} catch (err) {
			return reply
				.status(500)
				.send({ error: err + " Internal server error" });
		}
	});
	
	// Endpoint per ricevere messaggi
	fastify.post("/chat-message", async (request, reply) => {
		try {
			const msg = request.body as newMessage;
			if (!msg || !msg.message || !msg.chatId || !msg.userId) {
				return reply.status(400).send({ error: "Missing message data" });
			}
			await handleMessage(msg);
			return reply.status(201).send({ status: "ok" });
		} catch (err) {
			return reply
				.status(500)
				.send({ status: "error", error: err + " Internal server error" });
		}
	});

	// Endpoint POST ricercare le chat
	fastify.post("/search-chat", async (request, reply) => {
		const chatData = request.body as srcChat;
		if (!chatData) return reply.status(400).send({ error: "no data for research provided" });
		try {
			await searchChat(chatData);
		} catch (err) {
			return reply
				.status(500)
				.send({ error: err + " Internal server error" });
		}
	});

	// Endpoint POST ricercare i messaggi
	fastify.post("/search-message", async (request, reply) => {
		const { srcMess } = request.body as { srcMess?: string | number };
		if (!srcMess) return reply.status(400).send({ error: "no data for research provided" });
		try {
			await searchMessage(srcMess.toString());
		} catch (err) {
			return reply
				.status(500)
				.send({ error: err + " Internal server error" });
		}
	});
}
