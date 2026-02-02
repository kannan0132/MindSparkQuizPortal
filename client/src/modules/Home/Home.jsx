import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="stars"></div>
      <div className="space-animation">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className={`star ${['small', 'medium', 'large'][Math.floor(Math.random() * 3)]}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
        {[...Array(3)].map((_, i) => (
          <div
            key={`planet-${i}`}
            className="space-object planet"
            style={{
              left: `${20 + i * 30}%`,
              top: `${10 + i * 20}%`,
              animationDelay: `${i * 5}s`,
              animationDuration: `${25 + i * 10}s`
            }}
          />
        ))}
        {[...Array(5)].map((_, i) => (
          <div
            key={`asteroid-${i}`}
            className="space-object asteroid"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 3}s`,
              animationDuration: `${12 + Math.random() * 8}s`
            }}
          />
        ))}
        {[...Array(5)].map((_, i) => (
          <div
            key={`shooting-star-${i}`}
            className="shooting-star"
            style={{
              '--x': `${Math.random() * 100}%`,
              '--y': `${Math.random() * 50}%`,
              '--duration': `${2 + Math.random() * 2}s`,
              '--delay': `${Math.random() * 20}s`
            }}
          />
        ))}
      </div>
      <div className="home-content">

        <div className="logo-container">
          <h1 className="main-title">
            <span className="glow">MINDSPARK</span>
            <span className="subtitle">QUIZ PORTAL</span>
          </h1>
        </div>

        <div className="intro-section">
          <p className="intro-text">
            Welcome to the ultimate quiz experience! Test your knowledge,
            compete with friends, and climb the leaderboard in real-time.
          </p>
          <p className="intro-text">
            Join a room or create your own to start the adventure!
          </p>
        </div>

        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Real-Time</h3>
            <p>Live updates and instant feedback</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Competitive</h3>
            <p>Compete with players worldwide</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Challenging</h3>
            <p>Questions that test your knowledge</p>
          </div>
        </div>

        <div className="mode-selection">
          <button
            className="mode-btn solo-btn"
            onClick={() => navigate('/solo')}
          >
            <div className="mode-icon">🧑‍🚀</div>
            <div className="mode-info">
              <span className="mode-title">SOLO PLAY</span>
              <span className="mode-desc">Challenge yourself in single-player mode</span>
            </div>
            <span className="btn-glow"></span>
          </button>

          <button
            className="mode-btn multiplayer-btn"
            onClick={() => navigate('/join')}
          >
            <div className="mode-icon">👥</div>
            <div className="mode-info">
              <span className="mode-title">MULTIPLAYER</span>
              <span className="mode-desc">Compete with friends in real-time</span>
            </div>
            <span className="btn-glow"></span>
          </button>
        </div>

        <div className="navigation">
          <button
            className="nav-btn admin-btn"
            onClick={() => navigate('/admin')}
          >
            Admin Panel
          </button>
          <button
            className="nav-btn leaderboard-btn"
            onClick={() => navigate('/leaderboard')}
          >
            Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;

