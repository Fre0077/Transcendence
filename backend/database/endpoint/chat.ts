import type { RawData } from "ws";
import type { FastifyInstance } from "fastify";
import { createChat, deletemessages, handleMessage } from "../dataFunction/chat";
import { userChatList, userList, listChatMessage } from "../dataFunction/chat";
import { deletemessage } from "../dataFunction/chat";

import { PrismaClient as chatPrismaClient } from "../prisma/generate/chat";
const chatPrisma = new chatPrismaClient();

import { newChat, newMessage } from "../../classes/classes";

export async function chatEndpoint(fastify: FastifyInstance) {
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
				const username = rawMessage.toString();
				const output = await userChatList(username);
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
					connection.socket.send(JSON.stringify({ error: "No valid index array provided" }));
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
	
	// Endpoint WebSocket per ricevere messaggi
	fastify.get("/chat-message", { websocket: true }, (connection: any, req) => {
		connection.socket.on('message', async (rawMessage: RawData) => {
			try {
				const msg: newMessage = JSON.parse(rawMessage.toString());
				await handleMessage(msg);
				connection.socket.send(JSON.stringify({ status: "ok" }));
			} catch (err) {
				connection.socket.send(JSON.stringify({ status: "error", error: err + "" }));
			}
		});
	});
}
