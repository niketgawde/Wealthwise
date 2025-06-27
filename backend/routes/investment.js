const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Asset = require('../models/Asset');
const Transaction = require('../models/Transaction');
const Portfolio = require('../models/Portfolio');
const User = require('../models/User');

router.get('/assets', authMiddleware, async (req, res) => {
  try {
    const { type, search, limit = 20 } = req.query;
    
    const { Op } = require('sequelize');
    const where = {};
    if (type) where.type = type;
    if (search) {
      where[Op.or] = [
        { symbol: { [Op.like]: `%${search}%` } },
        { name: { [Op.like]: `%${search}%` } }
      ];
    }

    const assets = await Asset.findAll({ 
      where, 
      limit: parseInt(limit)
    });
    res.json(assets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/assets/:symbol', authMiddleware, async (req, res) => {
  try {
    const asset = await Asset.findOne({ symbol: req.params.symbol.toUpperCase() });
    
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    res.json(asset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/buy', authMiddleware, async (req, res) => {
  try {
    const { symbol, assetType, quantity, price } = req.body;

    const asset = await Asset.findOne({ symbol: symbol.toUpperCase() });
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    const totalCost = quantity * price;
    const user = await User.findById(req.userId);
    
    if (user.totalBalance < totalCost) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const transaction = new Transaction({
      userId: req.userId,
      type: 'buy',
      category: 'Investment',
      amount: totalCost,
      description: `Bought ${quantity} ${symbol}`,
      assetType,
      symbol: symbol.toUpperCase(),
      quantity,
      price,
      status: 'completed'
    });

    await transaction.save();

    user.totalBalance -= totalCost;
    await user.save();

    // Update portfolio directly
    let portfolio = await Portfolio.findOne({ userId: req.userId });
    
    if (!portfolio) {
      portfolio = new Portfolio({ userId: req.userId });
    }

    const existingHoldingIndex = portfolio.holdings.findIndex(
      h => h.symbol === symbol.toUpperCase() && h.assetType === assetType
    );

    if (existingHoldingIndex >= 0) {
      const holding = portfolio.holdings[existingHoldingIndex];
      const totalQuantity = holding.quantity + quantity;
      const totalInvested = holding.totalInvested + (quantity * price);
      
      holding.quantity = totalQuantity;
      holding.averagePrice = totalInvested / totalQuantity;
      holding.totalInvested = totalInvested;
      holding.currentValue = totalQuantity * price;
      holding.currentPrice = price;
      holding.profitLoss = holding.currentValue - holding.totalInvested;
      holding.profitLossPercentage = ((holding.profitLoss / holding.totalInvested) * 100).toFixed(2);
    } else {
      const newHolding = {
        assetType,
        symbol: symbol.toUpperCase(),
        name: asset.name,
        quantity,
        averagePrice: price,
        currentPrice: price,
        totalInvested: quantity * price,
        currentValue: quantity * price,
        profitLoss: 0,
        profitLossPercentage: 0
      };
      
      portfolio.holdings.push(newHolding);
    }

    portfolio.calculateTotals();
    await portfolio.save();

    res.json({
      message: 'Purchase successful',
      transaction,
      remainingBalance: user.totalBalance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/sell', authMiddleware, async (req, res) => {
  try {
    const { symbol, assetType, quantity, price } = req.body;

    const portfolio = await Portfolio.findOne({ userId: req.userId });
    const holding = portfolio?.holdings.find(
      h => h.symbol === symbol.toUpperCase() && h.assetType === assetType
    );

    if (!holding || holding.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient holdings' });
    }

    const totalValue = quantity * price;

    const transaction = new Transaction({
      userId: req.userId,
      type: 'sell',
      category: 'Investment',
      amount: totalValue,
      description: `Sold ${quantity} ${symbol}`,
      assetType,
      symbol: symbol.toUpperCase(),
      quantity,
      price,
      status: 'completed'
    });

    await transaction.save();

    const user = await User.findById(req.userId);
    user.totalBalance += totalValue;
    await user.save();

    if (holding.quantity === quantity) {
      portfolio.holdings = portfolio.holdings.filter(
        h => !(h.symbol === symbol.toUpperCase() && h.assetType === assetType)
      );
    } else {
      holding.quantity -= quantity;
      holding.currentValue = holding.quantity * holding.currentPrice;
      holding.profitLoss = holding.currentValue - (holding.quantity * holding.averagePrice);
      holding.profitLossPercentage = ((holding.profitLoss / (holding.quantity * holding.averagePrice)) * 100).toFixed(2);
    }

    portfolio.calculateTotals();
    await portfolio.save();

    res.json({
      message: 'Sale successful',
      transaction,
      remainingBalance: user.totalBalance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;