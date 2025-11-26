import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProducts } from '../contexts/ProductsContext';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../components/ProductCard';
import GradientView from '../components/GradientView';
import { COLORS, CATEGORIES } from '../constants/config';

export default function HomeScreen({ navigation }: any) {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const { width } = useWindowDimensions();
  
  // Responsive columns
  const numColumns = width >= 1200 ? 4 : width >= 900 ? 3 : width >= 600 ? 2 : 1;
  const isDesktop = width >= 1024;

  const featuredProducts = products.slice(0, 6);

  // Función para obtener badge según el índice (igual que frontend web)
  const getBadgeForProduct = (index: number) => {
    if (index === 0) return { text: 'Popular', color: '#f97316' };
    if (index === 1) return { text: 'Nuevo', color: '#10b981' };
    if (index === 2) return { text: 'Trending', color: '#a855f7' };
    return null;
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={true}
      keyboardShouldPersistTaps="handled"
      scrollEnabled={true}
    >
      {/* Banner con gradiente */}
      <GradientView
        colors={[COLORS.primary, COLORS.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.banner}
      >
        <View style={styles.bannerContent}>
          <Ionicons name="storefront" size={48} color="#fff" />
          <Text style={styles.bannerTitle}>StudiMarket</Text>
          <Text style={styles.bannerSubtitle}>Tu marketplace universitario</Text>
        </View>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => navigation.navigate('Search')}
        >
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </GradientView>

      {/* Categor\u00edas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categor\u00edas</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categories}
          nestedScrollEnabled={true}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={styles.categoryButton}
              onPress={() => navigation.navigate('Products', { category })}
            >
              <GradientView
                colors={[COLORS.primary, COLORS.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.categoryGradient}
              >
                <Ionicons name="pricetag" size={24} color="#fff" />
              </GradientView>
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Productos destacados */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Productos Destacados</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Products')}>
            <Text style={styles.seeAll}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        
        {loading ? (
          <Text style={styles.loadingText}>Cargando productos...</Text>
        ) : featuredProducts.length > 0 ? (
          <View style={[styles.productsGrid, { maxWidth: isDesktop ? 1400 : '100%', alignSelf: 'center' }]}>
            {featuredProducts.map((product, index) => (
              <View key={product.id} style={{ width: `${100 / numColumns}%`, padding: 8 }}>
                <ProductCard
                  product={product}
                  onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
                  onAddToCart={() => addToCart(product)}
                  badge={getBadgeForProduct(index)}
                />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="cube-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No hay productos disponibles</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0a0e27',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
    minHeight: '150%',
  },
  banner: {
    padding: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerContent: {
    flex: 1,
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
    textShadowColor: 'rgba(168, 85, 247, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: '#cbd5e1',
    opacity: 0.95,
    marginTop: 8,
  },
  searchButton: {
    position: 'absolute',
    top: 40,
    right: 16,
    padding: 12,
    backgroundColor: 'rgba(255, 107, 53, 0.3)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  section: {
    padding: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  seeAll: {
    fontSize: 14,
    color: '#ff6b35',
    fontWeight: '600',
  },
  categories: {
    marginTop: 12,
  },
  categoryButton: {
    marginRight: 20,
    alignItems: 'center',
    width: 90,
  },
  categoryGradient: {
    width: 72,
    height: 72,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  categoryText: {
    fontSize: 13,
    color: '#cbd5e1',
    textAlign: 'center',
    fontWeight: '600',
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: 'rgba(30, 41, 59, 0.3)',
    borderRadius: 20,
    marginHorizontal: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 16,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
});
