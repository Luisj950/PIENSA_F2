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
  imagenUrls?: string[];
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

  const handleMascotaEliminada = (id: number) => {
    setMascotas(mascotasActuales => mascotasActuales.filter(m => m.id !== id));
  };

  if (loading) {
    return <div className="page-container"><p>Cargando tus mascotas...</p></div>;
  }

  return (
    <div className="mascotas-page">
      <header className="mascotas-header">
        <h1>Mis Mascotas</h1>
        {/* ✅ Se corrige la ruta a "/add-pet" que corresponde a AddPetPage */}
        <Link to="/add-pet" className="add-mascota-link">
          Añadir Mascota
        </Link>
      </header>

      {mascotas.length > 0 ? (
        <div className="mascotas-grid">
          {mascotas.map((mascota) => (
            <MascotaCard 
              key={mascota.id} 
              mascota={mascota} 
              onMascotaEliminada={handleMascotaEliminada}
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