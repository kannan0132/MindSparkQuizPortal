import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check for user in local storage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error('Failed to parse user data');
            }
        }
    }, [location]); // Re-check on route change (e.g. after login)

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    // Don't show header on login/register/join pages if desired, 
    // but the user asked for it "in top", implying everywhere. 
    // We might want to hide it on strictly auth pages if it looks Cluttered, 
    // but typically a home link is useful.
    // Let's keep it everywhere for now, or maybe hide on /admin if admin has its own layout? 
    // Admin has its own layout. Let's exclude /admin.
    if (location.pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <header className="app-header">
            <Link to="/" className="header-brand">
                Mind<span>Spark</span>
            </Link>

            <div className="header-right">
                {user ? (
                    <div className="header-user">
                        <div className="user-info">
                            <div className="user-avatar">
                                {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <span className="user-name">{user.username}</span>
                        </div>
                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="auth-buttons">
                        <Link to="/login" className="login-link">Login</Link>
                        <Link to="/register" className="register-link">Register</Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
