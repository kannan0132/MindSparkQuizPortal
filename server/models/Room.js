import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  hostSocketId: {
    type: String,
    required: true
  },
  hostNickname: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['waiting', 'starting', 'in-progress', 'finished'],
    default: 'waiting'
  },
  currentQuestionIndex: {
    type: Number,
    default: -1
  },
  questionSet: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  settings: {
    questionTimeLimit: {
      type: Number,
      default: 30
    },
    totalQuestions: {
      type: Number,
      default: 10
    }
  },
  startedAt: Date,
  finishedAt: Date
}, {
  timestamps: true
});

export default mongoose.model('Room', roomSchema);

