import React, { useState, useEffect } from 'react';
import './LandingFigma.css';

export default function LandingFigma({ onLogin, onRegister }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const categories = [
    { name: 'Tecnología', icon: '💻', color: '#3b82f6', items: 250 },
    { name: 'Libros', icon: '📚', color: '#c026d3', items: 320 },
    { name: 'Audio', icon: '🎧', color: '#ff5722', items: 120 },
    { name: 'Accesorios', icon: '🎒', color: '#10b981', items: 180 },
    { name: 'Snacks', icon: '☕', color: '#f59e0b', items: 95 },
    { name: 'Papelería', icon: '✏️', color: '#a855f7', items: 150 },
  ];

  const slides = [
    { title: 'Explora\nNuestras\nCategorías', icon: '📦' },
    { title: 'Tecnología', icon: '💻' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-figma">
      {/* Header */}
      <header className="landing-header">
        <div className="logo">
          <span className="logo-icon">🚀</span>
          <div>
            <div className="logo-text">StudiMarket</div>
            <div className="logo-subtext">Marketplace Estudiantil</div>
          </div>
        </div>
        
        <nav className="main-nav">
          <a href="#productos" className="nav-link">
            <span>🛍️</span> PRODUCTOS
          </a>
          <a href="#categorias" className="nav-link">
            <span>📁</span> CATEGORÍAS
          </a>
          <a href="#nosotros" className="nav-link">
            NOSOTROS
          </a>
        </nav>

        <div className="header-search">
          <input type="text" placeholder="Buscar productos..." />
        </div>

        <button className="btn-login" onClick={onLogin}>
          <span>👤</span> INICIAR SESIÓN
        </button>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="badge-estudiantes">
            <span>✨</span> ESTUDIANTES
          </div>
          
          <h1 className="hero-title">
            Descubre el mejor
            <span className="text-orange"> marketplace</span>
            <span className="text-purple"> estudiantil</span>
          </h1>
          
          <p className="hero-subtitle">
            Encuentra todo lo que necesitas para tu vida estudiantil. Productos de 
            calidad, tecnología, libros y más.
          </p>
        </div>

        <div className="hero-slider">
          <div className="slider-card">
            <div className="slider-left">
              <span className="slider-icon">📦</span>
              <div className="slider-text">
                <div>Explora</div>
                <div>Nuestras</div>
                <div className="text-orange">Categorías</div>
              </div>
            </div>
            <div className="slider-divider"></div>
            <div className="slider-right">
              <span className="slider-icon-large">{slides[currentSlide].icon}</span>
              <div className="slider-category">{slides[currentSlide].title}</div>
            </div>
          </div>
          <div className="slider-dots">
            {slides.map((_, index) => (
              <div 
                key={index} 
                className={`dot ${index === currentSlide ? 'active' : ''}`}
              />
            ))}
          </div>
          <div className="rocket-icon">🚀</div>
          <div className="page-indicator">Página {currentSlide + 1} de {slides.length}</div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="stat-item">
          <div className="stat-number">1,000+</div>
          <div className="stat-label">PRODUCTOS</div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <div className="stat-number">500+</div>
          <div className="stat-label">ESTUDIANTES</div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <div className="stat-number">50+</div>
          <div className="stat-label">UNIVERSIDADES</div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <h2 className="section-title">Explora por Categoría</h2>
        <p className="section-subtitle">Encuentra exactamente lo que necesitas</p>
        
        <div className="categories-grid">
          {categories.map((cat, index) => (
            <div key={index} className="category-card">
              <div className="category-icon" style={{ background: `linear-gradient(135deg, ${cat.color}40, ${cat.color}20)` }}>
                <span style={{ fontSize: '48px' }}>{cat.icon}</span>
              </div>
              <div className="category-name">{cat.name}</div>
              <div className="category-items">{cat.items} items</div>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="products-section">
        <h2 className="section-title">Productos Destacados</h2>
        <p className="section-subtitle">Los favoritos de la comunidad estudiantil</p>
        
        <div className="products-grid">
          {[
            { name: 'MacBook Air M2', category: 'Tecnología', price: '$999', badge: 'Popular', badgeColor: '#ff5722', rating: 4.8 },
            { name: 'Cálculo Vol. 1', category: 'Libros', price: '$45', badge: 'Nuevo', badgeColor: '#10b981', rating: 4.5 },
            { name: 'AirPods Pro', category: 'Audio', price: '$249', badge: 'Trending', badgeColor: '#a855f7', rating: 4.9 },
          ].map((product, index) => (
            <div key={index} className="product-card">
              <div className="product-image">
                <div className="product-badge" style={{ backgroundColor: product.badgeColor }}>
                  {product.badge}
                </div>
              </div>
              <div className="product-info">
                <div className="product-category">
                  {product.category} · <span className="product-rating">⭐ {product.rating}</span>
                </div>
                <div className="product-name">{product.name}</div>
                <div className="product-price">{product.price}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <h2 className="section-title">Tu Minimarket Universitario</h2>
        <p className="section-subtitle">
          Creado por estudiantes, para estudiantes. Todo lo que necesitas para triunfar en tu vida universitaria.
        </p>
        
        <div className="features-grid">
          <div className="feature-card" style={{ background: 'linear-gradient(135deg, #1e1b4b, #0f1020)' }}>
            <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #a855f7, #8b5cf6)' }}>
              ✨
            </div>
            <h3 className="feature-title">Productos Seleccionados</h3>
            <p className="feature-description">
              Cada artículo ha sido cuidadosamente elegido pensando en las necesidades de los estudiantes universitarios.
            </p>
          </div>

          <div className="feature-card" style={{ background: 'linear-gradient(135deg, #431407, #2a0a04)' }}>
            <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #ff5722, #f44336)' }}>
              ⚡
            </div>
            <h3 className="feature-title">Entrega Rápida</h3>
            <p className="feature-description">
              Recibe tus productos en tiempo récord. Porque sabemos que tu tiempo es valioso.
            </p>
          </div>

          <div className="feature-card" style={{ background: 'linear-gradient(135deg, #1e1b4b, #0f1020)' }}>
            <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #ec4899, #c026d3)' }}>
              🛡️
            </div>
            <h3 className="feature-title">Compra Segura</h3>
            <p className="feature-description">
              Tus datos y pagos están protegidos con la mejor tecnología de seguridad.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="logo">
              <span className="logo-icon">🚀</span>
              <span className="footer-logo-text">StudiMarket</span>
            </div>
            <p className="footer-tagline">Tu marketplace estudiantil de confianza</p>
            <div className="social-icons">
              <a href="#" className="social-icon">📘</a>
              <a href="#" className="social-icon">📷</a>
              <a href="#" className="social-icon">🐦</a>
              <a href="#" className="social-icon">✉️</a>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>Comprar</h4>
              <a href="#">Productos</a>
              <a href="#">Categorías</a>
              <a href="#">Ofertas</a>
              <a href="#">Nuevos</a>
            </div>

            <div className="footer-column">
              <h4>Ayuda</h4>
              <a href="#">Centro de Ayuda</a>
              <a href="#">Envíos</a>
              <a href="#">Devoluciones</a>
              <a href="#">Contacto</a>
            </div>

            <div className="footer-column">
              <h4>Legal</h4>
              <a href="#">Términos</a>
              <a href="#">Privacidad</a>
              <a href="#">Cookies</a>
              <a href="#">Nosotros</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 StudiMarket. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
