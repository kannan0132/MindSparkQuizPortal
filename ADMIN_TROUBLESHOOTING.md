# Admin Panel - Question Adding Troubleshooting

## Common Issues When Adding Questions

### 1. **"Failed to save question" Error**

**Possible Causes:**
- Server not running
- MongoDB not connected
- Validation errors
- Network issues

**Solutions:**
1. Check if server is running:
   ```bash
   # Should see: 🚀 Server running on port 3000
   npm run server
   ```

2. Check MongoDB connection:
   ```bash
   # Server console should show: ✅ Connected to MongoDB
   ```

3. Check browser console (F12) for detailed error messages

4. Verify admin key is correct (default: `admin123`)

### 2. **Questions Not Appearing After Adding**

**Possible Causes:**
- Questions saved but not refreshing
- `isActive` flag set to false
- Database connection issues

**Solutions:**
1. Refresh the questions list manually
2. Check browser console for errors
3. Verify questions in database:
   - Check MongoDB directly
   - Or check server logs

### 3. **Validation Errors**

**Common Validation Issues:**
- Empty question text
- Less than 2 options
- Empty options
- Correct answer doesn't match any option
- Invalid difficulty value (must be: easy, medium, hard)

**Solutions:**
- Fill all required fields
- Ensure correct answer matches one of the options exactly
- Check all options are filled

### 4. **"Unauthorized" Error**

**Cause:** Admin key mismatch

**Solution:**
- Use admin key: `admin123` (default)
- Or set `ADMIN_KEY` in `server/.env`

### 5. **Network/CORS Errors**

**Solutions:**
- Check server is running on port 3000
- Check `CLIENT_URL` in `server/.env` matches frontend URL
- Check browser console for CORS errors

## Testing Question Addition

1. **Open Admin Panel:**
   - Go to http://localhost:5173/admin
   - Enter admin key: `admin123`

2. **Fill Form:**
   - Question: "What is 2+2?"
   - Option A: "3"
   - Option B: "4"
   - Option C: "5"
   - Option D: "6"
   - Correct Answer: Select "B: 4"
   - Category: General
   - Difficulty: Easy
   - Points: 10
   - Time Limit: 30

3. **Submit:**
   - Click "Add Question"
   - Should see success message
   - Question should appear in list

4. **Verify:**
   - Check questions list updates
   - Check analytics shows increased count
   - Try creating a room and starting game to see if question appears

## Debug Steps

1. **Check Server Logs:**
   - Look for error messages in server console
   - Check for validation errors

2. **Check Browser Console (F12):**
   - Network tab: Check if POST request is sent
   - Check response status and body
   - Look for error messages

3. **Test API Directly:**
   ```bash
   # Test with curl
   curl -X POST http://localhost:3000/api/admin/questions \
     -H "Content-Type: application/json" \
     -H "x-admin-key: admin123" \
     -d '{
       "question": "Test question?",
       "options": ["A", "B", "C", "D"],
       "correctAnswer": "A",
       "category": "general",
       "difficulty": "easy",
       "points": 10,
       "timeLimit": 30
     }'
   ```

4. **Check Database:**
   ```javascript
   // In MongoDB shell or Compass
   db.questions.find().pretty()
   ```

## Still Not Working?

1. Restart server:
   ```bash
   # Stop server (Ctrl+C)
   npm run server
   ```

2. Clear browser cache and hard refresh (Ctrl+Shift+R)

3. Check all environment variables in `server/.env`

4. Verify MongoDB is running and accessible

