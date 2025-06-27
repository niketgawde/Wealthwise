#!/bin/bash

echo "========================================"
echo "WealthWise Automated Deployment Script"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Step 1: GitHub Authentication
echo -e "${YELLOW}Step 1: GitHub Authentication${NC}"
echo "Checking GitHub CLI authentication..."

if ! gh auth status &>/dev/null; then
    echo -e "${RED}Not authenticated with GitHub${NC}"
    echo "Running: gh auth login"
    echo ""
    echo "Please follow the prompts:"
    echo "1. Choose 'GitHub.com'"
    echo "2. Choose 'HTTPS'"
    echo "3. Authenticate with your browser"
    echo ""
    gh auth login
else
    echo -e "${GREEN}Already authenticated with GitHub${NC}"
fi

# Step 2: Create GitHub Repository
echo ""
echo -e "${YELLOW}Step 2: Creating GitHub Repository${NC}"
echo "Creating repository 'wealthwise-mvp'..."

if gh repo create wealthwise-mvp --private --source=. --remote=origin --push; then
    echo -e "${GREEN}Repository created and code pushed successfully!${NC}"
else
    echo -e "${YELLOW}Repository might already exist. Trying to set remote...${NC}"
    read -p "Enter your GitHub username: " GITHUB_USERNAME
    git remote add origin "https://github.com/$GITHUB_USERNAME/wealthwise-mvp.git" 2>/dev/null || git remote set-url origin "https://github.com/$GITHUB_USERNAME/wealthwise-mvp.git"
    git push -u origin main
fi

# Step 3: Get Repository URL
REPO_URL=$(gh repo view --json url -q .url)
echo ""
echo -e "${GREEN}GitHub repository URL: $REPO_URL${NC}"

# Step 4: Railway Deployment Instructions
echo ""
echo -e "${YELLOW}Step 3: Deploy to Railway${NC}"
echo "========================================"
echo ""
echo "Now you need to:"
echo ""
echo "1. Go to https://railway.app"
echo "2. Click 'Login with GitHub'"
echo "3. Click 'New Project' → 'Deploy from GitHub repo'"
echo "4. Select 'wealthwise-mvp' repository"
echo ""
echo -e "${YELLOW}Environment Variables for Backend:${NC}"
echo "NODE_ENV=production"
echo "PORT=5001"
echo "JWT_SECRET=$(openssl rand -base64 32)"
echo "FRONTEND_URL=https://your-frontend.railway.app"
echo ""
echo -e "${YELLOW}Environment Variables for Frontend:${NC}"
echo "REACT_APP_API_URL=https://your-backend.railway.app/api"
echo "REACT_APP_SOCKET_URL=https://your-backend.railway.app"
echo "CI=false"
echo ""
echo -e "${GREEN}Your repository is ready at: $REPO_URL${NC}"
echo ""
echo "Press Enter to open Railway in your browser..."
read
open "https://railway.app"