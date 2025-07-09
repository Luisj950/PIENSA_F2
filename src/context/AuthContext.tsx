// src/context/AuthContext.jsx

import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import apiClient from '../api/apiClient';
import { jwtDecode } from 'jwt-decode'; // <-- 1. IMPORTAR jwt-decode

// --- 2. DEFINIR LA INTERFAZ PARA EL USUARIO Y EL CONTEXTO ---
// Esto nos da autocompletado y seguridad de tipos.
interface User {
  sub: number;    // Subject (ID del usuario)
  email: string;
  rol: string;    // ¡Aquí está nuestro rol!
  iat: number;    // Issued at (fecha de creación del token)
  exp: number;    // Expiration time (fecha de expiración)
}

interface AuthContextType {
  user: User | null; // Cambiamos 'token' por 'user'
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // --- 3. CAMBIAR EL ESTADO DE 'token' A 'user' ---
  // Ahora el estado principal será el objeto de usuario completo.
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Al cargar la app, intentamos recuperar el token y establecer el usuario
    const token = localStorage.getItem('token');
    if (token) {
      const decodedUser: User = jwtDecode(token);

      // Comprobamos si el token ha expirado
      if (decodedUser.exp * 1000 > Date.now()) {
        setUser(decodedUser);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        // Si el token ha expirado, lo limpiamos
        localStorage.removeItem('token');
      }
    }
  }, []);

  // --- 4. ACTUALIZAR LA FUNCIÓN DE LOGIN ---
  const login = (token: string) => {
    // Cuando el usuario hace login, decodificamos el token
    const decodedUser: User = jwtDecode(token);
    
    // Guardamos el token en localStorage para futuras sesiones
    localStorage.setItem('token', token);
    
    // Configuramos el header de apiClient para las siguientes peticiones
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Actualizamos el estado del usuario en la aplicación
    setUser(decodedUser);
  };

  // --- 5. ACTUALIZAR LA FUNCIÓN DE LOGOUT ---
  const logout = () => {
    localStorage.removeItem('token');
    delete apiClient.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // --- 6. EXPONER EL 'user' EN LUGAR DEL 'token' ---
  const value = {
    user,
    isAuthenticated: !!user, // La autenticación ahora depende de si hay un objeto 'user'
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};