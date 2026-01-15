const PROFILE_BASE_URL = `http://${window.location.hostname}:3003/api`;

export interface InteractiveWidget {
	element:HTMLElement;
	setScore:(score:number) =>void;
}

export function createProfileWidget(linkid: string): InteractiveWidget {
    const container = document.createElement('div');
    
    // Classi Tailwind come da tua richiesta
    container.className = 'relative w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col rounded-xl border border-white/10 shadow-lg overflow-hidden transition-all duration-300';
    container.style.minHeight = '250px'; // Altezza minima per evitare "salti" nel layout

    // Bot Check
    if (linkid.startsWith('BOT')) {
        container.innerHTML = loadBotWidget(linkid);
    }
    // Guest Check
    else if (linkid.startsWith('Guest')) {
        container.innerHTML = loadGuestWidget(linkid);
    }
	// then it's a player
	else {
		loadPlayerWidget(linkid)
		.then((html) => container.innerHTML = html);
	}

	// append dynamic editor functions
    const element = container.firstElementChild as HTMLElement;

	const fields = {
		score: element.querySelector('[data-field="score"]')!,
	};

	return {
		element,
		setScore(value: number) {
			fields.score.textContent = String(value);
		}
	};
}

async function loadPlayerWidget(linkid:string): Promise<string>
{
	try {
            const url = `${PROFILE_BASE_URL}/user?linkid=${linkid}`;
            const authToken = localStorage.getItem("authToken");
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authToken ? `Bearer ${authToken}` : ''
                }
            });
            if (!response.ok) throw new Error('Utente non trovato');
            const data = await response.json();
            
            // Dati ricevuti: username e avatarUrl (o image)
            const username = data.username || linkid;
            const avatar = data.avatarUrl || data.image || "";
            // 4. Aggiorniamo l'HTML con i dati reali
            return /* html */`
                <div class="player-widget relative flex flex-col items-center p-4 rounded-xl bg-slate-800/60 border border-white/10 shadow-lg backdrop-blur">

					<!-- Avatar -->
					<div class="relative group mb-2">
						<img
							data-role="avatar"
							src="${avatar}"
							alt="${username}"
							class="relative w-14 h-14 rounded-full object-cover border border-slate-800"
							onerror="this.src='https://ui-avatars.com/api/?name=${username}&background=random'"
						/>
					</div>

					<!-- Username -->
					<h3
						data-role="username"
						class="text-sm font-semibold text-white tracking-wide"
					>
						${username}
					</h3>

					<!-- 📊 DATA SLOT -->
					<div data-role="data">
						<div data-field="score" class="text-4xl font-mono text-yellow-400">0</div>
					</div>
				</div>`;
        } catch (error) {
            console.error("Errore caricamento profilo:", error);
            // Stato di Errore
            return loadErrorWidget(linkid);
        }
}

function loadErrorWidget(linkid:string): string
{
    return /* html */`
		<div class="player-widget relative flex flex-col items-center p-4 rounded-xl bg-slate-800/60 border border-white/10 shadow-lg backdrop-blur">

			<!-- Avatar -->
			<div class="relative group mb-2">
				⚠️
			</div>

			<!-- Username -->
			<h3
				data-role="username"
				class="text-sm font-semibold text-white tracking-wide"
			>
				${linkid}
			</h3>

			<!-- Subtitle -->
			<p class="text-[10px] text-indigo-300 uppercase tracking-widest mb-2">
				Could't load player profile
			</p>

			<!-- 📊 DATA SLOT -->
			<div data-role="data">
				<div data-field="score" class="text-4xl font-mono text-yellow-400">0</div>
			</div>
		</div>
	`;
}

function loadBotWidget(botid:string): string
{
    return /* html */`
		<div class="player-widget relative flex flex-col items-center p-4 rounded-xl bg-slate-800/60 border border-white/10 shadow-lg backdrop-blur">

			<!-- Avatar -->
			<div class="relative group mb-2">
				🤖
			</div>

			<!-- Username -->
			<h3
				data-role="username"
				class="text-sm font-semibold text-white tracking-wide"
			>
				${botid}
			</h3>

			<!-- 📊 DATA SLOT -->
			<div data-role="data">
				<div data-field="score" class="text-4xl font-mono text-yellow-400">0</div>
			</div>
		</div>
	`;
}

function loadGuestWidget(guestid:string): string
{
    return /* html */`
		<div class="player-widget relative flex flex-col items-center p-4 rounded-xl bg-slate-800/60 border border-white/10 shadow-lg backdrop-blur">

			<!-- Avatar -->
			<div class="relative group mb-2">
				🥷
			</div>

			<!-- Username -->
			<h3
				data-role="username"
				class="text-sm font-semibold text-white tracking-wide"
			>
				${guestid}
			</h3>

			<!-- 📊 DATA SLOT -->
			<div data-role="data">
				<div data-field="score" class="text-4xl font-mono text-yellow-400">0</div>
			</div>
		</div>
	`;
}