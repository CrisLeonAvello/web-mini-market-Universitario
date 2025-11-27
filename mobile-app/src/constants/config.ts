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
  ORDERS: '/ventas',
  MY_ORDERS: '/ventas/mis-compras',
  MY_SALES: '/ventas/mis-ventas',
};

export const COLORS = {
  // Brand Colors
  primary: '#a855f7',
  primaryDark: '#7c3aed',
  primaryLight: '#c084fc',
  secondary: '#ff6b35',
  secondaryDark: '#dc2626',
  accent: '#3b82f6',
  accentDark: '#2563eb',
  
  // Background Colors
  background: '#0a0e27',
  backgroundDark: '#030213',
  surface: '#1a1f3a',
  surfaceLight: '#1e293b',
  surfaceHover: '#2d3548',
  card: '#1a1f3a',
  
  // Text Colors
  text: '#ffffff',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  textDisabled: '#475569',
  
  // Status Colors
  success: '#10b981',
  successDark: '#059669',
  error: '#ef4444',
  errorDark: '#dc2626',
  danger: '#ef4444',
  dangerDark: '#dc2626',
  warning: '#f59e0b',
  warningDark: '#d97706',
  info: '#3b82f6',
  infoDark: '#2563eb',
  
  // Utility Colors
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
  
  // Borders & Dividers
  border: 'rgba(255, 255, 255, 0.1)',
  borderLight: 'rgba(255, 255, 255, 0.05)',
  borderDark: 'rgba(255, 255, 255, 0.15)',
  divider: 'rgba(255, 255, 255, 0.08)',
  
  // Overlay & Shadow
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowPrimary: 'rgba(168, 85, 247, 0.4)',
  
  // Input Colors
  inputBackground: 'rgba(30, 41, 59, 0.5)',
  inputBorder: 'rgba(255, 255, 255, 0.1)',
  inputFocus: '#a855f7',
};

export const GRADIENTS = {
  primary: ['#a855f7', '#7c3aed'] as const,
  secondary: ['#ff6b35', '#dc2626'] as const,
  accent: ['#3b82f6', '#2563eb'] as const,
  success: ['#10b981', '#059669'] as const,
  dark: ['#1a1f3a', '#0a0e27'] as const,
  overlay: ['transparent', 'rgba(0, 0, 0, 0.7)'] as const,
};

export const CATEGORIES = ['Electrónica', 'Libros', 'Ropa', 'Accesorios', 'Hogar', 'Deportes'];
