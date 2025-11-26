import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from './ui/dropdown-menu';

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
      const res = await fetch(`${API_BASE}/productos/mis-productos`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      // La API devuelve un array directamente, no un objeto con productos
      setMyProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading products:', error);
      setMyProducts([]);
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

  const handleToggleProduct = async (productId) => {
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
      'disponible': { text: 'Disponible', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
      'pausado': { text: 'Pausado', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
      'vendido': { text: 'Vendido', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
      'eliminado': { text: 'Eliminado', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
      'pendiente': { text: 'Pendiente', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
      'pagado': { text: 'Pagado', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
      'enviado': { text: 'Enviado', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)' },
      'completado': { text: 'Completado', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
      'cancelado': { text: 'Cancelado', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' }
    };
    const badge = badges[estado?.toLowerCase()] || { text: estado, color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)' };
    return (
      <span style={{
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '600',
        color: badge.color,
        backgroundColor: badge.bg
      }}>
        {badge.text}
      </span>
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
  };

  const renderStars = (rating) => {
    return (
      <div style={{ display: 'flex', gap: '0.25rem' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            style={{
              color: star <= rating ? '#f59e0b' : '#4b5563',
              fontSize: '1.25rem'
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (!user) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#0a0e27',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          backgroundColor: '#1e2139',
          borderRadius: '1rem',
          padding: '3rem',
          textAlign: 'center',
          border: '1px solid rgba(255, 107, 53, 0.3)',
          maxWidth: '500px'
        }}>
          <h2 style={{ 
            fontSize: '1.875rem', 
            color: '#ff6b35',
            marginBottom: '1rem',
            fontWeight: '700'
          }}>
            ⚠️ Acceso Restringido
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
            Debes iniciar sesión para ver tu perfil
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0e27' }}>
      {/* Header - Same as LandingPage */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#0a0e27',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
               onClick={() => window.location.href = '/'}>
            <span style={{ fontSize: '1.75rem' }}></span>
            <div>
              <h1 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '700',
                background: 'linear-gradient(135deg, #ff6b35 0%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0,
                lineHeight: 1
              }}>
                StudiMarket
              </h1>
              <p style={{ 
                fontSize: '0.625rem', 
                color: '#94a3b8',
                margin: 0,
                lineHeight: 1
              }}>
                Marketplace Estudiantil
              </p>
            </div>
          </div>
          
          {/* Navigation */}
          <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <a href='/store' style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'white', 
              textDecoration: 'none', 
              fontSize: '0.875rem', 
              fontWeight: '500' 
            }}>
              <span></span> PRODUCTOS
            </a>
            <a href='/#categorias' style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'white', 
              textDecoration: 'none', 
              fontSize: '0.875rem', 
              fontWeight: '500' 
            }}>
              <span></span> CATEGORÍAS
            </a>
            <a href='/#nosotros' style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'white', 
              textDecoration: 'none', 
              fontSize: '0.875rem', 
              fontWeight: '500' 
            }}>
              NOSOTROS
            </a>
          </nav>

          {/* Search Bar */}
          <div style={{ flex: 1, maxWidth: '400px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '0.5rem',
              padding: '0.5rem 1rem',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <span style={{ marginRight: '0.5rem' }}></span>
              <input
                type='text'
                placeholder='Buscar productos...'
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'white',
                  width: '100%',
                  fontSize: '0.875rem'
                }}
              />
            </div>
          </div>

          {/* User Menu Dropdown */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Avatar>
                    <AvatarImage src={user?.avatar} alt={user?.nombre} />
                    <AvatarFallback>
                      {user?.nombre?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.875rem', color: 'white', fontWeight: '500' }}>
                      {user?.nombre || 'Usuario'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {user?.email || 'Ver perfil'}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>▼</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" style={{ minWidth: '220px' }}>
                <DropdownMenuLabel style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#94a3b8',
                  padding: '0.75rem 1rem 0.5rem'
                }}>
                  MI CUENTA
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => {}} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem'
                }}>
                  <span style={{ fontSize: '1.25rem', color: '#a855f7' }}>👤</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Mi Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log('Mis Pedidos')} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem'
                }}>
                  <span style={{ fontSize: '1.25rem', color: '#f97316' }}>📦</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Mis Pedidos</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log('Favoritos')} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem'
                }}>
                  <span style={{ fontSize: '1.25rem', color: '#ec4899' }}>❤️</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Favoritos</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => console.log('Configuración')} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem'
                }}>
                  <span style={{ fontSize: '1.25rem', color: '#94a3b8' }}>⚙️</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Configuración</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = '/'} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem'
                }}>
                  <span style={{ fontSize: '1.25rem', color: '#ff6b35' }}>🚪</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '2rem',
          overflowX: 'auto',
          borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: 0
        }}>
          {[
            { id: 'perfil', icon: '👤', label: 'Perfil' },
            { id: 'productos', icon: '🛍️', label: 'Mis Productos' },
            { id: 'compras', icon: '🛒', label: 'Compras' },
            { id: 'ventas', icon: '💰', label: 'Ventas' },
            { id: 'valoraciones', icon: '⭐', label: 'Valoraciones' },
            { id: 'estadisticas', icon: '📊', label: 'Estadísticas' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? '3px solid #ff6b35' : '3px solid transparent',
                fontSize: '0.9375rem',
                fontWeight: '500',
                color: activeTab === tab.id ? '#ff6b35' : '#94a3b8',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 107, 53, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.color = '#94a3b8';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{
          backgroundColor: '#1e2139',
          borderRadius: '1rem',
          padding: '2rem',
          minHeight: '400px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {loading ? (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              minHeight: '400px',
              color: '#94a3b8',
              fontSize: '1.125rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '3rem', 
                  height: '3rem', 
                  border: '4px solid rgba(255, 107, 53, 0.2)',
                  borderTop: '4px solid #ff6b35',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1rem'
                }}></div>
                Cargando...
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            </div>
          ) : (
            <>
              {/* TAB: PERFIL */}
              {activeTab === 'perfil' && profile && (
                <div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem'
                  }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', margin: 0 }}>
                      Mi Perfil
                    </h2>
                    {!editMode && (
                      <Button onClick={() => setEditMode(true)}>
                        ✏️ Editar
                      </Button>
                    )}
                  </div>

                  {editMode ? (
                    <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                          Teléfono
                        </label>
                        <Input
                          type="tel"
                          value={formData.telefono}
                          onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                          placeholder="+56912345678"
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                          Ciudad
                        </label>
                        <Input
                          type="text"
                          value={formData.ciudad}
                          onChange={(e) => setFormData({...formData, ciudad: e.target.value})}
                          placeholder="Santiago"
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                          Dirección Completa
                        </label>
                        <Input
                          type="text"
                          value={formData.direccion_completa}
                          onChange={(e) => setFormData({...formData, direccion_completa: e.target.value})}
                          placeholder="Calle, Número, Comuna"
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                          Biografía
                        </label>
                        <textarea
                          value={formData.biografia}
                          onChange={(e) => setFormData({...formData, biografia: e.target.value})}
                          placeholder="Cuéntanos sobre ti..."
                          rows="4"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            backgroundColor: '#0a0e27',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '0.5rem',
                            color: 'white',
                            fontSize: '0.875rem',
                            resize: 'vertical'
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <Button type="submit">💾 Guardar</Button>
                        <Button type="button" variant="secondary" onClick={() => setEditMode(false)}>
                          ❌ Cancelar
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {[
                        { label: 'Teléfono', value: profile.telefono || 'No especificado' },
                        { label: 'Ciudad', value: profile.ciudad || 'No especificada' },
                        { label: 'Dirección', value: profile.direccion_completa || 'No especificada' },
                        { label: 'Biografía', value: profile.biografia || 'Sin biografía' },
                        { label: 'Vendedor', value: profile.es_vendedor ? '✅ Sí' : '❌ No' }
                      ].map((item, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          padding: '1rem',
                          backgroundColor: '#0a0e27',
                          borderRadius: '0.5rem',
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                          <strong style={{ minWidth: '150px', color: '#94a3b8' }}>{item.label}:</strong>
                          <span style={{ color: 'white', flex: 1 }}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: MIS PRODUCTOS */}
              {activeTab === 'productos' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', margin: 0 }}>
                      Mis Productos Publicados
                    </h2>
                    <button
                      onClick={() => window.location.href = '#mis-ventas'}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.75rem',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 16px rgba(168, 85, 247, 0.4)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 24px rgba(168, 85, 247, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(168, 85, 247, 0.4)';
                      }}
                    >
                      <span>📦</span>
                      <span>Publicar Producto</span>
                    </button>
                  </div>
                  {myProducts.length === 0 ? (
                    <div style={{ 
                      textAlign: 'center', 
                      padding: '4rem 2rem',
                      background: 'linear-gradient(135deg, #1a1d3a 0%, #232544 100%)',
                      borderRadius: '1.5rem',
                      border: '2px dashed rgba(148, 163, 184, 0.3)'
                    }}>
                      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
                      <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                        No has publicado productos aún
                      </h3>
                      <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
                        Comienza publicando tu primer producto para venderlo en el marketplace
                      </p>
                      <button
                        onClick={() => window.location.href = '#mis-ventas'}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.875rem 1.75rem',
                          background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.75rem',
                          fontSize: '1rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <span>🚀</span>
                        <span>Publicar Primer Producto</span>
                      </button>
                    </div>
                  ) : (
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                      gap: '1.5rem' 
                    }}>
                      {myProducts.map(product => (
                        <div key={product.id} style={{
                          backgroundColor: '#0a0e27',
                          borderRadius: '0.75rem',
                          overflow: 'hidden',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                          <img 
                            src={product.imagen || '/placeholder.jpg'} 
                            alt={product.title}
                            style={{
                              width: '100%',
                              height: '200px',
                              objectFit: 'cover'
                            }}
                          />
                          <div style={{ padding: '1rem' }}>
                            <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: '0.5rem', fontWeight: '600' }}>
                              {product.title}
                            </h3>
                            <p style={{ color: '#ff6b35', fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                              {formatPrice(product.price)}
                            </p>
                            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                              Stock: {product.stock}
                            </p>
                            <div style={{ marginBottom: '1rem' }}>
                              {getEstadoBadge(product.estado)}
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                              {product.estado === 'disponible' && (
                                <Button
                                  variant="warning"
                                  size="sm"
                                  onClick={() => handleToggleProduct(product.id)}
                                  style={{ flex: 1 }}
                                >
                                  ⏸️ Pausar
                                </Button>
                              )}
                              {product.estado === 'pausado' && (
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() => handleToggleProduct(product.id)}
                                  style={{ flex: 1 }}
                                >
                                  ▶️ Activar
                                </Button>
                              )}
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                                style={{ flex: 1 }}
                              >
                                🗑️ Eliminar
                              </Button>
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
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '2rem' }}>
                    Mis Compras
                  </h2>
                  {myPurchases.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '1.125rem', padding: '3rem' }}>
                      No has realizado compras aún
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {myPurchases.map(purchase => (
                        <div key={purchase.id_venta} style={{
                          backgroundColor: '#0a0e27',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '0.75rem',
                          padding: '1.5rem'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <h3 style={{ color: 'white', fontSize: '1.125rem', fontWeight: '600' }}>
                              {purchase.producto_titulo}
                            </h3>
                            {getEstadoBadge(purchase.estado)}
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                            <p><strong style={{ color: 'white' }}>Vendedor:</strong> {purchase.vendedor_nombre}</p>
                            <p><strong style={{ color: 'white' }}>Cantidad:</strong> {purchase.cantidad}</p>
                            <p><strong style={{ color: 'white' }}>Total:</strong> <span style={{ color: '#ff6b35', fontWeight: '600' }}>{formatPrice(purchase.precio_total)}</span></p>
                            <p><strong style={{ color: 'white' }}>Fecha:</strong> {new Date(purchase.fecha_venta).toLocaleDateString()}</p>
                            <p style={{ gridColumn: '1 / -1' }}><strong style={{ color: 'white' }}>Método de pago:</strong> {purchase.metodo_pago}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: VENTAS */}
              {activeTab === 'ventas' && (
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '2rem' }}>
                    Mis Ventas
                  </h2>
                  {mySales.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '1.125rem', padding: '3rem' }}>
                      No has realizado ventas aún
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {mySales.map(sale => (
                        <div key={sale.id_venta} style={{
                          backgroundColor: '#0a0e27',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '0.75rem',
                          padding: '1.5rem'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <h3 style={{ color: 'white', fontSize: '1.125rem', fontWeight: '600' }}>
                              {sale.producto_titulo}
                            </h3>
                            {getEstadoBadge(sale.estado)}
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                            <p><strong style={{ color: 'white' }}>Comprador:</strong> {sale.comprador_nombre}</p>
                            <p><strong style={{ color: 'white' }}>Cantidad:</strong> {sale.cantidad}</p>
                            <p><strong style={{ color: 'white' }}>Total:</strong> <span style={{ color: '#ff6b35', fontWeight: '600' }}>{formatPrice(sale.precio_total)}</span></p>
                            <p><strong style={{ color: 'white' }}>Comisión:</strong> {formatPrice(sale.comision)}</p>
                            <p><strong style={{ color: 'white' }}>Ganancia:</strong> <span style={{ color: '#22c55e', fontWeight: '600' }}>{formatPrice(sale.ganancia_neta)}</span></p>
                            <p><strong style={{ color: 'white' }}>Fecha:</strong> {new Date(sale.fecha_venta).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: VALORACIONES */}
              {activeTab === 'valoraciones' && (
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '2rem' }}>
                    Valoraciones Recibidas
                  </h2>
                  {myRatings.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '1.125rem', padding: '3rem' }}>
                      No has recibido valoraciones aún
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {myRatings.map(rating => (
                        <div key={rating.id} style={{
                          backgroundColor: '#0a0e27',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '0.75rem',
                          padding: '1.5rem'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <strong style={{ color: 'white', fontSize: '1rem' }}>{rating.evaluador_nombre}</strong>
                            {renderStars(rating.calificacion)}
                          </div>
                          <p style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>
                            {rating.comentario}
                          </p>
                          <p style={{ color: '#64748b', fontSize: '0.75rem' }}>
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
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '2rem' }}>
                    Mis Estadísticas
                  </h2>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                    gap: '1.5rem' 
                  }}>
                    <div style={{
                      backgroundColor: '#0a0e27',
                      border: '2px solid rgba(255, 107, 53, 0.3)',
                      borderRadius: '1rem',
                      padding: '2rem',
                      textAlign: 'center'
                    }}>
                      <h3 style={{ fontSize: '1.125rem', color: '#ff6b35', marginBottom: '1rem' }}>📦 Productos</h3>
                      <p style={{ fontSize: '3rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>
                        {stats.productos?.total || 0}
                      </p>
                      <p style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Total publicados</p>
                      <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                        Activos: {stats.productos?.activos || 0}
                      </p>
                    </div>
                    <div style={{
                      backgroundColor: '#0a0e27',
                      border: '2px solid rgba(168, 85, 247, 0.3)',
                      borderRadius: '1rem',
                      padding: '2rem',
                      textAlign: 'center'
                    }}>
                      <h3 style={{ fontSize: '1.125rem', color: '#a855f7', marginBottom: '1rem' }}>💰 Ventas</h3>
                      <p style={{ fontSize: '3rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>
                        {stats.ventas?.total || 0}
                      </p>
                      <p style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Total ventas</p>
                      <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                        {formatPrice(stats.ventas?.ingresos_totales || 0)}
                      </p>
                    </div>
                    <div style={{
                      backgroundColor: '#0a0e27',
                      border: '2px solid rgba(245, 158, 11, 0.3)',
                      borderRadius: '1rem',
                      padding: '2rem',
                      textAlign: 'center'
                    }}>
                      <h3 style={{ fontSize: '1.125rem', color: '#f59e0b', marginBottom: '1rem' }}>⭐ Reputación</h3>
                      <p style={{ fontSize: '3rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>
                        {stats.reputacion?.calificacion_promedio?.toFixed(1) || '0.0'}
                      </p>
                      <p style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>Calificación promedio</p>
                      <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
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
    </div>
  );
};

export default UserProfile;
