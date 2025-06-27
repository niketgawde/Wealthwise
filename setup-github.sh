#!/bin/bash

echo "==================================="
echo "GitHub Repository Setup for WealthWise"
echo "==================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Create GitHub Repository${NC}"
echo "1. Go to https://github.com/new"
echo "2. Repository name: wealthwise-mvp"
echo "3. Set as Private or Public (your choice)"
echo "4. DON'T initialize with README"
echo "5. Click 'Create repository'"
echo ""
echo "Press Enter when you've created the repository..."
read

echo -e "${YELLOW}Step 2: Enter your GitHub username${NC}"
read -p "GitHub username: " GITHUB_USERNAME

echo ""
echo -e "${GREEN}Step 3: Run these commands:${NC}"
echo ""
echo "git remote add origin https://github.com/$GITHUB_USERNAME/wealthwise-mvp.git"
echo "git branch -M main"
echo "git push -u origin main"
echo ""
echo -e "${YELLOW}Copy and run the commands above.${NC}"
echo ""
echo "If asked for password, use a Personal Access Token:"
echo "1. Go to GitHub → Settings → Developer settings"
echo "2. Personal access tokens → Tokens (classic)"
echo "3. Generate new token with 'repo' scope"
echo "4. Use the token as your password"