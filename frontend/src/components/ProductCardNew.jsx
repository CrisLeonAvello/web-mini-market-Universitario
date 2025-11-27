import React, { useState } from 'react';
import { addToCart } from '../services/api';
import { useWishlist } from '../contexts/WishlistContext';

export default function ProductCardNew({ product, onOpenModal }) {
  const [showNotification, setShowNotification] = useState('');
  const [imageError, setImageError] = useState(false);
  
  // Verificación de producto válido
  if (!product || !product.id) {
    console.error('❌ ProductCardNew: Producto inválido:', product);
    return (
      <div className="product-card error-card">
        <p>Error: Producto no válido</p>
      </div>
    );
  }

  console.log('🔍 ProductCardNew renderizado para producto:', { 
    id: product.id, 
    title: product.title?.substring(0, 30) + '...' 
  });

  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  
  const isInWishlist = wishlist.includes(product.id.toString());
  
  // Adaptar los datos de la API a nuestro formato (mover aquí para que esté disponible)
  const category = product.category || 'Sin categoría';
  
  // Función para obtener imagen de fallback basada en categoría
  const getImageWithFallback = () => {
    if (imageError || !product.image) {
      // Imágenes de fallback por categoría
      const fallbackImages = {
        'Electrónicos': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=300&fit=crop',
        'Librería': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop',
        'Alimentos': 'https://images.unsplash.com/photo-1506617564039-2f9b62d3fc40?w=300&h=300&fit=crop',
        'default': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop'
      };
      
      return fallbackImages[category] || fallbackImages['default'];
    }
    return product.image;
  };

  const handleImageError = () => {
    setImageError(true);
  };
  
  // Adaptar los datos de la API a nuestro formato (resto de variables)
  const imageUrl = getImageWithFallback();
  const title = product.title || 'Producto sin título';
  const description = product.description || 'Sin descripción';
  const price = product.price || 0;
  const rating = product.rating?.rate || product.rating || 0;
  const ratingCount = product.rating?.count || 0;
  const stock = product.stock || 0; // Stock real de la API
  const isOnSale = false; // Deshabilitado por ahora
  const discount = 0;
  const originalPrice = null;
  
  // Truncar descripción si es muy larga
  const truncatedDescription = description.length > 100 
    ? description.substring(0, 100) + '...' 
    : description;

  const showNotificationMessage = (message) => {
    setShowNotification(message);
    setTimeout(() => setShowNotification(''), 2000);
  };

  const handleAddToCart = async (e) => {
    try {
      console.log('🛒 handleAddToCart called for product:', product.id);
      e.preventDefault();
      e.stopPropagation();
      
      if (stock <= 0) {
        showNotificationMessage('❌ Sin stock disponible');
        return;
      }
      
      console.log('✅ Adding to cart via API:', product.id);
      await addToCart(product.id, 1);
      console.log('✅ Product added to cart successfully');
      showNotificationMessage('✅ Agregado al carrito');
    } catch (error) {
      console.error('❌ Error in handleAddToCart:', error);
      showNotificationMessage('❌ ' + (error.message || 'Error al agregar al carrito'));
    }
  };

  const handleWishlistToggle = (e) => {
    try {
      console.log('💖 handleWishlistToggle called for product:', product.id);
      e.preventDefault();
      e.stopPropagation();
      
      if (!addToWishlist || !removeFromWishlist) {
        console.error('❌ Wishlist functions not available');
        showNotificationMessage('❌ Error: Funciones no disponibles');
        return;
      }
      
      if (isInWishlist) {
        removeFromWishlist(product.id.toString());
        showNotificationMessage('💔 Eliminado de favoritos');
      } else {
        addToWishlist(product.id.toString());
        showNotificationMessage('❤️ Agregado a favoritos');
      }
    } catch (error) {
      console.error('❌ Error in handleWishlistToggle:', error);
      showNotificationMessage('❌ Error en favoritos');
    }
  };

  const handleCardClick = () => {
    if (onOpenModal) {
      onOpenModal(product);
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <>
        {'⭐'.repeat(fullStars)}
        {hasHalfStar && '⭐'}
        {'☆'.repeat(emptyStars)}
      </>
    );
  };

  return (
    <>
      <article className="product-card space-product-card animate-fade-in" onClick={handleCardClick}>
        {/* Etiquetas superiores */}
        <div className="product-badges">
          {isOnSale && (
            <span className="badge sale-badge animate-pulse">
              -{discount}%
            </span>
          )}
          {stock <= 5 && stock > 0 && (
            <span className="badge low-stock-badge">
              Últimos {stock}
            </span>
          )}
          {stock === 0 && (
            <span className="badge out-of-stock-badge">
              Agotado
            </span>
          )}
        </div>

        {/* Imagen del producto */}
        <div className="product-image-container">
          <img 
            src={imageUrl} 
            alt={title}
            className="product-image"
            loading="lazy"
            onError={handleImageError}
          />
          
          {/* Botón de wishlist flotante */}
          <button 
            type="button"
            className={`wishlist-btn-floating ${isInWishlist ? 'active animate-heart-beat' : ''}`}
            onClick={handleWishlistToggle}
            title={isInWishlist ? "Eliminar de favoritos" : "Agregar a favoritos"}
          >
            {isInWishlist ? '❤️' : '🤍'}
          </button>

          {/* Overlay de acciones rápidas */}
          <div className="product-overlay">
            <button 
              type="button"
              className="quick-action-btn view-btn"
              onClick={handleCardClick}
              title="Ver detalles"
            >
              👁️ Ver
            </button>
            <button 
              type="button"
              className={`quick-action-btn cart-btn ${stock === 0 ? 'disabled' : ''}`}
              onClick={handleAddToCart}
              disabled={stock === 0}
              title={stock === 0 ? "Sin stock" : "Agregar al carrito"}
            >
              🛒 {stock === 0 ? 'Sin stock' : 'Agregar'}
            </button>
          </div>
        </div>

        {/* Información del producto */}
        <div className="product-info">
          {/* Categoría */}
          <span className="product-category">{category}</span>
          
          {/* Título */}
          <h3 className="product-title" title={title}>
            {title.length > 50 ? title.substring(0, 47) + '...' : title}
          </h3>
          
          {/* Rating */}
          {rating > 0 && (
            <div className="product-rating">
              <span className="stars">{renderStars(rating)}</span>
              <span className="rating-text">
                ({rating.toFixed(1)}) {ratingCount} reseñas
              </span>
            </div>
          )}
          
          {/* Precio */}
          <div className="product-pricing">
            <div className="price-container">
              <span className="current-price">${price.toFixed(2)}</span>
              {originalPrice && (
                <span className="original-price">${originalPrice.toFixed(2)}</span>
              )}
            </div>
            {isOnSale && (
              <span className="savings">
                Ahorras ${(originalPrice - price).toFixed(2)}
              </span>
            )}
          </div>

          {/* Descripción */}
          <p className="product-description">
            {truncatedDescription}
          </p>

          {/* Stock info */}
          <div className="product-stock">
            {stock > 0 ? (
              <span className="in-stock">
                ✅ {stock} disponibles
              </span>
            ) : (
              <span className="out-of-stock">
                ❌ Sin stock
              </span>
            )}
          </div>

          {/* Botones de acción principales */}
          <div className="product-actions">
            <button 
              type="button"
              className={`btn-add-cart ${stock === 0 ? 'disabled' : 'animate-glow'}`}
              onClick={handleAddToCart}
              disabled={stock === 0}
            >
              {stock === 0 ? '❌ Sin stock' : '🛒 Agregar al carrito'}
            </button>
          </div>
        </div>
      </article>

      {/* Notificación flotante */}
      {showNotification && (
        <div className="floating-notification animate-slide-up">
          {showNotification}
        </div>
      )}
    </>
  );
}