//import { user } from "./prisma/generate/chat"
import { userLogin } from "../classes/classes"
import { PrismaClient as userPrismaClient } from "./prisma/generate/user"
const userPrisma = new userPrismaClient()
import { PrismaClient as chatPrismaClient } from "./prisma/generate/chat"
const chatPrisma = new chatPrismaClient()

//ordine request:stesso ordine della tabella di prisma (username = name)
export async function createUser(user: userLogin): Promise<string> {	
	//ricerca dello user e della chat
	const findUsername = await userPrisma.account.findUnique({ where: { username: user.username.toString() } })
	if (findUsername) {
		console.log(`the username ${user.username} already exist`)
		throw new Error(`the username ${user.username} already exist`)
	}
	const findEmail = await userPrisma.account.findUnique({ where: { email: user.email.toString() } })
	if (findEmail) {
		console.log(`the email ${user.email} already exist`)
		throw new Error(`the email ${user.email} already exist`)
	}

	//creazione del nuovo messaggio
	const newAccount = await userPrisma.account.create({
		data: {
			name: user.name.toString(),
			surname: user.surname.toString(),
			username: user.username.toString(),
			email: user.email.toString(),
			password: user.password.toString()}
	})
	await chatPrisma.user.create({
		data: {
			name: newAccount.username,
			linkId: newAccount.id}
	})
	return 'user created'
}

export async function loginUser(user:  userLogin): Promise<string> {
	// Controlla se esiste un account con l'email fornita
    const account = await userPrisma.account.findUnique({ where: { email: user.email.toString() } });
    if (!account) {
        console.log(`Wrong email`);
        throw new Error(`Wrong email`);
    }
    // Verifica che la password fornita corrisponda a quella dell'account trovato
    if (account.password !== user.password.toString()) {
        console.log(`Wrong password`);
		throw new Error(`Wrong password`);
    }
	return account.username
}
