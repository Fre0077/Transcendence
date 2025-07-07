import { PrismaClient as userPrismaClient } from "../prisma/generate/user"
const userPrisma = new userPrismaClient()
import { PrismaClient as chatPrismaClient } from "../prisma/generate/chat"
const chatPrisma = new chatPrismaClient()
import { PrismaClient as profilePrismaClient } from "../prisma/generate/profile";
const profilePrisma = new profilePrismaClient();

import { changeProfile, ProfileImage } from "../../classes/classes"
import { fastify } from "../server";

//cambia lo username in tutti i database
export async function changeUsername(input: changeProfile): Promise<string> {	
	//ricerca dello user nei databse
	const findAccount = await userPrisma.account.findUnique({ where: { id: input.userId } })
	if (!findAccount) {
		fastify.log.info(`No user found with id ${input.userId}`)
		throw new Error(`No user found with id ${input.userId}`)
	}
	const findUser = await chatPrisma.user.findUnique({ where: { userId: input.userId } })
	if (!findUser) {
		fastify.log.info(`No user found with id ${input.userId}`)
		throw new Error(`No user found with id ${input.userId}`)
	}
	const findPlayer = await profilePrisma.player.findUnique({ where: { playerid: input.userId } })
	if (!findPlayer) {
		fastify.log.info(`No user found with id ${input.userId}`)
		throw new Error(`No user found with id ${input.userId}`)
	}

	//cambio dello username
	findAccount.username = input.newValue.toString();
	findUser.username = input.newValue.toString();
	findPlayer.username = input.newValue.toString();

	fastify.log.info(`Username changed`);
	return 'Username changed'
}

//cambia l'email
export async function changeEmail(input: changeProfile): Promise<string> {	
	//ricerca dello user nei databse
	const findAccount = await userPrisma.account.findUnique({ where: { id: input.userId } })
	if (!findAccount) {
		fastify.log.info(`No user found with id ${input.userId}`)
		throw new Error(`No user found with id ${input.userId}`)
	}

	//cambio dell'email
	findAccount.email = input.newValue.toString();

	fastify.log.info(`Email changed`);
	return 'Email changed'
}

//cambia la password
export async function changePassword(input: changeProfile): Promise<string> {	
	//ricerca dello user nei databse
	const findAccount = await userPrisma.account.findUnique({ where: { id: input.userId } })
	if (!findAccount) {
		fastify.log.info(`No user found with id ${input.userId}`)
		throw new Error(`No user found with id ${input.userId}`)
	}

	//cambio della password
	findAccount.password = input.newValue.toString();

	fastify.log.info(`Passowrd changed`);
	return 'Passowrd changed'
}

export async function changeProfileImage(input: ProfileImage): Promise<string> {
    const findPlayer = await profilePrisma.player.findUnique({ where: { playerid: input.userId } });
    if (!findPlayer) {
        fastify.log.info(`No user found with id ${input.userId}`);
        throw new Error(`No user found with id ${input.userId}`);
    }

    await profilePrisma.player.update({
        where: { playerid: input.userId },
        data: { image: input.imageBuffer }
    });

    fastify.log.info(`Profile image updated`);
    return 'Profile image updated';
}
