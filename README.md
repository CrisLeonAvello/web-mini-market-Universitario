================================================================================
STUDIMARKET - README FUNCIONAL DEL PROYECTO
================================================================================

Este documento describe el funcionamiento general de los principales archivos y módulos del proyecto StudiMarket, una plataforma e-commerce universitaria desarrollada con HTML, CSS y JavaScript vanilla.

--------------------------------------------------------------------------------
1. ESTRUCTURA DE ARCHIVOS
--------------------------------------------------------------------------------

- index.html / paginainicio.html: Páginas principales con la interfaz de usuario, filtros, grid de productos, modales y menús.
- styles.css: Estilos visuales, animaciones, responsive design y componentes UI.
- products.json: Base de datos de productos con información completa.
- envios.json: Opciones de envío para el checkout.
- main.js: Lógica principal de renderizado, filtrado, carrito y modales.
- wishlist.js: Sistema de favoritos/wishlist, menú desplegable y notificaciones.
- loading-screen.js: Pantalla de carga animada y gestión de recursos.
- checkout.html: Página de checkout con resumen de compra, formulario y opciones de envío.
- Otros archivos JS (carpeta js/): Modularización de funcionalidades (wishlistManager.js, productManager.js, etc.).

--------------------------------------------------------------------------------
2. FUNCIONALIDADES PRINCIPALES
--------------------------------------------------------------------------------

A) SISTEMA DE PRODUCTOS
- Los productos se cargan dinámicamente desde products.json.
- Se renderizan en un grid con información: título, precio, stock, imágenes, rating, etc.
- Filtros por categoría, precio, rating y búsqueda por texto.
- Productos sin stock se muestran en escala de grises y no permiten compra.

B) MODAL DE DETALLES
- Al hacer clic en "Ver detalles", se abre un modal con información expandida del producto.
- Permite seleccionar cantidad según stock y agregar al carrito o favoritos.
- Integra sistema de reseñas (visualización y formulario bloqueado si no hay autenticación).

C) SISTEMA DE CARRITO
- Permite agregar productos, modificar cantidades y eliminar ítems.
- El carrito se muestra en un modal con resumen, subtotal, IVA y total.
- Persistencia en localStorage y contador dinámico en el ícono.
- Botón "Pagar" redirige a checkout.html.

D) SISTEMA DE WISHLIST/FAVORITOS
- Agrega y elimina productos favoritos, con menú desplegable.
- Botones para comprar todos los favoritos y vaciar la lista (sin confirmación).
- Persistencia en localStorage y feedback visual en productos y menú.
- Notificaciones toast en la esquina inferior izquierda.

E) SISTEMA DE NOTIFICACIONES
- Mensajes emergentes para acciones (agregar, eliminar, éxito, advertencia).
- Animaciones suaves y desaparición automática tras 5 segundos.

F) CHECKOUT
- checkout.html muestra resumen de productos, formulario de usuario y opciones de envío.
- Calcula totales con IVA y costo de envío.
- Simula pago y limpia el carrito tras la compra.

G) PANTALLA DE CARGA
- loading-screen.js gestiona la animación de bienvenida y bloquea la interacción hasta que los recursos estén listos.

--------------------------------------------------------------------------------
3. FLUJO DE USUARIO
--------------------------------------------------------------------------------

1. El usuario accede a la página y ve la pantalla de carga animada.
2. Al cargar, puede buscar, filtrar y explorar productos.
3. Puede agregar productos al carrito o favoritos.
4. El menú de favoritos permite comprar todos los productos o vaciar la lista.
5. El carrito muestra los productos seleccionados y permite proceder al pago.
6. En checkout.html, el usuario revisa su pedido, elige método de envío y paga.
7. Tras el pago, recibe confirmación y el carrito se limpia.

--------------------------------------------------------------------------------
4. MODULARIDAD Y EXTENSIÓN
--------------------------------------------------------------------------------

- El código está dividido en módulos para facilitar mantenimiento y escalabilidad.
- Cada archivo JS gestiona una funcionalidad específica (productos, wishlist, notificaciones, etc.).
- Los datos (productos y envíos) se cargan desde archivos JSON para facilitar actualizaciones.

--------------------------------------------------------------------------------
5. SEGURIDAD Y VALIDACIONES
--------------------------------------------------------------------------------

- Validación de stock antes de agregar al carrito.
- Bloqueo de envío de reseñas si el usuario no está autenticado.
- Sanitización básica de datos y manejo de errores en carga de recursos.

--------------------------------------------------------------------------------
6. PERSONALIZACIÓN Y RESPONSIVE
--------------------------------------------------------------------------------

- El diseño es completamente responsive y se adapta a dispositivos móviles y escritorio.
- Animaciones y feedback visual mejoran la experiencia de usuario.

--------------------------------------------------------------------------------
7. REQUISITOS
--------------------------------------------------------------------------------

- Navegador moderno compatible con ES6 y localStorage.
- Servidor local (ej: XAMPP) para cargar archivos JSON y checkout.html.

--------------------------------------------------------------------------------
8. CRÉDITOS
--------------------------------------------------------------------------------

Desarrollado con ayuda de inteligencia artificial (GitHub Copilot) y prompts personalizados.
Todos los módulos y funcionalidades fueron generados y documentados para facilitar el aprendizaje y la extensión del proyecto.

================================================================================
