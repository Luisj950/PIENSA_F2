// src/pages/AdminDashboardPage.jsx

import { useAuth } from '../context/AuthContext'; // Importamos el hook para acceder a los datos del usuario

const AdminDashboardPage = () => {
  // Obtenemos los datos del usuario logueado desde nuestro contexto
  const { user } = useAuth();

  return (
    <div className="page-container">
      <h1>Panel de Administrador</h1>
      <p>
        ¡Bienvenido de nuevo, <strong>{user?.email}</strong>!
      </p>
      <p>
        Esta es un área restringida y solo los usuarios con el rol de <strong>'{user?.rol}'</strong> pueden verla.
      </p>
      
      <hr style={{ margin: '2rem 0' }} />

      {/* --- Aquí puedes empezar a añadir tus componentes de administrador --- */}
      
      <div style={{ marginTop: '2rem' }}>
        <h2>Herramientas de Administrador</h2>
        <ul>
          <li>Gestionar Usuarios</li>
          <li>Ver Estadísticas del Sitio</li>
          <li>Configuraciones Generales</li>
          {/* (Aquí irían enlaces a otras secciones o componentes de admin) */}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboardPage;