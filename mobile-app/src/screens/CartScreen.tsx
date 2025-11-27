import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, Platform, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { COLORS, GRADIENTS } from '../constants/config';
import { useNavigation } from '@react-navigation/native';

export default function CartScreen() {
  const { items, removeFromCart, updateQuantity, total, clearCart, loading, refreshCart } = useCart();
  const { user } = useAuth();
  const navigation = useNavigation<any>();

  // Recargar carrito al entrar a la pantalla
  useEffect(() => {
    if (user && refreshCart) {
      refreshCart();
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      Alert.alert('Sesión requerida', 'Debes iniciar sesión para ver tu carrito');
      navigation.navigate('Auth', { screen: 'Login' });
    }
  }, [user, navigation]);

  if (!user) {
    return null;
  }

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Carrito vacío', 'Agrega productos para continuar');
      return;
    }
    navigation.navigate('Checkout');
  };

  const renderItem = ({ item }: any) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    const itemTotal = item.product.precio * item.quantity;

    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Card variant="elevated" style={styles.cartItem}>
          <View style={styles.itemRow}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item.product.imagen || 'https://placehold.co/100x100/a855f7/white?text=Imagen' }}
                style={styles.itemImage}
              />
              {item.quantity > 1 && (
                <View style={styles.quantityBadge}>
                  <Text style={styles.quantityBadgeText}>×{item.quantity}</Text>
                </View>
              )}
            </View>

            <View style={styles.itemDetails}>
              <Text style={styles.itemName} numberOfLines={2}>
                {item.product.nombre}
              </Text>
              
              <View style={styles.priceRow}>
                <Text style={styles.unitPrice}>
                  ${item.product.precio.toFixed(2)} c/u
                </Text>
              </View>

              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={async () => {
                    try {
                      await updateQuantity(item.product.id, Math.max(1, item.quantity - 1));
                    } catch (error) {
                      Alert.alert('Error', 'No se pudo actualizar la cantidad');
                    }
                  }}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                >
                  <Ionicons name="remove" size={18} color={COLORS.primary} />
                </TouchableOpacity>

                <View style={styles.quantityDisplay}>
                  <Text style={styles.quantity}>{item.quantity}</Text>
                </View>

                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={async () => {
                    try {
                      await updateQuantity(item.product.id, Math.min(item.product.stock, item.quantity + 1));
                    } catch (error) {
                      Alert.alert('Error', 'No se pudo actualizar la cantidad');
                    }
                  }}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  disabled={item.quantity >= item.product.stock}
                >
                  <Ionicons 
                    name="add" 
                    size={18} 
                    color={item.quantity >= item.product.stock ? COLORS.textMuted : COLORS.primary} 
                  />
                </TouchableOpacity>

                <Text style={styles.itemTotal}>
                  ${itemTotal.toFixed(2)}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => {
                Alert.alert(
                  'Eliminar producto',
                  '¿Estás seguro de eliminar este producto del carrito?',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    { 
                      text: 'Eliminar', 
                      style: 'destructive', 
                      onPress: async () => {
                        try {
                          await removeFromCart(item.product.id);
                        } catch (error) {
                          Alert.alert('Error', 'No se pudo eliminar el producto');
                        }
                      }
                    },
                  ]
                );
              }}
            >
              <Ionicons name="trash-outline" size={22} color={COLORS.danger} />
            </TouchableOpacity>
          </View>
        </Card>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <LinearGradient
            colors={GRADIENTS.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.emptyIconContainer}
          >
            <Ionicons name="cart-outline" size={60} color="#fff" />
          </LinearGradient>
          <Text style={styles.emptyText}>Tu carrito está vacío</Text>
          <Text style={styles.emptySubtext}>Explora productos increíbles para agregar</Text>
          
          <Button
            onPress={() => navigation.navigate('Home')}
            variant="default"
            style={styles.emptyButton}
          >
            Explorar Productos
          </Button>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.product.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ListHeaderComponent={
              <Card variant="elevated" style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Ionicons name="cart" size={24} color={COLORS.primary} />
                  <Text style={styles.summaryText}>
                    {items.length} {items.length === 1 ? 'producto' : 'productos'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        'Vaciar carrito',
                        '¿Deseas eliminar todos los productos?',
                        [
                          { text: 'Cancelar', style: 'cancel' },
                          { text: 'Vaciar', style: 'destructive', onPress: clearCart },
                        ]
                      );
                    }}
                    style={styles.clearButton}
                  >
                    <Text style={styles.clearButtonText}>Vaciar</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            }
          />

          <Card variant="elevated" style={styles.footer}>
            <View style={styles.subtotalRow}>
              <Text style={styles.subtotalLabel}>Subtotal:</Text>
              <Text style={styles.subtotalAmount}>${total.toFixed(2)}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
            </View>

            <Button
              onPress={handleCheckout}
              variant="default"
              fullWidth
              style={styles.checkoutButton}
            >
              <View style={styles.checkoutContent}>
                <Text style={styles.checkoutText}>Proceder al Pago</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </View>
            </Button>
          </Card>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    padding: 16,
    paddingTop: 8,
  },
  summaryCard: {
    marginBottom: 16,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.danger,
  },
  cartItem: {
    marginBottom: 12,
    padding: 0,
  },
  itemRow: {
    flexDirection: 'row',
    padding: 12,
  },
  imageContainer: {
    position: 'relative',
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceLight,
  },
  quantityBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  quantityBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  unitPrice: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityDisplay: {
    minWidth: 36,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 8,
    alignItems: 'center',
  },
  quantity: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 'auto',
  },
  removeButton: {
    padding: 8,
    justifyContent: 'flex-start',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  emptyButton: {
    minWidth: 200,
  },
  footer: {
    padding: 20,
    margin: 16,
    marginTop: 0,
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subtotalLabel: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  subtotalAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  checkoutButton: {
    paddingVertical: 16,
  },
  checkoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  checkoutText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
  },
});
