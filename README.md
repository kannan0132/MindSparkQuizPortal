# 🚀 Mindspark Quiz Portal

A real-time multiplayer quiz application with a beautiful galaxy-themed UI. Players can create or join quiz rooms, compete in real-time, and see live leaderboards.

## ✨ Features

### 🏠 Home Module
- Beautiful galaxy-themed landing page
- Project introduction and features
- Navigation to join quiz or admin panel

### 🔐 Authentication / Join Module
- Enter nickname (1-20 characters)
- Enter or generate room ID
- Input validation
- Duplicate nickname prevention
- Room existence validation

### 🎮 Lobby Module
- Real-time player list
- Host identification
- Start game button (host only)
- Live player join/leave updates

### 🎯 Game / Quiz Module
- Multiple choice questions
- Timer for each question
- Answer submission
- Lock answers after submission
- Real-time feedback
- Live leaderboard updates

### 📡 Real-Time Communication
- WebSocket-based communication (Socket.io)
- Live player updates
- Question broadcasting
- Score updates
- Room events (join/leave)

### 🏆 Score & Leaderboard Module
- Real-time score calculation
- Player ranking
- Final results display
- Game statistics

### 👨‍💼 Admin Module
- Add/Edit/Delete questions
- View analytics
- Manage quiz content
- Game history

### 💾 Database Management
- User storage
- Question storage
- Score tracking
- Game history

### ⚠️ Error Handling & Validation
- Invalid room handling
- Duplicate name prevention
- Disconnect handling
- Error boundaries
- Input validation

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express
- **Socket.io** for real-time communication
- **MongoDB** with Mongoose
- **UUID** for room ID generation

### Frontend
- **React** with Vite
- **React Router** for navigation
- **Socket.io Client** for real-time updates
- **Axios** for API calls

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Mindspark Quiz Portals"
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   
   Create `server/.env` file:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/mindspark-quiz
   CLIENT_URL=http://localhost:5173
   ADMIN_KEY=admin123
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system. If not installed, download from [mongodb.com](https://www.mongodb.com/try/download/community)

5. **Run the application**
   ```bash
   npm run dev
   ```

   This will start both the server (port 3000) and client (port 5173) concurrently.

   Or run separately:
   ```bash
   # Terminal 1 - Server
   npm run server

   # Terminal 2 - Client
   npm run client
   ```

## 🎮 Usage

### For Players

1. **Start Quiz**
   - Go to the home page
   - Click "START QUIZ"
   - Enter your nickname
   - Generate or enter a room ID
   - Click "Join Room"

2. **Create Room**
   - Click "Generate" to create a new room ID
   - Share the room ID with friends
   - Wait for players to join
   - Click "Start Game" when ready (host only)

3. **Play Quiz**
   - Answer questions within the time limit
   - Submit your answer
   - View real-time leaderboard
   - See final results at the end

### For Admins

1. **Access Admin Panel**
   - Go to home page
   - Click "Admin Panel"
   - Enter admin key: `admin123`

2. **Manage Questions**
   - Add new questions
   - Edit existing questions
   - Delete questions
   - View analytics

## 📁 Project Structure

```
Mindspark Quiz Portals/
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Room.js
│   │   ├── Question.js
│   │   └── GameHistory.js
│   ├── modules/
│   │   └── realtime/
│   │       └── socketHandlers.js
│   ├── routes/
│   │   ├── rooms.js
│   │   ├── questions.js
│   │   └── admin.js
│   ├── index.js
│   └── package.json
├── client/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── Home/
│   │   │   ├── Auth/
│   │   │   ├── Lobby/
│   │   │   ├── Game/
│   │   │   ├── Leaderboard/
│   │   │   ├── Admin/
│   │   │   └── ErrorHandling/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── package.json
└── README.md
```

## 🔧 Configuration

### Server Configuration
- Default port: `3000`
- MongoDB connection: Set in `.env` file
- CORS: Configured for client URL

### Client Configuration
- Default port: `5173`
- API proxy: Configured in `vite.config.js`

## 🎨 UI Features

- **Galaxy Theme**: Beautiful gradient backgrounds with star animations
- **Responsive Design**: Works on desktop and mobile devices
- **Smooth Animations**: Transitions and hover effects
- **Real-time Updates**: Live score and player updates
- **Error Handling**: User-friendly error messages

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env` file
- Verify MongoDB is accessible

### Socket Connection Issues
- Check if server is running on port 3000
- Verify CORS settings in server
- Check browser console for errors

### Room Not Found
- Ensure room ID is correct (case-insensitive)
- Check if room was created by host
- Verify server is running

## 📝 API Endpoints

### Rooms
- `POST /api/rooms/generate` - Generate new room ID
- `GET /api/rooms/:roomId` - Get room info
- `POST /api/rooms/validate` - Validate room exists

### Questions
- `GET /api/questions` - Get all questions
- `GET /api/questions/random` - Get random questions
- `GET /api/questions/:id` - Get question by ID

### Admin
- `POST /api/admin/questions` - Create question
- `PUT /api/admin/questions/:id` - Update question
- `DELETE /api/admin/questions/:id` - Delete question
- `GET /api/admin/analytics` - Get analytics
- `GET /api/admin/history` - Get game history

## 🔒 Security Notes

- Admin key is currently set to `admin123` (change in production)
- Consider implementing JWT authentication for production
- Add rate limiting for API endpoints
- Validate all user inputs on server side

## 🚀 Future Enhancements

- [ ] User authentication system
- [ ] Custom question sets
- [ ] Team mode
- [ ] Power-ups and special rounds
- [ ] Chat functionality
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Question categories and difficulty levels
- [ ] Tournament mode

## 📄 License

MIT License

## 👥 Contributors

Built with ❤️ for Mindspark Quiz Portal

---

**Enjoy quizzing! 🎉**

