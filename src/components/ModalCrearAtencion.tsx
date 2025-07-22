// src/components/ModalCrearAtencion.tsx

import React, { useState, type FormEvent } from 'react'; // ✅ Se limpian los imports
import Modal from 'react-modal';
import apiClient from '../api/apiClient';

// Se define el objeto de tipos de cita directamente aquí
const TIPOS_DE_CITA = {
  CONSULTA: 'Consulta',
  CIRUGIA: 'Cirugía',
  VACUNACION: 'Vacunación',
  DESPARASITACION: 'Desparasitación',
  EXAMEN_LABORATORIO: 'Examen de Laboratorio',
  IMAGENOLOGIA: 'Imagenología',
  URGENCIA: 'Urgencia',
} as const;

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  mascotaId: number;
  onAtencionCreada: () => void;
}

const customStyles = {
  overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 1000 },
  content: {
    top: '50%', left: '50%', right: 'auto', bottom: 'auto',
    marginRight: '-50%', transform: 'translate(-50%, -50%)',
    width: '500px', borderRadius: '8px', padding: '2rem', border: 'none',
  },
};

Modal.setAppElement('#root');

export const ModalCrearAtencion = ({ isOpen, onRequestClose, mascotaId, onAtencionCreada }: ModalProps) => {
  const [formData, setFormData] = useState({
    categoria: TIPOS_DE_CITA.CONSULTA,
    anamnesis: '',
    diagnostico: '',
    tratamiento: '',
    observaciones: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await apiClient.post(`/historias-clinicas/atencion/${mascotaId}`, formData);
      alert('Atención registrada con éxito');
      onAtencionCreada();
      onRequestClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar la atención.');
      console.error(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles} contentLabel="Registrar Nueva Atención">
      <h2>Registrar Nueva Atención</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Categoría</label>
          <select name="categoria" value={formData.categoria} onChange={handleChange}>
            {Object.values(TIPOS_DE_CITA).map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Anamnesis (Motivo de consulta)</label>
          <textarea name="anamnesis" value={formData.anamnesis} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Diagnóstico</label>
          <textarea name="diagnostico" value={formData.diagnostico} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Tratamiento</label>
          <textarea name="tratamiento" value={formData.tratamiento} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Observaciones (Opcional)</label>
          <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} />
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="form-actions">
          <button type="submit" className="button-primary">Guardar</button>
          <button type="button" onClick={onRequestClose} className="button-secondary">Cancelar</button>
        </div>
      </form>
    </Modal>
  );
};