// import { googleLoginFunction } from "@/components/googleLogin";
import { router } from "@/router";
// import { sendPostRequest } from "@/services/api/sendRequests";
// import { persistSession } from "@/services/session";

export function loadSelectionPage(): HTMLElement {
    const div = document.createElement('div');
    // Main container: a flex-row on desktop, flex-col on mobile
    div.className = 'min-h-screen w-full flex flex-col md:flex-row bg-slate-900 overflow-hidden';

    div.innerHTML = /* html */ `
        <div id="btn-local" class="group relative flex-1 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 ease-in-out hover:flex-[1.5] bg-gradient-to-br from-slate-900 via-pink-900/20 to-slate-900 border-b md:border-b-0 md:border-r border-white/10">
            <div class="absolute inset-0 bg-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div class="relative z-10 text-center transform group-hover:scale-110 transition-transform duration-500">
                <div class="text-6xl mb-4 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]">
                    💻 🕹️
                </div>
                <h2 class="text-4xl font-black text-white tracking-tighter uppercase italic group-hover:text-pink-400 transition-colors">
                    Local Host
                </h2>
                <p class="text-pink-200/50 mt-2 font-medium tracking-widest uppercase text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    Same Screen Action
                </p>
            </div>
        </div>

        <div id="btn-online" class="group relative flex-1 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 ease-in-out hover:flex-[1.5] bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
            <div class="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div class="relative z-10 text-center transform group-hover:scale-110 transition-transform duration-500">
                <div class="text-6xl mb-4 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                    🎮 👤
                </div>
                <h2 class="text-4xl font-black text-white tracking-tighter uppercase italic group-hover:text-blue-400 transition-colors">
                    Play Online
                </h2>
                <p class="text-blue-200/50 mt-2 font-medium tracking-widest uppercase text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    Compete Globally
                </p>
            </div>
        </div>
    `;

    // Event Listeners for Routing
    div.querySelector('#btn-local')?.addEventListener('click', () => {
        // Replace this with your actual router logic (e.g., router.push('/local'))
        // console.log('Navigating to /local');
        router.push('/local');
    });

    div.querySelector('#btn-online')?.addEventListener('click', () => {
        // Replace this with your actual router logic (e.g., router.push('/login'))
        // console.log('Navigating to /login');
        router.push('/login');
    });

    return div;
}
