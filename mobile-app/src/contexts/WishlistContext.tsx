import React, { createContext, useContext, useEffect, useState } from 'react';
import * as wishlistService from '../services/wishlistService';

interface WishlistContextType {
  wishlist: number[];
  wishlistItems: any[];
  loading: boolean;
  addToWishlist: (productId: number) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  toggleWishlist: (productId: number) => Promise<boolean>;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => Promise<void>;
  getWishlistCount: () => number;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist debe ser usado dentro de un WishlistProvider');
  }
  return context;
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const items = await wishlistService.getWishlist();
      setWishlistItems(items);
      // Extraer solo los IDs de productos
      const productIds = items.map((item: any) => item.producto_id);
      setWishlist(productIds);
      console.log('❤️ Wishlist cargada:', productIds.length, 'items');
    } catch (error) {
      console.error('Error cargando wishlist:', error);
      setWishlist([]);
      setWishlistItems([]);
    } finally {
      setLoaded(true);
      setLoading(false);
    }
  };

  const addToWishlist = async (productId: number) => {
    try {
      setLoading(true);
      await wishlistService.addToWishlist(productId);
      // Recargar wishlist desde el backend
      await loadWishlist();
      console.log(`❤️ Agregado a favoritos: ${productId}`);
    } catch (error) {
      console.error('Error agregando a wishlist:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: number) => {
    try {
      setLoading(true);
      // Buscar el favorito_id del producto
      const item = wishlistItems.find((i: any) => i.producto_id === productId);
      if (item) {
        await wishlistService.removeFromWishlist(item.id_favorito);
        await loadWishlist();
        console.log(`💔 Removido de favoritos: ${productId}`);
      }
    } catch (error) {
      console.error('Error removiendo de wishlist:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (productId: number): Promise<boolean> => {
    if (wishlist.includes(productId)) {
      await removeFromWishlist(productId);
      return false;
    } else {
      await addToWishlist(productId);
      return true;
    }
  };

  const isInWishlist = (productId: number): boolean => {
    return wishlist.includes(productId);
  };

  const clearWishlist = async () => {
    try {
      setLoading(true);
      // Eliminar todos los favoritos uno por uno
      for (const item of wishlistItems) {
        await wishlistService.removeFromWishlist(item.id_favorito);
      }
      setWishlist([]);
      setWishlistItems([]);
      console.log('🔥 Wishlist limpiada');
    } catch (error) {
      console.error('Error limpiando wishlist:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getWishlistCount = (): number => {
    return wishlist.length;
  };

  const refreshWishlist = async () => {
    await loadWishlist();
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistItems,
        loading,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        getWishlistCount,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
