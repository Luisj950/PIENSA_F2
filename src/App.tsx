// src/App.tsx

import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';

// --- Páginas ---
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import MisMascotasPage from './pages/MisMascotasPage';
import AddPetPage from './pages/AddPetPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import EditarMascotaPage from './pages/EditarMascotaPage';
import ChatPage from './pages/ChatPage';
import ContactosPage from './pages/ContactosPage'; // 👈 1. Se añade la importación

function App() {
  // Se quita <BrowserRouter> de aquí porque ahora está en main.tsx
  return (
    <AuthProvider>
      <Navbar />
      <main style={{ padding: '1rem' }}>
        <Routes>
          {/* --- Rutas Públicas --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          {/* --- RUTAS PROTEGIDAS --- */}
          <Route element={<ProtectedRoute roles={['propietario', 'admin', 'veterinario']} />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/mis-mascotas" element={<MisMascotasPage />} />
            <Route path="/añadir-mascota" element={<AddPetPage />} />
            <Route path="/mascotas/editar/:id" element={<EditarMascotaPage />} />
            <Route path="/chat/:receptorId" element={<ChatPage />} />
            
            {/* 👇 2. Se añade la ruta para la nueva página de contactos */}
            <Route path="/contactos" element={<ContactosPage />} />
          </Route>

          {/* Ruta SOLO para administradores */}
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
          </Route>
          
          <Route path="*" element={<h2>Página no encontrada (404)</h2>} />
        </Routes>
      </main>
    </AuthProvider>
  );
}

export default App;