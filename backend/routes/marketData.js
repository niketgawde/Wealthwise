const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const marketDataService = require('../services/marketDataService');
const Asset = require('../models/Asset');

// Get market overview (top movers, market stats)
router.get('/overview', async (req, res) => {
  try {
    // Get top gainers
    const topGainers = await Asset.find({ dayChangePercentage: { $gt: 0 } })
      .sort({ dayChangePercentage: -1 })
      .limit(5);

    // Get top losers
    const topLosers = await Asset.find({ dayChangePercentage: { $lt: 0 } })
      .sort({ dayChangePercentage: 1 })
      .limit(5);

    // Get most active (by volume)
    const mostActive = await Asset.find({})
      .sort({ volume: -1 })
      .limit(5);

    res.json({
      topGainers,
      topLosers,
      mostActive,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get live prices for multiple assets
router.post('/prices', authMiddleware, async (req, res) => {
  try {
    const { symbols } = req.body;
    
    if (!symbols || !Array.isArray(symbols)) {
      return res.status(400).json({ error: 'Symbols array required' });
    }

    const marketData = await marketDataService.getMarketData(symbols);
    res.json(marketData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get price history for charting
router.get('/history/:symbol', authMiddleware, async (req, res) => {
  try {
    const { symbol } = req.params;
    const { period = '1d' } = req.query;
    
    // In production, this would fetch from a time-series database
    // For demo, we'll generate sample data
    const asset = await Asset.findOne({ symbol: symbol.toUpperCase() });
    
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    // Generate sample price history
    const history = generatePriceHistory(asset.currentPrice, period);
    
    res.json({
      symbol: asset.symbol,
      name: asset.name,
      history,
      period
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Helper function to generate sample price history
function generatePriceHistory(currentPrice, period) {
  const points = {
    '1d': 24,  // hourly
    '1w': 7,   // daily
    '1m': 30,  // daily
    '3m': 90,  // daily
    '1y': 52   // weekly
  };

  const dataPoints = points[period] || 24;
  const history = [];
  let price = currentPrice;

  for (let i = dataPoints; i >= 0; i--) {
    // Random walk with slight upward bias
    const change = (Math.random() - 0.48) * (currentPrice * 0.02);
    price = Math.max(price + change, currentPrice * 0.8); // Prevent unrealistic drops
    
    history.push({
      timestamp: new Date(Date.now() - (i * 3600000)), // 1 hour intervals for demo
      price: Math.round(price * 100) / 100,
      volume: Math.floor(Math.random() * 1000000)
    });
  }

  return history;
}

module.exports = router;