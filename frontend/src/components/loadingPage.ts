/**
 * Loading Page Component
 * Displays an animated loading screen during route transitions and authentication checks
 */

export function createLoadingPage(message: string = 'Loading...'): HTMLElement {
    const div = document.createElement('div');
    div.className = 'fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center z-50';
    div.innerHTML = /* html */ `
        <div class="flex flex-col items-center space-y-8">
            <!-- Logo/Brand -->
            <div class="text-center">
                <h1 class="text-5xl font-bold text-white mb-2 animate-pulse">ft_transcendence</h1>
                <div class="h-1 w-64 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 rounded-full overflow-hidden">
                    <div class="h-full bg-white animate-loading-bar"></div>
                </div>
            </div>
            
            <!-- Animated Spinner -->
            <div class="relative">
                <div class="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                <div class="absolute inset-0 w-16 h-16 border-4 border-pink-500/30 border-b-pink-500 rounded-full animate-spin-reverse"></div>
            </div>
            
            <!-- Loading Message -->
            <p class="text-white/70 text-lg animate-pulse">${message}</p>
            
            <!-- Dots Animation -->
            <div class="flex space-x-2">
                <div class="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style="animation-delay: 0s"></div>
                <div class="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                <div class="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
        </div>
    `;
    return div;
}

/**
 * Show a minimal inline loading indicator (for use within pages)
 */
export function createInlineLoader(size: 'sm' | 'md' | 'lg' = 'md'): HTMLElement {
    const sizeClasses = {
        sm: 'w-6 h-6 border-2',
        md: 'w-12 h-12 border-4',
        lg: 'w-16 h-16 border-4'
    };
    
    const div = document.createElement('div');
    div.className = 'flex items-center justify-center';
    div.innerHTML = /* html */ `
        <div class="${sizeClasses[size]} border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
    `;
    return div;
}
