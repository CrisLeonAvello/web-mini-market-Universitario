import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { productService } from '../services/productService';
import { Card, Badge, Button } from '../components/ui';
import { COLORS, GRADIENTS } from '../constants/config';

const { width } = Dimensions.get('window');

interface Product {
  id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  condicion: string;
  imagen: string;
  usuario_id: number;
  estado: string;
  valoracion_promedio?: number;
  total_valoraciones?: number;
}

export default function ProductDetailScreen({ route, navigation }: any) {
  const { productId } = route.params;
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  useEffect(() => {
    checkWishlistStatus();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductById(productId);
      setProduct(data);
    } catch (error: any) {
      Alert.alert('Error', 'No se pudo cargar el producto');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const checkWishlistStatus = () => {
    const status = isInWishlist(productId);
    setInWishlist(status);
  };

  const handleToggleWishlist = async () => {
    try {
      await toggleWishlist(productId);
      setInWishlist(!inWishlist);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar los favoritos');
    }
  };

  const getDefaultImage = (categoria: string) => {
    const placeholders: { [key: string]: string } = {
      'Electrónicos': 'https://via.placeholder.com/400x300/7c3aed/ffffff?text=Electrónicos',
      'Librería': 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Librería',
      'Alimentos': 'https://via.placeholder.com/400x300/10b981/ffffff?text=Alimentos',
      'Ropa': 'https://via.placeholder.com/400x300/ec4899/ffffff?text=Ropa',
      'Hogar': 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Hogar',
      'Deportes': 'https://via.placeholder.com/400x300/ef4444/ffffff?text=Deportes',
      'Juguetes': 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Juguetes',
      'Otros': 'https://via.placeholder.com/400x300/6b7280/ffffff?text=Otros',
    };
    return placeholders[categoria] || placeholders['Otros'];
  };

  const renderStars = (rating: number = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Ionicons key={i} name="star" size={18} color="#fbbf24" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Ionicons key={i} name="star-half" size={18} color="#fbbf24" />
        );
      } else {
        stars.push(
          <Ionicons key={i} name="star-outline" size={18} color="#d1d5db" />
        );
      }
    }
    return stars;
  };

  const handleAddToCart = async () => {
    if (!product) return;

    if (product.stock === 0) {
      Alert.alert('Sin stock', 'Este producto no está disponible');
      return;
    }

    try {
      // Convertir el producto al formato esperado por CartContext
      const cartProduct = {
        id: product.id,
        nombre: product.titulo,
        precio: product.precio,
        imagen: product.imagen,
        stock: product.stock,
        categoria: product.categoria,
        descripcion: product.descripcion,
      };

      await addItem(cartProduct, quantity);

      Alert.alert(
        '¡Agregado! 🛒',
        `${product.titulo} (x${quantity}) agregado al carrito`,
        [
          { text: 'Seguir comprando', style: 'cancel' },
          { text: 'Ir al carrito', onPress: () => navigation.navigate('MainTabs', { screen: 'Cart' }) },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar el producto al carrito');
    }
  };

  const changeQuantity = (delta: number) => {
    if (!product) return;

    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const getConditionBadgeColor = (condicion: string) => {
    switch (condicion?.toLowerCase()) {
      case 'nuevo':
        return '#10b981';
      case 'usado':
        return '#f59e0b';
      case 'reacondicionado':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient colors={['#0a0e27', '#1a1f3a']} style={StyleSheet.absoluteFill} />
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando producto...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#ef4444" />
        <Text style={styles.errorText}>Producto no encontrado</Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.errorButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const imageUrl = product.imagen || getDefaultImage(product.categoria);
  const isOutOfStock = product.stock === 0;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0a0e27', '#1a1f3a']} style={StyleSheet.absoluteFill} />

      {/* Header Overlay */}
      <View style={styles.headerOverlay}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton} onPress={handleToggleWishlist}>
          <Ionicons
            name={inWishlist ? 'heart' : 'heart-outline'}
            size={24}
            color={inWishlist ? '#ef4444' : COLORS.text}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroImageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.heroImage} resizeMode="cover" />
          {isOutOfStock && (
            <View style={styles.outOfStockOverlay}>
              <Badge variant="error" style={styles.outOfStockBadge}>
                SIN STOCK
              </Badge>
            </View>
          )}
        </View>

        {/* Content Card */}
        <View style={styles.contentCard}>
          {/* Badges Row */}
          <View style={styles.badgesRow}>
            <Badge variant="info">{product.categoria}</Badge>
            <Badge
              variant={
                product.condicion === 'nuevo'
                  ? 'success'
                  : product.condicion === 'usado'
                  ? 'warning'
                  : 'default'
              }
            >
              {product.condicion?.charAt(0).toUpperCase() + product.condicion?.slice(1)}
            </Badge>
          </View>

          {/* Title */}
          <Text style={styles.productTitle}>{product.titulo}</Text>

          {/* Rating */}
          {product.valoracion_promedio !== undefined && (
            <View style={styles.ratingRow}>
              <View style={styles.starsContainer}>
                {renderStars(product.valoracion_promedio)}
              </View>
              <Text style={styles.ratingValue}>
                {product.valoracion_promedio.toFixed(1)}
              </Text>
              {product.total_valoraciones !== undefined && (
                <Text style={styles.reviewsText}>
                  ({product.total_valoraciones} reseñas)
                </Text>
              )}
            </View>
          )}

          {/* Price Card */}
          <Card variant="elevated" style={styles.priceCard}>
            <Text style={styles.priceLabel}>Precio</Text>
            <Text style={styles.priceValue}>${product.precio.toLocaleString('es-CL')}</Text>
          </Card>

          {/* Description Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.sectionText}>
              {product.descripcion || 'Sin descripción disponible'}
            </Text>
          </View>

          {/* Stock Info */}
          <Card variant="outlined" style={styles.stockCard}>
            <View style={styles.stockRow}>
              <Ionicons
                name="cube-outline"
                size={24}
                color={isOutOfStock ? COLORS.error : COLORS.success}
              />
              <View style={styles.stockInfo}>
                <Text style={styles.stockLabel}>Disponibilidad</Text>
                <Text
                  style={[
                    styles.stockValue,
                    { color: isOutOfStock ? COLORS.error : COLORS.success },
                  ]}
                >
                  {isOutOfStock ? 'Agotado' : `${product.stock} unidades disponibles`}
                </Text>
              </View>
            </View>
          </Card>

          {/* Quantity Selector */}
          {!isOutOfStock && (
            <Card variant="outlined" style={styles.quantityCard}>
              <Text style={styles.quantityLabel}>Cantidad</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={[styles.quantityBtn, quantity <= 1 && styles.quantityBtnDisabled]}
                  onPress={() => changeQuantity(-1)}
                  disabled={quantity <= 1}
                >
                  <Ionicons name="remove" size={20} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={[
                    styles.quantityBtn,
                    quantity >= product.stock && styles.quantityBtnDisabled,
                  ]}
                  onPress={() => changeQuantity(1)}
                  disabled={quantity >= product.stock}
                >
                  <Ionicons name="add" size={20} color={COLORS.text} />
                </TouchableOpacity>
              </View>
            </Card>
          )}

          {/* Features Grid */}
          <View style={styles.featuresGrid}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="person-outline" size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.featureText}>Usuario #{product.usuario_id}</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.success} />
              </View>
              <Text style={styles.featureText}>Compra Segura</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="car-outline" size={20} color={COLORS.info} />
              </View>
              <Text style={styles.featureText}>Envío 24-48h</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed Bottom Action */}
      <View style={styles.bottomAction}>
        <Button
          onPress={handleAddToCart}
          disabled={isOutOfStock}
          fullWidth
          size="lg"
        >
          <Ionicons name="cart" size={20} color="#fff" style={{ marginRight: 8 }} />
          {isOutOfStock ? 'Agotado' : `Agregar al Carrito • $${product.precio.toLocaleString()}`}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 24,
  },
  errorButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerOverlay: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${COLORS.surface}CC`,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  heroImageContainer: {
    width: '100%',
    height: 400,
    backgroundColor: COLORS.surfaceLight,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  contentCard: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 24,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  productTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
    lineHeight: 36,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  reviewsText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  priceCard: {
    padding: 16,
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  stockCard: {
    padding: 16,
    marginBottom: 16,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stockInfo: {
    flex: 1,
  },
  stockLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  stockValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  quantityCard: {
    padding: 16,
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: `${COLORS.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${COLORS.primary}40`,
  },
  quantityBtnDisabled: {
    backgroundColor: COLORS.surfaceLight,
    borderColor: COLORS.border,
    opacity: 0.5,
  },
  quantityText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  featureItem: {
    flex: 1,
    minWidth: '30%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: `${COLORS.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 30,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
});
