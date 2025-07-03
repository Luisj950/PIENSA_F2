import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';

// La interfaz debe coincidir con tu entidad Mascota
interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
}

const MisMascotasPage = () => {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMascotas = async () => {
      try {
        const response = await apiClient.get('/mascotas/mis-mascotas');
        setMascotas(response.data);
      } catch (error) {
        console.error('Error al cargar las mascotas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMascotas();
  }, []);

  if (loading) {
    return <div className="page-container"><p>Cargando tus mascotas...</p></div>;
  }

  return (
    <div className="page-container">
      <div className="profile-container">
        <h2>Mis Mascotas</h2>
        {mascotas.length > 0 ? (
          <ul>
            {mascotas.map((mascota) => (
              <li key={mascota.id}>
                <strong>{mascota.nombre}</strong> ({mascota.especie} - {mascota.raza})
              </li>
            ))}
          </ul>
        ) : (
          <p>Aún no has registrado ninguna mascota.</p>
        )}
        <Link to="/añadir-mascota">
          <button className="submit-button">Añadir Nueva Mascota</button>
        </Link>
      </div>
    </div>
  );
};

export default MisMascotasPage;