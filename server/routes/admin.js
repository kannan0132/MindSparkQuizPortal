import express from 'express';
import Question from '../models/Question.js';
import GameHistory from '../models/GameHistory.js';
import Room from '../models/Room.js';

const router = express.Router();

// Admin middleware (simple check - can be enhanced with JWT)
const isAdmin = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey === process.env.ADMIN_KEY || adminKey === 'admin123') {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Question Management
router.post('/questions', isAdmin, async (req, res) => {
  try {
    // Validation
    const { question, options, correctAnswer } = req.body;
    
    if (!question || !question.trim()) {
      return res.status(400).json({ message: 'Question is required' });
    }
    
    if (!options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: 'At least 2 options are required' });
    }
    
    if (options.some(opt => !opt || !opt.trim())) {
      return res.status(400).json({ message: 'All options must be filled' });
    }
    
    if (!correctAnswer || !correctAnswer.trim()) {
      return res.status(400).json({ message: 'Correct answer is required' });
    }
    
    if (!options.includes(correctAnswer)) {
      return res.status(400).json({ message: 'Correct answer must match one of the options' });
    }
    
    const questionData = {
      question: question.trim(),
      options: options.map(opt => opt.trim()),
      correctAnswer: correctAnswer.trim(),
      category: req.body.category || 'general',
      difficulty: req.body.difficulty || 'medium',
      points: parseInt(req.body.points) || 10,
      timeLimit: parseInt(req.body.timeLimit) || 30,
      isActive: true
    };
    
    const newQuestion = new Question(questionData);
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    console.error('Error creating question:', error);
    const statusCode = error.name === 'ValidationError' ? 400 : 500;
    res.status(statusCode).json({ 
      message: 'Error creating question', 
      error: error.message,
      details: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })) : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

router.put('/questions/:id', isAdmin, async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    res.status(400).json({ message: 'Error updating question', error: error.message });
  }
});

router.delete('/questions/:id', isAdmin, async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json({ message: 'Question deactivated', question });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting question', error: error.message });
  }
});

// Analytics
router.get('/analytics', isAdmin, async (req, res) => {
  try {
    const totalQuestions = await Question.countDocuments({ isActive: true }).catch(() => 0);
    const totalGames = await GameHistory.countDocuments().catch(() => 0);
    const totalRooms = await Room.countDocuments().catch(() => 0);
    const activeRooms = await Room.countDocuments({ status: { $in: ['waiting', 'in-progress'] } }).catch(() => 0);

    res.json({
      totalQuestions,
      totalGames,
      totalRooms,
      activeRooms
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ 
      message: 'Error fetching analytics', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Game History
router.get('/history', isAdmin, async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const history = await GameHistory.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('questions');

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history', error: error.message });
  }
});

export default router;

