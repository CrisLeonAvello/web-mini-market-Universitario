import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Animated, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientView from '../components/GradientView';
import { COLORS, CATEGORIES } from '../constants/config';
import { useProducts } from '../contexts/ProductsContext';
import ProductCard from '../components/ProductCard';
import { useCart } from '../contexts/CartContext';

const { width } = Dimensions.get('window');

const CATEGORY_ICONS: { [key: string]: string } = {
  'Electrónica': 'laptop',
  'Libros': 'book',
  'Ropa': 'shirt',
  'Accesorios': 'bag',
  'Hogar': 'home',
  'Deportes': 'football',
};

const CATEGORY_COLORS: { [key: string]: string } = {
  'Electrónica': '#3b82f6',
  'Libros': '#ec4899',
  'Ropa': '#f97316',
  'Accesorios': '#10b981',
  'Hogar': '#f59e0b',
  'Deportes': '#a855f7',
};

export default function LandingScreen({ navigation }: any) {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const { width: screenWidth } = useWindowDimensions();
  const [currentCategory, setCurrentCategory] = useState(0);
  const [flipAnimation] = useState(new Animated.Value(0));
  
  // Detectar si es móvil (menos de 768px)
  const isMobile = screenWidth < 768;
  
  // Productos de ejemplo si no hay productos del backend
  const defaultProducts = [
    {
      id: 1,
      nombre: 'Laptop HP Pavilion',
      descripcion: 'Laptop ideal para estudiantes',
      precio: 599.99,
      imagen: 'https://placehold.co/400x400/3b82f6/white?text=Laptop',
      categoria: 'Electrónica',
      stock: 10,
      vendedor_id: 1,
    },
    {
      id: 2,
      nombre: 'Mochila Universitaria',
      descripcion: 'Mochila espaciosa con compartimento para laptop',
      precio: 45.99,
      imagen: 'https://placehold.co/400x400/10b981/white?text=Mochila',
      categoria: 'Accesorios',
      stock: 25,
      vendedor_id: 1,
    },
    {
      id: 3,
      nombre: 'Libro de Cálculo',
      descripcion: 'Libro de texto para estudiantes de ingeniería',
      precio: 29.99,
      imagen: 'https://placehold.co/400x400/ec4899/white?text=Libro',
      categoria: 'Libros',
      stock: 15,
      vendedor_id: 1,
    },
  ];
  
  const featuredProducts = products.length > 0 ? products.slice(0, 3) : defaultProducts;

  // Auto-slide del hero con animación flip
  useEffect(() => {
    const interval = setInterval(() => {
      // Animación flip (useNativeDriver: false para web)
      Animated.sequence([
        Animated.timing(flipAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(flipAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
      
      setTimeout(() => {
        setCurrentCategory((prev) => (prev + 1) % CATEGORIES.length);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getBadgeForProduct = (index: number) => {
    if (index === 0) return { text: 'Popular', color: '#f97316' };
    if (index === 1) return { text: 'Nuevo', color: '#10b981' };
    if (index === 2) return { text: 'Trending', color: '#a855f7' };
    return null;
  };

  const flipInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={true}
      bounces={true}
    >
      {/* Header mejorado estilo web */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerLogoEmoji}>🛍️</Text>
          {!isMobile && (
            <View>
              <Text style={styles.headerLogo}>StudiMarket</Text>
              <Text style={styles.headerSublogo}>Marketplace Estudiantil</Text>
            </View>
          )}
        </View>
        <View style={styles.headerCenter}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Products' })}
          >
            <Text style={styles.navButtonText}>Productos</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
          >
            <Text style={styles.navButtonText}>Categorías</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigation.navigate('About')}
          >
            <Text style={styles.navButtonText}>Nosotros</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
          >
            {!isMobile && <Text style={styles.loginButtonEmoji}>🔐</Text>}
            <Text style={styles.loginButtonText}>{isMobile ? 'INGRESAR' : 'INICIAR SESIÓN'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Hero Section */}
      <View style={styles.hero}>
        <View style={styles.heroContent}>
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>ESTUDIANTES</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>
            Descubre el mejor{' '}
            <Text style={styles.heroTitleOrange}>marketplace</Text>
            {' '}<Text style={styles.heroTitlePurple}>estudiantil</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            Encuentra todo lo que necesitas para tu vida estudiantil. Productos de calidad, tecnología, libros y más.
          </Text>
        </View>
        
        {/* Category Slider Card con animación */}
        <View style={styles.heroSlider}>
          <Animated.View 
            style={[
              styles.sliderCard,
              {
                transform: [{ rotateY: flipInterpolate }],
              },
            ]}
          >
            <View style={[styles.sliderIcon, { backgroundColor: CATEGORY_COLORS[CATEGORIES[currentCategory]] }]}>
              <Ionicons 
                name={CATEGORY_ICONS[CATEGORIES[currentCategory]] as any} 
                size={60} 
                color="#fff" 
              />
            </View>
            <Text style={styles.sliderText}>{CATEGORIES[currentCategory]}</Text>
            <Text style={styles.sliderCount}>+{150 + (currentCategory * 30)} productos</Text>
          </Animated.View>
          <View style={styles.sliderDots}>
            {CATEGORIES.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.dot, 
                  index === currentCategory && styles.dotActive
                ]} 
              />
            ))}
          </View>
        </View>
      </View>

      {/* Stats Section - Nuevo */}
      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>1000+</Text>
          <Text style={styles.statLabel}>Productos</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>500+</Text>
          <Text style={styles.statLabel}>Usuarios</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>2000+</Text>
          <Text style={styles.statLabel}>Ventas</Text>
        </View>
      </View>

      {/* Explora por Categoría */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Explora por Categoría</Text>
        <Text style={styles.sectionSubtitle}>Encuentra exactamente lo que necesitas</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={styles.categoryCard}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Products', params: { category } })}
            >
              <View style={[styles.categoryIcon, { backgroundColor: CATEGORY_COLORS[category] }]}>
                <Ionicons name={CATEGORY_ICONS[category] as any} size={28} color="#fff" />
              </View>
              <Text style={styles.categoryName}>{category}</Text>
              <Text style={styles.categoryItems}>Ver productos</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Productos Destacados */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Productos Destacados</Text>
        <Text style={styles.sectionSubtitle}>Los favoritos de la comunidad estudiantil</Text>
        
        {loading && products.length === 0 ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 40 }} />
        ) : (
          featuredProducts.map((product, index) => {
          const badge = getBadgeForProduct(index);
          return (
            <View key={product.id} style={styles.productWrapper}>
              {badge && (
                <View style={[styles.productBadge, { backgroundColor: badge.color }]}>
                  <Text style={styles.productBadgeText}>{badge.text}</Text>
                </View>
              )}
              <ProductCard
                product={product}
                onPress={() => navigation.navigate('MainTabs', { screen: 'Products' })}
                onAddToCart={() => addToCart(product)}
              />
            </View>
          );
        })
        )}
      </View>

      {/* Tu tienda de confianza */}
      <View style={styles.trustSection}>
        <Text style={styles.trustTitle}>
          Tu tienda{'\n'}
          <Text style={styles.trustTitleWhite}>de confianza</Text>
        </Text>
        <Text style={styles.trustText}>
          Creado por estudiantes, para estudiantes. Ofrecemos productos de calidad que realmente necesitas para tu vida universitaria.
        </Text>
      </View>

      {/* Sobre Nosotros */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre Nosotros</Text>
        
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>¿Quiénes Somos?</Text>
          <Text style={styles.aboutText}>
            StudiMarket es el marketplace estudiantil más innovador de Chile, creado por estudiantes para estudiantes. Nuestro objetivo es facilitar el acceso a productos de calidad que necesitas para tu vida universitaria.
          </Text>
        </View>

        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>Nuestra Misión</Text>
          <Text style={styles.aboutText}>
            Conectar a estudiantes universitarios con los mejores productos y servicios, ofreciendo precios accesibles, calidad garantizada y una experiencia de compra única diseñada especialmente para la comunidad estudiantil.
          </Text>
        </View>

        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>¿Por Qué Elegirnos?</Text>
          <Text style={styles.aboutText}>• Precios especiales para estudiantes{'\n'}• Envíos rápidos a campus universitarios{'\n'}• Productos verificados y de calidad{'\n'}• Atención personalizada 24/7{'\n'}• Comunidad estudiantil activa</Text>
        </View>
      </View>

      {/* Features adicionales */}
      <View style={styles.featuresRow}>
        <View style={styles.featureSmall}>
          <Ionicons name="shield-checkmark" size={32} color={COLORS.primary} />
          <Text style={styles.featureSmallTitle}>Compra Segura</Text>
          <Text style={styles.featureSmallText}>Transacciones protegidas para estudiantes</Text>
        </View>

        <View style={styles.featureSmall}>
          <Ionicons name="car" size={32} color={COLORS.primary} />
          <Text style={styles.featureSmallTitle}>Envío Gratis</Text>
          <Text style={styles.featureSmallText}>En compras mayores a $50</Text>
        </View>

        <View style={styles.featureSmall}>
          <Ionicons name="card" size={32} color={COLORS.primary} />
          <Text style={styles.featureSmallTitle}>Pago Flexible</Text>
          <Text style={styles.featureSmallText}>Múltiples métodos de pago</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 StudiMarket. Todos los derechos reservados.</Text>
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
    paddingBottom: 50,
    minHeight: '150%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    minHeight: 70,
    backgroundColor: '#0a0e27',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 20,
    paddingVertical: 10,
  },
  headerLogoEmoji: {
    fontSize: 32,
  },
  headerLogo: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  headerSublogo: {
    fontSize: 10,
    color: '#94a3b8',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'stretch',
    flex: 1,
    justifyContent: 'center',
  },
  navButton: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 20,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6b35',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonEmoji: {
    fontSize: 16,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  hero: {
    backgroundColor: '#1e293b',
    padding: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  heroContent: {
    marginBottom: 32,
  },
  badgeContainer: {
    marginBottom: 20,
  },
  badge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 20,
    lineHeight: 44,
  },
  heroTitleOrange: {
    color: '#ff6b35',
    fontWeight: '900',
  },
  heroTitlePurple: {
    color: COLORS.primary,
    fontWeight: '900',
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#cbd5e1',
    lineHeight: 24,
  },
  heroSlider: {
    alignItems: 'center',
  },
  sliderCard: {
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ff6b35',
    width: width - 48,
    marginBottom: 20,
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  sliderIcon: {
    width: 120,
    height: 120,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sliderText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  sliderCount: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600',
  },
  sliderDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#475569',
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 28,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    marginHorizontal: 16,
    borderRadius: 20,
    marginBottom: 32,
  },
  statCard: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 24,
  },
  categoriesScroll: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  categoryCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 20,
    padding: 24,
    marginRight: 16,
    alignItems: 'center',
    width: 160,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  categoryIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  categoryItems: {
    fontSize: 13,
    color: '#a855f7',
    fontWeight: '600',
  },
  productWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  productBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  productBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  trustSection: {
    backgroundColor: COLORS.primary,
    padding: 40,
    alignItems: 'center',
  },
  trustTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff6b35',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 40,
  },
  trustTitleWhite: {
    color: '#fff',
  },
  trustText: {
    fontSize: 14,
    color: '#e9d5ff',
    textAlign: 'center',
    lineHeight: 22,
  },
  aboutCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 22,
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 24,
    gap: 16,
    justifyContent: 'space-between',
  },
  featureSmall: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: (width - 72) / 3,
  },
  featureSmallTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  featureSmallText: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
  },
});
