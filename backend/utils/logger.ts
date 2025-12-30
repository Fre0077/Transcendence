import fs from 'fs';
import path from 'path';

const logDir = path.join(__dirname, 'logs');
const logFile = path.join(logDir, 'log.log');

function ensureLogDir() {
	try {
		fs.mkdirSync(logDir, { recursive: true });
	} catch (e) {} 
}

export function logError(message: string) {
	ensureLogDir();
	const line = `${new Date().toISOString()} ERROR: ${message}\n`;
	fs.appendFile(logFile, line, (err) => {
		if (err) console.error('Log write failed:', err);
	});
	console.error(message);
}

export function logInfo(message: string) {
	ensureLogDir();
	const line = `${new Date().toISOString()} INFO: ${message}\n`;
	fs.appendFile(logFile, line, (err) => {
		if (err) console.error('Log write failed:', err);
	});
	console.log(message);
}
