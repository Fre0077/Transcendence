import { router } from '@/router';
import { persistSession } from '@/services/session';
import { authService } from '@/services/authService';

export function load2FAVerifyPage(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4';
    
    const email = sessionStorage.getItem('2fa-email') || '';
    
    container.innerHTML = 
        '<div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/20">' +
            '<div class="text-center mb-8">' +
                '<div class="text-5xl mb-4">🔐</div>' +
                '<h2 class="text-3xl font-bold text-white mb-2">Two-Factor Authentication</h2>' +
                '<p class="text-white/80 text-sm">Enter the 6-digit code from your authenticator app</p>' +
            '</div>' +
            
            '<form id="tfa-verify-form" class="space-y-6">' +
                '<div>' +
                    '<input ' +
                        'type="text" ' +
                        'id="tfa-code" ' +
                        'maxlength="6" ' +
                        'pattern="[0-9]{6}" ' +
                        'placeholder="000000" ' +
                        'autocomplete="off" ' +
                        'class="w-full px-4 py-4 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 text-center text-3xl tracking-[0.5em] font-mono" ' +
                        'required ' +
                    '/>' +
                '</div>' +
                
                '<div id="error-message" class="text-red-400 text-sm text-center p-3 bg-red-500/10 rounded-lg border border-red-500/30 hidden"></div>' +
                
                '<button ' +
                    'type="submit" ' +
                    'id="verify-button" ' +
                    'class="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">' +
                    'Verify & Login' +
                '</button>' +
                
                '<button ' +
                    'type="button" ' +
                    'id="back-to-login" ' +
                    'class="w-full text-white/70 hover:text-white py-2 text-sm transition-colors flex items-center justify-center gap-2">' +
                    '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
                        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>' +
                    '</svg>' +
                    'Back to Login' +
                '</button>' +
            '</form>' +
        '</div>';
    
    const form = container.querySelector('#tfa-verify-form') as HTMLFormElement;
    const codeInput = container.querySelector('#tfa-code') as HTMLInputElement;
    const errorEl = container.querySelector('#error-message') as HTMLElement;
    const verifyButton = container.querySelector('#verify-button') as HTMLButtonElement;
    const backBtn = container.querySelector('#back-to-login') as HTMLButtonElement;
    
    // Auto-focus on code input
    setTimeout(() => codeInput.focus(), 100);
    
    // Auto-format input (only allow numbers)
    codeInput.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        target.value = target.value.replace(/[^0-9]/g, '');
        
        // Hide error when user starts typing
        if (errorEl && !errorEl.classList.contains('hidden')) {
            errorEl.classList.add('hidden');
        }
    });
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorEl.classList.add('hidden');
        
        const code = codeInput.value.trim();
        
        if (code.length !== 6) {
            errorEl.textContent = 'Please enter a valid 6-digit code';
            errorEl.classList.remove('hidden');
            codeInput.focus();
            return;
        }
        
        // Disable form during submission
        codeInput.disabled = true;
        verifyButton.disabled = true;
        verifyButton.textContent = 'Verifying...';
        
        try {
            const response = await fetch('/api/2fa/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
                credentials: 'include'
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Invalid 2FA code');
            }
            
            // Backend sends { ...user, user, ok: true }
            // User data is both at root level and in data.user
            const userData = data.user || data;
            
            // Store user data
            persistSession(null, userData, null);
            authService.setAuthState(userData, userData?.twoFactorEnabled ?? false);
            
            // Clear 2FA email from session
            sessionStorage.removeItem('2fa-email');
            
            // Dispatch login event
            window.dispatchEvent(new CustomEvent('auth:login', { bubbles: true }));
            
            // Success feedback
            verifyButton.textContent = '✓ Verified!';
            verifyButton.className = 'w-full bg-green-600 text-white py-4 rounded-lg font-semibold';
            
            // Redirect to home
            setTimeout(() => {
                router.push('/home');
            }, 500);
            
        } catch (error: any) {
            errorEl.textContent = error.message || 'Verification failed. Please try again.';
            errorEl.classList.remove('hidden');
            codeInput.value = '';
            codeInput.disabled = false;
            codeInput.focus();
            verifyButton.disabled = false;
            verifyButton.textContent = 'Verify & Login';
        }
    });
    
    backBtn.addEventListener('click', () => {
        sessionStorage.removeItem('2fa-email');
        router.push('/login');
    });
    
    return container;
}
