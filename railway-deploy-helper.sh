#!/bin/bash

echo "========================================"
echo "Railway Deployment Helper for WealthWise"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Generate secure JWT secret
JWT_SECRET=$(openssl rand -base64 32)

echo -e "${GREEN}Your deployment information:${NC}"
echo ""
echo -e "${BLUE}GitHub Repository:${NC}"
echo "https://github.com/niketgawde/Wealthwise"
echo ""

echo -e "${BLUE}Backend Environment Variables:${NC}"
echo "Copy these when Railway asks:"
echo "----------------------------------------"
echo "NODE_ENV=production"
echo "PORT=5001"
echo "JWT_SECRET=$JWT_SECRET"
echo "FRONTEND_URL=https://your-frontend.railway.app"
echo "----------------------------------------"
echo ""

echo -e "${BLUE}Frontend Environment Variables:${NC}"
echo "Copy these when Railway asks:"
echo "----------------------------------------"
echo "REACT_APP_API_URL=https://your-backend.railway.app/api"
echo "REACT_APP_SOCKET_URL=https://your-backend.railway.app"
echo "CI=false"
echo "----------------------------------------"
echo ""

# Save environment variables for reference
cat > railway-env-vars.txt << EOF
BACKEND ENVIRONMENT VARIABLES:
NODE_ENV=production
PORT=5001
JWT_SECRET=$JWT_SECRET
FRONTEND_URL=https://your-frontend.railway.app

FRONTEND ENVIRONMENT VARIABLES:
REACT_APP_API_URL=https://your-backend.railway.app/api
REACT_APP_SOCKET_URL=https://your-backend.railway.app
CI=false

DEMO CREDENTIALS:
Email: demo@wealthwise.com
Password: demo123
EOF

echo -e "${GREEN}Environment variables saved to: railway-env-vars.txt${NC}"
echo ""

echo -e "${YELLOW}Opening Railway in your browser...${NC}"
echo ""
echo "Follow these steps:"
echo "1. Login with GitHub"
echo "2. Click 'New Project'"
echo "3. Select 'Deploy from GitHub repo'"
echo "4. Choose 'Wealthwise' repository"
echo "5. Configure both services with the environment variables above"
echo ""

# Try to open Railway
if command -v open &> /dev/null; then
    open "https://railway.app/new"
elif command -v xdg-open &> /dev/null; then
    xdg-open "https://railway.app/new"
else
    echo "Please open https://railway.app/new in your browser"
fi

echo ""
echo -e "${YELLOW}Deployment Checklist:${NC}"
echo "[ ] Login to Railway with GitHub"
echo "[ ] Create new project from GitHub repo"
echo "[ ] Select 'Wealthwise' repository"
echo "[ ] Configure Backend service variables"
echo "[ ] Configure Frontend service variables"
echo "[ ] Deploy both services"
echo "[ ] Update FRONTEND_URL in backend with actual URL"
echo "[ ] Test with demo credentials"
echo ""
echo "Press Enter to see real-time deployment tips..."
read

echo ""
echo -e "${GREEN}Deployment Tips:${NC}"
echo "1. Railway auto-detects Node.js apps"
echo "2. Backend will use SQLite (persists in volume)"
echo "3. Frontend builds with 'npm run build'"
echo "4. Both get HTTPS automatically"
echo "5. First deploy seeds demo data"
echo ""
echo -e "${YELLOW}After deployment completes:${NC}"
echo "- Backend URL: https://[your-app]-backend.railway.app"
echo "- Frontend URL: https://[your-app]-frontend.railway.app"
echo "- Update FRONTEND_URL in backend settings"
echo "- Test login with demo@wealthwise.com / demo123"