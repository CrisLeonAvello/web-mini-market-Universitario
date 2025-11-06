import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductsContext';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal, getCartItemsCount } = useCart();
  const { allProducts, getDefaultImage } = useProducts();
  const [isOpen, setIsOpen] = useState(false);

  const getCartItemsWithDetails = () => {
    return cart.map(item => {
      const product = allProducts.find(p => p.id === item.id);
      if (product) {
        return {
          ...item,
          ...product
        };
      }
      return null;
    }).filter(item => item !== null);
  };

  const cartItemsWithDetails = getCartItemsWithDetails();
  const total = getCartTotal(allProducts);
  const itemsCount = getCartItemsCount();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    
    // Aquí puedes redirigir a la página de checkout
    console.log('🛒 Ir a checkout con items:', cart);
    // window.location.href = '/checkout.html'; // En React usarías navigate
  };

  return (
    <>
      {/* Botón del carrito */}
      <div className="cart-icon" onClick={() => setIsOpen(!isOpen)}>
        🛒
        {itemsCount > 0 && (
          <span className="cart-badge">{itemsCount}</span>
        )}
      </div>

      {/* Dropdown del carrito */}
      {isOpen && (
        <div className="cart-dropdown">
          <div className="cart-header">
            <h3>Carrito de Compras</h3>
            <button 
              className="cart-close" 
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar carrito"
            >
              ×
            </button>
          </div>

          <div className="cart-items">
            {cartItemsWithDetails.length === 0 ? (
              <p className="cart-empty">Tu carrito está vacío</p>
            ) : (
              cartItemsWithDetails.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img 
                      src={item.imagenes?.[0] || getDefaultImage(item.categoria)} 
                      alt={item.titulo}
                    />
                  </div>
                  
                  <div className="cart-item-details">
                    <h4 className="cart-item-title">{item.titulo}</h4>
                    <p className="cart-item-price">
                      ${item.precio.toLocaleString()}
                    </p>
                    
                    <div className="cart-item-quantity">
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Disminuir cantidad"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="cart-item-actions">
                    <button 
                      className="cart-item-remove"
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Eliminar producto"
                    >
                      🗑️
                    </button>
                  </div>
                  
                  <div className="cart-item-subtotal">
                    ${(item.precio * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>

          {cartItemsWithDetails.length > 0 && (
            <div className="cart-footer">
              <div className="cart-total">
                <strong>Total: ${total.toLocaleString()}</strong>
              </div>
              
              <div className="cart-actions">
                <button 
                  className="cart-clear"
                  onClick={clearCart}
                >
                  Vaciar carrito
                </button>
                
                <button 
                  className="cart-checkout"
                  onClick={handleCheckout}
                >
                  Ir a pagar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Overlay para cerrar el carrito al hacer clic fuera */}
      {isOpen && (
        <div 
          className="cart-overlay" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <style jsx>{`
        .cart-icon {
          position: relative;
          cursor: pointer;
          font-size: 1.5rem;
          padding: 0.5rem;
          border-radius: 50%;
          background: #f8f9fa;
          transition: background 0.2s ease;
        }
        
        .cart-icon:hover {
          background: #e9ecef;
        }
        
        .cart-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #dc3545;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        
        .cart-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          width: 400px;
          max-width: 90vw;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          z-index: 1000;
          max-height: 80vh;
          overflow-y: auto;
        }
        
        .cart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid #eee;
        }
        
        .cart-header h3 {
          margin: 0;
          font-size: 1.1rem;
        }
        
        .cart-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
        }
        
        .cart-items {
          max-height: 400px;
          overflow-y: auto;
        }
        
        .cart-empty {
          text-align: center;
          padding: 2rem;
          color: #666;
        }
        
        .cart-item {
          display: grid;
          grid-template-columns: 60px 1fr auto auto;
          gap: 1rem;
          padding: 1rem;
          border-bottom: 1px solid #eee;
          align-items: center;
        }
        
        .cart-item-image img {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 4px;
        }
        
        .cart-item-title {
          font-size: 0.9rem;
          margin: 0 0 0.25rem 0;
          font-weight: 600;
        }
        
        .cart-item-price {
          font-size: 0.8rem;
          color: #666;
          margin: 0;
        }
        
        .cart-item-quantity {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        
        .cart-item-quantity button {
          width: 24px;
          height: 24px;
          border: 1px solid #ddd;
          background: white;
          cursor: pointer;
          border-radius: 4px;
          font-size: 0.8rem;
        }
        
        .cart-item-quantity button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .cart-item-remove {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.1rem;
          padding: 0.25rem;
          border-radius: 4px;
        }
        
        .cart-item-remove:hover {
          background: #ffe6e6;
        }
        
        .cart-item-subtotal {
          font-weight: 600;
          font-size: 0.9rem;
        }
        
        .cart-footer {
          padding: 1rem;
          border-top: 1px solid #eee;
          background: #f8f9fa;
        }
        
        .cart-total {
          text-align: center;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }
        
        .cart-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .cart-clear, .cart-checkout {
          flex: 1;
          padding: 0.75rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
        }
        
        .cart-clear {
          background: #6c757d;
          color: white;
        }
        
        .cart-checkout {
          background: #28a745;
          color: white;
        }
        
        .cart-clear:hover {
          background: #5a6268;
        }
        
        .cart-checkout:hover {
          background: #218838;
        }
        
        .cart-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.1);
          z-index: 999;
        }
        
        @media (max-width: 768px) {
          .cart-dropdown {
            width: 350px;
          }
          
          .cart-item {
            grid-template-columns: 50px 1fr auto;
            gap: 0.5rem;
          }
          
          .cart-item-subtotal {
            grid-column: span 3;
            text-align: right;
            margin-top: 0.5rem;
          }
        }
      `}</style>
    </>
  );
};

export default Cart;