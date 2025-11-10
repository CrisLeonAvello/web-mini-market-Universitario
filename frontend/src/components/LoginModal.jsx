import React, { useState, useEffect } from 'react';

export default function LoginModal({ onClose, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [stars, setStars] = useState([]);

  // Generar estrellas para el fondo espacial
  useEffect(() => {
    const generateStars = () => {
      const starArray = [];
      for (let i = 0; i < 50; i++) {
        starArray.push({
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          animationDelay: Math.random() * 3,
          size: Math.random() * 3 + 1
        });
      }
      setStars(starArray);
    };
    generateStars();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar email
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email no válido';
    }

    // Validar password
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validaciones para registro
    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'El nombre es requerido';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirma tu contraseña';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simular respuesta exitosa
      const userData = {
        id: Date.now(),
        name: formData.name || formData.email.split('@')[0],
        email: formData.email
      };

      onLogin(userData);
    } catch (error) {
      setErrors({ general: 'Error al procesar la solicitud. Inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      name: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  return (
    <div className="modal-overlay space-modal" onClick={onClose}>
      {/* Fondo espacial animado */}
      <div className="space-background">
        <div className="nebula nebula-1"></div>
        <div className="nebula nebula-2"></div>
        <div className="nebula nebula-3"></div>
        {stars.map(star => (
          <div
            key={star.id}
            className="star"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDelay: `${star.animationDelay}s`,
              width: `${star.size}px`,
              height: `${star.size}px`
            }}
          />
        ))}
        <div className="shooting-star"></div>
        <div className="shooting-star shooting-star-2"></div>
      </div>

      <div className="modal-content space-login-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header con diseño espacial */}
        <div className="modal-header space-header">
          <div className="header-content">
            <div className="logo-container">
              <div className="space-logo">
                <span className="planet">🪐</span>
                <span className="logo-text">StudiMarket</span>
                <span className="satellite">🛸</span>
              </div>
            </div>
            <h2 className="space-title">
              {isLogin ? 'Bienvenido de vuelta' : 'Únete a StudiMarket'}
            </h2>
            <p className="space-subtitle">
              {isLogin ? 'Ingresa tus credenciales para acceder' : 'Crea tu cuenta para comenzar'}
            </p>
          </div>
          <button className="close-btn space-close" onClick={onClose}>
            <span>✕</span>
          </button>
        </div>

        <div className="modal-body space-body">
          <form onSubmit={handleSubmit} className="space-form">
            {errors.general && (
              <div className="error-message space-error">
                <span className="error-icon">⚠️</span>
                {errors.general}
              </div>
            )}

            {!isLogin && (
              <div className="form-group space-group">
                <div className="input-container">
                  <span className="input-icon">👨‍🚀</span>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`form-input space-input ${errors.name ? 'error' : ''}`}
                    placeholder="Nombre completo"
                  />
                  <div className="input-glow"></div>
                </div>
                {errors.name && <span className="error-text space-error-text">🚨 {errors.name}</span>}
              </div>
            )}

            <div className="form-group space-group">
              <div className="input-container">
                <span className="input-icon">📡</span>
                  <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input space-input ${errors.email ? 'error' : ''}`}
                  placeholder="Correo electrónico"
                />
                <div className="input-glow"></div>
              </div>
              {errors.email && <span className="error-text space-error-text">🚨 {errors.email}</span>}
            </div>

            <div className="form-group space-group">
              <div className="input-container">
                <span className="input-icon">🔐</span>
                  <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-input space-input ${errors.password ? 'error' : ''}`}
                  placeholder="Contraseña"
                />
                <span className="password-toggle space-toggle">👁️</span>
                <div className="input-glow"></div>
              </div>
              {errors.password && <span className="error-text space-error-text">🚨 {errors.password}</span>}
            </div>

            {!isLogin && (
              <div className="form-group space-group">
                <div className="input-container">
                  <span className="input-icon">🔒</span>
                    <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`form-input space-input ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="Confirmar contraseña"
                  />
                  <div className="input-glow"></div>
                </div>
                {errors.confirmPassword && <span className="error-text space-error-text">🚨 {errors.confirmPassword}</span>}
              </div>
            )}

            <button 
              type="submit" 
              className={`btn-login space-login-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              <span className="btn-icon">🚀</span>
              <span className="btn-text">
                {loading ? 'Iniciando sesión...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
              </span>
              <div className="btn-glow"></div>
            </button>
          </form>

          {isLogin && (
            <div className="forgot-password space-forgot">
              <span className="forgot-icon">🛰️</span>
              <a href="#" className="forgot-link space-link">¿Olvidaste tu contraseña?</a>
            </div>
          )}

          <div className="auth-toggle space-toggle-section">
            <div className="toggle-divider">
              <span className="divider-text">⭐ O ⭐</span>
            </div>
            <p className="toggle-text">
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
              <button 
                type="button" 
                className="toggle-link space-toggle-btn"
                onClick={toggleMode}
              >
                <span className="toggle-icon">{isLogin ? '🌟' : '🚀'}</span>
                {isLogin ? 'Registrarse' : 'Iniciar Sesión'}
              </button>
            </p>
          </div>

          <div className="social-divider space-social-divider">
            <div className="divider-line"></div>
            <span className="divider-content">
              <span className="galaxy-icon">🌌</span>
              Otras opciones
              <span className="galaxy-icon">🌌</span>
            </span>
            <div className="divider-line"></div>
          </div>

          <div className="social-login space-social">
            <button type="button" className="social-btn space-google-btn">
              <div className="social-icon-container">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%234285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/%3E%3Cpath fill='%2334A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/%3E%3Cpath fill='%23FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/%3E%3Cpath fill='%23EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/%3E%3C/svg%3E" alt="Google" />
              </div>
              <span>Continuar con Google</span>
              <div className="social-glow"></div>
            </button>
            
            <button type="button" className="social-btn space-facebook-btn">
              <div className="social-icon-container">
                <span className="facebook-icon">f</span>
              </div>
              <span>Continuar con Facebook</span>
              <div className="social-glow"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}