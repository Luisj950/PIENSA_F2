// src/components/ModalVerCita.tsx

import Modal from 'react-modal';
import type { Event as CalendarEvent } from 'react-big-calendar';

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  evento: CalendarEvent | null;
  onCancelarCita: (citaId: number) => void;
}

// ✅ CAMBIO IMPLEMENTADO: Se añaden los estilos para el fondo del modal (overlay)
const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1000,
  },
  content: {
    top: '50%', left: '50%', right: 'auto', bottom: 'auto',
    marginRight: '-50%', transform: 'translate(-50%, -50%)',
    width: '450px', borderRadius: '8px', padding: '2rem', border: 'none',
  },
};

// Esta línea es crucial y ya la tenías, lo cual es perfecto.
Modal.setAppElement('#root');

export const ModalVerCita = ({ isOpen, onRequestClose, evento, onCancelarCita }: ModalProps) => {
  if (!evento) return null;

  const citaOriginal = evento.resource;

  const handleCancelarClick = () => {
    if (window.confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      onCancelarCita(citaOriginal.id);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles} contentLabel="Detalle de la Cita">
      <h2>Detalle de la Cita</h2>
      <div className="detalle-cita">
        <p><strong>Paciente:</strong> {citaOriginal.mascota.nombre}</p>
        <p><strong>Tipo:</strong> {citaOriginal.tipo.replace(/_/g, ' ')}</p>
        <p><strong>Fecha:</strong> {evento.start?.toLocaleDateString('es-EC')}</p>
        <p><strong>Hora:</strong> {evento.start?.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })} - {evento.end?.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}</p>
        <p><strong>Estado:</strong> <span className={`status-${citaOriginal.estado}`}>{citaOriginal.estado}</span></p>
      </div>
      <div className="form-actions">
        {citaOriginal.estado === 'programada' && (
          <button onClick={handleCancelarClick} className="button-danger">
            Cancelar Cita
          </button>
        )}
        <button type="button" onClick={onRequestClose} className="button-secondary">Cerrar</button>
      </div>
    </Modal>
  );
};