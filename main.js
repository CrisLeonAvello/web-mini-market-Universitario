// Variables globales para filtros
let currentFilters = {
    category: '',
    search: '',
    minPrice: 0,
    maxPrice: 200000,
    minRating: 0
};

// main.js extraído de paginainicio.html
// Variables globales
let allProducts = [];
let filteredProducts = [];
let cart = [];
let currentProduct = null;

// Función para verificar y limpiar carrito al cargar
function verifyAndCleanCart() {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    console.log('🔍 Verificando carrito almacenado:', storedCart);
    
    // Verificar si hay items con estructura incorrecta
    const hasCorruptData = storedCart.some(item => 
        !item || 
        typeof item.id !== 'string' || 
        typeof item.quantity !== 'number' ||
        item.titulo // Si tiene titulo, se guardó el objeto completo
    );
    
    if (hasCorruptData) {
        console.warn('⚠️ Carrito corrupto detectado, limpiando...');
        const cleanedCart = storedCart.filter(item => {
            return item && 
                   typeof item.id === 'string' && 
                   typeof item.quantity === 'number' &&
                   item.quantity > 0 &&
                   !item.titulo;
        });
        
        localStorage.setItem('cart', JSON.stringify(cleanedCart));
        cart = cleanedCart;
        console.log('✅ Carrito limpiado:', cart);
    } else {
        cart = storedCart;
        console.log('✅ Carrito verificado correctamente');
    }
}

// Función para inicializar la aplicación después de la carga
function initializeApp() {
    console.log('🚀 Inicializando StudiMarket...');
    
    // Verificar y limpiar carrito
    verifyAndCleanCart();
    
    // Disparar evento de recurso cargado para la pantalla de carga
    if (typeof CustomEvent !== 'undefined') {
        document.dispatchEvent(new CustomEvent('resourceLoaded', {
            detail: 'App initialized'
        }));
    }
    
    // Mostrar mensaje de bienvenida en consola
    console.log('✅ StudiMarket inicializado correctamente');
}

// Función principal de filtrado
function filterProducts() {
    console.log('🔍 Aplicando filtros:', currentFilters);
    
    let filtered = [...allProducts];
    
    // Filtro por categoría
    if (currentFilters.category && currentFilters.category !== '') {
        filtered = filtered.filter(product => 
            product.categoria.toLowerCase().includes(currentFilters.category.toLowerCase())
        );
    }
    
    // Filtro por búsqueda
    if (currentFilters.search && currentFilters.search !== '') {
        const searchTerm = currentFilters.search.toLowerCase();
        filtered = filtered.filter(product => 
            product.titulo.toLowerCase().includes(searchTerm) ||
            product.descripcion.toLowerCase().includes(searchTerm) ||
            product.marca.toLowerCase().includes(searchTerm)
        );
    }
    
    // Filtro por precio
    filtered = filtered.filter(product => 
        product.precio >= currentFilters.minPrice && 
        product.precio <= currentFilters.maxPrice
    );
    
    // Filtro por rating
    if (currentFilters.minRating > 0) {
        filtered = filtered.filter(product => 
            product.rating >= currentFilters.minRating
        );
    }
    
    console.log(`📊 Productos filtrados: ${filtered.length} de ${allProducts.length}`);
    
    filteredProducts = filtered;
    renderProducts(filteredProducts);
    updateFilterSummary();
}

// Actualizar resumen de filtros
function updateFilterSummary() {
    const priceLabel = document.getElementById('price-range-label');
    const ratingLabel = document.getElementById('rating-label');
    
    if (priceLabel) {
        priceLabel.textContent = `Rango de precio: $${currentFilters.minPrice.toLocaleString()} - $${currentFilters.maxPrice.toLocaleString()}`;
    }
    
    if (ratingLabel) {
        ratingLabel.textContent = `Rating mínimo: ${currentFilters.minRating} estrella${currentFilters.minRating !== 1 ? 's' : ''}`;
    }
}

// Inicializar filtros de precio con campos de entrada
function initializePriceFilters() {
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const applyPriceBtn = document.getElementById('apply-price-filter');
    const clearPriceBtn = document.getElementById('clear-price-filter');
    
    if (!minPriceInput || !maxPriceInput) return;
    
    // Configurar valores máximos basados en productos
    if (allProducts.length > 0) {
        const prices = allProducts.map(p => p.precio);
        const maxProductPrice = Math.max(...prices);
        const roundedMax = Math.ceil(maxProductPrice / 10000) * 10000; // Redondear hacia arriba
        
        maxPriceInput.max = roundedMax;
        maxPriceInput.value = roundedMax;
        maxPriceInput.placeholder = roundedMax.toString();
        currentFilters.maxPrice = roundedMax;
    }
    
    function validateAndApplyPriceFilter() {
        const minPrice = parseInt(minPriceInput.value) || 0;
        const maxPrice = parseInt(maxPriceInput.value) || 200000;
        
        // Validar que min no sea mayor que max
        if (minPrice > maxPrice) {
            showNotification('⚠️ El precio mínimo no puede ser mayor al máximo', 'warning');
            return false;
        }
        
        // Validar que sean valores positivos
        if (minPrice < 0 || maxPrice < 0) {
            showNotification('⚠️ Los precios deben ser valores positivos', 'warning');
            return false;
        }
        
        currentFilters.minPrice = minPrice;
        currentFilters.maxPrice = maxPrice;
        
        console.log(`💰 Filtro de precio aplicado: $${minPrice.toLocaleString()} - $${maxPrice.toLocaleString()}`);
        
        filterProducts();
        updateFilterSummary();
        showNotification(`💰 Filtro aplicado: $${minPrice.toLocaleString()} - $${maxPrice.toLocaleString()}`, 'success');
        
        return true;
    }
    
    function clearPriceFilter() {
        const maxProductPrice = allProducts.length > 0 ? Math.max(...allProducts.map(p => p.precio)) : 200000;
        const roundedMax = Math.ceil(maxProductPrice / 10000) * 10000;
        
        minPriceInput.value = 0;
        maxPriceInput.value = roundedMax;
        
        currentFilters.minPrice = 0;
        currentFilters.maxPrice = roundedMax;
        
        filterProducts();
        updateFilterSummary();
        showNotification('🧹 Filtro de precio limpiado', 'success');
    }
    
    // Event listeners
    if (applyPriceBtn) {
        applyPriceBtn.addEventListener('click', validateAndApplyPriceFilter);
    }
    
    if (clearPriceBtn) {
        clearPriceBtn.addEventListener('click', clearPriceFilter);
    }
    
    // También aplicar filtro al presionar Enter en los campos
    minPriceInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            validateAndApplyPriceFilter();
        }
    });
    
    maxPriceInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            validateAndApplyPriceFilter();
        }
    });
    
    // Validación en tiempo real para feedback visual
    function validateInput(input) {
        const value = parseInt(input.value) || 0;
        const isValid = value >= 0 && value <= parseInt(input.max);
        
        if (isValid) {
            input.style.borderColor = '#ddd';
        } else {
            input.style.borderColor = '#f44336';
        }
    }
    
    minPriceInput.addEventListener('input', function() {
        validateInput(this);
        
        // Auto-validar con el máximo
        const minVal = parseInt(this.value) || 0;
        const maxVal = parseInt(maxPriceInput.value) || 200000;
        
        if (minVal > maxVal) {
            this.style.borderColor = '#ff9800'; // Naranja para advertencia
        }
    });
    
    maxPriceInput.addEventListener('input', function() {
        validateInput(this);
        
        // Auto-validar con el mínimo
        const minVal = parseInt(minPriceInput.value) || 0;
        const maxVal = parseInt(this.value) || 200000;
        
        if (maxVal < minVal) {
            this.style.borderColor = '#ff9800'; // Naranja para advertencia
        }
    });
}

// Inicializar filtros de rating
function initializeRatingFilter() {
    const ratingStars = document.querySelectorAll('#rating-filter .star');
    const clearRatingBtn = document.getElementById('clear-rating');
    
    ratingStars.forEach((star, index) => {
        star.addEventListener('click', function() {
            const rating = parseInt(star.getAttribute('data-rating'));
            currentFilters.minRating = rating;
            
            // Actualizar visualización de estrellas
            ratingStars.forEach((s, i) => {
                if (i < rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
            
            filterProducts();
        });
        
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(star.getAttribute('data-rating'));
            ratingStars.forEach((s, i) => {
                if (i < rating) {
                    s.style.color = '#ffed4e';
                } else {
                    s.style.color = i < currentFilters.minRating ? '#ffd700' : '#ddd';
                }
            });
        });
        
        star.addEventListener('mouseleave', function() {
            ratingStars.forEach((s, i) => {
                if (i < currentFilters.minRating) {
                    s.style.color = '#ffd700';
                } else {
                    s.style.color = '#ddd';
                }
            });
        });
    });
    
    if (clearRatingBtn) {
        clearRatingBtn.addEventListener('click', function() {
            currentFilters.minRating = 0;
            ratingStars.forEach(s => {
                s.classList.remove('active');
                s.style.color = '#ddd';
            });
            filterProducts();
        });
    }
}

// Cargar productos desde JSON
async function loadProducts() {
    try {
        console.log('📦 Cargando productos...');
        
        const response = await fetch('products.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Disparar evento de progreso
        if (typeof CustomEvent !== 'undefined') {
            document.dispatchEvent(new CustomEvent('resourceLoaded', {
                detail: 'Products loading...'
            }));
        }
        
        allProducts = await response.json();
        filteredProducts = [...allProducts];
        
        console.log(`✅ ${allProducts.length} productos cargados`);
        
        renderProducts(filteredProducts);
        populateCategories();
        
        // Inicializar filtros después de cargar productos
        setTimeout(() => {
            initializePriceFilters();
            initializeRatingFilter();
            updateFilterSummary();
            
            // Disparar evento de productos cargados
            if (typeof CustomEvent !== 'undefined') {
                document.dispatchEvent(new CustomEvent('resourceLoaded', {
                    detail: 'Products loaded'
                }));
            }
        }, 100);
        
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
        let stockText = product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock';
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
                        <span class="availability ${stockClass}">${stockText}</span>
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
        // Solo guardar ID y cantidad, no todo el producto
        cart.push({ id: productId, quantity: 1 });
        showNotification(`🛒 ${product.titulo} agregado al carrito`, 'success');
        console.log('Added new item to cart');
    }
    
    console.log('Cart after:', cart);
    
    // Guardar carrito en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
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
    
    // Obtener productos completos desde allProducts usando los IDs del carrito
    const cartItemsWithDetails = cart.map(item => {
        const product = allProducts.find(p => p.id === item.id);
        if (product) {
            return {
                ...item,
                ...product // Combinar datos del carrito con datos del producto
            };
        }
        return null;
    }).filter(item => item !== null); // Filtrar items que no se encontraron
    
    if (cartItemsWithDetails.length === 0) {
        container.innerHTML = '<p>No se pudieron cargar los productos del carrito</p>';
        summary.innerHTML = '<p>Error al calcular total</p>';
        payBtn.style.display = 'none';
        return;
    }
    
    container.innerHTML = cartItemsWithDetails.map(item => `
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
    
    const subtotal = cartItemsWithDetails.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
    const iva = subtotal * 0.19;
    const total = subtotal + iva;
    
    summary.innerHTML = `
        <div><span>Subtotal:</span> <span>$${subtotal.toLocaleString()}</span></div>
        <div><span>IVA (19%):</span> <span>$${iva.toLocaleString()}</span></div>
        <hr>
        <div class="total"><span>Total:</span> <span>$${total.toLocaleString()}</span></div>
    `;
    
    payBtn.style.display = 'block';

        // Evento para el botón de pago (checkout)
        payBtn.onclick = function() {
            window.location.href = 'checkout.html';
        };
}

function updateCartQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
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
// Función actualizada para filtrar productos (integra con nuevos filtros)
function filterProductsLegacy() {
    // Actualizar filtros con valores de los controles existentes
    const searchInput = document.querySelector('.search-input');
    const filterSelect = document.querySelector('.filter-select');
    const searchSelect = document.querySelector('.search-select');
    
    if (searchInput) {
        currentFilters.search = searchInput.value;
    }
    
    if (filterSelect) {
        currentFilters.category = filterSelect.value;
    }
    
    // Aplicar filtros usando la nueva función
    filterProducts();
    
    // Aplicar ordenamiento
    if (searchSelect) {
        const sortBy = searchSelect.value;
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
}

// Event listeners

// Esperar a que el DOM esté listo
window.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Loaded - Starting initialization');
    
    // Inicializar aplicación (incluye limpieza de carrito)
    initializeApp();
    
    loadProducts();
    
    // Actualizar display del carrito al cargar la página
    setTimeout(() => {
        updateCartDisplay();
    }, 100);
    
    // Agregar event listeners básicos
    const searchInput = document.querySelector('.search-input');
    const filterSelect = document.querySelector('.filter-select');
    const searchSelect = document.querySelector('.search-select');
    const priceSlider = document.querySelector('.price-slider');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterProductsLegacy);
    }
    if (filterSelect) {
        filterSelect.addEventListener('change', filterProductsLegacy);
    }
    if (searchSelect) {
        searchSelect.addEventListener('change', filterProductsLegacy);
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

// Función para testear visualización de stock
window.testStockDisplay = function() {
    console.log('=== TEST VISUALIZACIÓN DE STOCK ===');
    
    if (!allProducts || allProducts.length === 0) {
        console.error('No hay productos cargados para testear');
        return;
    }
    
    console.log('Productos con stock:');
    const withStock = allProducts.filter(p => p.stock > 0);
    withStock.slice(0, 3).forEach(p => {
        console.log(`- ${p.titulo}: ${p.stock} disponibles`);
    });
    
    console.log('\nProductos sin stock:');
    const withoutStock = allProducts.filter(p => p.stock === 0);
    withoutStock.forEach(p => {
        console.log(`- ${p.titulo}: Sin stock`);
    });
    
    return {
        totalProducts: allProducts.length,
        withStock: withStock.length,
        withoutStock: withoutStock.length
    };
};

// Función para resetear todos los filtros
window.resetAllFilters = function() {
    console.log('🔄 Reseteando todos los filtros...');
    
    // Resetear filtros
    currentFilters = {
        category: '',
        search: '',
        minPrice: 0,
        maxPrice: 200000,
        minRating: 0
    };
    
    // Resetear controles de la UI
    const searchInput = document.querySelector('.search-input');
    const filterSelect = document.querySelector('.filter-select');
    const searchSelect = document.querySelector('.search-select');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const ratingStars = document.querySelectorAll('#rating-filter .star');
    
    if (searchInput) searchInput.value = '';
    if (filterSelect) filterSelect.value = '';
    if (searchSelect) searchSelect.value = '';
    
    if (minPriceInput) {
        minPriceInput.value = 0;
        minPriceInput.style.borderColor = '#ddd';
        currentFilters.minPrice = 0;
    }
    
    if (maxPriceInput && allProducts.length > 0) {
        const prices = allProducts.map(p => p.precio);
        const maxProductPrice = Math.max(...prices);
        const roundedMax = Math.ceil(maxProductPrice / 10000) * 10000;
        maxPriceInput.value = roundedMax;
        maxPriceInput.style.borderColor = '#ddd';
        currentFilters.maxPrice = roundedMax;
    }
    
    // Resetear estrellas
    ratingStars.forEach(star => {
        star.classList.remove('active');
        star.style.color = '#ddd';
    });
    
    // Aplicar filtros y actualizar UI
    filterProducts();
    updateFilterSummary();
    
    showNotification('🔄 Filtros reseteados', 'success');
    console.log('✅ Filtros reseteados correctamente');
};

// Funciones de debug para filtros
window.debugFilters = function() {
    console.log('=== DEBUG FILTROS ===');
    console.log('Filtros actuales:', currentFilters);
    console.log('Total productos:', allProducts.length);
    console.log('Productos filtrados:', filteredProducts.length);
    
    // Mostrar rango de precios de productos
    if (allProducts.length > 0) {
        const prices = allProducts.map(p => p.precio);
        console.log('Rango de precios:', {
            min: Math.min(...prices),
            max: Math.max(...prices)
        });
    }
    
    // Mostrar ratings disponibles
    if (allProducts.length > 0) {
        const ratings = allProducts.map(p => p.rating);
        console.log('Ratings disponibles:', {
            min: Math.min(...ratings),
            max: Math.max(...ratings),
            unique: [...new Set(ratings)].sort()
        });
    }
    
    return {
        filters: currentFilters,
        totalProducts: allProducts.length,
        filteredProducts: filteredProducts.length
    };
};

window.testPriceFilter = function(min, max) {
    console.log(`🧪 Probando filtro de precio: $${min} - $${max}`);
    
    const minSlider = document.getElementById('min-price');
    const maxSlider = document.getElementById('max-price');
    
    if (minSlider) minSlider.value = min;
    if (maxSlider) maxSlider.value = max;
    
    currentFilters.minPrice = min;
    currentFilters.maxPrice = max;
    
    filterProducts();
    updateFilterSummary();
    
    console.log(`Productos encontrados: ${filteredProducts.length}`);
    return filteredProducts;
};

window.testRatingFilter = function(minRating) {
    console.log(`🧪 Probando filtro de rating: ${minRating} estrellas`);
    
    currentFilters.minRating = minRating;
    
    const stars = document.querySelectorAll('#rating-filter .star');
    stars.forEach((star, index) => {
        if (index < minRating) {
            star.classList.add('active');
            star.style.color = '#ffd700';
        } else {
            star.classList.remove('active');
            star.style.color = '#ddd';
        }
    });
    
    filterProducts();
    updateFilterSummary();
    
    console.log(`Productos encontrados: ${filteredProducts.length}`);
    return filteredProducts;
};

// Función de debug para pantalla de carga
window.debugLoadingScreen = function() {
    console.log('=== DEBUG PANTALLA DE CARGA ===');
    
    const loadingElement = document.getElementById('loading-screen');
    console.log('Elemento encontrado:', !!loadingElement);
    
    if (loadingElement) {
        console.log('Display:', loadingElement.style.display);
        console.log('Clases:', loadingElement.className);
        console.log('Visible:', window.getComputedStyle(loadingElement).opacity);
    }
    
    console.log('LoadingScreen global disponible:', !!window.loadingScreen);
    
    if (window.loadingScreen) {
        console.log('Estado interno:', {
            resourcesLoaded: window.loadingScreen.resourcesLoaded,
            startTime: window.loadingScreen.startTime,
            minimumLoadTime: window.loadingScreen.minimumLoadTime
        });
    }
    
    return {
        element: !!loadingElement,
        instance: !!window.loadingScreen,
        functions: {
            show: typeof window.showLoadingScreen,
            hide: typeof window.hideLoadingScreen
        }
    };
};

// Función de debug para opciones de envío
window.debugShipping = function() {
    console.log('=== DEBUG OPCIONES DE ENVÍO ===');
    
    fetch('envios.json')
        .then(response => response.json())
        .then(data => {
            console.log('Opciones de envío disponibles:', data);
            
            data.forEach((option, index) => {
                console.log(`${index + 1}. ${option.icon} ${option.tipo}`);
                console.log(`   Costo: ${option.costo === 0 ? 'GRATIS' : '$' + option.costo.toLocaleString()}`);
                console.log(`   Tiempo: ${option.tiempo_entrega}`);
                console.log(`   Descripción: ${option.descripcion}`);
                console.log('---');
            });
        })
        .catch(error => {
            console.error('Error cargando opciones de envío:', error);
        });
};

// Funciones de debug para filtros de precio
window.debugPriceFilter = function() {
    console.log('=== DEBUG FILTRO DE PRECIO ===');
    
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    
    console.log('Elementos encontrados:', {
        minPriceInput: !!minPriceInput,
        maxPriceInput: !!maxPriceInput
    });
    
    if (minPriceInput && maxPriceInput) {
        console.log('Valores actuales:', {
            minPrice: minPriceInput.value,
            maxPrice: maxPriceInput.value,
            filtroMin: currentFilters.minPrice,
            filtroMax: currentFilters.maxPrice
        });
    }
    
    if (allProducts.length > 0) {
        const precios = allProducts.map(p => p.precio);
        console.log('Rango de precios en productos:', {
            minimo: Math.min(...precios),
            maximo: Math.max(...precios),
            promedio: Math.round(precios.reduce((a, b) => a + b, 0) / precios.length)
        });
    }
    
    return currentFilters;
};

window.testPriceFilter = function(min, max) {
    console.log(`🧪 Probando filtro de precio: $${min.toLocaleString()} - $${max.toLocaleString()}`);
    
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    
    if (minPriceInput && maxPriceInput) {
        minPriceInput.value = min;
        maxPriceInput.value = max;
        
        // Simular clic en aplicar
        const applyBtn = document.getElementById('apply-price-filter');
        if (applyBtn) {
            applyBtn.click();
        }
    }
};

// Función de emergencia para resetear carrito completamente
window.resetCart = function() {
    console.log('🔥 RESETEANDO CARRITO COMPLETAMENTE');
    localStorage.removeItem('cart');
    cart = [];
    updateCartDisplay();
    showNotification('🔥 Carrito reseteado completamente', 'success');
    console.log('✅ Carrito limpio, puedes añadir productos nuevamente');
};

// Función para limpiar carrito corrupto
window.cleanCart = function() {
    console.log('🧹 Limpiando carrito...');
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    console.log('Carrito antes de limpiar:', cart);
    
    // Filtrar solo items con estructura correcta (id y quantity)
    const cleanedCart = cart.filter(item => {
        return item && 
               typeof item.id === 'string' && 
               typeof item.quantity === 'number' &&
               item.quantity > 0 &&
               !item.titulo; // Si tiene titulo, significa que se guardó el objeto completo
    });
    
    console.log('Carrito limpio:', cleanedCart);
    localStorage.setItem('cart', JSON.stringify(cleanedCart));
    
    // Actualizar variable global
    window.cart = cleanedCart;
    
    showNotification('🧹 Carrito limpiado correctamente', 'success');
    updateCartDisplay();
    return cleanedCart;
};

// Función para verificar estado del carrito antes del checkout
window.debugCartForCheckout = function() {
    console.log('=== DEBUG CARRITO PARA CHECKOUT ===');
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    console.log('Carrito en localStorage:', cart);
    console.log('Cantidad de items:', cart.length);
    
    if (cart.length > 0) {
        console.log('Items detallados:');
        cart.forEach((item, index) => {
            console.log(`${index + 1}. ID: ${item.id}, Cantidad: ${item.quantity}`);
            
            const product = allProducts?.find(p => p.id === item.id);
            if (product) {
                console.log(`   Producto: ${product.titulo}, Precio: $${product.precio}`);
            } else {
                console.warn(`   ⚠️ Producto no encontrado para ID: ${item.id}`);
            }
        });
    } else {
        console.warn('⚠️ Carrito vacío');
    }
    
    return cart;
};

// Interceptar clicks al botón de checkout para debugging
document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            console.log('🛒 Clic en checkout - verificando carrito...');
            debugCartForCheckout();
        });
    }
});

// Función para testear el checkout
window.testCheckout = function() {
    console.log('=== TEST CHECKOUT ===');
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    console.log('Carrito actual:', cart);
    
    if (cart.length === 0) {
        console.warn('⚠️ Carrito vacío - añade productos antes de testear checkout');
        return;
    }
    
    let total = 0;
    cart.forEach(item => {
        const product = allProducts?.find(p => p.id === item.id);
        if (product) {
            const subtotal = product.precio * item.quantity;
            total += subtotal;
            console.log(`- ${product.titulo}: ${item.quantity} x $${product.precio.toLocaleString()} = $${subtotal.toLocaleString()}`);
        }
    });
    
    const iva = total * 0.19;
    const totalConIva = total + iva;
    
    console.log('\n💰 TOTALES:');
    console.log(`Subtotal: $${total.toLocaleString()}`);
    console.log(`IVA (19%): $${iva.toLocaleString()}`);
    console.log(`Total final: $${totalConIva.toLocaleString()}`);
    
    return {
        items: cart.length,
        subtotal: total,
        iva: iva,
        total: totalConIva
    };
};
