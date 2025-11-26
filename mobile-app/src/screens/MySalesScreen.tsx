import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getMyProducts, deleteProduct, toggleProductStatus } from '../services/productService';
import GradientView from '../components/GradientView';

interface Product {
  id: number;
  titulo: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  categoria: string;
  image: string;
  condicion: string;
  estado: string;
  created_at: string;
}

export default function MySalesScreen({ navigation }: any) {
  const [productos, setProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [])
  );

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getMyProducts();
      console.log('📦 Mis productos:', data);
      setProductos(data);
    } catch (err: any) {
      console.error('❌ Error al cargar productos:', err);
      setError('Error al cargar tus productos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  const handleDelete = (productId: number, productTitle: string) => {
    Alert.alert(
      'Eliminar Producto',
      `¿Estás seguro de que deseas eliminar "${productTitle}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProduct(productId);
              Alert.alert('Éxito', 'Producto eliminado correctamente');
              loadProducts();
            } catch (err) {
              Alert.alert('Error', 'No se pudo eliminar el producto');
            }
          },
        },
      ]
    );
  };

  const handleToggleStatus = async (productId: number, currentStatus: string) => {
    try {
      await toggleProductStatus(productId);
      Alert.alert(
        'Éxito',
        currentStatus === 'pausado' ? 'Producto reactivado' : 'Producto pausado'
      );
      loadProducts();
    } catch (err) {
      Alert.alert('Error', 'No se pudo cambiar el estado del producto');
    }
  };

  const getStatusBadge = (estado: string) => {
    const badges: { [key: string]: { text: string; color: string; bg: string } } = {
      disponible: { text: 'Disponible', color: '#10b981', bg: '#d1fae5' },
      pausado: { text: 'Pausado', color: '#f59e0b', bg: '#fef3c7' },
      vendido: { text: 'Vendido', color: '#3b82f6', bg: '#dbeafe' },
      eliminado: { text: 'Eliminado', color: '#ef4444', bg: '#fee2e2' },
    };
    return badges[estado] || badges.disponible;
  };

  const renderStats = () => {
    const disponibles = productos.filter((p) => p.estado === 'disponible').length;
    const totalStock = productos.reduce((acc, p) => acc + p.stock, 0);
    const valorInventario = productos.reduce((acc, p) => acc + p.price * p.stock, 0);

    return (
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>📊 Resumen</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{productos.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{disponibles}</Text>
            <Text style={styles.statLabel}>Disponibles</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalStock}</Text>
            <Text style={styles.statLabel}>Stock Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>${valorInventario.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Valor Inv.</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderProduct = (producto: Product) => {
    const badge = getStatusBadge(producto.estado);

    return (
      <View key={producto.id} style={styles.productCard}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: producto.image || 'https://placehold.co/300x300/a855f7/white' }}
            style={styles.productImage}
            resizeMode="cover"
          />
          <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.statusText, { color: badge.color }]}>{badge.text}</Text>
          </View>
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productTitle} numberOfLines={2}>
            {producto.title}
          </Text>
          <Text style={styles.productCategory}>{producto.categoria}</Text>
          <View style={styles.productDetails}>
            <Text style={styles.productPrice}>${producto.price.toLocaleString()}</Text>
            <Text style={styles.productStock}>Stock: {producto.stock}</Text>
          </View>
        </View>

        <View style={styles.productActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => navigation.navigate('EditProduct', { productId: producto.id })}
          >
            <Ionicons name="create" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.pauseButton]}
            onPress={() => handleToggleStatus(producto.id, producto.estado)}
          >
            <Ionicons
              name={producto.estado === 'pausado' ? 'play' : 'pause'}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(producto.id, producto.titulo)}
          >
            <Ionicons name="trash" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <GradientView>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#a855f7" />
          <Text style={styles.loadingText}>Cargando tus productos...</Text>
        </View>
      </GradientView>
    );
  }

  return (
    <GradientView>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>🏪 Mis Ventas</Text>
          <Text style={styles.headerSubtitle}>Gestiona tus productos</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('Sell')}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color="#ef4444" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadProducts}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : productos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>No tienes productos</Text>
            <Text style={styles.emptySubtitle}>
              Comienza publicando tu primer producto para venderlo
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate('Sell')}
            >
              <Ionicons name="add-circle" size={24} color="#fff" />
              <Text style={styles.createButtonText}>Publicar Producto</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {renderStats()}
            <View style={styles.productsContainer}>
              {productos.map((producto) => renderProduct(producto))}
            </View>
          </>
        )}
      </ScrollView>
    </GradientView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#cbd5e1',
    marginTop: 2,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#a855f7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  scrollView: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#a855f7',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 100,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#cbd5e1',
    textAlign: 'center',
    marginBottom: 32,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#a855f7',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    padding: 20,
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(168,85,247,0.3)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#a855f7',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#cbd5e1',
  },
  productsContainer: {
    padding: 20,
    gap: 16,
  },
  productCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(168,85,247,0.3)',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  productInfo: {
    padding: 16,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    color: '#cbd5e1',
    marginBottom: 12,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#a855f7',
  },
  productStock: {
    fontSize: 14,
    color: '#cbd5e1',
  },
  productActions: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  editButton: {
    backgroundColor: '#3b82f6',
  },
  pauseButton: {
    backgroundColor: '#f59e0b',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
});
