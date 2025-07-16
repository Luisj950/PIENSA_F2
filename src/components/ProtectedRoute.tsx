// src/components/ProtectedRoute.tsx

import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

// Asumimos que tienes un enum o tipo para Rol, si no, puedes usar string
// import type { Rol } from '../auth/enums/rol.enum'; 
type Rol = 'propietario' | 'admin' | 'veterinario';

interface ProtectedRouteProps {
  roles: Rol[];
}

export const ProtectedRoute = ({ roles }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();

  // 1. Primero, revisa si está autenticado. Esto es más rápido que revisar el user.
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // 2. Si está autenticado pero el user aún no carga, puedes mostrar un loader.
  if (!user) {
    return <div>Cargando...</div>; 
  }

  // 3. Ahora que sabemos que 'user' existe, comprobamos los roles.
  if (!roles.includes(user.rol as Rol)) {
    return <Navigate to="/unauthorized" />; 
  }

  // 4. Si todo está bien, renderizamos la página solicitada.
  return <Outlet />;
};