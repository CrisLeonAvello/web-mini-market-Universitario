import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import { GoogleLogin } from '@react-oauth/google';
import '../login.css';

export default function LoginPage({ onLogin, onBackToHome }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
      if (isLogin) {
        // Login
        const loginData = await authService.login({
          email: formData.email,
          password: formData.password
        });
        
        // El servicio ya obtiene la información del usuario automáticamente
        if (loginData.user) {
          onLogin(loginData.user);
        } else {
          // Fallback: obtener información del usuario manualmente
          const userData = await authService.getCurrentUser();
          onLogin(userData);
        }
      } else {
        // Registro
        await authService.register({
          email: formData.email,
          password: formData.password,
          name: formData.name
        });
        
        // Registro exitoso, mostrar mensaje y cambiar a login
        setErrors({ general: '✅ Cuenta creada exitosamente. Puedes iniciar sesión ahora.' });
        setTimeout(() => {
          setIsLogin(true);
          setErrors({});
          setFormData({
            email: formData.email, // Mantener email para facilitar login
            password: '',
            name: '',
            confirmPassword: ''
          });
        }, 2000);
      }
    } catch (error) {
      setErrors({ general: error.message || 'Error al procesar la solicitud. Inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  // Manejar login con Google
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const loginData = await authService.googleLogin(credentialResponse.credential);
      
      if (loginData.user) {
        onLogin(loginData.user);
      } else {
        const userData = await authService.getCurrentUser();
        onLogin(userData);
      }
    } catch (error) {
      setErrors({ general: error.message || 'Error al iniciar sesión con Google' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErrors({ general: 'Error al iniciar sesión con Google. Inténtalo de nuevo.' });
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
    <div className="login-page">
      {/* Fondo de planeta */}
      <div className="planet-background">
        <div className="planet-overlay"></div>
      </div>

      {/* Contenido principal */}
      <div className="login-container">
        {/* Botón de regreso */}
        <button className="back-button" onClick={onBackToHome}>
          <span className="back-icon">←</span>
          <span>Volver al inicio</span>
        </button>

        {/* Formulario de login */}
        <div className="login-form-container">
          <div className="login-header">
            <div className="logo-section">
              <span className="logo-icon">🚀</span>
              <h1 className="logo-title">StudiMarket</h1>
            </div>
            <h2 className="login-title">
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h2>
            <p className="login-subtitle">
              {isLogin ? 'Ingresa a tu cuenta' : 'Únete a nuestra comunidad'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {errors.general && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {errors.general}
              </div>
            )}

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">Nombre completo</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Tu nombre completo"
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="tu@email.com"
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Tu contraseña"
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Confirma tu contraseña"
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>
            )}

            <button 
              type="submit" 
              className={`login-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
            </button>
          </form>

          {isLogin && (
            <div className="forgot-password">
              <a href="#" className="forgot-link">¿Olvidaste tu contraseña?</a>
            </div>
          )}

          <div className="auth-toggle">
            <p>
              {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
              <button 
                type="button" 
                className="toggle-button"
                onClick={toggleMode}
              >
                {isLogin ? 'Crear cuenta' : 'Iniciar sesión'}
              </button>
            </p>
          </div>

          <div className="social-divider">
            <span>O continúa con</span>
          </div>

          <div className="social-buttons">
            <div className="google-button-wrapper">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap={false}
                text={isLogin ? "signin_with" : "signup_with"}
                shape="rectangular"
                size="large"
                width={window.innerWidth < 400 ? 300 : 400}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}