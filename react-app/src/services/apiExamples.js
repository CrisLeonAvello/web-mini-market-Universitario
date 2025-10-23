/**
 * Archivo de prueba para demostrar el uso directo de la API FakeStore
 * Puedes ejecutar estos ejemplos directamente en la consola del navegador
 */

// 1. FETCH BÁSICO - El que mencionaste
console.log('🔄 Ejecutando fetch básico...');
fetch('https://fakestoreapi.com/products')
  .then(response => response.json())
  .then(data => {
    console.log('✅ Productos obtenidos (fetch básico):', data);
    console.log('📊 Total de productos:', data.length);
  })
  .catch(error => console.error('❌ Error:', error));

// 2. FETCH CON ASYNC/AWAIT (más moderno)
async function fetchProductsModern() {
  try {
    console.log('🔄 Ejecutando fetch con async/await...');
    const response = await fetch('https://fakestoreapi.com/products');
    const data = await response.json();
    
    console.log('✅ Productos obtenidos (async/await):', data);
    console.log('📊 Total de productos:', data.length);
    
    // Mostrar el primer producto como ejemplo
    if (data.length > 0) {
      console.log('🛍️ Primer producto:', data[0]);
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// 3. OTROS ENDPOINTS ÚTILES
const API_EXAMPLES = {
  // Obtener todas las categorías
  getCategories: () => {
    fetch('https://fakestoreapi.com/products/categories')
      .then(res => res.json())
      .then(data => console.log('🏷️ Categorías:', data));
  },
  
  // Obtener un producto específico
  getProduct: (id = 1) => {
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then(res => res.json())
      .then(data => console.log(`🛍️ Producto ${id}:`, data));
  },
  
  // Obtener productos por categoría
  getByCategory: (category = 'electronics') => {
    fetch(`https://fakestoreapi.com/products/category/${category}`)
      .then(res => res.json())
      .then(data => console.log(`📱 Productos de ${category}:`, data));
  },
  
  // Obtener productos con límite
  getWithLimit: (limit = 5) => {
    fetch(`https://fakestoreapi.com/products?limit=${limit}`)
      .then(res => res.json())
      .then(data => console.log(`🔢 Primeros ${limit} productos:`, data));
  },
  
  // Obtener productos ordenados
  getSorted: (sort = 'desc') => {
    fetch(`https://fakestoreapi.com/products?sort=${sort}`)
      .then(res => res.json())
      .then(data => console.log(`📈 Productos ordenados (${sort}):`, data));
  }
};

// 4. FUNCIÓN PARA PROBAR TODOS LOS ENDPOINTS
async function testAllEndpoints() {
  console.log('🧪 Iniciando prueba completa de la API...');
  
  try {
    // Productos
    const products = await fetch('https://fakestoreapi.com/products').then(r => r.json());
    console.log('✅ Productos:', products.length);
    
    // Categorías
    const categories = await fetch('https://fakestoreapi.com/products/categories').then(r => r.json());
    console.log('✅ Categorías:', categories);
    
    // Producto específico
    const product = await fetch('https://fakestoreapi.com/products/1').then(r => r.json());
    console.log('✅ Producto 1:', product.title);
    
    console.log('🎉 Todas las pruebas completadas exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  }
}

// EXPORTAR PARA USO EN LA APLICACIÓN
export {
  fetchProductsModern,
  API_EXAMPLES,
  testAllEndpoints
};

// INSTRUCCIONES PARA LA CONSOLA
console.log(`
🔧 INSTRUCCIONES PARA PROBAR LA API:

1. Fetch básico (tu ejemplo):
   fetch('https://fakestoreapi.com/products').then(r => r.json()).then(console.log)

2. Función moderna:
   fetchProductsModern()

3. Probar categorías:
   API_EXAMPLES.getCategories()

4. Probar producto específico:
   API_EXAMPLES.getProduct(5)

5. Probar por categoría:
   API_EXAMPLES.getByCategory('electronics')

6. Probar con límite:
   API_EXAMPLES.getWithLimit(3)

7. Probar todos los endpoints:
   testAllEndpoints()
`);

// Auto-ejecutar la función moderna cuando se carga el archivo
// fetchProductsModern();