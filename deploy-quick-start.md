# Quick Deployment Guide - WealthWise

## 🚀 Fastest Deployment Method (Heroku + Vercel)

### Prerequisites
- Git installed
- Node.js 18+ installed
- GitHub account
- Heroku account (free)
- Vercel account (free)
- MongoDB Atlas account (free)

### Step 1: MongoDB Atlas Setup (5 minutes)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a new cluster (choose free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (save this for later)
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/wealthwise?retryWrites=true&w=majority
   ```

### Step 2: Deploy Backend to Heroku (10 minutes)

1. **Install Heroku CLI**
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # Windows/Linux - download from heroku.com
   ```

2. **Deploy Backend**
   ```bash
   cd backend
   heroku login
   heroku create wealthwise-backend
   
   # Set environment variables
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=$(openssl rand -base64 32)
   heroku config:set MONGO_URI="your-mongodb-connection-string"
   heroku config:set FRONTEND_URL="https://wealthwise.vercel.app"
   
   # Deploy
   git init
   git add .
   git commit -m "Deploy backend"
   git push heroku main
   ```

3. **Note your backend URL**: `https://wealthwise-backend.herokuapp.com`

### Step 3: Deploy Frontend to Vercel (5 minutes)

1. **Update Frontend Environment**
   ```bash
   cd ../frontend
   echo "REACT_APP_API_URL=https://wealthwise-backend.herokuapp.com/api" > .env.production
   ```

2. **Deploy with Vercel CLI**
   ```bash
   npm i -g vercel
   vercel --prod
   ```
   
   OR
   
   **Deploy via Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variable:
     - `REACT_APP_API_URL` = `https://wealthwise-backend.herokuapp.com/api`
   - Deploy!

### Step 4: Update Backend CORS (1 minute)

```bash
heroku config:set FRONTEND_URL="https://your-app.vercel.app" -a wealthwise-backend
```

## ✅ You're Live!

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://wealthwise-backend.herokuapp.com
- **API Health**: https://wealthwise-backend.herokuapp.com/health

## 🛠️ Useful Commands

### Backend (Heroku)
```bash
# View logs
heroku logs --tail -a wealthwise-backend

# Restart app
heroku restart -a wealthwise-backend

# Check status
heroku ps -a wealthwise-backend
```

### Frontend (Vercel)
```bash
# Redeploy
vercel --prod

# View deployments
vercel ls
```

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Whitelist IP: 0.0.0.0/0 in MongoDB Atlas
   - Check username/password in connection string
   - Ensure database name is correct

2. **CORS Errors**
   - Update `FRONTEND_URL` in Heroku
   - Check that backend allows your frontend URL

3. **WebSocket Not Connecting**
   - Ensure you're using `wss://` for production
   - Check Heroku supports WebSocket (it does!)

4. **Build Failures**
   - Check Node version matches (18.x)
   - Clear cache and rebuild
   - Check all dependencies are in package.json

## 📱 Test Your App

1. Register a new account
2. Add some investments
3. Check real-time price updates
4. Generate AI recommendations
5. View your portfolio

## 🎉 Congratulations!

Your WealthWise app is now live! Share it with friends and start managing your investments.

## 📈 Next Steps

1. **Custom Domain**
   - Add custom domain in Vercel
   - Update CORS in backend

2. **Monitoring**
   - Add Sentry for error tracking
   - Set up uptime monitoring

3. **Analytics**
   - Add Google Analytics
   - Track user engagement

4. **Scaling**
   - Upgrade Heroku dyno for better performance
   - Consider MongoDB Atlas paid tier for more storage

## 💰 Cost Estimate

**Current Setup (Free)**:
- Heroku: Free (550 hours/month)
- Vercel: Free (unlimited)
- MongoDB Atlas: Free (512MB)

**Production Setup** ($25-50/month):
- Heroku Hobby: $7/month
- MongoDB Atlas M10: $10/month
- Domain: $12/year
- SSL: Free (Let's Encrypt)

## 📞 Need Help?

- Check logs first!
- Review deployment guide
- Check GitHub issues
- Ask in discussions

Happy investing with WealthWise! 🚀