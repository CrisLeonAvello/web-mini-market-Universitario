import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './ui/ImageWithFallback';
import { Badge } from './Badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Tooltip } from './ui/tooltip';

export default function LandingPage({ onEnterStore, onShowLogin, onShowProfile, onShowProductos, user, onLogout }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const categories = [
    { name: 'Tecnología', icon: '💻', items: 250, color: '#3b82f6' },
    { name: 'Libros', icon: '📚', items: 320, color: '#ec4899' },
    { name: 'Audio', icon: '🎧', items: 120, color: '#f97316' },
    { name: 'Accesorios', icon: '🎒', items: 180, color: '#10b981' },
    { name: 'Snacks', icon: '☕', items: 95, color: '#f59e0b' },
    { name: 'Papelería', icon: '✏️', items: 150, color: '#a855f7' },
  ];

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/products');
        const data = await response.json();
        setFeaturedProducts(data.products.slice(0, 3));
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };
    loadFeaturedProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage((prev) => (prev + 1) % categories.length);
        setIsFlipping(false);
      }, 600);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const getBadgeVariant = (index) => {
    if (index === 0) return 'popular';
    if (index === 1) return 'nuevo';
    if (index === 2) return 'trending';
    return 'default';
  };

  const getBadgeText = (index) => {
    if (index === 0) return 'Popular';
    if (index === 1) return 'Nuevo';
    if (index === 2) return 'Trending';
    return '';
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0e27' }}>
      {/* Header */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
            <button
              onClick={onShowProductos}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                textDecoration: 'none',
                padding: 0
              }}
            >
              <span></span> PRODUCTOS
            </button>
            <a href='#categorias' style={{ 
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
            <a href='#nosotros' style={{ 
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

          {/* Auth Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {!user ? (
              <Button 
                onClick={onShowLogin}
                style={{
                  backgroundColor: '#ff6b35',
                  color: 'white',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>🔐</span> INICIAR SESIÓN
              </Button>
            ) : (
              <>
                {/* Botón Vender */}
                <button 
                  className="btn-publicar-producto-header"
                  onClick={() => window.location.href='#mis-ventas'}
                  title="Publicar producto para vender"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 8px rgba(168, 85, 247, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(168, 85, 247, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(168, 85, 247, 0.3)';
                  }}
                >
                  <span>📦</span>
                  <span>Vender</span>
                </button>
                
                {/* User Menu Dropdown */}
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
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback>
                          {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '0.875rem', color: 'white', fontWeight: '500' }}>
                          {user?.name || 'Usuario'}
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
                    <DropdownMenuItem onClick={onShowProfile} style={{
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
                    <DropdownMenuItem onClick={onLogout} style={{
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
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with Book Animation */}
      <section style={{ padding: '3rem 2rem', position: 'relative' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Badge */}
          <div style={{ marginBottom: '2rem' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: 'rgba(168, 85, 247, 0.2)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              borderRadius: '9999px',
              color: '#a855f7',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
               ESTUDIANTES
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            {/* Left Content */}
            <div>
              <h1 style={{
                fontSize: '3.5rem',
                fontWeight: '700',
                lineHeight: '1.1',
                marginBottom: '1.5rem'
              }}>
                <span style={{ color: 'white' }}>Descubre el mejor</span>
                <br />
                <span style={{ 
                  background: 'linear-gradient(135deg, #ff6b35 0%, #f97316 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  marketplace
                </span>
                <br />
                <span style={{ 
                  background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  estudiantil
                </span>
              </h1>
              <p style={{
                fontSize: '1.125rem',
                color: '#94a3b8',
                marginBottom: '2rem',
                lineHeight: '1.6'
              }}>
                Encuentra todo lo que necesitas para tu vida estudiantil. Productos de calidad, tecnología, libros y más.
              </p>
            </div>
            {/* Right - Book Animation */}
            <div style={{
              position: 'relative',
              perspective: '1200px',
              minHeight: '500px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Book Container */}
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '400px',
                paddingTop: '75%'
              }}>
                {/* Book Spine/Binding */}
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  width: '16px',
                  height: '100%',
                  background: 'linear-gradient(to right, #ea580c, #c2410c)',
                  transform: 'translateX(-50%)',
                  borderRadius: '4px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  zIndex: 20
                }}></div>

                {/* Left Page (Static) */}
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '50%',
                  height: '100%',
                  background: 'linear-gradient(-135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.05) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderTopLeftRadius: '0.5rem',
                  borderBottomLeftRadius: '0.5rem',
                  boxShadow: isFlipping 
                    ? '5px 0 15px rgba(0, 0, 0, 0.2)' 
                    : '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  backdropFilter: 'blur(8px)',
                  overflow: 'hidden',
                  transition: 'box-shadow 0.4s ease-in-out'
                }}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}></div>
                    <h3 style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem', margin: '0.25rem 0' }}>Explora</h3>
                    <h3 style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem', margin: '0.25rem 0' }}>Nuestras</h3>
                    <h3 style={{ 
                      textAlign: 'center',
                      background: 'linear-gradient(to right, #fb923c, #c084fc)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: '1rem',
                      margin: '0.25rem 0'
                    }}>
                      Categorías
                    </h3>
                  </div>
                </div>

                {/* Right Page (Animated) */}
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  width: '50%',
                  height: '100%',
                  transformOrigin: 'left center',
                  transition: 'transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)',
                  transformStyle: 'preserve-3d',
                  transform: isFlipping ? 'rotateY(-180deg)' : 'rotateY(0deg)',
                  boxShadow: isFlipping 
                    ? '-5px 0 20px rgba(0, 0, 0, 0.3)' 
                    : '0 0 0 rgba(0, 0, 0, 0)'
                }}>
                  {/* Front of Page (Current Category) */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.05) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderTopRightRadius: '0.5rem',
                    borderBottomRightRadius: '0.5rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(8px)',
                    overflow: 'hidden',
                    backfaceVisibility: 'hidden',
                    transition: 'opacity 0.3s ease-in-out'
                  }}>
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      padding: '2rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '1rem'
                    }}>
                      <div style={{ fontSize: '3rem' }}>
                        {categories[currentPage].icon}
                      </div>
                      <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '1.5rem',
                        background: `linear-gradient(to bottom right, ${categories[currentPage].color}, ${categories[currentPage].color}dd)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 10px 25px ${categories[currentPage].color}40`
                      }}>
                        <span style={{ fontSize: '2.5rem' }}>{categories[currentPage].icon}</span>
                      </div>
                      <h3 style={{
                        textAlign: 'center',
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        color: categories[currentPage].color,
                        textShadow: `0 0 20px ${categories[currentPage].color}40`,
                        margin: 0
                      }}>
                        {categories[currentPage].name}
                      </h3>
                      <div style={{
                        display: 'flex',
                        gap: '0.25rem',
                        marginTop: '0.5rem'
                      }}>
                        {categories.map((_, index) => (
                          <div
                            key={index}
                            style={{
                              width: index === currentPage ? '1.5rem' : '0.5rem',
                              height: '0.5rem',
                              borderRadius: '9999px',
                              backgroundColor: index === currentPage ? '#f97316' : 'rgba(255, 255, 255, 0.2)',
                              transition: 'all 0.3s'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Back of Page (Next Category) */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(-135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.05) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderTopRightRadius: '0.5rem',
                    borderBottomRightRadius: '0.5rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(8px)',
                    overflow: 'hidden',
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    transition: 'opacity 0.3s ease-in-out'
                  }}>
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      padding: '2rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '1rem',
                      transform: 'scaleX(-1)'
                    }}>
                      <div style={{ fontSize: '3rem' }}>
                        {categories[(currentPage + 1) % categories.length].icon}
                      </div>
                      <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '1.5rem',
                        background: `linear-gradient(to bottom right, ${categories[(currentPage + 1) % categories.length].color}, ${categories[(currentPage + 1) % categories.length].color}dd)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 10px 25px ${categories[(currentPage + 1) % categories.length].color}40`
                      }}>
                        <span style={{ fontSize: '2.5rem' }}>{categories[(currentPage + 1) % categories.length].icon}</span>
                      </div>
                      <h3 style={{
                        textAlign: 'center',
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        color: categories[(currentPage + 1) % categories.length].color,
                        textShadow: `0 0 20px ${categories[(currentPage + 1) % categories.length].color}40`,
                        margin: 0
                      }}>
                        {categories[(currentPage + 1) % categories.length].name}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Page Count Indicator */}
              <div style={{
                position: 'absolute',
                bottom: '-2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '0.875rem',
                color: '#6b7280'
              }}>
                Página {currentPage + 1} de {categories.length}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id='categorias' style={{ padding: '4rem 2rem', backgroundColor: '#0a0e27' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>
              Explora por Categoría
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.125rem' }}>
              Encuentra exactamente lo que necesitas
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.5rem'
          }}>
            {categories.map((category, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '1rem',
                  padding: '2rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 1rem',
                  backgroundColor: category.color,
                  borderRadius: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem'
                }}>
                  {category.icon}
                </div>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  color: 'white',
                  marginBottom: '0.5rem' 
                }}>
                  {category.name}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                  {category.items} items
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id='productos' style={{ padding: '4rem 2rem', backgroundColor: '#0a0e27' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>
              Productos Destacados
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.125rem' }}>
              Los favoritos de la comunidad estudiantil
            </p>
          </div>

          {loadingProducts ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '2rem' }}></div>
              <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Cargando productos...</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '2rem'
            }}>
              {featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '1.5rem',
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Badge */}
                  {getBadgeText(index) && (
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 }}>
                      <Badge variant={getBadgeVariant(index)}>
                        {getBadgeText(index)}
                      </Badge>
                    </div>
                  )}

                  {/* Image */}
                  <div style={{
                    width: '100%',
                    height: '280px',
                    backgroundColor: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{
                        fontSize: '0.75rem',
                        color: '#94a3b8',
                        textTransform: 'capitalize'
                      }}>
                        {product.category}
                      </span>
                      <span style={{ color: '#94a3b8' }}></span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span style={{ color: '#fbbf24' }}></span>
                        <span style={{ fontSize: '0.875rem', color: 'white', fontWeight: '600' }}>
                          {4.5 + (index * 0.1)}
                        </span>
                      </div>
                    </div>

                    <h3 style={{ 
                      fontSize: '1.125rem', 
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '1rem',
                      minHeight: '2.5rem'
                    }}>
                      {product.name}
                    </h3>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ 
                        fontSize: '1.75rem', 
                        fontWeight: '700',
                        color: '#ff6b35'
                      }}>
                        ${product.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section style={{ padding: '4rem 2rem', backgroundColor: '#0a0e27' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'center'
          }}>
            {/* Left - Images Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem'
            }}>
              <div style={{
                borderRadius: '1rem',
                overflow: 'hidden',
                height: '200px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
              }}>
                <img 
                  src='https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop' 
                  alt='Estudiante'
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{
                borderRadius: '1rem',
                overflow: 'hidden',
                height: '200px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
              }}>
                <img 
                  src='https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=400&h=400&fit=crop' 
                  alt='Apple Watch'
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{
                borderRadius: '1rem',
                overflow: 'hidden',
                height: '200px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
              }}>
                <img 
                  src='https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=400&fit=crop' 
                  alt='Oficina'
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{
                borderRadius: '1rem',
                overflow: 'hidden',
                height: '200px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
              }}>
                <img 
                  src='https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=400&fit=crop' 
                  alt='Universidad'
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Right - Content */}
            <div>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                marginBottom: '1rem'
              }}>
                <span style={{ 
                  background: 'linear-gradient(135deg, #ff6b35 0%, #ec4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Tu tienda
                </span>
                <br />
                <span style={{ color: 'white' }}>de confianza</span>
              </h2>
              <p style={{
                fontSize: '1.125rem',
                color: '#94a3b8',
                marginBottom: '2rem',
                lineHeight: '1.6'
              }}>
                Creado por estudiantes, para estudiantes. Ofrecemos productos de calidad que realmente necesitas para tu vida universitaria.
              </p>

              {/* Features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    flexShrink: 0
                  }}>
                    
                  </div>
                  <div>
                    <h3 style={{ 
                      fontSize: '1.125rem', 
                      fontWeight: '600', 
                      color: 'white',
                      marginBottom: '0.25rem' 
                    }}>
                      Compra Segura
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                      Transacciones protegidas para estudiantes
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    flexShrink: 0
                  }}>
                    
                  </div>
                  <div>
                    <h3 style={{ 
                      fontSize: '1.125rem', 
                      fontWeight: '600', 
                      color: 'white',
                      marginBottom: '0.25rem' 
                    }}>
                      Envío Gratis
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                      En compras mayores a $50
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    flexShrink: 0
                  }}>
                    
                  </div>
                  <div>
                    <h3 style={{ 
                      fontSize: '1.125rem', 
                      fontWeight: '600', 
                      color: 'white',
                      marginBottom: '0.25rem' 
                    }}>
                      Pago Flexible
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                      Múltiples métodos de pago
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Nosotros Section */}
      <section id='nosotros' style={{ padding: '6rem 2rem', backgroundColor: '#0a0e27' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ 
              fontSize: '3rem', 
              fontWeight: '700', 
              color: '#a855f7',
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem'
            }}>
               Sobre Nosotros
            </h2>
          </div>

          {/* Three Columns */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            marginBottom: '4rem'
          }}>
            {/* Column 1: ¿Quiénes Somos? */}
            <div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '600', 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '2rem' }}></span>
                <span style={{ color: '#ff6b35' }}>¿Quiénes Somos?</span>
              </h3>
              <p style={{ 
                fontSize: '1rem', 
                lineHeight: '1.8', 
                color: '#94a3b8' 
              }}>
                StudiMarket es el marketplace estudiantil más innovador de Chile, creado por estudiantes para estudiantes. Nuestro objetivo es facilitar el acceso a productos de calidad que necesitas para tu vida universitaria.
              </p>
            </div>

            {/* Column 2: Nuestra Misión */}
            <div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '600', 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '2rem' }}></span>
                <span style={{ color: '#ff6b35' }}>Nuestra Misión</span>
              </h3>
              <p style={{ 
                fontSize: '1rem', 
                lineHeight: '1.8', 
                color: '#94a3b8' 
              }}>
                Conectar a estudiantes universitarios con los mejores productos y servicios, ofreciendo precios accesibles, calidad garantizada y una experiencia de compra única diseñada especialmente para la comunidad estudiantil.
              </p>
            </div>

            {/* Column 3: ¿Por Qué Elegirnos? */}
            <div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '600', 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '2rem' }}></span>
                <span style={{ color: '#ff6b35' }}>¿Por Qué Elegirnos?</span>
              </h3>
              <ul style={{ 
                fontSize: '1rem', 
                lineHeight: '2', 
                color: '#94a3b8', 
                listStyle: 'none', 
                padding: 0,
                margin: 0
              }}>
                <li> Precios especiales para estudiantes</li>
                <li> Envíos rápidos a campus universitarios</li>
                <li> Productos verificados y de calidad</li>
                <li> Atención personalizada 24/7</li>
                <li> Comunidad estudiantil activa</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#050814',
        padding: '2rem 2rem 1rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            &copy; 2025 StudiMarket. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

