import Fastify from 'fastify'
import { createChat, deletemessages, handleMessage } from './chat'
import { createUser, loginUser } from './user'
import cors from '@fastify/cors';

import { PrismaClient as userPrismaClient } from "./prisma/generate/user"
const userPrisma = new userPrismaClient()
import { PrismaClient as chatPrismaClient } from "./prisma/generate/chat"
const chatPrisma = new chatPrismaClient()
const fastify = Fastify()

fastify.register(cors, {
  origin: (origin, cb) => {
    const allowedOrigins = [
      'http://localhost:4269', // frontend
      'http://localhost:3000'  // eventualmente anche il backend stesso
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      cb(null, true); // ok
    } else {
      cb(new Error("Not allowed by CORS"), false);
    }
  },
  credentials: true // se usi cookie o autenticazione
});

fastify.addContentTypeParser('text/plain', { parseAs: 'string' }, function (req, body, done) {
  done(null, body);
});

// Endpoint POST per creare nuova chat
fastify.post('/chat', async (request, reply) => {
	const { info } = request.body as { info?: string }
	if (!info) return reply.status(400).send({ error: 'Missing chat info' })
	try {
		const output = await createChat(info)
		return { reply: output }
	} catch (err) {
		return reply.status(500).send({ error: err + 'Internal server error' })
	}
})

// Endpoint POST per ricevere il messaggio
fastify.post('/chat-message', async (request, reply) => {
	const { message } = request.body as { message?: string }
	if (!message) return reply.status(400).send({ error: 'No message provided' })
	try {
		const output = await handleMessage(message)
		return { reply: output }
	} catch (err) {
		return reply.status(500).send({ error: err + 'Internal server error' })
	}
})

// Endpoint POST per eliminare una chat
fastify.post('/chat-delete', async (request, reply) => {
    const { chatId } = request.body as { chatId?: string | number }
    if (!chatId) return reply.status(400).send({ error: 'No ID provided' })
    try {
        const id = typeof chatId === 'string' ? parseInt(chatId, 10) : chatId
        if (isNaN(id)) return reply.status(400).send({ error: 'Invalid ID' })
        await deletemessages(id)
        return { reply: `🗑️ messages deleted from chat ${id}\n` }
    } catch (err) {
        return reply.status(500).send({ error: err + 'Internal server error' })
    }
})

// Endpoint POST per registrarsi
fastify.post('/register', async (request, reply) => {
    const userData = request.body as string
    if (!userData) return reply.status(400).send({ error: 'Missing user data' })
    try {
        await createUser(userData)
        return { reply: `User created\n` }
    } catch (err) {
        return reply.status(500).send({ error: err + 'Internal server error' })
    }
})

// Endpoint POST per fare il login
fastify.post('/login', async (request, reply) => {
    const { userData } = request.body as { userData?: string}
    if (!userData) return reply.status(400).send({ error: 'Missing user data' })
    try {
        await loginUser(userData)
        return { reply: `User lgoin\n` }
    } catch (err) {
        return reply.status(500).send({ error: err + 'Internal server error' })
    }
})

// Avvia il server
fastify.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
	if (err) throw err
	console.log(`Server Fastify avviato su ${address}`)
})