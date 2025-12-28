import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Join.css';

function Join() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const generateRoomId = async () => {
    try {
      setLoading(true);
      setError('');
      // Use relative URL to leverage Vite proxy
      const response = await axios.post('/api/rooms/generate');
      setRoomId(response.data.roomId);
      setIsCreating(true);
    } catch (err) {
      console.error('Generate room ID error:', err);
      if (err.response) {
        setError(`Server error: ${err.response.data?.message || 'Failed to generate room ID'}`);
      } else if (err.request) {
        setError('Cannot connect to server. Make sure the server is running on port 3000.');
      } else {
        setError('Failed to generate room ID. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const validateRoom = async () => {
    if (!roomId.trim()) {
      setError('Please enter a room ID');
      return false;
    }

    try {
      const response = await axios.post('/api/rooms/validate', {
        roomId: roomId.trim().toUpperCase()
      });

      if (!response.data.exists && !isCreating) {
        setError('Room does not exist');
        return false;
      }

      return true;
    } catch (err) {
      console.error('Validate room error:', err);
      if (err.response) {
        setError(`Server error: ${err.response.data?.message || 'Failed to validate room'}`);
      } else if (err.request) {
        setError('Cannot connect to server. Make sure the server is running on port 3000.');
      } else {
        setError('Failed to validate room. Please try again.');
      }
      return false;
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!nickname.trim()) {
      setError('Please enter a nickname');
      return;
    }

    if (nickname.trim().length < 1 || nickname.trim().length > 20) {
      setError('Nickname must be between 1 and 20 characters');
      return;
    }

    if (!roomId.trim()) {
      setError('Please enter or generate a room ID');
      return;
    }

    const isValid = await validateRoom();
    if (!isValid) return;

    // Store in sessionStorage
    sessionStorage.setItem('nickname', nickname.trim());
    sessionStorage.setItem('roomId', roomId.trim().toUpperCase());
    sessionStorage.setItem('isHost', isCreating.toString());

    // Navigate to lobby
    navigate(`/lobby/${roomId.trim().toUpperCase()}`);
  };

  const handleGuestLogin = () => {
    const randomId = Math.floor(Math.random() * 9000) + 1000;
    const guestName = `Pilot_${randomId}`;
    setNickname(guestName);
    setError('');
  };

  return (
    <div className="join-container">
      <div className="stars"></div>
      <div className="join-content">
        <div className="join-card">
          <h1 className="join-title">Join Quiz Room</h1>

          <form onSubmit={handleJoin} className="join-form">
            <div className="form-group">
              <label htmlFor="nickname">Nickname</label>
              <div className="nickname-input-group">
                <input
                  id="nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Enter your nickname"
                  maxLength={20}
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleGuestLogin}
                  className="guest-btn"
                  title="Generate guest name"
                >
                  🎭
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="roomId">Room ID</label>
              <div className="room-id-input">
                <input
                  id="roomId"
                  type="text"
                  value={roomId}
                  onChange={(e) => {
                    setRoomId(e.target.value.toUpperCase());
                    setIsCreating(false);
                    setError('');
                  }}
                  placeholder="Enter room ID"
                  maxLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={generateRoomId}
                  className="generate-btn"
                  disabled={loading}
                >
                  {loading ? '...' : 'Generate'}
                </button>
              </div>
              {isCreating && (
                <p className="create-hint">✨ Creating new room...</p>
              )}
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button type="submit" className="join-btn">
              {isCreating ? 'Create & Join' : 'Join Room'}
            </button>
          </form>

          <button
            onClick={() => navigate('/')}
            className="back-btn"
          >
            ← Back to Home
          </button>
        </div>
      </div >
    </div >
  );
}

export default Join;

