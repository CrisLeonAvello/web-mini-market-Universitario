import React, { useState } from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import { useProducts } from '../contexts/ProductsContext';
import { useCart } from '../contexts/CartContext';

export default function WishlistModal() {
  const { items: wishlistItems, toggle, clearWishlist } = useWishlist();
  const { allProducts } = useProducts();
  const { addToCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  // Obtener productos completos del wishlist
  const wishlistProducts = allProducts.filter(product => 
    wishlistItems.includes(product.id)
  );

  const addAllToCart = () => {
    wishlistProducts.forEach(product => {
      addToCart(product.id);
    });
    alert(`${wishlistProducts.length} productos agregados al carrito`);
  };

  return (
    <>
      <button 
        className="nav-btn" 
        onClick={() => setIsOpen(true)}
        style={{ position: 'relative' }}
      >
        ❤️ Favoritos
        {wishlistItems.length > 0 && (
          <span style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            background: '#ff4757',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {wishlistItems.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              borderBottom: '1px solid #eee',
              paddingBottom: '10px'
            }}>
              <h2>❤️ Lista de Favoritos</h2>
              <button 
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>

            {wishlistProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>💔</div>
                <h3>No tienes favoritos aún</h3>
                <p>Agrega productos a tu lista de favoritos haciendo clic en el corazón</p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '20px' }}>
                  {wishlistProducts.map(product => (
                    <div key={product.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      padding: '15px',
                      border: '1px solid #eee',
                      borderRadius: '8px',
                      marginBottom: '10px'
                    }}>
                      <img 
                        src={product.image} 
                        alt={product.title}
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'cover',
                          borderRadius: '6px'
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
                          {product.title}
                        </h4>
                        <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '12px' }}>
                          {product.category}
                        </p>
                        <p style={{ margin: 0, color: '#4285f4', fontWeight: 'bold' }}>
                          ${product.price?.toLocaleString()}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          onClick={() => addToCart(product.id)}
                          style={{
                            background: '#4285f4',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px 12px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          🛒 Agregar
                        </button>
                        <button 
                          onClick={() => toggle(product.id)}
                          style={{
                            background: '#ff4757',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px 12px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          💔 Quitar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{
                  borderTop: '2px solid #eee',
                  paddingTop: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h3 style={{ margin: 0 }}>
                      {wishlistProducts.length} productos favoritos
                    </h3>
                    <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
                      Total: ${wishlistProducts.reduce((total, product) => total + product.price, 0).toLocaleString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={clearWishlist}
                      style={{
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '10px 20px',
                        cursor: 'pointer'
                      }}
                    >
                      Limpiar todo
                    </button>
                    <button 
                      onClick={addAllToCart}
                      style={{
                        background: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        fontSize: '16px'
                      }}
                    >
                      🛒 Agregar todo al carrito
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}