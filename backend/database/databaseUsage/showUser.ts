import { PrismaClient as userPrismaClient } from "../prisma/generate/user"
const userPrisma = new userPrismaClient()

async function showAllUsers() {
  try {
    const users = await userPrisma.account.findMany();
    if (users.length === 0) {
      console.log("Nessun utente trovato.");
      return;
    }
    users.forEach(user => {
      // Mostra prima email, poi password, poi username, poi il resto
      const { email, password, username, ...rest } = user;
      console.log("Email:", email);
      console.log("Password:", password);
      console.log("Username:", username);
      Object.entries(rest).forEach(([key, value]) => {
        console.log(`${key}:`, value);
      });
      console.log("-----");
    });
  } catch (error) {
    console.error('❌ Errore durante la lettura degli utenti:', error);
  } finally {
    await userPrisma.$disconnect();
  }
}

showAllUsers();