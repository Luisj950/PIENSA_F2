// src/components/MascotaCard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import './MascotaCard.css';
import defaultPetImage from '../assets/default-pet-image.jpg';

interface Mascota {
  id: number;
  nombre: string;
  especie?: string;
  raza?: string;
  imagenUrls?: string[];
}

interface MascotaCardProps {
  mascota: Mascota;
  onMascotaEliminada: (id: number) => void;
}

export const MascotaCard: React.FC<MascotaCardProps> = ({ mascota, onMascotaEliminada }) => {
  
  const handleEliminar = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta mascota?')) {
      try {
        await apiClient.delete(`/mascotas/${mascota.id}`);
        onMascotaEliminada(mascota.id);
      } catch (error) {
        console.error("Error al eliminar la mascota:", error);
        alert("No se pudo eliminar la mascota.");
      }
    }
  };

  return (
    <div className="mascota-card">
      <Link to={`/mascotas/${mascota.id}`} className="card-image-container">
        <img 
          src={mascota.imagenUrls?.[0] || defaultPetImage} 
          alt={`Foto de ${mascota.nombre}`} 
        />
      </Link>
      <div className="card-content">
        <h3>{mascota.nombre}</h3>
        <p>{mascota.especie} - {mascota.raza}</p>
      </div>
      <div className="card-actions">
        {/* ✅ RUTA CORREGIDA */}
        <Link to={`/mascotas/editar/${mascota.id}`} className="card-button edit">Editar</Link>
        <button onClick={handleEliminar} className="card-button delete">Eliminar</button>
      </div>
    </div>
  );
};