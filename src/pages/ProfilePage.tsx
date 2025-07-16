// src/pages/ProfilePage.tsx


import { useAuth } from '../context/AuthContext';
import './ProfilePage.css'; // Asegúrate de tener este archivo de estilos

const ProfilePage = () => {
  const { user } = useAuth();

  // Si el usuario aún no se ha cargado desde el contexto, muestra un mensaje.
  if (!user) {
    return <div>Cargando perfil...</div>;
  }

  // Obtiene la inicial del nombre para el avatar de forma segura
  const inicial = user.nombres ? user.nombres[0].toUpperCase() : '?';

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '50px' }}>
      <div className="profile-card">
        <div className="profile-avatar">{inicial}</div>
        <h2>{user.nombres} {user.apellidos}</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Rol:</strong> {user.rol}</p>
        {user.telefono && <p><strong>Teléfono:</strong> {user.telefono}</p>}
      </div>
    </div>
  );
};

export default ProfilePage;