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
        const hardcodedPassword = 'rebo';

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
                <button className={styles.button} onClick={handleLogin}>Kirish</button>
                <button className={styles.buttonWorker} onClick={() => navigate('/workers/public')}>Ishchilar ro'yxati</button>
                <button className={styles.buttonPenalties} onClick={() => navigate('/penalties/public')}>Jarimalar ro'yxati</button>
                <button className={styles.buttonTask}>Vazifalar ro'yxati (tez kunda)</button>
            </div>
        </div>
    );
};

export default LoginPage;