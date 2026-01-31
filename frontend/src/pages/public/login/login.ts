import { googleLoginFunction } from "@/components/googleLogin";
import { router } from "@/router";
import { sendPostRequest } from "@/services/api/sendRequests";
import { authService } from "@/services/authService";

export function loadLoginPage(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col';
    div.innerHTML = /* html */ `
        <main class="flex-1 container mx-auto px-6 py-16 flex items-center justify-center">
            <section class="w-full max-w-md">
                <div class="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur border border-white/10 shadow-xl">
                    <div class="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br from-purple-600/20 to-pink-600/20 blur-2xl"></div>
                    <div class="relative z-10 p-8">
                        <header class="mb-8 text-center">
                            <h1 class="text-3xl font-bold text-white tracking-tight">Welcome back</h1>
                            <p class="mt-2 text-white/70">Please sign in to continue</p>
                        </header>

                        <form id="login-form" class="space-y-5" novalidate>
                            <div>
                                <label for="email" class="block text-sm font-medium text-white/80 mb-2">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    autocomplete="email"
                                    placeholder="you@example.com"
                                    class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition"
                                    required
                                />
                            </div>

                            <div>
                                <label for="password" class="block text-sm font-medium text-white/80 mb-2">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    autocomplete="current-password"
                                    placeholder="••••••••••"
                                    class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition"
                                    required
                                />
                            </div>

                            <div class="flex items-center justify-between text-sm">
                                <a href="/forgot" data-link class="text-purple-300 hover:text-purple-200">Forgot password?</a>
                            </div>

                            <p id="error-message" class="text-sm text-red-400 text-center hidden"></p>

                            <button
                                type="submit"
                                id="login-submit-button"
                                class="mt-2 w-full px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:ring-offset-2 focus:ring-offset-slate-900 transition"
                            >
                                Sign in
                            </button>

                            <p class="mt-6 text-center text-sm text-white/70">
                                Don't have an account?
                                <a href="/register" data-link class="text-purple-300 hover:text-purple-200 font-medium">Create one</a>
                            </p>
                            <hr class="my-6 border-white/10" />
                            
                            <button
                                type="button"
                                id="login-google-button"
                                class="w-full px-4 py-3 rounded-xl font-semibold text-slate-900 bg-stone-300 hover:bg-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400/50 focus:ring-offset-2 focus:ring-offset-slate-900 transition"
                            >
                                Sign in with Google
                                <img src="/assets/icons/google.svg" alt="Google Logo" class="inline-block w-5 h-5 ml-2 -mt-1"/>
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    `;

    // Seleziona gli elementi del form
    const form = div.querySelector('#login-form') as HTMLFormElement;
    const emailInput = div.querySelector('#email') as HTMLInputElement;
    const passwordInput = div.querySelector('#password') as HTMLInputElement;
    const errorEl = div.querySelector('#error-message') as HTMLParagraphElement;
    const submitButton = div.querySelector('#login-submit-button') as HTMLButtonElement;

    // Event listener per il LOGIN STANDARD (rimane invariato)
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); 
        errorEl.classList.add('hidden');
        errorEl.textContent = '';
        submitButton.disabled = true;
        submitButton.textContent = 'Signing in...';

        const email = emailInput.value;
        const password = passwordInput.value;
        
        if (!email || !password) {
            errorEl.textContent = 'Inserisci email e password';
            errorEl.classList.remove('hidden');
            return;
        }

        try {
            const response = await fetch(`/api/login`,{ 
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!response.ok) {
                // Check if 2FA is required
                if (response.status === 401 && data.twoFactorRequired) {
                    // Store email for 2FA verification
                    sessionStorage.setItem('2fa-email', email);
                    errorEl.textContent = '2FA verification required. Redirecting...';
                    errorEl.classList.remove('hidden');
                    
                    // Redirect to 2FA page (you'll need to create this)
                    setTimeout(() => {
                        router.push('/2fa-verify');
                    }, 1000);
                    return;
                }
                
                throw new Error(data.error || 'Login fallito');
            }
            
            // === SUCCESSO ===
            // console.log('Login riuscito:', data);

            // Backend sends { ...user, user, ok: true }
            // User data is both at root level and in data.user
            const userData = data.user || data;
            authService.setAuthState(userData, userData?.twoFactorEnabled ?? false);

            /* @ecarbona @topiana business */
            /* const socket =  *//* ConnectLifecycleWebsocket() */;
            /* 	#TODO mettere il router sul butler e fare che ogni PAGE sia
                cleanable quindi con procedura di chiusura (distruzione div, 
                chiusura socket, rimozione eventListeners)
            */
            
            // emit auth event
            window.dispatchEvent(
                new CustomEvent('auth:login', { bubbles: true })
			);
            
            // Small delay to ensure cookies are set before navigation
            await new Promise(resolve => setTimeout(resolve, 100));
            router.push('/home');
            // router.back();

        } catch (error) {
            // === ERRORE ===
            let errorMessage = "Si è verificato un errore sconosciuto.";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            errorEl.textContent = errorMessage;
            errorEl.classList.remove('hidden');
            submitButton.disabled = false;
            submitButton.textContent = 'Sign in';
        }
    });

    // === Google Login Button (AGGIORNATO) ===
    const googleButton = div.querySelector('#login-google-button') as HTMLButtonElement;
    googleButton.addEventListener('click', async () => {
        try {
            const userInfo = await googleLoginFunction(import.meta.env.VITE_CLIENT_ID || '');
            // console.log('Google user info:', userInfo);

            // 1. Chiama il nuovo endpoint /api/auth/google
            const data = await sendPostRequest('/api/auth/google',
                {
                    name: userInfo.given_name,
                    surname: userInfo.family_name,
                    email: userInfo.email,
                    googleId: userInfo.id
                }, 
                'application/json'
            );

            // 2. Gestisci il successo (come il login standard)
            // console.log('Login con Google riuscito:', data);
            
            // Update auth service state - user data could be at root or in data.user
            const userData = data.user || data;
            authService.setAuthState(userData, userData?.twoFactorEnabled ?? false);

            // 3. Reindirizza
            router.push('/home');
            // router.back();

        } catch (error) {
            // 4. Gestisci l'errore
            console.error('Errore durante il login con Google:', error);
            let errorMessage = "Errore Google Login. Riprova.";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            // Mostra l'errore nell'UI
            errorEl.textContent = errorMessage;
            errorEl.classList.remove('hidden');
        }
    });

    return div;
}
