import React, { useState } from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import { useProducts } from '../contexts/ProductsContext';
import { useCart } from '../contexts/CartContext';

export default function WishlistModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState('');
  const { wishlist, addToWishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { allProducts } = useProducts();
  const { addToCart } = useCart();

  const wishlistItems = wishlist.map(id => 
    allProducts.find(product => product.id.toString() === id.toString())
  ).filter(Boolean);

  const showNotificationMessage = (message) => {
    setShowNotification(message);
    setTimeout(() => setShowNotification(''), 3000);
  };

  const handleAddToCart = (product) => {
    addToCart(product.id.toString(), 1);
    showNotificationMessage(`✅ ${product.title} agregado al carrito`);
  };

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
    showNotificationMessage('💔 Producto eliminado de favoritos');
  };

  const handleAddAllToCart = () => {
    wishlistItems.forEach(item => {
      addToCart(item.id.toString(), 1);
    });
    showNotificationMessage(`🛒 ${wishlistItems.length} productos agregados al carrito`);
  };

  const handleClearWishlist = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todos los favoritos?')) {
      clearWishlist();
      showNotificationMessage('🗑️ Lista de favoritos limpiada');
    }
  };

  return (
    <>
      <button 
        className="nav-btn space-nav-btn wishlist-btn" 
        onClick={() => setIsOpen(!isOpen)}
        title="Lista de favoritos"
      >
        <span className="btn-icon">❤️</span>
        <span>Favoritos ({wishlist.length})</span>
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content wishlist-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>❤️ Mi Lista de Favoritos</h2>
              <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
            </div>

            {showNotification && (
              <div className="notification success">
                {showNotification}
              </div>
            )}

            {wishlistItems.length === 0 ? (
              <div className="empty-wishlist">
                <div className="empty-icon">💔</div>
                <h3>Tu lista de favoritos está vacía</h3>
                <p>Agrega productos que te gusten para encontrarlos fácilmente más tarde</p>
                <button className="btn-primary" onClick={() => setIsOpen(false)}>
                  🛍️ Seguir comprando
                </button>
              </div>
            ) : (
              <>
                <div className="wishlist-actions">
                  <button 
                    className="btn-primary" 
                    onClick={handleAddAllToCart}
                    title="Agregar todos al carrito"
                  >
                    🛒 Agregar todo al carrito
                  </button>
                  <button 
                    className="btn-danger" 
                    onClick={handleClearWishlist}
                    title="Limpiar lista de favoritos"
                  >
                    🗑️ Limpiar lista
                  </button>
                </div>

                <div className="wishlist-items">
                  {wishlistItems.map(item => (
                    <div key={item.id} className="wishlist-item animate-fade-in">
                      <div className="wishlist-item-image">
                        <img src={item.image} alt={item.title} />
                      </div>
                      
                      <div className="wishlist-item-info">
                        <h4 className="wishlist-item-title">{item.title}</h4>
                        <p className="wishlist-item-description">
                          {item.description?.substring(0, 100)}...
                        </p>
                        <div className="wishlist-item-rating">
                          {'⭐'.repeat(Math.floor(item.rating?.rate || 0))} 
                          <span>({item.rating?.count || 0} reseñas)</span>
                        </div>
                        <div className="wishlist-item-price">
                          <span className="price">${item.price}</span>
                          {item.originalPrice && (
                            <span className="original-price">${item.originalPrice}</span>
                          )}
                        </div>
                      </div>

                      <div className="wishlist-item-actions">
                        <button 
                          className="btn-cart animate-bounce"
                          onClick={() => handleAddToCart(item)}
                          title="Agregar al carrito"
                        >
                          🛒 Agregar
                        </button>
                        <button 
                          className="btn-remove animate-shake"
                          onClick={() => handleRemoveFromWishlist(item.id)}
                          title="Eliminar de favoritos"
                        >
                          💔 Quitar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="wishlist-summary">
                  <p>Total de productos favoritos: <strong>{wishlistItems.length}</strong></p>
                  <p>Valor total estimado: <strong>${wishlistItems.reduce((total, item) => total + item.price, 0).toFixed(2)}</strong></p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}