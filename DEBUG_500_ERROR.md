# Debugging 500 Internal Server Error

## Quick Fixes

### 1. **Check Server Console**
Look at the terminal where the server is running. You should see the actual error message:
```
Error: [specific error message]
```

### 2. **Common Causes**

#### A. Database Connection Issue
**Error:** `MongooseError: Operation timed out` or connection errors

**Fix:**
- Ensure MongoDB is running
- Check connection string in `server/.env`
- Restart server

#### B. Missing Environment Variables
**Error:** `Cannot read property of undefined`

**Fix:**
- Create `server/.env` file if missing
- Add required variables:
  ```
  PORT=3000
  MONGODB_URI=mongodb://localhost:27017/mindspark-quiz
  CLIENT_URL=http://localhost:5173
  ADMIN_KEY=admin123
  ```

#### C. Model/Validation Error
**Error:** `ValidationError` or schema errors

**Fix:**
- Check the data being sent matches the model schema
- Verify all required fields are present
- Check field types match (string, number, etc.)

#### D. Async/Await Issues
**Error:** `TypeError: Cannot read property 'save' of undefined`

**Fix:**
- Ensure all async operations use `await`
- Check error handling in try-catch blocks

## Debugging Steps

### Step 1: Check Which Endpoint is Failing

**Check Browser Console (F12):**
- Network tab → Find the failed request
- Look at the Request URL to see which endpoint failed
- Check Response tab for error details

**Common Endpoints:**
- `/api/health` - Health check
- `/api/questions` - Get questions
- `/api/admin/questions` - Add question
- `/api/admin/analytics` - Get analytics

### Step 2: Check Server Logs

**Look for:**
```
Error: [error message]
at [file path]:[line number]
```

### Step 3: Test Endpoints Individually

**Health Check:**
```bash
curl http://localhost:3000/api/health
```

**Get Questions:**
```bash
curl http://localhost:3000/api/questions
```

**Get Analytics (requires admin key):**
```bash
curl -H "x-admin-key: admin123" http://localhost:3000/api/admin/analytics
```

### Step 4: Check Database Connection

**In server console, you should see:**
```
✅ Connected to MongoDB
```

**If not:**
1. Start MongoDB:
   ```bash
   net start MongoDB
   ```

2. Check connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/mindspark-quiz
   ```

3. Restart server

## Specific Error Fixes

### Error: "Cannot read property 'databaseName' of undefined"
**Location:** Health check endpoint

**Fix:** Already fixed in latest code. Restart server.

### Error: "Question validation failed"
**Location:** Admin question creation

**Fix:**
- Ensure all required fields are filled
- Check correct answer matches one of the options exactly
- Verify options array has at least 2 items

### Error: "MongoError: connection closed"
**Location:** Any database operation

**Fix:**
- Restart MongoDB
- Check MongoDB is running: `net start MongoDB`
- Restart server

### Error: "Unauthorized"
**Location:** Admin endpoints

**Fix:**
- Use correct admin key: `admin123`
- Check header is sent: `x-admin-key: admin123`

## Enable Detailed Error Logging

The server now logs detailed errors. Check:
1. Server console for error messages
2. Browser console (F12) for client-side errors
3. Network tab for request/response details

## Still Getting 500 Error?

1. **Restart Everything:**
   ```bash
   # Stop server (Ctrl+C)
   # Restart MongoDB
   net start MongoDB
   # Restart server
   npm run server
   ```

2. **Check All Files:**
   - Ensure `server/.env` exists
   - Check all dependencies installed: `npm install`
   - Verify MongoDB is accessible

3. **Check Server Console:**
   - Look for the exact error message
   - Note which endpoint failed
   - Check stack trace for file and line number

4. **Test with Simple Request:**
   ```bash
   curl http://localhost:3000/api/health
   ```

## Getting Help

If error persists, provide:
1. Full error message from server console
2. Which endpoint is failing (from browser Network tab)
3. Request payload (if POST/PUT)
4. Server console output
5. Browser console errors (F12)

