import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// --- LÍNEA CORREGIDA ---
// Aquí importamos el archivo CSS para que los estilos se apliquen a toda la aplicación.
// Asegúrate de que tu archivo de estilos se llame 'index.css' y esté en la carpeta 'src'.
import './index.css'; 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);