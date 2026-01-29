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
import { loadLocalPongPage } from "./pages/protected/game/local/loadLocalPongPage";
import { loadHomePage } from "./pages/protected/home/home";
import { loadProfilePage } from "./pages/protected/profile/profile";
import { loadLoginPage } from "./pages/public/login/login";
import { loadRegisterPage } from "./pages/public/register/register";
import { load2FAVerifyPage } from "./pages/public/2fa-verify/2fa-verify";
import { load2FASetupPage } from "./pages/protected/2fa-setup/2fa-setup";
import { createLoadingPage } from "./components/loadingPage";


// services
import { authService } from "@services/authService";

type RouteComponent = () => HTMLElement | Promise<HTMLElement>;

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

    const { route, params } = match;
    this.params = params;

    // ============================================
    // AUTHENTICATION GUARDS
    // ============================================
    
    // For guest routes (login, register, 2fa-verify), skip auth check
    // These routes explicitly require NOT being authenticated
    if (route.meta?.requiresGuest) {
      // Check cached state only (no backend call)
      const isAuthenticated = authService.isAuthenticated();
      if (isAuthenticated) {
        this.replace('/home');
        return;
      }
      // Don't check with backend - user should not be authenticated here
    } else {
      // For all other routes, check authentication with backend
      const isAuthenticated = await authService.checkAuth();
      
      // Protected routes - redirect to login if not authenticated
      if (route.meta?.requiresAuth && !isAuthenticated) {
        this.replace('/login');
        return;
      }
    }
    
    const has2FA = authService.has2FAEnabled();
    
    // 2FA protected routes - For now, we allow access even without 2FA
    // In the future, you can uncomment this to enforce 2FA for certain routes
    // if (route.meta?.requires2FA && !has2FA) {
    //   // Redirect to 2FA setup page
    //   this.replace('/2fa-setup');
    //   return;
    // }

    // Update page title
    if (route.meta?.title) {
      document.title = route.meta.title;
    }

    // Update current route and render
    this.currentRoute = route;
    this.render(route);
  }

  // Render the component
  private async render(route: RouteConfig) {
    if (!this.rootElement) return;

    // Show loading state
    this.rootElement.innerHTML = '';
    this.rootElement.appendChild(createLoadingPage('Loading page...'));

    // Small delay to show loading animation
    await new Promise(resolve => setTimeout(resolve, 150));

    if (!this.rootElement) return;

    try {
      // Clear and render new component (handle both sync and async components)
      this.rootElement.innerHTML = '';
      const componentResult = route.component();
      const component = componentResult instanceof Promise 
        ? await componentResult 
        : componentResult;
      this.rootElement.appendChild(component);

      // Scroll to top
      window.scrollTo(0, 0);

      // Announce page change for screen readers (accessibility)
      this.announcePageChange(route.meta?.title || 'Page loaded');
    } catch (error) {
      console.error('Error rendering component:', error);
      if (this.rootElement) {
        this.rootElement.innerHTML = '<div class="text-red-500 p-8">Error loading page. Please try again.</div>';
      }
    }
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
  {
    path: '/2fa-verify',
    name: '2fa-verify',
    component: () => {
      return load2FAVerifyPage();
    },
    meta: { title: '2FA Verification - ft_transcendence', requiresGuest: true },
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
    path: '/profile/:userId',
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
    path: '/settings/2fa',
    name: '2fa-setup',
    component: () => {
      return load2FASetupPage();
    },
    meta: { title: 'Two-Factor Authentication - ft_transcendence', requiresAuth: true },
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
	{
		path: '/game/local',
		name: 'local-game',
		component: () => {
			return loadLocalPongPage();
		},
		meta: { title: 'Local Game - ft_transcendence', requiresAuth: true, requires2FA: true },
	},
  {
    path: '/lobby/online',
    name: 'online-game',
    component: () => {
      return loadOnlineLobbyPage();
    },
    meta: { title: 'Online Game - ft_transcendence', requiresAuth: true, requires2FA: true },
  },
  {
    // TODO: Implement game match page
    path: '/game/:matchId',
    name: 'game-match',
    component: () => {
      return loadPongPlayerPage();
    },
    meta: { title: 'Game Match - ft_transcendence', requiresAuth: true, requires2FA: true },
  },
  {
    // TODO: Implement tournaments page
    path: '/tournaments',
    name: 'tournaments',
    component: () => {
      return loadTournamentHubPage();
    },
    meta: { title: 'Tournaments - ft_transcendence', requiresAuth: true, requires2FA: true },
  },
  {
    // TODO: Implement tournament details page
    path: '/tournament/:tournamentId',
    name: 'tournament-details',
    component: () => {
      return loadOnlineTournamentPage();
    },
    meta: { title: 'Tournament Details - ft_transcendence', requiresAuth: true, requires2FA: true },
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
