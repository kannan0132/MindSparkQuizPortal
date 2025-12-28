import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Solo.css';

const CATEGORIES = [
    { id: 'all', name: 'All Categories', icon: '🌌' },
    { id: 'science', name: 'Science', icon: '🧪' },
    { id: 'geography', name: 'Geography', icon: '🌍' },
    { id: 'history', name: 'History', icon: '📜' },
    { id: 'general', name: 'General Knowledge', icon: '🧠' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
    { id: 'astronomy', name: 'Astronomy', icon: '🔭' },
    { id: 'sports', name: 'Sports', icon: '⚽' }
];

const DIFFICULTIES = [
    { id: 'easy', name: 'Easy', color: '#4ade80' },
    { id: 'medium', name: 'Medium', color: '#facc15' },
    { id: 'hard', name: 'Hard', color: '#f87171' }
];

function SoloSelection() {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState('medium');

    const startSoloGame = () => {
        navigate(`/solo/play?category=${selectedCategory}&difficulty=${selectedDifficulty}`);
    };

    return (
        <div className="solo-container">
            <div className="stars"></div>
            <div className="solo-content">
                <div className="solo-card">
                    <h1 className="solo-title">Solo Mission</h1>

                    <div className="selection-section">
                        <h2 className="section-label">Select Category</h2>
                        <div className="category-grid">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    className={`category-item ${selectedCategory === cat.id ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(cat.id)}
                                >
                                    <span className="cat-icon">{cat.icon}</span>
                                    <span className="cat-name">{cat.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="selection-section">
                        <h2 className="section-label">Select Difficulty</h2>
                        <div className="difficulty-row">
                            {DIFFICULTIES.map(diff => (
                                <button
                                    key={diff.id}
                                    className={`difficulty-item ${selectedDifficulty === diff.id ? 'active' : ''}`}
                                    style={{ '--diff-color': diff.color }}
                                    onClick={() => setSelectedDifficulty(diff.id)}
                                >
                                    {diff.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="solo-actions">
                        <button
                            className="start-mission-btn"
                            onClick={startSoloGame}
                        >
                            🚀 INITIATE MISSION
                        </button>
                        <button
                            className="back-btn"
                            onClick={() => navigate('/')}
                        >
                            ← System Exit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SoloSelection;
