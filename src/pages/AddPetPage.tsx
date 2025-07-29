// src/pages/AddPetPage.tsx

import React, { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import './Formulario.css'; // 💅 1. Importa el nuevo archivo CSS

const AddPetPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    especie: '',
    raza: '',
    fechaNacimiento: '',
    sexo: '',
    color: '',
  });
  
  const [imagenes, setImagenes] = useState<FileList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const dataParaEnviar = new FormData();

    // Agregamos todos los campos
    Object.entries(formData).forEach(([key, value]) => {
      dataParaEnviar.append(key, value);
    });

    // Agregamos los archivos de imagen
    if (imagenes) {
      for (let i = 0; i < imagenes.length; i++) {
        dataParaEnviar.append('files', imagenes[i]);
      }
    }

    try {
      await apiClient.post('/mascotas', dataParaEnviar, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('¡Mascota registrada con éxito!');
      navigate('/mis-mascotas');
    } catch (err: any) {
      const messages = err.response?.data?.message;
      const errorMessage = Array.isArray(messages) ? messages.join(', ') : messages;
      setError(errorMessage || 'Error al registrar la mascota.');
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h2 className="form-title">Registrar Nueva Mascota</h2>
        <form onSubmit={handleSubmit}>
          {/* ... tus campos de texto existentes ... */}
          <div className="form-group">
            <label htmlFor="nombre">Nombre:</label>
            <input id="nombre" name="nombre" type="text" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="especie">Especie:</label>
            <input id="especie" name="especie" type="text" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="raza">Raza:</label>
            <input id="raza" name="raza" type="text" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="fechaNacimiento">Fecha de Nacimiento:</label>
            <input id="fechaNacimiento" name="fechaNacimiento" type="date" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="sexo">Sexo:</label>
            <select id="sexo" name="sexo" value={formData.sexo} onChange={handleChange} required>
              <option value="">Selecciona una opción</option>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="color">Color (opcional):</label>
            <input id="color" name="color" type="text" onChange={handleChange} />
          </div>

          {/* ✅ 2. Estructura mejorada para el input de archivos */}
          <div className="form-group">
            <label htmlFor="imagenes">Imágenes (puedes seleccionar varias):</label>
            <label htmlFor="imagenes" className="file-input-label">
              Seleccionar archivos...
            </label>
            <input 
              id="imagenes"
              name="imagenes"
              type="file" 
              multiple 
              accept="image/*" 
              onChange={(e) => setImagenes(e.target.files)}
              className="file-input-hidden" // Ocultamos el input original
            />
            {/* ✅ 3. Mostramos los nombres de los archivos seleccionados */}
            <div className="file-names-display">
              {imagenes && imagenes.length > 0
                ? Array.from(imagenes).map(file => file.name).join(', ')
                : 'No se han seleccionado archivos.'
              }
            </div>
          </div>

          <button type="submit" className="submit-button">Guardar Mascota</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddPetPage;