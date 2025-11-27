import { apiRequest } from './api';

export interface CreateOrderData {
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  metodo_pago: string;
  direccion_envio: string;
  telefono_contacto: string;
}

export interface Order {
  id_venta: number;
  producto_id: number;
  comprador_id: number;
  vendedor_id: number;
  cantidad: number;
  precio_unitario: number;
  precio_total: number;
  estado_venta: string;
  metodo_pago: string;
  direccion_envio: string;
  telefono_contacto: string;
  fecha_venta: string;
  producto: any;
  vendedor: any;
  comprador: any;
}

// Crear nueva orden/venta
export const createOrder = async (data: CreateOrderData): Promise<Order> => {
  return await apiRequest('/ventas', {
    method: 'POST',
    data,
  });
};

// Obtener órdenes del usuario (compras)
export const getMyOrders = async (): Promise<Order[]> => {
  const response = await apiRequest('/ventas/mis-compras', {
    method: 'GET',
  });
  return response.ventas || response;
};

// Obtener ventas del usuario (como vendedor)
export const getMySales = async (): Promise<Order[]> => {
  const response = await apiRequest('/ventas/mis-ventas', {
    method: 'GET',
  });
  return response.ventas || response;
};

// Obtener detalle de una orden
export const getOrderById = async (orderId: number): Promise<Order> => {
  return await apiRequest(`/ventas/${orderId}`, {
    method: 'GET',
  });
};

// Actualizar estado de la venta (solo vendedor)
export const updateOrderStatus = async (orderId: number, estado: string): Promise<Order> => {
  return await apiRequest(`/ventas/${orderId}/estado`, {
    method: 'PATCH',
    data: { estado_venta: estado },
  });
};

// Cancelar venta (solo comprador, antes de envío)
export const cancelOrder = async (orderId: number): Promise<Order> => {
  return await apiRequest(`/ventas/${orderId}/cancelar`, {
    method: 'PATCH',
  });
};

export const orderService = {
  createOrder,
  getMyOrders,
  getMySales,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};
