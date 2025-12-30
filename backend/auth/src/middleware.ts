import ms from 'ms';
import jwt from 'jsonwebtoken';
import { createHash } from 'crypto';
import { Unauthorized } from "../../utils/exception";
import { FastifyRequest, FastifyReply } from 'fastify';
import { Account, PrismaClient as authPrismaClient } from "../database/generate/auth"
const authPrisma = new authPrismaClient()

export interface AuthRequest extends FastifyRequest {
	user?: { userId: number; email: string };
}

export const authMiddleware = (
	request: AuthRequest,
	reply: FastifyReply,
	done: (error?: Error) => void
) => {
	
	const authHeader = request.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token)
		throw new Unauthorized("Accesso negato. Token mancante.", "middleware");

	try {
		const payload = verifyAccessToken(token); 
		if (!payload) {
			throw new Error("Token non valido");
		}

		request.user = payload;
		done();//se è tutto valido va avanti

	} catch (error) {
		throw new Unauthorized("Token non valido o scaduto.", "middleware");
	}
};

//funzione per generazione token per il JWT
export async function generateTokens(user: Account) {
	// 1. Crea l'Access Token (breve)
	const accessTokenPayload = { userId: user.id, email: user.email };
	const accessToken = jwt.sign(accessTokenPayload, "ft_trans(cendence)", {
		expiresIn: "15m",
	});

	// 2. Crea il Refresh Token (lungo)
	const refreshTokenPayload = { userId: user.id };
	const refreshToken = jwt.sign(refreshTokenPayload, "FT_TRANSCENDENCE", {
		expiresIn: "24h",
	});

	// 3. Salva l'hash del refresh token nel DB
	const hashedToken = createHash('sha256').update(refreshToken).digest('hex');
	
	await authPrisma.refreshToken.create({
		data: {
		userId: user.id,
		hashedToken: hashedToken,
		},
	});

	return {
		accessToken,
		refreshToken,
		// Restituisce anche la scadenza (in millisecondi) per il client
		accessTokenExpires: Date.now() + ms("24h"), 
	};
}

// trova un refresh token nel Database
export async function findRefreshToken(token: string) {
	const hashedToken = createHash('sha256').update(token).digest('hex');
	return authPrisma.refreshToken.findUnique({
		where: { hashedToken },
	});
}

// cancella un refresh token dal Database
export async function deleteRefreshToken(token: string) {
	const hashedToken = createHash('sha256').update(token).digest('hex');
	// Usiamo deleteMany perché @unique non è @id
	await authPrisma.refreshToken.deleteMany({ 
		where: { hashedToken }
	});
}

// verifica un refresh token
export function verifyRefreshToken(token: string) {
	try {
		return jwt.verify(token, "FT_TRANSCENDENCE") as { userId: number; iat: number; exp: number };
	} catch (error) {
		return null;
	}
}

// verifica un access token
export function verifyAccessToken(token: string) {
	try {
		return jwt.verify(token, "ft_trans(cendence)") as { userId: number; email: string };
	} catch (error) {
		return null;
	}
}