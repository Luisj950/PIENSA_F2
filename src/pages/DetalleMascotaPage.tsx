// src/pages/DetalleMascotaPage.tsx

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/apiClient';
import './Mascotas.css'; // Importamos los nuevos estilos

// --- Interfaces para la estructura de datos ---
interface AtencionMedica {
  id: number;
  fecha: string;
  motivoConsulta: string;
  diagnostico: string;
  tratamientoPrescrito?: string;
}

interface HistoriaClinica {
  id: number;
  atenciones: AtencionMedica[];
}

interface MascotaDetalle {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  fechaNacimiento: string;
  historiaClinica: HistoriaClinica | null;
}

const DetalleMascotaPage = () => {
  const { id } = useParams<{ id: string }>();
  const [mascota, setMascota] = useState<MascotaDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchDetalleMascota = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/mascotas/${id}`);
        setMascota(response.data);
      } catch (err) {
        setError('No se pudo cargar la información de la mascota.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetalleMascota();
  }, [id]);

  if (loading) return <div className="page-container"><p>Cargando detalles...</p></div>;
  if (error) return <div className="page-container"><p style={{ color: 'red' }}>{error}</p></div>;
  if (!mascota) return <div className="page-container"><p>No se encontró la mascota.</p></div>;

  return (
    <div className="page-container">
      <header className="page-header">
        <h2>{mascota.nombre}</h2>
      </header>
      
      <div className="info-card">
        <h3>Información General</h3>
        <p><strong>Especie:</strong> {mascota.especie}</p>
        <p><strong>Raza:</strong> {mascota.raza}</p>
        <p><strong>Fecha de Nacimiento:</strong> {new Date(mascota.fechaNacimiento).toLocaleDateString()}</p>
      </div>

      <h3>Historia Clínica</h3>
      {mascota.historiaClinica && mascota.historiaClinica.atenciones.length > 0 ? (
        <div className="atenciones-container">
          {mascota.historiaClinica.atenciones.map(atencion => (
            <div key={atencion.id} className="atencion-card">
              <h4>Atención del {new Date(atencion.fecha).toLocaleDateString()}</h4>
              <p><strong>Motivo:</strong> {atencion.motivoConsulta}</p>
              <p><strong>Diagnóstico:</strong> {atencion.diagnostico}</p>
              {atencion.tratamientoPrescrito && <p><strong>Tratamiento:</strong> {atencion.tratamientoPrescrito}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p>No hay atenciones médicas registradas.</p>
      )}
    </div>
  );
};

export default DetalleMascotaPage;