import { PrismaClient as userPrismaClient } from "../prisma/generate/user"
const userPrisma = new userPrismaClient()
import { PrismaClient as chatPrismaClient } from "../prisma/generate/chat";
const chatPrisma = new chatPrismaClient();

async function deleteAllAccounts() {
	try {
		const result = await userPrisma.account.deleteMany();
		console.log(`✅ ${result.count} account eliminati con successo.`);
	} catch (error) {
		console.error('❌ Errore durante l\'eliminazione degli account:', error);
	} finally {
		await userPrisma.$disconnect();
	}
}

async function deleteAllUsers() {
	try {
		const result = await chatPrisma.user.deleteMany();
		console.log(`✅ ${result.count} user eliminati con successo.`);
	} catch (error) {
		console.error('❌ Errore durante l\'eliminazione degli user:', error);
	} finally {
		await userPrisma.$disconnect();
	}
}

deleteAllAccounts()
deleteAllUsers()
