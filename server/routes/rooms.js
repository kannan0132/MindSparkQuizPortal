import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Room from '../models/Room.js';
import User from '../models/User.js';

const router = express.Router();

// Generate room ID
router.post('/generate', (req, res) => {
  const roomId = uuidv4().substring(0, 8).toUpperCase();
  res.json({ roomId });
});

// Get room info
router.get('/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findOne({ roomId }).populate('players', 'nickname score isHost');
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({
      roomId: room.roomId,
      status: room.status,
      hostNickname: room.hostNickname,
      players: room.players,
      currentQuestionIndex: room.currentQuestionIndex,
      settings: room.settings
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Validate room
router.post('/validate', async (req, res) => {
  try {
    const { roomId } = req.body;
    const room = await Room.findOne({ roomId });
    
    res.json({ 
      exists: !!room,
      status: room?.status || null
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

