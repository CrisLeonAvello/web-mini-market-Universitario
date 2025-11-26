import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { productService } from '../services/productService';
import GradientView from '../components/GradientView';
import { useFocusEffect } from '@react-navigation/native';

interface Product {
  id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  imagen: string;
  nombre: string;
}

export default function WishlistScreen({ navigation }: any) {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadWishlistProducts();
    }, [wishlist])
  );

  const loadWishlistProducts = async () => {
    if (wishlist.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const allProducts = await productService.getAllProducts();
      const wishlistProducts = allProducts.filter((p: Product) =>
        wishlist.includes(p.id)
      );
      setProducts(wishlistProducts);
    } catch (error) {
      console.error('Error cargando productos de wishlist:', error);
      Alert.alert('Error', 'No se pudieron cargar los productos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadWishlistProducts();
  };

  const handleRemove = (productId: number, productName: string) => {
    Alert.alert(
      'Remover de favoritos',
      `¿Quieres remover "${productName}" de tus favoritos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            await removeFromWishlist(productId);
            setProducts((prev) => prev.filter((p) => p.id !== productId));
          },
        },
      ]
    );
  };

  const handleAddToCart = (product: Product) => {
    if (product.stock === 0) {
      Alert.alert('Sin stock', 'Este producto no está disponible');
      return;
    }

    const cartProduct = {
      id: product.id,
      nombre: product.titulo || product.nombre,
      precio: product.precio,
      imagen: product.imagen,
      stock: product.stock,
      categoria: product.categoria,
      descripcion: product.descripcion,
    };

    addItem(cartProduct, 1);
    Alert.alert('¡Agregado! 🛒', `${product.titulo} agregado al carrito`);
  };

  const handleAddAllToCart = () => {
    if (products.length === 0) return;

    let totalAdded = 0;
    let outOfStock = 0;

    products.forEach((product) => {
      if (product.stock > 0) {
        const cartProduct = {
          id: product.id,
          nombre: product.titulo || product.nombre,
          precio: product.precio,
          imagen: product.imagen,
          stock: product.stock,
          categoria: product.categoria,
          descripcion: product.descripcion,
        };
        addItem(cartProduct, 1);
        totalAdded++;
      } else {
        outOfStock++;
      }
    });

    let message = '';
    if (totalAdded > 0) {
      message += `✅ ${totalAdded} producto${totalAdded > 1 ? 's' : ''} agregado${
        totalAdded > 1 ? 's' : ''
      } al carrito`;
    }
    if (outOfStock > 0) {
      if (message) message += '\n';
      message += `⚠️ ${outOfStock} producto${
        outOfStock > 1 ? 's' : ''
      } sin stock`;
    }

    Alert.alert('Productos agregados', message, [
      { text: 'OK', style: 'cancel' },
      {
        text: 'Ir al carrito',
        onPress: () => navigation.navigate('MainTabs', { screen: 'Cart' }),
      },
    ]);
  };

  const handleClearAll = () => {
    Alert.alert(
      'Limpiar favoritos',
      '¿Estás seguro que quieres eliminar todos tus favoritos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpiar todo',
          style: 'destructive',
          onPress: async () => {
            await clearWishlist();
            setProducts([]);
          },
        },
      ]
    );
  };

  const getDefaultImage = (categoria: string) => {
    const placeholders: { [key: string]: string } = {
      'Electrónicos': 'https://via.placeholder.com/200x150/7c3aed/ffffff?text=Electrónicos',
      'Librería': 'https://via.placeholder.com/200x150/3b82f6/ffffff?text=Librería',
      'Alimentos': 'https://via.placeholder.com/200x150/10b981/ffffff?text=Alimentos',
      'Ropa': 'https://via.placeholder.com/200x150/ec4899/ffffff?text=Ropa',
      'Hogar': 'https://via.placeholder.com/200x150/f59e0b/ffffff?text=Hogar',
      'Deportes': 'https://via.placeholder.com/200x150/ef4444/ffffff?text=Deportes',
      'Juguetes': 'https://via.placeholder.com/200x150/8b5cf6/ffffff?text=Juguetes',
      'Otros': 'https://via.placeholder.com/200x150/6b7280/ffffff?text=Otros',
    };
    return placeholders[categoria] || placeholders['Otros'];
  };

  const renderProduct = ({ item }: { item: Product }) => {
    const imageUrl = item.imagen || getDefaultImage(item.categoria);
    const isOutOfStock = item.stock === 0;

    return (
      <View style={styles.productCard}>
        <TouchableOpacity
          style={styles.productContent}
          onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
        >
          <Image source={{ uri: imageUrl }} style={styles.productImage} />
          <View style={styles.productInfo}>
            <Text style={styles.productTitle} numberOfLines={2}>
              {item.titulo}
            </Text>
            <Text style={styles.productCategory}>{item.categoria}</Text>
            <Text style={styles.productPrice}>
              ${item.precio.toLocaleString('es-CL')}
            </Text>
            {isOutOfStock && (
              <Text style={styles.outOfStockText}>Sin stock</Text>
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.productActions}>
          <TouchableOpacity
            style={[
              styles.addToCartButton,
              isOutOfStock && styles.addToCartButtonDisabled,
            ]}
            onPress={() => handleAddToCart(item)}
            disabled={isOutOfStock}
          >
            <Ionicons
              name="cart"
              size={18}
              color={isOutOfStock ? '#9ca3af' : '#fff'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemove(item.id, item.titulo)}
          >
            <Ionicons name="trash" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <GradientView>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Cargando favoritos...</Text>
        </View>
      </GradientView>
    );
  }

  return (
    <>
      {/* Header */}
      <GradientView style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Mis Favoritos</Text>
            <View style={styles.placeholder} />
          </View>
          <Text style={styles.headerSubtitle}>
            {products.length} producto{products.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </GradientView>

      {products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={80} color="#d1d5db" />
          <Text style={styles.emptyTitle}>No tienes favoritos</Text>
          <Text style={styles.emptySubtitle}>
            Agrega productos que te gusten para encontrarlos fácilmente
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Products' })}
          >
            <Ionicons name="grid" size={20} color="#fff" />
            <Text style={styles.browseButtonText}>Explorar productos</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.container}>
          <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderProduct}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#a855f7"
              />
            }
          />

          {/* Action buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.addAllButton}
              onPress={handleAddAllToCart}
            >
              <Ionicons name="cart" size={20} color="#fff" />
              <Text style={styles.addAllButtonText}>
                Agregar todo al carrito
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearAll}
            >
              <Ionicons name="trash" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#fff',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    gap: 8,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productContent: {
    flex: 1,
    flexDirection: 'row',
  },
  productImage: {
    width: 100,
    height: 100,
    backgroundColor: '#f3f4f6',
  },
  productInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#a855f7',
  },
  outOfStockText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
    marginTop: 4,
  },
  productActions: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  addToCartButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#a855f7',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  addAllButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#a855f7',
    paddingVertical: 14,
    borderRadius: 12,
  },
  addAllButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  clearButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
