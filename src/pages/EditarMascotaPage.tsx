// src/pages/EditarMascotaPage.tsx
import React, { useState, useEffect } from 'react'; // ✅ 1. Se limpia la importación
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

interface MascotaData {
  nombre: string;
  especie?: string;
  raza?: string;
  imagenUrls?: string[];
}

const EditarMascotaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mascota, setMascota] = useState<MascotaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [nuevasImagenes, setNuevasImagenes] = useState<FileList | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  // ✅ 2. Se usa 'React.FormEvent' directamente
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mascota) return;
    setError(null);

    const dataParaEnviar = new FormData();
    dataParaEnviar.append('nombre', mascota.nombre);
    dataParaEnviar.append('especie', mascota.especie || '');
    dataParaEnviar.append('raza', mascota.raza || '');

    if (nuevasImagenes) {
      for (let i = 0; i < nuevasImagenes.length; i++) {
        dataParaEnviar.append('files', nuevasImagenes[i]);
      }
    }

    try {
      await apiClient.patch(`/mascotas/${id}`, dataParaEnviar, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Mascota actualizada con éxito');
      navigate('/mis-mascotas');
    } catch (err: any) {
      const messages = err.response?.data?.message;
      const errorMessage = Array.isArray(messages) ? messages.join(', ') : messages;
      setError(errorMessage || 'Error al actualizar la mascota.');
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (!mascota) return <div>No se encontró la mascota.</div>;

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
            <label htmlFor="imagenes">Reemplazar Imágenes (opcional):</label>
            <input 
              id="imagenes"
              name="imagenes"
              type="file" 
              multiple 
              accept="image/*" 
              onChange={(e) => setNuevasImagenes(e.target.files)} 
            />
          </div>
          <button type="submit" className="submit-button">Actualizar Mascota</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default EditarMascotaPage;