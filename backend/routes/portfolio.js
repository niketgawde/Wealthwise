const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { Portfolio, Holding, Asset } = require('../models');

router.get('/', authMiddleware, async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({ 
      where: { userId: req.userId },
      include: [{
        model: Holding,
        as: 'Holdings'
      }]
    });
    
    if (!portfolio) {
      portfolio = await Portfolio.create({ userId: req.userId });
      portfolio = await Portfolio.findOne({ 
        where: { userId: req.userId },
        include: [{
          model: Holding,
          as: 'Holdings'
        }]
      });
    }

    // Transform the response to match frontend expectations
    const response = {
      _id: portfolio.id.toString(),
      userId: portfolio.userId,
      holdings: portfolio.Holdings || [],
      totalInvested: portfolio.totalInvested,
      currentValue: portfolio.currentValue,
      totalProfitLoss: portfolio.totalProfitLoss,
      totalProfitLossPercentage: portfolio.totalProfitLossPercentage,
      assetAllocation: portfolio.assetAllocation,
      lastUpdated: portfolio.lastUpdated
    };
    
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/add-holding', authMiddleware, async (req, res) => {
  try {
    const { assetType, symbol, name, quantity, price } = req.body;

    if (!assetType || !symbol || !name || !quantity || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let portfolio = await Portfolio.findOne({ where: { userId: req.userId } });
    
    if (!portfolio) {
      portfolio = await Portfolio.create({ userId: req.userId });
    }

    // Check if holding already exists
    let holding = await Holding.findOne({
      where: {
        portfolioId: portfolio.id,
        symbol: symbol,
        assetType: assetType
      }
    });

    if (holding) {
      // Update existing holding
      const totalQuantity = parseFloat(holding.quantity) + parseFloat(quantity);
      const totalInvested = parseFloat(holding.totalInvested) + (parseFloat(quantity) * parseFloat(price));
      
      holding.quantity = totalQuantity;
      holding.averagePrice = totalInvested / totalQuantity;
      holding.totalInvested = totalInvested;
      holding.currentValue = totalQuantity * parseFloat(price);
      holding.currentPrice = price;
      holding.profitLoss = holding.currentValue - holding.totalInvested;
      holding.profitLossPercentage = ((holding.profitLoss / holding.totalInvested) * 100).toFixed(2);
      
      await holding.save();
    } else {
      // Create new holding
      holding = await Holding.create({
        portfolioId: portfolio.id,
        assetType,
        symbol,
        name,
        quantity,
        averagePrice: price,
        currentPrice: price,
        totalInvested: parseFloat(quantity) * parseFloat(price),
        currentValue: parseFloat(quantity) * parseFloat(price),
        profitLoss: 0,
        profitLossPercentage: 0
      });
    }

    // Update portfolio totals
    await portfolio.calculateTotals();

    // Fetch updated portfolio with holdings
    const updatedPortfolio = await Portfolio.findOne({ 
      where: { userId: req.userId },
      include: [{
        model: Holding,
        as: 'Holdings'
      }]
    });

    // Transform the response to match frontend expectations
    const response = {
      _id: updatedPortfolio.id.toString(),
      userId: updatedPortfolio.userId,
      holdings: updatedPortfolio.Holdings || [],
      totalInvested: updatedPortfolio.totalInvested,
      currentValue: updatedPortfolio.currentValue,
      totalProfitLoss: updatedPortfolio.totalProfitLoss,
      totalProfitLossPercentage: updatedPortfolio.totalProfitLossPercentage,
      assetAllocation: updatedPortfolio.assetAllocation,
      lastUpdated: updatedPortfolio.lastUpdated
    };
    
    res.json({ message: 'Holding added successfully', portfolio: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/update-prices', authMiddleware, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ 
      where: { userId: req.userId },
      include: [{
        model: Holding,
        as: 'Holdings'
      }]
    });
    
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    // Update prices for all holdings
    for (const holding of portfolio.Holdings) {
      const asset = await Asset.findOne({ where: { symbol: holding.symbol } });
      if (asset) {
        holding.currentPrice = asset.currentPrice;
        holding.currentValue = parseFloat(holding.quantity) * parseFloat(asset.currentPrice);
        holding.profitLoss = holding.currentValue - parseFloat(holding.totalInvested);
        holding.profitLossPercentage = ((holding.profitLoss / parseFloat(holding.totalInvested)) * 100).toFixed(2);
        await holding.save();
      }
    }

    // Update portfolio totals
    await portfolio.calculateTotals();

    // Fetch updated portfolio with holdings
    const updatedPortfolio = await Portfolio.findOne({ 
      where: { userId: req.userId },
      include: [{
        model: Holding,
        as: 'Holdings'
      }]
    });

    // Transform the response to match frontend expectations
    const response = {
      _id: updatedPortfolio.id.toString(),
      userId: updatedPortfolio.userId,
      holdings: updatedPortfolio.Holdings || [],
      totalInvested: updatedPortfolio.totalInvested,
      currentValue: updatedPortfolio.currentValue,
      totalProfitLoss: updatedPortfolio.totalProfitLoss,
      totalProfitLossPercentage: updatedPortfolio.totalProfitLossPercentage,
      assetAllocation: updatedPortfolio.assetAllocation,
      lastUpdated: updatedPortfolio.lastUpdated
    };
    
    res.json({ message: 'Prices updated successfully', portfolio: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/holding/:id', authMiddleware, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ where: { userId: req.userId } });
    
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    const holding = await Holding.findOne({
      where: {
        id: req.params.id,
        portfolioId: portfolio.id
      }
    });

    if (!holding) {
      return res.status(404).json({ error: 'Holding not found' });
    }

    await holding.destroy();
    
    // Update portfolio totals
    await portfolio.calculateTotals();

    // Fetch updated portfolio with holdings
    const updatedPortfolio = await Portfolio.findOne({ 
      where: { userId: req.userId },
      include: [{
        model: Holding,
        as: 'Holdings'
      }]
    });

    // Transform the response to match frontend expectations
    const response = {
      _id: updatedPortfolio.id.toString(),
      userId: updatedPortfolio.userId,
      holdings: updatedPortfolio.Holdings || [],
      totalInvested: updatedPortfolio.totalInvested,
      currentValue: updatedPortfolio.currentValue,
      totalProfitLoss: updatedPortfolio.totalProfitLoss,
      totalProfitLossPercentage: updatedPortfolio.totalProfitLossPercentage,
      assetAllocation: updatedPortfolio.assetAllocation,
      lastUpdated: updatedPortfolio.lastUpdated
    };
    
    res.json({ message: 'Holding removed successfully', portfolio: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;