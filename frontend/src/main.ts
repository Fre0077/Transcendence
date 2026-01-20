// --- TUE IMPORT ORIGINALI ---
import { router } from './router';
import './styles/main.css';

// --- 1. AGGIUNGI QUESTO IMPORT ---
// Importa la funzione per renderizzare la pagina di test
import { renderTestPage } from './pages/test/test.ts';

// connect to the gateway for notifications
import { ConnectLifecycleSocket, DisconnectLifecycleSocket } from '@services/lifecycleWebSocket';

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
    
    // Redirect base path "/" to landing or login page
    if (window.location.pathname === '/') {
      // Simple redirect to landing page (change to '/login' or '/dashboard' as needed)
      window.history.replaceState({}, '', '/home');
    }

    // Initialize router
    router.init('app');

    console.log('✅ Application initialized');
  }
  // --- FINE DEL BLOCCO MODIFICATO ---
});

// Handle authentication events (for future use)
// (Tutto il resto del tuo file rimane identico)
window.addEventListener('auth:login', () => {
  console.log('User logged in');
  
  // connect to Gateway for notifications
  ConnectLifecycleSocket();
  
  router.push('/dashboard');
});

window.addEventListener('auth:logout', () => {
  console.log('User logged out');

  // disconnect from gateway
  DisconnectLifecycleSocket();

  router.replace('/login');
});

// Handle errors globally
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});