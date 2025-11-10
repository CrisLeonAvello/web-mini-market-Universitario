import React, { useState, useEffect } from 'react';

export default function LandingPage({ onEnterStore, onShowLogin, user, onLogout }) {
  const [stars, setStars] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Generar estrellas para el fondo espacial
  useEffect(() => {
    const generateStars = () => {
      const starArray = [];
      for (let i = 0; i < 200; i++) {
        starArray.push({
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          animationDelay: Math.random() * 5,
          size: Math.random() * 2 + 0.5,
          twinkleDelay: Math.random() * 3
        });
      }
      setStars(starArray);
    };
    generateStars();
  }, []);

  // Cargar productos destacados
  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/products');
        const data = await response.json();
        // Tomar los primeros 6 productos como destacados
        setFeaturedProducts(data.products.slice(0, 6));
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  const handleEnterStore = () => {
    if (onEnterStore) {
      onEnterStore();
    }
  };

  return (
    <div className="landing-page space-theme">
      {/* Fondo espacial animado */}
      <div className="space-background">
        <div className="nebula nebula-1"></div>
        <div className="nebula nebula-2"></div>
        <div className="nebula nebula-3"></div>
        <div className="nebula nebula-4"></div>
        
        {/* Estrellas */}
        {stars.map(star => (
          <div
            key={star.id}
            className="star"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDelay: `${star.animationDelay}s`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              '--twinkle-delay': `${star.twinkleDelay}s`
            }}
          />
        ))}
        
        {/* Estrellas fugaces */}
        <div className="shooting-star"></div>
        <div className="shooting-star shooting-star-2"></div>
        <div className="shooting-star shooting-star-3"></div>
        
        {/* Planetas flotantes */}
        <div className="floating-planet planet-1">🪐</div>
        <div className="floating-planet planet-2">🌍</div>
        <div className="floating-planet planet-3">🌙</div>
      </div>

      {/* Header Espacial */}
      <header className="landing-header space-header">
        <div className="header-container space-container">
          <div className="logo-section space-logo-section">
            <div className="space-brand">
              <span className="brand-icon rotating">🚀</span>
              <h1 className="main-logo space-main-logo">StudiMarket</h1>
              <span className="brand-tagline">Marketplace Estudiantil</span>
            </div>
          </div>
          
          <nav className="main-nav space-nav">
            <a href="#productos" className="nav-link space-nav-link">
              <span className="nav-icon">🛍️</span>PRODUCTOS
            </a>
            <a href="#categorias" className="nav-link space-nav-link">
              <span className="nav-icon">📁</span>CATEGORÍAS
            </a>
            <a href="#nosotros" className="nav-link space-nav-link">
              <span className="nav-icon">�</span>NOSOTROS
            </a>
          </nav>
          
          <div className="header-actions space-actions">
            <div className="search-container space-search">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Buscar productos..." className="search-input space-search-input" />
              <button className="search-btn space-search-btn">
                <span className="search-pulse"></span>
              </button>
            </div>
            
            {!user ? (
              <button 
                className="login-btn space-login-btn primary"
                onClick={onShowLogin}
              >
                <span className="btn-icon">🚀</span>
                <span>INICIAR SESIÓN</span>
                <div className="btn-glow"></div>
              </button>
            ) : (
              <div className="user-menu space-user-menu">
                <div className="user-avatar">
                  <span className="avatar-icon">👨‍🚀</span>
                  <span className="status-indicator online"></span>
                </div>
                <span className="welcome-text">Bienvenido {user?.name || 'Usuario'}</span>
                <button className="logout-btn space-logout-btn" onClick={onLogout}>
                  <span className="logout-icon">�</span>
                  CERRAR SESIÓN
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Espacial */}
      <section className="hero-section space-hero">
        <div className="hero-content space-hero-content">
          <div className="hero-text space-hero-text">
            <div className="mission-badge">
              <span className="badge-icon">�</span>
              <span>ESTUDIANTES</span>
            </div>
            
            <h1 className="hero-title space-hero-title">
              Descubre el mejor
              <span className="title-highlight space-highlight">marketplace estudiantil</span>
            </h1>
            
            <p className="hero-description space-hero-description">
              Encuentra todo lo que necesitas para tu vida estudiantil. 
              Productos de calidad, tecnología, libros y más, todo en un solo lugar
              diseñado especialmente para estudiantes universitarios.
            </p>
            
            <div className="hero-stats space-stats">
              <div className="stat space-stat">
                <div className="stat-value">1,000+</div>
                <div className="stat-label">Productos</div>
              </div>
              <div className="stat space-stat">
                <div className="stat-value">500+</div>
                <div className="stat-label">Estudiantes</div>
              </div>
              <div className="stat space-stat">
                <div className="stat-value">50+</div>
                <div className="stat-label">Universidades</div>
              </div>
            </div>
            
            <div className="hero-actions space-hero-actions">
              {!user ? (
                <>
                  <button 
                    className="cta-primary space-cta-primary"
                    onClick={onShowLogin}
                  >
                    <span className="cta-icon">🚀</span>
                    <span>EMPEZAR AHORA</span>
                    <div className="cta-particles"></div>
                  </button>
                  <button 
                    className="cta-secondary space-cta-secondary"
                    onClick={onEnterStore}
                  >
                    <span className="cta-icon">🌌</span>
                    <span>VER PRODUCTOS</span>
                    <div className="cta-orbit"></div>
                  </button>
                </>
              ) : (
                <button 
                  className="cta-primary space-cta-primary"
                  onClick={onEnterStore}
                >
                  <span className="cta-icon">🛸</span>
                  <span>ENTRAR A LA TIENDA</span>
                  <div className="cta-particles"></div>
                </button>
              )}
            </div>
          </div>
          
          <div className="hero-visual space-hero-visual">
            <div className="space-station">
              <div className="station-core rotating-slow">
                <div className="core-ring ring-1"></div>
                <div className="core-ring ring-2"></div>
                <div className="core-ring ring-3"></div>
                <div className="station-center">�️</div>
              </div>
              
              <div className="orbiting-elements">
                <div className="orbit orbit-1">
                  <div className="satellite">�</div>
                </div>
                <div className="orbit orbit-2">
                  <div className="satellite">📚</div>
                </div>
                <div className="orbit orbit-3">
                  <div className="satellite">💻</div>
                </div>
                <div className="orbit orbit-4">
                  <div className="satellite">🎒</div>
                </div>
              </div>
              
              <div className="energy-waves">
                <div className="wave wave-1"></div>
                <div className="wave wave-2"></div>
                <div className="wave wave-3"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de características espaciales */}
      <section className="features-section space-features">
        <div className="container space-container">
          <div className="section-header space-section-header">
            <h2 className="section-title space-section-title">
              <span className="title-icon">🌟</span>
              Nuestros Servicios
            </h2>
            <p className="section-subtitle">
              Descubre por qué somos el marketplace estudiantil líder
            </p>
          </div>
          
          <div className="features-grid space-features-grid">
            <div className="feature-card space-feature-card">
              <div className="feature-icon space-feature-icon">
                <span className="icon-bg">⚡</span>
                <div className="icon-glow"></div>
              </div>
              <h3>Envío Rápido</h3>
              <p>Recibe tus productos en tiempo récord con nuestro sistema de envío express</p>
              <div className="feature-particles"></div>
            </div>
            
            <div className="feature-card space-feature-card">
              <div className="feature-icon space-feature-icon">
                <span className="icon-bg">�️</span>
                <div className="icon-glow"></div>
              </div>
              <h3>Garantía de Calidad</h3>
              <p>Productos de alta calidad verificados, solo lo mejor para estudiantes universitarios</p>
              <div className="feature-particles"></div>
            </div>
            
            <div className="feature-card space-feature-card">
              <div className="feature-icon space-feature-icon">
                <span className="icon-bg">🔒</span>
                <div className="icon-glow"></div>
              </div>
              <h3>Pagos Seguros</h3>
              <p>Sistema de pago encriptado y seguro, tu información protegida al 100%</p>
              <div className="feature-particles"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de productos destacados */}
      <section className="featured-products-section space-products">
        <div className="container space-container">
          <div className="section-header space-section-header">
            <h2 className="section-title space-section-title">
              <span className="title-icon">🛍️</span>
              Productos Destacados
            </h2>
            <p className="section-subtitle">
              Descubre los productos más populares entre estudiantes
            </p>
          </div>
          
          {loadingProducts ? (
            <div className="products-loading">
              <div className="loading-spinner">🔄</div>
              <p>Cargando productos...</p>
            </div>
          ) : (
            <div className="products-grid space-products-grid">
              {featuredProducts.map((product) => (
                <div key={product.id} className="product-card space-product-card">
                  <div className="product-image-container">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="product-image"
                    />
                    <div className="product-overlay">
                      <button className="quick-view-btn">
                        <span>👁️</span>
                        Ver detalles
                      </button>
                    </div>
                  </div>
                  
                  <div className="product-info">
                    <div className="product-category">{product.category}</div>
                    <h3 className="product-title">{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    
                    <div className="product-rating">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <span 
                            key={i} 
                            className={`star ${i < Math.floor(product.rating.rate) ? 'filled' : ''}`}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                      <span className="rating-text">
                        {product.rating.rate} ({product.rating.count} reseñas)
                      </span>
                    </div>
                    
                    <div className="product-footer">
                      <div className="product-price">
                        <span className="price">${product.price}</span>
                        <span className="stock">{product.stock} disponibles</span>
                      </div>
                      <button className="add-to-cart-btn space-btn">
                        <span>🛒</span>
                        Agregar
                      </button>
                    </div>
                  </div>
                  
                  <div className="product-glow"></div>
                </div>
              ))}
            </div>
          )}
          
          <div className="view-all-container">
            <button 
              className="view-all-btn space-cta-secondary"
              onClick={onEnterStore}
            >
              <span className="btn-icon">🌟</span>
              <span>Ver todos los productos</span>
              <div className="btn-particles"></div>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}