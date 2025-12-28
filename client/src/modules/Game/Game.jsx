import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import './Game.css';

function Game() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [answerResult, setAnswerResult] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const nickname = sessionStorage.getItem('nickname');
    const storedRoomId = sessionStorage.getItem('roomId');
    const storedIsHost = sessionStorage.getItem('isHost') === 'true';

    if (!nickname || !storedRoomId) {
      navigate('/join');
      return;
    }

    // Connect to socket
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    // Rejoin room
    newSocket.emit('join-room', {
      nickname,
      roomId: storedRoomId,
      isHost: storedIsHost
    });

    // Listen for new question
    newSocket.on('new-question', (data) => {
      setCurrentQuestion(data.question);
      setQuestionNumber(data.questionNumber);
      setTotalQuestions(data.totalQuestions);
      setTimeLeft(data.question.timeLimit);
      setSelectedAnswer('');
      setIsAnswered(false);
      setAnswerResult(null);
      setShowAnswer(false);
    });

    // Listen for answer submission result
    newSocket.on('answer-submitted', (data) => {
      setAnswerResult(data);
      setIsAnswered(true);
    });

    // Listen for show answer
    newSocket.on('show-answer', (data) => {
      setShowAnswer(true);
      setLeaderboard(data.leaderboard);
    });

    // Listen for game ended
    newSocket.on('game-ended', (data) => {
      setTimeout(() => {
        navigate(`/leaderboard/${storedRoomId}`, { state: data });
      }, 3000);
    });

    // Listen for errors
    newSocket.on('error', (data) => {
      setError(data.message);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !isAnswered && currentQuestion) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered && currentQuestion) {
      // Auto-submit empty answer when time runs out
      handleSubmitAnswer('');
    }
  }, [timeLeft, isAnswered, currentQuestion]);

  const handleSelectAnswer = (answer) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = (answer = selectedAnswer) => {
    if (isAnswered || !socket || !currentQuestion) return;

    const timeTaken = currentQuestion.timeLimit - timeLeft;
    socket.emit('submit-answer', {
      roomId,
      questionId: currentQuestion.id,
      answer,
      timeTaken
    });
  };

  if (!currentQuestion) {
    return (
      <div className="game-container">
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Loading question...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="question-info">
          <span className="question-number">
            Question {questionNumber} of {totalQuestions}
          </span>
          <div className="timer">
            <div className="timer-circle">
              <span className="timer-text">{timeLeft}</span>
            </div>
          </div>
        </div>
        <div className="points-info">
          {currentQuestion.points} points
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="question-card">
        <h2 className="question-text">{currentQuestion.question}</h2>

        <div className="options-grid">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = showAnswer && option === currentQuestion.correctAnswer;
            const isWrong = showAnswer && isSelected && option !== currentQuestion.correctAnswer;
            
            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(option)}
                disabled={isAnswered}
                className={`option-btn ${isSelected ? 'selected' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="option-text">{option}</span>
                {isCorrect && <span className="check-mark">✓</span>}
                {isWrong && <span className="cross-mark">✗</span>}
              </button>
            );
          })}
        </div>

        {!isAnswered && (
          <button
            onClick={() => handleSubmitAnswer()}
            disabled={!selectedAnswer}
            className="submit-btn"
          >
            Submit Answer
          </button>
        )}

        {isAnswered && answerResult && (
          <div className={`answer-feedback ${answerResult.isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="feedback-icon">
              {answerResult.isCorrect ? '✓' : '✗'}
            </div>
            <div className="feedback-text">
              <p>{answerResult.isCorrect ? 'Correct!' : 'Incorrect'}</p>
              <p className="points-earned">
                {answerResult.isCorrect ? `+${answerResult.points} points` : '0 points'}
              </p>
              {!answerResult.isCorrect && (
                <p className="correct-answer">
                  Correct answer: {answerResult.correctAnswer}
                </p>
              )}
            </div>
          </div>
        )}

        {showAnswer && (
          <div className="leaderboard-preview">
            <h3>Current Leaderboard</h3>
            <div className="leaderboard-list">
              {leaderboard.slice(0, 5).map((player, index) => (
                <div key={index} className="leaderboard-item">
                  <span className="rank">#{player.rank}</span>
                  <span className="name">{player.nickname}</span>
                  <span className="score">{player.score} pts</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Game;

