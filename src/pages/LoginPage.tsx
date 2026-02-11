import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authServiceDexie } from '../services/authServiceDexie';

export const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        const user = await authServiceDexie.login(username, password);
        if (!user) {
            setError('Nom d’utilisateur ou mot de passe incorrect');
            return;
        }

        navigate('/'); // Redirige vers dashboard après login
    };

    return (
        <div style={{ maxWidth: 400, margin: '100px auto' }}>
            <h2>Login</h2>
            <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};
