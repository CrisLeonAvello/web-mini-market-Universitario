import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useProducts } from '../contexts/ProductsContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import ProductCard from '../components/ProductCard';
import { Card, Badge } from '../components/ui';
import { COLORS, CATEGORIES, GRADIENTS } from '../constants/config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const featuredProducts = products.slice(0, 6);

  const getBadgeForProduct = (index: number) => {
    if (index === 0) return { text: 'Popular', color: '#f97316' };
    if (index === 1) return { text: 'Nuevo', color: '#10b981' };
    if (index === 2) return { text: 'Trending', color: '#a855f7' };
    return null;
  };

  const handleStartSelling = () => {
    if (user) {
      // Usuario autenticado: ir a la pantalla de vender
      navigation.navigate('MainTabs', { screen: 'Sell' });
    } else {
      // Usuario no autenticado: ir al login
      navigation.navigate('Auth', { screen: 'Login' });
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0a0e27', '#1a1f3a']}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <Animated.View
          style={[
            styles.hero,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.heroContent}>
            <View style={styles.logoContainer}>
              <LinearGradient colors={GRADIENTS.primary} style={styles.logoGradient}>
                <Ionicons name="storefront" size={40} color="#fff" />
              </LinearGradient>
            </View>
            <Text style={styles.heroTitle}>StudiMarket</Text>
            <Text style={styles.heroSubtitle}>
              Tu marketplace universitario de confianza
            </Text>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color={COLORS.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar productos..."
                placeholderTextColor={COLORS.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
        </Animated.View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <Card variant="elevated" style={styles.statCard}>
            <Ionicons name="cube" size={28} color={COLORS.primary} />
            <Text style={styles.statNumber}>{products.length}+</Text>
            <Text style={styles.statLabel}>Productos</Text>
          </Card>
          <Card variant="elevated" style={styles.statCard}>
            <Ionicons name="people" size={28} color={COLORS.secondary} />
            <Text style={styles.statNumber}>500+</Text>
            <Text style={styles.statLabel}>Usuarios</Text>
          </Card>
          <Card variant="elevated" style={styles.statCard}>
            <Ionicons name="cart" size={28} color={COLORS.success} />
            <Text style={styles.statNumber}>2K+</Text>
            <Text style={styles.statLabel}>Ventas</Text>
          </Card>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explorar Categorías</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                style={styles.categoryChip}
                onPress={() => navigation.navigate('Products', { category })}
              >
                <LinearGradient
                  colors={GRADIENTS.primary}
                  style={styles.categoryGradient}
                >
                  <Ionicons name="pricetag" size={18} color="#fff" />
                  <Text style={styles.categoryText}>{category}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Productos Destacados</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Products')}>
              <View style={styles.seeAllButton}>
                <Text style={styles.seeAllText}>Ver todos</Text>
                <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
              </View>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Cargando productos...</Text>
            </View>
          ) : featuredProducts.length > 0 ? (
            <View style={styles.productsGrid}>
              {featuredProducts.map((product, index) => (
                <View key={product.id} style={styles.productCardWrapper}>
                  <ProductCard
                    product={product}
                    onPress={() =>
                      navigation.navigate('ProductDetail', {
                        productId: product.id,
                      })
                    }
                    onAddToCart={() => addToCart(product)}
                    badge={getBadgeForProduct(index)}
                  />
                </View>
              ))}
            </View>
          ) : (
            <Card style={styles.emptyState}>
              <Ionicons name="cube-outline" size={64} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>No hay productos disponibles</Text>
            </Card>
          )}
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¿Por qué StudiMarket?</Text>
          <View style={styles.featuresGrid}>
            <Card variant="elevated" style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Ionicons name="shield-checkmark" size={32} color={COLORS.primary} />
              </View>
              <Text style={styles.featureTitle}>Compra Segura</Text>
              <Text style={styles.featureText}>
                Transacciones protegidas y verificadas
              </Text>
            </Card>

            <Card variant="elevated" style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Ionicons name="flash" size={32} color={COLORS.secondary} />
              </View>
              <Text style={styles.featureTitle}>Entrega Rápida</Text>
              <Text style={styles.featureText}>
                Recibe en campus en 24-48 horas
              </Text>
            </Card>

            <Card variant="elevated" style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Ionicons name="star" size={32} color={COLORS.warning} />
              </View>
              <Text style={styles.featureTitle}>Calidad</Text>
              <Text style={styles.featureText}>
                Productos verificados por la comunidad
              </Text>
            </Card>
          </View>
        </View>

        {/* CTA Section */}
        <Card variant="elevated" style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>¿Tienes algo para vender?</Text>
          <Text style={styles.ctaText}>
            Únete y comienza a vender en la comunidad estudiantil
          </Text>
          <TouchableOpacity style={styles.ctaButton} onPress={handleStartSelling}>
            <LinearGradient colors={GRADIENTS.secondary} style={styles.ctaButtonGradient}>
              <Text style={styles.ctaButtonText}>Empezar a Vender</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </Card>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  hero: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  heroContent: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadowPrimary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 300,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
    maxWidth: 500,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.text,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  categoryChip: {
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  categoryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  productsGrid: {
    gap: 16,
  },
  productCardWrapper: {
    width: '100%',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 16,
  },
  featuresGrid: {
    gap: 16,
  },
  featureCard: {
    padding: 20,
    alignItems: 'center',
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: `${COLORS.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  ctaCard: {
    marginHorizontal: 24,
    padding: 24,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  ctaButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
  ctaButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
