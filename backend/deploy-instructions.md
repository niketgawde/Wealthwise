# Backend Deployment Instructions

## Option 1: Install Heroku CLI (Recommended)

### For macOS:
```bash
# Using Homebrew
brew tap heroku/brew && brew install heroku

# Or download installer from:
# https://devcenter.heroku.com/articles/heroku-cli
```

### Deploy Steps:
```bash
# 1. Login to Heroku
heroku login

# 2. Create Heroku app
heroku create wealthwise-api

# 3. Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-super-secret-jwt-key-here
heroku config:set MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/wealthwise?retryWrites=true&w=majority"

# 4. Deploy
git push heroku master

# 5. Open your app
heroku open
```

## Option 2: Deploy via Heroku Dashboard (No CLI needed)

### 1. Push to GitHub first:
```bash
# Create a new GitHub repository, then:
git remote add origin https://github.com/yourusername/wealthwise-backend.git
git push -u origin master
```

### 2. Deploy from GitHub on Heroku:
1. Go to https://dashboard.heroku.com
2. Click "New" → "Create new app"
3. Name it "wealthwise-api"
4. Go to "Deploy" tab
5. Connect to GitHub
6. Search for your repo and connect
7. Enable automatic deploys (optional)
8. Click "Deploy Branch"

### 3. Set Environment Variables:
1. Go to "Settings" tab
2. Click "Reveal Config Vars"
3. Add:
   - NODE_ENV = production
   - JWT_SECRET = (generate a secure key)
   - MONGO_URI = (your MongoDB connection string)
   - FRONTEND_URL = https://your-frontend.vercel.app

## MongoDB Atlas Setup (Required for both options)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new cluster (M0 - free tier)
4. Click "Connect" → "Connect your application"
5. Copy connection string
6. Replace <password> with your database user password
7. Replace <dbname> with "wealthwise"

**Important**: In Network Access, add 0.0.0.0/0 to allow connections from anywhere

## Your Current Backend Status:
- ✅ package.json configured with Node 18.x
- ✅ Procfile created
- ✅ server.js updated with health check
- ✅ Environment variables configured
- ✅ Git repository initialized
- ✅ Initial commit created

## Next Steps:
1. Set up MongoDB Atlas
2. Deploy using one of the options above
3. Note your backend URL
4. Deploy frontend to Vercel
5. Update FRONTEND_URL in Heroku

## Useful Commands After Deployment:
```bash
# View logs
heroku logs --tail

# Restart app
heroku restart

# Check app status
heroku ps

# Run console
heroku run node
```