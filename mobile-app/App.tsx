import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { CartProvider } from './src/contexts/CartContext';
import { ProductsProvider } from './src/contexts/ProductsContext';
import { WishlistProvider } from './src/contexts/WishlistContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <CartProvider>
          <WishlistProvider>
            <AppNavigator />
            <StatusBar style="light" />
          </WishlistProvider>
        </CartProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}
