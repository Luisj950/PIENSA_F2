// src/pages/DetalleMascotaPage.tsx

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext'; // Se importa para saber el rol del usuario
import { ModalCrearAtencion } from '../components/ModalCrearAtencion'; // Se importa el nuevo modal
import './Mascotas.css';

// --- Interfaces actualizadas con los datos del backend ---
interface AtencionMedica {
  id: number;
  fechaAtencion: string;
  categoria: string;
  anamnesis: string;
  diagnostico: string;
  tratamiento: string;
  observaciones?: string;
  veterinario: {
    nombres: string;
    apellidos: string;
  };
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
  // La historia clínica ahora viene de su propio endpoint
}

const DetalleMascotaPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth(); // Se obtiene el usuario para verificar su rol
  const [mascota, setMascota] = useState<MascotaDetalle | null>(null);
  const [historia, setHistoria] = useState<HistoriaClinica | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  // Usamos useCallback para evitar que la función se recree innecesariamente
  const fetchDatos = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      // Hacemos las dos llamadas a la API en paralelo para más eficiencia
      const [resMascota, resHistoria] = await Promise.all([
        apiClient.get(`/mascotas/${id}`),
        apiClient.get(`/historias-clinicas/mascota/${id}`)
      ]);
      setMascota(resMascota.data);
      setHistoria(resHistoria.data);
    } catch (err: any) {
      // Si no hay historia clínica, no lo tratamos como un error fatal
      if (err.response?.status === 404) {
        setHistoria(null); // La mascota existe pero no tiene historial
      } else {
        setError('No se pudo cargar la información de la mascota.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDatos();
  }, [fetchDatos]);

  if (loading) return <div className="page-container"><p>Cargando detalles...</p></div>;
  if (error) return <div className="page-container"><p style={{ color: 'red' }}>{error}</p></div>;
  if (!mascota) return <div className="page-container"><p>No se encontró la mascota.</p></div>;

  return (
    <div className="page-container">
      <header className="page-header">
        <h2>{mascota.nombre}</h2>
        {/* El botón solo se muestra si el usuario es veterinario o admin */}
        {(user?.rol === 'veterinario' || user?.rol === 'admin') && (
          <button onClick={() => setModalAbierto(true)} className="add-button">
            Añadir Atención
          </button>
        )}
      </header>
      
      <div className="info-card">
        <h3>Información General</h3>
        <p><strong>Especie:</strong> {mascota.especie}</p>
        <p><strong>Raza:</strong> {mascota.raza}</p>
        <p><strong>Fecha de Nacimiento:</strong> {new Date(mascota.fechaNacimiento).toLocaleDateString()}</p>
      </div>

      <h3>Historia Clínica</h3>
      {historia && historia.atenciones.length > 0 ? (
        <div className="atenciones-container">
          {historia.atenciones.map(atencion => (
            <div key={atencion.id} className="atencion-card">
              <h4>{atencion.categoria.replace(/_/g, ' ')} - {new Date(atencion.fechaAtencion).toLocaleDateString()}</h4>
              <p><strong>Veterinario:</strong> {atencion.veterinario.nombres} {atencion.veterinario.apellidos}</p>
              <p><strong>Motivo:</strong> {atencion.anamnesis}</p>
              <p><strong>Diagnóstico:</strong> {atencion.diagnostico}</p>
              {atencion.tratamiento && <p><strong>Tratamiento:</strong> {atencion.tratamiento}</p>}
              {atencion.observaciones && <p><strong>Observaciones:</strong> {atencion.observaciones}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p>No hay atenciones médicas registradas.</p>
      )}

      {/* Renderizamos el modal */}
      {id && (
        <ModalCrearAtencion
          isOpen={modalAbierto}
          onRequestClose={() => setModalAbierto(false)}
          mascotaId={Number(id)}
          onAtencionCreada={() => {
            setModalAbierto(false);
            fetchDatos(); // Vuelve a cargar los datos para mostrar el nuevo registro
          }}
        />
      )}
    </div>
  );
};

export default DetalleMascotaPage;