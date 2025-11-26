import { Platform } from 'react-native';

export const API_BASE_URL = Platform.select({
  ios: 'http://localhost:8000/api',
  android: 'http://10.0.2.2:8000/api',
  web: 'http://localhost:8000/api',
  default: 'http://localhost:8000/api'
});

export const ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  ME: '/users/me',
  PRODUCTS: '/productos',
  MY_PRODUCTS: '/productos/mis-productos',
  CART: '/carrito',
  FAVORITES: '/favoritos',
};

export const COLORS = {
  primary: '#a855f7',
  secondary: '#7c3aed',
  background: '#f5f5f5',
  surface: '#ffffff',
  text: '#333333',
  textSecondary: '#666666',
  success: '#10b981',
  error: '#ef4444',
  white: '#ffffff',
  black: '#000000',
};

export const CATEGORIES = ['Electrónica', 'Libros', 'Ropa', 'Accesorios', 'Hogar', 'Deportes'];
