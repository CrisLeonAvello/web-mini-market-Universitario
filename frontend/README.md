# 🛒 StudiMarket - E-commerce React App

## 📋 Descripción Técnica

StudiMarket es una aplicación de e-commerce moderna desarrollada en React 18 con Vite, que integra la FakeStore API para proporcionar una experiencia de compra completa con carrito de compras, lista de deseos, checkout y sistema de filtros avanzado.

## 🏗️ Arquitectura del Proyecto

### Stack Tecnológico
- **Frontend**: React 18.2.0
- **Build Tool**: Vite 5.4.21
- **API Externa**: FakeStore API (https://fakestoreapi.com)
- **State Management**: React Context API
- **Styling**: CSS3 + CSS Modules
- **Desarrollo**: ESLint + Hot Module Replacement

### Estructura de Carpetas
```
react-app/
├── public/
│   └── placeholder-image.jpg      # Imagen placeholder
├── src/
│   ├── components/               # Componentes React
│   │   ├── CartModalNew.jsx     # Modal del carrito
│   │   ├── Checkout.jsx         # Proceso de checkout
│   │   ├── ErrorBoundary.jsx    # Manejo de errores
│   │   ├── FiltersNew.jsx       # Sistema de filtros
│   │   ├── ProductCardNew.jsx   # Tarjeta de producto
│   │   ├── ProductListNew.jsx   # Lista de productos
│   │   ├── ProductModalNew.jsx  # Modal de detalles
│   │   └── WishlistModalNew.jsx # Modal de favoritos
│   ├── contexts/                # Context API providers
│   │   ├── CartContext.jsx      # Estado del carrito
│   │   ├── ProductsContext.jsx  # Estado de productos
│   │   └── WishlistContext.jsx  # Estado de favoritos
│   ├── services/                # Servicios API
│   │   └── fakeStoreApi.js      # Cliente de FakeStore API
│   ├── App.jsx                  # Componente principal
│   ├── main.jsx                 # Entry point
│   ├── animations.css           # Animaciones CSS
│   ├── components.css           # Estilos de componentes
│   └── styles.css               # Estilos globales
├── .env.example                 # Variables de entorno ejemplo
├── package.json                 # Dependencias del proyecto
└── README.md                    # Este archivo
```

## 🔧 Configuración del Entorno

### Prerrequisitos
- Node.js >= 16.0.0
- npm >= 8.0.0

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/CrisLeonAvello/web-mini-market-Universitario.git
   cd web-mini-market-Universitario/react-app
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   Editar el archivo `.env` según tus necesidades.

4. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en navegador**
   ```
   http://localhost:5173
   ```

## 🏛️ Arquitectura de Componentes

### Context Providers (Estado Global)

#### ProductsContext
- **Responsabilidad**: Gestión de productos, categorías y filtros
- **Funcionalidades**:
  - Carga de productos desde FakeStore API
  - Sistema de filtros (categoría, precio, rating, búsqueda)
  - Transformación de datos de API a formato interno
  - Cache de productos y categorías

#### CartContext
- **Responsabilidad**: Gestión del carrito de compras
- **Funcionalidades**:
  - Agregar/remover productos del carrito
  - Actualizar cantidades
  - Calcular totales y subtotales
  - Persistencia en localStorage
  - Validación de stock

#### WishlistContext
- **Responsabilidad**: Gestión de lista de favoritos
- **Funcionalidades**:
  - Agregar/remover favoritos
  - Persistencia en localStorage
  - Operaciones batch (limpiar todo, comprar todo)

### Componentes Principales

#### ProductCardNew.jsx
```jsx
// Tarjeta de producto con funcionalidades completas
- Información del producto (imagen, título, precio, rating)
- Botones de acción (agregar carrito, favoritos, ver detalles)
- Indicadores visuales (stock, descuentos, ofertas)
- Animaciones y notificaciones
```

#### CartModalNew.jsx
```jsx
// Modal del carrito de compras
- Lista de productos en el carrito
- Controles de cantidad
- Cálculo de totales
- Integración con checkout
- Notificaciones de estado
```

#### Checkout.jsx
```jsx
// Proceso de checkout completo
- Formulario de datos del cliente
- Selección de método de pago
- Resumen del pedido
- Confirmación de compra
- Animaciones de éxito
```

## 🔄 Flujo de Datos

### Carga Inicial
1. **App.jsx** inicializa los providers
2. **ProductsContext** carga productos de FakeStore API
3. **ProductListNew** renderiza productos disponibles
4. **FiltersNew** configura filtros basados en datos

### Interacción del Usuario
1. **Usuario** hace clic en "Agregar al carrito"
2. **ProductCardNew** llama `addToCart()`
3. **CartContext** actualiza estado y localStorage
4. **CartModalNew** refleja cambios automáticamente

### Proceso de Compra
1. **Usuario** abre modal del carrito
2. **CartModalNew** muestra productos y total
3. **Usuario** procede al checkout
4. **Checkout** maneja proceso de compra
5. **CartContext** limpia carrito tras compra exitosa

## 🎨 Sistema de Estilos

### Archivos CSS
- **styles.css**: Estilos globales, layout principal, responsive design
- **components.css**: Estilos específicos de componentes
- **animations.css**: Biblioteca de animaciones CSS

### Metodología CSS
- **BEM** para nombres de clases
- **Mobile-first** para responsive design
- **CSS Grid** y **Flexbox** para layouts
- **CSS Variables** para temas y colores

### Responsive Design
```css
/* Breakpoints principales */
@media (max-width: 768px)  { /* Mobile */ }
@media (max-width: 1024px) { /* Tablet */ }
@media (min-width: 1025px) { /* Desktop */ }
```

## 🔗 Integración con API

### FakeStore API
- **Base URL**: `https://fakestoreapi.com`
- **Endpoints utilizados**:
  - `GET /products` - Lista todos los productos
  - `GET /products/categories` - Lista categorías

### Transformación de Datos
```javascript
// Mapeo de campos API → Aplicación
{
  id: product.id,
  title: product.title,
  price: product.price,
  description: product.description,
  category: product.category,
  image: product.image,
  rating: product.rating.rate,
  ratingCount: product.rating.count
}
```

## 🧪 Manejo de Errores

### ErrorBoundary
- Captura errores de JavaScript en componentes
- Muestra interfaz de error amigable
- Logs detallados para debugging
- Opción de recarga de página

### Validaciones
- **Productos**: Verificación de estructura de datos
- **Carrito**: Validación de stock y cantidades
- **Formularios**: Validación de campos requeridos

## 📱 Características de UX/UI

### Animaciones
- **Entrada**: FadeIn, SlideIn para productos
- **Interacción**: Hover effects, pulse animations
- **Feedback**: Success/error notifications
- **Transiciones**: Smooth state changes

### Notificaciones
- Sistema de notificaciones temporales
- Estados: éxito, error, información
- Auto-dismiss después de 2 segundos
- Posicionamiento no intrusivo

### Accesibilidad
- Navegación por teclado
- Alt text en imágenes
- Contraste de colores WCAG AA
- Estructura semántica HTML5

## 🚀 Scripts Disponibles

```bash
npm run dev          # Servidor desarrollo (puerto 5173)
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Linting con ESLint
```

## 🔧 Configuración de Desarrollo

### ESLint
```javascript
// Reglas principales
- react/jsx-uses-react: off
- react/react-in-jsx-scope: off
- no-unused-vars: warn
- prefer-const: error
```

### Vite Config
```javascript
// Configuración optimizada
- Hot Module Replacement
- Fast Refresh para React
- Optimización de imports
- Build optimizado para producción
```

## 📊 Performance

### Optimizaciones
- **Lazy Loading**: Componentes bajo demanda
- **Memoización**: React.memo para componentes costosos
- **Debouncing**: En filtros de búsqueda
- **Virtual Scrolling**: Para listas grandes (futuro)

### Métricas
- **First Paint**: < 1.5s
- **Interactive**: < 3s
- **Bundle Size**: < 500KB gzipped

## 🐛 Debugging

### Console Logs
```javascript
// Activar logs detallados
VITE_ENABLE_CONSOLE_LOGS=true

// Logs incluidos:
🔄 Carga de productos
🛒 Acciones del carrito
💖 Gestión de favoritos
🔍 Aplicación de filtros
```

### Chrome DevTools
- React Developer Tools recomendado
- Redux DevTools para Context debugging
- Network tab para monitoreo de API

## 🔒 Seguridad

### Validaciones
- Sanitización de inputs de usuario
- Validación de tipos en props
- Escape de HTML en contenido dinámico

### API Security
- Rate limiting nativo de FakeStore API
- No exposición de API keys sensibles
- HTTPS en todas las comunicaciones

## 🚧 Limitaciones Conocidas

### FakeStore API
- **Rate Limit**: ~100 requests/minute
- **Datos estáticos**: Productos no actualizables
- **Stock simulado**: Generado aleatoriamente

### Funcionalidades Futuras
- Autenticación de usuarios
- Procesamiento real de pagos
- Panel de administración
- Base de datos propia
- PWA (Progressive Web App)

## 🤝 Contribución

### Flujo de Desarrollo
1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

### Estándares de Código
- Usar Prettier para formato
- Seguir convenciones de React
- Documentar funciones complejas
- Agregar tests para nuevas funcionalidades

## 📞 Soporte

Para reportar bugs o solicitar funcionalidades:
- **Issues**: GitHub Issues del repositorio
- **Email**: [correo del desarrollador]
- **Documentación**: README.md y comentarios en código

---

**Desarrollado con ❤️ por CrisLeonAvello**

*Última actualización: Octubre 2025*
