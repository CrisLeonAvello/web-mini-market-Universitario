import React, { createContext, useContext, useEffect, useState } from 'react';
import { useProducts } from './ProductsContext';

const CartContext = createContext();

export function useCart() { 
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { allProducts: products } = useProducts();

  // Log para debug
  console.log('🛒 CartProvider: products disponibles:', {
    products: products ? `${products.length} productos` : 'undefined',
    isArray: Array.isArray(products)
  });

  // Función para verificar y limpiar carrito corrupto
  const verifyAndCleanCart = (storedCart) => {
    console.log('🔍 Verificando carrito almacenado:', storedCart);
    
    // Verificar si hay items con estructura incorrecta
    const hasCorruptData = storedCart.some(item => 
      !item || 
      typeof item.id !== 'string' || 
      typeof item.quantity !== 'number' ||
      item.titulo // Si tiene titulo, se guardó el objeto completo
    );
    
    if (hasCorruptData) {
      console.warn('⚠️ Carrito corrupto detectado, limpiando...');
      const cleanedCart = storedCart.filter(item => {
        return item && 
               typeof item.id === 'string' && 
               typeof item.quantity === 'number' &&
               item.quantity > 0 &&
               !item.titulo;
      });
      
      console.log('✅ Carrito limpiado:', cleanedCart);
      return cleanedCart;
    } else {
      console.log('✅ Carrito verificado correctamente');
      return storedCart;
    }
  };

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('cart') || '[]');
      const cleanedCart = verifyAndCleanCart(Array.isArray(stored) ? stored : []);
      setCart(cleanedCart);
    } catch (e) { 
      console.error('Error cargando carrito:', e);
      setCart([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  function addToCart(id, quantity = 1) {
    console.log(`🛒 Agregando al carrito: ${id}, cantidad: ${quantity}`);
    setCart(prev => {
      const found = prev.find(i => i.id === id);
      if (found) {
        console.log('Producto ya existe, incrementando cantidad');
        return prev.map(i => i.id === id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      console.log('Producto nuevo agregado');
      return [...prev, { id, quantity }];
    });
  }

  function removeFromCart(id) { 
    console.log(`🗑️ Removiendo del carrito: ${id}`);
    setCart(prev => prev.filter(i => i.id !== id));
  }

  function updateQuantity(id, qty) { 
    if (qty <= 0) {
      removeFromCart(id);
    } else {
      console.log(`📝 Actualizando cantidad: ${id} -> ${qty}`);
      setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
    }
  }

  function clearCart() { 
    console.log('🔥 Limpiando carrito completo');
    setCart([]);
  }

  function getCartTotal(products) {
    return cart.reduce((total, item) => {
      const product = products.find(p => p.id === item.id);
      return total + (product ? product.precio * item.quantity : 0);
    }, 0);
  }

  // Función para obtener el total usando los productos del contexto
  function getTotalPrice() {
    // Verificación de seguridad: si no hay productos disponibles, devolver 0
    if (!products || !Array.isArray(products)) {
      console.warn('⚠️ CartContext: products no disponible para calcular total');
      return 0;
    }
    
    return cart.reduce((total, item) => {
      const product = products.find(p => p.id.toString() === item.id.toString());
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  }

  // Función para obtener los items del carrito con datos completos de productos
  function cartItems() {
    // Verificación de seguridad: si no hay productos disponibles, devolver array vacío
    if (!products || !Array.isArray(products)) {
      console.warn('⚠️ CartContext: products no disponible aún, devolviendo array vacío');
      return [];
    }
    
    return cart.map(cartItem => {
      const product = products.find(p => p.id.toString() === cartItem.id.toString());
      if (!product) {
        console.warn(`⚠️ CartContext: Producto no encontrado para ID ${cartItem.id}`);
      }
      return {
        ...cartItem,
        ...product,
        cartQuantity: cartItem.quantity
      };
    }).filter(item => item.id); // Filtrar items sin producto válido
  }

  function getCartItemsCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  // Debug functions
  const debugCart = () => {
    console.log('=== DEBUG CARRITO ===');
    console.log('Items en carrito:', cart.length);
    cart.forEach((item, index) => {
      console.log(`${index + 1}. ID: ${item.id}, Cantidad: ${item.quantity}`);
    });
    return cart;
  };

  const resetCart = () => {
    console.log('🔥 RESETEANDO CARRITO COMPLETAMENTE');
    localStorage.removeItem('cart');
    setCart([]);
    return [];
  };

  return (
    <CartContext.Provider value={{
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      getCartTotal,
      getTotalPrice,
      cartItems: cartItems(),
      getCartItemsCount,
      debugCart,
      resetCart
    }}>
      {children}
    </CartContext.Provider>
  );
}
