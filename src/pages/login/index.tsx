import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.scss'; // Import your styles

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        // Hardcoded credentials for simplicity
        const hardcodedUsername = 'admin';
        const hardcodedPassword = 'admin';

        if (username === hardcodedUsername && password === hardcodedPassword) {
            // On successful login, navigate to the home page
            sessionStorage.setItem('auth', 'true')
            window.location.reload()
            navigate('/');
        } else {
            setError('Parol yoki login noto\'g\'ri');
        }
    };

    return (
        <div className={styles.loginPage}>
            <h2>Kirish</h2>
            <div className={styles.loginForm}>
                <label>
                    Login:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                <label>
                    Parol:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                {error && <div className={styles.errorMessage}>{error}</div>}
                <button onClick={handleLogin}>Kirish</button>
            </div>
        </div>
    );
};

export default LoginPage;