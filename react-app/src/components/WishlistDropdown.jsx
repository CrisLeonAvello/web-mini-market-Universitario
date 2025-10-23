import React, { useState } from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import { useProducts } from '../contexts/ProductsContext';
import { useCart } from '../contexts/CartContext';

const WishlistDropdown = () => {
  const { wishlist, removeFromWishlist, clearWishlist, buyAllWishlist, getWishlistCount } = useWishlist();
  const { allProducts, getDefaultImage } = useProducts();
  const { addToCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const getWishlistItemsWithDetails = () => {
    return wishlist.map(productId => {
      const product = allProducts.find(p => p.id === productId);
      return product || null;
    }).filter(item => item !== null);
  };

  const wishlistItems = getWishlistItemsWithDetails();
  const wishlistCount = getWishlistCount();

  const handleBuyAll = () => {
    const result = buyAllWishlist(allProducts, addToCart);
    
    // Mostrar notificación del resultado
    if (result.success) {
      console.log(`✅ ${result.message}`);
      // Aquí puedes agregar una notificación visual
    } else {
      console.log(`⚠️ ${result.message}`);
    }
  };

  const handleAddToCart = (productId) => {
    const product = allProducts.find(p => p.id === productId);
    if (product && product.stock > 0) {
      addToCart(productId, 1);
      console.log(`🛒 ${product.titulo} agregado al carrito desde favoritos`);
    } else {
      console.log(`⚠️ ${product?.titulo || 'Producto'} sin stock`);
    }
  };

  return (
    <>
      {/* Botón de wishlist */}
      <div className="wishlist-icon" onClick={() => setIsOpen(!isOpen)}>
        ❤️
        {wishlistCount > 0 && (
          <span className="wishlist-badge">{wishlistCount}</span>
        )}
      </div>

      {/* Dropdown de wishlist */}
      {isOpen && (
        <div className="wishlist-dropdown">
          <div className="wishlist-header">
            <h3>Lista de Favoritos</h3>
            <button 
              className="wishlist-close" 
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar favoritos"
            >
              ×
            </button>
          </div>

          <div className="wishlist-items">
            {wishlistItems.length === 0 ? (
              <p className="wishlist-empty">No tienes productos favoritos</p>
            ) : (
              wishlistItems.map(item => (
                <div key={item.id} className="wishlist-item">
                  <div className="wishlist-item-image">
                    <img 
                      src={item.imagenes?.[0] || getDefaultImage(item.categoria)} 
                      alt={item.titulo}
                    />
                  </div>
                  
                  <div className="wishlist-item-details">
                    <h4 className="wishlist-item-title">{item.titulo}</h4>
                    <p className="wishlist-item-price">
                      ${item.precio.toLocaleString()}
                    </p>
                    <p className="wishlist-item-stock">
                      {item.stock > 0 ? `Stock: ${item.stock}` : 'Sin stock'}
                    </p>
                  </div>
                  
                  <div className="wishlist-item-actions">
                    <button 
                      className={`wishlist-add-to-cart ${item.stock === 0 ? 'disabled' : ''}`}
                      onClick={() => handleAddToCart(item.id)}
                      disabled={item.stock === 0}
                      title={item.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
                    >
                      🛒
                    </button>
                    
                    <button 
                      className="wishlist-item-remove"
                      onClick={() => removeFromWishlist(item.id)}
                      aria-label="Eliminar de favoritos"
                      title="Eliminar de favoritos"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {wishlistItems.length > 0 && (
            <div className="wishlist-footer">
              <div className="wishlist-actions">
                <button 
                  className="wishlist-buy-all"
                  onClick={handleBuyAll}
                  title="Agregar todos los productos disponibles al carrito"
                >
                  🛒 Comprar todo
                </button>
                
                <button 
                  className="wishlist-clear"
                  onClick={clearWishlist}
                  title="Vaciar lista de favoritos"
                >
                  🗑️ Limpiar lista
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Overlay para cerrar la wishlist al hacer clic fuera */}
      {isOpen && (
        <div 
          className="wishlist-overlay" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <style jsx>{`
        .wishlist-icon {
          position: relative;
          cursor: pointer;
          font-size: 1.5rem;
          padding: 0.5rem;
          border-radius: 50%;
          background: #f8f9fa;
          transition: background 0.2s ease;
        }
        
        .wishlist-icon:hover {
          background: #ffe6e6;
        }
        
        .wishlist-badge {
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
        
        .wishlist-dropdown {
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
        
        .wishlist-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid #eee;
          background: #fff5f5;
        }
        
        .wishlist-header h3 {
          margin: 0;
          font-size: 1.1rem;
          color: #dc3545;
        }
        
        .wishlist-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
        }
        
        .wishlist-items {
          max-height: 400px;
          overflow-y: auto;
        }
        
        .wishlist-empty {
          text-align: center;
          padding: 2rem;
          color: #666;
        }
        
        .wishlist-item {
          display: grid;
          grid-template-columns: 60px 1fr auto;
          gap: 1rem;
          padding: 1rem;
          border-bottom: 1px solid #eee;
          align-items: center;
        }
        
        .wishlist-item:hover {
          background: #fff9f9;
        }
        
        .wishlist-item-image img {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 4px;
        }
        
        .wishlist-item-title {
          font-size: 0.9rem;
          margin: 0 0 0.25rem 0;
          font-weight: 600;
        }
        
        .wishlist-item-price {
          font-size: 0.8rem;
          color: #28a745;
          margin: 0 0 0.25rem 0;
          font-weight: 600;
        }
        
        .wishlist-item-stock {
          font-size: 0.75rem;
          color: #666;
          margin: 0;
        }
        
        .wishlist-item-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .wishlist-add-to-cart, .wishlist-item-remove {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .wishlist-add-to-cart {
          background: #28a745;
          color: white;
        }
        
        .wishlist-add-to-cart:hover:not(.disabled) {
          background: #218838;
        }
        
        .wishlist-add-to-cart.disabled {
          background: #6c757d;
          cursor: not-allowed;
          opacity: 0.6;
        }
        
        .wishlist-item-remove {
          background: #dc3545;
          color: white;
        }
        
        .wishlist-item-remove:hover {
          background: #c82333;
        }
        
        .wishlist-footer {
          padding: 1rem;
          border-top: 1px solid #eee;
          background: #fff5f5;
        }
        
        .wishlist-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .wishlist-buy-all, .wishlist-clear {
          flex: 1;
          padding: 0.75rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
        }
        
        .wishlist-buy-all {
          background: #28a745;
          color: white;
        }
        
        .wishlist-clear {
          background: #6c757d;
          color: white;
        }
        
        .wishlist-buy-all:hover {
          background: #218838;
        }
        
        .wishlist-clear:hover {
          background: #5a6268;
        }
        
        .wishlist-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.1);
          z-index: 999;
        }
        
        @media (max-width: 768px) {
          .wishlist-dropdown {
            width: 350px;
          }
          
          .wishlist-item {
            grid-template-columns: 50px 1fr auto;
            gap: 0.5rem;
          }
        }
      `}</style>
    </>
  );
};

export default WishlistDropdown;