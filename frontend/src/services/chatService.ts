/**
 * Global Chat Service - Singleton with HTTP API + Single WebSocket
 * Uses HTTP for data fetching (chat-list, message-list)
 * Uses single /ws/broadcast WebSocket for real-time updates
 * Stores data in IndexedDB and emits events for components
 */

import { loadStoredSession } from './session';
import { chatStorage, type Chat, type Message } from './storage/chatStorage';
import { notificationService } from './notificationService';

const CHAT_WS_URL = '/ws/broadcast';
const CHAT_HTTP_URL = '/api';

export type ChatEventType =
    | 'connected'
    | 'disconnected'
    | 'chats-updated'
    | 'message-received'
    | 'unread-updated'
    | 'error';

export interface ChatEventData {
    connected: { reconnect: boolean };
    disconnected: { reason?: string };
    'chats-updated': { chats: Chat[] };
    'message-received': { chatId: number; message: Message };
    'unread-updated': { chatId: number; count: number; total: number };
    error: { message: string; error?: any };
}

type ChatEventListener<T extends ChatEventType> = (data: ChatEventData[T]) => void;

class ChatService {
    private static instance: ChatService | null = null;

    private broadcastWs: WebSocket | null = null;

    private userId: number | null = null;
    private isInitialized: boolean = false;
    private isConnecting: boolean = false;

    // Auto-reconnect
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 10;
    private reconnectDelay: number = 3000;
    private reconnectTimer: NodeJS.Timeout | null = null;

    // Event listeners
    private listeners: Map<ChatEventType, Set<Function>> = new Map();

    private constructor() {
        // Private constructor for singleton
    }

    /**
     * Get singleton instance
     */
    static getInstance(): ChatService {
        if (!ChatService.instance) {
            ChatService.instance = new ChatService();
        }
        return ChatService.instance;
    }

    /**
     * Initialize the chat service with user credentials
     */
    async initialize(): Promise<boolean> {
        if (this.isInitialized) {
            // console.log('[ChatService] Already initialized');
            return true;
        }

        const session = loadStoredSession();
        this.userId = session.userId;

        if (!this.userId) {
            console.error('[ChatService] Cannot initialize: no user ID');
            return false;
        }

        // console.log('[ChatService] Initializing for user:', this.userId);

        // Initialize IndexedDB
        try {
            await chatStorage.init();
        } catch (error) {
            console.error('[ChatService] IndexedDB initialization failed:', error);
            this.emit('error', { message: 'Failed to initialize local storage', error });
        }

        // Connect to broadcast WebSocket
        await this.connectToBroadcast();

        // Load initial chat list via HTTP
        await this.fetchChatList();

        this.isInitialized = true;
        return true;
    }

    /**
     * Shutdown the service and close all connections
     */
    shutdown(): void {
        // console.log('[ChatService] Shutting down...');

        this.disconnectBroadcast();

        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }

        this.listeners.clear();
        this.isInitialized = false;
        this.userId = null;
        this.reconnectAttempts = 0;

        // Close IndexedDB
        chatStorage.close();
    }

    /**
     * Check if service is ready
     */
    isReady(): boolean {
        return this.isInitialized && this.broadcastWs?.readyState === WebSocket.OPEN;
    }

    /**
     * Get connection status
     */
    getConnectionStatus(): 'connected' | 'connecting' | 'disconnected' {
        if (this.broadcastWs?.readyState === WebSocket.OPEN) {
            return 'connected';
        }
        if (this.isConnecting) {
            return 'connecting';
        }
        return 'disconnected';
    }

    // ==================== WEBSOCKET: BROADCAST ====================

    private async connectToBroadcast(): Promise<void> {
        if (!this.userId) {
            console.error('[ChatService] Cannot connect: no user ID');
            return;
        }

        if (this.isConnecting) {
            // console.log('[ChatService] Already connecting...');
            return;
        }

        this.disconnectBroadcast();
        this.isConnecting = true;

        const wsUrl = CHAT_WS_URL;
        // console.log('[ChatService] Connecting to broadcast:', wsUrl);

        try {
            this.broadcastWs = new WebSocket(wsUrl);

            this.broadcastWs.onopen = () => {
                // console.log('[ChatService] Connected to broadcast');
                this.isConnecting = false;
                this.reconnectAttempts = 0;

                this.emit('connected', { reconnect: this.reconnectAttempts > 0 });
            };

            this.broadcastWs.onmessage = async (event) => {
                await this.handleBroadcastMessage(event.data);
            };

            this.broadcastWs.onerror = (error) => {
                console.error('[ChatService] WebSocket error:', error);
                this.isConnecting = false;
                this.emit('error', { message: 'WebSocket connection error', error });
            };

            this.broadcastWs.onclose = () => {
                // console.log('[ChatService] Disconnected from broadcast');
                this.isConnecting = false;
                this.emit('disconnected', { reason: 'Connection closed' });

                // Auto-reconnect
                this.scheduleReconnect();
            };

        } catch (error) {
            console.error('[ChatService] Failed to create WebSocket:', error);
            this.isConnecting = false;
            this.emit('error', { message: 'Failed to create WebSocket', error });
            this.scheduleReconnect();
        }
    }

    private disconnectBroadcast(): void {
        if (this.broadcastWs) {
            this.broadcastWs.close();
            this.broadcastWs = null;
        }
    }

    private async handleBroadcastMessage(data: string): Promise<void> {
        try {
            const event = JSON.parse(data);

            if (event.error) {
                console.error('[ChatService] Broadcast error:', event.error);
                this.emit('error', { message: event.error });
                return;
            }

            // Handle different event types
            switch (event.type) {
                case 'chats-updated':
                    // Refresh chat list
                    await this.fetchChatList();
                    break;

                case 'message-received':
                    // Handle new message
                    const { chatId, message } = event.data;
                    await this.handleIncomingMessage(chatId, message);
                    break;

                default:
                    // console.log('[ChatService] Unknown broadcast event:', event.type);
            }

        } catch (error) {
            console.error('[ChatService] Failed to parse broadcast message:', error);
            this.emit('error', { message: 'Failed to parse broadcast message', error });
        }
    }

    // ==================== HTTP API: DATA FETCHING ====================

    /**
     * Fetch chat list via HTTP
     */
    async fetchChatList(): Promise<Chat[]> {
        try {
            const res = await fetch(`${CHAT_HTTP_URL}/chat-list`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await res.json();

            if (data.error) {
                console.error('[ChatService] Fetch chat list error:', data.error);
                this.emit('error', { message: data.error });
                return [];
            }

            let chats = data.reply;
            if (typeof chats === 'string') {
                chats = JSON.parse(chats);
            }

            if (Array.isArray(chats)) {
                // Normalize chat data
                const normalizedChats: Chat[] = chats.map(c => ({
                    chatId: c.chatId ?? c.id,
                    name: c.name || `Chat ${c.chatId ?? c.id}`,
                    type: c.type || 'DM',
                    lastMessage: c.lastMessage,
                    lastMessageDate: c.lastMessageDate,
                    participants: c.participants,
                    createdAt: c.createdAt
                }));

                // Save to IndexedDB
                await chatStorage.saveChats(normalizedChats);

                // Emit update event
                this.emit('chats-updated', { chats: normalizedChats });

                // console.log(`[ChatService] Fetched ${normalizedChats.length} chats`);
                return normalizedChats;
            }

            return [];
        } catch (error) {
            console.error('[ChatService] Failed to fetch chat list:', error);
            this.emit('error', { message: 'Failed to fetch chat list', error });
            return [];
        }
    }

    /**
     * Fetch messages for a specific chat via HTTP
     */
    async fetchMessages(chatId: number): Promise<Message[]> {
        if (!this.userId) {
            console.error('[ChatService] Cannot fetch messages: no user ID');
            return [];
        }

        try {
            const res = await fetch(`${CHAT_HTTP_URL}/message-list`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify([chatId, 0, this.userId])
            });

            const data = await res.json();

            if (data.error) {
                console.error('[ChatService] Fetch messages error:', data.error);
                this.emit('error', { message: data.error });
                return [];
            }

            let messages = data.reply;
            if (typeof messages === 'string') {
                messages = JSON.parse(messages);
            }

            if (Array.isArray(messages)) {
                // Normalize incoming messages

                // IN TEORIA QUI` C'E` ANCHE l'USERNAME

                const normalizedMessages: Message[] = messages.map(m => ({
                    messageId: m.messageId ?? m.id,
                    chatId: m.chatId ?? chatId,
                    userId: m.user.linkId,
                    senderUsername: m.user.username,
                    message: m.message || '',
                    date: m.date || new Date().toISOString()
                }));

                // Save to IndexedDB
                await chatStorage.saveMessages(normalizedMessages);
                // console.log(`[ChatService] Fetched ${normalizedMessages.length} messages for chat ${chatId}`);

                return normalizedMessages;
            }

            return [];
        } catch (error) {
            console.error('[ChatService] Failed to fetch messages:', error);
            this.emit('error', { message: 'Failed to fetch messages', error });
            return [];
        }
    }

    // ==================== MESSAGE HANDLING ====================

	private async handleIncomingMessage(chatId: number, message: Message): Promise<void> {
				// console.log(`[ChatService] Received message from ${message.userId} in chat ${chatId}`);
				// console.log(`[ChatService] Received message: ${JSON.stringify(message)}`);
        // Save message to IndexedDB
        await chatStorage.saveMessages([message]);

        // Emit event
        this.emit('message-received', { chatId, message });

        // If message is from another user, increment unread and show notification
        if (message.userId !== this.userId) {
            await chatStorage.incrementUnreadCount(chatId);
            const count = await chatStorage.getUnreadCount(chatId);
            const total = await chatStorage.getTotalUnreadCount();

            this.emit('unread-updated', { chatId, count, total });

            // Show notification
            const chat = await chatStorage.getChat(chatId);
            if (chat) {
                notificationService.showMessageNotification({
                    chatId,
                    chatName: chat.name,
                    senderName: `User ${message.userId}`,
                    message: message.message,
                    timestamp: new Date(message.date)
                });
            }
        }

        // Update chat's last message
        const chat = await chatStorage.getChat(chatId);
        if (chat) {
            chat.lastMessage = message.message;
            chat.lastMessageDate = message.date;
            await chatStorage.saveChat(chat);
        }
    }

    // ==================== HTTP API ====================

    /**
     * Send a message via HTTP
     */
    async sendMessage(chatId: number, message: string): Promise<boolean> {
        if (!this.userId) {
            console.error('[ChatService] Cannot send message: not authenticated');
            return false;
        }

        const body = { chatId, linkId: this.userId, message };

        try {
            const res = await fetch(`${CHAT_HTTP_URL}/new-message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (data.message && data.message.includes('successo')) {
                return true;
            } else if (data.error) {
                console.error('[ChatService] Send message error:', data.error);
                this.emit('error', { message: data.error });
                return false;
            }

            return false;
        } catch (error) {
            console.error('[ChatService] Failed to send message:', error);
            this.emit('error', { message: 'Failed to send message', error });
            return false;
        }
    }

    /**
     * Create a new chat via HTTP
     */
    async createChat(chatName: string, members: number[]): Promise<boolean> {
        if (!this.userId) {
            console.error('[ChatService] Cannot create chat: not authenticated');
            return false;
        }

        const body = { host: this.userId, chatName, members };

        try {
            const res = await fetch(`${CHAT_HTTP_URL}/new-chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (data.message && data.message.includes('successo')) {
                return true;
            } else if (data.error) {
                console.error('[ChatService] Create chat error:', data.error);
                this.emit('error', { message: data.error });
                return false;
            }

            return false;
        } catch (error) {
            console.error('[ChatService] Failed to create chat:', error);
            this.emit('error', { message: 'Failed to create chat', error });
            return false;
        }
    }

    /**
     * Mark chat as read
     */
    async markChatAsRead(chatId: number): Promise<void> {
        await chatStorage.clearUnreadCount(chatId);
        const total = await chatStorage.getTotalUnreadCount();
        this.emit('unread-updated', { chatId, count: 0, total });
    }

    // ==================== LOCAL DATA ACCESS ====================

    /**
     * Get all chats from local storage
     */
    async getChats(): Promise<Chat[]> {
        return chatStorage.getAllChats();
    }

    /**
     * Get messages for a chat from local storage
     */
    async getMessages(chatId: number, limit?: number): Promise<Message[]> {
        return chatStorage.getMessages(chatId, limit);
    }

    /**
     * Get unread count for a chat
     */
    async getUnreadCount(chatId: number): Promise<number> {
        return chatStorage.getUnreadCount(chatId);
    }

    /**
     * Get total unread count
     */
    async getTotalUnreadCount(): Promise<number> {
        return chatStorage.getTotalUnreadCount();
    }

    /**
     * Get all unread counts
     */
    async getAllUnreadCounts(): Promise<Map<number, number>> {
        return chatStorage.getAllUnreadCounts();
    }

    // ==================== EVENT SYSTEM ====================

    /**
     * Subscribe to chat events
     */
    on<T extends ChatEventType>(event: T, listener: ChatEventListener<T>): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(listener);
    }

    /**
     * Unsubscribe from chat events
     */
    off<T extends ChatEventType>(event: T, listener: ChatEventListener<T>): void {
        const listeners = this.listeners.get(event);
        if (listeners) {
            listeners.delete(listener);
        }
    }

    /**
     * Emit an event to all listeners
     */
    private emit<T extends ChatEventType>(event: T, data: ChatEventData[T]): void {
        const listeners = this.listeners.get(event);
        if (listeners) {
            listeners.forEach(listener => {
                try {
                    listener(data);
                } catch (error) {
                    console.error(`[ChatService] Error in event listener for ${event}:`, error);
                }
            });
        }
    }

    // ==================== AUTO-RECONNECT ====================

    private scheduleReconnect(): void {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('[ChatService] Max reconnect attempts reached');
            this.emit('error', { message: 'Failed to reconnect after multiple attempts' });
            return;
        }

        if (this.reconnectTimer) {
            return; // Already scheduled
        }

        const delay = Math.min(
            this.reconnectDelay * Math.pow(2, this.reconnectAttempts),
            30000 // Max 30 seconds
        );

        // console.log(`[ChatService] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);

        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            this.reconnectAttempts++;
            this.connectToBroadcast();
        }, delay);
    }
}

// Export singleton instance
export const chatService = ChatService.getInstance();
