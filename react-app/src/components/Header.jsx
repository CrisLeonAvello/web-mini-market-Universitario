import React from 'react';
import Cart from './Cart';
import WishlistDropdown from './WishlistDropdown';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        {/* Logo y nombre */}
        <div className="header-logo">
          <h1>📚 StudiMarket</h1>
          <p>Tu tienda universitaria online</p>
        </div>

        {/* Navegación */}
        <nav className="header-nav">
          <a href="/" className="nav-link active">Inicio</a>
          <a href="/checkout" className="nav-link">Checkout</a>
        </nav>

        {/* Acciones del usuario */}
        <div className="header-actions">
          <WishlistDropdown />
          <Cart />
        </div>
      </div>

      <style jsx>{`
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1rem 0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .header-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .header-logo h1 {
          margin: 0;
          font-size: 1.8rem;
          font-weight: bold;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .header-logo p {
          margin: 0;
          font-size: 0.9rem;
          opacity: 0.9;
          font-weight: 300;
        }
        
        .header-nav {
          display: flex;
          gap: 2rem;
        }
        
        .nav-link {
          color: white;
          text-decoration: none;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          transition: all 0.2s ease;
          position: relative;
        }
        
        .nav-link:hover {
          background: rgba(255,255,255,0.1);
          transform: translateY(-1px);
        }
        
        .nav-link.active {
          background: rgba(255,255,255,0.2);
          font-weight: 600;
        }
        
        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 2px;
          background: white;
          border-radius: 1px;
        }
        
        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          position: relative;
        }
        
        @media (max-width: 768px) {
          .header-container {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }
          
          .header-logo h1 {
            font-size: 1.5rem;
          }
          
          .header-nav {
            gap: 1rem;
          }
          
          .nav-link {
            padding: 0.4rem 0.8rem;
            font-size: 0.9rem;
          }
        }
        
        @media (max-width: 480px) {
          .header-actions {
            gap: 0.5rem;
          }
          
          .header-nav {
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.5rem;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;