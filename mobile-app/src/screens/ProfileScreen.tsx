import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientView from '../components/GradientView';
import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../constants/config';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      Alert.alert('Sesión requerida', 'Debes iniciar sesión para ver tu perfil');
      navigation.navigate('Auth', { screen: 'Login' });
    }
  }, [user, navigation]);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesi\u00f3n',
      '\u00bfEst\u00e1s seguro que deseas salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Salir', style: 'destructive', onPress: logout }
      ]
    );
  };

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Editar Perfil',
      subtitle: 'Actualiza tu informaci\u00f3n',
      onPress: () => Alert.alert('Pr\u00f3ximamente', 'Funci\u00f3n en desarrollo')
    },
    {
      icon: 'storefront-outline',
      title: 'Mis Ventas',
      subtitle: 'Productos que has publicado',
      onPress: () => navigation.navigate('MySales')
    },
    {
      icon: 'cart-outline',
      title: 'Mis Compras',
      subtitle: 'Historial de pedidos',
      onPress: () => navigation.navigate('PurchaseHistory')
    },
    {
      icon: 'heart-outline',
      title: 'Favoritos',
      subtitle: 'Productos guardados',
      onPress: () => navigation.navigate('Wishlist')
    },
    {
      icon: 'settings-outline',
      title: 'Configuraci\u00f3n',
      subtitle: 'Preferencias de la app',
      onPress: () => Alert.alert('Pr\u00f3ximamente', 'Funci\u00f3n en desarrollo')
    },
    {
      icon: 'help-circle-outline',
      title: 'Ayuda y Soporte',
      subtitle: 'Preguntas frecuentes',
      onPress: () => Alert.alert('Pr\u00f3ximamente', 'Funci\u00f3n en desarrollo')
    },
  ];

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={true}
    >
      {/* Header con gradiente */}
      <GradientView
        colors={[COLORS.primary, COLORS.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={48} color="#fff" />
        </View>
        <Text style={styles.userName}>{user?.nombre || 'Usuario'}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </GradientView>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconContainer}>
              <Ionicons name={item.icon as any} size={24} color={COLORS.primary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#f44336" />
        <Text style={styles.logoutText}>Cerrar Sesi\u00f3n</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Versi\u00f3n 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 40,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  menuContainer: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f44336',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f44336',
    marginLeft: 8,
  },
  version: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginBottom: 40,
  },
});
