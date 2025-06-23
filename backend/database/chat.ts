import { PrismaClient as chatPrismaClient } from "./prisma/generate/chat"
const chatPrisma = new chatPrismaClient()

//TODO: mettere a posto il fatotr che i messaggi vengono splittati se c'è uno \n
//ordine request: user, chat, messaggio
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

//cancella tutti i messaggi di una specifica chat
export async function deletemessages(input: number) {
	await chatPrisma.messages.deleteMany({ where: { chat: { chatId: input } } })
}

//ordine request: chatname, linkid dell'host, [link id membri](divisi da \n)
//crea una nuova chat a partire da user e membri
export async function createChat(input: string): Promise<string> {
	if (!input || input.trim() === '') {
		throw new Error('Input string is empty')
	}

	//divisione degli argomenti
	const lines = input.split('\n').map(line => line.trim()).filter(line => line !== '')
	if (lines.length < 2) {
		throw new Error('Input must contain at least a chat name, a host ID and a member ID')
	}

	//conversione degli argomenti che ne necessitano
	const chatName = lines[0]
	const hostId = parseInt(lines[1], 10)
	if (isNaN(hostId))	throw new Error('Host ID must be a number')
	const memberIds = lines.slice(2).map(idStr => {
		const id = parseInt(idStr, 10)
		if (isNaN(id))	throw new Error('All member IDs must be numbers')
		return id
	})

	// Verifica che l'host ed i membri esistano
	const host = await chatPrisma.user.findUnique({ where: { linkId: hostId } })
	if (!host) {
		throw new Error(`Host with ID ${hostId} does not exist`)
	}
	const memberUsers = []
	for (const memberId of memberIds) {
		if (memberId === hostId) continue
		const user = await chatPrisma.user.findUnique({ where: { linkId: memberId } })
		if (!user) {
			throw new Error(`Member with ID ${memberId} does not exist`)
		}
		memberUsers.push(user)
	}

	// Crea la chat con host e membri
	await chatPrisma.chats.create({
		data: {
			name: chatName,
			host: { connect: { linkId: host.linkId } },
			users: {
				connect: memberUsers.map(u => ({ userId: u.userId }))
			}
		}
	})

	return 'Chat created successfully'
}
