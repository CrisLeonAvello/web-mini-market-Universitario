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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { productService } from '../services/productService';
import GradientView from '../components/GradientView';

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

  const checkWishlistStatus = async () => {
    const status = await isInWishlist(productId);
    setInWishlist(status);
  };

  const handleToggleWishlist = async () => {
    await toggleWishlist(productId);
    setInWishlist(!inWishlist);
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

  const handleAddToCart = () => {
    if (!product) return;

    if (product.stock === 0) {
      Alert.alert('Sin stock', 'Este producto no está disponible');
      return;
    }

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

    addItem(cartProduct, quantity);

    Alert.alert(
      '¡Agregado! 🛒',
      `${product.titulo} (x${quantity}) agregado al carrito`,
      [
        { text: 'Seguir comprando', style: 'cancel' },
        { text: 'Ir al carrito', onPress: () => navigation.navigate('MainTabs', { screen: 'Cart' }) },
      ]
    );
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
        <ActivityIndicator size="large" color="#a855f7" />
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
      {/* Header con botón de volver */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={handleToggleWishlist}
        >
          <Ionicons
            name={inWishlist ? 'heart' : 'heart-outline'}
            size={24}
            color={inWishlist ? '#ef4444' : '#fff'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Imagen del producto */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={[styles.image, isOutOfStock && styles.imageOutOfStock]}
            resizeMode="cover"
          />
          {isOutOfStock && (
            <View style={styles.outOfStockOverlay}>
              <View style={styles.outOfStockBadge}>
                <Text style={styles.outOfStockText}>SIN STOCK</Text>
              </View>
            </View>
          )}
        </View>

        {/* Información del producto */}
        <View style={styles.infoContainer}>
          {/* Categoría y Condición */}
          <View style={styles.badgesContainer}>
            <View style={styles.categoryBadge}>
              <Ionicons name="pricetag" size={14} color="#a855f7" />
              <Text style={styles.categoryText}>{product.categoria}</Text>
            </View>
            <View
              style={[
                styles.conditionBadge,
                { backgroundColor: getConditionBadgeColor(product.condicion) },
              ]}
            >
              <Text style={styles.conditionText}>
                {product.condicion?.charAt(0).toUpperCase() +
                  product.condicion?.slice(1)}
              </Text>
            </View>
          </View>

          {/* Título */}
          <Text style={styles.title}>{product.titulo}</Text>

          {/* Rating */}
          {product.valoracion_promedio !== undefined && (
            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>
                {renderStars(product.valoracion_promedio)}
              </View>
              <Text style={styles.ratingText}>
                ({product.valoracion_promedio?.toFixed(1)})
              </Text>
              {product.total_valoraciones !== undefined && (
                <Text style={styles.reviewsCount}>
                  • {product.total_valoraciones} valoraciones
                </Text>
              )}
            </View>
          )}

          {/* Precio */}
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Precio:</Text>
            <Text style={styles.price}>
              ${product.precio.toLocaleString('es-CL')}
            </Text>
          </View>

          {/* Descripción */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.description}>
              {product.descripcion || 'Sin descripción disponible'}
            </Text>
          </View>

          {/* Stock */}
          <View style={styles.stockContainer}>
            <Ionicons
              name="cube-outline"
              size={20}
              color={isOutOfStock ? '#ef4444' : '#10b981'}
            />
            <Text
              style={[
                styles.stockText,
                isOutOfStock && styles.stockTextOutOfStock,
              ]}
            >
              {isOutOfStock ? 'Sin stock' : `Stock disponible: ${product.stock}`}
            </Text>
          </View>

          {/* Selector de cantidad */}
          {!isOutOfStock && (
            <View style={styles.quantityContainer}>
              <Text style={styles.quantityLabel}>Cantidad:</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={[
                    styles.quantityButton,
                    quantity <= 1 && styles.quantityButtonDisabled,
                  ]}
                  onPress={() => changeQuantity(-1)}
                  disabled={quantity <= 1}
                >
                  <Ionicons name="remove" size={20} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.quantityValue}>{quantity}</Text>
                <TouchableOpacity
                  style={[
                    styles.quantityButton,
                    quantity >= product.stock && styles.quantityButtonDisabled,
                  ]}
                  onPress={() => changeQuantity(1)}
                  disabled={quantity >= product.stock}
                >
                  <Ionicons name="add" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Información adicional */}
          <View style={styles.additionalInfoContainer}>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={18} color="#6b7280" />
              <Text style={styles.infoText}>
                Vendido por: Usuario #{product.usuario_id}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#10b981" />
              <Text style={styles.infoText}>Compra protegida</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="car-outline" size={18} color="#3b82f6" />
              <Text style={styles.infoText}>Envío disponible</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botones de acción (fijos abajo) */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.addToCartButton, isOutOfStock && styles.buttonDisabled]}
          onPress={handleAddToCart}
          disabled={isOutOfStock}
        >
          <Ionicons
            name="cart"
            size={20}
            color="#fff"
            style={styles.buttonIcon}
          />
          <Text style={styles.addToCartButtonText}>
            {isOutOfStock ? 'Sin stock' : 'Agregar al carrito'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wishlistButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 24,
  },
  errorButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#a855f7',
    borderRadius: 8,
  },
  errorButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    width: '100%',
    height: width * 0.8,
    backgroundColor: '#f3f4f6',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOutOfStock: {
    opacity: 0.5,
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  outOfStockText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 20,
  },
  badgesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3e8ff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#a855f7',
  },
  conditionBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  conditionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  reviewsCount: {
    fontSize: 14,
    color: '#9ca3af',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
    gap: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#a855f7',
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#4b5563',
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  stockText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#10b981',
  },
  stockTextOutOfStock: {
    color: '#ef4444',
    backgroundColor: '#fee2e2',
  },
  quantityContainer: {
    marginBottom: 24,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  quantityButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#a855f7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  quantityValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    minWidth: 40,
    textAlign: 'center',
  },
  additionalInfoContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 20,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
  },
  actionsContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  addToCartButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#a855f7',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: '#d1d5db',
    shadowOpacity: 0,
  },
  buttonIcon: {
    marginRight: 8,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
