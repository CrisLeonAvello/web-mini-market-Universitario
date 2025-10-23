/**
 * Servicio para consumir la API de FakeStore
 * https://fakestoreapi.com/
 */

import { API_CONFIG, ConfigUtils } from './apiConfig';

const BASE_URL = API_CONFIG.BASE_URL;

/**
 * Función helper para hacer peticiones HTTP
 */
async function apiRequest(endpoint, options = {}) {
  try {
    const fullUrl = `${BASE_URL}${endpoint}`;
    console.log(`🌐 Realizando fetch a: ${fullUrl}`);
    ConfigUtils.log(`Realizando petición a: ${endpoint}`);
    
    const response = await fetch(fullUrl, {
      headers: ConfigUtils.getHeaders(options.headers),
      timeout: API_CONFIG.TIMEOUT,
      ...options,
    });

    console.log('📡 Respuesta del fetch:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('📦 Datos parseados del JSON:', data);
    ConfigUtils.log(`Respuesta recibida de ${endpoint}:`, data.length || 'objeto');
    
    return data;
  } catch (error) {
    console.error(`❌ Error en API request ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Obtiene todos los productos
 */
export async function getAllProducts() {
  console.log('🔗 Llamando a apiRequest con endpoint:', API_CONFIG.ENDPOINTS.PRODUCTS);
  const result = await apiRequest(API_CONFIG.ENDPOINTS.PRODUCTS);
  console.log('📦 Resultado de apiRequest:', result);
  return result;
}

/**
 * Obtiene un producto específico por ID
 */
export async function getProductById(id) {
  return apiRequest(API_CONFIG.ENDPOINTS.PRODUCT_BY_ID(id));
}

/**
 * Obtiene productos por categoría
 */
export async function getProductsByCategory(category) {
  return apiRequest(API_CONFIG.ENDPOINTS.PRODUCTS_BY_CATEGORY(category));
}

/**
 * Obtiene todas las categorías disponibles
 */
export async function getAllCategories() {
  return apiRequest(API_CONFIG.ENDPOINTS.CATEGORIES);
}

/**
 * Obtiene productos con límite
 */
export async function getProductsWithLimit(limit = 10) {
  return apiRequest(API_CONFIG.ENDPOINTS.PRODUCTS_LIMIT(limit));
}

/**
 * Obtiene productos ordenados
 * @param {string} sort - 'asc' o 'desc'
 */
export async function getProductsSorted(sort = 'asc') {
  return apiRequest(API_CONFIG.ENDPOINTS.PRODUCTS_SORTED(sort));
}

/**
 * Transforma un producto de la API a nuestro formato
 */
export function transformProduct(apiProduct) {
  const config = API_CONFIG.DEFAULT_PRODUCT_CONFIG;
  
  return {
    id: apiProduct.id,
    name: apiProduct.title,
    title: apiProduct.title,
    price: apiProduct.price,
    originalPrice: apiProduct.price + (apiProduct.price * (config.DISCOUNT_PERCENTAGE / 100)),
    discount: config.DISCOUNT_PERCENTAGE,
    image: apiProduct.image,
    category: apiProduct.category,
    description: apiProduct.description,
    rating: {
      rate: apiProduct.rating?.rate || 0,
      count: apiProduct.rating?.count || 0
    },
    stock: Math.floor(Math.random() * (config.MAX_STOCK - config.MIN_STOCK + 1)) + config.MIN_STOCK,
    tags: [apiProduct.category],
    featured: Math.random() > (1 - config.FEATURED_PERCENTAGE / 100),
  };
}

/**
 * Obtiene productos transformados para nuestra aplicación
 */
export async function getTransformedProducts() {
  try {
    console.log('🌐 Iniciando petición a FakeStore API...');
    const products = await getAllProducts();
    console.log('📡 Respuesta de getAllProducts():', products);
    console.log('📊 Número de productos recibidos:', products?.length);
    
    if (products && products.length > 0) {
      console.log('🛍️ Primer producto de la API:', products[0]);
    }
    
    const transformedProducts = products.map(transformProduct);
    console.log('🔄 Productos transformados:', transformedProducts);
    console.log('📊 Número de productos transformados:', transformedProducts.length);
    
    if (transformedProducts.length > 0) {
      console.log('✅ Primer producto transformado:', transformedProducts[0]);
    }
    
    return transformedProducts;
  } catch (error) {
    console.error('❌ Error obteniendo productos transformados:', error);
    return [];
  }
}

/**
 * Obtiene categorías transformadas
 */
export async function getTransformedCategories() {
  try {
    const categories = await getAllCategories();
    const categoryNames = API_CONFIG.CATEGORY_CONFIG.CATEGORY_NAMES;
    
    return categories.map(category => ({
      id: category,
      name: categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1),
      value: category
    }));
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    // Retornar categorías de fallback
    return API_CONFIG.CATEGORY_CONFIG.FALLBACK_CATEGORIES;
  }
}