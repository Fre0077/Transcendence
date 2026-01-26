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





/* ------------------------------------------ */
/* 				COOKIE ATTACHMENT			  */

interface Cookie {
	id:string,
	value?:string
}

function attachCookie(reply:FastifyReply, cookie:Cookie)
{
	// if not value return
	if (!cookie.value) return ;

	// attach the cookie
	reply.setCookie(cookie.id, cookie.value, {
		httpOnly: true,
		secure: false,		// true in production (HTTPS)
		sameSite: 'lax',	// also check this
		path: '/',
	});
}

function clearCookie(reply:FastifyReply, cookie:Cookie)
{
	// attach the cookie
	reply.clearCookie(cookie.id, {
		httpOnly: true,
		secure: false,		// true in production (HTTPS)
		sameSite: 'lax',	// also check this
		path: '/',
	});
}

// attach bot tokens to the user reply
export function attachAllCookies(data:any, reply:FastifyReply)
{
	console.log('attaching cookies got', data);

	if (!data.id || !data.email || !data.username) {
		console.log("Fatal: No user found when trying to attach cookies to the user");
		reply.code(500).send();
		return ;
	}

	// generate new tokens
	const { accessToken, refreshToken } = generateTokens(data)

	// attach the accessToken
	attachCookie(reply, {
		id: 'accessToken',
		value: accessToken
	});

	// attach the refreshToken
	attachCookie(reply, {
		id: 'refreshToken',
		value: refreshToken
	});

	// remove user from data
	const newdata = (({ user, ...object }) => object)(data);
	return newdata;
}

// delete bot tokens to the user reply
export function clearAllCookies(reply:FastifyReply)
{
	// attach the accessToken
	clearCookie(reply, {
		id: 'accessToken',
	});

	// attach the refreshToken
	clearCookie(reply, {
		id: 'refreshToken',
	});

	return { ok:true }
}

/* ------------------------------------------------ */







export interface AuthReply {
	ok:boolean;					// status
	reason?:string;
	user?:any;
}

function refreshAccessToken(refreshToken: string, reply: FastifyReply) : AuthReply
{
	// verigy if refresh token is valid
	const user = verifyAccessToken(refreshToken);
	if (!user) {
		/* #debug */
		console.log(`Closed socket for:`, 'Invalid token');
		return { ok:false, reason: 'Invalid token' };
	}

	/* #debug */
	// console.log('Refreshed token with', user);

	// generate new accessToken
	const accessToken = generateAccessToken(user);

	// attach the cookie
	attachCookie(reply, {
		id: 'accessToken',
		value: accessToken
	});

	// successful return + user
	return { ok:true , user:user}
}

/* Check if the user has valid authentication tokens in the cookies.
if accessToken is present and valid, all good.
if accessToken isn't present or it's not valid (expired or invalid) check the refreshToken
	if the refreshToken is valid, generate and attach new accessToken
	if the refreshToken isn't found or it's not valid (expired or invalid), send error*/
export function isCookieAuthenticated(request:FastifyRequest, reply?:FastifyReply, done?: (err?: Error) => void): AuthReply
{
	/* --- AUTH CHECK --- */
	// get the tokens
	const accessToken = request.cookies.accessToken;
	const refreshToken = request.cookies.refreshToken;

	/* #debug */
	// console.log('accessToken', accessToken !== undefined);
	// console.log('refreshToken', refreshToken !== undefined);

	// verify if the token is present and if it's valid
	const user = verifyToken(accessToken);

	// check if we got the access token (15m)
	if (user === null)
	{
		// check if we got the refresh token (24h) ore we can't attach the new token to the reply
		if (!refreshToken || !reply) {

			/* #debug */
			console.log("Missing refresh token");

			reply?.code(401).send({ error: 'Missing token' });
			return { ok:false, reason: 'Missing token' };
		}

		// then we try to generate the new access token
		const ret = refreshAccessToken(refreshToken, reply);

		// check if the token was generated (and attached correctly)
		if (ret.ok === false) {

			/* #debug */
			console.log("Failed to refresh access token");

			reply.code(401).send({ error: ret.reason });
			return ret;
		}

		// add user to request
		(request as any).user = ret.user;

		// done if passed
		if (done) done();	// ✅ continue to the route handler

		
		/* #debug */
		// console.log('REFRESHED', ret);
		
		// nice return (ok=true + user data)
		return ret
	}

	// add user to request
	(request as any).user = user;

	// done if passed
	if (done) done();	// ✅ continue to the route handler

	/* #debug */
	// console.log('ALL GOOD', { ok:true, user: user });

	// return the user
	return { ok:true, user: user }


	/* ------------------- */
}









/* ------------------------------------ */
/* 				 JWT STUFF		    	*/



function verifyToken(token:string | undefined)
{
	if (!token) return null;
	else return verifyAccessToken(token);
}
function verifyAccessToken(token: string) {
	try {
		return jwt.verify(token, "ft_trans(cendence)") as { username: string, userId: number; email: string };
	} catch (error) {
		return null;
	}
}

/* ------------------------------------------ */
/* 				TOKEN GENERATION			  */

function generateRefreshToken(user: any): string
{
	// Crea il Refresh Token (lungo)
	const id = (user.id) ? user.id : user.userId;	// get the id since we have 2 ways of storing it :D
	const refreshTokenPayload = { /* @topiana- added */username: user.username, userId: id, email: user.email };
	const refreshToken = jwt.sign(refreshTokenPayload, "ft_trans(cendence)", {
		expiresIn: "24h",
	});
	return refreshToken;
}

function generateAccessToken(user: any): string
{
	// Crea l'Access Token (breve)
	const id = (user.id) ? user.id : user.userId;	// get the id since we have 2 ways of storing it :D
	const accessTokenPayload = { /* @topiana- added */username: user.username, userId: id, email: user.email };
	const accessToken = jwt.sign(accessTokenPayload, "ft_trans(cendence)", {
		expiresIn: "10s",
	});
	return accessToken;
}

function generateTokens(user: any)
{
	// generate tokens
	const accessToken = generateAccessToken(user);
	const refreshToken = generateRefreshToken(user);

	// return them
	return {
		accessToken,
		refreshToken
	};
}