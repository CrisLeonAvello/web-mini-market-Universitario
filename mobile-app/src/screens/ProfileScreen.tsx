import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { COLORS, GRADIENTS } from '../constants/config';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  
  const stats = {
    sales: 0,
    purchases: 0,
    reviews: 0,
    rating: 0,
  };

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
      showsVerticalScrollIndicator={false}
    >
      {/* Header con gradiente */}
      <LinearGradient
        colors={GRADIENTS.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.avatarWrapper}>
          <Avatar
            name={user?.nombre || 'Usuario'}
            size={100}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editAvatarButton}>
            <Ionicons name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{user?.nombre || 'Usuario'}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </LinearGradient>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <Card variant="elevated" style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="cart" size={24} color={COLORS.primary} />
          </View>
          <Text style={styles.statValue}>{stats.purchases}</Text>
          <Text style={styles.statLabel}>Compras</Text>
        </Card>

        <Card variant="elevated" style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="storefront" size={24} color={COLORS.secondary} />
          </View>
          <Text style={styles.statValue}>{stats.sales}</Text>
          <Text style={styles.statLabel}>Ventas</Text>
        </Card>

        <Card variant="elevated" style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="star" size={24} color={COLORS.warning} />
          </View>
          <Text style={styles.statValue}>{stats.rating.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </Card>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Mi Cuenta</Text>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <Card variant="elevated" style={styles.menuItem}>
              <LinearGradient
                colors={[
                  `${COLORS.primary}20`,
                  `${COLORS.primary}05`,
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.menuIconContainer}
              >
                <Ionicons name={item.icon as any} size={24} color={COLORS.primary} />
              </LinearGradient>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={COLORS.textMuted} />
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <Button
          onPress={handleLogout}
          variant="outline"
          fullWidth
          style={styles.logoutButton}
        >
          <View style={styles.logoutContent}>
            <Ionicons name="log-out-outline" size={22} color={COLORS.danger} />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </View>
        </Button>
      </View>

      <Text style={styles.version}>StudiMarket v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 32,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 15,
    color: '#fff',
    opacity: 0.95,
    marginBottom: 12,
  },
  roleBadge: {
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: -30,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  menuContainer: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
  },
  menuIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 3,
  },
  menuSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  logoutContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  logoutButton: {
    borderColor: COLORS.danger,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.danger,
  },
  version: {
    textAlign: 'center',
    color: COLORS.textMuted,
    fontSize: 12,
    marginBottom: 40,
    fontWeight: '500',
  },
});
