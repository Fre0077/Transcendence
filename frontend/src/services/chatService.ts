/**
 * Global Chat Service - Singleton WebSocket manager
 * Maintains persistent connection to chat backend, handles real-time updates,
 * stores data in IndexedDB, and emits events for components to subscribe to
 */

import { loadStoredSession } from './session';
import { chatStorage, type Chat, type Message } from './storage/chatStorage';
import { notificationService } from './notificationService';

const CHAT_WS_URL = 'ws://localhost:3002/api';
const CHAT_HTTP_URL = 'http://localhost:3002/api';

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
    
    private chatListWs: WebSocket | null = null;
    private messageWsMap: Map<number, WebSocket> = new Map();
    
    private userId: number | null = null;
    private accessToken: string | null = null;
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
            console.log('[ChatService] Already initialized');
            return true;
        }

        const session = loadStoredSession();
        this.userId = session.userId;
        this.accessToken = session.token;

        if (!this.userId) {
            console.error('[ChatService] Cannot initialize: no user ID');
            return false;
        }

        console.log('[ChatService] Initializing for user:', this.userId);

        // Initialize IndexedDB
        try {
            await chatStorage.init();
        } catch (error) {
            console.error('[ChatService] IndexedDB initialization failed:', error);
            this.emit('error', { message: 'Failed to initialize local storage', error });
        }

        // Connect to chat list WebSocket
        await this.connectToChatList();
        
        this.isInitialized = true;
        return true;
    }

    /**
     * Shutdown the service and close all connections
     */
    shutdown(): void {
        console.log('[ChatService] Shutting down...');
        
        this.disconnectChatList();
        this.disconnectAllMessageStreams();
        
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        
        this.listeners.clear();
        this.isInitialized = false;
        this.userId = null;
        this.accessToken = null;
        this.reconnectAttempts = 0;
        
        // Close IndexedDB
        chatStorage.close();
    }

    /**
     * Check if service is ready
     */
    isReady(): boolean {
        return this.isInitialized && this.chatListWs?.readyState === WebSocket.OPEN;
    }

    /**
     * Get connection status
     */
    getConnectionStatus(): 'connected' | 'connecting' | 'disconnected' {
        if (this.chatListWs?.readyState === WebSocket.OPEN) {
            return 'connected';
        }
        if (this.isConnecting) {
            return 'connecting';
        }
        return 'disconnected';
    }

    // ==================== WEBSOCKET: CHAT LIST ====================

    private async connectToChatList(): Promise<void> {
        if (!this.userId) {
            console.error('[ChatService] Cannot connect: no user ID');
            return;
        }

        if (this.isConnecting) {
            console.log('[ChatService] Already connecting...');
            return;
        }

        this.disconnectChatList();
        this.isConnecting = true;

        const wsUrl = `${CHAT_WS_URL}/chat-list`;
        console.log('[ChatService] Connecting to chat-list:', wsUrl);

        try {
            this.chatListWs = new WebSocket(wsUrl);

            this.chatListWs.onopen = () => {
                console.log('[ChatService] Connected to chat-list');
                this.isConnecting = false;
                this.reconnectAttempts = 0;
                
                // Send user ID to start receiving updates
                this.chatListWs?.send(this.userId!.toString());
                
                this.emit('connected', { reconnect: this.reconnectAttempts > 0 });
            };

            this.chatListWs.onmessage = async (event) => {
                await this.handleChatListMessage(event.data);
            };

            this.chatListWs.onerror = (error) => {
                console.error('[ChatService] WebSocket error:', error);
                this.isConnecting = false;
                this.emit('error', { message: 'WebSocket connection error', error });
            };

            this.chatListWs.onclose = () => {
                console.log('[ChatService] Disconnected from chat-list');
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

    private disconnectChatList(): void {
        if (this.chatListWs) {
            this.chatListWs.close();
            this.chatListWs = null;
        }
    }

    private async handleChatListMessage(data: string): Promise<void> {
        try {
            const response = JSON.parse(data);

            if (response.error) {
                console.error('[ChatService] Server error:', response.error);
                this.emit('error', { message: response.error });
                return;
            }

            let chats = response.chats;
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

                console.log(`[ChatService] Updated ${normalizedChats.length} chats`);
            }
        } catch (error) {
            console.error('[ChatService] Failed to parse chat list:', error);
            this.emit('error', { message: 'Failed to parse chat list', error });
        }
    }

    // ==================== WEBSOCKET: MESSAGES ====================

    /**
     * Connect to message stream for a specific chat
     */
    connectToMessages(chatId: number): void {
        if (!this.userId) {
            console.error('[ChatService] Cannot connect to messages: no user ID');
            return;
        }

        if (this.messageWsMap.has(chatId)) {
            console.log(`[ChatService] Already connected to messages for chat ${chatId}`);
            return;
        }

        const wsUrl = `${CHAT_WS_URL}/message-list`;
        console.log(`[ChatService] Connecting to messages for chat ${chatId}`);

        try {
            const ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                console.log(`[ChatService] Connected to messages for chat ${chatId}`);
                const payload = JSON.stringify({ message: [chatId, 0, this.userId] });
                ws.send(payload);
            };

            ws.onmessage = async (event) => {
                await this.handleMessageListMessage(chatId, event.data);
            };

            ws.onerror = (error) => {
                console.error(`[ChatService] Message WebSocket error for chat ${chatId}:`, error);
            };

            ws.onclose = () => {
                console.log(`[ChatService] Disconnected from messages for chat ${chatId}`);
                this.messageWsMap.delete(chatId);
            };

            this.messageWsMap.set(chatId, ws);

        } catch (error) {
            console.error(`[ChatService] Failed to connect to messages for chat ${chatId}:`, error);
        }
    }

    /**
     * Disconnect from message stream for a specific chat
     */
    disconnectFromMessages(chatId: number): void {
        const ws = this.messageWsMap.get(chatId);
        if (ws) {
            ws.close();
            this.messageWsMap.delete(chatId);
            console.log(`[ChatService] Disconnected from messages for chat ${chatId}`);
        }
    }

    /**
     * Disconnect from all message streams
     */
    private disconnectAllMessageStreams(): void {
        this.messageWsMap.forEach((ws) => {
            ws.close();
        });
        this.messageWsMap.clear();
    }

    private async handleMessageListMessage(chatId: number, data: string): Promise<void> {
        try {
            const response = JSON.parse(data);

            let messages = response.reply || response.messages;
            if (typeof messages === 'string') {
                messages = JSON.parse(messages);
            }

            if (Array.isArray(messages)) {
                // Normalize incoming messages
                const normalizedMessages: Message[] = messages.map(m => ({
                    messageId: m.messageId ?? m.id,
                    chatId: m.chatId ?? chatId,
                    userId: m.userId ?? m.linkId,
                    message: m.message || '',
                    date: m.date || new Date().toISOString()
                }));

                // Get existing messages from IndexedDB to avoid duplicates
                const existingMessages = await chatStorage.getMessages(chatId);
                const existingMessageIds = new Set(existingMessages.map(m => m.messageId));

                // Filter out messages that already exist
                const newMessages = normalizedMessages.filter(m => !existingMessageIds.has(m.messageId));

                // Only save new messages
                if (newMessages.length > 0) {
                    await chatStorage.saveMessages(newMessages);
                    console.log(`[ChatService] Saved ${newMessages.length} new messages for chat ${chatId}`);

                    // Emit event for each new message
                    newMessages.forEach(msg => {
                        this.emit('message-received', { chatId, message: msg });
                    });

                    // Update chat's last message
                    const lastMsg = normalizedMessages[normalizedMessages.length - 1];
                    const chat = await chatStorage.getChat(chatId);
                    if (chat) {
                        chat.lastMessage = lastMsg.message;
                        chat.lastMessageDate = lastMsg.date;
                        await chatStorage.saveChat(chat);
                    }

                    // If message is from another user, increment unread and show notification
                    const newMessagesFromOthers = newMessages.filter(m => m.userId !== this.userId);
                    if (newMessagesFromOthers.length > 0) {
                        for (const msg of newMessagesFromOthers) {
                            await this.handleIncomingMessage(chatId, msg);
                        }
                    }
                } else {
                    console.log(`[ChatService] No new messages for chat ${chatId} (${normalizedMessages.length} already saved)`);
                }
            }
        } catch (error) {
            console.error('[ChatService] Failed to parse message list:', error);
        }
    }

    private async handleIncomingMessage(chatId: number, message: Message): Promise<void> {
        // Increment unread count
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

    // ==================== HTTP API ====================

    /**
     * Send a message via HTTP
     */
    async sendMessage(chatId: number, message: string): Promise<boolean> {
        if (!this.userId || !this.accessToken) {
            console.error('[ChatService] Cannot send message: not authenticated');
            return false;
        }

        const body = { chatId, linkId: this.userId, message };

        try {
            const res = await fetch(`${CHAT_HTTP_URL}/new-message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.accessToken}`
                },
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
        if (!this.userId || !this.accessToken) {
            console.error('[ChatService] Cannot create chat: not authenticated');
            return false;
        }

        const body = { host: this.userId, chatName, members };

        try {
            const res = await fetch(`${CHAT_HTTP_URL}/new-chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.accessToken}`
                },
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

        console.log(`[ChatService] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);

        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null;
            this.reconnectAttempts++;
            this.connectToChatList();
        }, delay);
    }
}

// Export singleton instance
export const chatService = ChatService.getInstance();
