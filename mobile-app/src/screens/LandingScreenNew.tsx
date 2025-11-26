import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { name: 'Tecnología', icon: 'laptop-outline', color: '#3b82f6', items: 250 },
  { name: 'Libros', icon: 'book-outline', color: '#c026d3', items: 320 },
  { name: 'Audio', icon: 'headset-outline', color: '#ff5722', items: 120 },
  { name: 'Accesorios', icon: 'bag-outline', color: '#10b981', items: 180 },
  { name: 'Snacks', icon: 'cafe-outline', color: '#f59e0b', items: 95 },
  { name: 'Papelería', icon: 'create-outline', color: '#a855f7', items: 150 },
];

const SLIDER_CATEGORIES = [
  { name: 'Explora\nNuestras\nCategorías', icon: 'albums-outline', color: '#6b7280' },
  { name: 'Tecnología', icon: 'laptop-outline', color: '#3b82f6' },
];

export default function LandingScreen({ navigation }: any) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDER_CATEGORIES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentCategory = SLIDER_CATEGORIES[currentSlide];

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="rocket" size={28} color="#ff5722" />
          <View>
            <Text style={styles.logoText}>StudiMarket</Text>
            <Text style={styles.logoSubtext}>Marketplace Estudiantil</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <TouchableOpacity 
        style={styles.searchBar}
        onPress={() => navigation.navigate('Search')}
      >
        <Ionicons name="search" size={20} color="#94a3b8" />
        <Text style={styles.searchPlaceholder}>Buscar...</Text>
      </TouchableOpacity>

      {/* Badge */}
      <View style={styles.badgeContainer}>
        <LinearGradient
          colors={['#8b5cf6', '#6b21a8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.badge}
        >
          <Ionicons name="sparkles" size={16} color="#fff" />
          <Text style={styles.badgeText}>ESTUDIANTES</Text>
        </LinearGradient>
      </View>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.heroText}>
          <Text style={styles.heroTitle}>Descubre el mejor</Text>
          <Text style={styles.heroTitleOrange}>marketplace</Text>
          <Text style={styles.heroTitlePurple}>estudiantil</Text>
          <Text style={styles.heroSubtitle}>
            Encuentra todo lo que necesitas para tu vida estudiantil. Productos de calidad, tecnología, libros y más.
          </Text>
        </View>

        {/* Category Slider */}
        <View style={styles.sliderContainer}>
          <View style={styles.sliderCard}>
            <View style={styles.sliderLeft}>
              <Ionicons name="albums-outline" size={48} color="#6b7280" />
              <Text style={styles.sliderText}>Explora</Text>
              <Text style={styles.sliderText}>Nuestras</Text>
              <Text style={styles.sliderTextOrange}>Categorías</Text>
            </View>
            <View style={styles.sliderDivider} />
            <View style={styles.sliderRight}>
              <Ionicons name={currentCategory.icon as any} size={64} color={currentCategory.color} />
              <Text style={[styles.sliderCategoryName, { color: currentCategory.color }]}>
                {currentCategory.name}
              </Text>
            </View>
          </View>
          <View style={styles.sliderDots}>
            {SLIDER_CATEGORIES.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentSlide && styles.dotActive,
                ]}
              />
            ))}
          </View>
          <View style={styles.rocketIcon}>
            <Ionicons name="rocket" size={32} color="#ff5722" />
          </View>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>1,000+</Text>
          <Text style={styles.statLabel}>PRODUCTOS</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>500+</Text>
          <Text style={styles.statLabel}>ESTUDIANTES</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>50+</Text>
          <Text style={styles.statLabel}>UNIVERSIDADES</Text>
        </View>
      </View>

      {/* Categories Section */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Explora por Categoría</Text>
        <Text style={styles.sectionSubtitle}>Encuentra exactamente lo que necesitas</Text>
        
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryCard}
              onPress={() => navigation.navigate('Products', { category: category.name })}
            >
              <LinearGradient
                colors={[category.color + '40', category.color + '20']}
                style={styles.categoryIconContainer}
              >
                <Ionicons name={category.icon as any} size={32} color={category.color} />
              </LinearGradient>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryItems}>{category.items} items</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Products Section */}
      <View style={styles.productsSection}>
        <Text style={styles.sectionTitle}>Productos Destacados</Text>
        <Text style={styles.sectionSubtitle}>Los favoritos de la comunidad estudiantil</Text>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.featuresSectionTitle}>Tu Minimarket Universitario</Text>
        <Text style={styles.featuresSectionSubtitle}>
          Creado por estudiantes, para estudiantes. Todo lo que necesitas para triunfar en tu vida universitaria.
        </Text>

        <View style={styles.featuresGrid}>
          <View style={[styles.featureCard, { backgroundColor: '#1e1b4b' }]}>
            <LinearGradient
              colors={['#a855f7', '#8b5cf6']}
              style={styles.featureIcon}
            >
              <Ionicons name="sparkles" size={28} color="#fff" />
            </LinearGradient>
            <Text style={styles.featureTitle}>Productos Seleccionados</Text>
            <Text style={styles.featureDescription}>
              Cada artículo ha sido cuidadosamente elegido pensando en las necesidades de los estudiantes universitarios.
            </Text>
          </View>

          <View style={[styles.featureCard, { backgroundColor: '#431407' }]}>
            <LinearGradient
              colors={['#ff5722', '#f44336']}
              style={styles.featureIcon}
            >
              <Ionicons name="flash" size={28} color="#fff" />
            </LinearGradient>
            <Text style={styles.featureTitle}>Entrega Rápida</Text>
            <Text style={styles.featureDescription}>
              Recibe tus productos en tiempo récord. Porque sabemos que tu tiempo es valioso.
            </Text>
          </View>

          <View style={[styles.featureCard, { backgroundColor: '#1e1b4b' }]}>
            <LinearGradient
              colors={['#ec4899', '#c026d3']}
              style={styles.featureIcon}
            >
              <Ionicons name="shield-checkmark" size={28} color="#fff" />
            </LinearGradient>
            <Text style={styles.featureTitle}>Compra Segura</Text>
            <Text style={styles.featureDescription}>
              Tus datos y pagos están protegidos con la mejor tecnología de seguridad.
            </Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerTop}>
          <View style={styles.footerBrand}>
            <Ionicons name="rocket" size={24} color="#ff5722" />
            <Text style={styles.footerLogoText}>StudiMarket</Text>
          </View>
          <Text style={styles.footerTagline}>Tu marketplace estudiantil de confianza</Text>
          
          <View style={styles.socialIcons}>
            <TouchableOpacity style={styles.socialIcon}>
              <Ionicons name="logo-facebook" size={20} color="#94a3b8" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <Ionicons name="logo-instagram" size={20} color="#94a3b8" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <Ionicons name="logo-twitter" size={20} color="#94a3b8" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <Ionicons name="mail" size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footerLinks}>
          <View style={styles.footerColumn}>
            <Text style={styles.footerColumnTitle}>Comprar</Text>
            <TouchableOpacity><Text style={styles.footerLink}>Productos</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.footerLink}>Categorías</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.footerLink}>Ofertas</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.footerLink}>Nuevos</Text></TouchableOpacity>
          </View>

          <View style={styles.footerColumn}>
            <Text style={styles.footerColumnTitle}>Ayuda</Text>
            <TouchableOpacity><Text style={styles.footerLink}>Centro de Ayuda</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.footerLink}>Envíos</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.footerLink}>Devoluciones</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.footerLink}>Contacto</Text></TouchableOpacity>
          </View>

          <View style={styles.footerColumn}>
            <Text style={styles.footerColumnTitle}>Legal</Text>
            <TouchableOpacity><Text style={styles.footerLink}>Términos</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.footerLink}>Privacidad</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.footerLink}>Cookies</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.footerLink}>Nosotros</Text></TouchableOpacity>
          </View>
        </View>

        <View style={styles.footerBottom}>
          <Text style={styles.copyright}>© 2025 StudiMarket. Todos los derechos reservados.</Text>
        </View>
      </View>

      {/* Login/Register Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <LinearGradient
            colors={['#ff5722', '#f44336']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.loginButtonGradient}
          >
            <Ionicons name="person" size={20} color="#fff" />
            <Text style={styles.loginButtonText}>INICIAR SESIÓN</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.registerButtonText}>Crear Cuenta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0f1729',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoSubtext: {
    fontSize: 11,
    color: '#94a3b8',
  },
  menuButton: {
    padding: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1f36',
    marginHorizontal: 20,
    padding: 12,
    borderRadius: 12,
    gap: 12,
    marginBottom: 20,
  },
  searchPlaceholder: {
    color: '#94a3b8',
    fontSize: 14,
  },
  badgeContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  heroSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  heroText: {
    marginBottom: 30,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 50,
  },
  heroTitleOrange: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#ff5722',
    lineHeight: 50,
  },
  heroTitlePurple: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#a855f7',
    lineHeight: 50,
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 22,
  },
  sliderContainer: {
    position: 'relative',
  },
  sliderCard: {
    backgroundColor: '#1a1f36',
    borderRadius: 20,
    flexDirection: 'row',
    overflow: 'hidden',
    minHeight: 200,
  },
  sliderLeft: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  sliderText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  sliderTextOrange: {
    fontSize: 14,
    color: '#ff5722',
    fontWeight: '600',
  },
  sliderDivider: {
    width: 4,
    backgroundColor: '#ff5722',
  },
  sliderRight: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderCategoryName: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  sliderDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#475569',
  },
  dotActive: {
    backgroundColor: '#ff5722',
    width: 24,
  },
  rocketIcon: {
    position: 'absolute',
    top: -16,
    right: 20,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 40,
    marginHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ec4899',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#94a3b8',
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#1e293b',
  },
  categoriesSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 30,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - 56) / 2,
    backgroundColor: '#1a1f36',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  categoryIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  categoryItems: {
    fontSize: 12,
    color: '#64748b',
  },
  productsSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  featuresSectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  featuresSectionSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  featuresGrid: {
    gap: 16,
  },
  featureCard: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 20,
  },
  footer: {
    backgroundColor: '#0a0e1a',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  footerTop: {
    marginBottom: 30,
  },
  footerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  footerLogoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  footerTagline: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 20,
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#1a1f36',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  footerColumn: {
    flex: 1,
  },
  footerColumnTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  footerLink: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 8,
  },
  footerBottom: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  copyright: {
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
  },
  actionButtons: {
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 20,
    marginBottom: 30,
  },
  loginButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  loginButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  registerButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
});
