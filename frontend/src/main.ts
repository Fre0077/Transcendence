// --- TUE IMPORT ORIGINALI ---
import { router } from './router';
import './styles/main.css';
import { createLoadingPage } from './components/loadingPage';

// --- 1. AGGIUNGI QUESTO IMPORT ---
// Importa la funzione per renderizzare la pagina di test
import { renderTestPage } from './pages/test/test.ts';

// connect to the gateway for notifications
import { ConnectLifecycleSocket, DisconnectLifecycleSocket } from '@services/ws/lifecycleWebSocket';

// Initialize chat service
import { chatService } from '@services/chatService';

// Session management
import { loadStoredSession } from '@services/session';

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
	console.log('🚀 ft_transcendence initializing...');

	// --- 2. AGGIUNGI TUTTA QUESTA LOGICA (DA QUI...) ---
	const urlParams = new URLSearchParams(window.location.search);
	const isTestMode = urlParams.get('test') === 'true';
	
	// Il tuo router.init('app') ci dice che il tuo ID radice è 'app'
	const rootElement = document.getElementById('app'); 

	if (isTestMode && rootElement) {
		// SE L'URL È ?test=true, CARICA LA PAGINA TEST
		console.warn('⚠️  Esecuzione in modalità PAGINA DI TEST. (/?test=true)');
		
		// Esegue la pagina di test e ferma il resto
		renderTestPage(rootElement); 
		
		console.log('✅ Test page initialized');
	
	} else {
		// --- 3. QUESTA ERA LA TUA LOGICA ORIGINALE (...FINO A QUI) ---
		// ALTRIMENTI, ESEGUI L'APP NORMALE (come prima)
		
    // Show loading screen
    if (rootElement) {
      rootElement.appendChild(createLoadingPage('Initializing application...'));
    }

    // Small delay to show loading before routing
    setTimeout(async () => {
  		// Redirect base path "/" to landing or login page
  		if (window.location.pathname === '/') {
  		// Simple redirect to landing page (change to '/login' or '/home' as needed)
  		window.history.replaceState({}, '', '/select');
  		}

      // Initialize router
      router.init('app');

      // Check if user is already logged in (page reload)
      const session = loadStoredSession();
      if (session.userId && session.user) {
        console.log('User already authenticated, reconnecting services...');
        
        // Reconnect WebSocket
        ConnectLifecycleSocket();
        
        // Reinitialize chat service
        try {
          await chatService.initialize();
          console.log('✅ Chat service reconnected');
        } catch (error) {
          console.error('Failed to reconnect chat service:', error);
        }
      }

		console.log('✅ Application initialized');
	  // --- FINE DEL BLOCCO MODIFICATO ---
      console.log('✅ Application initialized');
    }, 500);
  }
  // --- FINE DEL BLOCCO MODIFICATO ---
});

// Handle authentication events (for future use)
// (Tutto il resto del tuo file rimane identico)
window.addEventListener('auth:login', async () => {
  console.log('User logged in');
  
	// connect to Gateway for notifications
  	ConnectLifecycleSocket();
  
  // Initialize chat service
  try {
    await chatService.initialize();
    console.log('✅ Chat service initialized');
  } catch (error) {
    console.error('Failed to initialize chat service:', error);
  }
  
  router.push('/home');
});

window.addEventListener('auth:logout', () => {
	console.log('User logged out');

	// disconnect from gateway
	DisconnectLifecycleSocket();

	router.replace('/login');
});




// andle focus or reconnect for online status
document.addEventListener("visibilitychange", () => {
	if (document.visibilityState === "visible") {
		// user is back
		ConnectLifecycleSocket()
	}
})

window.addEventListener("focus", () => {
	ConnectLifecycleSocket()
});





// Handle errors globally
window.addEventListener('error', (e) => {
	console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
	console.error('Unhandled promise rejection:', e.reason);
});