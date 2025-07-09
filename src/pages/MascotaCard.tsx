import React from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import './MascotaCard.css';
import defaultPetImage from '../image/Flux_Dev_Depict_a_highly_realistic_and_detailed_image_of_a_yel_2.jpg';

interface Mascota {
  id: number;
  nombre: string;
  especie?: string;
  raza?: string;
  imagenUrl?: string;
}

// La interfaz para los props del componente
interface MascotaCardProps {
  mascota: Mascota;
  // ✅ ESTA ES LA LÍNEA QUE SOLUCIONA EL ERROR:
  onMascotaEliminada: (id: number) => void;
}

export const MascotaCard: React.FC<MascotaCardProps> = ({ mascota, onMascotaEliminada }) => {
  const defaultImage = defaultPetImage;

  const handleDelete = async () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar a ${mascota.nombre}?`)) {
      try {
        await apiClient.delete(`/mascotas/${mascota.id}`);
        onMascotaEliminada(mascota.id);
      } catch (error) {
        console.error('Error al eliminar la mascota:', error);
        alert('No se pudo eliminar la mascota.');
      }
    }
  };

  return (
    <div className="mascota-card">
      <img
        src={mascota.imagenUrl || defaultImage}
        alt={`Foto de ${mascota.nombre}`}
        className="mascota-imagen"
      />
      <div className="mascota-info">
        <h3>{mascota.nombre}</h3>
        <p><strong>Especie:</strong> {mascota.especie || 'No especificada'}</p>
        <p><strong>Raza:</strong> {mascota.raza || 'No especificada'}</p>
      </div>
      <div className="mascota-actions">
        <Link to={`/mascotas/editar/${mascota.id}`}>
          <button className="btn-edit">Editar</button>
        </Link>
        <button className="btn-delete" onClick={handleDelete}>
          Eliminar
        </button>
      </div>
    </div>
  );
};