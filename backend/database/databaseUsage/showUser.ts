import { PrismaClient as chatPrismaClient } from "../prisma/generate/chat"
const chatPrisma = new chatPrismaClient()

async function showAllUsers() {
    try {
        const users = await chatPrisma.user.findMany();
        if (users.length === 0) {
            console.log("Nessun utente trovato.");
            return;
        }
        users.forEach(user => {
            console.log("UserId:", user.userId);
            console.log("LinkId:", user.linkId);
            console.log("Name:", user.name);
            console.log("-----");
        });
    } catch (error) {
        console.error('❌ Errore durante la lettura degli utenti:', error);
    } finally {
        await chatPrisma.$disconnect();
    }
}

showAllUsers();
