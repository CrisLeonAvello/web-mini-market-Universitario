import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';

export default function CheckoutModal({ isOpen, onClose }) {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    metodoPago: 'tarjeta'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simular procesamiento de pago
    console.log('💳 Procesando pago...', formData);
    console.log('🛒 Items:', cartItems);
    console.log('💰 Total:', getTotalPrice());
    
    // Mostrar mensaje de éxito
    setOrderSuccess(true);
    
    // Limpiar carrito después de 2 segundos
    setTimeout(() => {
      clearCart();
      setOrderSuccess(false);
      onClose();
      // Resetear formulario
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        ciudad: '',
        codigoPostal: '',
        metodoPago: 'tarjeta'
      });
    }, 3000);
  };

  if (!isOpen) return null;

  const total = getTotalPrice();
  const itemCount = cartItems.reduce((total, item) => total + item.cartQuantity, 0);

  return (
    <>
      <div className="cart-modal-overlay" onClick={onClose}></div>
      <div className="cart-modal-container checkout-modal-container" onClick={e => e.stopPropagation()}>
        <div className="cart-modal-header">
          <h2>💳 Finalizar Compra</h2>
          <button className="cart-modal-close-btn" onClick={onClose}>×</button>
        </div>

        {orderSuccess ? (
          <div className="checkout-success">
            <div className="success-icon animate-bounce">✅</div>
            <h3>¡Pago Realizado Exitosamente!</h3>
            <p>Tu pedido ha sido procesado correctamente</p>
            <div className="success-details">
              <p>📦 {itemCount} productos</p>
              <p>💰 Total pagado: ${total.toFixed(2)}</p>
            </div>
            <p className="success-message">Recibirás un correo de confirmación pronto</p>
          </div>
        ) : (
          <>
            {/* Resumen del pedido */}
            <div className="checkout-summary-section">
              <h3>📦 Resumen del Pedido</h3>
              <div className="checkout-items-summary">
                {cartItems.map(item => (
                  <div key={item.id} className="checkout-item-row">
                    <img src={item.image} alt={item.title} className="checkout-item-thumb" />
                    <div className="checkout-item-details">
                      <span className="checkout-item-name">{item.title}</span>
                      <span className="checkout-item-qty">x{item.cartQuantity}</span>
                    </div>
                    <span className="checkout-item-price">${(item.price * item.cartQuantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="checkout-total-section">
                <div className="checkout-subtotal">
                  <span>Subtotal ({itemCount} productos):</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="checkout-shipping">
                  <span>Envío:</span>
                  <span className="free">Gratis 🚚</span>
                </div>
                <div className="checkout-total">
                  <span>Total a pagar:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Formulario de pago */}
            <form onSubmit={handleSubmit} className="checkout-form">
              <h3>📋 Información de Envío</h3>
              
              <div className="form-group">
                <label htmlFor="nombre">Nombre completo *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  placeholder="Juan Pérez"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="juan@ejemplo.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="telefono">Teléfono *</label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    required
                    placeholder="+56 9 1234 5678"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="direccion">Dirección *</label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  required
                  placeholder="Calle Principal 123"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="ciudad">Ciudad *</label>
                  <input
                    type="text"
                    id="ciudad"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleInputChange}
                    required
                    placeholder="Santiago"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="codigoPostal">Código Postal *</label>
                  <input
                    type="text"
                    id="codigoPostal"
                    name="codigoPostal"
                    value={formData.codigoPostal}
                    onChange={handleInputChange}
                    required
                    placeholder="8320000"
                  />
                </div>
              </div>

              <h3>💳 Método de Pago</h3>
              
              <div className="payment-methods">
                <label className="payment-method">
                  <input
                    type="radio"
                    name="metodoPago"
                    value="tarjeta"
                    checked={formData.metodoPago === 'tarjeta'}
                    onChange={handleInputChange}
                  />
                  <span className="payment-option">
                    <span className="payment-icon">💳</span>
                    <span>Tarjeta de Crédito/Débito</span>
                  </span>
                </label>

                <label className="payment-method">
                  <input
                    type="radio"
                    name="metodoPago"
                    value="transferencia"
                    checked={formData.metodoPago === 'transferencia'}
                    onChange={handleInputChange}
                  />
                  <span className="payment-option">
                    <span className="payment-icon">🏦</span>
                    <span>Transferencia Bancaria</span>
                  </span>
                </label>

                <label className="payment-method">
                  <input
                    type="radio"
                    name="metodoPago"
                    value="efectivo"
                    checked={formData.metodoPago === 'efectivo'}
                    onChange={handleInputChange}
                  />
                  <span className="payment-option">
                    <span className="payment-icon">💵</span>
                    <span>Pago contra entrega</span>
                  </span>
                </label>
              </div>

              <div className="checkout-actions">
                <button type="button" className="btn-cancel" onClick={onClose}>
                  ← Volver al carrito
                </button>
                <button type="submit" className="btn-pay animate-glow">
                  💰 Pagar ${total.toFixed(2)}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </>
  );
}
