import { apiRequest } from './api';
import { ENDPOINTS } from '../constants/config';

export interface CartItem {
  id_item: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  producto: any;
}

export interface Cart {
  id_carrito: number;
  usuario_id: number;
  items: CartItem[];
  subtotal: number;
  impuesto: number;
  envio: number;
  total: number;
  total_items: number;
  total_productos: number;
}

export interface AddToCartData {
  producto_id: number;
  cantidad: number;
}

export interface UpdateCartItemData {
  cantidad: number;
}

export interface CheckoutData {
  metodo_pago: string;
  direccion_envio: string;
  telefono_contacto: string;
  notas?: string;
}

// Obtener carrito del usuario
export const getCart = async (): Promise<Cart> => {
  return await apiRequest(ENDPOINTS.CART, {
    method: 'GET',
  });
};

// Agregar producto al carrito
export const addToCart = async (data: AddToCartData): Promise<CartItem> => {
  return await apiRequest(`${ENDPOINTS.CART}/items`, {
    method: 'POST',
    data,
  });
};

// Actualizar cantidad de un item
export const updateCartItem = async (itemId: number, data: UpdateCartItemData): Promise<CartItem> => {
  return await apiRequest(`${ENDPOINTS.CART}/items/${itemId}`, {
    method: 'PUT',
    data,
  });
};

// Eliminar item del carrito
export const removeFromCart = async (itemId: number): Promise<void> => {
  return await apiRequest(`${ENDPOINTS.CART}/items/${itemId}`, {
    method: 'DELETE',
  });
};

// Limpiar carrito completo
export const clearCart = async (): Promise<void> => {
  return await apiRequest(`${ENDPOINTS.CART}/clear`, {
    method: 'DELETE',
  });
};

// Realizar checkout
export const checkout = async (data: CheckoutData): Promise<any> => {
  return await apiRequest(`${ENDPOINTS.CART}/checkout`, {
    method: 'POST',
    data,
  });
};

export const cartService = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  checkout,
};
