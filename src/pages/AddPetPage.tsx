// src/pages/AddPetPage.tsx

import React, { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

const AddPetPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    especie: '',
    raza: '',
    fechaNacimiento: '',
    sexo: '',
    color: '',
  });
  
  // ✅ 1. Añadimos un estado para los archivos de imagen
  const [imagenes, setImagenes] = useState<FileList | null>(null);

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  // ✅ 2. La función de envío ahora usa FormData para poder incluir los archivos
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const dataParaEnviar = new FormData();

    // Agregamos todos los campos de texto al FormData
    dataParaEnviar.append('nombre', formData.nombre);
    dataParaEnviar.append('especie', formData.especie);
    dataParaEnviar.append('raza', formData.raza);
    dataParaEnviar.append('fechaNacimiento', formData.fechaNacimiento);
    dataParaEnviar.append('sexo', formData.sexo);
    dataParaEnviar.append('color', formData.color);

    // Agregamos los archivos de imagen si el usuario seleccionó alguno
    if (imagenes) {
      for (let i = 0; i < imagenes.length; i++) {
        // El nombre 'files' debe coincidir con el que espera el interceptor en NestJS
        dataParaEnviar.append('files', imagenes[i]);
      }
    }

    try {
      // Enviamos el FormData
      await apiClient.post('/mascotas', dataParaEnviar, {
        headers: {
          // El navegador ajustará el Content-Type automáticamente a multipart/form-data
          // al enviar un objeto FormData, pero a veces es bueno ser explícito.
          'Content-Type': 'multipart/form-data',
        },
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

          {/* ✅ 3. Añadimos el campo para seleccionar las imágenes en el formulario */}
          <div className="form-group">
            <label htmlFor="imagenes">Imágenes (puedes seleccionar varias):</label>
            <input 
              id="imagenes"
              name="imagenes"
              type="file" 
              multiple 
              accept="image/*" 
              onChange={(e) => setImagenes(e.target.files)} 
            />
          </div>

          <button type="submit" className="submit-button">Guardar Mascota</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddPetPage;