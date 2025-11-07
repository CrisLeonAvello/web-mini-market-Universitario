/**
 * Servicio para consumir el API backend propio (FastAPI + SQLAlchemy)
 * Reemplaza la dependencia de FakeStore API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Helper para hacer requests HTTP
 */
async function apiRequest(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error en API request ${endpoint}:`, error);
    throw error;
  }
}

// ============================================================================
// PRODUCTOS
// ============================================================================

/**
 * Obtiene todos los productos
 */
export async function getAllProducts(params = {}) {
  const queryParams = new URLSearchParams();
  
  if (params.categoria) queryParams.append('categoria', params.categoria);
  if (params.limit) queryParams.append('limit', params.limit);
  if (params.skip) queryParams.append('skip', params.skip);
  
  const query = queryParams.toString();
  return apiRequest(`/productos${query ? '?' + query : ''}`);
}

/**
 * Obtiene un producto por ID
 */
export async function getProductById(id) {
  return apiRequest(`/productos/${id}`);
}

/**
 * Obtiene productos por categoría
 */
export async function getProductsByCategory(categoria) {
  return getAllProducts({ categoria });
}

/**
 * Obtiene todas las categorías disponibles
 */
export async function getCategories() {
  return apiRequest('/productos/categorias');
}

/**
 * Busca productos por texto
 */
export async function searchProducts(query) {
  return apiRequest(`/productos/buscar?q=${encodeURIComponent(query)}`);
}

// ============================================================================
// CARRITO
// ============================================================================

/**
 * Obtiene el carrito del usuario actual
 */
export async function getCart() {
  return apiRequest('/carrito');
}

/**
 * Agrega un producto al carrito
 */
export async function addToCart(productoId, cantidad = 1) {
  return apiRequest('/carrito/items', {
    method: 'POST',
    body: JSON.stringify({ producto_id: productoId, cantidad }),
  });
}

/**
 * Actualiza la cantidad de un item en el carrito
 */
export async function updateCartItem(itemId, cantidad) {
  return apiRequest(`/carrito/items/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify({ cantidad }),
  });
}

/**
 * Elimina un item del carrito
 */
export async function removeFromCart(itemId) {
  return apiRequest(`/carrito/items/${itemId}`, {
    method: 'DELETE',
  });
}

/**
 * Vacía el carrito completo
 */
export async function clearCart() {
  return apiRequest('/carrito', {
    method: 'DELETE',
  });
}

// ============================================================================
// AUTENTICACIÓN
// ============================================================================

/**
 * Inicia sesión
 */
export async function login(email, password) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Registra un nuevo usuario
 */
export async function register(userData) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

/**
 * Cierra sesión
 */
export async function logout() {
  return apiRequest('/auth/logout', {
    method: 'POST',
  });
}

// ============================================================================
// UTILIDADES
// ============================================================================

/**
 * Transforma producto para compatibilidad con componentes existentes
 * (si es necesario mapear campos del backend a formato frontend)
 */
export function transformProduct(product) {
  return {
    id: product.id_producto,
    title: product.titulo,
    name: product.titulo,
    price: parseFloat(product.precio),
    description: product.descripcion,
    category: product.categoria,
    image: product.imagen,
    stock: product.stock,
    rating: {
      rate: product.rating_rate ? parseFloat(product.rating_rate) : 0,
      count: product.rating_count || 0,
    },
    featured: false, // Puedes agregar este campo en el backend si lo necesitas
    tags: [product.categoria],
  };
}

/**
 * Obtiene productos transformados (compatible con frontend actual)
 */
export async function getTransformedProducts(params = {}) {
  const products = await getAllProducts(params);
  return Array.isArray(products) ? products.map(transformProduct) : [];
}

/**
 * Obtiene categorías transformadas
 */
export async function getTransformedCategories() {
  try {
    const categories = await getCategories();
    return categories.map(cat => ({
      id: cat,
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      value: cat,
    }));
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    return [];
  }
}
