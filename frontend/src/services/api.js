/**
 * Servicio para consumir el API backend propio (FastAPI + SQLAlchemy)
 * Reemplaza la dependencia de FakeStore API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

console.log('🌍 API Configuration:');
console.log('  - import.meta.env.VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('  - API_BASE_URL:', API_BASE_URL);
console.log('  - Environment mode:', import.meta.env.MODE);

/**
 * Helper para obtener el token de autenticación
 */
function getAuthToken() {
  return localStorage.getItem('authToken');
}

/**
 * Helper para hacer requests HTTP
 */
async function apiRequest(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getAuthToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    // Agregar token de autenticación si existe
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    console.log('🌐 API Request:', {
      endpoint,
      url,
      API_BASE_URL,
      hasToken: !!token,
      options
    });
    
    const response = await fetch(url, {
      headers,
      ...options,
    });

    console.log('📡 API Response:', {
      url,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('📦 API Data received:', data);
    return data;
  } catch (error) {
    console.error(`❌ Error en API request ${endpoint}:`, error);
    console.error('🔍 Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      endpoint,
      url: `${API_BASE_URL}${endpoint}`
    });
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

/**
 * Procesar checkout
 */
export async function processCheckout(checkoutData) {
  return apiRequest('/carrito/checkout', {
    method: 'POST',
    body: JSON.stringify(checkoutData),
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
    id: product.id || product.id_producto,
    title: product.title || product.titulo,
    name: product.name || product.title || product.titulo,
    price: parseFloat(product.price || product.precio),
    description: product.description || product.descripcion || "",
    category: product.category || product.categoria,
    image: product.image || product.imagen,
    stock: product.stock || 0,
    rating: {
      rate: product.rating?.rate || product.rating_rate ? parseFloat(product.rating?.rate || product.rating_rate) : 0,
      count: product.rating?.count || product.rating_count || 0,
    },
    featured: product.featured || false,
    tags: product.tags || [product.category || product.categoria],
  };
}

/**
 * Obtiene productos transformados (compatible con frontend actual)
 */
export async function getTransformedProducts(params = {}) {
  const response = await getAllProducts(params);
  console.log('🔍 Raw API Response:', response);
  
  // La API devuelve { products: [...], total: ..., page: ... }
  // Necesitamos extraer solo el array de productos
  const products = response.products || response || [];
  console.log('📦 Products array:', products);
  
  if (!Array.isArray(products)) {
    console.error('❌ Products is not an array:', typeof products, products);
    return [];
  }
  
  const transformedProducts = products.map(transformProduct);
  console.log('✨ Transformed products:', transformedProducts);
  
  return transformedProducts;
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

// ============================================================================
// GESTIÓN DE PRODUCTOS DEL USUARIO (VENDEDOR)
// ============================================================================

/**
 * Obtiene los productos del usuario actual (sus publicaciones)
 */
export async function getMyProducts() {
  return apiRequest('/productos/mis-productos');
}

/**
 * Crea un nuevo producto para vender
 */
export async function createProduct(productData) {
  const token = getAuthToken();
  const formData = new URLSearchParams();
  formData.append('titulo', productData.titulo);
  formData.append('descripcion', productData.descripcion);
  formData.append('precio', productData.precio);
  formData.append('stock', productData.stock);
  formData.append('categoria', productData.categoria);
  if (productData.imagen) formData.append('imagen', productData.imagen);
  formData.append('condicion', productData.condicion || 'nuevo');

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return apiRequest('/productos/', {
    method: 'POST',
    headers,
    body: formData.toString(),
  });
}

/**
 * Actualiza un producto existente
 */
export async function updateProduct(productId, productData) {
  const token = getAuthToken();
  const formData = new URLSearchParams();
  if (productData.titulo) formData.append('titulo', productData.titulo);
  if (productData.descripcion) formData.append('descripcion', productData.descripcion);
  if (productData.precio) formData.append('precio', productData.precio);
  if (productData.stock !== undefined) formData.append('stock', productData.stock);
  if (productData.categoria) formData.append('categoria', productData.categoria);
  if (productData.imagen) formData.append('imagen', productData.imagen);

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return apiRequest(`/productos/${productId}`, {
    method: 'PUT',
    headers,
    body: formData.toString(),
  });
}

/**
 * Elimina (desactiva) un producto
 */
export async function deleteProduct(productId) {
  return apiRequest(`/productos/${productId}`, {
    method: 'DELETE',
  });
}

/**
 * Pausa o reactiva un producto
 */
export async function toggleProductStatus(productId) {
  return apiRequest(`/productos/${productId}/pausar`, {
    method: 'PATCH',
  });
}

