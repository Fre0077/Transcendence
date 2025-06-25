import { PrismaClient as userPrismaClient } from "../prisma/generate/user"
const userPrisma = new userPrismaClient()

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

deleteAllAccounts()