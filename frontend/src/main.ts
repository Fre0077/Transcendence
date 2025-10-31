import { router } from './router';
import './styles/main.css';

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 ft_transcendence initializing...');

  // Redirect base path "/" to landing or login page
  if (window.location.pathname === '/') {
    // Simple redirect to landing page (change to '/login' or '/dashboard' as needed)
    window.history.replaceState({}, '', '/home');
  }

  // Initialize router
  router.init('app');

  console.log('✅ Application initialized');
});

// Handle authentication events (for future use)
window.addEventListener('auth:login', () => {
  console.log('User logged in');
  router.push('/dashboard');
});

window.addEventListener('auth:logout', () => {
  console.log('User logged out');
  router.replace('/login');
});

// Handle errors globally
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});
