import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContextType, User } from '../types/types';
import * as firebaseAuthService from '../services/firebaseAuthService';
import { getToken, getUser } from '../services/storageService';
import { onAuthStateChange } from '../services/firebaseAuthService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
    
    // Observador de cambios en Firebase Auth
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        // Usuario autenticado en Firebase
        const storedUser = await getUser();
        if (storedUser) {
          setUser(storedUser);
        }
      } else {
        // Usuario no autenticado
        setUser(null);
        setToken(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await getToken();
      const storedUser = await getUser();
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Error loading auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await firebaseAuthService.loginWithFirebase(email, password);
      setToken(response.token);
      setUser(response.backendUser);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (nombre: string, email: string, password: string) => {
    try {
      setLoading(true);
      const response = await firebaseAuthService.registerWithFirebase(nombre, email, password);
      setUser(response.backendUser);
      // Auto-login después del registro
      const loginResponse = await firebaseAuthService.loginWithFirebase(email, password);
      setToken(loginResponse.token);
      setUser(loginResponse.backendUser);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await firebaseAuthService.logoutFromFirebase();
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
