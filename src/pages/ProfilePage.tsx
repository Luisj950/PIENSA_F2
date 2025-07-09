import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Interfaz para la información que esperamos del usuario
interface UserProfile {
  sub: number;
  email: string;
  rol: string;
  nombres?: string; // Hacemos estos campos opcionales por si no vienen en el token
  apellidos?: string;
}

const ProfilePage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('/auth/profile');
        setUserProfile(response.data);
      } catch (err) {
        setError('No se pudo cargar el perfil del usuario. Por favor, inicie sesión de nuevo.');
        // Si hay un error (ej. token expirado), cerramos sesión
        logout();
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [logout]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  if (loading) {
    return <div className="page-container"><p>Cargando perfil...</p></div>;
  }

  if (error) {
    return <div className="page-container"><p className="error-message">{error}</p></div>;
  }

  return (
    <div className="page-container">
      <div className="profile-container">
        <h2>Perfil de Usuario</h2>
        {userProfile ? (
          <>
            <p><strong>ID de Usuario:</strong> {userProfile.sub}</p>
            <p><strong>Email:</strong> {userProfile.email}</p>
            <p><strong>Rol:</strong> {userProfile.rol}</p>
            {/* Mostramos nombres y apellidos si existen */}
            {userProfile.nombres && <p><strong>Nombres:</strong> {userProfile.nombres}</p>}
            {userProfile.apellidos && <p><strong>Apellidos:</strong> {userProfile.apellidos}</p>}
            <br />
            <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
          </>
        ) : (
          <p>No se encontró la información del perfil.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;