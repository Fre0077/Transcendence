import type { FastifyInstance } from "fastify";
import type { RawData } from "ws";

import { PrismaClient as chatPrismaClient } from "../database/generate/chat";
const chatPrisma = new chatPrismaClient();

import { userList, chatList, messageList, newChat, newMessage, deleteChatMessages,
		deleteMessage, searchMessage, searchChat, listChatMessage, blockUser,
		sblockUser, deleteChat, getBlockedUsers } from "./function";
import { BadRequest, Unauthorized, Forbidden, NotFound, Conflict } from "../utils/exception"
import { NewChat, NewMessage, SrcChat } from "../utils/interface";
import { logError, logInfo } from "../utils/logger"
import { authMiddleware } from "./middleware";

const messClients: { [chatId: number]: Set<any> } = {};
const chatClients: any[] = [];

// Funzione di broadcast per la chat-list
async function broadcastChatListToAll() {
    for (const { connection, userId } of chatClients) {
		const chats = await chatList(userId);
		connection.send(JSON.stringify({ chats }));
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

			await broadcastChatListToAll();

			logInfo("{chat} [201] file inviati con successo");
			return reply.status(201).send({ reply: output, message: 'file inviati con successo' });
		} catch (err) {
			if (err instanceof Error)
				return reply.status((err as any).statusCode).send({ error: err.message });
			logError("{chat} [500] errore interno del server");
			return reply.status(500).send({ error: "Internal server error" });
		}
	});

	// Endpoint WebSocket per ottenere la lista delle chat di uno user
	fastify.get("/chat-list", { websocket: true }, (connection: any, req) => {
		let currentUserId: number | null = null;

		connection.on('message', async (rawMessage: RawData) => {
			try {
				const userId = Number(rawMessage.toString());
				if (isNaN(userId)) {
					connection.send(JSON.stringify({ error: "Invalid userId" }));
					return;
				}
				currentUserId = userId;
				chatClients.push({ connection, userId });

				const output = await chatList(userId);
				logInfo('{chat} Chat list returned');
				connection.send(JSON.stringify({ chats: output, message: 'Chat list returned' }));
			} catch (err) {
				logError("{chat} [500] errore interno del server");
				connection.send(
					JSON.stringify({
						error: err instanceof Error ? err.message : "Internal server error",
						statusCode: err instanceof Error ? (err as any).statusCode : 500,
					})
				);
			}
		});

		connection.on('close', () => {
			const idx = chatClients.indexOf(connection);
			if (idx !== -1) chatClients.splice(idx, 1);
		});
	});

	// Endpoint WebSocket per ottenere gli ultimi 100 messaggi a partire da un certo indice
	fastify.get("/message-list", { websocket: true }, (connection: any, req) => {
		let currentChatId: number | null = null;

		connection.on('message', async (rawMessage: RawData) => {
			try {
				const { message } = JSON.parse(rawMessage.toString()) as { message?: number[] };
				if (!message || !Array.isArray(message)) {
					connection.send(JSON.stringify({ error: "Invalid index array provided" }));
					return;
				}
				currentChatId = message[0];
				// Registra il client nella chat
				if (!messClients[currentChatId]) messClients[currentChatId] = new Set();
				messClients[currentChatId].add(connection);

				const output = await messageList(message);

				logInfo('{chat} lista dei messaggi ritornati con successo');
				connection.send(JSON.stringify({ reply: output }));
			} catch (err) {
				logError("{chat} [500] errore interno del server");
				connection.send(
					JSON.stringify({
						error: err instanceof Error ? err.message : "Internal server error",
						statusCode: err instanceof Error ? (err as any).statusCode : 500,
					})
				);
			}
		});

		connection.on('close', () => {
			if (currentChatId && messClients[currentChatId]) {
				messClients[currentChatId].delete(connection);
			}
		});
	});

	// Endpoint POST per creare una nuova chat
	fastify.post("/new-chat", async (request, reply) => {
		const chatData = request.body as NewChat;
		try {
			if (!chatData)
				throw new BadRequest("Missing chat info", "chat");
			const output = await newChat(chatData);

			await broadcastChatListToAll();

			logInfo("{chat} [200] chat creata con successo");
			return reply.status(200).send({ message: 'chat creata con successo' });
		} catch (err) {
			if (err instanceof Error)
				return reply.status((err as any).statusCode).send({ error: err.message });
			logError("{chat} [500] errore interno del server");
			return reply.status(500).send({ error: "Internal server error" });
		}
	});

	// Endpoint per ricevere messaggi
	fastify.post("/new-message", async (request, reply) => {
		try {
			const msg = request.body as NewMessage;
			if (!msg || !msg.message || !msg.chatId || !msg.linkId)
				throw new BadRequest('request non valida', 'chat');
			await newMessage(msg);

			// INVIA LA LISTA AGGIORNATA DEI MESSAGGI A TUTTI I CLIENT DELLA CHAT
			const chatId = msg.chatId;
			const messageArray = [chatId, 0, msg.linkId];
			const output = await listChatMessage(messageArray);

			await broadcastChatListToAll();

			if (messClients[chatId]) {
				for (const conn of messClients[chatId]) {
					try {
						conn.send(JSON.stringify({ reply: output }));
					} catch (err) {
						messClients[chatId].delete(conn);
					}
				}
			}

			logInfo("{chat} [200] messaggio inviato con successo");
			return reply.status(200).send({ message: "messaggio inviato con successo" });
		} catch (err) {
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
			delete messClients[id];
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
	
	// Endpoint GET per ottenere la lista degli user bloccati
	fastify.post("/blocked-users", async (request, reply) => {
		const { linkId } = request.body as { linkId?: number };
		try {
			if (!linkId)
				throw new BadRequest('linkId non fornito', 'chat');
			const output = await getBlockedUsers(linkId);

			logInfo(`{chat} [200] lista user bloccati inviata`);
			return reply.status(200).send({ reply: output });
		} catch (err) {
			if (err instanceof Error)
				return reply.status((err as any).statusCode).send({ error: err.message });
			logError("{chat} [500] errore interno del server");
			return reply.status(500).send({ error: "Internal server error" });
		}
	});
}
