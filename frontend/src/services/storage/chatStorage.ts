/**
 * IndexedDB wrapper for chat data persistence
 * Stores chats, messages, and unread counts locally
 */

const DB_NAME = 'TranscendenceChatDB';
const DB_VERSION = 1;

// Store names
const STORES = {
    CHATS: 'chats',
    MESSAGES: 'messages',
    UNREAD: 'unreadCounts'
} as const;

export interface Chat {
    chatId: number;
    name: string;
    type: 'DM' | 'GROUP';
    lastMessage?: string;
    lastMessageDate?: string;
    participants?: number[];
    createdAt?: string;
}

export interface Message {
    messageId: number;
    chatId: number;
    userId: number;
    message: string;
    date: string;
}

export interface UnreadCount {
    chatId: number;
    count: number;
}

class ChatStorage {
    private db: IDBDatabase | null = null;
    private initPromise: Promise<IDBDatabase> | null = null;

    /**
     * Initialize IndexedDB connection
     */
    async init(): Promise<IDBDatabase> {
        if (this.db) {
            return this.db;
        }

        if (this.initPromise) {
            return this.initPromise;
        }

        this.initPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => {
                console.error('IndexedDB error:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                // Create chats store
                if (!db.objectStoreNames.contains(STORES.CHATS)) {
                    const chatStore = db.createObjectStore(STORES.CHATS, { keyPath: 'chatId' });
                    chatStore.createIndex('type', 'type', { unique: false });
                    chatStore.createIndex('lastMessageDate', 'lastMessageDate', { unique: false });
                }

                // Create messages store
                if (!db.objectStoreNames.contains(STORES.MESSAGES)) {
                    const messageStore = db.createObjectStore(STORES.MESSAGES, { keyPath: 'messageId' });
                    messageStore.createIndex('chatId', 'chatId', { unique: false });
                    messageStore.createIndex('chatId_date', ['chatId', 'date'], { unique: false });
                }

                // Create unread counts store
                if (!db.objectStoreNames.contains(STORES.UNREAD)) {
                    db.createObjectStore(STORES.UNREAD, { keyPath: 'chatId' });
                }
            };
        });

        return this.initPromise;
    }

    /**
     * Get transaction helper
     */
    private async getTransaction(storeName: string, mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore> {
        const db = await this.init();
        const transaction = db.transaction(storeName, mode);
        return transaction.objectStore(storeName);
    }

    // ==================== CHATS ====================

    /**
     * Save or update a chat
     */
    async saveChat(chat: Chat): Promise<void> {
        const store = await this.getTransaction(STORES.CHATS, 'readwrite');
        return new Promise((resolve, reject) => {
            const request = store.put(chat);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Save multiple chats
     */
    async saveChats(chats: Chat[]): Promise<void> {
        const store = await this.getTransaction(STORES.CHATS, 'readwrite');
        return new Promise((resolve, reject) => {
            let completed = 0;
            let hasError = false;

            if (chats.length === 0) {
                resolve();
                return;
            }

            chats.forEach(chat => {
                const request = store.put(chat);
                request.onsuccess = () => {
                    completed++;
                    if (completed === chats.length && !hasError) {
                        resolve();
                    }
                };
                request.onerror = () => {
                    if (!hasError) {
                        hasError = true;
                        reject(request.error);
                    }
                };
            });
        });
    }

    /**
     * Get a chat by ID
     */
    async getChat(chatId: number): Promise<Chat | null> {
        const store = await this.getTransaction(STORES.CHATS);
        return new Promise((resolve, reject) => {
            const request = store.get(chatId);
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get all chats, sorted by last message date
     */
    async getAllChats(): Promise<Chat[]> {
        const store = await this.getTransaction(STORES.CHATS);
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => {
                const chats = request.result || [];
                // Sort by lastMessageDate descending
                chats.sort((a, b) => {
                    const dateA = a.lastMessageDate ? new Date(a.lastMessageDate).getTime() : 0;
                    const dateB = b.lastMessageDate ? new Date(b.lastMessageDate).getTime() : 0;
                    return dateB - dateA;
                });
                resolve(chats);
            };
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Delete a chat
     */
    async deleteChat(chatId: number): Promise<void> {
        const store = await this.getTransaction(STORES.CHATS, 'readwrite');
        return new Promise((resolve, reject) => {
            const request = store.delete(chatId);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // ==================== MESSAGES ====================

    /**
     * Save a message
     */
    async saveMessage(message: Message): Promise<void> {
        const store = await this.getTransaction(STORES.MESSAGES, 'readwrite');
        return new Promise((resolve, reject) => {
            const request = store.put(message);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Save multiple messages
     */
    async saveMessages(messages: Message[]): Promise<void> {
        const store = await this.getTransaction(STORES.MESSAGES, 'readwrite');
        return new Promise((resolve, reject) => {
            let completed = 0;
            let hasError = false;

            if (messages.length === 0) {
                resolve();
                return;
            }

            messages.forEach(message => {
                const request = store.put(message);
                request.onsuccess = () => {
                    completed++;
                    if (completed === messages.length && !hasError) {
                        resolve();
                    }
                };
                request.onerror = () => {
                    if (!hasError) {
                        hasError = true;
                        reject(request.error);
                    }
                };
            });
        });
    }

    /**
     * Get messages for a chat
     */
    async getMessages(chatId: number, limit?: number): Promise<Message[]> {
        const store = await this.getTransaction(STORES.MESSAGES);
        const index = store.index('chatId');
        
        return new Promise((resolve, reject) => {
            const request = index.getAll(chatId);
            request.onsuccess = () => {
                let messages = request.result || [];
                // Sort by date ascending
                messages.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                
                // Apply limit if specified
                if (limit && messages.length > limit) {
                    messages = messages.slice(-limit);
                }
                
                resolve(messages);
            };
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get the last message for a chat
     */
    async getLastMessage(chatId: number): Promise<Message | null> {
        const messages = await this.getMessages(chatId, 1);
        return messages.length > 0 ? messages[messages.length - 1] : null;
    }

    /**
     * Delete all messages for a chat
     */
    async deleteMessagesForChat(chatId: number): Promise<void> {
        const store = await this.getTransaction(STORES.MESSAGES, 'readwrite');
        const index = store.index('chatId');
        
        return new Promise((resolve, reject) => {
            const request = index.openCursor(chatId);
            request.onsuccess = (event) => {
                const cursor = (event.target as IDBRequest).result;
                if (cursor) {
                    cursor.delete();
                    cursor.continue();
                } else {
                    resolve();
                }
            };
            request.onerror = () => reject(request.error);
        });
    }

    // ==================== UNREAD COUNTS ====================

    /**
     * Set unread count for a chat
     */
    async setUnreadCount(chatId: number, count: number): Promise<void> {
        const store = await this.getTransaction(STORES.UNREAD, 'readwrite');
        return new Promise((resolve, reject) => {
            const request = store.put({ chatId, count });
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Increment unread count for a chat
     */
    async incrementUnreadCount(chatId: number): Promise<void> {
        const current = await this.getUnreadCount(chatId);
        await this.setUnreadCount(chatId, current + 1);
    }

    /**
     * Get unread count for a chat
     */
    async getUnreadCount(chatId: number): Promise<number> {
        const store = await this.getTransaction(STORES.UNREAD);
        return new Promise((resolve, reject) => {
            const request = store.get(chatId);
            request.onsuccess = () => {
                const result = request.result as UnreadCount | undefined;
                resolve(result?.count || 0);
            };
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get total unread count across all chats
     */
    async getTotalUnreadCount(): Promise<number> {
        const store = await this.getTransaction(STORES.UNREAD);
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => {
                const results = request.result as UnreadCount[];
                const total = results.reduce((sum, item) => sum + item.count, 0);
                resolve(total);
            };
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get all unread counts
     */
    async getAllUnreadCounts(): Promise<Map<number, number>> {
        const store = await this.getTransaction(STORES.UNREAD);
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => {
                const results = request.result as UnreadCount[];
                const map = new Map<number, number>();
                results.forEach(item => map.set(item.chatId, item.count));
                resolve(map);
            };
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Clear unread count for a chat (mark as read)
     */
    async clearUnreadCount(chatId: number): Promise<void> {
        await this.setUnreadCount(chatId, 0);
    }

    // ==================== UTILITY ====================

    /**
     * Clear all data
     */
    async clearAll(): Promise<void> {
        const db = await this.init();
        const stores = [STORES.CHATS, STORES.MESSAGES, STORES.UNREAD];
        
        const promises = stores.map(storeName => {
            return new Promise<void>((resolve, reject) => {
                const transaction = db.transaction(storeName, 'readwrite');
                const store = transaction.objectStore(storeName);
                const request = store.clear();
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        });

        await Promise.all(promises);
    }

    /**
     * Close database connection
     */
    close(): void {
        if (this.db) {
            this.db.close();
            this.db = null;
            this.initPromise = null;
        }
    }
}

// Export singleton instance
export const chatStorage = new ChatStorage();
