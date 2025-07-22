// src/components/Navbar.tsx

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Piensa Veterinaria
      </Link>
      
      <div className="navbar-links">
        {isAuthenticated ? (
          // --- ENLACES PARA USUARIOS AUTENTICADOS ---
          <>
            <Link to="/mis-mascotas">Mis Mascotas</Link>
            
            {/* ✅ ENLACE AÑADIDO */}
            <Link to="/agenda">Agenda</Link>

            <Link to="/contactos">Contactos</Link>
            <Link to="/profile">Perfil</Link>
            
            {user?.rol === 'admin' && (
              <Link to="/admin-dashboard">Panel Admin</Link>
            )}

            <div className="navbar-user">
              <span>{user?.email} ({user?.rol})</span>
              <button onClick={handleLogout} className="logout-button-nav">Cerrar Sesión</button>
            </div>
          </>
        ) : (
          // --- ENLACES PARA USUARIOS NO AUTENTICADOS ---
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Registro</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;