# ✅ Verify Backend & Database Connection

## Quick Verification Steps

### 1. **Check Server Console**
When the server starts, you should see:
```
✅ Connected to MongoDB
🚀 Server running on port 3000
```

### 2. **Test Health Endpoint**
Open in browser or use curl:
```
http://localhost:3000/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Mindspark Quiz Portal API is running",
  "database": {
    "status": "connected",
    "connected": true,
    "database": "mindspark-quiz"
  }
}
```

### 3. **Test Database Connection via API**

**Get Questions (should work if DB is connected):**
```
http://localhost:3000/api/questions
```

**Expected:** Array of questions (may be empty if no questions added yet)

### 4. **Test Admin Endpoint**

**Get Analytics (requires admin key):**
```bash
curl -X GET http://localhost:3000/api/admin/analytics \
  -H "x-admin-key: admin123"
```

**Expected Response:**
```json
{
  "totalQuestions": 0,
  "totalGames": 0,
  "totalRooms": 0,
  "activeRooms": 0
}
```

## Database Connection States

- **0 = disconnected** - Not connected to MongoDB
- **1 = connected** - ✅ Successfully connected
- **2 = connecting** - Currently connecting
- **3 = disconnecting** - Currently disconnecting

## Test Adding a Question

### Via Admin Panel:
1. Go to http://localhost:5173/admin
2. Login with key: `admin123`
3. Click "Add Question"
4. Fill in the form:
   - Question: "What is 2+2?"
   - Options: A: "3", B: "4", C: "5", D: "6"
   - Correct Answer: Select "B: 4"
   - Category: General
   - Difficulty: Easy
   - Points: 10
   - Time Limit: 30
5. Click "Add Question"
6. Should see success message and question appears in list

### Via API (curl):
```bash
curl -X POST http://localhost:3000/api/admin/questions \
  -H "Content-Type: application/json" \
  -H "x-admin-key: admin123" \
  -d '{
    "question": "What is the capital of France?",
    "options": ["London", "Berlin", "Paris", "Madrid"],
    "correctAnswer": "Paris",
    "category": "geography",
    "difficulty": "easy",
    "points": 10,
    "timeLimit": 30
  }'
```

**Expected Response:**
```json
{
  "_id": "...",
  "question": "What is the capital of France?",
  "options": ["London", "Berlin", "Paris", "Madrid"],
  "correctAnswer": "Paris",
  "category": "geography",
  "difficulty": "easy",
  "points": 10,
  "timeLimit": 30,
  "isActive": true,
  "createdAt": "...",
  "updatedAt": "..."
}
```

## Verify Questions in Database

### Option 1: Check via API
```
http://localhost:3000/api/questions
```

### Option 2: Check via Admin Panel
- Go to Admin Panel
- Questions list should show all questions
- Analytics should show total question count

### Option 3: Check MongoDB Directly
If you have MongoDB Compass or mongo shell:
```javascript
use mindspark-quiz
db.questions.find().pretty()
```

## Troubleshooting

### If Health Check Shows "disconnected":
1. Check MongoDB is running:
   ```bash
   # Windows
   net start MongoDB
   
   # Check if running
   mongod --version
   ```

2. Check connection string in `server/.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/mindspark-quiz
   ```

3. Restart server:
   ```bash
   npm run server
   ```

### If Questions Not Adding:
1. Check browser console (F12) for errors
2. Check server console for error messages
3. Verify admin key is correct: `admin123`
4. Check all form fields are filled
5. Ensure correct answer matches one of the options exactly

## Success Indicators

✅ **Connection Working:**
- Server console shows: `✅ Connected to MongoDB`
- Health endpoint shows: `"connected": true`
- Can fetch questions: `/api/questions` returns array
- Can add questions via admin panel

✅ **Database Working:**
- Questions save successfully
- Questions appear in list after adding
- Analytics shows correct question count
- Questions appear in game when starting quiz

## Next Steps

Once connection is verified:
1. ✅ Add sample questions via Admin Panel
2. ✅ Test creating a room
3. ✅ Test joining a room
4. ✅ Test starting a game
5. ✅ Verify questions appear in game

