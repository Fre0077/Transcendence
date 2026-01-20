import jwt from 'jsonwebtoken';
import { FastifyRequest, FastifyReply } from 'fastify';

export interface AuthRequest extends FastifyRequest {
	user?: { userId: number; email: string };
}

/* export const authMiddleware = (
	request: AuthRequest,
	reply: FastifyReply,
	done: (error?: Error) => void
) => {
	
	const authHeader = request.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token)
		throw new Error("Accesso negato. Token mancante.");

	try {
		const payload = verifyAccessToken(token); 
		if (!payload) {
			throw new Error("Token non valido");
		}

		request.user = payload;
		done();//se è tutto valido va avanti

	} catch (error) {
		throw new Error("Token non valido o scaduto.");
	}
}; */

export function attachCookies(data:any, reply:FastifyReply)
{
	// NO ACCESS TOKEN FOUND!!!
	if (!data.accessToken) {
		console.log("Fatal: No 'accessToken' found when trying to attach cookies to the user");
		return ;
	}

	// attach the cookie
	reply.setCookie('token', data.accessToken, {
		httpOnly: true,
		secure: false,		// true in production (HTTPS)
		sameSite: 'lax',	// also check this
		path: '/',
	});

	// remove token from output
}

export interface AuthReply {
	ok:boolean;					// status
	reason?:string;
}

export function isCookieAuthenticated(request:FastifyRequest): AuthReply
{
	/* --- AUTH CHECK --- */
	// get the token
	const token = request.cookies.token;

	/* #debug */
	console.log('got cookie token', token);

	if (!token) {

		/* #debug */
		console.log(`Closed socket for:`, 'Missing token');

		return { ok:false, reason:'Missing token' };
	}

	// verify the token
	const user = verifyAccessToken(token);

	if (!user) {

		/* #debug */
		console.log(`Closed socket for:`, 'Invalid token');

		return { ok:false, reason: 'Invalid token' };
	}

	// return the user
	return { ok:true }


	/* ------------------- */
}

interface UserReply extends AuthReply {
	username?:string;
	userId?:number;
	email?:string;
}

export function getCookieUser(request:FastifyRequest): UserReply
{
	/* --- AUTH CHECK --- */
	// get the token
	const token = request.cookies.token;

	/* #debug */
	console.log('got cookie token', token);

	if (!token) {

		/* #debug */
		console.log(`Closed socket for:`, 'Missing token');

		return { ok:false, reason:'Missing token' };
	}

	// verify the token
	const user = verifyAccessToken(token);

	if (!user) {

		/* #debug */
		console.log(`Closed socket for:`, 'Invalid token');

		return { ok:false, reason: 'Invalid token' };
	}

	// return the user
	return { ok:true, ...user};


	/* ------------------- */
}

function verifyAccessToken(token: string) {
	try {
		return jwt.verify(token, "ft_trans(cendence)") as { username: string, userId: number; email: string };
	} catch (error) {
		return null;
	}
}