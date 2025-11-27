import React, { useState, useEffect } from 'react';
import { getCart, updateCartItem, removeFromCart, clearCart, processCheckout } from '../services/api';

export default function CartModal({ isOpen, onClose }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showNotification, setShowNotification] = useState('');
  const [checkoutData, setCheckoutData] = useState({
    direccion_envio: '',
    metodo_pago: 'tarjeta',
    notas: ''
  });

  const showNotificationMessage = (message) => {
    setShowNotification(message);
    setTimeout(() => setShowNotification(''), 3000);
  };

  const loadCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCart();
      console.log('🛒 Cart data received:', data);
      console.log('🛒 Items in cart:', data.items);
      setCart(data);
    } catch (err) {
      setError(err.message || 'Error al cargar el carrito');
      console.error('Error loading cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadCart();
      setShowCheckout(false);
    }
  }, [isOpen]);

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      await handleRemoveItem(itemId);
      return;
    }

    try {
      await updateCartItem(itemId, newQuantity);
      await loadCart();
      showNotificationMessage('✓ Cantidad actualizada');
    } catch (err) {
      showNotificationMessage('❌ ' + err.message);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
      await loadCart();
      showNotificationMessage('🗑️ Producto eliminado');
    } catch (err) {
      showNotificationMessage('❌ ' + err.message);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      return;
    }

    try {
      await clearCart();
      await loadCart();
      showNotificationMessage('🛒 Carrito vaciado');
    } catch (err) {
      showNotificationMessage('❌ ' + err.message);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    // Verificar autenticación
    const token = localStorage.getItem('authToken');
    if (!token) {
      showNotificationMessage('❌ Debes iniciar sesión para realizar la compra');
      setTimeout(() => {
        onClose();
        // Redirigir a login si es necesario
      }, 2000);
      return;
    }
    
    // Validaciones
    if (!checkoutData.direccion_envio.trim()) {
      showNotificationMessage('❌ Por favor ingresa tu dirección de envío');
      return;
    }
    
    if (checkoutData.direccion_envio.trim().length < 10) {
      showNotificationMessage('❌ La dirección debe tener al menos 10 caracteres');
      return;
    }

    try {
      setProcessing(true);
      console.log('📦 Sending checkout data:', checkoutData);
      const result = await processCheckout(checkoutData);
      console.log('✅ Checkout result:', result);
      showNotificationMessage('✓ ¡Compra realizada con éxito! Orden #' + result.numero_orden);
      setShowCheckout(false);
      await loadCart();
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('❌ Checkout error:', err);
      if (err.message.includes('401')) {
        showNotificationMessage('❌ Sesión expirada. Por favor inicia sesión nuevamente');
      } else {
        showNotificationMessage('❌ ' + err.message);
      }
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-modal-overlay" onClick={onClose}></div>
      <div className="cart-modal-container" onClick={e => e.stopPropagation()}>
        <div className="cart-modal-header">
          <h2>🛒 Mi Carrito</h2>
          <button className="cart-modal-close-btn" onClick={onClose}>×</button>
        </div>

        {showNotification && (
          <div className="notification success">
            {showNotification}
          </div>
        )}

        {loading ? (
          <div className="cart-loading">
            <p>Cargando carrito...</p>
          </div>
        ) : error ? (
          <div className="cart-error">
            <p>❌ {error}</p>
            <button className="btn-primary" onClick={loadCart}>Reintentar</button>
          </div>
        ) : !cart || cart.items.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-icon">🛒</div>
            <h3>Tu carrito está vacío</h3>
            <p>Agrega productos para comenzar tu compra</p>
            <button className="btn-primary" onClick={onClose}>
              🛍️ Seguir comprando
            </button>
          </div>
        ) : showCheckout ? (
          <div className="checkout-container-modal">
            <div className="checkout-summary-modal">
              <h3>Resumen de compra</h3>
              {cart.items.map(item => (
                <div key={item.id_item} className="checkout-item-modal">
                  <span>{item.producto.titulo} (x{item.cantidad})</span>
                  <span>${(item.producto.precio * item.cantidad).toFixed(2)}</span>
                </div>
              ))}
              <div className="checkout-totals-modal">
                <div className="checkout-row">
                  <span>Subtotal:</span>
                  <span>${cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="checkout-row">
                  <span>Envío:</span>
                  <span>${cart.envio.toFixed(2)}</span>
                </div>
                <div className="checkout-row">
                  <span>Impuestos:</span>
                  <span>${cart.impuesto.toFixed(2)}</span>
                </div>
                <div className="checkout-row total">
                  <span>Total:</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleCheckout} className="checkout-form-modal">
              <h3>Datos de envío</h3>
              
              <div className="form-group">
                <label>Dirección de envío * (mínimo 10 caracteres)</label>
                <textarea
                  value={checkoutData.direccion_envio}
                  onChange={e => setCheckoutData({...checkoutData, direccion_envio: e.target.value})}
                  placeholder="Ejemplo: Calle Principal 123, Depto 4B, Ciudad Capital, CP 12345"
                  required
                  minLength={10}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Método de pago</label>
                <select
                  value={checkoutData.metodo_pago}
                  onChange={e => setCheckoutData({...checkoutData, metodo_pago: e.target.value})}
                >
                  <option value="tarjeta">Tarjeta de crédito/débito</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="transferencia">Transferencia bancaria</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>

              <div className="form-group">
                <label>Notas adicionales</label>
                <textarea
                  value={checkoutData.notas}
                  onChange={e => setCheckoutData({...checkoutData, notas: e.target.value})}
                  placeholder="Instrucciones especiales de entrega..."
                  rows="2"
                />
              </div>

              <div className="checkout-actions-modal">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowCheckout(false)}
                  disabled={processing}
                >
                  ← Volver al carrito
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={processing}
                >
                  {processing ? 'Procesando...' : '💰 Confirmar compra'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="cart-actions">
              <span className="cart-count">{cart.items.length} productos</span>
              <button 
                className="btn-danger" 
                onClick={handleClearCart}
                title="Vaciar carrito"
              >
                🗑️ Vaciar
              </button>
            </div>

            <div className="cart-items">
              {cart.items.map(item => (
                <div key={item.id_item} className="cart-item animate-slide-in">
                  <div className="cart-item-image">
                    <img src={item.producto.imagen || 'https://via.placeholder.com/80'} alt={item.producto.titulo} />
                  </div>
                  
                  <div className="cart-item-info">
                    <h4 className="cart-item-title">{item.producto.titulo}</h4>
                    <p className="cart-item-price">
                      <span className="unit-price">${item.producto.precio} c/u</span>
                      <span className="total-price">${(item.producto.precio * item.cantidad).toFixed(2)}</span>
                    </p>
                    
                    <div className="quantity-controls">
                      <button 
                        className="quantity-btn"
                        onClick={() => handleUpdateQuantity(item.id_item, item.cantidad - 1)}
                        title="Disminuir cantidad"
                      >
                        −
                      </button>
                      <span className="quantity">{item.cantidad}</span>
                      <button 
                        className="quantity-btn"
                        onClick={() => handleUpdateQuantity(item.id_item, item.cantidad + 1)}
                        title="Aumentar cantidad"
                        disabled={item.cantidad >= item.producto.stock}
                      >
                        +
                      </button>
                    </div>
                    <p className="cart-item-stock">Stock disponible: {item.producto.stock}</p>
                  </div>

                  <div className="cart-item-actions">
                    <button 
                      className="btn-remove"
                      onClick={() => handleRemoveItem(item.id_item)}
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
                <span>Subtotal:</span>
                <span>${cart.subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Envío:</span>
                <span className={cart.envio === 0 ? 'free' : ''}>{cart.envio === 0 ? 'Gratis 🚚' : `$${cart.envio.toFixed(2)}`}</span>
              </div>
              <div className="summary-row">
                <span>Impuestos:</span>
                <span>${cart.impuesto.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="cart-checkout">
              <button className="btn-continue" onClick={onClose}>
                🛍️ Seguir comprando
              </button>
              <button 
                className="btn-checkout animate-glow" 
                onClick={() => setShowCheckout(true)}
              >
                💰 Proceder al pago
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}