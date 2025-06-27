# 🚀 Easy Deployment Guide for WealthWise

This guide will help you deploy WealthWise using Render (backend) and Vercel (frontend) - both have generous free tiers!

## 📋 Prerequisites
- GitHub repository: ✅ https://github.com/niketgawde/Wealthwise
- Demo credentials: `demo@wealthwise.com` / `demo123`

## 🔧 Part 1: Deploy Backend to Render

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Deploy Backend
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub account
3. Select **"Wealthwise"** repository
4. Configure:
   - **Name**: `wealthwise-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run deploy`

### Step 3: Environment Variables
Click "Advanced" and add:
```
NODE_ENV=production
PORT=5001
JWT_SECRET=xWQi6UnCq4wpIHTOTLGrsAzkQ48TMtdPUv49NNRQ39I=
FRONTEND_URL=https://wealthwise-frontend.vercel.app
```

### Step 4: Create Web Service
1. Select **Free** plan
2. Click **"Create Web Service"**
3. Wait for deployment (~5 minutes)
4. Copy your backend URL: `https://wealthwise-backend.onrender.com`

---

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub

### Step 2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Import **"niketgawde/Wealthwise"**
3. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### Step 3: Environment Variables
Add these:
```
REACT_APP_API_URL=https://wealthwise-backend.onrender.com/api
REACT_APP_SOCKET_URL=https://wealthwise-backend.onrender.com
CI=false
```

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait for build (~3 minutes)
3. Your app is live! 🎉

---

## ✅ Part 3: Final Steps

### Update Backend CORS
1. Go back to Render dashboard
2. Update `FRONTEND_URL` with your actual Vercel URL
3. Click **"Manual Deploy"** → **"Deploy latest commit"**

### Test Your App
1. Visit your Vercel URL
2. Login with: `demo@wealthwise.com` / `demo123`
3. Everything should work!

---

## 🆘 Troubleshooting

### Backend Issues
- Check Render logs: Dashboard → Logs
- Verify all environment variables are set
- Ensure PORT is 5001

### Frontend Issues  
- Check Vercel build logs
- Verify REACT_APP_API_URL points to Render backend
- Clear browser cache

### CORS Errors
- Ensure FRONTEND_URL in backend matches Vercel URL exactly
- Include https:// protocol

---

## 🎯 Your URLs

After deployment, you'll have:
- **Frontend**: `https://wealthwise-frontend.vercel.app`
- **Backend**: `https://wealthwise-backend.onrender.com`
- **API**: `https://wealthwise-backend.onrender.com/api`

---

## 💡 Tips

1. **First deploy takes longer** - Render needs to provision resources
2. **Free tier sleeps** - First request after 15 mins may be slow
3. **Custom domains** - Both platforms support custom domains for free

---

## 🚀 Alternative: One-Click Deploy

### Deploy to Render (Backend)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/niketgawde/Wealthwise)

### Deploy to Vercel (Frontend)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/niketgawde/Wealthwise&root-directory=frontend&env=REACT_APP_API_URL,REACT_APP_SOCKET_URL,CI&envDescription=Backend%20API%20URL%20from%20Render&project-name=wealthwise-frontend)

---

## 📞 Need Help?

- Render Support: [render.com/docs](https://render.com/docs)
- Vercel Support: [vercel.com/docs](https://vercel.com/docs)
- GitHub Issues: [github.com/niketgawde/Wealthwise/issues](https://github.com/niketgawde/Wealthwise/issues)