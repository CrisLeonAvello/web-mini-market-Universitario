import React, { useState, useEffect } from "react";
import { ProductsProvider } from "./contexts/ProductsContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import ProductListNew from "./components/ProductListNew";
import FiltersNew from "./components/FiltersNew";
import CartModalNew from "./components/CartModalNew";
import WishlistModalNew from "./components/WishlistModalNew";
import ErrorBoundary from "./components/ErrorBoundary";
import "./styles.css";
import "./animations.css";
import "./components.css";


function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("App iniciada");
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Cargando...
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ProductsProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="app">
              <header className="header">
                <div className="logo">StudiMarket</div>
                <div className="nav-buttons">
                  <button className="nav-btn">📋 Catálogo</button>
                  <CartModalNew />
                  <WishlistModalNew />
                </div>
              </header>

              <div className="main-content">
                <div className="filters-section">
                  <aside className="filters">
                    <FiltersNew />
                  </aside>
                  
                  <main className="products-grid-container">
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
