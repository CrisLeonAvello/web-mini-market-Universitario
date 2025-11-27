import { apiRequest } from './api';
import { ENDPOINTS } from '../constants/config';

export interface WishlistItem {
  id_favorito: number;
  usuario_id: number;
  producto_id: number;
  fecha_agregado: string;
  producto: any;
}

// Obtener favoritos del usuario
export const getWishlist = async (): Promise<WishlistItem[]> => {
  const response = await apiRequest(`${ENDPOINTS.FAVORITES}/me`, {
    method: 'GET',
  });
  return response.favoritos || response;
};

// Agregar producto a favoritos
export const addToWishlist = async (productId: number): Promise<WishlistItem> => {
  return await apiRequest(ENDPOINTS.FAVORITES, {
    method: 'POST',
    data: {
      producto_id: productId,
    },
  });
};

// Eliminar producto de favoritos
export const removeFromWishlist = async (favoritoId: number): Promise<void> => {
  return await apiRequest(`${ENDPOINTS.FAVORITES}/${favoritoId}`, {
    method: 'DELETE',
  });
};

// Verificar si un producto está en favoritos
export const isInWishlist = async (productId: number): Promise<boolean> => {
  try {
    const wishlist = await getWishlist();
    return wishlist.some((item: WishlistItem) => item.producto_id === productId);
  } catch (error) {
    return false;
  }
};

export const wishlistService = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
};
