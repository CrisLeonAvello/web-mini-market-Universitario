import React, { useState, useEffect } from 'react';
import Cart from './Cart';
import WishlistDropdown from './WishlistDropdown';
import authService from '../services/authService';

const Header = ({ user, onLoginClick, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
    onLogout();
    setDropdownOpen(false);
  };

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
          
          {/* Autenticación */}
          {user ? (
            <div className="user-dropdown">
              <button 
                className="user-button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="user-icon">👤</span>
                <span className="user-name">{user.name}</span>
                <span className="dropdown-arrow">▼</span>
              </button>
              
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-item user-info">
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                  </div>
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    Mi Perfil
                  </button>
                  <button className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    Mis Pedidos
                  </button>
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="login-button" onClick={onLoginClick}>
              <span className="login-icon">🚀</span>
              Iniciar Sesión
            </button>
          )}
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
        
        .login-button {
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }
        
        .login-button:hover {
          background: rgba(255,255,255,0.3);
          transform: translateY(-1px);
        }
        
        .login-icon {
          font-size: 1rem;
        }
        
        .user-dropdown {
          position: relative;
        }
        
        .user-button {
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }
        
        .user-button:hover {
          background: rgba(255,255,255,0.3);
        }
        
        .user-icon {
          font-size: 1rem;
        }
        
        .user-name {
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .dropdown-arrow {
          font-size: 0.7rem;
          transition: transform 0.2s ease;
        }
        
        .user-dropdown.open .dropdown-arrow {
          transform: rotate(180deg);
        }
        
        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          min-width: 200px;
          z-index: 1000;
          overflow: hidden;
          margin-top: 0.5rem;
          border: 1px solid rgba(0,0,0,0.1);
        }
        
        .dropdown-item {
          display: block;
          width: 100%;
          padding: 0.75rem 1rem;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          transition: background-color 0.2s ease;
          color: #333;
          font-size: 0.9rem;
        }
        
        .dropdown-item:hover {
          background-color: #f5f5f5;
        }
        
        .dropdown-item.user-info {
          cursor: default;
          border-bottom: 1px solid #eee;
        }
        
        .dropdown-item.user-info:hover {
          background: none;
        }
        
        .dropdown-item.user-info strong {
          display: block;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        
        .dropdown-item.user-info small {
          color: #666;
          font-size: 0.8rem;
        }
        
        .dropdown-item.logout {
          color: #e74c3c;
          border-top: 1px solid #eee;
        }
        
        .dropdown-item.logout:hover {
          background-color: #ffeaea;
        }
        
        .dropdown-divider {
          margin: 0;
          border: none;
          border-top: 1px solid #eee;
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