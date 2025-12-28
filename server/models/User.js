import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 20
  },
  socketId: {
    type: String,
    required: true
  },
  roomId: {
    type: String,
    required: true
  },
  isHost: {
    type: Boolean,
    default: false
  },
  score: {
    type: Number,
    default: 0
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    answer: String,
    isCorrect: Boolean,
    timeTaken: Number,
    points: Number
  }],
  isConnected: {
    type: Boolean,
    default: true
  },
  lastDisconnectedAt: {
    type: Date
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);

