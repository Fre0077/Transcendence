import type { FastifyInstance } from "fastify";
import type { RawData } from "ws";

import { PrismaClient as chatPrismaClient } from "../database/generate/chat";
const chatPrisma = new chatPrismaClient();

import { userList, chatList, messageList, newChat, newMessage, deleteChatMessages,
		deleteMessage, searchMessage, searchChat, listChatMessage, blockUser,
		sblockUser, deleteChat } from "./function";
import { BadRequest, Unauthorized, Forbidden, NotFound, Conflict } from "../utils/exception"
import { NewChat, NewMessage, SrcChat } from "../utils/interface";
import { logError, logInfo } from "../utils/logger"
import { authMiddleware } from "./middleware";

import { WebSocket } from "ws";

const connections: Map<number, WebSocket> = new Map;
const chatConnections: Map<WebSocket, number[]> = new Map;

// Funzione di broadcast per la chat-list
async function broadcastChatListToAll() {
	for (const [id, socket] of connections) {
		const chats = await chatList(id);
		socket.send(JSON.stringify({ chats }));
	}
}

async function broadcastMessageListToAll() {
	for (const [socket, data] of chatConnections) {
		console.log('sending to', data);
		const messages = await messageList(data);
		socket.send(JSON.stringify({ messages }));
	}
}

export async function chatEndpoint(fastify: FastifyInstance) {

	// Endpoint POST per avere la lista degli user
	fastify.post("/user-list", async (request, reply) => {
		const { linkId } = request.body as { linkId?: number };
		try {
			if (!linkId)
				throw new BadRequest("linkId non inviato", 'chat');
			const output = await userList(linkId);

			logInfo("{chat} [201] file inviati con successo");
			return reply.status(201).send({ reply: output, message: 'file inviati con successo' });
		} catch (err) {
			if (err instanceof Error)
				return reply.status((err as any).statusCode).send({ error: err.message });
			logError("{chat} [500] errore interno del server");
			return reply.status(500).send({ error: "Internal server error" });
		}
	});

	// fastify.post("/user-list", async (request, reply) => {
	// 	const { linkId } = request.body as { linkId?: number };
	// 	try {
	// 		if (!linkId)
	// 			throw new BadRequest("linkId non inviato", 'chat');
	// 		const output = await userList(linkId);

	// 		logInfo("{chat} [201] file inviati con successo");
	// 		return reply.status(201).send({ reply: output, message: 'file inviati con successo' });
	// 	} catch (err) {
	// 		if (err instanceof Error)
	// 			return reply.status((err as any).statusCode).send({ error: err.message });
	// 		logError("{chat} [500] errore interno del server");
	// 		return reply.status(500).send({ error: "Internal server error" });
	// 	}
	// });

		// Endpoint WebSocket per ottenere la lista delle chat di uno user
	fastify.get("/chat-list", async (request, reply) => {
		const linkid = request.headers['x-user-id'];
		try {
			const output = await chatList(Number(linkid));
			return reply.status(201).send({ reply: output, message: 'file inviati con successo' });
		} catch (err) {
			if (err instanceof Error)
				return reply.status((err as any).statusCode).send({ error: err.message });
			logError("{chat} [500] errore interno del server");
			return reply.status(500).send({ error: "Internal server error" });
		}
	});

		// Endpoint WebSocket per ottenere la lista delle chat di uno user
	fastify.get("/message-list", async (request, reply) => {
		const data = request.body as number[];
		try {
			const output = await messageList(data);
			return reply.status(201).send({ reply: output, message: 'file inviati con successo' });
		} catch (err) {
			if (err instanceof Error)
				return reply.status((err as any).statusCode).send({ error: err.message });
			logError("{chat} [500] errore interno del server");
			return reply.status(500).send({ error: "Internal server error" });
		}
	});

	// Endpoint WebSocket per ottenere gli ultimi 100 messaggi a partire da un certo indice
	fastify.get("/broadcast", { websocket: true }, (connection: any, request) => {

		const linkId = Number(request.headers["x-user-id"]);

		/* #debug */
		console.log('Connection from',linkId);

		// storing connection
		connections.set(linkId, connection);

		connection.on('message', async (rawMessage: RawData) => {
			try {
				console.log('Got message', rawMessage.toString());

				const data = JSON.parse(rawMessage.toString());


				if (data.chatId && typeof data.chatId === "number"
					&& data.index && typeof data.index === "number")
				{
					console.log('got chat event');
					chatConnections.set(connection, [data.chatId, data.index, linkId]);
				}
			} catch (err) {
				console.log('err', err);
			}
		});

		connection.on('close', () => {
			connections.delete(linkId)
			chatConnections.delete(connection)
		});
	});

	// Endpoint POST per creare una nuova chat
	fastify.post("/new-chat", async (request, reply) => {
		const chatData = request.body as NewChat;
		try {
			if (!chatData)
				throw new BadRequest("Missing chat info", "chat");

			// get the host id automatically
			const hostid = request.headers['x-user-id'];
			if (!hostid) throw new Unauthorized("Missing user-id", "chat");

			// add it to chatData
			chatData.host = Number(hostid);

			const output = await newChat(chatData);

			await broadcastChatListToAll();

			logInfo("{chat} [200] chat creata con successo");
			return reply.status(200).send({ message: 'chat creata con successo' });
		} catch (err) {

			/* #debug */
			console.log('Error', err);

			if (err instanceof Error)
				return reply.status((err as any).statusCode).send({ error: err.message });
			logError("{chat} [500] errore interno del server");
			return reply.status(500).send({ error: "Internal server error" });
		}
	});

	// Endpoint per mandare messaggi
	fastify.post("/new-message", async (request, reply) => {
		try {
			const msg = request.body as NewMessage;
			if (!msg || !msg.message || !msg.chatId/*  || !msg.linkId */)
				throw new BadRequest('request non valida', 'chat');

			// get the host id automatically
			const linkid = request.headers['x-user-id'];
			if (!linkid) throw new Unauthorized("Missing user-id", "chat");

			// add it to chatData
			msg.linkId = Number(linkid);

			// creates new message
			await newMessage(msg);

			// INVIA LA LISTA AGGIORNATA DEI MESSAGGI A TUTTI I CLIENT DELLA CHAT
			const chatId = msg.chatId;
			const messageArray = [chatId, 0, msg.linkId];
			const output = await listChatMessage(messageArray);

			await broadcastMessageListToAll();
			await broadcastChatListToAll();

			logInfo("{chat} [200] messaggio inviato con successo");
			return reply.status(200).send({ message: "messaggio inviato con successo" });
		} catch (err) {

			/* #debug */
			console.log('Error', err);

			if (err instanceof Error)
				return reply.status((err as any).statusCode).send({ status: "error", error: err.message });
			logError("{chat} [500] errore interno del server");
			return reply.status(500).send({ status: "error", error: "Internal server error" });
		}
	});

	// Endpoint POST per eliminare tutti i messaggi di una chat
	fastify.post("/delete-chat-messages", async (request, reply) => {
		const { chatId } = request.body as { chatId?: string | number };
		try {
			if (!chatId) 
				throw new BadRequest('id chat non fornito', 'chat');
			const id = typeof chatId === "string" ? parseInt(chatId, 10) : chatId;
			if (isNaN(id))
				throw new BadRequest("Invalid ID", 'chat');
			await deleteChatMessages(id);

			await broadcastChatListToAll();

			logInfo(`{chat} [200] messages deleted from chat ${id}\n`);
			return reply.status(200).send({ message: `messages deleted from chat ${id}\n` });
		} catch (err) {
			if (err instanceof Error)
				return reply.status((err as any).statusCode).send({ error: err.message });
			logError("{chat} [500] errore interno del server");
			return reply.status(500).send({ error: "Internal server error" });
		}
	});

	// Endpoint POST per eliminare una chat e i suoi collegamenti
	fastify.post("/delete-chat", async (request, reply) => {
		const { chatId } = request.body as { chatId?: string | number };
		try {
			if (!chatId)
				throw new BadRequest('id chat non fornito', 'chat');
			const id = typeof chatId === "string" ? parseInt(chatId, 10) : chatId;
			if (isNaN(id))
				throw new BadRequest("Invalid ID", 'chat');

			await deleteChat(id);
			await broadcastChatListToAll();

			logInfo(`{chat} [200] chat ${id} eliminata`);
			return reply.status(200).send({ message: `chat ${id} eliminata` });
		} catch (err) {
			if (err instanceof Error)
				return reply.status((err as any).statusCode).send({ error: err.message });
			logError("{chat} [500] errore interno del server");
			return reply.status(500).send({ error: "Internal server error" });
		}
	});

	// Endpoint POST per eliminare un messaggio
	fastify.post("/delete-message", async (request, reply) => {
		const { messageId } = request.body as { messageId?: string | number };
		try {
			if (!messageId)
				throw new BadRequest('id messaggio non fornito', 'chat');
			const id = typeof messageId === "string" ? parseInt(messageId, 10) : messageId;
			if (isNaN(id))
				throw new BadRequest("Invalid ID", 'chat');
			await deleteMessage(id);

			await broadcastChatListToAll();

			logInfo(`{chat} [200] message deleted from chat ${id}\n`);
			return reply.status(200).send({ message: `message deleted from chat ${id}\n` });
		} catch (err) {
			if (err instanceof Error)
				return reply.status((err as any).statusCode).send({ error: err.message });
			logError("{chat} [500] errore interno del server");
			return reply.status(500).send({ error: "Internal server error" });
		}
	});
	
		// Endpoint POST ricercare i messaggi
		fastify.post("/search-message", async (request, reply) => {
			const { srcMess } = request.body as { srcMess?: string | number };
			try {
				if (!srcMess)
					throw new BadRequest('dati per la ricerca non forniti', 'chat');
				const output = await searchMessage(srcMess.toString());

				logInfo("{chat} [201] messaggio trovato");
				return reply.status(201).send({ reply: output, message: 'messaggio trovato' });
			} catch (err) {
				if (err instanceof Error)
					return reply.status((err as any).statusCode).send({ error: err.message });
				logError("{chat} [500] errore interno del server");
				return reply.status(500).send({ error: "Internal server error" });
			}
		});

	// Endpoint POST ricercare le chat
	fastify.post("/search-chat", async (request, reply) => {
		const chatData = request.body as SrcChat;
		try {
			if (!chatData)
				throw new BadRequest('dati epr la ricerca non forniti', 'chat');
			const output = await searchChat(chatData);

			logInfo("{chat} [201] chat trovata");
			return reply.status(201).send({ reply: output, message: 'chat trovata' });
		} catch (err) {
			if (err instanceof Error)
				return reply.status((err as any).statusCode).send({ error: err.message });
			logError("{chat} [500] errore interno del server");
			return reply.status(500).send({ error: "Internal server error" });
		}
	});

	// Endpoint POST ricercare i messaggi
	fastify.post("/block-user", async (request, reply) => {
		const { users } = request.body as { users: number[] };
		try {
			if (!users)
				throw new BadRequest('user non fornito', 'chat');
			const output = await blockUser(users);

			logInfo(`{chat} [200] `+ output);
			return reply.status(200).send({ message: output });
		} catch (err) {
			if (err instanceof Error)
				return reply.status((err as any).statusCode).send({ error: err.message });
			logError("{chat} [500] errore interno del server");
			return reply.status(500).send({ error: "Internal server error" });
		}
	});

	// Endpoint POST ricercare i messaggi
	fastify.post("/sblock-user", async (request, reply) => {
		const { users } = request.body as { users: number[] };
		try {
			if (!users)
				throw new BadRequest('user non fornito', 'chat');
			const output = await sblockUser(users);

			logInfo(`{chat} [200] `+ output);
			return reply.status(200).send({ message: output });
		} catch (err) {
			if (err instanceof Error)
				return reply.status((err as any).statusCode).send({ error: err.message });
			logError("{chat} [500] errore interno del server");
			return reply.status(500).send({ error: "Internal server error" });
		}
	});
}
