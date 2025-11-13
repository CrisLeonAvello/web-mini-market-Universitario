import React, { useState, useEffect } from "react";
import { ProductsProvider } from "./contexts/ProductsContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import ProductListNew from "./components/ProductListNew";
import FiltersNew from "./components/FiltersNew";
import CartModalNew from "./components/CartModalNew";
import WishlistModalNew from "./components/WishlistModalNew";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import ErrorBoundary from "./components/ErrorBoundary";
import authService from "./services/authService";
import "./styles.css";
import "./animations.css";
import "./components.css";
import "./landing.css";

function App() {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing', 'login', 'store'
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("App iniciada");
    
    // Verificar si hay un usuario autenticado
    if (authService.isAuthenticated()) {
      const storedUser = authService.getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      }
    }
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Manejar el historial del navegador
  useEffect(() => {
    const handlePopState = (event) => {
      // Si el usuario presiona el botón "Atrás", regresa a landing
      if (currentPage === 'login' || currentPage === 'store') {
        setCurrentPage('landing');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentPage]);

  const handleEnterStore = () => {
    setCurrentPage('store');
    window.history.pushState({ page: 'store' }, '', '#store');
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
    window.history.pushState({ page: 'landing' }, '', '#landing');
  };

  const handleShowLogin = () => {
    setCurrentPage('login');
    window.history.pushState({ page: 'login' }, '', '#login');
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('landing'); // Después del login, regresa a landing
    window.history.pushState({ page: 'landing' }, '', '#landing');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('landing');
    window.history.pushState({ page: 'landing' }, '', '#landing');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        🏪 Cargando StudiMarket...
      </div>
    );
  }

  // Mostrar página de login
  if (currentPage === 'login') {
    return (
      <ErrorBoundary>
        <LoginPage 
          onLogin={handleLogin}
          onBackToHome={handleBackToLanding}
        />
      </ErrorBoundary>
    );
  }

  // Mostrar Landing Page
  if (currentPage === 'landing') {
    return (
      <ErrorBoundary>
        <LandingPage 
          onEnterStore={handleEnterStore}
          onShowLogin={handleShowLogin}
          user={user}
          onLogout={handleLogout}
        />
      </ErrorBoundary>
    );
  }

  // Mostrar Tienda Principal (currentPage === 'store')
  return (
    <ErrorBoundary>
      <ProductsProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="app space-store">
              {/* Fondo espacial para la tienda */}
              <div className="store-space-bg">
                <div className="store-nebula store-nebula-1"></div>
                <div className="store-nebula store-nebula-2"></div>
                <div className="store-stars">
                  {[...Array(50)].map((_, i) => (
                    <div
                      key={i}
                      className="store-star"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        '--size': `${Math.random() * 2 + 1}px`
                      }}
                    />
                  ))}
                </div>
              </div>

              <header className="header space-store-header">
                <div className="logo space-store-logo" onClick={handleBackToLanding} style={{ cursor: 'pointer' }}>
                  <span className="logo-icon">🚀</span>
                  <span className="logo-text">StudiMarket</span>
                  <span className="logo-subtitle">Tienda Online</span>
                </div>
                <div className="nav-buttons space-nav-buttons">
                  <button className="nav-btn space-nav-btn" onClick={handleBackToLanding}>
                    <span className="btn-icon">🏠</span>
                    <span>Inicio</span>
                  </button>
                  <button className="nav-btn space-nav-btn">
                    <span className="btn-icon">📋</span>
                    <span>Catálogo</span>
                  </button>
                  <CartModalNew />
                  <WishlistModalNew />
                </div>
              </header>

              <div className="main-content space-main-content">
                <div className="filters-section space-filters-section">
                  <aside className="filters space-filters">
                    <FiltersNew />
                  </aside>
                  
                  <main className="products-grid-container space-products-container">
                    <div className="products-header">
                      <h2>🛍️ Nuestros Productos</h2>
                      <p>Descubre lo mejor para estudiantes</p>
                    </div>
                    <ProductListNew />
                  </main>
                </div>
              </div>
            </div>
          </WishlistProvider>
        </CartProvider>
      </ProductsProvider>
    </ErrorBoundary>
  );
}

export default App;
