/**
 * Browser notification service for chat messages
 * Handles permission requests and notification display
 */

export type NotificationPermissionStatus = 'granted' | 'denied' | 'default';

class NotificationService {
    private enabled: boolean = false;

    /**
     * Check if notifications are supported by the browser
     */
    isSupported(): boolean {
        return 'Notification' in window;
    }

    /**
     * Get current notification permission status
     */
    getPermissionStatus(): NotificationPermissionStatus {
        if (!this.isSupported()) {
            return 'denied';
        }
        return Notification.permission;
    }

    /**
     * Request notification permission from user
     */
    async requestPermission(): Promise<NotificationPermissionStatus> {
        if (!this.isSupported()) {
            console.warn('Notifications are not supported in this browser');
            return 'denied';
        }

        if (Notification.permission === 'granted') {
            this.enabled = true;
            return 'granted';
        }

        if (Notification.permission === 'denied') {
            return 'denied';
        }

        try {
            const permission = await Notification.requestPermission();
            this.enabled = permission === 'granted';
            return permission;
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            return 'denied';
        }
    }

    /**
     * Enable notifications (requests permission if needed)
     */
    async enable(): Promise<boolean> {
        const permission = await this.requestPermission();
        return permission === 'granted';
    }

    /**
     * Disable notifications
     */
    disable(): void {
        this.enabled = false;
    }

    /**
     * Check if notifications are currently enabled
     */
    isEnabled(): boolean {
        return this.enabled && this.getPermissionStatus() === 'granted';
    }

    /**
     * Show a chat message notification
     */
    showMessageNotification(options: {
        chatId: number;
        chatName: string;
        senderName?: string;
        message: string;
        timestamp?: Date;
    }): Notification | null {
        if (!this.isEnabled()) {
            return null;
        }

        // Don't show notification if window is focused
        if (document.hasFocus()) {
            return null;
        }

        const { chatName, senderName, message, chatId } = options;
        
        const title = senderName ? `${senderName} in ${chatName}` : chatName;
        const body = this.truncateMessage(message, 100);

        try {
            const notification = new Notification(title, {
                body,
                icon: '/assets/icons/chat-icon.png', // You can customize this
                badge: '/assets/icons/badge-icon.png',
                tag: `chat-${chatId}`, // Reuse notification for same chat
                requireInteraction: false,
                data: { chatId } // Store chatId for click handling
            });

            // Handle notification click - navigate to chat
            notification.onclick = () => {
                window.focus();
                this.navigateToChat(chatId);
                notification.close();
            };

            return notification;
        } catch (error) {
            console.error('Error showing notification:', error);
            return null;
        }
    }

    /**
     * Show a generic notification
     */
    showNotification(title: string, options?: NotificationOptions): Notification | null {
        if (!this.isEnabled()) {
            return null;
        }

        try {
            return new Notification(title, options);
        } catch (error) {
            console.error('Error showing notification:', error);
            return null;
        }
    }

    /**
     * Navigate to a specific chat (can be overridden)
     */
    private navigateToChat(chatId: number): void {
        // This will be handled by the router
        const event = new CustomEvent('chat:open', { detail: { chatId } });
        window.dispatchEvent(event);
        
        // Also update URL
        if (window.location.pathname !== '/chats') {
            window.history.pushState({}, '', `/chats?chat=${chatId}`);
        }
    }

    /**
     * Truncate message for notification display
     */
    private truncateMessage(message: string, maxLength: number): string {
        if (message.length <= maxLength) {
            return message;
        }
        return message.substring(0, maxLength - 3) + '...';
    }

    /**
     * Request permission with user-friendly prompt
     * Returns true if granted, false otherwise
     */
    async requestPermissionWithPrompt(): Promise<boolean> {
        if (!this.isSupported()) {
            alert('Your browser does not support notifications.');
            return false;
        }

        const status = this.getPermissionStatus();
        
        if (status === 'granted') {
            this.enabled = true;
            return true;
        }

        if (status === 'denied') {
            alert('Notifications are blocked. Please enable them in your browser settings.');
            return false;
        }

        // Show custom prompt before requesting (better UX)
        const userWants = confirm(
            'Enable notifications to receive real-time chat messages even when the tab is in the background.'
        );

        if (!userWants) {
            return false;
        }

        const permission = await this.requestPermission();
        
        if (permission === 'denied') {
            alert('Notification permission was denied.');
            return false;
        }

        return permission === 'granted';
    }
}

// Export singleton instance
export const notificationService = new NotificationService();
