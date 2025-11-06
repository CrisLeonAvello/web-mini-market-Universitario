import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useProducts } from '../contexts/ProductsContext';

export default function ProductModal({ product, open, onClose }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { renderStars, getDefaultImage } = useProducts();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (open) {
      setQuantity(1);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  if (!open || !product) return null;

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    // Mostrar notificación (puedes implementar un contexto de notificaciones)
    console.log(`🛒 ${product.titulo} agregado al carrito (cantidad: ${quantity})`);
  };

  const handleToggleWishlist = () => {
    const added = toggleWishlist(product.id);
    console.log(added ? `❤️ ${product.titulo} agregado a favoritos` : `💔 ${product.titulo} removido de favoritos`);
  };

  const changeQuantity = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const imageUrl = (product.imagenes && product.imagenes.length > 0) 
    ? product.imagenes[0] 
    : getDefaultImage(product.categoria);

  const inWishlist = isInWishlist(product.id);

  return (
    <div 
      className="product-modal" 
      style={{ display: 'flex' }}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="modal-title">{product.titulo}</h2>
          <button className="product-modal-close" onClick={onClose} aria-label="Cerrar modal">
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <div className="modal-image">
            <img 
              id="modal-image" 
              src={imageUrl} 
              alt={product.titulo}
              className={product.stock === 0 ? 'out-of-stock' : ''}
            />
          </div>
          
          <div className="modal-info">
            <div className="modal-category" id="modal-category">
              {product.categoria}
            </div>
            
            <div className="modal-brand">
              Marca: {product.marca}
            </div>
            
            <div className="modal-rating">
              <span className="modal-stars">{renderStars(product.rating)}</span>
              <span className="modal-rating-text">({product.rating})</span>
            </div>
            
            <div className="modal-price">
              ${product.precio.toLocaleString()}
            </div>
            
            <div className="modal-description">
              {product.descripcion}
            </div>
            
            <div className="modal-stock-info">
              <span>Stock disponible: </span>
              <span 
                id="modal-stock" 
                className={`modal-stock-number ${product.stock === 0 ? 'out-of-stock' : ''}`}
              >
                {product.stock === 0 ? 'Sin stock' : product.stock}
              </span>
            </div>
            
            {product.stock > 0 && (
              <div className="modal-quantity-control">
                <label htmlFor="modal-quantity">Cantidad:</label>
                <div className="quantity-controls">
                  <button 
                    id="quantity-minus"
                    onClick={() => changeQuantity(-1)}
                    disabled={quantity <= 1}
                    aria-label="Disminuir cantidad"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    id="modal-quantity"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val >= 1 && val <= product.stock) {
                        setQuantity(val);
                      }
                    }}
                    min="1"
                    max={product.stock}
                  />
                  <button 
                    id="quantity-plus"
                    onClick={() => changeQuantity(1)}
                    disabled={quantity >= product.stock}
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
            
            <div className="modal-actions">
              <button 
                className={`modal-btn primary ${product.stock === 0 ? 'disabled' : ''}`}
                id="modal-add-to-cart"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Sin stock' : '🛒 Agregar al carrito'}
              </button>
              
              <button 
                className={`modal-btn secondary ${inWishlist ? 'in-wishlist' : ''}`}
                id="modal-add-to-wishlist"
                onClick={handleToggleWishlist}
              >
                {inWishlist ? '❤️ En favoritos' : '♡ Agregar a favoritos'}
              </button>
              
              <button className="modal-btn tertiary" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
