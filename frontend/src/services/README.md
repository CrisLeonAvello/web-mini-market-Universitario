# Integración con FakeStore API

Este proyecto utiliza la [FakeStore API](https://fakestoreapi.com/) para obtener datos de productos de prueba y demostración.

## 📁 Estructura de Servicios

```
src/services/
├── index.js              # Exportaciones principales
├── fakeStoreApi.js       # Servicio principal de la API
└── apiConfig.js          # Configuración centralizada
```

## 🔧 Configuración

### API Base URL
- **Producción**: `https://fakestoreapi.com`
- **Timeout**: 10 segundos
- **Reintentos**: 3 intentos automáticos

### Endpoints Disponibles

| Endpoint | Función | Descripción |
|----------|---------|-------------|
| `/products` | `getAllProducts()` | Obtiene todos los productos |
| `/products/{id}` | `getProductById(id)` | Obtiene un producto específico |
| `/products/categories` | `getAllCategories()` | Lista todas las categorías |
| `/products/category/{category}` | `getProductsByCategory(category)` | Productos por categoría |
| `/products?limit={n}` | `getProductsWithLimit(n)` | Productos con límite |
| `/products?sort={asc\|desc}` | `getProductsSorted(sort)` | Productos ordenados |

## 🔄 Transformación de Datos

Los productos de la API se transforman automáticamente para adaptarse a nuestro formato:

### Estructura Original (API)
```json
{
  "id": 1,
  "title": "Producto",
  "price": 29.99,
  "description": "Descripción",
  "category": "electronics",
  "image": "https://...",
  "rating": {
    "rate": 4.5,
    "count": 120
  }
}
```

### Estructura Transformada (App)
```json
{
  "id": 1,
  "name": "Producto",
  "title": "Producto",
  "price": 29.99,
  "originalPrice": 35.99,
  "discount": 20,
  "image": "https://...",
  "category": "electronics",
  "description": "Descripción",
  "rating": {
    "rate": 4.5,
    "count": 120
  },
  "stock": 25,
  "tags": ["electronics"],
  "featured": false
}
```

## 🏷️ Categorías

Las categorías se traducen automáticamente:

| API | Aplicación |
|-----|------------|
| `electronics` | Electrónicos |
| `jewelery` | Joyería |
| `men's clothing` | Ropa de Hombre |
| `women's clothing` | Ropa de Mujer |

## 📊 Funciones Principales

### `getTransformedProducts()`
Obtiene todos los productos transformados para la aplicación.

```javascript
import { getTransformedProducts } from './services/fakeStoreApi';

const products = await getTransformedProducts();
```

### `getTransformedCategories()`
Obtiene categorías con nombres traducidos.

```javascript
import { getTransformedCategories } from './services/fakeStoreApi';

const categories = await getTransformedCategories();
```

## 🎯 Uso en Contextos

### ProductsContext
El contexto de productos utiliza automáticamente la API:

```javascript
// En ProductsContext.jsx
import { getTransformedProducts, getTransformedCategories } from '../services/fakeStoreApi';

const loadProducts = async () => {
  const products = await getTransformedProducts();
  setAllProducts(products);
};
```

## 🔍 Filtros Compatibles

Los filtros funcionan con los datos transformados:

- **Categoría**: Filtra por `product.category`
- **Búsqueda**: Busca en `title`, `name`, `description`, `category`
- **Precio**: Filtra por `product.price`
- **Rating**: Filtra por `product.rating.rate`

## 🚀 Características Adicionales

### Cache Automático
- Cache de 5 minutos para requests repetidas
- Optimización de rendimiento
- Logs condicionales en desarrollo

### Manejo de Errores
- Reintentos automáticos (3 intentos)
- Fallbacks para categorías
- Mensajes de error descriptivos

### Configuración por Entorno
- Logs habilitados en desarrollo
- Configuración optimizada para producción
- Headers automáticos

## 🔧 Personalización

### Modificar Stock y Precios
Edita `src/services/apiConfig.js`:

```javascript
DEFAULT_PRODUCT_CONFIG: {
  MIN_STOCK: 5,           // Stock mínimo
  MAX_STOCK: 50,          // Stock máximo
  DISCOUNT_PERCENTAGE: 20, // Porcentaje de descuento
  FEATURED_PERCENTAGE: 30, // % de productos destacados
}
```

### Agregar Nuevas Categorías
```javascript
CATEGORY_NAMES: {
  'electronics': 'Electrónicos',
  'nuevacategoria': 'Nueva Categoría',
}
```

## 📝 Notas de Desarrollo

- La API de FakeStore es gratuita y no requiere autenticación
- Los datos son estáticos pero realistas
- Ideal para desarrollo y demostración
- No persistir datos sensibles (solo para pruebas)

## 🔗 Enlaces Útiles

- [Documentación oficial FakeStore API](https://fakestoreapi.com/docs)
- [GitHub del proyecto FakeStore](https://github.com/keikaavousi/fake-store-api)