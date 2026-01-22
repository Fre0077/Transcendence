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


function generateAccessTokens(user: any) {
	// 1. Crea l'Access Token (breve)
	const accessTokenPayload = { /* @topiana- added */username: user.username, userId: user.id, email: user.email };
	const accessToken = jwt.sign(accessTokenPayload, "ft_trans(cendence)", {
		expiresIn: "1m",
	});
	return {
		accessToken
	};
}

function generateTokens(user: any) {
	// 1. Crea l'Access Token (breve)
	const accessTokenPayload = { /* @topiana- added */username: user.username, userId: user.id, email: user.email };
	const accessToken = jwt.sign(accessTokenPayload, "ft_trans(cendence)", {
		expiresIn: "1m",
	});
	const refreshToken = jwt.sign(accessTokenPayload, "ft_trans(cendence)", {
		expiresIn: "24h",
	});
	return {
		accessToken,
		refreshToken
	};
}


export function attachCookies(data:any, reply:FastifyReply)
{
	if (!data.user) {
		console.log("Fatal: No user found when trying to attach cookies to the user");
		reply.code(500).send();
		return ;
	}
	const { accessToken, refreshToken } = generateTokens(data.user)

	// attach the cookie
	reply.setCookie('token', accessToken, {
		httpOnly: true,
		secure: false,		// true in production (HTTPS)
		sameSite: 'lax',	// also check this
		path: '/',
	});

	reply.setCookie('refreshToken', refreshToken, {
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
	user?:any;
}


function refreshAccessToken(refreshToken: any, reply: FastifyReply) : AuthReply {
		if (!refreshToken) {
			reply.code(401).send({ error: 'Missing token' });
			return { ok:false, reason:'Missing token' };
		}
		const user = verifyAccessToken(refreshToken);
		if (!user) {
			/* #debug */
			console.log(`Closed socket for:`, 'Invalid token');
			reply.code(401).send({ error: 'Invalid token' });
			return { ok:false, reason: 'Invalid token' };
		}

		const accessToken = generateAccessTokens(user);

		reply.setCookie('token', String(accessToken), {
			httpOnly: true,
			secure: false,		// true in production (HTTPS)
			sameSite: 'lax',	// also check this
			path: '/',
		});
		return { ok:true , user:user}
}

export function isCookieAuthenticated(request:FastifyRequest, reply:FastifyReply, done?: (err?: Error) => void): AuthReply
{
	/* --- AUTH CHECK --- */
	// get the token
	const token = request.cookies.token;

	/* #debug */
	// console.log('got cookie token', token);

	if (!token) {

		const ret = refreshAccessToken(token, reply);
		if (ret.ok === false)
			return ret;
			// add user to request
		(request as any).user = ret.user;

		// done if passed
		if (done) done();	// ✅ continue to the route handler
		return { ok:true }
	}

	// verify the token
	const user = verifyAccessToken(token);

	if (!user) {

		/* #debug */
		console.log(`Closed socket for:`, 'Invalid token');

		reply.code(401).send({ error: 'Invalid token' });
		return { ok:false, reason: 'Invalid token' };
	}

	// add user to request
	(request as any).user = user;

	// done if passed
	if (done) done();	// ✅ continue to the route handler

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
	// console.log('got cookie token', token);

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