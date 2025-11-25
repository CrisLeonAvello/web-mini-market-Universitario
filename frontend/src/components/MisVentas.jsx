import React, { useState, useEffect } from 'react';
import VenderProducto from '../components/VenderProducto';
import { getMyProducts, deleteProduct, toggleProductStatus } from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaPause, FaPlay, FaEye } from 'react-icons/fa';

export default function MisVentas({ onShowProfile, onShowLogin, onLogout, user }) {
  const [misProductos, setMisProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      setError('');
      const productos = await getMyProducts();
      console.log('📦 Mis productos:', productos);
      setMisProductos(productos);
    } catch (err) {
      console.error('❌ Error al cargar productos:', err);
      setError('Error al cargar tus productos');
    } finally {
      setLoading(false);
    }
  };

  const handleProductoCreado = (nuevoProducto) => {
    setMostrarFormulario(false);
    setNotification('✅ Producto publicado exitosamente');
    setTimeout(() => setNotification(''), 3000);
    cargarProductos();
  };

  const handleEliminar = async (productId) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      return;
    }

    try {
      await deleteProduct(productId);
      setNotification('🗑️ Producto eliminado');
      setTimeout(() => setNotification(''), 3000);
      cargarProductos();
    } catch (err) {
      console.error('❌ Error al eliminar:', err);
      setNotification('❌ Error al eliminar el producto');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  const handlePausar = async (productId) => {
    try {
      await toggleProductStatus(productId);
      setNotification('✅ Estado del producto actualizado');
      setTimeout(() => setNotification(''), 3000);
      cargarProductos();
    } catch (err) {
      console.error('❌ Error al cambiar estado:', err);
      setNotification('❌ Error al cambiar el estado');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      disponible: { text: 'Disponible', class: 'badge-disponible' },
      pausado: { text: 'Pausado', class: 'badge-pausado' },
      vendido: { text: 'Vendido', class: 'badge-vendido' },
      eliminado: { text: 'Eliminado', class: 'badge-eliminado' }
    };
    return badges[estado] || badges.disponible;
  };

  return (
    <div className="mis-ventas-page">
      {notification && (
        <div className="notification-toast">
          {notification}
        </div>
      )}

      <div className="mis-ventas-container">
        <div className="mis-ventas-header">
          <div>
            <h1>🏪 Mis Ventas</h1>
            <p>Gestiona tus productos publicados en el marketplace</p>
          </div>
          <button
            className="btn-nuevo-producto"
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
          >
            <FaPlus /> {mostrarFormulario ? 'Cancelar' : 'Nuevo Producto'}
          </button>
        </div>

        {mostrarFormulario && (
          <div className="formulario-section">
            <VenderProducto
              onSuccess={handleProductoCreado}
              onCancel={() => setMostrarFormulario(false)}
            />
          </div>
        )}

        {loading ? (
          <div className="loading-section">
            <div className="loading-spinner"></div>
            <p>Cargando tus productos...</p>
          </div>
        ) : error ? (
          <div className="error-section">
            <p>❌ {error}</p>
            <button className="btn-primary" onClick={cargarProductos}>
              Reintentar
            </button>
          </div>
        ) : misProductos.length === 0 ? (
          <div className="empty-section">
            <div className="empty-icon">📦</div>
            <h3>No tienes productos publicados</h3>
            <p>Comienza publicando tu primer producto para venderlo en el marketplace</p>
            <button
              className="btn-primary"
              onClick={() => setMostrarFormulario(true)}
            >
              <FaPlus /> Publicar Primer Producto
            </button>
          </div>
        ) : (
          <div className="productos-grid">
            {misProductos.map((producto) => (
              <div key={producto.id} className="producto-card-venta">
                <div className="producto-imagen-container">
                  <img
                    src={producto.image || producto.imagen || 'https://via.placeholder.com/300'}
                    alt={producto.title || producto.titulo}
                    className="producto-imagen"
                  />
                  <span className={`producto-estado-badge ${getEstadoBadge(producto.estado || producto.estado_producto).class}`}>
                    {getEstadoBadge(producto.estado || producto.estado_producto).text}
                  </span>
                </div>

                <div className="producto-info">
                  <h3 className="producto-titulo">
                    {producto.title || producto.titulo}
                  </h3>
                  <p className="producto-categoria">
                    {producto.category || producto.categoria}
                  </p>
                  <div className="producto-detalles">
                    <span className="producto-precio">
                      ${(producto.price || producto.precio).toLocaleString('es-CL')}
                    </span>
                    <span className="producto-stock">
                      Stock: {producto.stock}
                    </span>
                  </div>
                </div>

                <div className="producto-acciones">
                  <button
                    className="btn-accion btn-ver"
                    title="Ver en marketplace"
                    onClick={() => {
                      window.location.hash = '#productos';
                    }}
                  >
                    <FaEye />
                  </button>
                  <button
                    className="btn-accion btn-pausar"
                    title={producto.estado === 'pausado' ? 'Reactivar' : 'Pausar'}
                    onClick={() => handlePausar(producto.id || producto.id_producto)}
                  >
                    {producto.estado === 'pausado' ? <FaPlay /> : <FaPause />}
                  </button>
                  <button
                    className="btn-accion btn-eliminar"
                    title="Eliminar"
                    onClick={() => handleEliminar(producto.id || producto.id_producto)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {misProductos.length > 0 && (
          <div className="estadisticas-section">
            <h3>📊 Resumen</h3>
            <div className="estadisticas-grid">
              <div className="stat-card">
                <div className="stat-value">{misProductos.length}</div>
                <div className="stat-label">Total Productos</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">
                  {misProductos.filter(p => (p.estado || p.estado_producto) === 'disponible').length}
                </div>
                <div className="stat-label">Disponibles</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">
                  {misProductos.reduce((acc, p) => acc + (p.stock || 0), 0)}
                </div>
                <div className="stat-label">Stock Total</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">
                  ${misProductos.reduce((acc, p) => acc + ((p.price || p.precio) * (p.stock || 0)), 0).toLocaleString('es-CL')}
                </div>
                <div className="stat-label">Valor Inventario</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
