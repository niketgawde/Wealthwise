# Complete Railway Deployment Guide for WealthWise

## Prerequisites
- GitHub account with your code pushed
- Railway account (free to create)

## Step-by-Step Deployment Process

### 1. Push Your Code to GitHub

First, create a GitHub repository and push your code:

```bash
# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/wealthwise-mvp.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 2. Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Click "Login" → "Login with GitHub"
3. Authorize Railway to access your GitHub

### 3. Create New Project

1. Click "New Project" button
2. Select "Deploy from GitHub repo"
3. Search for "wealthwise-mvp"
4. Click on your repository

### 4. Configure Services

Railway will automatically detect your monorepo structure. You'll see:
- 🔧 Backend service detected
- 🎨 Frontend service detected

### 5. Deploy Backend First

1. Click on the **Backend** service
2. Go to "Variables" tab
3. Add these environment variables:

```
NODE_ENV=production
PORT=5001
JWT_SECRET=your-super-secret-key-here-change-this
FRONTEND_URL=https://wealthwise-mvp-frontend.up.railway.app
```

**Important**: Generate a secure JWT_SECRET:
```bash
# Generate a secure secret
openssl rand -base64 32
```

4. Click "Deploy"

### 6. Deploy Frontend

1. Click on the **Frontend** service
2. Go to "Variables" tab
3. Add these environment variables:

```
REACT_APP_API_URL=https://wealthwise-mvp-backend.up.railway.app/api
REACT_APP_SOCKET_URL=https://wealthwise-mvp-backend.up.railway.app
```

4. Click "Deploy"

### 7. Get Your URLs

After deployment, Railway provides URLs:
- Backend: `wealthwise-mvp-backend.up.railway.app`
- Frontend: `wealthwise-mvp-frontend.up.railway.app`

### 8. Update CORS Settings

1. Go back to Backend service → Variables
2. Update `FRONTEND_URL` with your actual frontend URL
3. Redeploy backend

### 9. Verify Deployment

1. Visit your frontend URL
2. You should see the WealthWise login page
3. Login with demo credentials:
   - Email: `demo@wealthwise.com`
   - Password: `demo123`

## Troubleshooting

### Build Failures

If frontend fails to build:
```
# Add to frontend variables
CI=false
```

### Database Issues

SQLite database persists automatically in Railway's volume.

### CORS Errors

Double-check that:
- `FRONTEND_URL` in backend matches your frontend URL exactly
- Include `https://` protocol

### Port Issues

Railway automatically assigns ports. Don't hardcode ports in your app.

## Monitoring

1. Click on any service to see:
   - Deployment logs
   - Build logs
   - Runtime logs

2. Use "Metrics" tab to monitor:
   - CPU usage
   - Memory usage
   - Network traffic

## Custom Domain (Optional)

1. Go to service Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

## Costs

- $5 free credits (enough for ~1 month)
- After credits: ~$5-7/month for both services
- Pay only for usage (CPU, memory, network)

## Next Steps

1. Set up GitHub Actions for automatic deployments
2. Configure monitoring alerts
3. Set up backup strategy for SQLite

## Need Help?

- Railway Discord: [discord.gg/railway](https://discord.gg/railway)
- Railway Docs: [docs.railway.app](https://docs.railway.app)
- Common issues: Check deployment logs first!