import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import GradientView from '../components/GradientView';

interface ShippingInfo {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
}

export default function CheckoutScreen({ navigation }: any) {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'transferencia'>('efectivo');
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: user?.nombre || '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  });

  const subtotal = total;
  const shippingCost = subtotal > 50000 ? 0 : 5000;
  const finalTotal = subtotal + shippingCost;

  const handleConfirmOrder = async () => {
    // Validaciones
    if (!shippingInfo.fullName.trim()) {
      Alert.alert('Error', 'Ingresa tu nombre completo');
      return;
    }
    if (!shippingInfo.phone.trim()) {
      Alert.alert('Error', 'Ingresa tu teléfono');
      return;
    }
    if (!shippingInfo.address.trim()) {
      Alert.alert('Error', 'Ingresa tu dirección');
      return;
    }

    setLoading(true);

    try {
      // Aquí iría la llamada al backend para crear la orden
      // Por ahora simulamos el proceso
      await new Promise(resolve => setTimeout(resolve, 1500));

      Alert.alert(
        '¡Pedido Confirmado! 🎉',
        `Tu pedido por $${finalTotal.toLocaleString('es-CL')} ha sido confirmado.\n\nRecibirás un correo con los detalles.`,
        [
          {
            text: 'Ver mis compras',
            onPress: () => {
              clearCart();
              navigation.navigate('PurchaseHistory');
            },
          },
          {
            text: 'Seguir comprando',
            onPress: () => {
              clearCart();
              navigation.navigate('MainTabs', { screen: 'Home' });
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo procesar tu pedido. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <GradientView style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Finalizar Compra</Text>
        <View style={styles.placeholder} />
      </GradientView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Resumen de productos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen del Pedido</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.productItem}>
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>
                  {item.product.nombre}
                </Text>
                <Text style={styles.productQuantity}>
                  x{item.quantity}
                </Text>
              </View>
              <Text style={styles.productPrice}>
                ${(item.product.precio * item.quantity).toLocaleString('es-CL')}
              </Text>
            </View>
          ))}
        </View>

        {/* Información de envío */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de Entrega</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre Completo *</Text>
            <TextInput
              style={styles.input}
              value={shippingInfo.fullName}
              onChangeText={(text) =>
                setShippingInfo({ ...shippingInfo, fullName: text })
              }
              placeholder="Juan Pérez"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono *</Text>
            <TextInput
              style={styles.input}
              value={shippingInfo.phone}
              onChangeText={(text) =>
                setShippingInfo({ ...shippingInfo, phone: text })
              }
              placeholder="+56 9 1234 5678"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dirección *</Text>
            <TextInput
              style={styles.input}
              value={shippingInfo.address}
              onChangeText={(text) =>
                setShippingInfo({ ...shippingInfo, address: text })
              }
              placeholder="Calle Principal 123"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ciudad *</Text>
            <TextInput
              style={styles.input}
              value={shippingInfo.city}
              onChangeText={(text) =>
                setShippingInfo({ ...shippingInfo, city: text })
              }
              placeholder="Santiago"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notas adicionales</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={shippingInfo.notes}
              onChangeText={(text) =>
                setShippingInfo({ ...shippingInfo, notes: text })
              }
              placeholder="Ej: Dejar en portería"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Método de pago */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Método de Pago</Text>
          
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'efectivo' && styles.paymentOptionActive,
            ]}
            onPress={() => setPaymentMethod('efectivo')}
          >
            <View style={styles.paymentContent}>
              <Ionicons
                name="cash"
                size={24}
                color={paymentMethod === 'efectivo' ? '#a855f7' : '#666'}
              />
              <View style={styles.paymentText}>
                <Text style={styles.paymentTitle}>Pago en Efectivo</Text>
                <Text style={styles.paymentSubtitle}>
                  Al momento de la entrega
                </Text>
              </View>
            </View>
            {paymentMethod === 'efectivo' && (
              <Ionicons name="checkmark-circle" size={24} color="#a855f7" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'transferencia' && styles.paymentOptionActive,
            ]}
            onPress={() => setPaymentMethod('transferencia')}
          >
            <View style={styles.paymentContent}>
              <Ionicons
                name="card"
                size={24}
                color={paymentMethod === 'transferencia' ? '#a855f7' : '#666'}
              />
              <View style={styles.paymentText}>
                <Text style={styles.paymentTitle}>Transferencia</Text>
                <Text style={styles.paymentSubtitle}>
                  Coordinar con el vendedor
                </Text>
              </View>
            </View>
            {paymentMethod === 'transferencia' && (
              <Ionicons name="checkmark-circle" size={24} color="#a855f7" />
            )}
          </TouchableOpacity>
        </View>

        {/* Resumen de costos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen de Costos</Text>
          
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Subtotal</Text>
            <Text style={styles.costValue}>
              ${subtotal.toLocaleString('es-CL')}
            </Text>
          </View>

          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Envío</Text>
            <Text style={[styles.costValue, styles.freeShipping]}>
              {shippingCost === 0 ? 'Gratis' : `$${shippingCost.toLocaleString('es-CL')}`}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.costRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              ${finalTotal.toLocaleString('es-CL')}
            </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Botón de confirmar */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confirmButton, loading && styles.confirmButtonDisabled]}
          onPress={handleConfirmOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
              <Text style={styles.confirmButtonText}>
                Confirmar Pedido - ${finalTotal.toLocaleString('es-CL')}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  productInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  productName: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  productQuantity: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#a855f7',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1f2937',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    marginBottom: 12,
  },
  paymentOptionActive: {
    borderColor: '#a855f7',
    backgroundColor: '#faf5ff',
  },
  paymentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  paymentText: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  paymentSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  costLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  costValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  freeShipping: {
    color: '#10b981',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#a855f7',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#a855f7',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
