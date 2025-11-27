import React, { createContext, useState, useContext, useEffect } from 'react';
import { CartContextType, CartItem, Product } from '../types/types';
import * as cartService from '../services/cartService';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const cartData = await cartService.getCart();
      // Convertir los items del backend al formato del contexto
      const mappedItems = cartData.items.map(item => ({
        id: item.id_item,
        product: {
          id: item.producto.id_producto,
          titulo: item.producto.titulo,
          precio: item.precio_unitario,
          imagen_url: item.producto.imagen_url,
          categoria: item.producto.categoria,
          descripcion: item.producto.descripcion,
          stock: item.producto.stock,
        },
        quantity: item.cantidad,
      }));
      setItems(mappedItems);
      setTotal(cartData.total);
      setItemCount(cartData.total_productos);
    } catch (error) {
      console.error('Error loading cart:', error);
      // Si falla, mantener carrito vacío
      setItems([]);
      setTotal(0);
      setItemCount(0);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (product: Product, quantity: number) => {
    try {
      setLoading(true);
      await cartService.addToCart({
        producto_id: product.id,
        cantidad: quantity,
      });
      // Recargar el carrito desde el backend
      await loadCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId: number) => {
    try {
      setLoading(true);
      // Buscar el item_id del producto
      const item = items.find(i => i.product.id === productId);
      if (item) {
        await cartService.removeFromCart(item.id);
        await loadCart();
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(productId);
      return;
    }
    try {
      setLoading(true);
      const item = items.find(i => i.product.id === productId);
      if (item) {
        await cartService.updateCartItem(item.id, { cantidad: quantity });
        await loadCart();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await cartService.clearCart();
      setItems([]);
      setTotal(0);
      setItemCount(0);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: Product, quantity: number = 1) => {
    await addItem(product, quantity);
  };

  const removeFromCart = async (productId: number) => {
    await removeItem(productId);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        addToCart,
        removeItem,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        itemCount,
        loading,
        refreshCart: loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
