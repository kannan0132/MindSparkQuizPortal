import express from 'express';
import GameHistory from '../models/GameHistory.js';

const router = express.Router();

// Get global leaderboard (Top 10 scores from all games)
router.get('/', async (req, res) => {
    try {
        const history = await GameHistory.find()
            .sort({ finishedAt: -1 })
            .limit(50)
            .lean();

        // Flatten all players from all games and sort by score
        const allPlayers = history.reduce((acc, game) => {
            return acc.concat(game.players.map(p => ({
                ...p,
                roomId: game.roomId,
                date: game.finishedAt
            })));
        }, []);

        const topPlayers = allPlayers
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
            .map((p, index) => ({
                ...p,
                rank: index + 1
            }));

        res.json(topPlayers);
    } catch (error) {
        console.error('Error fetching global leaderboard:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get leaderboard for a specific room
router.get('/:roomId', async (req, res) => {
    try {
        const { roomId } = req.params;
        const game = await GameHistory.findOne({ roomId })
            .sort({ finishedAt: -1 })
            .lean();

        if (!game) {
            return res.status(404).json({ message: 'Leaderboard for this room not found' });
        }

        res.json({
            leaderboard: game.players,
            gameHistory: {
                startedAt: game.startedAt,
                finishedAt: game.finishedAt,
                duration: game.duration
            }
        });
    } catch (error) {
        console.error('Error fetching room leaderboard:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
