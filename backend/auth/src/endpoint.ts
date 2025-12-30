import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { register, login, googleAuth, auth2FA, generateRefreshToken,
		changeProfile, changeAvatar, generateQR, enable2FA, disable2FA} from "./function";
import { generateTokens, deleteRefreshToken } from "./middleware";
import { Account, PrismaClient as authPrismaClient } from "../database/generate/auth";
const authPrisma = new authPrismaClient();

import { userLogin, RegisterBody, LoginBody, GoogleAuthBody, auth2fa, newDataProfile } from "../../utils/interface";
import { authMiddleware, AuthRequest } from "./middleware";
import { logError, logInfo } from "../../utils/logger";
import { backup } from "node:sqlite";
import { BadRequest, NotFound, Unauthorized } from "../../utils/exception";
import { NotBeforeError } from "jsonwebtoken";

export async function authEndpoint(fastify: FastifyInstance) {
	// Endpoint POST per fare il login
	fastify.post("/login", async (request: FastifyRequest, reply: FastifyReply) => {
		const userData = request.body as userLogin;
		try {
			if (!userData.email || !userData.password)
				throw new BadRequest('Email e password sono richieste', 'auth');
			const user = await login(userData);
			if (user.twoFactorEnabled) {
				
				return reply.code(401).send({ message: "Verifica 2FA richiesta", twoFactorRequired: true });
			}
			const tokens = await generateTokens(user);
			logInfo('{auth} [200] token generato con successo');
			reply.code(200).send({ ...tokens, user });

		} catch (err) {
			if (err instanceof Error) {
				reply.code((err as any).statusCode).send({ error: err.message });
			} else {
				logError('{auth} [500] errore interno del server');
				reply.code(500).send({ error: "Internal server error" });
			}
		}
	});

	// Endpoint POST per la registrazione dell'utente
	fastify.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
		const userData = request.body as userLogin;
		
		try {
			if (!userData.email || !userData.password || !userData.username)
				throw new BadRequest('Email, username e password sono richiesti', 'auth');
			const output = await register(userData);
			logInfo('{auth} [201] utente registrato con successo');
			reply.code(201).send(output);
		} catch (err) {
			if (err instanceof Error) {
				reply.code((err as any).statusCode).send({ error: err.message });
			} else {
				logError('{auth} [500] errore interno del server');
				reply.code(500).send({ error: "Internal server error" });
			}
		}
	});

	//Enpoint POST per l'autenticazione tramite google
	fastify.post('/auth/google', async (request: FastifyRequest, reply: FastifyReply) => {
		const googleData = request.body as userLogin;

		try {
			if (!googleData.googleId || !googleData.email)
				throw new BadRequest('Google ID o Email non fornita', 'auth');
			let user = await googleAuth(googleData);
			if (user) {
				const tokens = await generateTokens(user);
				logInfo('{auth} [200] Autenticazione Google riuscita');
				reply.code(200).send({ message: 'Autenticazione Google riuscita', ...tokens, user });
			}
		} catch (err) {
			if (err instanceof Error) {
				reply.code((err as any).statusCode).send({ error: err.message });
			} else {
				logError('{auth} [500] errore interno del server');
				reply.code(500).send({ error: "Internal server error" });
			}
		}
	});

	//Enpoint POST per l'autenticazione a due fattori
	fastify.post('/2fa/verify', async (request: FastifyRequest, reply: FastifyReply) => {
		const googleData = request.body as auth2fa;

		try {
			if (!googleData.email || !googleData.code)
				throw new BadRequest('Email e codice 2FA sono richiesti', 'auth');
			const user = await auth2FA(googleData);
			const tokens = await generateTokens(user);
			logInfo('{auth} [200] 2FA riuscita');
			reply.code(200).send({ ...tokens, user });
		} catch (err) {
			if (err instanceof Error) {
				reply.code((err as any).statusCode).send({ error: err.message });
			} else {
				logError('{auth} [500] errore interno del server');
				reply.code(500).send({ error: "Internal server error" });
			}
		}
	});

	//Enpoint POST per refreshare il token
	fastify.post('/refresh', async (request: FastifyRequest, reply: FastifyReply) => {
		const { refreshToken } = request.body as { refreshToken: string };

		try {
			const user = await generateRefreshToken(refreshToken);
			const newTokens = await generateTokens(user);
			logInfo('{auth} [200] Nuovo token generato con successo');
			reply.code(200).send(newTokens);
		} catch (err) {
			if (err instanceof Error) {
				reply.code((err as any).statusCode).send({ error: err.message });
			} else {
				logError('{auth} [500] errore interno del server');
				reply.code(500).send({ error: "Internal server error" });
			}
		}
	});

	//Enpoint GET per ottenere l'account dal database
	fastify.get('/profile', { preHandler: [authMiddleware] }, async (request: AuthRequest, reply: FastifyReply) => {
		try {
			if (!request.user)
				throw new Unauthorized('Utente non trovato nel token', 'auth');
			const userId = request.user.userId;
			const user = await authPrisma.account.findUnique({
			where: { id: userId },
			select: {
				id: true, email: true, username: true, name: true, surname: true,
				wins: true, losses: true, tournamentWins: true, tournamentLosses: true,
				bio: true, avatarUrl: true
			}
			});
			if (!user) 
				throw new NotFound('Profilo utente non trovato', 'auth');
			logInfo('{auth} [200] Account trovato');
			reply.code(200).send(user);
		} catch (err) {
			if (err instanceof Error) {
				reply.code((err as any).statusCode).send({ error: err.message });
			} else {
				logError('{auth} [500] errore interno del server');
				reply.code(500).send({ error: "Internal server error" });
			}
		}
	});

	//Enpoint PATCH per modificare i dati dentro il database
	fastify.patch('/profile', { preHandler: [authMiddleware] }, async (request: AuthRequest, reply: FastifyReply) => {
		try {
			if (!request.user)
				throw new Unauthorized('Utente non autorizzato', 'auth');
			const userId = request.user.userId;
			const userData = request.body as newDataProfile;
			const updatedUser = await changeProfile(userData, userId);
			logInfo(`{auth} [200] Utente ${userId} ha aggiornato il profilo`);
			reply.code(200).send(updatedUser);
		} catch (err) {
			if (err instanceof Error) {
				reply.code((err as any).statusCode).send({ error: err.message });
			} else {
				logError('{auth} [500] errore interno del server');
				reply.code(500).send({ error: "Internal server error" });
			}
		}
	});

	//Enpoint POST per l'aggiornamento dell'avatar
	fastify.post('/profile/avatar', { preHandler: [authMiddleware] }, async (request: AuthRequest, reply: FastifyReply) => {
		try {
			if (!request.user)
				throw new Unauthorized('Non autorizzato', 'auth');
			const data = await request.file();
			if (!data)
				throw new NotFound('File non trovato', 'auth');
			const userId = request.user.userId;
			const updatedUser = await changeAvatar(data, userId);
			logInfo('{auth} [201] avatar aggiornato con successo');
			reply.code(201).send(updatedUser);
		} catch (err) {
			if (err instanceof Error) {
				reply.code((err as any).statusCode).send({ error: err.message });
			} else {
				logError('{auth} [500] errore interno del server');
				reply.code(500).send({ error: "Internal server error" });
			}
		}
	});

	//Enpoint POST genera il qr per 2fa
	fastify.post('/2fa/generate', { preHandler: [authMiddleware] }, async (request: AuthRequest, reply: FastifyReply) => {
		try {
			if (!request.user)
				throw new Unauthorized('Utente non autorizzato', 'auth');
			const { userId, email } = request.user;
			const [qrDataUrl, secret] = await generateQR(email, userId);
			logInfo('{auth} [200] QR generato con successo');
			reply.code(200).send({ qrCodeUrl: qrDataUrl, secret: secret });
		} catch (err) {
			if (err instanceof Error) {
				reply.code((err as any).statusCode).send({ error: err.message });
			} else {
				logError('{auth} [500] errore interno del server');
				reply.code(500).send({ error: "Internal server error" });
			}
		}
	});

	//Enpoint POST controllo qr per 2fa
	fastify.post('/2fa/enable', { preHandler: [authMiddleware] }, async (request: AuthRequest, reply: FastifyReply) => {
		try {
			if (!request.user)
				throw new Unauthorized('Utente non autorizzato', 'auth');
			const { userId } = request.user;
			const { code } = request.body as { code: string };
			if (!code)
				throw new BadRequest('Codice 2FA richiesto', 'auth');
			await enable2FA(code, userId);
			logInfo('{auth} [200] 2FA abilitato con successo');
			reply.code(200).send({ message: '2FA abilitato con successo!' });
		
		} catch (err) {
			if (err instanceof Error) {
				reply.code((err as any).statusCode).send({ error: err.message });
			} else {
				logError('{auth} [500] errore interno del server');
				reply.code(500).send({ error: "Internal server error" });
			}
		}
	});

	//Enpoint POST per l'autenticazione a due fattori
	fastify.post('/2fa/disable', { preHandler: [authMiddleware] }, async (request: AuthRequest, reply: FastifyReply) => {
		try {
			if (!request.user)
				throw new Unauthorized('Utente non autorizzato', 'auth');
			const { userId } = request.user;
			const { password } = request.body as { password?: string };
			if (!password)
				throw new BadRequest('Password richiesta per disabilitare 2FA', 'auth');
			await disable2FA(password, userId);
			logInfo('{auth} [200] 2FA disabilitato con successo');
			reply.code(200).send({ message: '2FA disabilitato con successo' });
		} catch (err) {
			if (err instanceof Error) {
				reply.code((err as any).statusCode).send({ error: err.message });
			} else {
				logError('{auth} [500] errore interno del server');
				reply.code(500).send({ error: "Internal server error" });
			}
		}
	});

	//Enpoint POST elimina i token al logout
	fastify.post('/logout', { preHandler: [authMiddleware] }, async (request: AuthRequest, reply: FastifyReply) => {
		// Riceve il refresh token che il client vuole invalidare.
		const { refreshToken } = request.body as { refreshToken?: string };
		
		try {
			if (!refreshToken)
				throw new BadRequest('Refresh token richiesto', 'auth');
			await deleteRefreshToken(refreshToken);
			logInfo('{auth} [200] Logout effettuato con successo');
			reply.code(200).send({ message: 'Logout effettuato con successo' });
		} catch (err) {
			if (err instanceof Error) {
				reply.code((err as any).statusCode).send({ error: err.message });
			} else {
				logError('{auth} [500] errore interno del server');
				reply.code(500).send({ error: "Internal server error" });
			}
		}
	});
}
