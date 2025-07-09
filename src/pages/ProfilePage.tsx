import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css'; // Importamos el nuevo archivo de estilos

interface UserProfile {
  sub: number;
  email: string;
  rol: string;
  nombres?: string;
  apellidos?: string;
}

const ProfilePage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('/auth/profile');
        setProfile(response.data);
      } catch (err) {
        setError('No se pudo cargar el perfil.');
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Función para obtener las iniciales del usuario para el avatar
  const getInitials = () => {
    if (!profile) return '';
    const firstInitial = profile.nombres ? profile.nombres[0] : '';
    const lastInitial = profile.apellidos ? profile.apellidos[0] : '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  if (error) return <div className="page-container"><p className="error-message">{error}</p></div>;
  if (!profile) return <div className="page-container"><p>Cargando perfil...</p></div>;

  return (
    <div className="page-container">
      <div className="profile-card">
        <div className="profile-avatar">{getInitials()}</div>
        
        <h2 className="profile-name">
          {profile.nombres || ''} {profile.apellidos || ''}
        </h2>

        <p className="profile-email">{profile.email}</p>

        <div className="profile-role">{profile.rol}</div>

        <div className="profile-details">
          <strong>ID de Usuario:</strong> {profile.sub}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;