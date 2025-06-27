#!/bin/bash

echo "=========================================="
echo "🚀 WealthWise Auto-Deploy Setup"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}This script will help you set up automatic deployments for WealthWise${NC}"
echo ""

# Step 1: Render Setup
echo -e "${YELLOW}📋 Step 1: Deploy Backend to Render${NC}"
echo "1. Go to https://render.com"
echo "2. Sign up/login with GitHub"
echo "3. Click 'New +' → 'Web Service'"
echo "4. Select your 'Wealthwise' repository"
echo "5. Configure:"
echo "   - Name: wealthwise-backend"
echo "   - Root Directory: backend"
echo "   - Build Command: npm install"
echo "   - Start Command: npm run deploy"
echo "   - Auto-Deploy: YES ✅"
echo ""
echo "6. Environment Variables:"
echo "   NODE_ENV=production"
echo "   PORT=5001"
echo "   JWT_SECRET=xWQi6UnCq4wpIHTOTLGrsAzkQ48TMtdPUv49NNRQ39I="
echo "   FRONTEND_URL=https://wealthwise-frontend.vercel.app"
echo ""
echo "Press Enter when backend is deployed..."
read

# Get backend URL
echo -e "${YELLOW}🔗 What's your Render backend URL?${NC}"
read -p "Enter backend URL (e.g., https://wealthwise-backend.onrender.com): " BACKEND_URL

# Step 2: Vercel Setup
echo ""
echo -e "${YELLOW}📋 Step 2: Deploy Frontend to Vercel${NC}"
echo "1. Go to https://vercel.com"
echo "2. Sign up/login with GitHub"
echo "3. Click 'Add New...' → 'Project'"
echo "4. Import 'niketgawde/Wealthwise'"
echo "5. Configure:"
echo "   - Root Directory: frontend"
echo "   - Framework: Create React App"
echo "   - Auto-Deploy: YES ✅"
echo ""
echo "6. Environment Variables:"
echo "   REACT_APP_API_URL=${BACKEND_URL}/api"
echo "   REACT_APP_SOCKET_URL=${BACKEND_URL}"
echo "   CI=false"
echo ""
echo "Press Enter when frontend is deployed..."
read

# Get frontend URL
echo -e "${YELLOW}🔗 What's your Vercel frontend URL?${NC}"
read -p "Enter frontend URL (e.g., https://wealthwise-frontend.vercel.app): " FRONTEND_URL

# Step 3: Update CORS
echo ""
echo -e "${YELLOW}📋 Step 3: Update Backend CORS${NC}"
echo "1. Go back to Render dashboard"
echo "2. Click on your backend service"
echo "3. Go to Environment tab"
echo "4. Update FRONTEND_URL to: ${FRONTEND_URL}"
echo "5. Click 'Manual Deploy' → 'Deploy latest commit'"
echo ""
echo "Press Enter when CORS is updated..."
read

# Step 4: Test Auto-Deploy
echo ""
echo -e "${YELLOW}📋 Step 4: Test Automatic Deployment${NC}"
echo "Let's test the auto-deploy by making a small change..."

# Create a test commit
echo "# Auto-deploy test - $(date)" >> test-deploy.md
git add test-deploy.md
git commit -m "test: verify automatic deployment workflow"

echo "Pushing test commit..."
git push origin main

echo ""
echo -e "${GREEN}✅ Auto-Deploy Setup Complete!${NC}"
echo ""
echo -e "${BLUE}🎯 Your WealthWise App:${NC}"
echo "Frontend: ${FRONTEND_URL}"
echo "Backend:  ${BACKEND_URL}"
echo "API:      ${BACKEND_URL}/api"
echo ""
echo -e "${GREEN}🔄 Automatic Deployments Enabled:${NC}"
echo "✅ Every push to 'main' branch will auto-deploy"
echo "✅ GitHub Actions will run tests first"
echo "✅ Render will auto-deploy backend"
echo "✅ Vercel will auto-deploy frontend"
echo ""
echo -e "${YELLOW}💡 What happens on each push:${NC}"
echo "1. GitHub Actions runs tests"
echo "2. If tests pass, deploys are triggered"
echo "3. Render rebuilds and deploys backend (~2-3 mins)"
echo "4. Vercel rebuilds and deploys frontend (~1-2 mins)"
echo "5. Your app is automatically updated!"
echo ""
echo -e "${BLUE}🧪 Test your app:${NC}"
echo "Login with: demo@wealthwise.com / demo123"
echo ""
echo -e "${GREEN}🎉 Happy coding! Your app will now auto-deploy on every commit.${NC}"