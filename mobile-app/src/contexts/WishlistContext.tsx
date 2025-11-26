import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WishlistContextType {
  wishlist: number[];
  addToWishlist: (productId: number) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  toggleWishlist: (productId: number) => Promise<boolean>;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => Promise<void>;
  getWishlistCount: () => number;
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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const stored = await AsyncStorage.getItem('wishlist');
      if (stored) {
        const parsed = JSON.parse(stored);
        setWishlist(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Error cargando wishlist:', error);
      setWishlist([]);
    } finally {
      setLoaded(true);
    }
  };

  const saveWishlist = async (newWishlist: number[]) => {
    try {
      await AsyncStorage.setItem('wishlist', JSON.stringify(newWishlist));
    } catch (error) {
      console.error('Error guardando wishlist:', error);
    }
  };

  const addToWishlist = async (productId: number) => {
    const newWishlist = [...wishlist];
    if (!newWishlist.includes(productId)) {
      newWishlist.push(productId);
      setWishlist(newWishlist);
      await saveWishlist(newWishlist);
      console.log(`❤️ Agregado a favoritos: ${productId}`);
    }
  };

  const removeFromWishlist = async (productId: number) => {
    const newWishlist = wishlist.filter((id) => id !== productId);
    setWishlist(newWishlist);
    await saveWishlist(newWishlist);
    console.log(`💔 Removido de favoritos: ${productId}`);
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
    setWishlist([]);
    await saveWishlist([]);
    console.log('🔥 Wishlist limpiada');
  };

  const getWishlistCount = (): number => {
    return wishlist.length;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        getWishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
