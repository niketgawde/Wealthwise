const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const { sequelize } = require('./models');
const fs = require('fs');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// Health check endpoint (before other routes)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'WealthWise API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api/*'
    }
  });
});

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const portfolioRoutes = require('./routes/portfolio');
const transactionRoutes = require('./routes/transaction');
const investmentRoutes = require('./routes/investment');
const marketDataRoutes = require('./routes/marketData');
const recommendationsRoutes = require('./routes/recommendations');

// Database connection (no sync since we have seeded data)
sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/market-data', marketDataRoutes);
app.use('/api/recommendations', recommendationsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'WealthWise API is running' });
});

// Initialize market data service
const marketDataService = require('./services/marketDataService');
marketDataService.initialize(io);

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join user-specific room for portfolio updates
  socket.on('join-portfolio', (userId) => {
    socket.join(`portfolio-${userId}`);
    console.log(`Client ${socket.id} joined portfolio room for user ${userId}`);
  });

  // Subscribe to specific asset price updates
  socket.on('subscribe-asset', (symbol) => {
    socket.join(`asset-${symbol}`);
    console.log(`Client ${socket.id} subscribed to ${symbol}`);
  });

  // Unsubscribe from asset updates
  socket.on('unsubscribe-asset', (symbol) => {
    socket.leave(`asset-${symbol}`);
    console.log(`Client ${socket.id} unsubscribed from ${symbol}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});