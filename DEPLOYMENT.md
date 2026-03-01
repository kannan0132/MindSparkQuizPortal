# Deployment Guide: MindSpark Quiz Portal

This guide explains how to deploy your application using a **Hybrid Approach**:
- **Backend**: [Railway](https://railway.app/) (Supports WebSockets for real-time quiz)
- **Frontend**: [Vercel](https://vercel.com/) (Fast static hosting)

## Step 1: Push Changes to GitHub
1. Open your terminal in the project root.
2. Run these commands:
   ```bash
   git add .
   git commit -m "Configure deployment for Railway and Vercel"
   git push origin main
   ```

## Step 2: Deploy Backend to Railway
1. Go to [Railway.app](https://railway.app/) and sign in with GitHub.
2. Click **New Project** > **Deploy from GitHub repo**.
3. Select this repository.
4. Click **Add Variables** and add the following:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A random string (e.g., `abcdef123456`).
   - `ADMIN_SECRET_KEY`: Your secret key for admin panel.
   - `CLIENT_URL`: Keep this empty for now, or use `*` (asterisk) temporarily.
5. Railway will automatically detect the `Procfile` and start the server.
6. Once deployed, Railway will give you a URL (e.g., `https://mindspark-quiz-production.up.railway.app`). **Copy this URL**.

## Step 3: Deploy Frontend to Vercel
1. Go to [Vercel.com](https://vercel.com/) and sign in with GitHub.
2. Click **Add New** > **Project**.
3. Import this repository.
4. **CRITICAL: Configure Project Settings**:
   - **Root Directory**: Set this to `client`. (This is because your React app is inside a subfolder).
   - **Framework Preset**: Select `Vite`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables**:
   - `VITE_API_URL`: Paste the Railway URL you copied in Step 2.
6. Click **Deploy**.
7. Once deployed, Vercel will give you a URL (e.g., `https://mindspark-quiz.vercel.app`). **Copy this URL**.

## Step 4: Final Connection (Railway Update)
1. Go back to your **Railway project settings**.
2. Update the `CLIENT_URL` variable with your **Vercel URL** from Step 3.
3. Railway will redeploy with the correct CORS settings. This allows your backend to accept requests from your new frontend URL.

## Troubleshooting Common Vercel Issues

### 404 on Page Refresh (React Router)
Vercel needs to know to send all URL requests to `index.html`. 
✅ **Fix**: I have already created a **[`client/vercel.json`](file:///E:/Project/Mindspark%20Quiz%20Portals%20-%20Priya/client/vercel.json)** file with the necessary `rewrites` to fix this.

### Blank Page or 404 After Build
This usually means Vercel is looking in the wrong folder.
✅ **Fix**: Check these in **Settings > Build & Output**:
- **Root Directory**: Must be `client`.
- **Output Directory**: Must be `dist` (since you're using Vite).
- **Framework Preset**: Should be `Vite`.

### "Not Found" or API Connection Errors
✅ **Fix**: Check your **Environment Variables**:
- **VITE_API_URL** (on Vercel): Must be your Railway URL (e.g., `https://backend.up.railway.app`). No trailing slash!
- **CLIENT_URL** (on Railway): Must be your Vercel URL (e.g., `https://frontend.vercel.app`).

## Summary of Environment Variables
| Variable | Project | Purpose |
| :--- | :--- | :--- |
| `MONGODB_URI` | Railway (Backend) | Database connection |
| `JWT_SECRET` | Railway (Backend) | Auth security |
| `ADMIN_SECRET_KEY`| Railway (Backend) | Admin access |
| `CLIENT_URL` | Railway (Backend) | Allow frontend to connect |
| `VITE_API_URL` | Vercel (Frontend) | Point to your backend |
