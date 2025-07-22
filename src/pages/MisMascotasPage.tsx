// src/pages/MisMascotasPage.tsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { MascotaCard } from '../components/MascotaCard';
import './Mascotas.css';

interface Mascota {
  id: number;
  nombre: string;
  especie?: string;
  raza?: string;
  imagenUrls?: string[]; // Asegúrate de que coincida con MascotaCard
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

  // 3. FUNCIÓN PARA ACTUALIZAR LA LISTA CUANDO SE ELIMINA UNA MASCOTA
  const handleMascotaEliminada = (id: number) => {
    setMascotas(mascotasActuales => mascotasActuales.filter(m => m.id !== id));
  };

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
            // Se quita el <Link> que envolvía toda la tarjeta
            <MascotaCard 
              key={mascota.id} 
              mascota={mascota} 
              onMascotaEliminada={handleMascotaEliminada} // Se pasa la función como prop
            />
          ))}
        </div>
      ) : (
        <p>Aún no has registrado ninguna mascota. ¡Añade una para empezar!</p>
      )}
    </div>
  );
};

export default MisMascotasPage;