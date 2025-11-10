// Servicio de autenticación
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class AuthService {
  // Almacenar token en localStorage
  setToken(token) {
    localStorage.setItem('authToken', token);
  }

  // Obtener token del localStorage
  getToken() {
    return localStorage.getItem('authToken');
  }

  // Eliminar token del localStorage
  removeToken() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }

  // Almacenar información del usuario
  setUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  // Obtener información del usuario almacenada
  getStoredUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      // Verificar si el token no ha expirado
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Error al verificar token:', error);
      return false;
    }
  }

  // Obtener headers de autorización
  getAuthHeaders() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Registrar usuario
  async register(userData) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al registrar usuario');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  // Iniciar sesión
  async login(credentials) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Credenciales incorrectas');
      }

      const data = await response.json();
      
      // Guardar token
      this.setToken(data.access_token);
      
      // Obtener y guardar información del usuario
      try {
        const userInfo = await this.getCurrentUser();
        this.setUser(userInfo);
        return { ...data, user: userInfo };
      } catch (userError) {
        console.warn('No se pudo obtener información del usuario:', userError);
        return data;
      }
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  // Obtener información del usuario actual
  async getCurrentUser() {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener información del usuario');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      throw error;
    }
  }

  // Cerrar sesión
  logout() {
    this.removeToken();
    // Redirigir a la página principal o de login
    window.location.href = '/';
  }
}

const authService = new AuthService();
export default authService;