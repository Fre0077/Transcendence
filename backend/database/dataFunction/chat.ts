import { PrismaClient as chatPrismaClient } from "../prisma/generate/chat"
const chatPrisma = new chatPrismaClient()

import { newChat, newMessage, srcChat } from "../../classes/classes";
import { fastify } from "../server";

//aggiunta del messaggio al database
export async function handleMessage(input: newMessage): Promise<string> {
	if (input.message.toString().trim() === '') {
		fastify.log.info('No message text provided');
		throw new Error('No message text provided');
	}

	// ricerca dello user e della chat
	const findUser = await chatPrisma.user.findUnique({ where: { linkId: input.userId }, include: { blockedUsers: true, blockedBy: true } });
	if (!findUser) {
		fastify.log.info(`user with ID ${input.userId} does not exist`);
		throw new Error(`user with ID ${input.userId} does not exist`);
	}
	const findChat = await chatPrisma.chats.findUnique({ where: { chatId: input.chatId }, include: { users: true, host: true } });
	if (!findChat) {
		fastify.log.info(`chat with ID ${input.chatId} does not exist`);
		throw new Error(`chat with ID ${input.chatId} does not exist`);
	}

	// Trova tutti gli userId partecipanti alla chat (escludendo chi invia)
	const otherUserIds = findChat.users
		.filter(u => u.linkId !== input.userId)
		.map(u => u.userId);
	if (findChat.host && findChat.host.linkId !== input.userId) {
		otherUserIds.push(findChat.host.userId);
	}

	// Controlla se uno degli altri utenti ha bloccato chi invia, o viceversa
	for (const otherUserId of otherUserIds) {
		// L'utente che invia ha bloccato l'altro?
		if (findUser.blockedUsers.some(u => u.userId === otherUserId)) {
			fastify.log.info(`User ${input.userId} has blocked user ${otherUserId}`);
			throw new Error(`You have blocked a participant in this chat`);
		}
		// L'altro ha bloccato chi invia?
		const otherUser = await chatPrisma.user.findUnique({ where: { userId: otherUserId }, include: { blockedUsers: true } });
		if (otherUser && otherUser.blockedUsers.some(u => u.userId === findUser.userId)) {
			fastify.log.info(`User ${otherUserId} has blocked user ${input.userId}`);
			throw new Error(`You are blocked by a participant in this chat`);
		}
	}

	//creazione del nuovo messaggio
	await chatPrisma.messages.create({
		data: {
			chat: { connect: { chatId: findChat.chatId } },
			user: { connect: { linkId: findUser.linkId } },
			message: input.message.toString(),
			date: new Date()
		}
	});

	fastify.log.info('Message saved');
	return 'Messaggio salvato.'
}

//ricerca tutti i messaggi apperteneti ad una chat
export async function listChatMessage(input: number[]): Promise<string> {
	if (!Array.isArray(input) || input.length < 2) {
		fastify.log.info('Input must be an array: [chatId, startIndex, userId]');
		throw new Error('Input must be an array: [chatId, startIndex, userId]');
	}
	const chatId = input[0];
	const startIndex = input[1];
	const userId = input[2];

	// Controlla che l'utente esista
	const user = await chatPrisma.user.findUnique({ where: { userId }, include: { blockedUsers: true, blockedBy: true } });
	if (!user) {
		fastify.log.info(`User with ID ${userId} does not exist`);
		throw new Error(`User with ID ${userId} does not exist`);
	}

	// Trova tutti gli altri utenti della chat
	const chat = await chatPrisma.chats.findUnique({ where: { chatId }, include: { users: true, host: true } });
	if (!chat) {
		fastify.log.info(`Chat with ID ${chatId} does not exist`);
		throw new Error(`Chat with ID ${chatId} does not exist`);
	}
	const otherUserIds = chat.users
		.filter(u => u.userId !== userId)
		.map(u => u.userId);
	if (chat.host && chat.host.userId !== userId) {
		otherUserIds.push(chat.host.userId);
	}

	// Controlla se uno degli altri utenti ha bloccato chi richiede, o viceversa
	for (const otherUserId of otherUserIds) {
		if (user.blockedUsers.some(u => u.userId === otherUserId)) {
			fastify.log.info(`User ${userId} has blocked user ${otherUserId}`);
			throw new Error(`You have blocked a participant in this chat`);
		}
		const otherUser = await chatPrisma.user.findUnique({ where: { userId: otherUserId }, include: { blockedUsers: true } });
		if (otherUser && otherUser.blockedUsers.some(u => u.userId === user.userId)) {
			fastify.log.info(`User ${otherUserId} has blocked user ${userId}`);
			throw new Error(`You are blocked by a participant in this chat`);
		}
	}

	//ricerca dei messaggi
	const messages = await chatPrisma.messages.findMany({
		where: { chatId },
		orderBy: { date: 'desc' },
		skip: startIndex,
		take: 100,
		select: {
			id: true,
			userId: true,
			message: true,
			date: true
		}
	});

	fastify.log.info('Message list returned');
	return JSON.stringify(messages);
}

//cancella tutti i messaggi di una specifica chat
export async function deletemessages(input: number) {
	await chatPrisma.messages.deleteMany({ where: { chat: { chatId: input } } })
	fastify.log.info('Chat deleted');
}

//cancella il messaggio indicato
export async function deletemessage(input: number) {
	await chatPrisma.messages.deleteMany({ where: { id: input } })
	fastify.log.info(`Message deleted`);
}

//creazione di una nuova chat
export async function createChat(input: newChat): Promise<string> {
	//controllo input
	if (input.chatName.toString().trim() === '') {
		fastify.log.info(`no chat name provided`);
		throw new Error(`no chat name provided`);
	}

	//ricerca host e members
	const host = await chatPrisma.user.findUnique({ where: { username: input.host.toString() } });
	if (!host) {
		fastify.log.info(`Host user "${input.host}" does not exist`);
		throw new Error(`Host user "${input.host}" does not exist`);
	}
	const memberUsers = [];
	for (const memberName of input.members) {
		if (memberName === input.host) continue;
		const user = await chatPrisma.user.findUnique({ where: { username: memberName.toString() } });
		if (!user) {
			fastify.log.info(`Member user "${memberName}" does not exist`);
			throw new Error(`Member user "${memberName}" does not exist`);
		}
		memberUsers.push(user);
	}

	//creazione della chat
	await chatPrisma.chats.create({
		data: {
			name: input.chatName.toString(),
			hostId: host.userId,
			users: {
				connect: memberUsers.map(u => ({ userId: u.userId }))
			}
		}
	});

	fastify.log.info(`Chat created successfully`);
    return 'Chat created successfully';
}

//ricerca delle chat  a cui uno user appartiene
export async function userChatList(input: number): Promise<string> {
	//ricerca dello user
	const user = await chatPrisma.user.findUnique({
		where: { userId: input },
		include: { members: true }
	});
	if (!user) {
		fastify.log.info(`User with userId '${input}' does not exist`);
		throw new Error(`User with userId '${input}' does not exist`);
	}

	//ricerca delle chat
	const chats = await chatPrisma.chats.findMany({
		where: {
			OR: [
				{ users: { some: { userId: user.userId } } },
				{ host: { userId: user.userId } }
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

	fastify.log.info('Chat list returned');
	return JSON.stringify(result);
}

//lista degli user
export async function userList(input: string): Promise<string> {
	//controllo input
	if (!input || input.trim() === '') {
        fastify.log.info('Input string is empty')
        throw new Error('Input string is empty')
    }
    const username = input.trim();

    const userList = await chatPrisma.user.findMany({ 
        where: { 
            username: { not: username } 
        },
        select: {
            userId: true,
            linkId: true,
            username: true
        }
    })

	fastify.log.info('User list returned');
    return JSON.stringify(userList)
}

//ricerca di un messaggio in una chat
export async function searchMessage(input: string): Promise<string> {
	//controllo input
	if (!input || input.trim() === '') {
        fastify.log.info('Input string is empty');
        throw new Error('Input string is empty');
    }
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
            userId: true,
            chatId: true,
            message: true,
            date: true,
        },
    });

	fastify.log.info('Message found');
    return JSON.stringify(messageList);
}

//ricerca delle chat di uno user
export async function searchChat(input: srcChat): Promise<string> {
	// Controllo input
	if (!input || !input.chatName || input.chatName.trim() === '' || !input.userId) {
		fastify.log.info('Input string or userId is empty');
		throw new Error('Input string or userId is empty');
	}
	const searchText = input.chatName.trim();

	// Cerca le chat a cui l'utente appartiene e che contengono la stringa nel nome
	const chatList = await chatPrisma.chats.findMany({
		where: {
			AND: [
				{
					OR: [
						{ users: { some: { userId: input.userId } } },
						{ hostId: input.userId }
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

	fastify.log.info('Chat found');
	return JSON.stringify(chatList);
}

//blocca lo user indicato
export async function blockUser(input: number[]): Promise<string> {
	if (!Array.isArray(input) || input.length !== 2) {
		fastify.log.info('Input must be [blockerUserId, blockedUserId]');
		throw new Error('Input must be [blockerUserId, blockedUserId]');
	}
	const [blockerUserId, blockedUserId] = input;

	// Controlla che entrambi gli utenti esistano
	const blocker = await chatPrisma.user.findUnique({ where: { userId: blockerUserId } });
	const blocked = await chatPrisma.user.findUnique({ where: { userId: blockedUserId } });
	if (!blocker || !blocked) {
		fastify.log.info('One or both users do not exist');
		throw new Error('One or both users do not exist');
	}

	// Aggiorna la relazione blockedUsers
	await chatPrisma.user.update({
		where: { userId: blockerUserId },
		data: {
			blockedUsers: {
				connect: { userId: blockedUserId }
			}
		}
	});

	fastify.log.info(`User ${blockedUserId} blocked by ${blockerUserId}`);
	return `User ${blockedUserId} blocked by ${blockerUserId}`;
}

//sblocca una user bloccato
export async function FreeUser(input: number[]): Promise<string> {
	if (!Array.isArray(input) || input.length !== 2) {
		fastify.log.info('Input must be [blockerUserId, blockedUserId]');
		throw new Error('Input must be [blockerUserId, blockedUserId]');
	}
	const [blockerUserId, blockedUserId] = input;

	// Controlla che entrambi gli utenti esistano
	const blocker = await chatPrisma.user.findUnique({ where: { userId: blockerUserId } });
	const blocked = await chatPrisma.user.findUnique({ where: { userId: blockedUserId } });
	if (!blocker || !blocked) {
		fastify.log.info('One or both users do not exist');
		throw new Error('One or both users do not exist');
	}

	// Aggiorna la relazione blockedUsers
	await chatPrisma.user.update({
		where: { userId: blockerUserId },
		data: {
			blockedUsers: {
				disconnect: { userId: blockedUserId }
			}
		}
	});

	fastify.log.info(`User ${blockedUserId} unblocked by ${blockerUserId}`);
	return `User ${blockedUserId} unblocked by ${blockerUserId}`;
}
