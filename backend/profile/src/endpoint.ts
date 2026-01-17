import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { authMiddleware, AuthRequest } from "./middleware";
import { BadRequest, Unauthorized } from "../utils/exception";
import { logError, logInfo } from "../utils/logger";
import {
    sendFriendRequest, 
    acceptFriendRequest, 
    removeFriendRequest, 
    getProfileData,
    getUserData,
    getUserInfo,
    getUserGames
} from "./function";

// @topiana-
import { NotFound } from "../utils/exception";

// 1. Definisci cosa ti aspetti nell'URL (?linkid=123)
interface ProfileQuery {
    linkid?: string;
}

export async function profileEndpoint(fastify: FastifyInstance) {
    //GET /api/user -> Ottieni i dati dello user
    fastify.get<{ Querystring: ProfileQuery }>('/user', { preHandler: [authMiddleware] }, async (request, reply) => {
        try {
            const { linkid } = request.query;
            if (!linkid)
                return reply.status(400).send({ error: "Parametro 'linkid' mancante" });
            const data = await getUserData(Number(linkid));
            logInfo('{profile} [200] Dati utente recuperati con successo');
            return reply.status(200).send(data);
        } catch (err) {
            if (err instanceof Error) {
                const status = (err as any).statusCode || 500;
                return reply.status(status).send({ error: err.message });
            }
            logError('{profile} [500] errore interno del server');
            return reply.status(500).send({ error: "Internal server error" });
        }
    });

    // get game history (all the arrays of the requestd user (linkid in query))
    fastify.get<{ Querystring: ProfileQuery }>('/game', { preHandler: [authMiddleware] }, async (request, reply) => {
        try {
            const { linkid } = request.query;
            if (!linkid)
                return reply.status(400).send({ error: "Parametro 'linkid' mancante" });
            const data = await getUserGames(Number(linkid));
            logInfo('{profile} [200] Dati game utente recuperati con successo');
            return reply.status(200).send(data);
        } catch (err) {
            if (err instanceof Error) {
                const status = (err as any).statusCode || 500;
                return reply.status(status).send({ error: err.message });
            }
            logError('{profile} [500] errore interno del server');
            return reply.status(500).send({ error: "Internal server error" });
        }
    });

    // @topiana-
    fastify.get<{ Querystring: ProfileQuery }>('/userinfo', async (request, reply) => {
        
        try {

            // check della query
            const { linkid } = request.query;
            if (!linkid)
                return reply.status(400).send({ error: "Parametro 'linkid' mancante" });
                
            // get the user info (username and avarat url)
            const data = await getUserInfo(Number(linkid));
            
            // successfule return
            logInfo('{profile} [200] Account trovato');
            reply.code(200).send(data);
        } catch (err) {
            if (err instanceof Error) {
                const status = (err as any).statusCode || 500;
                return reply.status(status).send({ error: err.message });
            }
            logError('{profile} [500] errore interno del server');
            return reply.status(500).send({ error: "Internal server error" });
        }
    });

    // GET /api/friends -> Ottieni amici e richieste
    fastify.get('/friends', { preHandler: [authMiddleware] }, async (request: AuthRequest, reply: FastifyReply) => {
        try {
            if (!request.user) 
                throw new Unauthorized("Utente non autorizzato", "profile");
            const data = await getProfileData(request.user.userId);
            
            logInfo('{profile} [200] Dati profilo recuperati con successo');
            return reply.status(200).send(data);
        } catch (err) {
            if (err instanceof Error)
                return reply.status((err as any).statusCode).send({ error: err.message });
            logError('{profile} [500] errore interno del server');
            return reply.status(500).send({ error: "Internal server error" });
        }
    });

    // POST /api/friend/request -> Invia richiesta
    fastify.post('/friend/request', { preHandler: [authMiddleware] }, async (request: AuthRequest, reply: FastifyReply) => {
        const { targetUsername } = request.body as { targetUsername: string };
        try {
            if (!request.user) 
                throw new Unauthorized("Utente non autorizzato", "profile");
            if (!targetUsername)
                throw new BadRequest("Username richiesto", "profile");
            const result = await sendFriendRequest(request.user.userId, targetUsername);
            
            logInfo(`{profile} [200] Richiesta amicizia inviata a ${targetUsername}`);
            return reply.status(200).send(result);
        } catch (err) {
            if (err instanceof Error)
                return reply.status((err as any).statusCode).send({ error: err.message });
            logError('{profile} [500] errore interno del server');
            return reply.status(500).send({ error: "Internal server error" });
        }
    });

    // POST /api/friend/accept -> Accetta richiesta
    fastify.post('/friend/accept', { preHandler: [authMiddleware] }, async (request: AuthRequest, reply: FastifyReply) => {
        const { targetUsername } = request.body as { targetUsername: string };
        try {
            if (!request.user) 
                throw new Unauthorized("Utente non autorizzato", "profile");
            if (!targetUsername)
                throw new BadRequest("Username richiesto per accettare", "profile");
            const result = await acceptFriendRequest(request.user.userId, targetUsername);
            
            logInfo(`{profile} [200] Richiesta amicizia accettata per ${targetUsername}`);
            return reply.status(200).send(result);
        } catch (err) {
            if (err instanceof Error)
                return reply.status((err as any).statusCode).send({ error: err.message });
            logError('{profile} [500] errore interno del server');
            return reply.status(500).send({ error: "Internal server error" });
        }
    });

    // DELETE /api/friend/remove -> Rifiuta/Annulla richiesta o Rimuovi amico
    fastify.delete('/friend/remove', { preHandler: [authMiddleware] }, async (request: AuthRequest, reply: FastifyReply) => {
        const { targetUsername } = request.body as { targetUsername: string };
        try {
            if (!request.user) 
                throw new Unauthorized("Utente non autorizzato", "profile");
            if (!targetUsername)
                throw new BadRequest("Username richiesto per rimuovere", "profile");
            const result = await removeFriendRequest(request.user.userId, targetUsername);
            
            logInfo(`{profile} [200] Relazione rimossa con ${targetUsername}`);
            return reply.status(200).send(result);
        } catch (err) {
            if (err instanceof Error)
                return reply.status((err as any).statusCode).send({ error: err.message });
            logError('{profile} [500] errore interno del server');
            return reply.status(500).send({ error: "Internal server error" });
        }
    });
}