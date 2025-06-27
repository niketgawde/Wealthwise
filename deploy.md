# WealthWise Deployment Guide

This guide will help you deploy the WealthWise application to production.

## Deployment Options

### Option 1: Deploy to Heroku (Recommended for Quick Start)

#### Prerequisites
- Heroku account (free tier available)
- Heroku CLI installed
- Git repository

#### Backend Deployment (Heroku)

1. **Install Heroku CLI**
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # or download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Backend App**
   ```bash
   cd backend
   heroku create wealthwise-api
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-super-secret-jwt-key-change-this
   heroku config:set FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

5. **Add MongoDB (MongoDB Atlas)**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create a free cluster
   - Get your connection string
   - Set it in Heroku:
   ```bash
   heroku config:set MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/wealthwise?retryWrites=true&w=majority"
   ```

6. **Deploy Backend**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push heroku main
   ```

#### Frontend Deployment (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy Frontend**
   ```bash
   cd frontend
   vercel
   ```

3. **Set Environment Variables in Vercel Dashboard**
   - Go to your project settings
   - Add: `REACT_APP_API_URL=https://wealthwise-api.herokuapp.com/api`

### Option 2: Deploy to AWS (Production Ready)

#### Using AWS Elastic Beanstalk for Backend

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize EB**
   ```bash
   cd backend
   eb init -p node.js-18 wealthwise-api
   ```

3. **Create Environment**
   ```bash
   eb create wealthwise-prod
   ```

4. **Set Environment Variables**
   ```bash
   eb setenv NODE_ENV=production JWT_SECRET=your-secret MONGO_URI=your-mongodb-uri
   ```

5. **Deploy**
   ```bash
   eb deploy
   ```

#### Using AWS S3 + CloudFront for Frontend

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://wealthwise-frontend
   aws s3 website s3://wealthwise-frontend --index-document index.html --error-document error.html
   ```

3. **Upload Build Files**
   ```bash
   aws s3 sync build/ s3://wealthwise-frontend --acl public-read
   ```

4. **Setup CloudFront** (for HTTPS and CDN)
   - Create distribution in AWS Console
   - Point to S3 bucket
   - Enable compression
   - Add custom SSL certificate

### Option 3: Deploy to DigitalOcean

#### Using App Platform

1. **Connect GitHub Repository**
   - Go to DigitalOcean App Platform
   - Connect your GitHub repo

2. **Configure Components**
   - Add backend as Web Service
   - Add frontend as Static Site
   - Add MongoDB as Managed Database

3. **Set Environment Variables**
   - Configure all env vars in the UI

4. **Deploy**
   - Click Deploy

### Option 4: Docker Deployment

#### Create Docker Images

1. **Backend Dockerfile**
   ```dockerfile
   # backend/Dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   EXPOSE 5001
   CMD ["node", "server.js"]
   ```

2. **Frontend Dockerfile**
   ```dockerfile
   # frontend/Dockerfile
   FROM node:18-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=build /app/build /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

3. **Docker Compose**
   ```yaml
   # docker-compose.yml
   version: '3.8'
   services:
     backend:
       build: ./backend
       ports:
         - "5001:5001"
       environment:
         - NODE_ENV=production
         - MONGO_URI=${MONGO_URI}
         - JWT_SECRET=${JWT_SECRET}
       depends_on:
         - mongo
     
     frontend:
       build: ./frontend
       ports:
         - "80:80"
       depends_on:
         - backend
     
     mongo:
       image: mongo:6
       volumes:
         - mongo-data:/data/db
       environment:
         - MONGO_INITDB_ROOT_USERNAME=admin
         - MONGO_INITDB_ROOT_PASSWORD=password

   volumes:
     mongo-data:
   ```

## Production Checklist

### Security
- [ ] Change all default passwords
- [ ] Use strong JWT secret
- [ ] Enable CORS properly
- [ ] Add rate limiting
- [ ] Implement helmet.js
- [ ] Enable HTTPS/SSL
- [ ] Add input validation
- [ ] Sanitize user inputs

### Performance
- [ ] Enable gzip compression
- [ ] Implement caching
- [ ] Optimize images
- [ ] Minify CSS/JS
- [ ] Use CDN for static assets
- [ ] Add database indexes

### Monitoring
- [ ] Setup error tracking (Sentry)
- [ ] Add performance monitoring
- [ ] Configure logging
- [ ] Setup uptime monitoring
- [ ] Add health check endpoints

### Database
- [ ] Enable backups
- [ ] Setup replica sets
- [ ] Configure connection pooling
- [ ] Add database monitoring

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=production
PORT=5001
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/wealthwise?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=https://your-frontend-domain.com
```

#### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
REACT_APP_WS_URL=wss://your-backend-domain.com
```

## SSL/HTTPS Setup

### Using Let's Encrypt (Free SSL)

1. **For Nginx**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

2. **For Node.js directly**
   ```javascript
   // Use greenlock-express
   npm install greenlock-express
   ```

### Using Cloudflare (Recommended)
1. Add your domain to Cloudflare
2. Update nameservers
3. Enable "Full SSL/TLS"
4. Enable "Always Use HTTPS"

## Post-Deployment Steps

1. **Test all features**
   - User registration/login
   - Portfolio management
   - Real-time updates
   - AI recommendations

2. **Setup monitoring**
   ```bash
   # Install PM2 for process management
   npm install -g pm2
   pm2 start server.js
   pm2 save
   pm2 startup
   ```

3. **Configure backups**
   - Database backups
   - Code backups
   - Environment variable backups

4. **Setup CI/CD**
   - GitHub Actions
   - GitLab CI
   - Jenkins

## Troubleshooting

### Common Issues

1. **WebSocket connection fails**
   - Ensure WSS protocol for HTTPS
   - Configure reverse proxy properly
   - Check CORS settings

2. **MongoDB connection issues**
   - Whitelist server IPs
   - Check connection string
   - Verify network access

3. **Environment variables not loading**
   - Check .env file location
   - Verify variable names
   - Restart application

4. **CORS errors**
   - Update allowed origins
   - Check headers
   - Verify credentials setting

## Scaling Considerations

1. **Horizontal Scaling**
   - Use load balancer
   - Implement sticky sessions for WebSocket
   - Use Redis for session storage

2. **Database Scaling**
   - Implement sharding
   - Use read replicas
   - Add caching layer

3. **CDN Setup**
   - CloudFlare
   - AWS CloudFront
   - Fastly

## Cost Optimization

1. **Free Tier Options**
   - Heroku: 550-1000 dyno hours/month
   - MongoDB Atlas: 512MB storage
   - Vercel: Unlimited deployments
   - Cloudflare: Free SSL and CDN

2. **Paid Options (Estimated Monthly)**
   - Small: $20-50/month
   - Medium: $100-300/month
   - Large: $500+/month

## Support

For deployment issues:
1. Check logs: `heroku logs --tail`
2. Monitor performance
3. Review error tracking
4. Check GitHub issues

Remember to always test in a staging environment before deploying to production!