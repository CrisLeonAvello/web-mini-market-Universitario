import React, { createContext, useContext, useEffect, useState } from 'react';

const WishlistContext = createContext();

export function useWishlist() { 
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist debe ser usado dentro de un WishlistProvider');
  }
  return context;
}

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlist(Array.isArray(stored) ? stored : []);
    } catch (e) { 
      console.error('Error cargando wishlist:', e);
      setWishlist([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (productId) => {
    console.log(`❤️ Agregando a favoritos: ${productId}`);
    setWishlist(prev => {
      if (!prev.includes(productId)) {
        return [...prev, productId];
      }
      return prev;
    });
  };

  const removeFromWishlist = (productId) => {
    console.log(`💔 Removiendo de favoritos: ${productId}`);
    setWishlist(prev => prev.filter(id => id !== productId));
  };

  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      removeFromWishlist(productId);
      return false;
    } else {
      addToWishlist(productId);
      return true;
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  const clearWishlist = () => {
    console.log('🔥 Limpiando wishlist completa');
    setWishlist([]);
  };

  const getWishlistCount = () => {
    return wishlist.length;
  };

  // Función para comprar todos los productos de la wishlist
  const buyAllWishlist = (products, addToCartFunction) => {
    if (wishlist.length === 0) {
      return { success: false, message: 'No hay productos en tu lista de favoritos' };
    }
    
    let totalItems = 0;
    let outOfStockItems = 0;
    
    wishlist.forEach(productId => {
      const product = products.find(p => p.id === productId);
      if (product) {
        if (product.stock > 0) {
          addToCartFunction(productId, 1);
          totalItems++;
        } else {
          outOfStockItems++;
        }
      }
    });
    
    let message = '';
    if (totalItems > 0) {
      message += `✅ ${totalItems} producto${totalItems > 1 ? 's' : ''} agregado${totalItems > 1 ? 's' : ''} al carrito`;
    }
    if (outOfStockItems > 0) {
      if (message) message += '. ';
      message += `⚠️ ${outOfStockItems} producto${outOfStockItems > 1 ? 's' : ''} sin stock`;
    }
    
    return { 
      success: totalItems > 0, 
      message,
      totalItems,
      outOfStockItems
    };
  };

  // Mantener compatibilidad con API anterior
  const toggle = toggleWishlist;
  const clear = clearWishlist;
  const items = wishlist;

  return (
    <WishlistContext.Provider value={{
      wishlist,
      items, // compatibilidad
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      toggle, // compatibilidad
      isInWishlist,
      clearWishlist,
      clear, // compatibilidad
      getWishlistCount,
      buyAllWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}
