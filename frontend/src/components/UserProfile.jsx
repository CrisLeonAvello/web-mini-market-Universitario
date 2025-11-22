import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './UserProfile.css';

const UserProfile = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('perfil');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [myProducts, setMyProducts] = useState([]);
  const [myPurchases, setMyPurchases] = useState([]);
  const [mySales, setSales] = useState([]);
  const [myRatings, setMyRatings] = useState([]);
  const [stats, setStats] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    telefono: '',
    ciudad: '',
    direccion_completa: '',
    biografia: ''
  });

  const API_BASE = 'http://localhost:8000/api';

  useEffect(() => {
    if (activeTab === 'perfil') loadProfile();
    else if (activeTab === 'productos') loadMyProducts();
    else if (activeTab === 'compras') loadMyPurchases();
    else if (activeTab === 'ventas') loadMySales();
    else if (activeTab === 'valoraciones') loadMyRatings();
    else if (activeTab === 'estadisticas') loadStats();
  }, [activeTab, token]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users/me/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setProfile(data);
      setFormData({
        telefono: data.telefono || '',
        ciudad: data.ciudad || '',
        direccion_completa: data.direccion_completa || '',
        biografia: data.biografia || ''
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    }
    setLoading(false);
  };

  const loadMyProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users/me/productos`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setMyProducts(data.productos || []);
    } catch (error) {
      console.error('Error loading products:', error);
    }
    setLoading(false);
  };

  const loadMyPurchases = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users/me/compras`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setMyPurchases(data.compras || []);
    } catch (error) {
      console.error('Error loading purchases:', error);
    }
    setLoading(false);
  };

  const loadMySales = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users/me/ventas`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setSales(data.ventas || []);
    } catch (error) {
      console.error('Error loading sales:', error);
    }
    setLoading(false);
  };

  const loadMyRatings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users/me/valoraciones`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setMyRatings(data.valoraciones || []);
    } catch (error) {
      console.error('Error loading ratings:', error);
    }
    setLoading(false);
  };

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users/me/estadisticas`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
    setLoading(false);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/users/me/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert('Perfil actualizado exitosamente');
        setEditMode(false);
        loadProfile();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error al actualizar perfil');
    }
  };

  const handleToggleProduct = async (productId, currentState) => {
    try {
      const res = await fetch(`${API_BASE}/productos/${productId}/pausar`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        loadMyProducts();
      }
    } catch (error) {
      console.error('Error toggling product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      const res = await fetch(`${API_BASE}/productos/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Producto eliminado');
        loadMyProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      'disponible': { text: 'Disponible', class: 'badge-success' },
      'pausado': { text: 'Pausado', class: 'badge-warning' },
      'vendido': { text: 'Vendido', class: 'badge-info' },
      'eliminado': { text: 'Eliminado', class: 'badge-danger' },
      'pendiente': { text: 'Pendiente', class: 'badge-warning' },
      'pagado': { text: 'Pagado', class: 'badge-info' },
      'enviado': { text: 'Enviado', class: 'badge-primary' },
      'completado': { text: 'Completado', class: 'badge-success' },
      'cancelado': { text: 'Cancelado', class: 'badge-danger' }
    };
    const badge = badges[estado?.toLowerCase()] || { text: estado, class: 'badge-secondary' };
    return <span className={`badge ${badge.class}`}>{badge.text}</span>;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
  };

  const renderStars = (rating) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map(star => (
          <span key={star} className={star <= rating ? 'star filled' : 'star'}>★</span>
        ))}
      </div>
    );
  };

  if (!user) {
    return (
      <div className="user-profile">
        <div className="profile-error">
          <h2>⚠️ Acceso Restringido</h2>
          <p>Debes iniciar sesión para ver tu perfil</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-placeholder">
            {user.nombre?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
        <div className="profile-info">
          <h1>{user.nombre} {user.apellido}</h1>
          <p className="profile-email">{user.email}</p>
          {profile && (
            <div className="profile-stats-mini">
              {profile.es_vendedor && (
                <>
                  <span>⭐ {profile.calificacion_vendedor?.toFixed(1) || '0.0'}</span>
                  <span>📦 {profile.total_ventas || 0} ventas</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={activeTab === 'perfil' ? 'active' : ''} 
          onClick={() => setActiveTab('perfil')}
        >
          👤 Perfil
        </button>
        <button 
          className={activeTab === 'productos' ? 'active' : ''} 
          onClick={() => setActiveTab('productos')}
        >
          🛍️ Mis Productos
        </button>
        <button 
          className={activeTab === 'compras' ? 'active' : ''} 
          onClick={() => setActiveTab('compras')}
        >
          🛒 Compras
        </button>
        <button 
          className={activeTab === 'ventas' ? 'active' : ''} 
          onClick={() => setActiveTab('ventas')}
        >
          💰 Ventas
        </button>
        <button 
          className={activeTab === 'valoraciones' ? 'active' : ''} 
          onClick={() => setActiveTab('valoraciones')}
        >
          ⭐ Valoraciones
        </button>
        <button 
          className={activeTab === 'estadisticas' ? 'active' : ''} 
          onClick={() => setActiveTab('estadisticas')}
        >
          📊 Estadísticas
        </button>
      </div>

      <div className="profile-content">
        {loading ? (
          <div className="loading-spinner">Cargando...</div>
        ) : (
          <>
            {/* TAB: PERFIL */}
            {activeTab === 'perfil' && profile && (
              <div className="tab-content">
                <div className="section-header">
                  <h2>Mi Perfil</h2>
                  {!editMode && (
                    <button className="btn-edit" onClick={() => setEditMode(true)}>
                      ✏️ Editar
                    </button>
                  )}
                </div>

                {editMode ? (
                  <form onSubmit={handleUpdateProfile} className="profile-form">
                    <div className="form-group">
                      <label>Teléfono</label>
                      <input
                        type="tel"
                        value={formData.telefono}
                        onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                        placeholder="+56912345678"
                      />
                    </div>
                    <div className="form-group">
                      <label>Ciudad</label>
                      <input
                        type="text"
                        value={formData.ciudad}
                        onChange={(e) => setFormData({...formData, ciudad: e.target.value})}
                        placeholder="Santiago"
                      />
                    </div>
                    <div className="form-group">
                      <label>Dirección Completa</label>
                      <input
                        type="text"
                        value={formData.direccion_completa}
                        onChange={(e) => setFormData({...formData, direccion_completa: e.target.value})}
                        placeholder="Calle, Número, Comuna"
                      />
                    </div>
                    <div className="form-group">
                      <label>Biografía</label>
                      <textarea
                        value={formData.biografia}
                        onChange={(e) => setFormData({...formData, biografia: e.target.value})}
                        placeholder="Cuéntanos sobre ti..."
                        rows="4"
                      />
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="btn-primary">💾 Guardar</button>
                      <button type="button" className="btn-secondary" onClick={() => setEditMode(false)}>
                        ❌ Cancelar
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="profile-details">
                    <div className="detail-item">
                      <strong>Teléfono:</strong>
                      <span>{profile.telefono || 'No especificado'}</span>
                    </div>
                    <div className="detail-item">
                      <strong>Ciudad:</strong>
                      <span>{profile.ciudad || 'No especificada'}</span>
                    </div>
                    <div className="detail-item">
                      <strong>Dirección:</strong>
                      <span>{profile.direccion_completa || 'No especificada'}</span>
                    </div>
                    <div className="detail-item">
                      <strong>Biografía:</strong>
                      <span>{profile.biografia || 'Sin biografía'}</span>
                    </div>
                    <div className="detail-item">
                      <strong>Vendedor:</strong>
                      <span>{profile.es_vendedor ? '✅ Sí' : '❌ No'}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: MIS PRODUCTOS */}
            {activeTab === 'productos' && (
              <div className="tab-content">
                <div className="section-header">
                  <h2>Mis Productos Publicados</h2>
                </div>
                {myProducts.length === 0 ? (
                  <p className="empty-message">No has publicado productos aún</p>
                ) : (
                  <div className="products-grid">
                    {myProducts.map(product => (
                      <div key={product.id} className="product-card">
                        <img src={product.imagen || '/placeholder.jpg'} alt={product.title} />
                        <div className="product-info">
                          <h3>{product.title}</h3>
                          <p className="product-price">{formatPrice(product.price)}</p>
                          <p className="product-stock">Stock: {product.stock}</p>
                          {getEstadoBadge(product.estado)}
                          <div className="product-actions">
                            {product.estado === 'disponible' && (
                              <button 
                                className="btn-warning-sm"
                                onClick={() => handleToggleProduct(product.id, product.estado)}
                              >
                                ⏸️ Pausar
                              </button>
                            )}
                            {product.estado === 'pausado' && (
                              <button 
                                className="btn-success-sm"
                                onClick={() => handleToggleProduct(product.id, product.estado)}
                              >
                                ▶️ Activar
                              </button>
                            )}
                            <button 
                              className="btn-danger-sm"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              🗑️ Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: COMPRAS */}
            {activeTab === 'compras' && (
              <div className="tab-content">
                <h2>Mis Compras</h2>
                {myPurchases.length === 0 ? (
                  <p className="empty-message">No has realizado compras aún</p>
                ) : (
                  <div className="transactions-list">
                    {myPurchases.map(purchase => (
                      <div key={purchase.id_venta} className="transaction-card">
                        <div className="transaction-header">
                          <h3>{purchase.producto_titulo}</h3>
                          {getEstadoBadge(purchase.estado)}
                        </div>
                        <div className="transaction-details">
                          <p><strong>Vendedor:</strong> {purchase.vendedor_nombre}</p>
                          <p><strong>Cantidad:</strong> {purchase.cantidad}</p>
                          <p><strong>Total:</strong> {formatPrice(purchase.precio_total)}</p>
                          <p><strong>Fecha:</strong> {new Date(purchase.fecha_venta).toLocaleDateString()}</p>
                          <p><strong>Método de pago:</strong> {purchase.metodo_pago}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: VENTAS */}
            {activeTab === 'ventas' && (
              <div className="tab-content">
                <h2>Mis Ventas</h2>
                {mySales.length === 0 ? (
                  <p className="empty-message">No has realizado ventas aún</p>
                ) : (
                  <div className="transactions-list">
                    {mySales.map(sale => (
                      <div key={sale.id_venta} className="transaction-card">
                        <div className="transaction-header">
                          <h3>{sale.producto_titulo}</h3>
                          {getEstadoBadge(sale.estado)}
                        </div>
                        <div className="transaction-details">
                          <p><strong>Comprador:</strong> {sale.comprador_nombre}</p>
                          <p><strong>Cantidad:</strong> {sale.cantidad}</p>
                          <p><strong>Total:</strong> {formatPrice(sale.precio_total)}</p>
                          <p><strong>Comisión:</strong> {formatPrice(sale.comision)}</p>
                          <p><strong>Ganancia:</strong> {formatPrice(sale.ganancia_neta)}</p>
                          <p><strong>Fecha:</strong> {new Date(sale.fecha_venta).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: VALORACIONES */}
            {activeTab === 'valoraciones' && (
              <div className="tab-content">
                <h2>Valoraciones Recibidas</h2>
                {myRatings.length === 0 ? (
                  <p className="empty-message">No has recibido valoraciones aún</p>
                ) : (
                  <div className="ratings-list">
                    {myRatings.map(rating => (
                      <div key={rating.id} className="rating-card">
                        <div className="rating-header">
                          <strong>{rating.evaluador_nombre}</strong>
                          {renderStars(rating.calificacion)}
                        </div>
                        <p className="rating-comment">{rating.comentario}</p>
                        <p className="rating-date">
                          {new Date(rating.fecha).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: ESTADÍSTICAS */}
            {activeTab === 'estadisticas' && stats && (
              <div className="tab-content">
                <h2>Mis Estadísticas</h2>
                <div className="stats-grid">
                  <div className="stat-card">
                    <h3>📦 Productos</h3>
                    <p className="stat-number">{stats.productos?.total || 0}</p>
                    <p className="stat-label">Total publicados</p>
                    <p className="stat-secondary">Activos: {stats.productos?.activos || 0}</p>
                  </div>
                  <div className="stat-card">
                    <h3>💰 Ventas</h3>
                    <p className="stat-number">{stats.ventas?.total || 0}</p>
                    <p className="stat-label">Total ventas</p>
                    <p className="stat-secondary">
                      {formatPrice(stats.ventas?.ingresos_totales || 0)}
                    </p>
                  </div>
                  <div className="stat-card">
                    <h3>⭐ Reputación</h3>
                    <p className="stat-number">
                      {stats.reputacion?.calificacion_promedio?.toFixed(1) || '0.0'}
                    </p>
                    <p className="stat-label">Calificación promedio</p>
                    <p className="stat-secondary">
                      {stats.reputacion?.total_valoraciones || 0} valoraciones
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
