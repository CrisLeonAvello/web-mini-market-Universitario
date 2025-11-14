import React, { useState, useEffect } from 'react';
import WishlistDropdown from './WishlistDropdown';
import authService from '../services/authService';

const Header = ({ user, onLoginClick, onLogout, onCheckoutClick }) => {
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
        </nav>

        {/* Acciones del usuario */}
        <div className="header-actions">
          <WishlistDropdown />
          
          <button className="btn-checkout-header" onClick={onCheckoutClick}>
            🛒 Ir al Checkout
          </button>
          
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
    </header>
  );
};

export default Header;