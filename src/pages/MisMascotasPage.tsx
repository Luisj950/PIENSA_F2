// src/pages/MisMascotasPage.tsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { MascotaCard } from '../components/MascotaCard'; // Importamos el nuevo componente
import './Mascotas.css'; // Importamos los nuevos estilos

interface Mascota {
  id: number;
  nombre: string;
  especie?: string;
  raza?: string;
  imagenUrl?: string;
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
      <header className="page-header">
        <h2>Mis Mascotas</h2>
        <Link to="/añadir-mascota" className="add-button">
          Añadir Mascota
        </Link>
      </header>

      {mascotas.length > 0 ? (
        <div className="mascotas-grid">
          {mascotas.map((mascota) => (
            <Link key={mascota.id} to={`/mascotas/${mascota.id}`} style={{ textDecoration: 'none' }}>
              <MascotaCard mascota={mascota} />
            </Link>
          ))}
        </div>
      ) : (
        <p>Aún no has registrado ninguna mascota. ¡Añade una para empezar!</p>
      )}
    </div>
  );
};

export default MisMascotasPage;