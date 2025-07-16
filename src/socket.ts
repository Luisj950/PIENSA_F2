import { io } from 'socket.io-client';

// La URL de su backend NestJS
const URL = 'http://localhost:3000';

export const socket = io(URL, {
  autoConnect: false, // Se conectará manualmente desde el componente
});