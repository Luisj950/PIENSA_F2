// src/components/MascotaCard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import './MascotaCard.css'; // Asegúrate de que este archivo CSS exista en la misma carpeta o la ruta sea correcta
import defaultPetImage from '../assets/default-pet-image.jpg'; // Asegúrate de tener una imagen por defecto aquí

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

const API_URL = 'http://localhost:3000';

export const MascotaCard: React.FC<MascotaCardProps> = ({ mascota, onMascotaEliminada }) => {
  const imageUrl = mascota.imagenUrls && mascota.imagenUrls.length > 0
    ? `${API_URL}${mascota.imagenUrls[0]}`
    : defaultPetImage;

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm(`¿Estás seguro de que quieres eliminar a ${mascota.nombre}?`)) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/mascotas/${mascota.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('No se pudo eliminar la mascota.');
        onMascotaEliminada(mascota.id);
      } catch (error) {
        console.error('Error al eliminar la mascota:', error);
      }
    }
  };

  return (
    <div className="mascota-card">
      <Link to={`/mascotas/${mascota.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <img src={imageUrl} alt={`Foto de ${mascota.nombre}`} className="mascota-imagen" />
        <div className="mascota-info">
          <h3>{mascota.nombre}</h3>
          <p>{mascota.especie || 'No especificada'}</p>
        </div>
      </Link>
      <div className="mascota-actions">
        <Link to={`/mascotas/editar/${mascota.id}`} className="btn-edit">Editar</Link>
        <button className="btn-delete" onClick={handleDelete}>Eliminar</button>
      </div>
    </div>
  );
};