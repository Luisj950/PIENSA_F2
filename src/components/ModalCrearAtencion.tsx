// src/components/ModalCrearAtencion.tsx

import React, { useState, type FormEvent } from 'react';
import Modal from 'react-modal';
import apiClient from '../api/apiClient';
import './Modal.css'; // ✅ 1. Importamos el nuevo archivo CSS

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

// ✅ 2. Se elimina el objeto 'customStyles'

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
      onRequestClose(); // Cierra el modal al tener éxito
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar la atención.');
      console.error(err);
    }
  };

  return (
    // ✅ 3. Se usan las propiedades className y overlayClassName
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onRequestClose} 
      className="modal-content"
      overlayClassName="modal-overlay"
      contentLabel="Registrar Nueva Atención"
    >
      <div className="modal-header">
        <h2>Registrar Nueva Atención</h2>
        <button onClick={onRequestClose} className="close-button">&times;</button>
      </div>

      <div className="modal-body">
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
            <button type="button" onClick={onRequestClose} className="button-secondary">Cancelar</button>
            <button type="submit" className="button-primary">Guardar</button>
          </div>
        </form>
      </div>
    </Modal>
  );
};