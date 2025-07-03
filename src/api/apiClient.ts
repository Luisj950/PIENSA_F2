import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000', // La URL de tu backend NestJS
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token JWT a todas las peticiones necesarias
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// --- LÍNEA AÑADIDA ---
// Esta línea hace que 'apiClient' sea la exportación por defecto del archivo.
export default apiClient;