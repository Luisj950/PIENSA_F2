// src/pages/ContactosPage.tsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
        // ✅ LA CORRECCIÓN DEFINITIVA ESTÁ AQUÍ:
        // Se usa 127.0.0.1 en lugar de localhost para evitar el conflicto de IP.
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
    return <div>Cargando contactos...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: 'auto' }}>
      <h1>Contactos</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {usuarios.length > 0 ? (
          usuarios.map((usuario) => (
            <li key={usuario.id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{usuario.nombres} {usuario.apellidos}</strong>
                <br />
                <small>Rol: {usuario.rol}</small>
              </div>
              <Link to={`/chat/${usuario.id}`} style={{ textDecoration: 'none', backgroundColor: '#007bff', color: 'white', padding: '0.5rem 1rem', borderRadius: '5px' }}>
                Chatear
              </Link>
            </li>
          ))
        ) : (
          <p>No se encontraron contactos para mostrar.</p>
        )}
      </ul>
    </div>
  );
};

export default ContactosPage;