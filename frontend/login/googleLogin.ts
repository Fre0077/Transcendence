import { createChatPage } from "../chat/chat";
import { sendPostRequest } from "../generals/generalUse";

async function fetchGoogleUserInfo(accessToken: string): Promise<any> {
    try {
        const response = await fetch(
            `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
        );
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const userInfo = await response.json();
        return userInfo;
    } catch (error) {
        console.error("Error fetching user info:", error);
        throw error;
    }
}

async function handleGoogleAuthSuccess(token: string): Promise<void> {
    try {
        const userInfo = await fetchGoogleUserInfo(token);
        console.log("User info received:", userInfo);

        // Send to your Fastify + Prisma backend for login/signup
        const response = await sendPostRequest(
            "http://localhost:3000/api/auth/google",
            {
                google_id: userInfo.id,
                email: userInfo.email,
                name: userInfo.name,
                picture: userInfo.picture,
                access_token: token,
            },
            "application/json"
        );
        
        console.log("Authentication response:", response);
        
        // Store user data in sessionStorage for session management
        if (response.success) {
            sessionStorage.setItem('userSession', JSON.stringify({
                id: response.user.id,
                email: response.user.email,
                name: response.user.name,
                picture: response.user.picture,
                role: response.user.role,
                loginType: 'google',
                loginTime: new Date().toISOString()
            }));
            
            // Show welcome message
            if (response.isNewUser) {
                console.log("Welcome! Your account has been created.");
            } else {
                console.log("Welcome back!");
            }

            // Navigate to chat page
            createChatPage();
        } else {
            throw new Error(response.error || 'Authentication failed');
        }

    } catch (error: any) {
        console.error("Error in Google auth process:", error);
        alert(`Authentication failed: ${error.message || 'Please try again.'}`);
    }
}

function extractTokenFromUrl(url: string): string | null {
    try {
        const hashIndex = url.indexOf('#');
        if (hashIndex === -1) return null;
        
        const hash = url.substring(hashIndex + 1);
        const params = new URLSearchParams(hash);
        return params.get('access_token');
    } catch (error) {
        console.error("Error extracting token from URL:", error);
        return null;
    }
}

function pollForAuthCompletion(popup: Window): Promise<string> {
    return new Promise((resolve, reject) => {
        const pollInterval = setInterval(() => {
            try {
                if (popup.closed) {
                    clearInterval(pollInterval);
                    reject(new Error("Popup was closed by user"));
                    return;
                }

                // Try to access popup URL to check for auth completion
                let currentUrl: string;
                try {
                    currentUrl = popup.location.href;
                } catch (e) {
                    // Cross-origin access blocked, auth still in progress
                    return;
                }

                // Check if we're back on our domain (auth completed)
                if (currentUrl.includes(window.location.origin)) {
                    clearInterval(pollInterval);
                    
                    // Extract token from URL
                    const token = extractTokenFromUrl(currentUrl);
                    
                    if (token) {
                        popup.close();
                        resolve(token);
                    } else {
                        popup.close();
                        reject(new Error("No access token found in callback URL"));
                    }
                }
            } catch (error) {
                // This is expected during cross-origin navigation
                // Continue polling
            }
        }, 1000);

        // Timeout after 5 minutes
        setTimeout(() => {
            clearInterval(pollInterval);
            if (!popup.closed) {
                popup.close();
            }
            reject(new Error("Authentication timeout"));
        }, 300000);
    });
}

export function googleLoginFunction(): void {
    const clientId = "444437163420-c7jh572i1kdauafj0nd19hqmr0ddl8a3.apps.googleusercontent.com";
    
    // Use the current page as redirect URI (no separate callback file needed)
    const redirectUri = encodeURIComponent(window.location.origin + "/callback");
    const scope = encodeURIComponent("email profile");
    
    console.log("Current origin:", window.location.origin);
    console.log("Current pathname:", window.location.pathname);
    console.log("Redirect URI:", decodeURIComponent(redirectUri));
    
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;

    console.log("Opening Google auth popup with URL:", authUrl);
    
    const popup = window.open(authUrl, "Google Login", "width=500,height=600,scrollbars=yes,resizable=yes");

    if (!popup) {
        console.error("Failed to open popup - popup blocker might be enabled");
        alert("Please allow popups for this site to use Google login.");
        return;
    }

    popup.focus();

    // Poll for authentication completion
    pollForAuthCompletion(popup)
        .then((token) => {
            console.log("Authentication successful, token received");
            handleGoogleAuthSuccess(token);
        })
        .catch((error) => {
            console.error("Authentication failed:", error);
            alert(`Google authentication failed: ${error.message}`);
        });
    
    console.log("Google auth popup opened, polling for completion...");
}