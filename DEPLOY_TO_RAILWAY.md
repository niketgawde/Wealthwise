# Deploy WealthWise to Railway

## Quick Deploy Steps

### 1. Create Railway Account
- Go to [railway.app](https://railway.app)
- Sign up with GitHub

### 2. Create New Project
- Click "New Project"
- Select "Deploy from GitHub repo"
- Connect your repository

### 3. Configure Services
Railway will automatically detect both frontend and backend services.

### 4. Set Environment Variables
In the Railway dashboard, set these for the **backend** service:

```
NODE_ENV=production
PORT=5001
JWT_SECRET=<generate-a-secure-random-string>
FRONTEND_URL=<your-frontend-railway-url>
```

For the **frontend** service:
```
REACT_APP_API_URL=<your-backend-railway-url>
```

### 5. Deploy
- Click "Deploy" 
- Railway will build and deploy both services
- You'll get URLs like:
  - Frontend: `wealthwise-frontend.up.railway.app`
  - Backend: `wealthwise-backend.up.railway.app`

### 6. Update CORS
After deployment, update your backend environment variable:
```
FRONTEND_URL=https://wealthwise-frontend.up.railway.app
```

## Important Notes

1. **Database**: SQLite database will persist in Railway's volume
2. **Seed Data**: First deployment will automatically seed demo data
3. **Demo Credentials**: 
   - Email: `demo@wealthwise.com`
   - Password: `demo123`

## Costs
- Free $5 credits to start
- Estimated monthly cost: $5-7 for both services

## Alternative: Single Service Deployment

If you prefer everything in one service, Railway can also deploy this as a monorepo with both frontend and backend together.

## Support
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)
- Railway Docs: [docs.railway.app](https://docs.railway.app)