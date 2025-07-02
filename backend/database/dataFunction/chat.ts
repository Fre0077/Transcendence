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

	//ricerca dello user e della chat
	const findUser = await chatPrisma.user.findUnique({ where: { linkId: input.userId } })
	if (!findUser) {
		fastify.log.info('user with ID ${input.userId} does not exist');
		throw new Error(`user with ID ${input.userId} does not exist`)
	}
	const findChat = await chatPrisma.chats.findUnique({ where: { chatId: input.userId } })
	if (!findChat) {
		fastify.log.info('chat with ID ${input.chatId} does not exist');
		throw new Error(`chat with ID ${input.chatId} does not exist`)
	}

	//creazione del nuovo messaggio
	await chatPrisma.messages.create({
		data: {
			chat: { connect: { chatId: findChat.chatId } },
			user: { connect: { linkId: findUser.linkId } },
			message: input.message.toString(),
			date: new Date()}
	})

	fastify.log.info('Message saved');
	return 'Messaggio salvato.'
}

//ricerca tutti i messaggi apperteneti ad una chat
export async function listChatMessage(input: number[]): Promise<string> {
	//controllo per l'input
    if (!Array.isArray(input) || input.length < 2) {
		fastify.log.info('Input must be an array: [chatId, startIndex]')
        throw new Error('Input must be an array: [chatId, startIndex]');
    }
    const chatId = input[0];
    const startIndex = input[1];

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
