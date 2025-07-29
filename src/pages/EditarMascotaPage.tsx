// src/pages/EditarMascotaPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import './Formulario.css'; // Asegúrate de importar los estilos

// ✅ 1. La interfaz ahora incluye todos los campos
interface MascotaData {
  nombre: string;
  especie: string;
  raza: string;
  fechaNacimiento: string;
  sexo: 'Macho' | 'Hembra' | '';
  color: string;
  imagenUrls?: string[];
}

const EditarMascotaPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [mascota, setMascota] = useState<MascotaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [nuevasImagenes, setNuevasImagenes] = useState<FileList | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMascota = async () => {
      try {
        const response = await apiClient.get(`/mascotas/${id}`);
        // Formateamos la fecha para el input type="date"
        const fecha = new Date(response.data.fechaNacimiento).toISOString().split('T')[0];
        setMascota({ ...response.data, fechaNacimiento: fecha });
      } catch (error) {
        console.error("Error al cargar la mascota:", error);
        setError("No se pudo cargar la información de la mascota.");
      } finally {
        setLoading(false);
      }
    };
    fetchMascota();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (mascota) {
      setMascota({ ...mascota, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mascota) return;
    setError(null);

    const dataParaEnviar = new FormData();
    
    // ✅ 2. Se añaden TODOS los campos al FormData
    dataParaEnviar.append('nombre', mascota.nombre);
    dataParaEnviar.append('especie', mascota.especie);
    dataParaEnviar.append('raza', mascota.raza);
    dataParaEnviar.append('fechaNacimiento', mascota.fechaNacimiento);
    dataParaEnviar.append('sexo', mascota.sexo);
    dataParaEnviar.append('color', mascota.color);

    if (nuevasImagenes) {
      for (let i = 0; i < nuevasImagenes.length; i++) {
        dataParaEnviar.append('files', nuevasImagenes[i]);
      }
    }

    try {
      await apiClient.patch(`/mascotas/${id}`, dataParaEnviar, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Mascota actualizada con éxito');
      navigate('/mis-mascotas');
    } catch (err: any) {
      const messages = err.response?.data?.message;
      const errorMessage = Array.isArray(messages) ? messages.join(', ') : messages;
      setError(errorMessage || 'Error al actualizar la mascota.');
    }
  };

  if (loading) return <div className="page-container"><p>Cargando...</p></div>;
  if (error) return <div className="page-container"><p className="error-message">{error}</p></div>;
  if (!mascota) return <div className="page-container"><p>No se encontró la mascota.</p></div>;

  return (
    <div className="page-container">
      <div className="form-container">
        <h2 className="form-title">Editar Mascota</h2>
        <form onSubmit={handleSubmit}>
          {/* ✅ 3. Se añaden todos los campos al formulario */}
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input type="text" id="nombre" name="nombre" value={mascota.nombre} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="especie">Especie</label>
            <input type="text" id="especie" name="especie" value={mascota.especie} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="raza">Raza</label>
            <input type="text" id="raza" name="raza" value={mascota.raza} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
            <input type="date" id="fechaNacimiento" name="fechaNacimiento" value={mascota.fechaNacimiento} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="sexo">Sexo</label>
            <select id="sexo" name="sexo" value={mascota.sexo} onChange={handleChange} required>
              <option value="">Selecciona una opción</option>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="color">Color</label>
            <input type="text" id="color" name="color" value={mascota.color} onChange={handleChange} />
          </div>

          {mascota.imagenUrls && mascota.imagenUrls.length > 0 && (
            <div className="current-images-container">
              <label>Imágenes Actuales</label>
              <div className="current-images-grid">
                {mascota.imagenUrls.map((url, index) => (
                  <div key={index} className="image-wrapper">
                    <img src={url} alt={`Imagen ${index + 1} de ${mascota.nombre}`} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="imagenes">Reemplazar Imágenes (opcional):</label>
            <label htmlFor="imagenes" className="file-input-label">Seleccionar nuevos archivos...</label>
            <input id="imagenes" name="imagenes" type="file" multiple accept="image/*" onChange={(e) => setNuevasImagenes(e.target.files)} className="file-input-hidden" />
            <div className="file-names-display">
              {nuevasImagenes && nuevasImagenes.length > 0
                ? Array.from(nuevasImagenes).map(file => file.name).join(', ')
                : 'No se han seleccionado nuevos archivos.'
              }
            </div>
          </div>

          <button type="submit" className="submit-button">Actualizar Mascota</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default EditarMascotaPage;