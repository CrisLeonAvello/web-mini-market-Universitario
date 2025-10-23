/**
 * Índice de servicios
 * Exporta todos los servicios de la aplicación
 */

export * from './fakeStoreApi';

// Configuración de la API
export const API_CONFIG = {
  FAKE_STORE_URL: 'https://fakestoreapi.com',
  REQUEST_TIMEOUT: 10000, // 10 segundos
  RETRY_ATTEMPTS: 3,
};

// Utilidades de API
export const ApiUtils = {
  /**
   * Manejo de errores de API
   */
  handleApiError: (error) => {
    console.error('API Error:', error);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return 'Error de conexión. Verifica tu conexión a internet.';
    }
    
    if (error.message.includes('404')) {
      return 'Recurso no encontrado.';
    }
    
    if (error.message.includes('500')) {
      return 'Error del servidor. Inténtalo más tarde.';
    }
    
    return 'Ha ocurrido un error inesperado.';
  },

  /**
   * Reintento de peticiones fallidas
   */
  retryRequest: async (requestFn, maxRetries = 3) => {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        if (i < maxRetries - 1) {
          // Esperar antes del siguiente intento
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
    }
    
    throw lastError;
  },

  /**
   * Cache simple para requests
   */
  cache: new Map(),
  
  getCachedRequest: (key) => {
    const cached = ApiUtils.cache.get(key);
    if (cached && Date.now() - cached.timestamp < 300000) { // 5 minutos
      return cached.data;
    }
    return null;
  },
  
  setCachedRequest: (key, data) => {
    ApiUtils.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
};