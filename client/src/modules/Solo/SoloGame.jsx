import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Solo.css';

function SoloGame() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const category = searchParams.get('category') || 'all';
    const difficulty = searchParams.get('difficulty') || 'medium';

    const [questions, setQuestions] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [isAnswered, setIsAnswered] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch questions
    useEffect(() => {
        async function fetchQuestions() {
            try {
                const response = await axios.get('/api/questions/solo', {
                    params: { category, difficulty, count: 10 }
                });

                if (response.data.length === 0) {
                    setError('No questions found for this selection.');
                    setLoading(false);
                    return;
                }

                setQuestions(response.data);
                setCurrentIdx(0);
                setTimeLeft(response.data[0].timeLimit || 30);
                setLoading(false);
            } catch (err) {
                console.error('Fetch questions error:', err);
                setError('Failed to load mission intelligence.');
                setLoading(false);
            }
        }
        fetchQuestions();
    }, [category, difficulty]);

    // Timer logic
    useEffect(() => {
        if (timeLeft > 0 && !isAnswered && !loading && !showResult) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !isAnswered && !loading && !showResult) {
            handleAnswer('');
        }
    }, [timeLeft, isAnswered, loading, showResult]);

    const handleAnswer = (answer) => {
        if (isAnswered) return;

        setSelectedAnswer(answer);
        setIsAnswered(true);

        const correct = answer === questions[currentIdx].correctAnswer;
        if (correct) {
            setScore(prev => prev + questions[currentIdx].points);
        }

        // Auto-advance after 2 seconds
        setTimeout(() => {
            if (currentIdx + 1 < questions.length) {
                const nextIdx = currentIdx + 1;
                setCurrentIdx(nextIdx);
                setSelectedAnswer('');
                setIsAnswered(false);
                setTimeLeft(questions[nextIdx].timeLimit || 30);
            } else {
                setShowResult(true);
            }
        }, 2000);
    };

    if (loading) {
        return (
            <div className="solo-container">
                <div className="stars"></div>
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Downloading Mission Intelligence...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="solo-container">
                <div className="stars"></div>
                <div className="error-state">
                    <p>⚠️ {error}</p>
                    <button className="back-btn" onClick={() => navigate('/solo')}>Retry Mission</button>
                </div>
            </div>
        );
    }

    if (showResult) {
        return (
            <div className="solo-container">
                <div className="stars"></div>
                <div className="result-card">
                    <h1 className="result-title">Mission Complete</h1>
                    <div className="score-display">
                        <span className="final-score">{score}</span>
                        <span className="score-label">Final Points</span>
                    </div>
                    <div className="result-stats">
                        <p>Accuracy: {Math.round((score / (questions.length * 10)) * 100)}%</p>
                    </div>
                    <div className="solo-actions">
                        <button className="start-mission-btn" onClick={() => window.location.reload()}>RETRY MISSION</button>
                        <button className="back-btn" onClick={() => navigate('/')}>RETURN TO BASE</button>
                    </div>
                </div>
            </div>
        );
    }

    const question = questions[currentIdx];

    return (
        <div className="solo-container">
            <div className="stars"></div>
            <div className="game-wrapper">
                <div className="game-stats">
                    <div className="stat-item">
                        <span className="stat-label">Mission</span>
                        <span className="stat-value">{currentIdx + 1} / {questions.length}</span>
                    </div>
                    <div className="stat-pacer">
                        <div className="timer-bar" style={{ width: `${(timeLeft / (question.timeLimit || 30)) * 100}%` }}></div>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Points</span>
                        <span className="stat-value">{score}</span>
                    </div>
                </div>

                <div className="solo-card">
                    <h2 className="solo-question-text">{question.question}</h2>

                    <div className="options-grid">
                        {question.options.map((option, idx) => {
                            const isSelected = selectedAnswer === option;
                            const isCorrect = isAnswered && option === question.correctAnswer;
                            const isWrong = isAnswered && isSelected && option !== question.correctAnswer;

                            return (
                                <button
                                    key={idx}
                                    className={`solo-option ${isSelected ? 'selected' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
                                    onClick={() => handleAnswer(option)}
                                    disabled={isAnswered}
                                >
                                    <span className="option-index">{String.fromCharCode(65 + idx)}</span>
                                    <span className="option-value">{option}</span>
                                </button>
                            );
                        })}
                    </div>

                    {isAnswered && (
                        <div className={`solo-feedback ${selectedAnswer === question.correctAnswer ? 'success' : 'fail'}`}>
                            {selectedAnswer === question.correctAnswer ? '🎯 Target Hit!' : `⚠️ Objective Failed! Correct answer: ${question.correctAnswer}`}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SoloGame;
