#!/bin/bash

echo "🚀 Starting WealthWise Deployment to Heroku..."

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI is not installed. Please install it first."
    echo "Visit: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Check if user is logged in to Heroku
if ! heroku auth:whoami &> /dev/null; then
    echo "📝 Please login to Heroku..."
    heroku login
fi

echo "✅ Heroku CLI is ready!"

# Backend Deployment
echo ""
echo "📦 Deploying Backend..."
cd backend

# Initialize git if not already
if [ ! -d .git ]; then
    git init
    git add .
    git commit -m "Initial commit"
fi

# Create Heroku app for backend
echo "Creating Heroku app for backend..."
heroku create wealthwise-api-$RANDOM

# Get the app name
APP_NAME=$(heroku apps:info -s | grep web_url | cut -d= -f2 | sed 's/https:\/\///' | sed 's/.herokuapp.com\///')
BACKEND_URL="https://$APP_NAME.herokuapp.com"

echo "Backend URL: $BACKEND_URL"

# Set environment variables
echo "Setting environment variables..."
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$(openssl rand -base64 32)

# MongoDB Atlas setup reminder
echo ""
echo "⚠️  IMPORTANT: MongoDB Atlas Setup Required!"
echo "1. Go to https://www.mongodb.com/cloud/atlas"
echo "2. Create a free cluster"
echo "3. Create a database user"
echo "4. Whitelist 0.0.0.0/0 (allow access from anywhere)"
echo "5. Get your connection string"
echo ""
read -p "Enter your MongoDB connection string: " MONGO_URI
heroku config:set MONGO_URI="$MONGO_URI"

# Deploy backend
echo "Deploying backend to Heroku..."
git push heroku main || git push heroku master

echo "✅ Backend deployed successfully!"
echo "Backend URL: $BACKEND_URL"

# Frontend Deployment
echo ""
echo "📦 Preparing Frontend Deployment..."
cd ../frontend

# Update frontend environment
echo "REACT_APP_API_URL=$BACKEND_URL/api" > .env.production
echo "REACT_APP_WS_URL=wss://${APP_NAME}.herokuapp.com" >> .env.production

# Build frontend
echo "Building frontend..."
npm run build

echo ""
echo "✅ Deployment preparation complete!"
echo ""
echo "📝 Next Steps for Frontend:"
echo "1. Go to https://vercel.com"
echo "2. Import your GitHub repository"
echo "3. Set environment variables:"
echo "   - REACT_APP_API_URL = $BACKEND_URL/api"
echo "   - REACT_APP_WS_URL = wss://${APP_NAME}.herokuapp.com"
echo "4. Deploy!"
echo ""
echo "Alternative: Deploy frontend using Vercel CLI:"
echo "  npm i -g vercel"
echo "  vercel --prod"
echo ""
echo "🎉 Backend is live at: $BACKEND_URL"
echo "📚 Check logs: heroku logs --tail"

# Update backend with frontend URL once deployed
echo ""
echo "⚠️  After deploying frontend, update backend CORS:"
echo "heroku config:set FRONTEND_URL=https://your-frontend-url.vercel.app"

# Create a deployment info file
cat > ../deployment-info.txt << EOF
WealthWise Deployment Information
=================================

Backend URL: $BACKEND_URL
Backend App Name: $APP_NAME

Environment Variables Set:
- NODE_ENV=production
- JWT_SECRET=(generated)
- MONGO_URI=(your MongoDB URI)

Frontend Environment Variables:
- REACT_APP_API_URL=$BACKEND_URL/api
- REACT_APP_WS_URL=wss://${APP_NAME}.herokuapp.com

Remember to update FRONTEND_URL in backend after frontend deployment!

Useful Commands:
- View logs: heroku logs --tail
- Open app: heroku open
- Check status: heroku ps
- Restart: heroku restart
EOF

echo ""
echo "📄 Deployment information saved to deployment-info.txt"