import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Feedback.css';

const Feedback = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        rating: 5
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the data to a backend
        console.log('Feedback submitted:', formData);
        setSubmitted(true);
        setTimeout(() => {
            navigate('/');
        }, 3000);
    };

    return (
        <div className="feedback-container">
            <div className="stars"></div>

            <div className="feedback-content">
                <button className="back-btn" onClick={() => navigate('/')}>
                    ← Back to Home
                </button>

                <div className="feedback-card">
                    <h1 className="feedback-title">
                        <span className="glow">Feedback</span>
                    </h1>
                    <p className="feedback-subtitle">Help us improve your experience</p>

                    {submitted ? (
                        <div className="success-message">
                            <div className="success-icon">✨</div>
                            <h2>Thank you!</h2>
                            <p>Your feedback has been received.</p>
                            <p className="redirect-text">Redirecting to home...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="feedback-form">
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your Name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Rating</label>
                                <div className="rating-select">
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <button
                                            key={num}
                                            type="button"
                                            className={`rating-btn ${formData.rating === num ? 'active' : ''}`}
                                            onClick={() => setFormData(prev => ({ ...prev, rating: num }))}
                                        >
                                            {num} ⭐
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell us what you think..."
                                    rows="5"
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className="submit-btn">
                                Send Feedback 🚀
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Feedback;
