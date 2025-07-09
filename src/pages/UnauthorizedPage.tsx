// src/pages/UnauthorizedPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Acceso Denegado</h1>
      <p>No tienes los permisos necesarios para ver esta página.</p>
      <Link to="/">Volver al Inicio</Link>
    </div>
  );
};

export default UnauthorizedPage;