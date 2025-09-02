// main.js extraído de paginainicio.html
// Variables globales
let allProducts = [];
let filteredProducts = [];
let cart = [];
let currentProduct = null;

// Función para inicializar la aplicación después de la carga
function initializeApp() {
    console.log('🚀 Inicializando StudiMarket...');
    
    // Aquí puedes agregar cualquier lógica de inicialización adicional
    // Por ejemplo: cargar datos del usuario, configurar analytics, etc.
    
    // Mostrar mensaje de bienvenida en consola
    console.log('✅ StudiMarket inicializado correctamente');
}

// Cargar productos desde JSON
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allProducts = await response.json();
        filteredProducts = [...allProducts];
        renderProducts(filteredProducts);
        populateCategories();
    } catch (error) {
        console.error('Error cargando productos:', error);
        showError('Error al cargar los productos. Verifica que el archivo products.json esté en la misma carpeta.');
    }
}

// Mostrar error
function showError(message) {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = `<div class="error-message">${message}</div>`;
}

// Renderizar productos
function renderProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    if (products.length === 0) {
        productsGrid.innerHTML = '<div class="loading-message">No se encontraron productos.</div>';
        return;
    }
    
    const wishlist = typeof getWishlist === 'function' ? getWishlist() : [];
    
    const productsHTML = products.map(product => {
        let imgSrc = (product.imagenes && product.imagenes.length > 0) ? product.imagenes[0] : getDefaultImage(product.categoria);
        let featuredBadge = product.destacado ? '<span class="featured-badge">Destacado</span>' : '';
        let stockClass = product.stock > 0 ? '' : 'out-of-stock';
        let addToCartClass = product.stock > 0 ? '' : 'disabled';
        let addToCartText = product.stock > 0 ? 'Agregar al carrito' : 'Sin stock';
        let isFavorite = wishlist.includes(product.id);
        return `
        <article class="product-card">
            <div class="product-image ${stockClass}" style="background-image: url('${imgSrc}'); cursor: pointer;" onclick="showProductModal('${product.id}')">
                <span class="product-tag">${product.categoria}</span>
                ${featuredBadge}
            </div>
            <div class="product-info">
                <div class="product-brand"><small>${product.marca}</small></div>
                <h3 class="product-title">${product.titulo}</h3>
                <p class="product-description">${product.descripcion}</p>
                <div class="product-rating">
                    <span class="stars">${renderStars(product.rating)}</span>
                    <span class="rating-text">(${product.rating})</span>
                </div>
                <div class="product-footer">
                    <span class="price">$${product.precio.toLocaleString()}</span>
                    <div class="availability-wishlist">
                        <span class="availability ${stockClass}">${product.stock} disponibles</span>
                        <div class="product-actions">
                            <button class="wishlist-heart-btn ${isFavorite ? 'active' : ''}" data-id="${product.id}" title="Agregar a favoritos">
                                <span class="heart-icon">♡</span>
                            </button>
                        </div>
                    </div>
                </div>
                <button class="add-to-cart ${addToCartClass}" data-product-id="${product.id}" ${product.stock === 0 ? 'disabled' : ''}>${addToCartText}</button>
            </div>
        </article>
        `;
    }).join('');

    productsGrid.innerHTML = productsHTML;
    console.log('Products rendered:', products.length);
    
    // Agregar eventos manualmente a los botones de carrito
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        if (!button.disabled) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const productId = this.getAttribute('data-product-id');
                console.log('Cart button clicked for product:', productId);
                addToCart(productId);
            });
        }
    });
    
    // Asignar eventos de wishlist a los botones de corazón
    if (typeof assignWishlistEvents === 'function') {
        console.log('Assigning wishlist events');
        assignWishlistEvents();
    } else {
        console.error('assignWishlistEvents function not found');
    }
    
    // Asignar eventos a los botones de ver detalles
    assignViewDetailsEvents();
    console.log('View details events assigned');
}

// Generar estrellas basadas en rating
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    return '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(emptyStars);
}

// Imagen por defecto según categoría
function getDefaultImage(category) {
    const defaultImages = {
        'Cursos': 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"><rect fill="%23f0f0f0" width="300" height="200"/><text x="150" y="100" text-anchor="middle" fill="%23666" font-size="14" font-family="Arial">Curso</text></svg>',
        'Útiles Escolares': 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"><rect fill="%23e8f4f8" width="300" height="200"/><text x="150" y="100" text-anchor="middle" fill="%23666" font-size="14" font-family="Arial">Útiles</text></svg>',
        'Libros': 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"><rect fill="%23fff3e0" width="300" height="200"/><text x="150" y="100" text-anchor="middle" fill="%23666" font-size="14" font-family="Arial">Libros</text></svg>',
        'Accesorios': 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"><rect fill="%23f3e5f5" width="300" height="200"/><text x="150" y="100" text-anchor="middle" fill="%23666" font-size="14" font-family="Arial">Accesorios</text></svg>',
        'Tecnología': 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"><rect fill="%23fff9c4" width="300" height="200"/><text x="150" y="100" text-anchor="middle" fill="%23666" font-size="14" font-family="Arial">Tecnología</text></svg>',
        'Electrónica': 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"><rect fill="%23e0f7fa" width="300" height="200"/><text x="150" y="100" text-anchor="middle" fill="%23666" font-size="14" font-family="Arial">Electrónica</text></svg>',
        'Moda': 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"><rect fill="%23fce4ec" width="300" height="200"/><text x="150" y="100" text-anchor="middle" fill="%23666" font-size="14" font-family="Arial">Moda</text></svg>',
        'Juguetes': 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"><rect fill="%23fffde7" width="300" height="200"/><text x="150" y="100" text-anchor="middle" fill="%23666" font-size="14" font-family="Arial">Juguetes</text></svg>',
        'Hogar': 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"><rect fill="%23e1bee7" width="300" height="200"/><text x="150" y="100" text-anchor="middle" fill="%23666" font-size="14" font-family="Arial">Hogar</text></svg>',
        'Deportes': 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"><rect fill="%23c8e6c9" width="300" height="200"/><text x="150" y="100" text-anchor="middle" fill="%23666" font-size="14" font-family="Arial">Deportes</text></svg>'
    };
    return defaultImages[category] || defaultImages['Cursos'];
}

// Poblar categorías en el filtro
function populateCategories() {
    const categorySelect = document.querySelector('.filter-select');
    const categories = [...new Set(allProducts.map(p => p.categoria))];
    categorySelect.innerHTML = '<option value="">Seleccionar categoría</option>' +
        categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
}

// Función para agregar al carrito
function addToCart(productId) {
    console.log('addToCart called with ID:', productId);
    console.log('allProducts:', allProducts);
    
    const product = allProducts.find(p => p.id === productId);
    console.log('Found product:', product);
    
    if (!product || product.stock === 0) {
        console.log('Product not found or out of stock');
        showNotification('⚠️ Producto sin stock disponible', 'warning');
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    console.log('Existing item in cart:', existingItem);
    console.log('Cart before:', cart);
    
    if (existingItem) {
        existingItem.quantity += 1;
        showNotification(`🛒 ${product.titulo} - Cantidad actualizada (${existingItem.quantity})`, 'success');
        console.log('Updated existing item quantity');
    } else {
        cart.push({...product, quantity: 1});
        showNotification(`🛒 ${product.titulo} agregado al carrito`, 'success');
        console.log('Added new item to cart');
    }
    
    console.log('Cart after:', cart);
    updateCartDisplay();
    
    // Buscar el botón que activó esta función y mostrar feedback
    const button = document.querySelector(`[data-product-id="${productId}"]`);
    if (button) {
        showAddedToCartFeedback(button);
    }
}

function showAddedToCartFeedback(button) {
    const originalText = button.textContent;
    const originalBg = button.style.background;
    button.style.background = '#28a745';
    button.textContent = '✓ Agregado';
    button.disabled = true;
    
    setTimeout(() => {
        button.style.background = originalBg;
        button.textContent = originalText;
        button.disabled = false;
    }, 3000); // Reducido a 3 segundos
}

function updateCartDisplay() {
    console.log('updateCartDisplay called');
    console.log('Current cart:', cart);
    
    const container = document.getElementById('cart-items-container');
    const summary = document.getElementById('cart-summary');
    const payBtn = document.getElementById('pay-btn');
    const cartCounter = document.getElementById('cart-counter');
    const cartBtn = document.querySelector('.open-cart-btn');
    
    console.log('Cart elements found:', {
        container: !!container,
        summary: !!summary,
        payBtn: !!payBtn,
        cartCounter: !!cartCounter,
        cartBtn: !!cartBtn
    });
    
    // Calcular total de productos en el carrito
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Actualizar contador y estilo del botón
    if (totalItems > 0) {
        cartCounter.textContent = totalItems;
        cartCounter.style.display = 'block';
        cartBtn.style.background = '#4285f4';
        cartBtn.style.color = '#fff';
        cartBtn.style.borderColor = '#4285f4';
    } else {
        cartCounter.style.display = 'none';
        cartBtn.style.background = '#fff';
        cartBtn.style.color = '#4285f4';
        cartBtn.style.borderColor = '#4285f4';
    }
    
    if (cart.length === 0) {
        container.innerHTML = '';
        summary.innerHTML = '<p>Carrito vacío</p>';
        payBtn.style.display = 'none';
        return;
    }
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.imagenes[0]}" alt="${item.titulo}">
            <div class="cart-item-info">
                <h4>${item.titulo}</h4>
                <p>$${item.precio.toLocaleString()}</p>
            </div>
            <div class="cart-item-actions">
                <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', 1)">+</button>
                <button class="delete-btn" onclick="removeFromCart('${item.id}')">Eliminar</button>
            </div>
        </div>
    `).join('');
    
    const subtotal = cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
    const iva = subtotal * 0.19;
    const total = subtotal + iva;
    
    summary.innerHTML = `
        <div><span>Subtotal:</span> <span>$${subtotal.toLocaleString()}</span></div>
        <div><span>IVA (19%):</span> <span>$${iva.toLocaleString()}</span></div>
        <hr>
        <div class="total"><span>Total:</span> <span>$${total.toLocaleString()}</span></div>
    `;
    
    payBtn.style.display = 'block';
}

function updateCartQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
}

// Funciones para modal de producto
function showProductModal(productId) {
    console.log('Mostrando modal de producto:', productId);
    
    if (!allProducts || allProducts.length === 0) {
        console.error('Productos no cargados');
        return;
    }
    
    currentProduct = allProducts.find(p => p.id === productId);
    if (!currentProduct) {
        console.error('Producto no encontrado:', productId);
        return;
    }
    
    const modal = document.getElementById('productModal');
    if (!modal) {
        console.error('Modal no encontrado');
        return;
    }
    
    // Llenar información del modal con los IDs correctos del HTML
    const elements = {
        img: document.getElementById('modal-product-image'),
        title: document.getElementById('modal-product-title'),
        brand: document.getElementById('modal-product-brand'),
        description: document.getElementById('modal-product-description'),
        price: document.getElementById('modal-product-price'),
        rating: document.getElementById('modal-product-rating'),
        stock: document.getElementById('modal-product-stock'),
        addBtn: document.getElementById('modal-add-to-cart')
    };
    
    // Llenar datos del producto
    if (elements.img) elements.img.src = currentProduct.imagenes[0];
    if (elements.title) elements.title.textContent = currentProduct.titulo;
    if (elements.brand) elements.brand.textContent = `Marca: ${currentProduct.marca}`;
    if (elements.description) elements.description.textContent = currentProduct.descripcion;
    if (elements.price) elements.price.textContent = `$${currentProduct.precio.toLocaleString()}`;
    
    // Calcular rating actualizado basado en comentarios guardados
    const updatedRating = calculateProductRating(productId);
    if (elements.rating) {
        elements.rating.innerHTML = '★'.repeat(Math.floor(updatedRating)) + '☆'.repeat(5 - Math.floor(updatedRating));
        // Remover evento de click en las estrellas - ahora usamos pestañas
        elements.rating.style.cursor = 'default';
        elements.rating.title = 'Rating del producto';
    }
    
    const ratingValueElement = document.getElementById('modal-product-rating-value');
    if (ratingValueElement) {
        ratingValueElement.textContent = `(${updatedRating.toFixed(1)})`;
    }
    
    if (elements.stock) elements.stock.textContent = `Stock: ${currentProduct.stock} unidades`;
    
    // Configurar botones (eliminar referencia al botón de comentarios)
    if (elements.addBtn) {
        // Limpiar eventos previos
        elements.addBtn.onclick = null;
        elements.addBtn.replaceWith(elements.addBtn.cloneNode(true));
        const newAddBtn = document.getElementById('modal-add-to-cart');
        
        newAddBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            addToCart(productId);
            showAddedToCartFeedback(this);
            setTimeout(() => {
                modal.style.display = 'none';
            }, 1000);
        });
        
        if (currentProduct.stock > 0) {
            newAddBtn.textContent = 'Agregar al Carrito';
            newAddBtn.disabled = false;
            newAddBtn.style.background = '#4285f4';
        } else {
            newAddBtn.textContent = 'Sin stock';
            newAddBtn.disabled = true;
            newAddBtn.style.background = '#6c757d';
        }
    }
    
    // Mostrar modal
    modal.style.display = 'block';
    
    // Ocultar la sección de comentarios por defecto e inicializar el botón
    const commentsSection = document.getElementById('comments-section');
    const tabButton = document.querySelector('.tab-button[data-tab="comments"]');
    if (commentsSection) {
        commentsSection.style.display = 'none';
    }
    if (tabButton) {
        tabButton.classList.remove('active');
        tabButton.innerHTML = '💬 Ver Reseñas';
    }
    
    // NO cargar comentarios automáticamente - solo cuando se haga clic en la pestaña
    
    console.log('Modal mostrado correctamente');
}

// Generar comentarios aleatorios
function generateRandomComments() {
    const users = [
        'María González', 'Carlos Rodríguez', 'Ana Silva', 'Pedro Martínez', 'Laura López',
        'Diego Fernández', 'Sofía Castro', 'Miguel Torres', 'Valentina Morales', 'Sebastián Vargas'
    ];
    
    const comments = [
        'Excelente producto, muy buena calidad. Lo recomiendo totalmente.',
        'Llegó en perfectas condiciones y muy rápido. Cumplió mis expectativas.',
        'Buena relación calidad-precio. Estoy satisfecho con la compra.',
        'El producto es tal como se describe. Muy contento con la adquisición.',
        'Funciona perfecto, justo lo que necesitaba. Volveré a comprar aquí.',
        'Gran calidad y excelente atención al cliente. 100% recomendado.',
        'Me gustó mucho, superó mis expectativas. Llegó antes de lo previsto.',
        'Producto de calidad, muy bien empaquetado. Sin problemas.',
        'Cumple con lo prometido. Estoy muy satisfecho con la compra.',
        'Excelente servicio y producto de primera calidad. Lo recomiendo.'
    ];
    
    const numComments = Math.floor(Math.random() * 5) + 3; // 3-7 comentarios
    const selectedComments = [];
    
    for (let i = 0; i < numComments; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        const comment = comments[Math.floor(Math.random() * comments.length)];
        const rating = Math.floor(Math.random() * 2) + 4; // 4-5 estrellas
        const verified = Math.random() < 0.7; // 70% verificados
        
        selectedComments.push({
            user,
            comment,
            rating,
            verified
        });
    }
    
    return selectedComments;
}

// Funciones para manejar comentarios de usuarios
function getProductComments(productId) {
    const comments = localStorage.getItem(`comments_${productId}`);
    const parsedComments = comments ? JSON.parse(comments) : [];
    
    // Filtrar comentarios de Usuario Anónimo
    const filteredComments = parsedComments.filter(comment => comment.user !== 'Usuario Anónimo');
    
    // Si se filtraron comentarios, actualizar el localStorage
    if (filteredComments.length !== parsedComments.length) {
        localStorage.setItem(`comments_${productId}`, JSON.stringify(filteredComments));
    }
    
    return filteredComments;
}

function saveProductComment(productId, comment) {
    // No guardamos comentarios de usuario anónimo
    console.log('Comentario no guardado - Usuario no autenticado');
}

function calculateProductRating(productId) {
    const userComments = getProductComments(productId);
    const randomComments = generateRandomComments();
    const allComments = [...userComments, ...randomComments];
    
    if (allComments.length === 0) {
        const product = allProducts.find(p => p.id === productId);
        return product ? product.rating : 0;
    }
    
    const totalRating = allComments.reduce((sum, comment) => sum + comment.rating, 0);
    return totalRating / allComments.length;
}

function setupStarRating() {
    const stars = document.querySelectorAll('.star-rating .star');
    const ratingContainer = document.querySelector('.star-rating');
    
    if (!stars.length || !ratingContainer) return;
    
    // Deshabilitar sistema de rating - usuario no autenticado
    stars.forEach((star, index) => {
        // Limpiar estilos previos y deshabilitar
        star.style.background = 'none';
        star.style.border = 'none';
        star.style.outline = 'none';
        star.style.boxShadow = 'none';
        star.style.color = '#dee2e6';
        star.style.cursor = 'not-allowed';
        star.textContent = '☆';
        
        // Remover event listeners previos y agregar mensaje
        star.onclick = function() {
            showNotification('Debe iniciar sesión para calificar', 'warning');
        };
        
        // Deshabilitar hover
        star.onmouseenter = null;
        star.onmouseleave = null;
    });
    
    // Deshabilitar contenedor
    if (ratingContainer) {
        ratingContainer.style.cursor = 'not-allowed';
        ratingContainer.onmouseleave = null;
    }
}

function submitComment(productId) {
    // Bloquear envío de reseñas - usuario no autenticado
    showNotification('Debe iniciar sesión para dar su reseña', 'warning');
    return;
}

// Función para cargar comentarios inline (simplificada)
function loadCommentsInline(productId) {
    const container = document.getElementById('comments-list-inline');
    if (!container) return;
    
    // Obtener comentarios existentes y generar algunos aleatorios
    const existingComments = getProductComments(productId);
    const randomComments = generateRandomComments();
    const allComments = [...existingComments, ...randomComments];
    
    if (allComments.length === 0) {
        container.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">No hay reseñas aún. ¡Sé el primero en reseñar!</p>';
        return;
    }
    
    container.innerHTML = `
        <div style="background: linear-gradient(135deg, #e3f2fd, #f8f9fa); padding: 20px; border-radius: 12px; margin-bottom: 25px; text-align: center; border: 2px solid #4285f4;">
            <h3 style="margin: 0; color: #4285f4; font-size: 20px;">
                📝 Reseñas de Usuarios (${allComments.length})
            </h3>
            <p style="margin: 8px 0 0 0; color: #666; font-size: 14px;">
                Opiniones reales de usuarios verificados
            </p>
        </div>
        ${allComments.map(comment => `
            <div class="comment-item" style="position: relative; overflow: hidden;">
                <div class="comment-header">
                    <div>
                        <span class="comment-user">${comment.user}</span>
                        ${comment.verified ? '<span class="verified-badge">✓ Verificado</span>' : ''}
                    </div>
                    <div style="font-size: 12px; color: #999;">
                        ${comment.date || 'Hace poco'}
                    </div>
                </div>
                <div class="comment-text">${comment.comment}</div>
                <div class="comment-rating" style="margin-top: 8px; display: flex; align-items: center; gap: 8px;">
                    <span style="color: #ffc107; font-size: 16px;">${'★'.repeat(comment.rating)}${'☆'.repeat(5 - comment.rating)}</span>
                    <span style="color: #666; font-size: 14px;">${comment.rating}/5</span>
                </div>
            </div>
        `).join('')}
    `;
}

function showCommentsModal(productId) {
    console.log('Mostrando modal de comentarios para producto:', productId);
    
    const modal = document.getElementById('commentsModal');
    const container = document.getElementById('comments-list');
    
    if (!container) {
        console.error('Contenedor de comentarios no encontrado');
        return;
    }

    // Actualizar título del modal con el nombre del producto
    const product = allProducts.find(p => p.id === productId);
    const modalTitle = document.querySelector('#commentsModal h2');
    if (modalTitle && product) {
        modalTitle.textContent = `Reseñas - ${product.titulo}`;
    }

    // Obtener comentarios existentes y generar algunos aleatorios
    const existingComments = getProductComments(productId);
    const randomComments = generateRandomComments();
    const allComments = [...existingComments, ...randomComments];

    // Crear formulario para nuevo comentario
    const commentForm = `
        <div class="add-comment-section">
            <h3>Agregar tu comentario</h3>
            <div class="new-comment-rating">
                <span>Tu calificación: </span>
                <span class="star-rating" data-rating="0">
                    <span class="star" data-value="1">☆</span>
                    <span class="star" data-value="2">☆</span>
                    <span class="star" data-value="3">☆</span>
                    <span class="star" data-value="4">☆</span>
                    <span class="star" data-value="5">☆</span>
                </span>
            </div>
            <textarea id="new-comment-text" placeholder="Escribe tu comentario..." rows="3"></textarea>
            <button id="submit-comment" onclick="submitComment('${productId}')">Enviar Comentario</button>
        </div>
        <hr>
        <h3>Comentarios de otros usuarios</h3>
    `;

    const commentsHTML = allComments.map(comment => `
        <div class="comment-item">
            <div class="comment-header">
                <div>
                    <span class="comment-user">${comment.user}</span>
                    ${comment.verified ? '<span class="verified-badge">✓ Verificado</span>' : ''}
                </div>
            </div>
            <div class="comment-text">${comment.comment}</div>
            <div class="comment-rating">${'★'.repeat(comment.rating)}${'☆'.repeat(5 - comment.rating)} ${comment.rating}/5</div>
        </div>
    `).join('');
    
    container.innerHTML = commentForm + commentsHTML;
    
    // Agregar event listeners para las estrellas del formulario
    setupStarRating();
    
    modal.style.display = 'block';
}

// Función para asignar eventos a las imágenes de productos
function assignViewDetailsEvents() {
    // Los eventos se asignan directamente con onclick en el HTML
    // Esta función se mantiene para compatibilidad
}

// Filtrar productos
function filterProducts() {
    const searchTerm = document.querySelector('.search-input').value.toLowerCase();
    const selectedCategory = document.querySelector('.filter-select').value;
    const sortBy = document.querySelector('.search-select').value;
    filteredProducts = allProducts.filter(product => {
        const matchesSearch = product.titulo.toLowerCase().includes(searchTerm) ||
                            product.descripcion.toLowerCase().includes(searchTerm) ||
                            product.marca.toLowerCase().includes(searchTerm);
        const matchesCategory = !selectedCategory || product.categoria === selectedCategory;
        return matchesSearch && matchesCategory;
    });
    // Ordenar productos
    switch (sortBy) {
        case 'Menor precio':
            filteredProducts.sort((a, b) => a.precio - b.precio);
            break;
        case 'Mayor precio':
            filteredProducts.sort((a, b) => b.precio - a.precio);
            break;
        case 'Mejor valorados':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'Más vendidos':
            filteredProducts.sort((a, b) => b.vendidos - a.vendidos);
            break;
        case 'Destacados':
            filteredProducts.sort((a, b) => (b.destacado === a.destacado) ? 0 : b.destacado ? 1 : -1);
            break;
        case 'Más recientes':
        default:
            // Mantener orden original
            break;
    }
    renderProducts(filteredProducts);
}

// Event listeners

// Esperar a que el DOM esté listo
window.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Loaded - Starting initialization');
    loadProducts();
    
    // Agregar event listeners básicos
    const searchInput = document.querySelector('.search-input');
    const filterSelect = document.querySelector('.filter-select');
    const searchSelect = document.querySelector('.search-select');
    const priceSlider = document.querySelector('.price-slider');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }
    if (filterSelect) {
        filterSelect.addEventListener('change', filterProducts);
    }
    if (searchSelect) {
        searchSelect.addEventListener('change', filterProducts);
    }
    if (priceSlider) {
        priceSlider.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = (x / rect.width) * 100;
            console.log(`Filtro de precio ajustado a: ${percentage}%`);
        });
    }
    
    // Inicializar modales
    initializeModals();
    
    console.log('Initialization complete');
});

// Funciones para cerrar modales
function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function closeCommentsModal() {
    const modal = document.getElementById('commentsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Cerrar modales al hacer clic fuera de ellos
window.onclick = function(event) {
    const productModal = document.getElementById('productModal');
    const commentsModal = document.getElementById('commentsModal');
    const cartModal = document.getElementById('cartModal');
    
    if (event.target === productModal) {
        productModal.style.display = 'none';
    }
    if (event.target === commentsModal) {
        commentsModal.style.display = 'none';
    }
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
}

// Función para inicializar modales
function initializeModals() {
    console.log('Inicializando modales...');
    
    // Modal carrito
    const cartModal = document.getElementById("cartModal");
    const openCartBtn = document.querySelector(".open-cart-btn");
    const closeCartBtn = document.querySelector(".close");
    
    if (openCartBtn) {
        openCartBtn.onclick = () => cartModal.style.display = "block";
    }
    if (closeCartBtn) {
        closeCartBtn.onclick = () => cartModal.style.display = "none";
        console.log('Event listener para cerrar carrito agregado');
    }
    
    // Modal producto - usar la clase correcta
    const productModal = document.getElementById("productModal");
    const closeProductBtn = document.querySelector(".product-modal-close");
    
    if (closeProductBtn) {
        closeProductBtn.onclick = () => {
            productModal.style.display = "none";
            console.log('Modal de producto cerrado');
        };
        console.log('Event listener para cerrar modal de producto agregado');
    } else {
        console.error('Botón de cerrar modal de producto no encontrado');
    }
    
    // Modal comentarios - usar la clase correcta
    const commentsModal = document.getElementById("commentsModal");
    const closeCommentsBtn = document.querySelector(".comments-modal-close");
    
    if (closeCommentsBtn) {
        closeCommentsBtn.onclick = () => {
            commentsModal.style.display = "none";
            console.log('Modal de comentarios cerrado');
        };
        console.log('Event listener para cerrar modal de comentarios agregado');
    } else {
        console.error('Botón de cerrar modal de comentarios no encontrado');
    }
    
    console.log('Inicialización de modales completada');
}

// Funciones para cerrar modales (funciones individuales como respaldo)
function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function closeCommentsModal() {
    const modal = document.getElementById('commentsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Cerrar modales al hacer clic fuera de ellos - movido fuera de initializeModals
window.onclick = function(event) {
    const productModal = document.getElementById('productModal');
    const commentsModal = document.getElementById('commentsModal');
    const cartModal = document.getElementById('cartModal');
    
    if (event.target === productModal) {
        productModal.style.display = 'none';
        console.log('Modal de producto cerrado al hacer clic fuera');
    }
    if (event.target === commentsModal) {
        commentsModal.style.display = 'none';
        console.log('Modal de comentarios cerrado al hacer clic fuera');
    }
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
        console.log('Modal de carrito cerrado al hacer clic fuera');
    }
}

// Función para alternar la sección de comentarios
function toggleComments() {
    const commentsSection = document.getElementById('comments-section');
    const tabButton = document.querySelector('.tab-button[data-tab="comments"]');
    
    if (commentsSection.style.display === 'none' || commentsSection.style.display === '') {
        // Mostrar sección de comentarios
        commentsSection.style.display = 'block';
        tabButton.classList.add('active');
        tabButton.innerHTML = '💬 Ocultar Reseñas';
        
        // Cargar comentarios si no están cargados
        if (currentProduct) {
            loadCommentsInline(currentProduct.id);
            
            // Configurar el sistema de rating de estrellas para el formulario
            setTimeout(() => {
                setupStarRating();
                
                // Configurar el botón de enviar comentario
                const submitBtn = document.getElementById('submit-comment');
                if (submitBtn) {
                    submitBtn.onclick = () => {
                        submitComment(currentProduct.id);
                    };
                }
            }, 100);
        }
        
        // Scroll suave hacia la sección de comentarios
        setTimeout(() => {
            commentsSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 150);
        
    } else {
        // Ocultar sección de comentarios
        commentsSection.style.display = 'none';
        tabButton.classList.remove('active');
        tabButton.innerHTML = '💬 Ver Reseñas';
        
        // Limpiar formulario al cerrar
        const textArea = document.getElementById('new-comment-text');
        const starRating = document.querySelector('.star-rating');
        if (textArea) textArea.value = '';
        if (starRating) {
            starRating.setAttribute('data-rating', '0');
            const stars = starRating.querySelectorAll('.star');
            stars.forEach(star => {
                star.textContent = '☆';
                star.classList.remove('active');
            });
        }
    }
}
