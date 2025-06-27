# 🚀 One-Click Deploy

Deploy WealthWise in minutes with one-click deploy buttons!

## Backend (Render)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/niketgawde/Wealthwise)

**What happens:**
- Automatically deploys backend from GitHub
- Sets up Node.js environment
- Configures SQLite database
- Seeds demo data
- Returns a live API URL

## Frontend (Vercel)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/niketgawde/Wealthwise&root-directory=frontend&env=REACT_APP_API_URL,REACT_APP_SOCKET_URL,CI&envDescription=Backend%20API%20URL%20from%20Render&project-name=wealthwise-frontend)

**What happens:**
- Automatically deploys frontend from GitHub  
- Builds React app with optimizations
- Sets up global CDN
- Prompts for backend API URL
- Returns a live app URL

## Manual Setup (Alternative)

If one-click deploy doesn't work, follow these steps:

### 1. Deploy Backend to Render

1. Go to [render.com](https://render.com)
2. Sign up/login with GitHub
3. **New Web Service** → Connect GitHub → Select "Wealthwise"
4. **Configure:**
   ```
   Name: wealthwise-backend
   Build Command: cd backend && npm install
   Start Command: cd backend && npm run deploy
   ```
5. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=5001
   JWT_SECRET=xWQi6UnCq4wpIHTOTLGrsAzkQ48TMtdPUv49NNRQ39I=
   FRONTEND_URL=*
   ```
6. **Deploy** (takes ~5 minutes)
7. **Copy your backend URL** (e.g., `https://wealthwise-backend.onrender.com`)

### 2. Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. **Import Project** → "niketgawde/Wealthwise"
4. **Configure:**
   ```
   Root Directory: frontend
   Framework: Create React App
   ```
5. **Environment Variables:**
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   REACT_APP_SOCKET_URL=https://your-backend-url.onrender.com
   CI=false
   ```
6. **Deploy** (takes ~3 minutes)
7. **Copy your frontend URL** (e.g., `https://wealthwise-frontend.vercel.app`)

### 3. Update CORS

1. **Go back to Render**
2. **Update environment variable:**
   ```
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```
3. **Redeploy backend**

## 🎯 Demo Credentials

Once deployed, login with:
- **Email:** `demo@wealthwise.com`
- **Password:** `demo123`

## 🔄 Auto-Deploy Enabled

After initial setup, every push to `main` branch will automatically:
- ✅ Run tests via GitHub Actions
- ✅ Deploy backend to Render 
- ✅ Deploy frontend to Vercel
- ✅ Update your live app

## 🆘 Troubleshooting

**Backend fails to start:**
- Check Render logs for errors
- Verify all environment variables are set
- Ensure `PORT=5001` is configured

**Frontend build fails:**
- Check Vercel build logs
- Verify `CI=false` is set
- Ensure `REACT_APP_*` variables are configured

**CORS errors:**
- Verify `FRONTEND_URL` in backend matches Vercel URL exactly
- Include `https://` protocol
- Clear browser cache

**Database errors:**
- SQLite database persists automatically
- Demo data seeds on first startup
- Check Render logs for database connection issues

## 💡 Tips

- **First deploy takes longer** - subsequent deploys are faster
- **Free tier limitations** - May sleep after 15min of inactivity
- **Custom domains** - Both platforms support custom domains
- **Monitoring** - Use platform dashboards to monitor performance

## 📞 Need Help?

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Issues](https://github.com/niketgawde/Wealthwise/issues)