import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import './Lobby.css';

function Lobby() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [players, setPlayers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [error, setError] = useState('');
  const [gameStarting, setGameStarting] = useState(false);

  useEffect(() => {
    const nickname = sessionStorage.getItem('nickname');
    const storedRoomId = sessionStorage.getItem('roomId');
    const storedIsHost = sessionStorage.getItem('isHost') === 'true';

    if (!nickname || !storedRoomId) {
      navigate('/join');
      return;
    }

    // Connect to socket - use environment variable URL for production
    const socketUrl = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:3000`;
    const newSocket = io(socketUrl);
    setSocket(newSocket);
    setIsHost(storedIsHost);

    // Join room
    newSocket.emit('join-room', {
      nickname,
      roomId: storedRoomId,
      isHost: storedIsHost
    });

    // Listen for room joined
    newSocket.on('joined-room', (data) => {
      setPlayers(data.players || []);
      setIsHost(data.isHost);
    });

    // Listen for player joined
    newSocket.on('player-joined', (data) => {
      setPlayers(data.players || []);
    });

    // Listen for player left
    newSocket.on('player-left', (data) => {
      setPlayers(prev => prev.filter(p => p.nickname !== data.nickname));
    });

    // Listen for player status changes (for reconnection support)
    newSocket.on('player-status-changed', (data) => {
      setPlayers(prev => prev.map(p =>
        p.nickname === data.nickname ? { ...p, isConnected: data.isConnected } : p
      ));
    });

    // Listen for host left
    newSocket.on('host-left', () => {
      setError('Host has left the room. Redirecting...');
      setTimeout(() => navigate('/'), 3000);
    });

    // Listen for game starting
    newSocket.on('game-starting', () => {
      setGameStarting(true);
      setTimeout(() => {
        navigate(`/game/${storedRoomId}`);
      }, 2000);
    });

    // Listen for errors
    newSocket.on('error', (data) => {
      setError(data.message);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId, navigate]);

  const handleStartGame = () => {
    if (!socket || !isHost) return;

    if (players.length < 1) {
      setError('Need at least 1 player to start');
      return;
    }

    socket.emit('start-game', { roomId });
  };

  return (
    <div className="lobby-container">
      <div className="stars"></div>
      <div className="lobby-content">
        <div className="lobby-card">
          <div className="lobby-header">
            <h1 className="lobby-title">Room: {roomId}</h1>
            {isHost && <span className="host-badge">👑 Host</span>}
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {gameStarting && (
            <div className="starting-message">
              <div className="spinner"></div>
              <p>Game starting...</p>
            </div>
          )}

          <div className="players-section">
            <h2 className="players-title">
              Players ({players.length})
            </h2>
            <div className="players-list">
              {players.map((player, index) => (
                <div key={index} className={`player-card ${player.isHost ? 'host' : ''} ${player.isConnected === false ? 'offline' : ''}`}>
                  <div className="player-main">
                    <span className="player-name">{player.nickname}</span>
                    {player.isHost && <span className="host-icon">👑</span>}
                    {player.isConnected === false && <span className="status-tag">OFFLINE</span>}
                  </div>
                  <span className="player-score">Score: {player.score}</span>
                </div>
              ))}
            </div>
          </div>

          {isHost && (
            <button
              onClick={handleStartGame}
              disabled={gameStarting || players.length < 1}
              className="start-game-btn"
            >
              {gameStarting ? 'Starting...' : 'Start Game'}
            </button>
          )}

          {!isHost && (
            <div className="waiting-message">
              <div className="spinner"></div>
              <p>Waiting for host to start the game...</p>
            </div>
          )}

          <button
            onClick={() => navigate('/')}
            className="leave-btn"
          >
            Leave Room
          </button>
        </div>
      </div>
    </div>
  );
}

export default Lobby;

