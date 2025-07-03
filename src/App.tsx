// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';

// --- Importa TODAS tus páginas ---
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import MisMascotasPage from './pages/MisMascotasPage';
import AddPetPage from './pages/AddPetPage';
import UnauthorizedPage from './pages/UnauthorizedPage'; // <-- IMPORTA LA NUEVA PÁGINA
import AdminDashboardPage from './pages/AdminDashboardPage'; // <-- PÁGINA DE EJEMPLO PARA ADMIN

function App() {
  return (
    // NOTA: He corregido el orden. BrowserRouter debe estar dentro de AuthProvider
    // para que las rutas puedan acceder al contexto de autenticación.
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <main style={{ padding: '1rem' }}>
          <Routes>
            {/* --- Rutas Públicas --- */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            
            {/* --- RUTAS PROTEGIDAS POR ROLES --- */}

            {/* Rutas para CUALQUIER usuario logueado (propietario, admin, etc.) */}
            <Route element={<ProtectedRoute roles={['propietario', 'admin', 'veterinario']} />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/mis-mascotas" element={<MisMascotasPage />} />
              <Route path="/añadir-mascota" element={<AddPetPage />} />
            </Route>

            {/* Ruta SOLO para administradores */}
            <Route element={<ProtectedRoute roles={['admin']} />}>
              <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
            </Route>

            {/* Ruta SOLO para veterinarios y administradores */}
            <Route element={<ProtectedRoute roles={['veterinario', 'admin']} />}>
              {/* <Route path="/gestion-citas" element={<GestionCitasPage />} /> */}
            </Route>
            
            <Route path="*" element={<h2>Página no encontrada (404)</h2>} />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;