# 🔧 Troubleshooting Guide

## "Failed to generate room ID" Error

This error occurs when the frontend cannot connect to the backend server. Here are the most common causes and solutions:

### 1. **Backend Server Not Running**

**Problem**: The server on port 3000 is not running.

**Solution**:
```bash
# Make sure you're in the project root
cd "E:\Project\Mindspark Quiz Portals"

# Start the server
npm run server

# Or start both server and client
npm run dev
```

**Check**: Open http://localhost:3000/api/health in your browser. You should see:
```json
{"status":"ok","message":"Mindspark Quiz Portal API is running"}
```

### 2. **MongoDB Not Running**

**Problem**: MongoDB is not running or not accessible.

**Solution**:
```bash
# Windows - Start MongoDB service
net start MongoDB

# Or start MongoDB manually
mongod

# Check if MongoDB is running
# Try connecting: mongodb://localhost:27017
```

**Check**: Look at the server console. You should see:
```
✅ Connected to MongoDB
```

### 3. **Port Already in Use**

**Problem**: Port 3000 or 5173 is already being used by another application.

**Solution**:
- Close other applications using these ports
- Or change the ports in:
  - `server/.env` (PORT=3000)
  - `client/vite.config.js` (port: 5173)

### 4. **CORS Issues**

**Problem**: Browser blocking requests due to CORS policy.

**Solution**: 
- Make sure `CLIENT_URL` in `server/.env` matches your frontend URL
- Default should be: `CLIENT_URL=http://localhost:5173`

### 5. **Network/Firewall Issues**

**Problem**: Firewall or antivirus blocking connections.

**Solution**:
- Check Windows Firewall settings
- Temporarily disable antivirus to test
- Check if localhost is accessible

## Quick Diagnostic Steps

1. **Check Server Status**:
   ```bash
   # In terminal, check if port 3000 is listening
   netstat -ano | findstr :3000
   ```

2. **Check Server Logs**:
   - Look at the terminal where server is running
   - Should see: `🚀 Server running on port 3000`
   - Should see: `✅ Connected to MongoDB`

3. **Test API Directly**:
   - Open browser: http://localhost:3000/api/health
   - Should return JSON response

4. **Check Browser Console**:
   - Open Developer Tools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests

## Common Error Messages

### "Cannot connect to server"
- **Cause**: Server not running
- **Fix**: Start server with `npm run server`

### "Network Error"
- **Cause**: Server unreachable or CORS issue
- **Fix**: Check server is running and CORS config

### "MongoDB connection error"
- **Cause**: MongoDB not running
- **Fix**: Start MongoDB service

### "Room does not exist"
- **Cause**: Trying to join non-existent room
- **Fix**: Generate a new room ID or enter correct room ID

## Still Having Issues?

1. **Restart Everything**:
   ```bash
   # Stop all processes (Ctrl+C)
   # Then restart
   npm run dev
   ```

2. **Clear Browser Cache**:
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

3. **Check Environment Variables**:
   - Verify `server/.env` file exists
   - Check all required variables are set

4. **Reinstall Dependencies**:
   ```bash
   # Delete node_modules
   rm -rf node_modules server/node_modules client/node_modules
   
   # Reinstall
   npm run install-all
   ```

## Getting More Help

If the issue persists:
1. Check server console for detailed error messages
2. Check browser console (F12) for client-side errors
3. Verify all prerequisites are installed (Node.js, MongoDB)
4. Check the README.md for setup instructions

