/**
 * Configuración de la API FakeStore
 * Centraliza todas las configuraciones relacionadas con la API
 */

export const API_CONFIG = {
  // URL base de la API
  BASE_URL: 'https://fakestoreapi.com',
  
  // Configuración de timeouts
  TIMEOUT: 10000, // 10 segundos
  
  // Configuración de reintentos
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 segundo entre reintentos
  
  // Configuración de cache
  CACHE_DURATION: 300000, // 5 minutos
  
  // Endpoints disponibles
  ENDPOINTS: {
    PRODUCTS: '/products',
    CATEGORIES: '/products/categories',
    PRODUCT_BY_ID: (id) => `/products/${id}`,
    PRODUCTS_BY_CATEGORY: (category) => `/products/category/${category}`,
    PRODUCTS_LIMIT: (limit) => `/products?limit=${limit}`,
    PRODUCTS_SORTED: (sort) => `/products?sort=${sort}`,
  },
  
  // Configuración de productos por defecto
  DEFAULT_PRODUCT_CONFIG: {
    // Rango de stock aleatorio
    MIN_STOCK: 5,
    MAX_STOCK: 50,
    
    // Porcentaje de descuento simulado
    DISCOUNT_PERCENTAGE: 20,
    
    // Porcentaje de productos destacados
    FEATURED_PERCENTAGE: 30,
    
    // Imagen por defecto si falla la carga
    DEFAULT_IMAGE: '/placeholder-image.jpg',
  },
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Configuración de transformación de datos
  FIELD_MAPPING: {
    // Mapeo de campos de la API a nuestro formato
    id: 'id',
    title: ['title', 'name'],
    price: 'price',
    description: 'description',
    category: 'category',
    image: 'image',
    rating: 'rating.rate',
    ratingCount: 'rating.count',
  },
  
  // Configuración de categorías
  CATEGORY_CONFIG: {
    // Transformación de nombres de categorías
    CATEGORY_NAMES: {
      'electronics': 'Electrónicos',
      'jewelery': 'Joyería',
      'men\'s clothing': 'Ropa de Hombre',
      'women\'s clothing': 'Ropa de Mujer',
    },
    
    // Categorías por defecto si la API falla
    FALLBACK_CATEGORIES: [
      { id: 'electronics', name: 'Electrónicos', value: 'electronics' },
      { id: 'clothing', name: 'Ropa', value: 'clothing' },
      { id: 'accessories', name: 'Accesorios', value: 'accessories' },
    ]
  }
};

/**
 * Configuración de desarrollo/producción
 */
export const ENV_CONFIG = {
  // Determinar si estamos en desarrollo
  isDevelopment: import.meta.env.DEV,
  
  // Configuración específica para desarrollo
  development: {
    ENABLE_API_LOGS: true,
    ENABLE_CACHE_LOGS: true,
    MOCK_SLOW_NETWORK: false, // Simular red lenta
    SLOW_NETWORK_DELAY: 2000,
  },
  
  // Configuración específica para producción
  production: {
    ENABLE_API_LOGS: false,
    ENABLE_CACHE_LOGS: false,
    MOCK_SLOW_NETWORK: false,
  }
};

/**
 * Utilidades de configuración
 */
export const ConfigUtils = {
  /**
   * Obtiene la configuración actual basada en el entorno
   */
  getCurrentConfig: () => {
    return ENV_CONFIG.isDevelopment 
      ? ENV_CONFIG.development 
      : ENV_CONFIG.production;
  },
  
  /**
   * Construye una URL completa para un endpoint
   */
  buildUrl: (endpoint) => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
  },
  
  /**
   * Obtiene headers con configuración adicional
   */
  getHeaders: (additionalHeaders = {}) => {
    return {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...additionalHeaders,
    };
  },
  
  /**
   * Log condicional basado en la configuración
   */
  log: (message, ...args) => {
    const config = ConfigUtils.getCurrentConfig();
    if (config.ENABLE_API_LOGS) {
      console.log(`[API] ${message}`, ...args);
    }
  },
  
  /**
   * Log de cache condicional
   */
  cacheLog: (message, ...args) => {
    const config = ConfigUtils.getCurrentConfig();
    if (config.ENABLE_CACHE_LOGS) {
      console.log(`[CACHE] ${message}`, ...args);
    }
  }
};