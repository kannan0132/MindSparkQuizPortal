import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Leaderboard.css';

function Leaderboard() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [leaderboard, setLeaderboard] = useState([]);
  const [gameHistory, setGameHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        if (location.state?.leaderboard) {
          setLeaderboard(location.state.leaderboard);
          setGameHistory(location.state.gameHistory || null);
          setLoading(false);
          return;
        }

        const endpoint = roomId ? `/api/leaderboard/${roomId}` : '/api/leaderboard';
        const response = await axios.get(endpoint);

        if (roomId) {
          setLeaderboard(response.data.leaderboard);
          setGameHistory(response.data.gameHistory);
        } else {
          setLeaderboard(response.data);
        }
        setLoading(false);
      } catch (err) {
        console.error('Leaderboard fetch error:', err);
        setError('Failed to load mission results. Either the room does not exist or the data has been cleared.');
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [roomId, location.state]);

  const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getRankEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="leaderboard-container">
      <div className="stars"></div>
      <div className="leaderboard-content">
        <div className="leaderboard-card">
          <h1 className="leaderboard-title">{roomId ? 'Final Results' : 'Galactic Hall of Fame'}</h1>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Receiving Intelligence Feed...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>⚠️ {error}</p>
            </div>
          ) : (
            <>
              {gameHistory && (
                <div className="game-stats">
                  <div className="stat-item">
                    <span className="stat-label">Duration</span>
                    <span className="stat-value">
                      {formatDuration(gameHistory.duration)}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Started</span>
                    <span className="stat-value">
                      {new Date(gameHistory.startedAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              )}

              <div className="leaderboard-list">
                {leaderboard.length === 0 ? (
                  <p className="no-data-msg">No mission records found in the archive.</p>
                ) : (
                  leaderboard.map((player, index) => (
                    <div
                      key={index}
                      className={`leaderboard-item ${index < 3 ? `rank-${index + 1}` : ''}`}
                    >
                      <div className="rank-section">
                        <span className="rank-emoji">{getRankEmoji(player.rank || index + 1)}</span>
                        <span className="rank-number">{player.rank || index + 1}</span>
                      </div>
                      <div className="player-info">
                        <span className="player-name">{player.nickname}</span>
                        {player.roomId && <span className="room-sub">Room: {player.roomId}</span>}
                      </div>
                      <div className="score-section">
                        <span className="score-value">{player.score}</span>
                        <span className="score-label">points</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          <div className="leaderboard-actions">
            <button
              onClick={() => navigate('/')}
              className="home-btn"
            >
              Back to Home
            </button>
            <button
              onClick={() => navigate('/join')}
              className="play-again-btn"
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;

