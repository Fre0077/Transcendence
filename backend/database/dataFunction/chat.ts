import { PrismaClient as chatPrismaClient } from "../prisma/generate/chat"
const chatPrisma = new chatPrismaClient()

import { newChat, newMessage } from "../../classes/classes";

//aggiunta del messaggio al database
export async function handleMessage(input: newMessage): Promise<string> {
	if (input.message.toString().trim() === '') {
		console.log('No message text provided');
        throw new Error('No message text provided');
    }

	//ricerca dello user e della chat
	const findUser = await chatPrisma.user.findUnique({ where: { linkId: input.userId } })
	if (!findUser) {
		throw new Error(`user with ID ${input.userId} does not exist`)
	}
	const findChat = await chatPrisma.chats.findUnique({ where: { chatId: input.userId } })
	if (!findChat) {
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
	return 'Messaggio salvato.'
}

//ricerca tutti i messaggi apperteneti ad una chat
export async function listChatMessage(input: number[]): Promise<string> {
	//controllo per l'input
    if (!Array.isArray(input) || input.length < 2) {
		console.log('Input must be an array: [chatId, startIndex]')
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

    return JSON.stringify(messages);
}

//cancella tutti i messaggi di una specifica chat
export async function deletemessages(input: number) {
	await chatPrisma.messages.deleteMany({ where: { chat: { chatId: input } } })
}

//creazione di una nuova chat
export async function createChat(input: newChat): Promise<string> {
	//controllo input
	if (input.chatName.toString().trim() === '') {
		console.log(`no chat name provided`);
        throw new Error(`no chat name provided`);
    }
	
	//ricerca host e controllo per nome chat univoco
    const existingChat = await chatPrisma.chats.findUnique({ where: { name: input.chatName.toString() } });
	if (existingChat) {
		console.log(`A chat with the name "${input.chatName}" already exists`);
        throw new Error(`A chat with the name "${input.chatName}" already exists`);
    }
    const host = await chatPrisma.user.findUnique({ where: { name: input.host.toString() } });
    if (!host) {
		console.log(`Host user "${input.host}" does not exist`);
        throw new Error(`Host user "${input.host}" does not exist`);
    }
    const memberUsers = [];
    for (const memberName of input.members) {
        if (memberName === input.host) continue;
        const user = await chatPrisma.user.findUnique({ where: { name: memberName.toString() } });
        if (!user) {
			console.log(`Member user "${memberName}" does not exist`);
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

    return 'Chat created successfully';
}

//ricerca delle chat  a cui uno user appartiene
export async function userChatList(input: string): Promise<string> {
	//controllo input
	if (!input || input.trim() === '') {
		console.log('Input string is empty')
		throw new Error('Input string is empty')
	}
	const username = input.trim();
	const user = await chatPrisma.user.findFirst({
		where: { name: username },
		include: { members: true }
	})
	if (!user) {
		console.log(`User with username '${username}' does not exist`)
		throw new Error(`User with username '${username}' does not exist`)
	}
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
	})
	const result = chats.map(chat => ({
		chatId: chat.chatId,
		name: chat.name
	}))
	return JSON.stringify(result)
}

export async function userList(input: string): Promise<string> {
	if (!input || input.trim() === '') {
        console.log('Input string is empty')
        throw new Error('Input string is empty')
    }
    const username = input.trim();
    const userList = await chatPrisma.user.findMany({ 
        where: { 
            name: { not: username } 
        },
        select: {
            userId: true,
            linkId: true,
            name: true
        }
    })
    return JSON.stringify(userList)
}
