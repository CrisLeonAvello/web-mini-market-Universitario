import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from './ui/dropdown-menu';
import { useLocation } from "react-router-dom";
import { FaUser, FaBoxOpen, FaHeart, FaCog, FaSignOutAlt } from 'react-icons/fa';

function safeUseLocation() {
  try {
    return useLocation();
  } catch {
    return { pathname: "" };
  }
}

export default function HeaderGlobal({ onShowProductos, onShowProfile, onShowLogin, onLogout, user, isProductosPage }) {
  const location = safeUseLocation();
  const isProductosTab = isProductosPage || location.pathname === "/productos" || window.location.hash === "#productos";

  return (
    <header className="header-global">
      {isProductosTab ? (
        <div className="header-productos-layout">
          <button className="header-logo-btn" onClick={() => window.location.href = "/"}>
            <span className="header-logo-icon"></span>
            <div>
              <h1 className="header-logo-title">StudiMarket</h1>
              <p className="header-logo-subtitle">Marketplace Estudiantil</p>
            </div>
          </button>
          <div className="header-user-menu">
            {user ? (
              <>
                <button 
                  className="btn-publicar-producto-header"
                  onClick={() => window.location.href='#mis-ventas'}
                  title="Publicar producto para vender"
                >
                  <span className="btn-icon">📦</span>
                  <span>Vender</span>
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="user-menu-trigger">
                      <Avatar>
                        <AvatarImage src={user.avatarUrl} alt={user.name}/>
                        <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="user-menu-info">
                        <div className="user-menu-name">{user.name}</div>
                        <div className="user-menu-email">{user.email}</div>
                      </div>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="user-menu-dropdown">
                    <DropdownMenuLabel className="user-menu-label">MI CUENTA</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onShowProfile} className="user-menu-item"><FaUser className="user-menu-icon"/>Mi Perfil</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href='#mis-ventas'} className="user-menu-item"><FaBoxOpen className="user-menu-icon"/>Mis Ventas</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href='/pedidos'} className="user-menu-item"><FaBoxOpen className="user-menu-icon"/>Mis Pedidos</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href='/favoritos'} className="user-menu-item"><FaHeart className="user-menu-icon-heart"/>Favoritos</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => window.location.href='/configuracion'} className="user-menu-item"><FaCog className="user-menu-icon"/>Configuración</DropdownMenuItem>
                    <DropdownMenuItem onClick={onLogout} className="user-menu-item"><FaSignOutAlt className="user-menu-icon"/>Cerrar Sesión</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button variant="outline" onClick={onShowLogin}>Iniciar sesión</Button>
            )}
          </div>
        </div>
      ) : (
        <div className="header-global-content">
          {/* Logo como botón */}
          <button
            onClick={() => window.location.href = '/'}
            className="header-logo-btn"
            title="Ir a la página principal"
          >
            <span className="header-logo-icon"></span>
            <div>
              <h1 className="header-logo-title">StudiMarket</h1>
              <p className="header-logo-subtitle">Marketplace Estudiantil</p>
            </div>
          </button>
          {/* Navegación */}
          <nav className="header-nav">
            <a
              href="#productos"
              className="header-nav-link"
              onClick={e => {
                e.preventDefault();
                if (typeof onShowProductos === 'function') onShowProductos();
              }}
            >PRODUCTOS</a>
            <div className="header-nav-dropdown">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="header-nav-link" style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer' }}>
                    CATEGORÍAS
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" sideOffset={8} className="header-categorias-dropdown">
                  {(Array.isArray(window.allCategories) ? window.allCategories : ["Tecnología", "Libros", "Audio", "Accesorios","Snacks","papelería"]).map(cat => (
                    <DropdownMenuItem key={cat} onClick={() => window.location.href = `/categorias/${cat}`}>{cat}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <a
              href="#nosotros"
              className="header-nav-link"
              onClick={e => {
                e.preventDefault();
                window.location.href = '/#nosotros';
              }}
            >NOSOTROS</a>
          </nav>
          {/* Menú de usuario/avatar */}
          <div className="header-user-menu">
            {user ? (
              <>
                <button 
                  className="btn-publicar-producto-header"
                  onClick={() => window.location.href='#mis-ventas'}
                  title="Publicar producto para vender"
                >
                  <span className="btn-icon">📦</span>
                  <span>Vender</span>
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="user-menu-trigger">
                      <Avatar>
                        <AvatarImage src={user.avatarUrl} alt={user.name}/>
                        <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="user-menu-info">
                        <div className="user-menu-name">{user.name}</div>
                        <div className="user-menu-email">{user.email}</div>
                      </div>
                    </div>
                  </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="user-menu-dropdown">
                  <DropdownMenuLabel className="user-menu-label">MI CUENTA</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onShowProfile} className="user-menu-item"><FaUser className="user-menu-icon"/>Mi Perfil</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href='#mis-ventas'} className="user-menu-item"><FaBoxOpen className="user-menu-icon"/>Mis Ventas</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href='/pedidos'} className="user-menu-item"><FaBoxOpen className="user-menu-icon"/>Mis Pedidos</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href='/favoritos'} className="user-menu-item"><FaHeart className="user-menu-icon-heart"/>Favoritos</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.location.href='/configuracion'} className="user-menu-item"><FaCog className="user-menu-icon"/>Configuración</DropdownMenuItem>
                  <DropdownMenuItem onClick={onLogout} className="user-menu-item"><FaSignOutAlt className="user-menu-icon"/>Cerrar Sesión</DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button variant="outline" onClick={onShowLogin}>Iniciar sesión</Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}