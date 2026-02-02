import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { setupSocketHandlers } from './modules/realtime/socketHandlers.js';
import { connectDB } from './db.js';
import Question from './models/Question.js';
import { questions } from './seedData.js';
import roomRoutes from './routes/rooms.js';
import questionRoutes from './routes/questions.js';
import adminRoutes from './routes/admin.js';
import leaderboardRoutes from './routes/leaderboard.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();

const seedDatabase = async () => {
  try {
    const existingQuestions = await Question.find({}, 'question');
    const existingQuestionTexts = new Set(existingQuestions.map(q => q.question));

    const newQuestions = questions.filter(q => !existingQuestionTexts.has(q.question));

    if (newQuestions.length > 0) {
      console.log(`🌱 Found ${newQuestions.length} new questions to seed...`);
      await Question.insertMany(newQuestions);
      console.log(`✅ Successfully added ${newQuestions.length} new questions.`);
    } else {
      console.log('ℹ️ Database is up to date. No new questions to seed.');
    }
  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
};
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      process.env.CLIENT_URL || "http://localhost:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174"
    ],
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: [
    process.env.CLIENT_URL || "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Database connection
connectDB(process.env.MONGODB_URI || 'mongodb://localhost:27017/mindspark-quiz', seedDatabase);

// Routes
app.use('/api/rooms', roomRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState;
    const dbStates = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    let databaseName = 'mindspark-quiz';
    try {
      if (mongoose.connection.db) {
        databaseName = mongoose.connection.db.databaseName || 'mindspark-quiz';
      }
    } catch (e) {
      // Ignore if database name not available
    }

    res.json({
      status: 'ok',
      message: 'Mindspark Quiz Portal API is running',
      database: {
        status: dbStates[dbStatus] || 'unknown',
        connected: dbStatus === 1,
        database: databaseName
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error checking health',
      error: error.message
    });
  }
});

// Socket.io setup
setupSocketHandlers(io);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

