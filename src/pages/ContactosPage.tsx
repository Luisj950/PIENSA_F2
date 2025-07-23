// src/pages/ContactosPage.tsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ContactosPage.css'; // 👈 Se importa el nuevo archivo de estilos

interface UserToList {
  id: number;
  nombres: string;
  apellidos: string;
  rol: string;
}

const ContactosPage = () => {
  const { token } = useAuth();
  const [usuarios, setUsuarios] = useState<UserToList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError('No estás autenticado.');
      return;
    }

    const fetchUsuarios = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3000/users/contacts', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los contactos del servidor.');
        }

        const datosReales: UserToList[] = await response.json();
        setUsuarios(datosReales);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [token]);

  if (loading) {
    return <div className="page-container">Cargando contactos...</div>;
  }

  if (error) {
    return <div className="page-container">Error: {error}</div>;
  }

  return (
    <div className="page-container">
      <h1 className="page-header">Contactos</h1>
      <ul className="contact-list">
        {usuarios.length > 0 ? (
          usuarios.map((usuario) => (
            <li key={usuario.id} className="contact-item">
              <div className="contact-info">
                <strong>{usuario.nombres} {usuario.apellidos}</strong>
                <br />
                <small>Rol: {usuario.rol}</small>
              </div>
              <Link to={`/chat/${usuario.id}`} className="chat-button">
                Chatear
              </Link>
            </li>
          ))
        ) : (
          <p className="no-contacts-message">No se encontraron contactos para mostrar.</p>
        )}
      </ul>
    </div>
  );
};

export default ContactosPage;