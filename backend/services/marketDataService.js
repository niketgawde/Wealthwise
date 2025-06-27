const Asset = require('../models/Asset');
const Portfolio = require('../models/Portfolio');

class MarketDataService {
  constructor() {
    this.io = null;
    this.priceUpdateInterval = null;
    this.updateFrequency = 5000; // 5 seconds for demo, would be real-time in production
  }

  initialize(io) {
    this.io = io;
    this.startPriceUpdates();
  }

  // Simulate real-time price updates (in production, this would connect to real market data APIs)
  startPriceUpdates() {
    this.priceUpdateInterval = setInterval(async () => {
      try {
        const assets = await Asset.findAll();
        
        for (const asset of assets) {
          // Simulate price fluctuation (±2% random change)
          const changePercent = (Math.random() - 0.5) * 4; // -2% to +2%
          const priceChange = asset.currentPrice * (changePercent / 100);
          
          asset.previousClose = asset.currentPrice;
          asset.currentPrice = Math.round((asset.currentPrice + priceChange) * 100) / 100;
          asset.dayChange = Math.round(priceChange * 100) / 100;
          asset.dayChangePercentage = Math.round(changePercent * 100) / 100;
          asset.lastUpdated = new Date();
          
          await asset.save();
          
          // Emit price update to all clients subscribed to this asset
          this.io.to(`asset-${asset.symbol}`).emit('price-update', {
            symbol: asset.symbol,
            currentPrice: asset.currentPrice,
            previousClose: asset.previousClose,
            dayChange: asset.dayChange,
            dayChangePercentage: asset.dayChangePercentage,
            lastUpdated: asset.lastUpdated
          });
        }
        
        // Update all portfolios with new prices
        await this.updatePortfolioPrices();
        
      } catch (error) {
        console.error('Error updating prices:', error);
      }
    }, this.updateFrequency);
  }

  async updatePortfolioPrices() {
    try {
      const portfolios = await Portfolio.findAll({
        include: [{
          model: require('../models/User'),
          attributes: ['email']
        }, {
          model: require('../models/Holding'),
          as: 'Holdings'
        }]
      });
      
      for (const portfolio of portfolios) {
        let updated = false;
        
        // Skip if no holdings
        if (!portfolio.Holdings || portfolio.Holdings.length === 0) continue;
        
        for (const holding of portfolio.Holdings) {
          const asset = await Asset.findOne({ where: { symbol: holding.symbol } });
          
          if (asset && asset.currentPrice !== holding.currentPrice) {
            holding.currentPrice = asset.currentPrice;
            holding.currentValue = holding.quantity * asset.currentPrice;
            holding.profitLoss = holding.currentValue - holding.totalInvested;
            holding.profitLossPercentage = ((holding.profitLoss / holding.totalInvested) * 100).toFixed(2);
            await holding.save();
            updated = true;
          }
        }
        
        if (updated) {
          await portfolio.calculateTotals();
          
          // Emit portfolio update to the specific user
          this.io.to(`portfolio-${portfolio.userId}`).emit('portfolio-update', {
            holdings: portfolio.Holdings,
            totalInvested: portfolio.totalInvested,
            currentValue: portfolio.currentValue,
            totalProfitLoss: portfolio.totalProfitLoss,
            totalProfitLossPercentage: portfolio.totalProfitLossPercentage,
            assetAllocation: portfolio.assetAllocation,
            lastUpdated: portfolio.lastUpdated
          });
        }
      }
    } catch (error) {
      console.error('Error updating portfolio prices:', error);
    }
  }

  // Get real-time market data for specific assets
  async getMarketData(symbols) {
    try {
      const assets = await Asset.find({ symbol: { $in: symbols } });
      return assets.map(asset => ({
        symbol: asset.symbol,
        name: asset.name,
        currentPrice: asset.currentPrice,
        dayChangePercentage: asset.dayChangePercentage,
        volume: asset.volume,
        marketCap: asset.marketCap
      }));
    } catch (error) {
      console.error('Error fetching market data:', error);
      return [];
    }
  }

  // Stop price updates (for graceful shutdown)
  stopPriceUpdates() {
    if (this.priceUpdateInterval) {
      clearInterval(this.priceUpdateInterval);
      this.priceUpdateInterval = null;
    }
  }
}

module.exports = new MarketDataService();