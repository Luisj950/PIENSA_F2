// src/context/AuthContext.tsx

import { useState, createContext, useContext, useEffect, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

// Interfaz que define la estructura de los datos del usuario decodificados del token
interface User {
  sub: number;
  email: string;
  rol: string;
  nombres?: string;
  apellidos?: string;
  telefono?: string;
}

// Interfaz para el valor que proveerá el contexto
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (newToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);

  // Efecto para verificar el token cuando la app carga o el token cambia
  useEffect(() => {
    if (token) {
      try {
        const decodedUser = jwtDecode<User>(token);
        setUser(decodedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Token inválido o expirado, cerrando sesión.', error);
        logout();
      }
    } else {
      // Si no hay token, asegúrate de que el estado esté limpio
      logout();
    }
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    user,
    token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};