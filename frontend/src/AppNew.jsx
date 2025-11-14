import React, { useState } from 'react';
import { ProductsProvider } from './contexts/ProductsContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import ProductList from './components/ProductList';
import FiltersNew from './components/FiltersNew';
import ProductModal from './components/ProductModal';
import CheckoutPageSimple from './components/CheckoutPageSimple';
import './styles.css';

export default function App() {
  const [currentProduct, setCurrentProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const openProductModal = (product) => {
    setCurrentProduct(product);
    setModalOpen(true);
  };

  const closeProductModal = () => {
    setCurrentProduct(null);
    setModalOpen(false);
  };

  const handleLoadingComplete = () => {
    setLoadingComplete(true);
    console.log('✅ Aplicación cargada completamente');
  };

  const openCheckout = () => {
    setShowCheckout(true);
  };

  const closeCheckout = () => {
    setShowCheckout(false);
  };

  return (
    <ProductsProvider>
      <CartProvider>
        <WishlistProvider>
          <div className="app">
            {/* Pantalla de carga */}
            {!loadingComplete && (
              <LoadingScreen onLoadingComplete={handleLoadingComplete} />
            )}

            {/* Aplicación principal */}
            {loadingComplete && !showCheckout && (
              <>
                <Header onCheckoutClick={openCheckout} />
                
                <main className="main-content">
                  <div className="container">
                    <div className="content-layout">
                      {/* Sidebar con filtros */}
                      <aside className="sidebar">
                        <FiltersNew />
                      </aside>

                      {/* Área principal de productos */}
                      <section className="products-section">
                        <ProductList onProductClick={openProductModal} />
                      </section>
                    </div>
                  </div>
                </main>

                {/* Modal de producto */}
                <ProductModal 
                  product={currentProduct}
                  open={modalOpen}
                  onClose={closeProductModal}
                />
              </>
            )}

            {/* Página de Checkout */}
            {loadingComplete && showCheckout && (
              <CheckoutPageSimple onClose={closeCheckout} />
            )}
          </div>
        </WishlistProvider>
      </CartProvider>
    </ProductsProvider>
  );
}