// Ruta: src/pages/EditarMascotaPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

// CAMBIO 1: La interfaz ahora incluye el 'id' y 'imagenUrl' que vienen de la API
interface MascotaData {
  id: number;
  nombre: string;
  especie?: string;
  raza?: string;
  imagenUrl?: string;
}

const EditarMascotaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mascota, setMascota] = useState<MascotaData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMascota = async () => {
      try {
        const response = await apiClient.get(`/mascotas/${id}`);
        setMascota(response.data);
      } catch (error) {
        console.error("Error al cargar la mascota:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMascota();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (mascota) {
      setMascota({ ...mascota, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mascota) return;

    // CAMBIO 2: Se crea un nuevo objeto sin la propiedad 'id' para enviar al backend
    const { id: petId, ...updateData } = mascota;

    try {
      await apiClient.patch(`/mascotas/${id}`, updateData);
      alert('Mascota actualizada con éxito');
      navigate('/mis-mascotas');
    } catch (error) {
      console.error('Error al actualizar la mascota:', error);
      alert('No se pudo actualizar la mascota.');
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!mascota) {
    return <div>No se encontró la mascota.</div>;
  }

  return (
    <div className="page-container">
      <div className="profile-container">
        <h2>Editar Mascota</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input type="text" id="nombre" name="nombre" value={mascota.nombre} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="especie">Especie</label>
            <input type="text" id="especie" name="especie" value={mascota.especie || ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="raza">Raza</label>
            <input type="text" id="raza" name="raza" value={mascota.raza || ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="imagenUrl">URL de la Imagen</label>
            <input type="text" id="imagenUrl" name="imagenUrl" value={mascota.imagenUrl || ''} onChange={handleChange} />
          </div>
          <button type="submit" className="submit-button">Actualizar Mascota</button>
        </form>
      </div>
    </div>
  );
};

export default EditarMascotaPage;