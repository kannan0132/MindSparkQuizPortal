import { v4 as uuidv4 } from 'uuid';
import User from '../../models/User.js';
import Room from '../../models/Room.js';
import Question from '../../models/Question.js';
import GameHistory from '../../models/GameHistory.js';

// Store active rooms in memory for quick access
const activeRooms = new Map();

export function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    // Join Room
    socket.on('join-room', async (data) => {
      try {
        const { nickname, roomId, isHost } = data;

        // Validation
        if (!nickname || !roomId) {
          socket.emit('error', { message: 'Nickname and Room ID are required' });
          return;
        }

        if (nickname.length < 1 || nickname.length > 20) {
          socket.emit('error', { message: 'Nickname must be between 1 and 20 characters' });
          return;
        }

        // Join socket room
        socket.join(roomId);

        // Create or update user
        let user = await User.findOne({ roomId, nickname });

        if (user) {
          // Check if this user is already connected to another socket
          if (user.isConnected && user.socketId !== socket.id) {
            socket.emit('error', { message: 'Nickname already taken and currently active' });
            return;
          }
          // Reconnect existing user
          user.socketId = socket.id;
          user.isConnected = true;
          user.lastDisconnectedAt = null;
          await user.save();

          // Notify others of reconnection
          socket.to(roomId).emit('player-status-changed', {
            nickname: user.nickname,
            isConnected: true
          });
        } else {
          // Create new user
          user = new User({
            nickname,
            socketId: socket.id,
            roomId,
            isHost: isHost || false
          });
          await user.save();
        }

        // Handle room creation/joining
        let room = await Room.findOne({ roomId });
        if (!room) {
          if (!isHost) {
            socket.emit('error', { message: 'Room does not exist' });
            return;
          }
          // Create new room
          room = new Room({
            roomId,
            hostSocketId: socket.id,
            hostNickname: nickname,
            status: 'waiting'
          });
          await room.save();
        }

        // Add user to room if not already added
        if (!room.players.includes(user._id)) {
          room.players.push(user._id);
          await room.save();
        }

        // Load random questions if room is new
        if (room.questionSet.length === 0) {
          const questions = await Question.find({ isActive: true })
            .limit(room.settings.totalQuestions)
            .sort({ _id: -1 });
          room.questionSet = questions.map(q => q._id);
          await room.save();
        }

        // Store room in memory
        activeRooms.set(roomId, {
          roomId,
          status: room.status,
          currentQuestionIndex: room.currentQuestionIndex,
          questionTimeLimit: room.settings.questionTimeLimit
        });

        // Get all players in room
        const players = await User.find({ roomId }).select('nickname isHost score socketId');

        socket.emit('joined-room', {
          roomId,
          isHost: user.isHost,
          players: players.map(p => ({
            nickname: p.nickname,
            isHost: p.isHost,
            score: p.score
          }))
        });

        // Notify other players
        socket.to(roomId).emit('player-joined', {
          nickname: user.nickname,
          isHost: user.isHost,
          players: players.map(p => ({
            nickname: p.nickname,
            isHost: p.isHost,
            score: p.score
          }))
        });

      } catch (error) {
        console.error('Join room error:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Start Game
    socket.on('start-game', async (data) => {
      try {
        const { roomId } = data;
        const user = await User.findOne({ socketId: socket.id });

        if (!user || !user.isHost) {
          socket.emit('error', { message: 'Only host can start the game' });
          return;
        }

        const room = await Room.findOne({ roomId });
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        if (room.status !== 'waiting') {
          socket.emit('error', { message: 'Game already started' });
          return;
        }

        room.status = 'starting';
        room.startedAt = new Date();
        await room.save();

        activeRooms.set(roomId, {
          ...activeRooms.get(roomId),
          status: 'starting'
        });

        // Broadcast game starting
        io.to(roomId).emit('game-starting', { roomId });

        // Start first question after 3 seconds
        setTimeout(async () => {
          await startNextQuestion(io, roomId);
        }, 3000);

      } catch (error) {
        console.error('Start game error:', error);
        socket.emit('error', { message: 'Failed to start game' });
      }
    });

    // Submit Answer
    socket.on('submit-answer', async (data) => {
      try {
        const { roomId, questionId, answer, timeTaken } = data;
        const user = await User.findOne({ socketId: socket.id });

        if (!user) {
          socket.emit('error', { message: 'User not found' });
          return;
        }

        const room = await Room.findOne({ roomId });
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        const question = await Question.findById(questionId);
        if (!question) {
          socket.emit('error', { message: 'Question not found' });
          return;
        }

        const isCorrect = answer === question.correctAnswer;
        const points = isCorrect ? question.points : 0;

        // Update user answer
        const existingAnswerIndex = user.answers.findIndex(
          a => a.questionId.toString() === questionId
        );

        if (existingAnswerIndex >= 0) {
          user.answers[existingAnswerIndex] = {
            questionId,
            answer,
            isCorrect,
            timeTaken,
            points
          };
        } else {
          user.answers.push({
            questionId,
            answer,
            isCorrect,
            timeTaken,
            points
          });
        }

        user.score += points;
        await user.save();

        // Notify user
        socket.emit('answer-submitted', {
          isCorrect,
          points,
          correctAnswer: question.correctAnswer
        });

        // Update room with player answer count
        const players = await User.find({ roomId });
        const answeredCount = players.filter(p =>
          p.answers.some(a => a.questionId.toString() === questionId)
        ).length;

        io.to(roomId).emit('answer-update', {
          answeredCount,
          totalPlayers: players.length
        });

      } catch (error) {
        console.error('Submit answer error:', error);
        socket.emit('error', { message: 'Failed to submit answer' });
      }
    });

    // Disconnect
    socket.on('disconnect', async () => {
      try {
        const user = await User.findOne({ socketId: socket.id });
        if (user) {
          // Mark user as disconnected
          user.isConnected = false;
          user.lastDisconnectedAt = new Date();
          await user.save();

          // Notify other players
          socket.to(user.roomId).emit('player-status-changed', {
            nickname: user.nickname,
            isConnected: false
          });

          console.log(`📡 User ${user.nickname} marked as offline`);
        }

        console.log(`❌ Client disconnected: ${socket.id}`);
      } catch (error) {
        console.error('Disconnect error:', error);
      }
    });
  });

  // Background cleanup: Remove users disconnected for more than 5 minutes
  setInterval(async () => {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const disconnectedUsers = await User.find({
        isConnected: false,
        lastDisconnectedAt: { $lt: fiveMinutesAgo }
      });

      for (const user of disconnectedUsers) {
        console.log(`🧹 Cleaning up inactive user: ${user.nickname}`);
        const room = await Room.findOne({ roomId: user.roomId });
        if (room) {
          room.players = room.players.filter(p => p.toString() !== user._id.toString());
          await room.save();

          if (user.isHost) {
            io.to(user.roomId).emit('host-left', { message: 'Host session expired' });
          }
        }
        await User.deleteOne({ _id: user._id });
      }
    } catch (err) {
      console.error('Cleanup task error:', err);
    }
  }, 60000); // Run every minute
}

async function startNextQuestion(io, roomId) {
  try {
    const room = await Room.findOne({ roomId }).populate('questionSet');

    if (!room || room.questionSet.length === 0) {
      await endGame(io, roomId);
      return;
    }

    room.currentQuestionIndex++;

    if (room.currentQuestionIndex >= room.questionSet.length) {
      await endGame(io, roomId);
      return;
    }

    room.status = 'in-progress';
    await room.save();

    const question = room.questionSet[room.currentQuestionIndex];
    const questionData = await Question.findById(question);

    activeRooms.set(roomId, {
      ...activeRooms.get(roomId),
      status: 'in-progress',
      currentQuestionIndex: room.currentQuestionIndex
    });

    // Broadcast question
    io.to(roomId).emit('new-question', {
      question: {
        id: questionData._id,
        question: questionData.question,
        options: questionData.options,
        timeLimit: questionData.timeLimit || room.settings.questionTimeLimit,
        points: questionData.points
      },
      questionNumber: room.currentQuestionIndex + 1,
      totalQuestions: room.questionSet.length
    });

    // Auto-advance to next question after time limit
    const timeLimit = questionData.timeLimit || room.settings.questionTimeLimit;
    setTimeout(async () => {
      await showAnswer(io, roomId, questionData);

      // Wait 5 seconds before next question
      setTimeout(async () => {
        await startNextQuestion(io, roomId);
      }, 5000);
    }, (timeLimit + 1) * 1000);

  } catch (error) {
    console.error('Start next question error:', error);
  }
}

async function showAnswer(io, roomId, question) {
  try {
    const players = await User.find({ roomId });
    const leaderboard = players
      .map(p => ({
        nickname: p.nickname,
        score: p.score
      }))
      .sort((a, b) => b.score - a.score)
      .map((p, index) => ({
        ...p,
        rank: index + 1
      }));

    io.to(roomId).emit('show-answer', {
      correctAnswer: question.correctAnswer,
      leaderboard
    });
  } catch (error) {
    console.error('Show answer error:', error);
  }
}

async function endGame(io, roomId) {
  try {
    const room = await Room.findOne({ roomId });
    const players = await User.find({ roomId });

    room.status = 'finished';
    room.finishedAt = new Date();
    await room.save();

    const leaderboard = players
      .map(p => ({
        nickname: p.nickname,
        score: p.score
      }))
      .sort((a, b) => b.score - a.score)
      .map((p, index) => ({
        ...p,
        rank: index + 1
      }));

    // Save game history
    const gameHistory = new GameHistory({
      roomId,
      players: leaderboard,
      questions: room.questionSet,
      startedAt: room.startedAt,
      finishedAt: room.finishedAt,
      duration: room.finishedAt - room.startedAt
    });
    await gameHistory.save();

    io.to(roomId).emit('game-ended', {
      leaderboard,
      gameHistory: {
        startedAt: room.startedAt,
        finishedAt: room.finishedAt,
        duration: room.finishedAt - room.startedAt
      }
    });

    activeRooms.delete(roomId);
  } catch (error) {
    console.error('End game error:', error);
  }
}

