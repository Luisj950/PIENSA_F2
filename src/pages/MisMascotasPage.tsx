import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
// CAMBIO: La ruta ahora apunta a la carpeta 'components'
import { MascotaCard } from '../pages/MascotaCard'; 

// La interfaz para la mascota
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

  const handleMascotaEliminada = (id: number) => {
    setMascotas(currentMascotas => currentMascotas.filter(m => m.id !== id));
  };

  if (loading) {
    return <div className="page-container"><p>Cargando tus mascotas...</p></div>;
  }

  return (
    <div className="page-container">
      <div className="profile-container"  style={{
        width: '80%'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Mis Mascotas</h2>
            <Link to="/añadir-mascota">
              <button className="submit-button">Añadir Nueva Mascota</button>
            </Link>
        </div>

        <div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(40%, 3fr))',
  gridColumnEnd: 4,
  gap: '20px',
  marginTop: '20px'
  
}}>
  {mascotas.map((mascota) => (
    <MascotaCard
      key={mascota.id}
      mascota={mascota}
      onMascotaEliminada={handleMascotaEliminada} 
    />
  ))}
</div>
         : (
          <p>Aún no has registrado ninguna mascota.</p>
        )
      </div>
    </div>
  );
};

export default MisMascotasPage;