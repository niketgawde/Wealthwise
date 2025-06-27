# 🚀 WealthWise Complete Deployment Steps

Follow these steps in order. Total time: ~30 minutes

## ✅ Step 1: MongoDB Atlas (You're doing this now)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account and cluster
3. Create database user (save password!)
4. Add Network Access: 0.0.0.0/0
5. Get connection string and modify it:
   ```
   mongodb+srv://username:PASSWORD@cluster.mongodb.net/wealthwise?retryWrites=true&w=majority
   ```

## 📦 Step 2: Create GitHub Repository

1. Go to https://github.com
2. Click "New" (green button)
3. Repository name: `wealthwise-mvp`
4. Description: "Personal finance and investment platform"
5. Keep it Public
6. DON'T initialize with README
7. Click "Create repository"
8. Copy the commands shown (we'll use them next)

## 💻 Step 3: Push Code to GitHub

Run these commands in your terminal:

```bash
cd /Users/niketgawde/hackathon/wealthwise-mvp
git remote add origin https://github.com/YOUR_USERNAME/wealthwise-mvp.git
git branch -M main
git push -u origin main
```

## 🔧 Step 4: Deploy Backend to Heroku

### A. Create Heroku Account
1. Go to https://heroku.com
2. Sign up for free account
3. Verify email

### B. Create Backend App
1. Go to https://dashboard.heroku.com
2. Click "New" → "Create new app"
3. App name: `wealthwise-api-YOUR_NAME` (must be unique)
4. Region: United States
5. Click "Create app"

### C. Connect GitHub
1. In your app, go to "Deploy" tab
2. Deployment method: GitHub
3. Click "Connect to GitHub"
4. Authorize Heroku
5. Search for: `wealthwise-mvp`
6. Click "Connect"

### D. Configure Environment Variables
1. Go to "Settings" tab
2. Click "Reveal Config Vars"
3. Add these variables:

   | KEY | VALUE |
   |-----|-------|
   | NODE_ENV | production |
   | JWT_SECRET | (click generate below) |
   | MONGO_URI | (your MongoDB connection string) |
   | FRONTEND_URL | https://wealthwise.vercel.app |

   Generate JWT_SECRET:
   ```bash
   openssl rand -base64 32
   ```
   Or use: `your-super-secret-jwt-key-change-this-in-production`

### E. Deploy
1. Go back to "Deploy" tab
2. Scroll to "Manual deploy"
3. Choose branch: main
4. Click "Deploy Branch"
5. Wait for build to complete (2-3 minutes)
6. Click "View" to see your API

### F. Test Your API
Your API URL will be: `https://YOUR-APP-NAME.herokuapp.com`
Test it: `https://YOUR-APP-NAME.herokuapp.com/health`

## 🎨 Step 5: Deploy Frontend to Vercel

### A. Prepare Frontend
1. Update frontend environment:
   ```bash
   cd frontend
   echo "REACT_APP_API_URL=https://YOUR-HEROKU-APP.herokuapp.com/api" > .env.production
   echo "REACT_APP_WS_URL=wss://YOUR-HEROKU-APP.herokuapp.com" >> .env.production
   ```

2. Commit changes:
   ```bash
   cd ..
   git add .
   git commit -m "Update frontend API URL"
   git push
   ```

### B. Deploy to Vercel
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Import `wealthwise-mvp`
5. Configure:
   - Framework Preset: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
6. Environment Variables:
   - `REACT_APP_API_URL` = `https://YOUR-HEROKU-APP.herokuapp.com/api`
7. Click "Deploy"
8. Wait 2-3 minutes

## 🔄 Step 6: Update Backend CORS

1. Go back to Heroku dashboard
2. Settings → Config Vars
3. Update `FRONTEND_URL` to your Vercel URL
4. More → Restart all dynos

## ✅ Step 7: Test Everything

1. Open your frontend URL
2. Create an account
3. Add some investments
4. Check real-time updates
5. Generate AI recommendations

## 🎉 You're Live!

### Your URLs:
- Frontend: `https://YOUR-APP.vercel.app`
- Backend API: `https://YOUR-HEROKU-APP.herokuapp.com`
- API Health: `https://YOUR-HEROKU-APP.herokuapp.com/health`

## 🛠️ Troubleshooting

### Backend not working?
```bash
# Check Heroku logs (in Heroku dashboard)
More → View logs
```

### Frontend errors?
- Check browser console (F12)
- Verify API URL in Network tab
- Check Vercel function logs

### MongoDB connection issues?
- Verify IP whitelist: 0.0.0.0/0
- Check username/password
- Ensure database name is "wealthwise"

## 📊 Next Steps

1. **Custom Domain**
   - Add in Vercel settings
   - Update CORS in Heroku

2. **Monitoring**
   - Enable Heroku metrics
   - Add error tracking

3. **Scaling**
   - Upgrade Heroku dyno ($7/month)
   - MongoDB Atlas M10 ($10/month)

## Need Help?

1. Check deployment logs
2. Verify all environment variables
3. Test API endpoints directly
4. Check browser console for errors

Remember: Free tier limits:
- Heroku: 550 hours/month
- MongoDB Atlas: 512MB storage
- Vercel: Unlimited

Good luck! 🚀