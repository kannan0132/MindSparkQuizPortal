import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './modules/Home/Home';
import Join from './modules/Auth/Join';
import Lobby from './modules/Lobby/Lobby';
import Game from './modules/Game/Game';
import Leaderboard from './modules/Leaderboard/Leaderboard';
import Admin from './modules/Admin/Admin';
import SoloSelection from './modules/Solo/SoloSelection';
import SoloGame from './modules/Solo/SoloGame';
import ErrorBoundary from './modules/ErrorHandling/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/join" element={<Join />} />
          <Route path="/lobby/:roomId" element={<Lobby />} />
          <Route path="/game/:roomId" element={<Game />} />
          <Route path="/leaderboard/:roomId" element={<Leaderboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/solo" element={<SoloSelection />} />
          <Route path="/solo/play" element={<SoloGame />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;

