import Fastify from 'fastify'
import { PrismaClient } from '@prisma/client'
import path from 'path'
import { deleteChat, handleMessage } from './chat/chat'

const prisma = new PrismaClient()
const fastify = Fastify()

// Serve file statici (HTML, JS, ecc.)
fastify.register(import('@fastify/static'), {
	root: path.join(__dirname, 'public'),
	prefix: '/',
})

// Serve chat.html come pagina principale
fastify.get('/', (request, reply) => {
    return reply.sendFile('chat.html')
})

// Endpoint POST per ricevere il messaggio
fastify.post('/chat', async (request, reply) => {
	const { message } = request.body as { message?: string }
	if (!message) return reply.status(400).send({ error: 'Messaggio mancante' })
	try {
		const output = await handleMessage(message)
		return { reply: output }
	} catch (err) {
		return reply.status(500).send({ error: 'Errore interno' })
	}
})

// Endpoint POST per eliminare una chat
fastify.post('/chat-delete', async (request, reply) => {
    const { chatId } = request.body as { chatId?: string | number }
    if (!chatId) return reply.status(400).send({ error: 'ID chat mancante' })
    try {
        const id = typeof chatId === 'string' ? parseInt(chatId, 10) : chatId
        if (isNaN(id)) return reply.status(400).send({ error: 'ID chat non valido' })
        await deleteChat(id)
        return { reply: `🗑️ Messaggi eliminati dalla chat ${id}\n` }
    } catch (err) {
        return reply.status(500).send({ error: 'Errore interno' })
    }
})

// Avvia il server
fastify.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
	if (err) throw err
	console.log(`Server Fastify avviato su ${address}`)
})