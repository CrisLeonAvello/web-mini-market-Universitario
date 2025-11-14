import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

export default function ProductModalNew({ product, isOpen, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState('');
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  // Usar el stock real del producto de la API
  const stock = product?.stock || 0;

  // Resetear cantidad cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen, product?.id]);

  // Actualizar posición del modal según el scroll
  useEffect(() => {
    if (isOpen) {
      const updateModalPosition = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        document.documentElement.style.setProperty('--scroll-top', `${scrollTop}px`);
      };

      updateModalPosition();
      window.addEventListener('scroll', updateModalPosition);

      return () => {
        window.removeEventListener('scroll', updateModalPosition);
      };
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const isInWishlist = wishlist.includes(product.id.toString());
  const rating = product.rating?.rate || 0;
  const ratingCount = product.rating?.count || 0;

  const showNotificationMessage = (message) => {
    setShowNotification(message);
    setTimeout(() => setShowNotification(''), 3000);
  };

  const handleAddToCart = () => {
    if (quantity > 0 && quantity <= stock) {
      addToCart(product.id.toString(), quantity);
      showNotificationMessage(`✅ ${quantity} ${product.title} agregado(s) al carrito`);
      onClose();
    }
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id.toString());
      showNotificationMessage('💔 Eliminado de favoritos');
    } else {
      addToWishlist(product.id.toString());
      showNotificationMessage('❤️ Agregado a favoritos');
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
      {/* Overlay oscuro de fondo */}
      <div className="product-detail-overlay" onClick={onClose}></div>
      
      {/* Modal independiente del producto */}
      <div className="product-detail-modal">
        <button className="product-detail-close-btn" onClick={onClose}>
          ×
        </button>

        {showNotification && (
          <div className="product-detail-notification">
            {showNotification}
          </div>
        )}

        <div className="product-detail-content">
            {/* Imagen del producto */}
            <div className="modal-image-section">
              <div className="modal-image-container">
                <img src={product.image} alt={product.title} className="modal-product-image" />
                <span className="modal-category-badge">{product.category}</span>
              </div>
            </div>

            {/* Información del producto */}
            <div className="modal-info-section">
              <div className="product-header">
                <h1 className="modal-product-title">{product.title}</h1>
                <button 
                  className={`wishlist-toggle-btn ${isInWishlist ? 'active' : ''}`}
                  onClick={handleWishlistToggle}
                  title={isInWishlist ? "Eliminar de favoritos" : "Agregar a favoritos"}
                >
                  {isInWishlist ? '❤️' : '🤍'}
                </button>
              </div>

              {/* Rating */}
              {rating > 0 && (
                <div className="modal-rating">
                  <span className="modal-stars">{renderStars(rating)}</span>
                  <span className="modal-rating-text">
                    {rating.toFixed(1)} ({ratingCount} reseñas)
                  </span>
                </div>
              )}

              {/* Precio */}
              <div className="modal-price-section">
                <span className="modal-price">${product.price.toFixed(2)}</span>
                <span className="modal-price-note">Precio incluye impuestos</span>
              </div>

              {/* Descripción */}
              <div className="modal-description">
                <h3>📋 Descripción</h3>
                <p>{product.description}</p>
              </div>

              {/* Stock */}
              <div className="modal-stock-section">
                <h3>📦 Disponibilidad</h3>
                <div className="stock-info">
                  {stock > 0 ? (
                    <>
                      <span className="stock-available">✅ En stock</span>
                      <span className="stock-count">({stock} unidades disponibles)</span>
                    </>
                  ) : (
                    <span className="stock-unavailable">❌ Sin stock</span>
                  )}
                </div>
              </div>

              {/* Cantidad */}
              <div className="modal-quantity-section">
                <h3>🔢 Cantidad</h3>
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <input 
                    type="number"
                    className="quantity-input"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(stock, parseInt(e.target.value) || 1)))}
                    min="1"
                    max={stock}
                  />
                  <button 
                    className="quantity-btn"
                    onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                    disabled={quantity >= stock}
                  >
                    +
                  </button>
                </div>
                <span className="quantity-note">
                  Total: ${(product.price * quantity).toFixed(2)}
                </span>
              </div>

              {/* Información adicional */}
              <div className="modal-features">
                <h3>✨ Características</h3>
                <ul>
                  <li>🚚 Envío gratis en compras superiores a $50</li>
                  <li>🔄 Devoluciones gratis dentro de 30 días</li>
                  <li>🛡️ Garantía del fabricante incluida</li>
                  <li>💳 Pago seguro con múltiples métodos</li>
                </ul>
              </div>

              {/* Botones de acción */}
              <div className="product-detail-actions">
                <button 
                  className="product-detail-btn-secondary"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button 
                  className="product-detail-btn-primary"
                  onClick={handleAddToCart}
                  disabled={stock === 0}
                >
                  {stock === 0 ? '❌ Sin stock' : `🛒 Agregar ${quantity} al carrito`}
                </button>
              </div>
            </div>
          </div>
      </div>
    </>
  );
}