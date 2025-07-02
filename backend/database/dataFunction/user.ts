import { PrismaClient as userPrismaClient } from "../prisma/generate/user"
const userPrisma = new userPrismaClient()
import { PrismaClient as chatPrismaClient } from "../prisma/generate/chat"
const chatPrisma = new chatPrismaClient()

import { userLogin } from "../../classes/classes"
import { fastify } from "../server";

//aggiunge user al databse
export async function createUser(input: userLogin): Promise<string> {	
	//ricerca dello user
	const findUsername = await userPrisma.account.findUnique({ where: { username: input.username.toString() } })
	if (findUsername) {
		fastify.log.info(`the username ${input.username} already exist`)
		throw new Error(`the username ${input.username} already exist`)
	}
	const findEmail = await userPrisma.account.findUnique({ where: { email: input.email.toString() } })
	if (findEmail) {
		fastify.log.info(`the email ${input.email} already exist`)
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
			username: newAccount.username,
			linkId: newAccount.id}
	})

	fastify.log.info(`User created`);
	return 'user created'
}

//check per il login
export async function loginUser(input:  userLogin): Promise<string> {
	// Controlla se esiste un account con l'email fornita
    const account = await userPrisma.account.findUnique({ where: { email: input.email.toString() } });
    if (!account) {
        fastify.log.info(`Wrong email`);
        throw new Error(`Wrong email`);
    }
    // Verifica che la password fornita corrisponda a quella dell'account trovato
    if (account.password !== input.password.toString()) {
        fastify.log.info(`Wrong password`);
		throw new Error(`Wrong password`);
    }

	fastify.log.info(`Login success`);
	return account.username
}
