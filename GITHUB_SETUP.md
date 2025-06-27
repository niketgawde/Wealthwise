# GitHub Setup Instructions

## 1. Create a New GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the "+" icon in the top right → "New repository"
3. Name it: `wealthwise-mvp`
4. Make it **Private** or **Public** (your choice)
5. **DON'T** initialize with README, .gitignore, or license
6. Click "Create repository"

## 2. Connect Your Local Repository

After creating the repository, GitHub will show you commands. Use these:

```bash
git remote add origin https://github.com/YOUR_USERNAME/wealthwise-mvp.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## 3. If You Get Authentication Errors

GitHub now requires personal access tokens instead of passwords:

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with "repo" permissions
3. Use this token as your password when pushing

## Alternative: Use GitHub CLI

```bash
# Install GitHub CLI if you haven't
brew install gh

# Login to GitHub
gh auth login

# Create repo and push
gh repo create wealthwise-mvp --private --source=. --remote=origin --push
```

## Need Help?

Let me know if you encounter any issues!