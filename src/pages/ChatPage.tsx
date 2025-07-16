// src/pages/ChatPage.tsx

import { useState, useEffect, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '../socket';
import { useAuth } from '../context/AuthContext';
import './ChatPage.css';

interface Mensaje {
  id: number;
  mensaje: string;
  emisor: {
    id: number;
    nombres: string;
  };
  fechaEnvio: string;
}

const ChatPage = () => {
  const { user, token } = useAuth();
  const { receptorId: receptorIdFromUrl } = useParams(); // Se obtiene el ID de la URL

  // ✅ CAMBIO CLAVE: Se calcula el ID directamente desde la URL. No usamos useState aquí.
  const receptorId = receptorIdFromUrl ? Number(receptorIdFromUrl) : null;
  
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');

  useEffect(() => {
    // Si no hay usuario o un receptorId válido, no se hace nada.
    if (!user || !token || !receptorId) return;

    // Conecta el socket
    socket.auth = { token };
    socket.connect();

    // Se une a la sala correcta
    socket.emit('unirseAChat', { receptorId });

    // Escucha eventos
    socket.on('cargarHistorial', (historial: Mensaje[]) => {
      setMensajes(historial);
    });

    socket.on('nuevoMensaje', (mensaje: Mensaje) => {
      setMensajes((mensajesAnteriores) => [...mensajesAnteriores, mensaje]);
    });

    // Función de limpieza
    return () => {
      socket.off('cargarHistorial');
      socket.off('nuevoMensaje');
      socket.disconnect();
    };
  }, [user, token, receptorId]); // El efecto depende del receptorId de la URL

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (nuevoMensaje.trim() && user && receptorId) {
      socket.emit('enviarMensaje', {
        mensaje: nuevoMensaje,
        receptorId: receptorId,
      });
      setNuevoMensaje('');
    }
  };

  // Si no hay un ID de receptor en la URL, muestra un mensaje de error.
  if (!receptorId) {
    return <div>Error: URL de chat no válida. Falta el ID del receptor.</div>;
  }

  return (
    <div className="chat-container">
      <div className="chat-header">Chateando con Usuario #{receptorId}</div>
      <div className="messages-list">
        {mensajes.map((msg) => (
          <div key={msg.id} className={`message-item ${msg.emisor.id === user?.sub ? 'sent' : 'received'}`}>
            <div className="message-sender">{msg.emisor.id === user?.sub ? 'Tú' : msg.emisor.nombres}</div>
            <div className="message-content">{msg.mensaje}</div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="message-input"
        />
        <button type="submit" className="send-button">Enviar</button>
      </form>
    </div>
  );
};

export default ChatPage;