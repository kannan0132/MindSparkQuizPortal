import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Join.css';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="join-container">
            <div className="stars"></div>
            <div className="join-content">
                <h1 className="join-title">Register</h1>
                <form onSubmit={handleSubmit} className="join-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="input-group">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="join-input"
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email (Optional)"
                            value={formData.email}
                            onChange={handleChange}
                            className="join-input"
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="join-input"
                            minLength={6}
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="join-input"
                        />
                    </div>

                    <button
                        type="submit"
                        className="join-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating...' : 'REGISTER'}
                    </button>

                    <div style={{ textAlign: 'center', color: '#888', marginTop: '10px' }}>
                        Already have an account? <span
                            onClick={() => navigate('/login')}
                            className="auth-link"
                        >
                            Login
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
