/**
 * In-page toast notification service
 * Shows notifications that slide in from the right side of the page
 */

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'message';

interface ToastOptions {
    type?: ToastType;
    duration?: number; // milliseconds, 0 for persistent
    icon?: string;
    onClickDiv?: () => void;
    onClickAccept?: () => void;
    onClickDecline?: () => void;
}

class ToastNotificationService {
    private container: HTMLElement | null = null;
    // private toastCount = 0;

    /**
     * Initialize the toast container
     */
    private initContainer(): void {
        if (this.container) return;

        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        this.container.className = 'fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none';
        document.body.appendChild(this.container);
    }

    /**
     * Show a toast notification
     */
    show(title: string, message: string, options: ToastOptions = {}): void {
        this.initContainer();

        const {
            type = 'info',
            duration = 5000,
            icon,
            onClickDiv,
            onClickAccept,
            onClickDecline
        } = options;

        const toast = this.createToast(title, message, type, icon, onClickDiv, onClickAccept, onClickDecline);
        this.container!.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('toast-enter');
        });

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                this.removeToast(toast);
            }, duration);
        }
    }

    /**
     * Create a toast element
     */
    private createToast(
        title: string,
        message: string,
        type: ToastType,
        customIcon?: string,
        onClickDiv?: () => void,
        onClickAccept?: () => void,
        onClickDecline?: () => void
    ): HTMLElement {
        const toast = document.createElement('div');
        toast.className = `toast pointer-events-auto w-96 max-w-[calc(100vw-2rem)] bg-slate-800 border border-slate-700 rounded-lg shadow-2xl overflow-hidden transform transition-all duration-300 ease-out translate-x-[120%] opacity-0`;
        
        const colors = this.getTypeColors(type);
        const icon = customIcon || this.getTypeIcon(type);
        let actionButtons = '';
        if (onClickAccept && onClickDecline) {
            actionButtons = `
                <div class="mt-3 flex gap-2">
                    <button class="toast-accept flex-1 px-4 py-2 text-sm font-medium rounded-md bg-emerald-600 text-white hover:bg-emerald-500 transition">Accept</button>
                    <button class="toast-decline flex-1 px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-500 transition">Decline</button>
                </div>
            `;
        }
        toast.innerHTML = /* html */`
            <div class="flex items-start p-4 gap-3 ${onClickDiv ? 'cursor-pointer hover:bg-slate-700/50 transition' : ''}">
                <div class="flex-shrink-0 w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center text-2xl">
                    ${icon}
                </div>
                
                <div class="flex-1 min-w-0">
                    <h4 class="text-white font-semibold text-sm mb-1">${this.escapeHtml(title)}</h4>
                    <p class="text-slate-300 text-sm leading-relaxed">${this.escapeHtml(message)}</p>
                    ${actionButtons}
                </div>
                
                <button class="flex-shrink-0 text-slate-400 hover:text-white transition p-1 rounded hover:bg-slate-700" aria-label="Close">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <div class="h-1 ${colors.progress} toast-progress"></div>
        `;

        // Close button handler
        const closeBtn = toast.querySelector('button');
        closeBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeToast(toast);
        });

        // Click handler
        if (onClickDiv) {
            toast.addEventListener('click', () => {
                onClickDiv();
                this.removeToast(toast);
            });
        }

        const acceptBtn = toast.querySelector('.toast-accept');
        if (acceptBtn && onClickAccept) {
            acceptBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                onClickAccept();
                this.removeToast(toast);
            });
        }

        const declineBtn = toast.querySelector('.toast-decline');
        if (declineBtn && onClickDecline) {
            declineBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                onClickDecline();
                this.removeToast(toast);
            });
        }
        
        return toast;
    }

    /**
     * Remove a toast with animation
     */
    private removeToast(toast: HTMLElement): void {
        toast.classList.remove('toast-enter');
        toast.classList.add('toast-exit');

        setTimeout(() => {
            toast.remove();
        }, 300);
    }

    /**
     * Get colors for toast type
     */
    private getTypeColors(type: ToastType): { bg: string; progress: string } {
        const colors = {
            success: {
                bg: 'bg-green-500/20 text-green-400',
                progress: 'bg-green-500'
            },
            error: {
                bg: 'bg-red-500/20 text-red-400',
                progress: 'bg-red-500'
            },
            warning: {
                bg: 'bg-yellow-500/20 text-yellow-400',
                progress: 'bg-yellow-500'
            },
            info: {
                bg: 'bg-blue-500/20 text-blue-400',
                progress: 'bg-blue-500'
            },
            message: {
                bg: 'bg-purple-500/20 text-purple-400',
                progress: 'bg-purple-500'
            }
        };

        return colors[type];
    }

    /**
     * Get icon for toast type
     */
    private getTypeIcon(type: ToastType): string {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ',
            message: '💬'
        };

        return icons[type];
    }

    /**
     * Escape HTML to prevent XSS
     */
    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Convenience methods
     */
    success(title: string, message: string, duration?: number): void {
        this.show(title, message, { type: 'success', duration });
    }

    error(title: string, message: string, duration?: number): void {
        this.show(title, message, { type: 'error', duration });
    }

    warning(title: string, message: string, duration?: number): void {
        this.show(title, message, { type: 'warning', duration });
    }

    info(title: string, message: string, onClickDiv?: () => void, duration?: number): void {
        this.show(title, message, { type: 'info', onClickDiv, duration });
    }

    message(title: string, message: string, onClickDiv?: () => void, duration?: number): void {
        this.show(title, message, {type: 'message', onClickDiv, duration});
    }

    invite(title: string, message: string,
            onClickDiv?: () => void,
            onClickAccept?: () => void,
            onClickDecline?: () => void,
            duration?: number): void {
        this.show(title, message, {type: 'message', onClickDiv, onClickAccept, onClickDecline, duration});
    }

    friend(title: string, message: string,
            onClickDiv?: () => void,
            onClickAccept?: () => void,
            onClickDecline?: () => void,
            duration?: number): void {
        this.show(title, message, {type: 'message', onClickDiv, onClickAccept, onClickDecline, duration});
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .toast-enter {
        transform: translateX(0) !important;
        opacity: 1 !important;
    }

    .toast-exit {
        transform: translateX(120%) !important;
        opacity: 0 !important;
    }

    .toast-progress {
        animation: toast-progress 5s linear forwards;
    }

    @keyframes toast-progress {
        from {
            width: 100%;
        }
        to {
            width: 0%;
        }
    }
`;
document.head.appendChild(style);

// Export singleton instance
export const toastNotification = new ToastNotificationService();