/**
 * Authentication Service
 * Handles user authentication state, session management, and route guards
 */

import { loadStoredSession, clearSession, persistSession } from './session';

const GATEWAY_URL = `/api`;

interface AuthState {
    isAuthenticated: boolean;
    user: any | null;
    userId: number | null;
    twoFactorEnabled: boolean;
    isChecking: boolean;
}

class AuthService {
    private static instance: AuthService | null = null;
    private state: AuthState = {
        isAuthenticated: false,
        user: null,
        userId: null,
        twoFactorEnabled: false,
        isChecking: false,
    };

    private constructor() {
        this.initializeFromStorage();
    }

    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    /**
     * Initialize auth state from localStorage
     */
    private initializeFromStorage(): void {
        const session = loadStoredSession();
        if (session.user && session.userId) {
            this.state.user = session.user;
            this.state.userId = session.userId;
            this.state.twoFactorEnabled = session.user?.twoFactorEnabled ?? false;
            this.state.isAuthenticated = true;
        }
    }

    /**
     * Check if user is authenticated by verifying with backend
     * @param forceCheck - Force a backend check even if we have cached state
     */
    async checkAuth(forceCheck: boolean = false): Promise<boolean> {
        // If we have a valid cached state and not forcing, return it
        if (!forceCheck && this.state.isAuthenticated && this.state.user) {
            return true;
        }

        if (this.state.isChecking) {
            // Prevent multiple simultaneous checks
            await new Promise(resolve => setTimeout(resolve, 100));
            return this.state.isAuthenticated;
        }

        this.state.isChecking = true;

        try {
            // Use fetch directly to handle 401 gracefully
            const response = await fetch(`${GATEWAY_URL}/isauth`, {
                method: 'GET',
                credentials: 'include', // Important: send cookies
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // 401 is expected when not authenticated - not an error
            if (response.status === 401) {
                this.clearAuthState();
                return false;
            }

            if (!response.ok) {
                // Other errors (500, 503, etc)
                console.warn(`[AuthService] Auth check failed with status ${response.status}`);
                this.clearAuthState();
                return false;
            }

            const data = await response.json();
            
            if (data.ok === true && data.user) {
                // Update auth state
                this.state.isAuthenticated = true;
                this.state.user = data.user;
                this.state.userId = data.user.userId || data.user.id;
                this.state.twoFactorEnabled = data.user.twoFactorEnabled ?? false;

                // Persist to localStorage
                persistSession(null, data.user, null);
                
                return true;
            } else {
                // Not authenticated
                this.clearAuthState();
                return false;
            }
        } catch (error) {
            // Only log actual network errors
            console.error('[AuthService] Network error during auth check:', error);
            this.clearAuthState();
            return false;
        } finally {
            this.state.isChecking = false;
        }
    }

    /**
     * Check if user is authenticated (from cached state, no backend call)
     */
    isAuthenticated(): boolean {
        return this.state.isAuthenticated;
    }

    /**
     * Check if user has 2FA enabled
     */
    has2FAEnabled(): boolean {
        return this.state.twoFactorEnabled;
    }

    /**
     * Get current user
     */
    getUser(): any | null {
        return this.state.user;
    }

    /**
     * Get current user ID
     */
    getUserId(): number | null {
        return this.state.userId;
    }

    /**
     * Update auth state after login
     */
    setAuthState(user: any, twoFactorEnabled: boolean = false): void {
        this.state.isAuthenticated = true;
        this.state.user = user;
        this.state.userId = user.userId || user.id;
        this.state.twoFactorEnabled = twoFactorEnabled;
        
        // Persist to localStorage
        persistSession(null, user, null);
    }

    /**
     * Clear auth state (logout)
     */
    clearAuthState(): void {
        this.state.isAuthenticated = false;
        this.state.user = null;
        this.state.userId = null;
        this.state.twoFactorEnabled = false;
        
        clearSession();
    }

    /**
     * Logout user
     */
    async logout(): Promise<void> {
        try {
            // Call logout endpoint to clear cookies
            const response = await fetch(`${GATEWAY_URL}/logout`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}), // Send empty object in case backend expects a body
            });
            
            if (!response.ok) {
                console.warn(`[AuthService] Logout endpoint returned ${response.status}, proceeding with local logout`);
            }
        } catch (error) {
            // Ignore errors, we're logging out anyway
            console.warn('[AuthService] Logout endpoint error, proceeding with local logout:', error);
        } finally {
            // Always clear local state regardless of backend response
            this.clearAuthState();
        }
    }
}

// Export singleton instance
export const authService = AuthService.getInstance();

// Legacy export for backward compatibility
export async function isauth(): Promise<boolean> {
    return await authService.checkAuth();
}
