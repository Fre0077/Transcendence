import { loadNavbar } from "@/components/navbar";

export function loadOnlineGamePage(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col';
    div.innerHTML = /*html*/ `
    ${loadNavbar().outerHTML}

    <!-- Online Game Page Content -->
    <!--
    <div class="flex-1 container mx-auto px-6 py-16 flex flex-col items-center justify-center">
        <h1 class="text-4xl font-bold text-white mb-8">Online Game</h1>
        <p class="text-white/70 mb-12">Create or join an online game to start playing with others!</p>

        <div class="flex flex-row gap-8 w-full max-w-4xl items-center justify-center">
            <a href="/lobby/create" class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600/30 to-teal-600/30 p-8 border border-white/10 hover:border-green-400/50 transition-all hover:scale-105">
                <div class="relative z-10">
                    <div class="text-6xl mb-4">➕</div>
                    <h3 class="text-2xl font-bold text-white mb-2">Create Lobby</h3>
                    <p class="text-white/70">Host a new online game lobby</p>
                </div>
                <div class="absolute inset-0 bg-gradient-to-br from-green-600/0 to-teal-600/0 group-hover:from-green-600/20 group-hover:to-teal-600/20 transition"></div>
            </a>

            <a href="/lobby/join" class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-600/30 to-orange-600/30 p-8 border border-white/10 hover:border-yellow-400/50 transition-all hover:scale-105">
                <div class="relative z-10">
                    <div class="text-6xl mb-4">🔗</div>
                    <h3 class="text-2xl font-bold text-white mb-2">Join Lobby</h3>
                    <p class="text-white/70">Enter a code to join an existing lobby</p>
                </div>
                <div class="absolute inset-0 bg-gradient-to-br from-yellow-600/0 to-orange-600/0 group-hover:from-yellow-600/20 group-hover:to-orange-600/20 transition"></div>
            </a>
        </div>
    </div>
    -->
    `;
    return div;
}