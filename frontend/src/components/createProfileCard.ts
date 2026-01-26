// services
import { sendGetRequest } from "@/services/api/sendRequests";

// elements
import { generateInitialsAvatar } from "@/components/createDefaultImage";

export function createProfileCard(username: string): HTMLElement {
    const container = document.createElement('div');
    
    // Classi Tailwind come da tua richiesta
    container.className = 'relative w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col rounded-xl border border-white/10 shadow-lg overflow-hidden transition-all duration-300';
    container.style.minHeight = '250px'; // Altezza minima per evitare "salti" nel layout

    // Bot Check
    if (username.startsWith('BOT')) {
        container.innerHTML = loadBotCard(username);
        return container;
    }

    // Guest Check
    if (username.startsWith('Guest')) {
        container.innerHTML = loadGuestCard(username);
        return container;
    }

    container.innerHTML = `
        <div class="animate-pulse flex flex-col items-center justify-center h-full p-6 space-y-4">
            <div class="rounded-full bg-white/10 h-24 w-24"></div>
            <div class="h-4 bg-white/10 rounded w-1/2"></div>
            <div class="h-8 bg-white/5 rounded w-3/4 mt-4"></div>
        </div>
    `;
    (async () => {
        try {
            const data = await sendGetRequest(`/api/userinfo?username=${username}`);
            // const url = `${PROFILE_BASE_URL}/userinfo?username=${username}`;
            // const authToken = localStorage.getItem("authToken");
            // const response = await fetch(url, {
            //     method: 'GET',
            //     credentials: 'include',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': authToken ? `Bearer ${authToken}` : ''
            //     }
            // });
            // if (!response.ok) throw new Error('Utente non trovato');
            // const data = await response.json();

            /* #debug */
            // console.log('/userinfo', response, data);
            
            // Dati ricevuti: username e avatarUrl (o image)
            const avatar = data?.avatarUrl || data?.image || "";
            // 4. Aggiorniamo l'HTML con i dati reali
            container.innerHTML = /* html */`
                <div class="flex flex-col items-center p-8 z-10 w-full">
                    <div class="relative group mb-4">
                        <div class="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full opacity-70 blur transition duration-200"></div>
                        <img 
                            src="${avatar}" 
                            alt="${username}" 
                            class="relative w-24 h-24 rounded-full object-cover border-2 border-slate-800 shadow-2xl"
                            onerror="this.src=this.src=${generateInitialsAvatar(username, 'player')}"
                        />
                    </div>
                    
                    <h2 class="text-2xl font-bold text-white tracking-wide drop-shadow-md">
                        ${username}
                    </h2>
                    
                    <p class="text-indigo-200 text-sm mb-6 font-medium tracking-wider uppercase">
                        Player Profile
                    </p>
                    <button class="btn-profile-action px-8 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-lg shadow-indigo-500/30 border border-indigo-400/30">
                        Visualizza Statistiche
                    </button>
                </div>
                
                <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-slate-900 via-transparent to-transparent pointer-events-none"></div>
            `;
        } catch (error) {
            console.error("Errore caricamento profilo:", error);
            // Stato di Errore
            container.innerHTML = loadErrorCard(username);
        }
    })();

    return container;
}

function loadErrorCard(linkid:string): string
{
    return /* html */`<div class="flex flex-col items-center justify-center h-full p-6 text-red-400 text-center">
                <span class="text-4xl mb-2">⚠️</span>
                <p class="font-bold">Impossibile caricare il profilo</p>
                <p class="text-xs opacity-70 mt-1">${linkid}</p>
            </div>
        `;
}

function loadBotCard(botid:string): string
{
    return /* html */`<div class="flex flex-col items-center justify-center h-full p-6 text-red-400 text-center">
                <span class="text-4xl mb-2">🤖</span>
                <p class="font-bold">${botid}</p>
                <p class="text-indigo-200 text-sm mb-6 font-medium tracking-wider uppercase">
                    Bot Profile
                </p>
            </div>
        `;
}

function loadGuestCard(guestid:string): string
{
    return /* html */`<div class="flex flex-col items-center justify-center h-full p-6 text-red-400 text-center">
                <span class="text-4xl mb-2">🥷</span>
                <p class="font-bold">${guestid}</p>
                <p class="text-indigo-200 text-sm mb-6 font-medium tracking-wider uppercase">
                    Guest Profile
                </p>
            </div>
        `;
}