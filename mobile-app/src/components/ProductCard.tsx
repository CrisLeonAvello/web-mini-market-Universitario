import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/config';
import type { Product } from '../types/types';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onAddToCart?: () => void;
  badge?: { text: string; color: string } | null;
}

export default function ProductCard({ product, onPress, onAddToCart, badge }: ProductCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {badge && (
        <View style={[styles.badge, { backgroundColor: badge.color }]}>
          <Text style={styles.badgeText}>{badge.text}</Text>
        </View>
      )}
      <Image
        source={{ uri: product.imagen || 'https://placehold.co/200x200/a855f7/white?text=Sin+Imagen' }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>{product.nombre}</Text>
        <Text style={styles.category}>{product.categoria}</Text>
        <View style={styles.footer}>
          <Text style={styles.price}>${product.precio ? product.precio.toFixed(2) : '0.00'}</Text>
          {onAddToCart && (
            <TouchableOpacity style={styles.addButton} onPress={onAddToCart}>
              <Ionicons name="cart" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
        {product.stock <= 5 && product.stock > 0 && (
          <Text style={styles.lowStock}>¡Solo {product.stock} disponibles!</Text>
        )}
        {product.stock === 0 && (
          <Text style={styles.outOfStock}>Agotado</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lowStock: {
    fontSize: 11,
    color: '#ff9800',
    marginTop: 4,
    fontWeight: '600',
  },
  outOfStock: {
    fontSize: 11,
    color: '#f44336',
    marginTop: 4,
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
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
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
