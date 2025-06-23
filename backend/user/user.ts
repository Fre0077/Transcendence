import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

import * as readline from 'readline'

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: true
})

export async function handleUser(input: string): Promise<string> {
	return ''
}
