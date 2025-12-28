import express from 'express';
import Question from '../models/Question.js';

const router = express.Router();

// Get solo quiz questions
router.get('/solo', async (req, res) => {
  try {
    const { category, difficulty, count = 10 } = req.query;
    const match = { isActive: true };

    if (category && category !== 'all') match.category = category;
    if (difficulty && difficulty !== 'all') match.difficulty = difficulty;

    const questions = await Question.aggregate([
      { $match: match },
      { $sample: { size: parseInt(count) } }
    ]);

    res.json(questions);
  } catch (error) {
    console.error('Solo questions error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get random questions
router.get('/random', async (req, res) => {
  try {
    const { count = 10 } = req.query;
    const questions = await Question.aggregate([
      { $match: { isActive: true } },
      { $sample: { size: parseInt(count) } }
    ]);

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all questions
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, limit } = req.query;
    const query = { isActive: true };

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const questions = await Question.find(query)
      .limit(parseInt(limit) || 100)
      .sort({ createdAt: -1 })
      .lean();

    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get question by ID
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
