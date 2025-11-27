import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/config';
import { Badge } from './ui';
import type { Product } from '../types/types';
import { useWishlist } from '../contexts/WishlistContext';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onAddToCart?: () => void;
  badge?: { text: string; color: string } | null;
  variant?: 'default' | 'compact';
}

export default function ProductCard({ 
  product, 
  onPress, 
  onAddToCart, 
  badge,
  variant = 'default'
}: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [scaleAnim] = useState(new Animated.Value(1));
  const [imageError, setImageError] = useState(false);
  const isFavorite = isInWishlist(product.id);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handleToggleFavorite = async (e: any) => {
    e?.stopPropagation?.();
    try {
      await toggleWishlist(product.id);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const imageUrl = !imageError && product.imagen
    ? product.imagen
    : 'https://via.placeholder.com/300x300/1a1f3a/a855f7?text=Producto';

  if (variant === 'compact') {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={styles.compactCard}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
        >
          <Image
            source={{ uri: imageUrl }}
            style={styles.compactImage}
            onError={() => setImageError(true)}
          />
          <View style={styles.compactContent}>
            <Text style={styles.compactTitle} numberOfLines={1}>
              {product.nombre}
            </Text>
            <Text style={styles.compactPrice}>
              ${product.precio ? product.precio.toFixed(2) : '0.00'}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity 
        style={styles.card} 
        onPress={onPress} 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        {/* Image Container */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            onError={() => setImageError(true)}
            resizeMode="cover"
          />
          
          {/* Favorite Button */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleToggleFavorite}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? '#ef4444' : COLORS.text}
            />
          </TouchableOpacity>

          {/* Custom Badge */}
          {badge && (
            <View style={[styles.customBadge, { backgroundColor: badge.color }]}>
              <Text style={styles.badgeText}>{badge.text}</Text>
            </View>
          )}

          {/* Stock Badge */}
          {product.stock !== undefined && product.stock < 5 && (
            <View style={styles.stockBadgeContainer}>
              <Badge variant={product.stock === 0 ? 'error' : 'warning'}>
                {product.stock === 0 ? 'Agotado' : `Solo ${product.stock}`}
              </Badge>
            </View>
          )}

          {/* Category Badge */}
          {product.categoria && (
            <View style={styles.categoryBadgeContainer}>
              <Badge variant="info">{product.categoria}</Badge>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={2}>
            {product.nombre}</Text>

          {product.descripcion && (
            <Text style={styles.description} numberOfLines={2}>
              {product.descripcion}
            </Text>
          )}

          {/* Price & Actions */}
          <View style={styles.footer}>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Precio</Text>
              <Text style={styles.price}>
                ${product.precio ? product.precio.toFixed(2) : '0.00'}
              </Text>
            </View>

            {onAddToCart && (
              <TouchableOpacity
                style={[
                  styles.addButton,
                  product.stock === 0 && styles.addButtonDisabled,
                ]}
                onPress={onAddToCart}
                disabled={product.stock === 0}
              >
                <Ionicons
                  name="cart-outline"
                  size={20}
                  color={product.stock === 0 ? COLORS.textMuted : COLORS.text}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadowPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.surfaceLight,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(26, 31, 58, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  customBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  stockBadgeContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  categoryBadgeContainer: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
    lineHeight: 22,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 8,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: `${COLORS.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${COLORS.primary}40`,
  },
  addButtonDisabled: {
    backgroundColor: COLORS.surfaceLight,
    borderColor: COLORS.border,
  },
  // Compact variant styles
  compactCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  compactImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    backgroundColor: COLORS.surfaceLight,
  },
  compactContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  compactPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});
