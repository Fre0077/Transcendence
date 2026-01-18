// import ms from 'ms';
// import { createHash } from 'crypto';
// import { Unauthorized } from "../utils/exception";
// import { FastifyRequest, FastifyReply } from 'fastify';
// import { Account, PrismaClient as authPrismaClient } from "../database/generate/auth"
// const authPrisma = new authPrismaClient()

// //funzione per generazione token per il JWT
// export async function generateTokens(user: Account) {
// 	// 1. Crea l'Access Token (breve)
// 	const accessTokenPayload = { userId: user.id, email: user.email };
// 	const accessToken = jwt.sign(accessTokenPayload, "ft_trans(cendence)", {
// 		expiresIn: "15m",
// 	});
// 	const refreshToken = '';
// 	return {
// 		accessToken,
// 		refreshToken,
// 		// Restituisce anche la scadenza (in millisecondi) per il client
// 		accessTokenExpires: Date.now() + ms("24h"), 
// 	};
// }

// trova un refresh token nel Database
// export async function findRefreshToken(token: string) {
// 	const hashedToken = createHash('sha256').update(token).digest('hex');
// 	return authPrisma.refreshToken.findUnique({
// 		where: { hashedToken },
// 	});
// }

// cancella un refresh token dal Database
// export async function deleteRefreshToken(token: string) {
// 	const hashedToken = createHash('sha256').update(token).digest('hex');
// 	// Usiamo deleteMany perché @unique non è @id
// 	await authPrisma.refreshToken.deleteMany({ 
// 		where: { hashedToken }
// 	});
// }

// verifica un refresh token
// export function verifyRefreshToken(token: string) {
// 	try {
// 		return jwt.verify(token, "FT_TRANSCENDENCE") as { userId: number; iat: number; exp: number };
// 	} catch (error) {
// 		return null;
// 	}
// }

// // verifica un access token
// export function verifyAccessToken(token: string) {
// 	try {
// 		return jwt.verify(token, "ft_trans(cendence)") as { userId: number; email: string };
// 	} catch (error) {
// 		return null;
// 	}
// }