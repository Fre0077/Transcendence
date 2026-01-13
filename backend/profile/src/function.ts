import { NotFound, Conflict, BadRequest } from "../utils/exception";

import { PrismaClient as ProfileClient } from "../database/generate/profile";
const profilePrisma = new ProfileClient();

//Crea un utente linkato nel database Profile.
export async function createProfileUser(linkId: number, username: string, avatarUrl: string | null = null) {
    try {
        await profilePrisma.user.create({
            data: { 
                linkId, 
                username,
                avatarUrl //salvo sia lo username che l'avatar cosi non devo richiamare Auth ogni volta
            }
        });
    } catch (error) {
        throw new Conflict(`Impossibile creare utente profilo. ID ${linkId} o Username già esistenti.`, "profile");
    }
}

export async function sendFriendRequest(myLinkId: number, targetUsername: string) {
    const targetUser = await profilePrisma.user.findFirst({
        where: { username: targetUsername }
    });

    if (!targetUser) 
        throw new NotFound("Utente non trovato.", "profile");
    if (targetUser.linkId === myLinkId) 
        throw new Conflict("Non puoi chiedere l'amicizia a te stesso.", "profile");

    const existingRelation = await profilePrisma.user.findUnique({
        where: { linkId: myLinkId },
        include: {
            friends: { where: { linkId: targetUser.linkId } },
            outgoingRequests: { where: { linkId: targetUser.linkId } },
            incomingRequests: { where: { linkId: targetUser.linkId } } // Caso in cui lui te l'abbia già mandata
        }
    });

    if (existingRelation?.friends.length) 
        throw new Conflict("Siete già amici.", "profile");
    
    if (existingRelation?.outgoingRequests.length) 
        throw new Conflict("Richiesta già inviata.", "profile");
    
    if (existingRelation?.incomingRequests.length) 
        throw new Conflict("Questo utente ti ha già inviato una richiesta. Accettala!", "profile");

    await profilePrisma.user.update({
        where: { linkId: myLinkId },
        data: {
            outgoingRequests: {
                connect: { linkId: targetUser.linkId }
            }
        }
    });

    return { message: `Richiesta inviata a ${targetUsername}` };
}

export async function acceptFriendRequest(myLinkId: number, senderUsername: string) {
    const senderUser = await profilePrisma.user.findFirst({ where: { username: senderUsername } });
    if (!senderUser) 
        throw new NotFound("Utente non trovato.", "profile");
    if (senderUser.linkId === myLinkId) 
        throw new Conflict("Non puoi accettare l'amicizia a te stesso.", "profile");

    const verificationCheck = await profilePrisma.user.findUnique({
        where: { linkId: myLinkId },
        select: {
            incomingRequests: {
                where: { linkId: senderUser.linkId },
                select: { linkId: true } // Selezioniamo solo l'ID per leggerezza
            }
        }
    });
    if (!verificationCheck || verificationCheck.incomingRequests.length === 0) 
        throw new Conflict("Non esiste nessuna richiesta di amicizia da questo utente.", "profile");

    // Rimuovi richiesta -> Aggiungi Amico (Bidirezionale)
    await profilePrisma.$transaction([
        // Rimuovi dalla Pending
        profilePrisma.user.update({
            where: { linkId: myLinkId },
            data: {
                incomingRequests: { disconnect: { linkId: senderUser.linkId } }
            }
        }),
        // Aggiungi agli Amici (Io -> Lui)
        profilePrisma.user.update({
            where: { linkId: myLinkId },
            data: {
                friends: { connect: { linkId: senderUser.linkId } }
            }
        }),
        // Aggiungi agli Amici (Lui -> Io)
        profilePrisma.user.update({
            where: { linkId: senderUser.linkId },
            data: {
                friends: { connect: { linkId: myLinkId } }
            }
        })
    ]);
    
    return { message: `Ora sei amico di ${senderUsername}` };
}

//Rifiuta o Annulla una richiesta, funziona per entrambi i casi
export async function removeFriendRequest(myLinkId: number, targetUsername: string) {
    const targetUser = await profilePrisma.user.findFirst({ where: { username: targetUsername } });
    if (!targetUser) 
        throw new NotFound("Utente non trovato.", "profile");
    if (targetUser.linkId === myLinkId) 
        throw new Conflict("Non puoi rifiutare l'amicizia a te stesso.", "profile");

    const relationCheck = await profilePrisma.user.findUnique({
        where: { linkId: myLinkId },
        include: {
            friends: { where: { linkId: targetUser.linkId } },
            outgoingRequests: { where: { linkId: targetUser.linkId } },
            incomingRequests: { where: { linkId: targetUser.linkId } }
        }
    });

    if (!relationCheck)
        throw new NotFound("Profilo utente non trovato", "profile");

    const isFriend = relationCheck.friends.length > 0;
    const hasSentRequest = relationCheck.outgoingRequests.length > 0;
    const hasReceivedRequest = relationCheck.incomingRequests.length > 0;

    // Se non siete amici E non ci sono richieste in nessuna direzione...
    if (!isFriend && !hasSentRequest && !hasReceivedRequest)
        throw new Conflict("Nessuna relazione da rimuovere: non siete amici e non ci sono richieste pendenti.", "profile");

    await profilePrisma.$transaction([
        
        profilePrisma.user.update({
            where: { linkId: myLinkId },
            data: {
                incomingRequests: { disconnect: { linkId: targetUser.linkId } },
                outgoingRequests: { disconnect: { linkId: targetUser.linkId } },
                
                friends: { disconnect: { linkId: targetUser.linkId } },
                friendOf: { disconnect: { linkId: targetUser.linkId } }
            }
        }),

        profilePrisma.user.update({
            where: { linkId: targetUser.linkId },
            data: {
                incomingRequests: { disconnect: { linkId: myLinkId } },
                outgoingRequests: { disconnect: { linkId: myLinkId } },
                
                friends: { disconnect: { linkId: myLinkId } },
                friendOf: { disconnect: { linkId: myLinkId } }
            }
        })
    ]);
    let actionType = "Relazione rimossa";
    if (isFriend) actionType = "Amicizia rimossa";
    else if (hasSentRequest) actionType = "Richiesta di amicizia rifiutata";
    else if (hasReceivedRequest) actionType = "Richiesta di amicizia annullata";

    return { message: "Richiesta rimossa." };
}

//Ottieni la lista amici e richieste che hai in sospeso
export async function getProfileData(myLinkId: number) {
    const data = await profilePrisma.user.findUnique({
        where: { linkId: myLinkId },
        select: {
            username: true,
            friends: { select: { username: true, avatarUrl: true, linkId: true } },
            incomingRequests: { select: { username: true, avatarUrl: true } },
            outgoingRequests: { select: { username: true, avatarUrl: true } }
        }
    });

    if (!data)
        throw new NotFound("Profilo utente non trovato.", "profile");

    return data;
}

//Ottieni la lista amici e richieste che hai in sospeso
export async function getUserData(myLinkId: number) {
    const data = await profilePrisma.user.findUnique({
        where: { linkId: myLinkId },
        select: {
            username: true,
            avatarUrl: true
        }
    });
    if (!data)
        throw new NotFound("Profilo utente non trovato.", "profile");
    return data;
}