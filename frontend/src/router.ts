import { load404Page } from "./pages/errors/404";
import { load500Page } from "./pages/errors/500";
import { ChatsPage } from "./pages/protected/chats/chats";
import { loadGameHub } from "./pages/protected/game/gameHub";
import { loadOnlineLobbyPage } from "./pages/protected/game/lobby/lobby";
import { loadTournamentHubPage } from "./pages/protected/game/tournament/tournamentHub";
import { loadOnlineTournamentPage } from "./pages/protected/game/tournament/tournamentPage";
// import { loadOnlineGamePage } from "./pages/protected/game/online/onlineGame";
import { loadPongPlayerPage } from '@pages/protected/game/online/loadPongPlayerPage';
// import { loadLocalGamePage } from "./pages/protected/game/local/localGame";

// local stuff
import { loadLocalPongPage } from "./pages/protected/game/local/loadLocalPongPage";
import { loadLocalTournamentPage } from "./pages/protected/game/local/loadLocalTournamentPage";

import { loadHomePage } from "./pages/protected/home/home";
import { loadProfilePage } from "./pages/protected/profile/profile";
import { loadLoginPage } from "./pages/public/login/login";
import { loadRegisterPage } from "./pages/public/register/register";


// test
import { loadChatApiTest } from "./pages/test/chatApiTest";

// services
import { isauth } from "@services/api/isauth";
import { sendDeleteRequest } from "@services/api/sendRequests";

type RouteComponent = () => HTMLElement;

interface RouteConfig {
  path: string;
  name: string;
  component: RouteComponent;
  meta?: {
    requiresAuth?: boolean;
    requiresGuest?: boolean;
    requires2FA?: boolean;
    title?: string;
  };
}

interface RouteParams {
  [key: string]: string;
}

class Router {
  private routes: RouteConfig[] = [];
  private currentRoute: RouteConfig | null = null;
  private rootElement: HTMLElement | null = null;
  private params: RouteParams = {};

  constructor(routes: RouteConfig[]) {
    this.routes = routes;

    // Listen for browser back/forward buttons
    window.addEventListener('popstate', () => {
      this.handleRoute(window.location.pathname);
    });

    // Intercept all link clicks for SPA navigation
    document.addEventListener('click', (e) => {
      const target = (e.target as HTMLElement).closest('a[href]');
      if (target && !target.hasAttribute('target')) {
        const href = target.getAttribute('href');
        if (href && href.startsWith('/')) {
          e.preventDefault();
          this.push(href);
        }
      }
    });
  }

  // Initialize router with root element
  init(rootId: string) {
    this.rootElement = document.getElementById(rootId);
    if (!this.rootElement) {
      throw new Error(`Element #${rootId} not found`);
    }
    this.handleRoute(window.location.pathname);
  }

  // Navigate to a new route
  push(path: string) {
    window.history.pushState({}, '', path);
    this.handleRoute(path);
  }

  // Replace current route (no history entry)
  replace(path: string) {
    window.history.replaceState({}, '', path);
    this.handleRoute(path);
  }

  // Go back in history
  back() {
    // @topiana- #todo remove event listeners
    window.history.back();   
  }

  // Find route that matches the given path
  private findRoute(path: string): { route: RouteConfig; params: RouteParams } | null {
    for (const route of this.routes) {
      const match = this.matchRoute(route.path, path);
      if (match) {
        return { route, params: match };
      }
    }
    return null;
  }

  // Match route path with URL path (supports :param syntax)
  private matchRoute(routePath: string, urlPath: string): RouteParams | null {
    const routeParts = routePath.split('/').filter(Boolean);
    const urlParts = urlPath.split('/').filter(Boolean);

    if (routeParts.length !== urlParts.length) {
      return null;
    }

    const params: RouteParams = {};

    for (let i = 0; i < routeParts.length; i++) {
      const routePart = routeParts[i];
      const urlPart = urlParts[i];

      if (routePart.startsWith(':')) {
        // Dynamic segment - extract parameter
        params[routePart.slice(1)] = urlPart;
      } else if (routePart !== urlPart) {
        // Static segments don't match
        return null;
      }
    }

    return params;
  }

  // @topiana-
  private stripQuery(path: string): string {
    return path.split('?')[0];
  }

  // Handle route change
  private async handleRoute(path: string) {
    const cleanPath = this.stripQuery(path);  //@topiana-
    const match = this.findRoute(cleanPath);

    if (!match) {
      // Route not found - redirect to 404
      this.replace('/404');
      return;
    }

    // call destructor of previous page @topiana-
    if (this.rootElement && this.rootElement.firstChild) {
      const destructor = (this.rootElement.firstChild as any).destroy;
      if (destructor) destructor();
    }

    const { route, params } = match;
    this.params = params;

    // TODO: Implement authentication guards
    // import { authService } from '@/services/api/auth';
    // const isAuthenticated = await authService.isAuthenticated();
    // const has2FA = await authService.has2FAEnabled();
    
    // if (route.meta?.requiresAuth && !isAuthenticated) {
    //   this.replace('/login');
    //   return;
    // }
    
    // if (route.meta?.requiresGuest && isAuthenticated) {
    //   this.replace('/dashboard');
    //   return;
    // }
    
    // if (route.meta?.requires2FA && !has2FA) {
    //   this.replace('/2fa');
    //   return;
    // }

    
    // cheap guard by @topiana-
    const isAuthenticated = await isauth();
    if (route.meta?.requiresAuth && !isAuthenticated) {
      this.replace('/login');
      return;
    }

    // Update page title
    if (route.meta?.title) {
      document.title = route.meta.title;
    }

    // Update current route and render
    this.currentRoute = route;
    this.render(route);
  }

  // Render the component
  private render(route: RouteConfig) {
    if (!this.rootElement) return;

    // Show loading state
    this.rootElement.innerHTML = /* html */ `
      <div class="flex items-center justify-center min-h-screen">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <span class="sr-only">Loading...</span>
      </div>
    `;

    // Small delay to show loading (optional, remove in production if not needed)
    setTimeout(() => {
      if (!this.rootElement) return;

      // Clear and render new component
      this.rootElement.innerHTML = '';
      const component = route.component();
      this.rootElement.appendChild(component);

      // Scroll to top
      window.scrollTo(0, 0);

      // Announce page change for screen readers (accessibility)
      this.announcePageChange(route.meta?.title || 'Page loaded');
    }, 100);
  }

  // Get current route parameters
  getParams(): RouteParams {
    return { ...this.params };
  }

  // Get current query parameters
  getQuery(): URLSearchParams {
    return new URLSearchParams(window.location.search);
  }

  // Get current route
  getCurrentRoute(): RouteConfig | null {
    return this.currentRoute;
  }

  // Announce page changes for screen readers (accessibility requirement)
  private announcePageChange(message: string) {
    let announcer = document.getElementById('route-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'route-announcer';
      announcer.className = 'sr-only';
      announcer.setAttribute('role', 'status');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      document.body.appendChild(announcer);
    }
    announcer.textContent = message;
  }
}

// ============================================
// ROUTE DEFINITIONS
// ============================================

const routes: RouteConfig[] = [
  // ============================================
  // PUBLIC ROUTES (No authentication required)
  // ============================================
  {
    path: '/login',
    name: 'login',
    component: () => {
      return loadLoginPage();
    },
    meta: { title: 'Login - ft_transcendence', requiresGuest: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => {
      return loadRegisterPage();
    },
    meta: { title: 'Register - ft_transcendence', requiresGuest: true },
  },
  // @ecarbona & @topiana- business, deletes all cookies than redirect to login
  {
    path: '/logout',
    name: 'logout',
    component: () => {
      sendDeleteRequest(`http://${window.location.hostname}:3029/api/logout`);
      
      // notify logout
			document.dispatchEvent(
				new CustomEvent("auth:logout", { bubbles: true })
			);
      
      return loadLoginPage();
    },
    meta: { title: 'Login - ft_transcendence', requiresGuest: true },
  },
  {
    path: '/callback',
    name: 'oauth-callback',
    component: () => {
      const div = document.createElement('div');
      div.innerHTML = '<p style="text-align:center;margin-top:50px;">Authentication successful. You may close this window.</p>';
      // Parent window will close this popup after extracting token
      return div;
    },
    meta: { title: 'OAuth Callback' },
  },
  {
    // TODO: Implement forgot password page
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => {
      return document.createElement('div');
    },
    meta: { title: 'Forgot Password - ft_transcendence', requiresGuest: true },
  },

  // ============================================
  // PROTECTED ROUTES (Authentication required)
  // ============================================
  {
    path: '/home',
    name: 'home',
    component: () => {
      return loadHomePage();
    },
    meta: { title: 'Home - ft_transcendence', requiresAuth: true, requires2FA: true },
  },
  {
    path: '/',
    name: 'home',
    component: () => {
      router.push('/home');
      return document.createElement('div');
    },
    meta: { title: 'Home - ft_transcendence', requiresAuth: true, requires2FA: true },
  },
  {
    // TODO: Implement profile page
    path: '/profile/:username',
    name: 'profile',
    component: () => {
      return loadProfilePage();
    },
    meta: { title: 'User Profile - ft_transcendence' },
  },
  {
    // TODO: Implement edit profile page
    path: '/profile/edit/:userId',
    name: 'edit-profile',
    component: () => {
      return document.createElement('div');
    },
    meta: { title: 'Edit Profile - ft_transcendence', requiresAuth: true, requires2FA: true },
  },
  {
    path: '/chats',
    name: 'chats',
    component: () => {
      const chatsPage = new ChatsPage();
      return chatsPage.loadChatsPage();
    },
    meta: { title: 'Chats - ft_transcendence', requiresAuth: true, requires2FA: true },
  },
  {
    path: '/game',
    name: 'game-lobby',
    component: () => {
      return loadGameHub();
    },
    meta: { title: 'Game Lobby - ft_transcendence', requiresAuth: true, requires2FA: true },
  },
  /* ====================== */
  /* LOCAL STUFF (maybe to move?) */
	{
		path: '/game/local',
		name: 'local-game',
		component: () => {
			return loadLocalPongPage();
		},
		meta: { title: 'Local Game - ft_transcendence', requiresAuth: true, requires2FA: true },
	},
  {
		path: '/tournament/local',
		name: 'local-tournament',
		component: () => {
			return loadLocalTournamentPage();
		},
		meta: { title: 'Local Game - ft_transcendence', requiresAuth: true, requires2FA: true },
	},
  /* ======================= */
  {
    path: '/lobby/online',
    name: 'online-game',
    component: () => {
      return loadOnlineLobbyPage();
    },
    meta: { title: 'Online Game - ft_transcendence', requiresAuth: true, requires2FA: true },
  },
  {
    path: '/game/:matchId',
    name: 'game-match',
    component: () => {
      return loadPongPlayerPage();
    },
    meta: { title: 'Game Match - ft_transcendence', requiresAuth: true, requires2FA: true },
  },
  {
    path: '/tournaments',
    name: 'tournaments',
    component: () => {
      return loadTournamentHubPage();
    },
    meta: { title: 'Tournaments - ft_transcendence', requiresAuth: true, requires2FA: true },
  },
  {
    path: '/tournament/:tournamentId',
    name: 'tournament-details',
    component: () => {
      return loadOnlineTournamentPage();
    },
    meta: { title: 'Tournament Details - ft_transcendence', requiresAuth: true, requires2FA: true },
  },
  // TODO remove this, just for testing
  {
    path: '/test/chat',
    name: 'test-chat-api',
    component: () => {
      return loadChatApiTest();
    },
    meta: { title: 'Chat API Test - ft_transcendence', requiresAuth: true, requires2FA: true },
  },

  // ============================================
  // ERROR ROUTES
  // ============================================
  {
    path: '/404',
    name: 'not-found',
    component: () => {
      return load404Page();
    },
    meta: { title: '404 - Not Found' },
  },
  {
    path: '/500',
    name: 'server-error',
    component: () => {
      return load500Page();
    },
    meta: { title: '500 - Server Error' },
  }
];

// Create and export router instance
export const router = new Router(routes);

// Export types
export type { RouteConfig, RouteParams };
