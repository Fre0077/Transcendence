// import jwt from 'jsonwebtoken';
// import { FastifyRequest, FastifyReply } from 'fastify';
// import { Unauthorized } from "../utils/exception";

// export interface AuthRequest extends FastifyRequest {
// 	user?: { userId: number; email: string };
// }

// export const authMiddleware = (
// 	request: AuthRequest,
// 	reply: FastifyReply,
// 	done: (error?: Error) => void
// ) => {
	
// 	const authHeader = request.headers['authorization'];
// 	const token = authHeader && authHeader.split(' ')[1];

// 	if (!token)
// 		throw new Unauthorized("Accesso negato. Token mancante.", "middleware");

// 	try {
// 		const payload = verifyAccessToken(token); 
// 		if (!payload) {
// 			throw new Error("Token non valido");
// 		}

// 		request.user = payload;
// 		done();//se è tutto valido va avanti

// 	} catch (error) {
// 		throw new Unauthorized("Token non valido o scaduto.", "middleware");
// 	}
// };

// export function verifyAccessToken(token: string) {
// 	try {
// 		return jwt.verify(token, "ft_trans(cendence)") as { userId: number; email: string };
// 	} catch (error) {
// 		return null;
// 	}
// }