# 🚀 Quick Start Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or connection string)

## Setup Steps

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Configure Environment
Create `server/.env` file:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/mindspark-quiz
CLIENT_URL=http://localhost:5173
ADMIN_KEY=admin123
```

### 3. Seed Database (Optional)
```bash
cd server
npm run seed
cd ..
```

This will populate the database with sample questions.

### 4. Start the Application
```bash
npm run dev
```

This starts both server (port 3000) and client (port 5173).

### 5. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **Admin Panel**: http://localhost:5173/admin (key: `admin123`)

## Testing the Application

1. **Create a Room**:
   - Go to http://localhost:5173
   - Click "START QUIZ"
   - Enter nickname
   - Click "Generate" to create room ID
   - Click "Create & Join"

2. **Join as Another Player**:
   - Open another browser/incognito window
   - Go to http://localhost:5173
   - Click "START QUIZ"
   - Enter different nickname
   - Enter the same room ID
   - Click "Join Room"

3. **Start Game**:
   - Host clicks "Start Game"
   - Wait for countdown
   - Answer questions
   - View leaderboard

## Troubleshooting

### MongoDB Not Running
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# or
mongod
```

### Port Already in Use
Change ports in:
- `server/.env` (PORT)
- `client/vite.config.js` (server.port)

### Socket Connection Failed
- Check if server is running
- Verify CORS settings in `server/index.js`
- Check browser console for errors

## Next Steps

- Add more questions via Admin Panel
- Customize UI colors in CSS files
- Configure MongoDB connection string for production
- Set up proper authentication for admin panel

Happy Quizzing! 🎉

