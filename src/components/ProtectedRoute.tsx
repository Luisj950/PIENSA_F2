// src/components/ProtectedRoute.tsx

import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import type { Rol } from '../auth/enums/rol.enum'; 

interface ProtectedRouteProps {
  roles: Rol[];
}

export const ProtectedRoute = ({ roles }: ProtectedRouteProps) => {
  // --- CORRECCIÓN PRINCIPAL ---
  // Obtenemos solo 'user'. La variable 'isAuthenticated' es redundante.
  const { user } = useAuth();

  // 1. Comprobamos DIRECTAMENTE si el objeto 'user' existe.
  // Si es 'null' (lo que significa que el usuario no está autenticado),
  // lo redirigimos a la página de login.
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Si el código continúa después de este bloque, TypeScript ya sabe
  // con total certeza que 'user' NO es null, por lo que podemos
  // acceder a 'user.rol' de forma segura en las siguientes líneas.

  // 2. Ahora que sabemos que 'user' existe, comprobamos los roles.
  if (!roles.includes(user.rol as Rol)) {
    return <Navigate to="/unauthorized" />; 
  }

  // 3. Si el usuario existe y tiene el rol correcto, renderizamos la página.
  return <Outlet />;
};