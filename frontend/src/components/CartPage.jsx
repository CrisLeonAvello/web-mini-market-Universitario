import React, { useState, useEffect } from 'react';
import { getCart, removeFromCart, updateCartItem, processCheckout } from '../services/api';
import '../styles.css';

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    direccion_envio: '',
    metodo_pago: 'tarjeta',
    notas: ''
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      setCart(data);
    } catch (err) {
      setError('Error al cargar el carrito: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await updateCartItem(itemId, newQuantity);
      await loadCart();
    } catch (err) {
      setError('Error al actualizar cantidad: ' + err.message);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
      await loadCart();
    } catch (err) {
      setError('Error al eliminar producto: ' + err.message);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (!checkoutData.direccion_envio) {
      setError('Por favor ingresa tu dirección de envío');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const result = await processCheckout(checkoutData);
      alert(`✅ Compra realizada exitosamente!\n\nNúmero de orden: ${result.numero_orden}\nTotal: $${result.total.toFixed(2)}`);
      setShowCheckout(false);
      await loadCart(); // Recargar carrito (debería estar vacío)
    } catch (err) {
      setError('Error al procesar la compra: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1>Cargando carrito...</h1>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1>🛒 Carrito de Compras</h1>
          <div className="empty-cart">
            <p>Tu carrito está vacío</p>
            <a href="/" className="btn-primary">Ir a comprar</a>
          </div>
        </div>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1>💳 Checkout</h1>
          
          {error && <div className="error-message">{error}</div>}

          <div className="checkout-container">
            <div className="checkout-summary">
              <h2>Resumen del Pedido</h2>
              {cart.items.map(item => (
                <div key={item.id_item} className="checkout-item">
                  <span>{item.producto.titulo} x{item.cantidad}</span>
                  <span>${item.subtotal.toFixed(2)}</span>
                </div>
              ))}
              <div className="checkout-totals">
                <div className="checkout-row">
                  <span>Subtotal:</span>
                  <span>${cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="checkout-row">
                  <span>Envío:</span>
                  <span>${cart.envio.toFixed(2)}</span>
                </div>
                <div className="checkout-row">
                  <span>Impuesto:</span>
                  <span>${cart.impuesto.toFixed(2)}</span>
                </div>
                <div className="checkout-row total">
                  <strong>Total:</strong>
                  <strong>${cart.total.toFixed(2)}</strong>
                </div>
              </div>
            </div>

            <form onSubmit={handleCheckout} className="checkout-form">
              <h2>Información de Envío</h2>
              
              <div className="form-group">
                <label htmlFor="direccion">Dirección de Envío *</label>
                <textarea
                  id="direccion"
                  value={checkoutData.direccion_envio}
                  onChange={(e) => setCheckoutData({...checkoutData, direccion_envio: e.target.value})}
                  placeholder="Calle, número, ciudad, código postal..."
                  required
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="metodo_pago">Método de Pago *</label>
                <select
                  id="metodo_pago"
                  value={checkoutData.metodo_pago}
                  onChange={(e) => setCheckoutData({...checkoutData, metodo_pago: e.target.value})}
                >
                  <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                  <option value="efectivo">Efectivo (Pago contra entrega)</option>
                  <option value="transferencia">Transferencia Bancaria</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="notas">Notas adicionales (opcional)</label>
                <textarea
                  id="notas"
                  value={checkoutData.notas}
                  onChange={(e) => setCheckoutData({...checkoutData, notas: e.target.value})}
                  placeholder="Instrucciones especiales de entrega..."
                  rows="2"
                />
              </div>

              <div className="checkout-actions">
                <button 
                  type="button" 
                  onClick={() => setShowCheckout(false)}
                  className="btn-secondary"
                  disabled={processing}
                >
                  Volver al Carrito
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={processing}
                >
                  {processing ? 'Procesando...' : 'Confirmar Compra'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>🛒 Carrito de Compras</h1>
        
        {error && <div className="error-message">{error}</div>}

        <div className="cart-container">
          <div className="cart-items">
            {cart.items.map(item => (
              <div key={item.id_item} className="cart-item">
                <img 
                  src={item.producto.imagen || '/placeholder-image.jpg'} 
                  alt={item.producto.titulo}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{item.producto.titulo}</h3>
                  <p className="cart-item-price">${item.precio_unitario.toFixed(2)}</p>
                  <p className="cart-item-stock">Stock disponible: {item.producto.stock}</p>
                </div>
                <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <button 
                      onClick={() => handleUpdateQuantity(item.id_item, item.cantidad - 1)}
                      disabled={item.cantidad <= 1}
                    >
                      -
                    </button>
                    <span>{item.cantidad}</span>
                    <button 
                      onClick={() => handleUpdateQuantity(item.id_item, item.cantidad + 1)}
                      disabled={item.cantidad >= item.producto.stock}
                    >
                      +
                    </button>
                  </div>
                  <p className="cart-item-subtotal">
                    Subtotal: ${item.subtotal.toFixed(2)}
                  </p>
                  <button 
                    onClick={() => handleRemoveItem(item.id_item)}
                    className="btn-remove"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Resumen del Pedido</h2>
            <div className="summary-row">
              <span>Productos ({cart.total_productos}):</span>
              <span>${cart.subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Envío:</span>
              <span>${cart.envio.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Impuesto:</span>
              <span>${cart.impuesto.toFixed(2)}</span>
            </div>
            <hr />
            <div className="summary-row total">
              <strong>Total:</strong>
              <strong>${cart.total.toFixed(2)}</strong>
            </div>
            <button 
              onClick={() => setShowCheckout(true)}
              className="btn-checkout"
            >
              Proceder al Pago
            </button>
            <a href="/" className="btn-continue">
              Continuar Comprando
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
