// src/components/Navbar.tsx

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // --- CORRECCIÓN AQUÍ ---
  const handleLogout = () => {
    // 1. Llama a la función logout del contexto para borrar los datos de la sesión.
    logout();
    // 2. Usa navigate para redirigir al usuario a la página de login.
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Piensa Veterinaria</Link>
      </div>

      <div className="navbar-links">
        {user ? (
          <>
            {/* Enlaces condicionales por rol */}
            <Link to="/mis-mascotas">Mis Mascotas</Link>
            <Link to="/profile">Perfil</Link>

            {user.rol === 'admin' && (
              <Link to="/admin-dashboard">Panel Admin</Link>
            )}

            {user.rol === 'veterinario' && (
              <Link to="/gestion-citas">Gestionar Citas</Link>
            )}
          </>
        ) : (
          <>
            {/* Enlaces para usuarios no autenticados */}
            <Link to="/login">Iniciar Sesión</Link>
            <Link to="/register">Registrarse</Link>
          </>
        )}
      </div>

      <div className="navbar-user-info">
        {user && (
          <>
            <span>
              {user.email} (<strong>{user.rol}</strong>)
            </span>
            <button onClick={handleLogout} className="logout-button">
              Cerrar Sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;