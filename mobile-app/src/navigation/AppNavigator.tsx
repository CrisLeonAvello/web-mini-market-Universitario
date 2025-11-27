import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../constants/config';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ProductsScreen from '../screens/ProductsScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SellScreen from '../screens/SellScreen';
import MySalesScreen from '../screens/MySalesScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import EditProductScreen from '../screens/EditProductScreen';
import WishlistScreen from '../screens/WishlistScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import PurchaseHistoryScreen from '../screens/PurchaseHistoryScreen';
import SearchScreen from '../screens/SearchScreen';
import AboutScreen from '../screens/AboutScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tabs principales (públicos y privados mezclados)
const MainTabs = () => {
  const { user } = useAuth();
  
  return (
    <Tab.Navigator 
      screenOptions={{ 
        tabBarActiveTintColor: COLORS.primary, 
        tabBarStyle: { backgroundColor: COLORS.surface },
        headerShown: false
      }}
    >
      <Tab.Screen 
        name='Home' 
        component={HomeScreen} 
        options={{ 
          title: 'Inicio', 
          tabBarIcon: ({ color, size }) => <Ionicons name='home' size={size} color={color} /> 
        }} 
      />
      <Tab.Screen 
        name='Sell' 
        component={SellScreen} 
        options={{ 
          title: 'Vender', 
          tabBarIcon: ({ color, size }) => <Ionicons name='add-circle' size={size} color={color} /> 
        }} 
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!user) {
              e.preventDefault();
              navigation.navigate('Auth', { screen: 'Login' });
            }
          },
        })}
      />
      <Tab.Screen 
        name='Cart' 
        component={CartScreen} 
        options={{ 
          title: 'Carrito', 
          tabBarIcon: ({ color, size }) => <Ionicons name='cart' size={size} color={color} /> 
        }} 
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!user) {
              e.preventDefault();
              navigation.navigate('Auth', { screen: 'Login' });
            }
          },
        })}
      />
      <Tab.Screen 
        name='Profile' 
        component={ProfileScreen} 
        options={{ 
          title: user ? 'Perfil' : 'Ingresar',
          tabBarIcon: ({ color, size }) => <Ionicons name='person' size={size} color={color} /> 
        }} 
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!user) {
              e.preventDefault();
              navigation.navigate('Auth', { screen: 'Login' });
            }
          },
        })}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { loading } = useAuth();
  
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 16, fontSize: 16, color: COLORS.text }}>Cargando...</Text>
      </View>
    );
  }
  
  return (
    <NavigationContainer
      theme={{
        dark: false,
        colors: {
          primary: COLORS.primary,
          background: '#0a0e27',
          card: '#1e293b',
          text: '#fff',
          border: 'rgba(255, 255, 255, 0.1)',
          notification: COLORS.secondary,
        },
        fonts: {
          regular: {
            fontFamily: 'System',
            fontWeight: '400',
          },
          medium: {
            fontFamily: 'System',
            fontWeight: '500',
          },
          bold: {
            fontFamily: 'System',
            fontWeight: '700',
          },
          heavy: {
            fontFamily: 'System',
            fontWeight: '900',
          },
        },
      }}
    >
      <Stack.Navigator 
        screenOptions={{ 
          headerStyle: { backgroundColor: COLORS.primary }, 
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
        initialRouteName='MainTabs'
      >
        {/* Tabs principales como pantalla inicial */}
        <Stack.Screen 
          name='MainTabs' 
          component={MainTabs} 
          options={{ headerShown: false }} 
        />
        
        {/* Stack de autenticación */}
        <Stack.Screen 
          name='Auth'
          options={{ headerShown: false }}
        >
          {() => (
            <Stack.Navigator
              screenOptions={{ 
                headerStyle: { backgroundColor: COLORS.primary }, 
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' }
              }}
            >
              <Stack.Screen 
                name='Login' 
                component={LoginScreen} 
                options={{ headerShown: false }} 
              />
              <Stack.Screen 
                name='Register' 
                component={RegisterScreen} 
                options={{ title: 'Crear Cuenta' }} 
              />
            </Stack.Navigator>
          )}
        </Stack.Screen>

        {/* MySales Screen */}
        <Stack.Screen 
          name='MySales' 
          component={MySalesScreen} 
          options={{ headerShown: false }} 
        />

        {/* ProductDetail Screen */}
        <Stack.Screen 
          name='ProductDetail' 
          component={ProductDetailScreen} 
          options={{ headerShown: false }} 
        />

        {/* EditProduct Screen */}
        <Stack.Screen 
          name='EditProduct' 
          component={EditProductScreen} 
          options={{ headerShown: false }} 
        />

        {/* Wishlist Screen */}
        <Stack.Screen 
          name='Wishlist' 
          component={WishlistScreen} 
          options={{ headerShown: false }} 
        />

        {/* Checkout Screen */}
        <Stack.Screen 
          name='Checkout' 
          component={CheckoutScreen} 
          options={{ headerShown: false }} 
        />

        {/* Purchase History Screen */}
        <Stack.Screen 
          name='PurchaseHistory' 
          component={PurchaseHistoryScreen} 
          options={{ headerShown: false }} 
        />

        {/* Search Screen */}
        <Stack.Screen 
          name='Search' 
          component={SearchScreen} 
          options={{ headerShown: false }} 
        />

        {/* About Screen */}
        <Stack.Screen 
          name='About' 
          component={AboutScreen} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
