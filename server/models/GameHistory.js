import mongoose from 'mongoose';

const gameHistorySchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true
  },
  players: [{
    nickname: String,
    score: Number,
    rank: Number
  }],
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  startedAt: Date,
  finishedAt: Date,
  duration: Number
}, {
  timestamps: true
});

export default mongoose.model('GameHistory', gameHistorySchema);

