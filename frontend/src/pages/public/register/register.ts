import { router } from "@/router";
import { googleLoginFunction } from "../../../components/googleLogin";
import { sendPostRequest } from "@/services/api/sendRequests";
import { authService } from "@/services/authService";

export function loadRegisterPage(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col';
    div.innerHTML = /* html */ `
        <div class="flex-1 container mx-auto px-6 py-16 flex items-center justify-center">
            <section class="w-full max-w-md">
                <h1 class="text-4xl font-bold text-white mb-6 text-center">Create an Account</h1>
                <form id="register-form" class="bg-slate-800/70 backdrop-blur-sm rounded-lg p-6 space-y-4">
                    
                    <div class="flex space-x-4">
                        <div class="flex-1">
                            <label for="name" class="block text-sm font-medium text-white/80 mb-1">Name</label>
                            <input type="text" id="name" name="name" required
                                class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition"
                                placeholder="Mario" />
                        </div>
                        <div class="flex-1">
                            <label for="surname" class="block text-sm font-medium text-white/80 mb-1">Surname</label>
                            <input type="text" id="surname" name="surname" required
                                class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition"
                                placeholder="Rossi" />
                        </div>
                    </div>
                    <div>
                        <label for="username" class="block text-sm font-medium text-white/80 mb-1">Username</label>
                        <input type="text" id="username" name="username" required
                            class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition"
                            placeholder="Choose a username" />
                    </div>
                    <div>
                        <label for="email" class="block text-sm font-medium text-white/80 mb-1">Email</label>
                        <input type="email" id="email" name="email" required
                            class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition"
                            placeholder="you@example.com" />
                    </div>
                    <div>
                        <label for="password" class="block text-sm font-medium text-white/80 mb-1">Password</label>
                        <input type="password" id="password" name="password" required
                            class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition"
                            placeholder="Create a password" />
                    </div>

                    <p id="error-message" class="text-sm text-red-400 text-center hidden"></p>

                    <button type="submit"
                        id="register-submit-button"
                        class="w-full px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:ring-offset-2 focus:ring-offset-slate-900 transition">
                        Register
                    </button>
                    <p class="mt-4 text-center text-sm text-white/70">
                        Already have an account?
                        <a href="/login" data-link class="text-purple-300 hover:text-purple-200 font-medium">Sign in</a>
                    </p>
                    <hr>
                    <button type="button"
                        id="register-google-button"
                        class="w-full px-4 py-3 rounded-xl font-semibold text-slate-900 bg-stone-300 hover:bg-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400/50 focus:ring-offset-2 focus:ring-offset-slate-900 transition"
                        >
                        Register with Google
                        <img src="/assets/icons/google.svg" alt="Google Logo" class="inline-block w-5 h-5 ml-2 -mt-1"/>
                    </button>
                </form>
            </section>
        </div>
    `;

    // Seleziona gli elementi del form
    const form = div.querySelector('#register-form') as HTMLFormElement;
    const nameInput = div.querySelector('#name') as HTMLInputElement;
    const surnameInput = div.querySelector('#surname') as HTMLInputElement;
    const usernameInput = div.querySelector('#username') as HTMLInputElement;
    const emailInput = div.querySelector('#email') as HTMLInputElement;
    const passwordInput = div.querySelector('#password') as HTMLInputElement;
    const errorEl = div.querySelector('#error-message') as HTMLParagraphElement;
    const submitButton = div.querySelector('#register-submit-button') as HTMLButtonElement;

    // Event listener per la REGISTRAZIONE STANDARD (rimane invariato)
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        errorEl.classList.add('hidden');
        errorEl.textContent = '';
        submitButton.disabled = true;
        submitButton.textContent = 'Registering...';

        const formData = {
            name: nameInput.value,
            surname: surnameInput.value,
            username: usernameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
        };

        try {
            const response = await fetch(`/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Registrazione fallita');
            }

            // === SUCCESSO ===
            console.log('Registrazione riuscita:', data);
            // TODO: (Ideale) Effettuare il login automatico qui
            router.push('/login'); // O reindirizza a /home se gestisci il token
        } catch (error) {
            // === ERRORE ===
            let errorMessage = "Si è verificato un errore sconosciuto.";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            errorEl.textContent = errorMessage;
            errorEl.classList.remove('hidden');
            submitButton.disabled = false;
            submitButton.textContent = 'Register';
        }
    });

    // === Google Register Button (AGGIORNATO) ===
    const googleButton = div.querySelector('#register-google-button') as HTMLButtonElement;
    googleButton.addEventListener('click', async () => {
        try {
            const userInfo = await googleLoginFunction(import.meta.env.VITE_CLIENT_ID || '');
            console.log("User info received:", userInfo);

            // 1. Chiama il nuovo endpoint /api/auth/google
            const data = await sendPostRequest(`/api/auth/google`,
                {
                    name: userInfo.given_name,
                    surname: userInfo.family_name,
                    email: userInfo.email,
                    googleId: userInfo.id
                },
                'application/json'
            );
            
            // 2. Gestisci il successo (come il login standard)
            console.log('Registrazione con Google riuscita:', data);
            
            // Update auth service state - user data could be at root or in data.user
            const userData = data.user || data;
            authService.setAuthState(userData, userData?.twoFactorEnabled ?? false);

            // 3. Reindirizza
            window.location.pathname = '/home';

        } catch (error) {
            // 4. Gestisci l'errore
            console.error('Errore durante la registrazione con Google:', error);
            let errorMessage = "Errore Google Register. Riprova.";
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
