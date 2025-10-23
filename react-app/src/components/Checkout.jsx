import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';

export default function Checkout({ isOpen, onClose }) {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const handleInputChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simular procesamiento de orden
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setOrderComplete(true);

    // Limpiar carrito después de 3 segundos
    setTimeout(() => {
      clearCart();
      setOrderComplete(false);
      onClose();
    }, 3000);
  };

  if (!isOpen) return null;

  if (orderComplete) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content checkout-modal" onClick={e => e.stopPropagation()}>
          <div className="order-success">
            <div className="success-icon">✅</div>
            <h2>¡Pedido Confirmado!</h2>
            <p>Tu orden ha sido procesada exitosamente</p>
            <p>Recibirás un email de confirmación pronto</p>
            <div className="celebration-animation">🎉🎊🎉</div>
          </div>
        </div>
      </div>
    );
  }

  const total = getTotalPrice();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content checkout-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🛒 Finalizar Compra</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="checkout-content">
          {/* Resumen del pedido */}
          <div className="order-summary">
            <h3>📋 Resumen del Pedido</h3>
            <div className="checkout-items">
              {cartItems.map(item => (
                <div key={item.id} className="checkout-item">
                  <img src={item.image} alt={item.title} className="checkout-item-image" />
                  <div className="checkout-item-info">
                    <span className="checkout-item-title">{item.title}</span>
                    <span className="checkout-item-quantity">Cantidad: {item.cartQuantity}</span>
                    <span className="checkout-item-price">${(item.price * item.cartQuantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="checkout-total">
              <strong>Total: ${total.toFixed(2)}</strong>
            </div>
          </div>

          {/* Formulario de información del cliente */}
          <form onSubmit={handleSubmitOrder} className="checkout-form">
            <div className="form-section">
              <h3>👤 Información Personal</h3>
              <div className="form-row">
                <input
                  type="text"
                  name="name"
                  placeholder="Nombre completo"
                  value={customerInfo.name}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <input
                type="tel"
                name="phone"
                placeholder="Teléfono"
                value={customerInfo.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-section">
              <h3>📍 Dirección de Envío</h3>
              <input
                type="text"
                name="address"
                placeholder="Dirección completa"
                value={customerInfo.address}
                onChange={handleInputChange}
                required
              />
              <div className="form-row">
                <input
                  type="text"
                  name="city"
                  placeholder="Ciudad"
                  value={customerInfo.city}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Código postal"
                  value={customerInfo.postalCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h3>💳 Método de Pago</h3>
              <div className="payment-methods">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="credit-card"
                    checked={paymentMethod === 'credit-card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  💳 Tarjeta de Crédito
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="debit-card"
                    checked={paymentMethod === 'debit-card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  💴 Tarjeta de Débito
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  🏦 PayPal
                </label>
              </div>
            </div>

            <div className="checkout-actions">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn-submit" 
                disabled={isProcessing}
              >
                {isProcessing ? '⏳ Procesando...' : `💰 Pagar $${total.toFixed(2)}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}