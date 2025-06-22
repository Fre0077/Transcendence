import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

import * as readline from 'readline'

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: true
})

console.log('Iniziamo! Scrivi "quit" per uscire.')

async function handleInput(input: string) {
	input = input.trim()
	if (input.toLowerCase() === 'quit') {
		console.log('The end...')
		await prisma.$disconnect()
		rl.close()
		process.exit(0)
	} else if (input.toLowerCase() === 'show') {
		const messaggi = await prisma.messages.findMany({
			orderBy: { date: 'asc' }
		})
		if (messaggi.length === 0) {
			console.log('📭 Nessun messaggio trovato.')
		} else {
			console.log('\n📋 Tutti i messaggi:')
			console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
			messaggi.forEach((msg) => {
				const dataFormattata = msg.date.toLocaleString('it-IT')
				console.log(`[${dataFormattata}] ${msg.message}`)
			})
			console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
		}
	} else if (input.toLowerCase() === 'delete') {
		rl.question('Witch chat: ', async (chatIdInput) => {
			const chatId = parseInt(chatIdInput.trim())
			const risultato = await prisma.messages.deleteMany({ where: { chat: chatId } })
			console.log(`🗑️ Eliminati ${risultato.count} messaggi dalla chat ${chatId}`)
			console.log()
			rl.prompt()
		})
		return;
	} else if (input.toLowerCase() === 'search') {
		rl.question('what search: : ', async (search) => {
			const messaggi = await prisma.messages.findMany({
				where: {
					message: {
						contains: search,
					},
				},
				orderBy: {
					date: 'asc',
				},
			})
			console.log('\n📋 messaggi trovati:')
			console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
			messaggi.forEach((msg) => {
				const dataFormattata = msg.date.toLocaleString('it-IT')
				console.log(`[${dataFormattata}] ${msg.message}`)
			})
			console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
			rl.prompt()
		})
		return;
	} else if (input !== '') {
		await prisma.messages.create({
			data: {chat: 1,message: input,date: new Date()}
		})
	}
	rl.prompt()
}

rl.on('line', (input) => {
	handleInput(input)
})

rl.setPrompt('> ')
rl.prompt()
