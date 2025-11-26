import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../constants/config';

interface OrderItem {
  id: number;
  producto_id: number;
  cantidad: number;
  precio: number;
  producto: {
    id: number;
    nombre: string;
    imagen?: string;
  };
}

interface Order {
  id: number;
  fecha_compra: string;
  total: number;
  estado: string;
  metodo_pago: string;
  direccion_envio?: string;
  items: OrderItem[];
}

export default function PurchaseHistoryScreen() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/ventas/comprador/${user?.id_usuario}`, {
        headers: {
          Authorization: `Bearer ${user?.id_usuario}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar compras');
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert('Error', 'No se pudieron cargar tus compras');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const toggleOrderExpanded = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendiente':
        return '#f59e0b';
      case 'completada':
        return '#10b981';
      case 'cancelada':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendiente':
        return 'Pendiente';
      case 'completada':
        return 'Completada';
      case 'cancelada':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const renderOrderItem = ({ item }: { item: OrderItem }) => (
    <View style={styles.orderItem}>
      <Image
        source={{
          uri: item.producto.imagen || 'https://via.placeholder.com/80',
        }}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.producto.nombre}
        </Text>
        <Text style={styles.productQuantity}>
          Cantidad: {item.cantidad}
        </Text>
        <Text style={styles.productPrice}>
          {formatPrice(item.precio)}
        </Text>
      </View>
      <Text style={styles.itemTotal}>
        {formatPrice(item.precio * item.cantidad)}
      </Text>
    </View>
  );

  const renderOrder = ({ item: order }: { item: Order }) => {
    const isExpanded = expandedOrder === order.id;

    return (
      <View style={styles.orderCard}>
        <TouchableOpacity
          style={styles.orderHeader}
          onPress={() => toggleOrderExpanded(order.id)}
          activeOpacity={0.7}
        >
          <View style={styles.orderHeaderLeft}>
            <Text style={styles.orderId}>Pedido #{order.id}</Text>
            <Text style={styles.orderDate}>{formatDate(order.fecha_compra)}</Text>
          </View>
          <View style={styles.orderHeaderRight}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(order.estado) },
              ]}
            >
              <Text style={styles.statusText}>
                {getStatusText(order.estado)}
              </Text>
            </View>
            <Text style={styles.orderTotal}>{formatPrice(order.total)}</Text>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.orderDetails}>
            <View style={styles.orderInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Método de pago:</Text>
                <Text style={styles.infoValue}>
                  {order.metodo_pago === 'efectivo'
                    ? 'Efectivo'
                    : 'Transferencia'}
                </Text>
              </View>
              {order.direccion_envio && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Dirección:</Text>
                  <Text style={styles.infoValue} numberOfLines={2}>
                    {order.direccion_envio}
                  </Text>
                </View>
              )}
            </View>

            <Text style={styles.itemsTitle}>Productos:</Text>
            <FlatList
              data={order.items}
              renderItem={renderOrderItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          </View>
        )}
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📦</Text>
      <Text style={styles.emptyTitle}>No hay compras</Text>
      <Text style={styles.emptyText}>
        Tus compras aparecerán aquí una vez que realices tu primer pedido
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#a855f7" />
        <Text style={styles.loadingText}>Cargando compras...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={
          orders.length === 0 ? styles.emptyListContainer : styles.listContainer
        }
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#a855f7']}
            tintColor="#a855f7"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  listContainer: {
    padding: 16,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    maxWidth: 300,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  orderHeaderLeft: {
    flex: 1,
  },
  orderHeaderRight: {
    alignItems: 'flex-end',
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  orderTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#a855f7',
    marginTop: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  orderDetails: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  orderInfo: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#1f2937',
    flex: 1,
    textAlign: 'right',
    marginLeft: 16,
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 14,
    color: '#a855f7',
    fontWeight: '600',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 8,
  },
});
