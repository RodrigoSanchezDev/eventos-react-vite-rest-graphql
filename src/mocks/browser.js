import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Configurar el service worker con todos los handlers
export const worker = setupWorker(...handlers);

// Función para iniciar MSW con configuración personalizada
export const startMocking = async () => {
  // Solo en desarrollo
  if (import.meta.env.DEV) {
    await worker.start({
      onUnhandledRequest: 'bypass', // Permite pasar peticiones no mockeadas
      serviceWorker: {
        url: '/mockServiceWorker.js'
      },
      quiet: false // Muestra logs en consola
    });
    
    console.log('🎭 MSW (Mock Service Worker) iniciado correctamente');
    console.log('📡 Interceptando peticiones a /api/* y GraphQL');
  }
};
