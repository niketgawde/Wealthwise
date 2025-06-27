#!/bin/bash

# GitHub Push Commands for WealthWise MVP
# Replace YOUR_USERNAME with your actual GitHub username

echo "🚀 Pushing WealthWise to GitHub..."

# Add remote origin (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/wealthwise-mvp.git

# Rename branch to main
git branch -M main

# Push all code
git push -u origin main

echo "✅ Code pushed to GitHub successfully!"
echo "📋 Next: Deploy backend to Heroku"