import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';

// Pequeño componente para el icono de huella
const PawIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" color="var(--color-primary)">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.84 4.88c.15.38.04.83-.26 1.07-.3.24-.75.14-1.07-.26-.32-.4-.23-.95.14-1.26.37-.31.9-.22 1.19.45zm-5.68 0c.15.38.04.83-.26 1.07-.3.24-.75.14-1.07-.26-.32-.4-.23-.95.14-1.26.37-.31.9-.22 1.19.45zM12 18.5c-2.49 0-4.5-2.01-4.5-4.5s2.01-4.5 4.5-4.5 4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5z" />
    </svg>
);

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log('Botón "Entrar" presionado. La función handleSubmit se ha iniciado.');
        e.preventDefault();
      
        setError(null);
        setLoading(true);

        try {
            const response = await apiClient.post('/auth/login', {
                email,
                password,
            });

            const { access_token } = response.data;

            if (access_token) {
                login(access_token);
                navigate('/profile');
            } else {
                setError('La respuesta del servidor no incluyó un token de acceso.');
            }

        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al iniciar sesión. Revisa tus credenciales.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="form-container">
                <h2 className="form-title">
                    <PawIcon /> Iniciar Sesión
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico:</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña:</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default LoginPage;