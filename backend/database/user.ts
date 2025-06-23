import { PrismaClient as userPrismaClient } from "./prisma/generate/user"
const userPrisma = new userPrismaClient()

//ordine request:stesso ordine della tabella di prisma (username = name)
export async function createUser(input: string): Promise<string> {
	if (!input || input.trim() === '') {
		throw new Error('Input string is empty')
	}

	//divisione degli argomenti
	const lines = input.split('\n').map(line => line.trim()).filter(line => line !== '')
	if (lines.length < 5) {
		throw new Error('Input must contain at least a name, a surname, a username, an email and a passowrd')
	}
	
	//ricerca dello user e della chat
	const findUsername = await userPrisma.accoutn.findUnique({ where: { username: lines[2] } })
	if (findUsername) {
		throw new Error(`the username ${lines[2]} already exist`)
	}
	const findEmail = await userPrisma.accoutn.findUnique({ where: { email: lines[3] } })
	if (findEmail) {
		throw new Error(`the email ${lines[3]} already exist`)
	}

	//creazione del nuovo messaggio
	await userPrisma.accoutn.create({
		data: {
			name: lines[0],
			surname: lines[1],
			username: lines[2],
			email: lines[3],
			password: lines[4]}
	})
	return 'user created'
}

export async function loginUser(input: string): Promise<string> {
	if (!input || input.trim() === '') {
		throw new Error('Input string is empty')
	}

	//divisione degli argomenti
	const lines = input.split('\n').map(line => line.trim()).filter(line => line !== '')
	if (lines.length < 5) {
		throw new Error('Input must contain at least a name, a surname, a username, an email and a passowrd')
	}
	
	//ricerca dello user e della chat
	const findUsername = await userPrisma.accoutn.findUnique({ where: { username: lines[2] } })
	if (findUsername) {
		throw new Error(`the username ${lines[2]} already exist`)
	}
	const findEmail = await userPrisma.accoutn.findUnique({ where: { email: lines[3] } })
	if (findEmail) {
		throw new Error(`the email ${lines[3]} already exist`)
	}
	return 'login successful'
}