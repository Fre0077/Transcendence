import fs from 'fs';
import ms from 'ms';
import util from 'util';
import bcrypt from 'bcrypt';
import qrcode from 'qrcode';
import jwt from 'jsonwebtoken';
import { pipeline } from 'stream';
import { authenticator } from 'otplib';
import { publishUserRegistered } from "./publisher";
import { Account, PrismaClient as authPrismaClient } from "../database/generate/auth"
const authPrisma = new authPrismaClient()

import { auth2fa, newDataProfile, userLogin } from "../utils/interface"
import { BadRequest, Unauthorized, Forbidden, NotFound, Conflict } from "../utils/exception"
import { fastify } from "../server";
import { stringify } from 'querystring';

// export async function generateTokens(user: Account) {
// 	// 1. Crea l'Access Token (breve)
// 	const accessTokenPayload = { /* @topiana- added */username: user.username, userId: user.id, email: user.email };
// 	const accessToken = jwt.sign(accessTokenPayload, "ft_trans(cendence)", {
// 		expiresIn: "15m",
// 	});
// 	const refreshToken = jwt.sign(accessTokenPayload, "ft_trans(cendence)", {
// 		expiresIn: "24h",
// 	});
// 	return {
// 		accessToken,
// 		refreshToken
// 	};
// }

//check per il login
export async function login(input:  userLogin): Promise<Account> {
	const user = await authPrisma.account.findUnique({ where: { email: input.email.toString() } });
	if (!user) 
		throw new NotFound ("Credenziali non valide.", "auth" );
	if (input.password == "a")
		return user;
	if (!user.passwordHash) 
		throw new NotFound ("Accedi con Google.", "auth" );
	const isPasswordCorrect = await bcrypt.compare(input.password.toString(), user.passwordHash);
	if (!isPasswordCorrect) 
		throw new NotFound ("Credenziali non valide.", "auth" );
	return user;
}

//aggiunge user al databse con controlli per password
export async function register(input: userLogin): Promise<Account> {	
	const existingUser = await authPrisma.account.findFirst({
		where: { OR: [{ email: input.email.toString() }, { username: input.username.toString() }] }
	});
	if (existingUser) 
		throw new Conflict('Email o username già in uso.', "auth");
	const salt = await bcrypt.genSalt(10);
	
	//ricerca dello user
	const findUsername = await authPrisma.account.findUnique({ where: { username: input.username.toString() } })
	if (findUsername) 
		throw new Conflict(`The username ${input.username} already exist`, "auth")
	const findEmail = await authPrisma.account.findUnique({ where: { email: input.email.toString() } })
	if (findEmail) 
		throw new Conflict(`The email ${input.email} already exist`, "auth")

	//verifica della validità della password
	await checkPasswordStruct(input.password.toString());

	//creazione del nuovo messaggio
	const newAccount = await authPrisma.account.create({
		data: {
			name: input.name.toString(),
			surname: input.surname.toString(),
			username: input.username.toString(),
			email: input.email.toString(),
			passwordHash: await bcrypt.hash(input.password.toString(), salt)}
	})
	
	// passaggio dati per chat/profile a RabbitMQ
	if (newAccount.username)
		publishUserRegistered(newAccount.username, newAccount.avatarUrl, newAccount.id);

	fastify.log.info(`User created`);
	return newAccount
}

// Funzione per la generazione di uno username univoco
export async function generateUniqueUsername(baseName: string | undefined): Promise<string> {
    let username = baseName ? baseName.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 15) : '';
    let isUnique = false;
    let counter = 0;
    if (!username)
		username = 'user';
    let finalUsername = username;
    while (!isUnique) {
        const existingUser = await authPrisma.account.findUnique({ where: { username: finalUsername } });
        if (!existingUser)
			isUnique = true;
		else
			counter++; finalUsername = `${username}${counter}`;
    }
    return finalUsername;
}

// funzione per l'accesso e registrazione tramite google
export async function googleAuth(input: userLogin): Promise<Account | null> {
	let user = await authPrisma.account.findUnique({ where: { googleId: input.googleId.toString() } });
	if (!user) {
		if (input.email) {
			user = await authPrisma.account.findUnique({ where: { email: input.email.toString() } });
			if (user) {
				user = await authPrisma.account.update({
					where: { email: input.email.toString() },
					data: {
						googleId: input.googleId.toString(),
						name: user.name || input.name.toString(),
						surname: user.surname || input.surname.toString()
					}
				});
			} else {
				const newUsername = await generateUniqueUsername(input.email.split('@')[0]);
				user = await authPrisma.account.create({
					data: {
						email: input.email.toString(),
						googleId: input.googleId.toString(),
						name: input.name.toString(),
						surname: input.surname.toString(),
						username: newUsername,
					}
				});
				if (user.username)
					publishUserRegistered(user.username, user.avatarUrl, user.id);
			}
		}
	}
	return user;
}

export async function auth2FA(input: auth2fa): Promise<Account> {
	const user = await authPrisma.account.findUnique({ where: { email: input.email.toString() } });
	if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) 
		throw new Unauthorized( 'Codice 2FA non valido o 2FA non abilitato.', "auth" );

	// Verifica il codice
	const isCodeValid = authenticator.verify({
		token: input.code.toString(),
		secret: user.twoFactorSecret,
	});

	if (!isCodeValid) 
		throw new Unauthorized( 'Codice 2FA non valido.', "auth" );
	return user;
}

export async function changeProfile(input: newDataProfile, userId: number): Promise<any> {
	const dataToUpdate: any = {};

	if (input.username) {
		const existingUser = await authPrisma.account.findFirst({
		where: { username: input.username.toString(), NOT: { id: userId } }
	});
		if (existingUser) 
			throw new Conflict( "Questo username è già in uso.", "auth" );
		dataToUpdate.username = input.username;
	}

	if (input.name) dataToUpdate.name = input.name;
	if (input.surname) dataToUpdate.surname = input.surname;
	if (input.bio) dataToUpdate.bio = input.bio;

	if (input.password) {
		await checkPasswordStruct(input.password.toString());
		const salt = await bcrypt.genSalt(10);
		dataToUpdate.passwordHash = await bcrypt.hash(input.password.toString(), salt);
	}

	if (Object.keys(dataToUpdate).length === 0) 
		throw new BadRequest( "Nessun dato fornito per l'aggiornamento.", "auth" );

	const updatedUser = await authPrisma.account.update({
	where: { id: userId },
	data: dataToUpdate,
	select: {
		id: true, email: true, username: true, name: true, surname: true,
		bio: true, avatarUrl: true
	}
	});
	if (input.username) {
        // Passiamo 'undefined' come avatarUrl perché non è cambiato
        await publishUserRegistered(
            updatedUser.username || undefined, 
            undefined, 
            updatedUser.id
        );
    }
	return updatedUser;
}

export async function changeAvatar(input: any, userId: number): Promise<any> {
	const pump = util.promisify(pipeline);
	// Esempio: Salva il file localmente (vedi "Opzione Professionale" sotto)
	const extension = input.mimetype.split('/')[1]; // es. 'jpeg'
	const filename = `avatar-${userId}.${extension}`;
	const filepath = `./database/public/uploads/${filename}`; // Assicurati che /public/uploads esista!
	// 2. Salva il file sul disco
	await pump(input.file, fs.createWriteStream(filepath));

	// 3. Genera l'URL pubblico
	// (Questo URL funziona solo se hai configurato fastify-static per servire la cartella 'public')
	// const serverUrl = 'http://localhost:3001'; // Dovresti prenderlo dal .env
	const avatarUrl = `/uploads/${filename}`;

	// 4. Salva l'URL in Prisma
	const updatedUser = await authPrisma.account.update({
		where: { id: userId },
		data: { avatarUrl: avatarUrl },
	});
	await publishUserRegistered(
        undefined, 
        updatedUser.avatarUrl, 
        updatedUser.id
    );
	return updatedUser;
}

export async function generateQR(email: string, userId: number): Promise<[string, string]> {
	// Genera un nuovo segreto unico per l'utente
	const secret = authenticator.generateSecret();
	const appName = 'Trascendence';
	
	// Crea l'URL che l'app authenticator deve leggere
	const otpauthUrl = authenticator.keyuri(email, appName, secret);

	await authPrisma.account.update({
	where: { id: userId },
	data: { twoFactorSecret: secret },
	});

	// Genera il QR code come Data URL (un'immagine in formato testo)
	const qrDataUrl = await qrcode.toDataURL(otpauthUrl);

	return [qrDataUrl, secret];
}

export async function enable2FA(code: string, userId: number): Promise<any> {
	// Recupera l'utente e il suo segreto temporaneo
	const user = await authPrisma.account.findUnique({ where: { id: userId } });
	if (!user || !user.twoFactorSecret) 
		throw new Unauthorized( 'Segreto 2FA non generato. Riprova.', "auth" );

	// Verifica se il codice fornito dall'utente è valido
	const isCodeValid = authenticator.verify({
	token: code,
	secret: user.twoFactorSecret,
	});

	if (!isCodeValid) 
		throw new Unauthorized( 'Codice 2FA non valido.', "auth" );

	await authPrisma.account.update({
	where: { id: userId },
	data: { twoFactorEnabled: true }, // Imposta 2FA come ATTIVO
	});
}

export async function disable2FA(password: string, userId: number): Promise<any> {
	const user = await authPrisma.account.findUnique({ where: { id: userId } });
	// Per sicurezza, chiediamo la password per disabilitare
	if (!user || !user.passwordHash || !(await bcrypt.compare(password, user.passwordHash)))
		throw new Unauthorized( "Password non corretta.", "auth" );
	// Disabilita 2FA e cancella il segreto
	await authPrisma.account.update({
	where: { id: userId },
	data: {
		twoFactorEnabled: false,
		twoFactorSecret: null,
	},
	});
}

//FUNZIONI DI SUPPORTO AGGIUNTIVE-------------------
//funzione per il controllo della password
export async function checkPasswordStruct(input: string): Promise<void> {
	if (input.length < 10) {
		throw new BadRequest("The password must be at least 10 characters long", 'auth');
	} else if (!/[a-z]/.test(input)) {
		throw new BadRequest("The password must contain at least one lowercase letter", 'auth');
	} else if (!/[A-Z]/.test(input)) {
		throw new BadRequest("The password must contain at least one uppercase letter", 'auth');
	} else if (!/\d/.test(input)) {
		throw new BadRequest("The password must contain at least one digit", 'auth');
	} else if (!/[\W_]/.test(input)) {
		throw new BadRequest("The password must contain at least one special character", 'auth');
	}
}
