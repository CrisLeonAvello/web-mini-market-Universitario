import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import CheckoutModal from './CheckoutModal';

export default function CartModalNew() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showNotification, setShowNotification] = useState('');
  const { cartItems, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();

  const showNotificationMessage = (message) => {
    setShowNotification(message);
    setTimeout(() => setShowNotification(''), 3000);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      showNotificationMessage('🗑️ Producto eliminado del carrito');
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId, productTitle) => {
    removeFromCart(productId);
    showNotificationMessage(`🗑️ ${productTitle} eliminado del carrito`);
  };

  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      clearCart();
      showNotificationMessage('🛒 Carrito vaciado');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showNotificationMessage('❌ El carrito está vacío');
      return;
    }
    setIsOpen(false);
    setShowCheckout(true);
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
  };

  const total = getTotalPrice();
  const itemCount = cartItems.reduce((total, item) => total + item.cartQuantity, 0);

  return (
    <>
      <button 
        className="nav-btn space-nav-btn cart-btn" 
        onClick={() => setIsOpen(!isOpen)}
        title="Carrito de compras"
      >
        <span className="btn-icon">🛒</span>
        <span>Carrito ({itemCount})</span>
      </button>

      <CheckoutModal isOpen={showCheckout} onClose={handleCloseCheckout} />

      {isOpen && (
        <>
          <div className="cart-modal-overlay" onClick={() => setIsOpen(false)}></div>
          <div className="cart-modal-container" onClick={e => e.stopPropagation()}>
          <div className="cart-modal-header">
            <h2>🛒 Mi Carrito de Compras</h2>
            <button className="cart-modal-close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>

            {showNotification && (
              <div className="notification success">
                {showNotification}
              </div>
            )}

            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-icon">🛒</div>
                <h3>Tu carrito está vacío</h3>
                <p>Agrega productos para comenzar tu compra</p>
                <button className="btn-primary" onClick={() => setIsOpen(false)}>
                  🛍️ Seguir comprando
                </button>
              </div>
            ) : (
              <>
                <div className="cart-actions">
                  <span className="cart-count">{itemCount} productos</span>
                  <button 
                    className="btn-danger" 
                    onClick={handleClearCart}
                    title="Vaciar carrito"
                  >
                    🗑️ Vaciar carrito
                  </button>
                </div>

                <div className="cart-items">
                  {cartItems.map(item => (
                    <div key={item.id} className="cart-item animate-slide-in">
                      <div className="cart-item-image">
                        <img src={item.image} alt={item.title} />
                      </div>
                      
                      <div className="cart-item-info">
                        <h4 className="cart-item-title">{item.title}</h4>
                        <p className="cart-item-price">
                          <span className="unit-price">${item.price} c/u</span>
                          <span className="total-price">${(item.price * item.cartQuantity).toFixed(2)}</span>
                        </p>
                        
                        <div className="quantity-controls">
                          <button 
                            className="quantity-btn animate-pulse"
                            onClick={() => handleQuantityChange(item.id, item.cartQuantity - 1)}
                            title="Disminuir cantidad"
                          >
                            −
                          </button>
                          <span className="quantity">{item.cartQuantity}</span>
                          <button 
                            className="quantity-btn animate-pulse"
                            onClick={() => handleQuantityChange(item.id, item.cartQuantity + 1)}
                            title="Aumentar cantidad"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="cart-item-actions">
                        <button 
                          className="btn-remove animate-shake"
                          onClick={() => handleRemoveItem(item.id, item.title)}
                          title="Eliminar producto"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div className="summary-row">
                    <span>Subtotal ({itemCount} productos):</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="summary-row shipping">
                    <span>Envío:</span>
                    <span className="free">Gratis 🚚</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="cart-checkout">
                  <button className="btn-continue" onClick={() => setIsOpen(false)}>
                    🛍️ Seguir comprando
                  </button>
                  <button 
                    className="btn-checkout animate-glow" 
                    onClick={handleCheckout}
                  >
                    💰 Proceder al pago
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}