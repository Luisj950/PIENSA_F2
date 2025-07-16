// src/pages/ContactosPage.tsx

// ✅ CAMBIO 1: Se quita 'import React', pero se mantienen los hooks que sí se usan.
import { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';

// Interfaz para el usuario de la lista
interface UserToList {
  id: number;
  nombres: string;
  apellidos: string;
  rol: string;
}

const ContactosPage = () => {
  const [usuarios, setUsuarios] = useState<UserToList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Esta función simula una llamada al backend para obtener los usuarios.
    const fetchUsuarios = () => {
      const datosDePrueba: UserToList[] = [
        { id: 1, nombres: 'Beto', apellidos: 'Jimenez', rol: 'propietario' },
        { id: 2, nombres: 'Carlos', apellidos: 'David', rol: 'veterinario' },
        { id: 3, nombres: 'Ana', apellidos: 'Suarez', rol: 'propietario' },
      ];
      setUsuarios(datosDePrueba);
      setLoading(false);
    };

    fetchUsuarios();
  }, []);

  if (loading) {
    return <div>Cargando contactos...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: 'auto' }}>
      <h1>Contactos</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {/* ✅ CAMBIO 2: Se añade el tipo a 'usuario' para solucionar el último error. */}
        {usuarios.map((usuario: UserToList) => (
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
        ))}
      </ul>
    </div>
  );
};

export default ContactosPage;