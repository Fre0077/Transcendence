import { PrismaClient as chatPrismaClient } from "../database/generate/chat"
const chatPrisma = new chatPrismaClient()

import { BadRequest, NotFound, Unauthorized } from "../utils/exception";
import { NewChat, NewMessage, SrcChat } from "../utils/interface";
import { logInfo } from "../utils/logger";
import { fastify } from "../server";
import jwt from "jsonwebtoken";

//ritorna la lista degli user
export async function userList(linkId: number): Promise<string> {
	const userList = await chatPrisma.user.findMany({ 
		where: { 
			linkId: { not: linkId } 
		},
		select: {
			linkId: true,
			username: true
		}
	})

	return JSON.stringify(userList)
}

interface ChatUser {
	linkId:number,
	username:string | null,
}

// ritorna la lista degli user in una chat
export async function userInChat(chatId: number): Promise<ChatUser[] | undefined> {
	const userList = await chatPrisma.chats.findFirst({ 
		where: { chatId: chatId },
		select: {
			users: true,
			host: true
		}
	});

	const users = userList?.users;
	if (!users)
		return userList?.host ? [userList?.host] : undefined;
	users?.push(userList?.host);
	return users;
}

//ricerca delle chat  a cui uno user appartiene
export async function chatList(linkId: number): Promise<string> {
	//ricerca dello user
	const user = await chatPrisma.user.findUnique({
		where: { linkId: linkId },
		include: { members: true }
	});
	if (!user)
		throw new NotFound(`User with linkId '${linkId}' does not exist`, "chat");

	//ricerca delle chat
	const chats = await chatPrisma.chats.findMany({
		where: {
			OR: [
				{ users: { some: { linkId: linkId } } },
				{ host: { linkId: linkId } }
			]
		},
		select: {
			chatId: true,
			name: true,
			lastAccessed: true
		},
		orderBy: {
			lastAccessed: 'desc'
		}
	});
	const result = chats.map(chat => ({
		chatId: chat.chatId,
		name: chat.name
	}));

	return JSON.stringify(result);
}

/* @topiana- funzione che ritorna un array di chatId */
export async function chatIdList(linkId: number): Promise<{ chatId:number }[]> {
	//ricerca dello user
	const user = await chatPrisma.user.findUnique({
		where: { linkId: linkId },
		include: { members: true }
	});
	if (!user)
		throw new NotFound(`User with linkId '${linkId}' does not exist`, "chat");

	//ricerca delle chat
	const chats = await chatPrisma.chats.findMany({
		where: {
			OR: [
				{ users: { some: { linkId: linkId } } },
				{ host: { linkId: linkId } }
			]
		},
		select: {
			chatId: true,
		},

	});

	return chats;
}

//ricerca tutti i messaggi apperteneti ad una chat
export async function messageList(input: number[]): Promise<string> {
	if (!Array.isArray(input) || input.length < 2)
		throw new BadRequest('Input must be an array: [chatId, startIndex, linkId]', "chat");

	const chatId = input[0];
	const startIndex = input[1];
	const linkId = input[2];

	// Controlla che l'utente esista
	const user = await chatPrisma.user.findUnique({ where: { linkId: linkId }, include: { blockedUsers: true, blockedBy: true } });
	if (!user)
		throw new NotFound(`User with linkID ${linkId} does not exist`, "chat");

	// Trova tutti gli altri utenti della chat
	const chat = await chatPrisma.chats.findUnique({ where: { chatId }, include: { users: true, host: true } });
	if (!chat)
		throw new NotFound(`Chat with chatID ${chatId} does not exist`, "chat");
	
	const otherlinkIds = chat.users
		.filter(u => u.linkId !== linkId)
		.map(u => u.linkId);
	if (chat.host && chat.host.linkId !== linkId)
		otherlinkIds.push(chat.host.linkId);

	// Controlla se uno degli altri utenti ha bloccato chi richiede, o viceversa
	for (const otherlinkId of otherlinkIds) {
		if (user.blockedUsers.some(u => u.linkId === otherlinkId))
			throw new Unauthorized(`You have blocked a participant in this chat`, "chat");
		
		const otherUser = await chatPrisma.user.findUnique({ where: { linkId: otherlinkId }, include: { blockedUsers: true } });
		if (otherUser && otherUser.blockedUsers.some(u => u.linkId === user.linkId)) 
			throw new Unauthorized(`You are blocked by a participant in this chat`, "chat");
	}

	//ricerca dei messaggi
	const messages = await chatPrisma.messages.findMany({
		where: { chatId },
		orderBy: { date: 'desc' },
		skip: startIndex,
		take: 100,
		select: {
			id: true,
			linkId: true,
			message: true,
			date: true
		}
	});
	return JSON.stringify(messages);
}

// @topiana- greasy hands
interface Message {
	linkId: number,
	id: number,
	message:
	string,
	date: Date,
}

//ricerca tutti i messaggi apperteneti ad una chat
export async function singleMessage(input: number[]): Promise<Message | null> {
	if (!Array.isArray(input) || input.length < 2)
		throw new BadRequest('Input must be an array: [chatId, linkId]', "chat");

	const chatId = input[0];
 	const linkId = input[1];

	// Controlla che l'utente esista
	const user = await chatPrisma.user.findUnique({ where: { linkId: linkId }, include: { blockedUsers: true, blockedBy: true } });
	if (!user)
		throw new NotFound(`User with linkID ${linkId} does not exist`, "chat");

	// Trova tutti gli altri utenti della chat
	const chat = await chatPrisma.chats.findUnique({ where: { chatId }, include: { users: true, host: true } });
	if (!chat)
		throw new NotFound(`Chat with chatID ${chatId} does not exist`, "chat");
	
	const otherlinkIds = chat.users
		.filter(u => u.linkId !== linkId)
		.map(u => u.linkId);
	if (chat.host && chat.host.linkId !== linkId)
		otherlinkIds.push(chat.host.linkId);

	// Controlla se uno degli altri utenti ha bloccato chi richiede, o viceversa
	for (const otherlinkId of otherlinkIds) {
		if (user.blockedUsers.some(u => u.linkId === otherlinkId))
			throw new Unauthorized(`You have blocked a participant in this chat`, "chat");
		
		const otherUser = await chatPrisma.user.findUnique({ where: { linkId: otherlinkId }, include: { blockedUsers: true } });
		if (otherUser && otherUser.blockedUsers.some(u => u.linkId === user.linkId)) 
			throw new Unauthorized(`You are blocked by a participant in this chat`, "chat");
	}

	//ricerca dei messaggi
	const message = await chatPrisma.messages.findFirst({
		where: { chatId },
		orderBy: { date: 'desc' },
		select: {
			id: true,
			linkId: true,
			message: true,
			date: true
		}
	});

	return message;
}

//creazione di una nuova chat
export async function newChat(input: NewChat): Promise<number> {
	//controllo input
	if (input.chatName.toString().trim() === '')
		throw new BadRequest(`no chat name provided`, "chat");

	//ricerca host e members
	const host = await chatPrisma.user.findUnique({ where: { linkId: input.host } });
	if (!host) 
		throw new NotFound(`Host user "${input.host}" does not exist`, "chat");
	
	const memberUsers = [];
	for (const memberLinkId of input.members) {
		if (memberLinkId === input.host) continue;
		const user = await chatPrisma.user.findUnique({ where: { linkId: memberLinkId } });
		if (!user) 
			throw new NotFound(`Member user "${memberLinkId}" does not exist`, "chat");
		memberUsers.push(user);
	}

	//creazione della chat
	const newChat = await chatPrisma.chats.create({
		data: {
			name: input.chatName.toString(),
			hostId: input.host,
			users: {
				connect: memberUsers.map(u => ({ linkId: u.linkId }))
			}
		}
	});
	
	if (!newChat)
		throw new Error(`Failed to create chat`);

	return newChat.chatId;
}

//aggiunta del messaggio al database
export async function newMessage(input: NewMessage): Promise<void> {
	if (input.message.toString().trim() === '')
		throw new NotFound('No message text provided', "chat");

	const findUser = await chatPrisma.user.findUnique({ where: { linkId: input.linkId }, include: { blockedUsers: true, blockedBy: true } });
	if (!findUser)
		throw new NotFound(`user with ID ${input.linkId} does not exist`, "chat");

	const findChat = await chatPrisma.chats.findUnique({ where: { chatId: input.chatId }, include: { users: true, host: true } });
	if (!findChat) 
		throw new NotFound(`chat with ID ${input.chatId} does not exist`, "chat");

	// Trova tutti gli linkId partecipanti alla chat (escludendo chi invia)
	const otherUsers = findChat.users.filter(u => u.linkId !== input.linkId);
	if (findChat.host && findChat.host.linkId !== input.linkId)
		otherUsers.push(findChat.host);

	// Se la chat è privata (2 utenti)
	if (otherUsers.length === 1) {
		const otherUser = otherUsers[0];
		// Chi invia ha bloccato l'altro?
		if (findUser.blockedUsers.some(u => u.userId === otherUser.userId))
			throw new Unauthorized(`{chat} Hai bloccato utente ${otherUser.username}`, 'chat');

		// L'altro ha bloccato chi invia?
		const otherUserFull = await chatPrisma.user.findUnique({ where: { userId: otherUser.userId }, include: { blockedUsers: true } });
		if (otherUserFull && otherUserFull.blockedUsers.some(u => u.userId === findUser.userId))
			throw new Unauthorized(`{chat} Utente ${otherUser.username} ti ha bloccato`, 'chat');
	}

	// Se gruppo (>2 utenti) o nessun blocco, salva normalmente
	await chatPrisma.messages.create({
		data: {
			chat: { connect: { chatId: findChat.chatId } },
			user: { connect: { linkId: findUser.linkId } },
			message: input.message.toString(),
			date: new Date()
		}
	});
}

//cancella tutti i messaggi di una specifica chat
export async function deleteChatMessages(input: number) {
	await chatPrisma.messages.deleteMany({ where: { chat: { chatId: input } } })
}

//cancella una chat e tutti i suoi messaggi
export async function deleteChat(input: number) {
	if (!input || Number.isNaN(input))
		throw new BadRequest('Invalid chatId provided', 'chat');

	const chat = await chatPrisma.chats.findUnique({ where: { chatId: input }, include: { users: true } });
	if (!chat)
		throw new NotFound(`Chat with chatID ${input} does not exist`, 'chat');

	// Remove messages, detach members, then remove the chat
	await chatPrisma.$transaction([
		chatPrisma.messages.deleteMany({ where: { chatId: input } }),
		chatPrisma.chats.update({ where: { chatId: input }, data: { users: { set: [] } } }),
		chatPrisma.chats.delete({ where: { chatId: input } })
	]);
}

//cancella il messaggio indicato
export async function deleteMessage(input: number) {
	await chatPrisma.messages.deleteMany({ where: { id: input } })
}

//ricerca di un messaggio in una chat
export async function searchMessage(input: string): Promise<string> {
	//controllo input
	if (!input || input.trim() === '') 
		throw new BadRequest('Stringa di input vuota', "chat");
	const searchText = input.trim();

	//ricerca dei messaggi
	const messageList = await chatPrisma.messages.findMany({
		where: {
			message: {
				contains: searchText,
			},
		},
		orderBy: {
			date: 'desc',
		},
		select: {
			id: true,
			linkId: true,
			chatId: true,
			message: true,
			date: true,
		},
	});

	return JSON.stringify(messageList);
}

//ricerca delle chat di uno user
export async function searchChat(input: SrcChat): Promise<string> {
	// Controllo input
	if (!input || !input.chatName || input.chatName.trim() === '' || !input.linkId)
		throw new BadRequest('Stringa o linkId mancante');
	const searchText = input.chatName.trim();

	// Cerca le chat a cui l'utente appartiene e che contengono la stringa nel nome
	const chatList = await chatPrisma.chats.findMany({
		where: {
			AND: [
				{
					OR: [
						{ users: { some: { linkId: input.linkId } } },
						{ hostId: input.linkId }
					]
				},
				{
					name: {
						contains: searchText,
					}
				}
			]
		},
		orderBy: {
			lastAccessed: 'desc',
		},
		select: {
			chatId: true,
			hostId: true,
			name: true,
			lastAccessed: true,
		},
	});

	return JSON.stringify(chatList);
}

//blocca lo user indicato
export async function blockUser(input: number[]): Promise<string> {
	if (!Array.isArray(input) || input.length !== 2)
		throw new BadRequest('L input deve corrisposndere a [blockerUserId, blockedUserId]', "chat");
	const [blockerUserId, blockedUserId] = input;

	// Controlla che entrambi gli utenti esistano
	const blocker = await chatPrisma.user.findUnique({ where: { userId: blockerUserId } });
	const blocked = await chatPrisma.user.findUnique({ where: { userId: blockedUserId } });
	if (!blocker || !blocked)
		throw new NotFound('One or both users do not exist', "chat");

	// Aggiorna la relazione blockedUsers
	await chatPrisma.user.update({
		where: { userId: blockerUserId },
		data: {
			blockedUsers: {
				connect: { userId: blockedUserId }
			}
		}
	});

	return `User ${blockedUserId} blocked by ${blockerUserId}`;
}

//sblocca una user bloccato
export async function sblockUser(input: number[]): Promise<string> {
	if (!Array.isArray(input) || input.length !== 2)
		throw new BadRequest('Input must be [blockerUserId, blockedUserId]', "chat");
	const [blockerUserId, blockedUserId] = input;

	// Controlla che entrambi gli utenti esistano
	const blocker = await chatPrisma.user.findUnique({ where: { userId: blockerUserId } });
	const blocked = await chatPrisma.user.findUnique({ where: { userId: blockedUserId } });
	if (!blocker || !blocked)
		throw new NotFound('One or both users do not exist', "chat");

	// Aggiorna la relazione blockedUsers
	await chatPrisma.user.update({
		where: { userId: blockerUserId },
		data: {
			blockedUsers: {
				disconnect: { userId: blockedUserId }
			}
		}
	});

	return `User ${blockedUserId} unblocked by ${blockerUserId}`;
}

//ritorna la lista degli user bloccati da uno user
export async function getBlockedUsers(linkId: number): Promise<string> {
	const user = await chatPrisma.user.findUnique({
		where: { linkId: linkId },
		include: { blockedUsers: true }
	});

	if (!user)
		throw new NotFound('User not found', "chat");

	const blockedUsers = user.blockedUsers.map(u => ({
		linkId: u.linkId,
		username: u.username
	}));

	return JSON.stringify(blockedUsers);
}




//FUNZIONI DI SUPPORTO
//ricerca tutti i messaggi apperteneti ad una chat
export async function listChatMessage(input: number[]): Promise<string> {
	if (!Array.isArray(input) || input.length < 2)
		throw new BadRequest('Input must be an array: [chatId, startIndex, userId]', "chat");

	const chatId = input[0];
	const startIndex = input[1];
	const linkId = input[2];

	// Controlla che l'utente esista
	const user = await chatPrisma.user.findUnique({ where: { linkId: linkId }, include: { blockedUsers: true, blockedBy: true } });
	if (!user)
		throw new NotFound(`User with ID ${linkId} does not exist`, "chat");

	// Trova tutti gli altri utenti della chat
	const chat = await chatPrisma.chats.findUnique({ where: { chatId }, include: { users: true, host: true } });
	if (!chat)
		throw new NotFound(`Chat with ID ${chatId} does not exist`, "chat");
	
	const otherlinkIds = chat.users
		.filter(u => u.linkId !== linkId)
		.map(u => u.linkId);
	if (chat.host && chat.host.linkId !== linkId)
		otherlinkIds.push(chat.host.linkId);

	// Controlla se uno degli altri utenti ha bloccato chi richiede, o viceversa
	for (const otherlinkId of otherlinkIds) {
		if (user.blockedUsers.some(u => u.linkId === otherlinkId))
			throw new Unauthorized(`You have blocked a participant in this chat`, "chat");
		
		const otherUser = await chatPrisma.user.findUnique({ where: { linkId: otherlinkId }, include: { blockedUsers: true } });
		if (otherUser && otherUser.blockedUsers.some(u => u.linkId === user.linkId)) 
			throw new Unauthorized(`You are blocked by a participant in this chat`, "chat");
	}

	//ricerca dei messaggi
	const messages = await chatPrisma.messages.findMany({
		where: { chatId },
		orderBy: { date: 'desc' },
		skip: startIndex,
		take: 100,
		select: {
			id: true,
			linkId: true,
			message: true,
			date: true
		}
	});

	logInfo('{chat} Message list returned');
	return JSON.stringify(messages);
}
