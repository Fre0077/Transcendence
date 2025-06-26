import { PrismaClient as chatPrismaClient } from "./prisma/generate/chat"
const chatPrisma = new chatPrismaClient()

import { newChat } from "../classes/classes";

//crea un nuovo messaggio a partire dalla chat da dove è stato mandato e dallo user
export async function handleMessage(input: string): Promise<string> {
	if (!input || input.trim() === '') {
		throw new Error('Input string is empty')
	}

	//divisione degli argomenti
	const lines = input.split('\n').map(line => line.trim()).filter(line => line !== '')
	if (lines.length < 2) {
		throw new Error('Input must contain at least a user, a chat and a message')
	}

	//conversione degli argomenti che ne necessitano
	const user = parseInt(lines[0], 10)
	if (isNaN(user))	throw new Error('Host ID must be a number')
	const chat = parseInt(lines[1], 10)
	if (isNaN(chat))	throw new Error('Host ID must be a number')
	
	//ricerca dello user e della chat
	const findUser = await chatPrisma.user.findUnique({ where: { linkId: user } })
	if (!findUser) {
		throw new Error(`user with ID ${user} does not exist`)
	}
	const findChat = await chatPrisma.chats.findUnique({ where: { chatId: chat } })
	if (!findChat) {
		throw new Error(`chat with ID ${chat} does not exist`)
	}

	//creazione del nuovo messaggio
	await chatPrisma.messages.create({
		data: {
			chat: { connect: { chatId: findChat.chatId } },
			user: { connect: { linkId: findUser.linkId } },
			message: input,
			date: new Date()}
	})
	return 'Messaggio salvato.'
}

export async function listMessage(input: number[]): Promise<string> {
    if (!Array.isArray(input) || input.length < 2) {
		console.log('Input must be an array: [chatId, startIndex]')
        throw new Error('Input must be an array: [chatId, startIndex]');
    }
    const chatId = input[0];
    const startIndex = input[1];

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

//crea una nuova chat a partire da user e membri e namechat
export async function createChat(input: newChat): Promise<string> {
    // 1. Controllo che il nome della chat non esista già
    console.log(input.chatName.toString());
    const existingChat = await chatPrisma.chats.findUnique({ where: { name: input.chatName.toString() } });
    console.log(input.chatName.toString());
	if (existingChat) {
		console.log(`A chat with the name "${input.chatName}" already exists`);
        throw new Error(`A chat with the name "${input.chatName}" already exists`);
    }
    // 2. Trova l'host tramite nome (o id se preferisci)
    const host = await chatPrisma.user.findUnique({ where: { name: input.host.toString() } });
    if (!host) {
		console.log(`Host user "${input.host}" does not exist`);
        throw new Error(`Host user "${input.host}" does not exist`);
    }

    // 3. Trova tutti i membri (escludendo l'host se presente)
    const memberUsers = [];
    for (const memberName of input.members) {
        if (memberName === input.host) continue; // evita di aggiungere l'host come membro
        const user = await chatPrisma.user.findUnique({ where: { name: memberName.toString() } });
        if (!user) {
			console.log(`Member user "${memberName}" does not exist`);
            throw new Error(`Member user "${memberName}" does not exist`);
        }
        memberUsers.push(user);
    }

    // 4. Crea la chat con host e membri
    await chatPrisma.chats.create({
        data: {
            name: input.chatName.toString(),
            hostId: host.userId, // Use hostId instead of host relation
            users: {
                connect: memberUsers.map(u => ({ userId: u.userId }))
            }
        }
    });

    return 'Chat created successfully';
}

export async function userChatList(input: string): Promise<string> {
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
