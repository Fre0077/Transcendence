import { loadNavbar } from '@/components/navbar';
import { loadStoredSession } from '@/services/session';

export async function load2FASetupPage(): Promise<HTMLElement> {
    const container = document.createElement('div');
    container.className = 'min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900';

    // Add navbar
    container.appendChild(loadNavbar());

    // Main content
    const content = document.createElement('div');
    content.className = 'py-12 px-4';
    content.innerHTML =
        '<div class="max-w-2xl mx-auto">' +
            '<div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">' +
                '<div class="flex items-center gap-4 mb-6">' +
                    '<div class="text-4xl">🔐</div>' +
                    '<div>' +
                        '<h1 class="text-3xl font-bold text-white">Two-Factor Authentication</h1>' +
                        '<p class="text-white/70 text-sm">Add an extra layer of security to your account</p>' +
                    '</div>' +
                '</div>' +

                '<div id="tfa-disabled" class="space-y-6 hidden">' +
                    '<div class="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">' +
                        '<p class="text-white/90 text-sm"><strong>Why enable 2FA?</strong></p>' +
                        '<ul class="text-white/80 text-sm mt-2 space-y-1 list-disc list-inside">' +
                            '<li>Protect your account from unauthorized access</li>' +
                            '<li>Secure your profile and game statistics</li>' +
                            '<li>Required for competitive tournaments</li>' +
                        '</ul>' +
                    '</div>' +

                    '<button id="generate-qr" class="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg">' +
                        'Enable Two-Factor Authentication' +
                    '</button>' +
                '</div>' +

                '<div id="qr-section" class="hidden space-y-6">' +
                    '<div class="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">' +
                        '<p class="text-white/90 text-sm"><strong>⚠️ Important:</strong> Save your backup codes in a safe place. You\'ll need them if you lose access to your authenticator app.</p>' +
                    '</div>' +

                    '<div class="bg-white rounded-lg p-6 text-center">' +
                        '<p class="text-gray-700 font-semibold mb-4">1. Scan this QR code with your authenticator app</p>' +
                        '<div class="flex justify-center mb-4">' +
                            '<img id="qr-code" class="border-4 border-gray-200 rounded-lg" width="200" height="200" alt="QR Code" />' +
                        '</div>' +
                        '<div class="text-xs text-gray-600">' +
                            '<p class="font-semibold mb-2">Or enter this code manually:</p>' +
                            '<code id="manual-secret" class="bg-gray-100 px-3 py-2 rounded font-mono text-sm"></code>' +
                        '</div>' +
                    '</div>' +

                    '<form id="enable-form" class="space-y-4">' +
                        '<div>' +
                            '<label class="block text-white font-semibold mb-2">2. Enter the verification code from your app</label>' +
                            '<input ' +
                                'type="text" ' +
                                'id="verify-code" ' +
                                'maxlength="6" ' +
                                'pattern="[0-9]{6}" ' +
                                'placeholder="000000" ' +
                                'autocomplete="off" ' +
                                'class="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 text-center text-2xl tracking-widest font-mono" ' +
                                'required ' +
                            '/>' +
                        '</div>' +
                        '<button type="submit" class="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg">' +
                            'Confirm & Enable 2FA' +
                        '</button>' +
                        '<button type="button" id="cancel-enable" class="w-full text-white/70 hover:text-white py-2 text-sm transition-colors">' +
                            'Cancel' +
                        '</button>' +
                    '</form>' +
                '</div>' +

                '<div id="tfa-enabled" class="hidden space-y-6">' +
                    '<div class="bg-green-500/20 border border-green-500 rounded-lg p-6 text-center">' +
                        '<div class="text-4xl mb-2">✓</div>' +
                        '<p class="text-white font-semibold text-lg">Two-Factor Authentication is Active</p>' +
                        '<p class="text-white/80 text-sm mt-2">Your account is protected with an extra layer of security</p>' +
                    '</div>' +

                    '<div class="bg-white/5 border border-white/10 rounded-lg p-4">' +
                        '<p class="text-white/90 text-sm mb-2"><strong>What happens when 2FA is enabled:</strong></p>' +
                        '<ul class="text-white/80 text-sm space-y-1 list-disc list-inside">' +
                            '<li>You\'ll need your authenticator app to log in</li>' +
                            '<li>Your account is protected even if someone knows your password</li>' +
                            '<li>You can disable 2FA anytime using your password</li>' +
                        '</ul>' +
                    '</div>' +

                    '<form id="disable-form" class="space-y-4">' +
                        '<div>' +
                            '<label class="block text-white font-semibold mb-2">Enter your password to disable 2FA</label>' +
                            '<input ' +
                                'type="password" ' +
                                'id="disable-password" ' +
                                'placeholder="Your password" ' +
                                'autocomplete="current-password" ' +
                                'class="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/50" ' +
                                'required ' +
                            '/>' +
                        '</div>' +
                        '<button type="submit" class="w-full bg-red-600 text-white py-4 rounded-lg font-semibold hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg">' +
                            'Disable Two-Factor Authentication' +
                        '</button>' +
                    '</form>' +
                '</div>' +

                '<div id="loading" class="text-center py-8 hidden">' +
                    '<div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white/30 border-t-white"></div>' +
                    '<p class="text-white/70 mt-4">Loading...</p>' +
                '</div>' +

                '<div id="error-message" class="mt-4 text-red-400 text-sm p-3 bg-red-500/10 rounded-lg border border-red-500/30 hidden"></div>' +
                '<div id="success-message" class="mt-4 text-green-400 text-sm p-3 bg-green-500/10 rounded-lg border border-green-500/30 hidden"></div>' +
            '</div>' +
        '</div>';

    container.appendChild(content);

    // Get elements
    const disabledSection = content.querySelector('#tfa-disabled') as HTMLElement;
    const qrSection = content.querySelector('#qr-section') as HTMLElement;
    const enabledSection = content.querySelector('#tfa-enabled') as HTMLElement;
    const loadingSection = content.querySelector('#loading') as HTMLElement;
    const generateBtn = content.querySelector('#generate-qr') as HTMLButtonElement;
    const qrImg = content.querySelector('#qr-code') as HTMLImageElement;
    const manualSecret = content.querySelector('#manual-secret') as HTMLElement;
    const enableForm = content.querySelector('#enable-form') as HTMLFormElement;
    const verifyCodeInput = content.querySelector('#verify-code') as HTMLInputElement;
    const cancelEnableBtn = content.querySelector('#cancel-enable') as HTMLButtonElement;
    const disableForm = content.querySelector('#disable-form') as HTMLFormElement;
    const disablePasswordInput = content.querySelector('#disable-password') as HTMLInputElement;
    const errorEl = content.querySelector('#error-message') as HTMLElement;
    const successEl = content.querySelector('#success-message') as HTMLElement;

    function hideAllSections() {
        disabledSection.classList.add('hidden');
        qrSection.classList.add('hidden');
        enabledSection.classList.add('hidden');
        loadingSection.classList.add('hidden');
    }

    function showError(message: string) {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
        setTimeout(() => errorEl.classList.add('hidden'), 5000);
    }

    function showSuccess(message: string) {
        successEl.textContent = message;
        successEl.classList.remove('hidden');
        setTimeout(() => successEl.classList.add('hidden'), 5000);
    }

    // Check current 2FA status
    async function check2FAStatus() {
        hideAllSections();
        loadingSection.classList.remove('hidden');

        try {
            const response = await fetch('/api/profile', {
                credentials: 'include'
            });
            const data = await response.json();

            hideAllSections();
            if (data.twoFactorEnabled) {
                enabledSection.classList.remove('hidden');
            } else {
                disabledSection.classList.remove('hidden');
            }
            if (!data.twoFactorEnabled) {
              generateBtn.textContent = 'Generate QR Code';
              generateBtn.disabled = false;
            }
        } catch (error) {
            console.error('Error checking 2FA status:', error);
            hideAllSections();
            disabledSection.classList.remove('hidden');
            showError('Failed to check 2FA status');
        }
    }

    // Generate QR code
    generateBtn.addEventListener('click', async () => {
        errorEl.classList.add('hidden');
        successEl.classList.add('hidden');
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';

        try {
            const response = await fetch('/api/2fa/generate', {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({})
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Failed to generate QR code');

            qrImg.src = data.qrCodeUrl;
            manualSecret.textContent = data.secret;

            hideAllSections();
            qrSection.classList.remove('hidden');
            setTimeout(() => verifyCodeInput.focus(), 100);

        } catch (error: any) {
            showError(error.message || 'Failed to generate QR code');
            generateBtn.disabled = false;
            generateBtn.textContent = 'Enable Two-Factor Authentication';
        }
    });

    // Auto-format verify code input
    verifyCodeInput.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        target.value = target.value.replace(/[^0-9]/g, '');
    });

    // Cancel enable
    cancelEnableBtn.addEventListener('click', () => {
        verifyCodeInput.value = '';
        check2FAStatus();
    });

    // Enable 2FA
    enableForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorEl.classList.add('hidden');
        successEl.classList.add('hidden');

        const code = verifyCodeInput.value.trim();

        if (code.length !== 6) {
            showError('Please enter a valid 6-digit code');
            verifyCodeInput.focus();
            return;
        }

        const submitBtn = enableForm.querySelector('button[type="submit"]') as HTMLButtonElement;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enabling...';

        try {
            const response = await fetch('/api/2fa/enable', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Failed to enable 2FA');

            showSuccess('✓ Two-Factor Authentication enabled successfully!');
            verifyCodeInput.value = '';

            setTimeout(() => {
                hideAllSections();
                enabledSection.classList.remove('hidden');
            }, 2000);

        } catch (error: any) {
            showError(error.message || 'Failed to enable 2FA. Please check your code and try again.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Confirm & Enable 2FA';
            verifyCodeInput.value = '';
            verifyCodeInput.focus();
        }
    });

    // Disable 2FA
    disableForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorEl.classList.add('hidden');
        successEl.classList.add('hidden');

        const password = disablePasswordInput.value.trim();

        if (!password) {
            showError('Please enter your password');
            disablePasswordInput.focus();
            return;
        }

        const submitBtn = disableForm.querySelector('button[type="submit"]') as HTMLButtonElement;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Disabling...';

        try {
            const session = loadStoredSession();
            const response = await fetch('/api/2fa/disable', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password,
                    email: session.user?.email
                }),
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Failed to disable 2FA');

            showSuccess('✓ Two-Factor Authentication disabled successfully');
            disablePasswordInput.value = '';

            setTimeout(() => {
                hideAllSections();
                disabledSection.classList.remove('hidden');
            }, 2000);

        } catch (error: any) {
            showError(error.message || 'Failed to disable 2FA. Please check your password and try again.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Disable Two-Factor Authentication';
            disablePasswordInput.value = '';
            disablePasswordInput.focus();
        }
    });

    // Initial check
    await check2FAStatus();

    return container;
}
