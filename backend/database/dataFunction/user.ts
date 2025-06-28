import { PrismaClient as userPrismaClient } from "../prisma/generate/user"
const userPrisma = new userPrismaClient()
import { PrismaClient as chatPrismaClient } from "../prisma/generate/chat"
const chatPrisma = new chatPrismaClient()

import { userLogin } from "../../classes/classes"

//ordine request:stesso ordine della tabella di prisma (username = name)
export async function createUser(input: userLogin): Promise<string> {	
	//ricerca dello user e della chat
	const findUsername = await userPrisma.account.findUnique({ where: { username: input.username.toString() } })
	if (findUsername) {
		console.log(`the username ${input.username} already exist`)
		throw new Error(`the username ${input.username} already exist`)
	}
	const findEmail = await userPrisma.account.findUnique({ where: { email: input.email.toString() } })
	if (findEmail) {
		console.log(`the email ${input.email} already exist`)
		throw new Error(`the email ${input.email} already exist`)
	}

	//creazione del nuovo messaggio
	const newAccount = await userPrisma.account.create({
		data: {
			name: input.name.toString(),
			surname: input.surname.toString(),
			username: input.username.toString(),
			email: input.email.toString(),
			password: input.password.toString()}
	})
	await chatPrisma.user.create({
		data: {
			name: newAccount.username,
			linkId: newAccount.id}
	})
	return 'user created'
}

export async function loginUser(input:  userLogin): Promise<string> {
	// Controlla se esiste un account con l'email fornita
    const account = await userPrisma.account.findUnique({ where: { email: input.email.toString() } });
    if (!account) {
        console.log(`Wrong email`);
        throw new Error(`Wrong email`);
    }
    // Verifica che la password fornita corrisponda a quella dell'account trovato
    if (account.password !== input.password.toString()) {
        console.log(`Wrong password`);
		throw new Error(`Wrong password`);
    }
	return account.username
}
