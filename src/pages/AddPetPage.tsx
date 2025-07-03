import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

const AddPetPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    especie: '',
    raza: '',
    fechaNacimiento: '',
    sexo: '', // El estado inicial sigue siendo una cadena vacía
    color: '',
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      await apiClient.post('/mascotas', formData);
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
            <input id="fechaNacimiento" name="fechaNacimiento" type="date" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="sexo">Sexo:</label>
            <select
              id="sexo"
              name="sexo"
              value={formData.sexo}
              onChange={handleChange}
              required
            >
              {/* --- ¡IMPORTANTE: AÑADIR ESTA OPCIÓN! --- */}
              <option value="">Selecciona una opción</option>
              <option value="M">Macho</option>
              <option value="H">Hembra</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="color">Color (opcional):</label>
            <input id="color" name="color" type="text" onChange={handleChange} />
          </div>

          <button type="submit" className="submit-button">Guardar Mascota</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddPetPage;