const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Portfolio = sequelize.define('Portfolio', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  totalInvested: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  currentValue: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  totalProfitLoss: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  totalProfitLossPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0
  },
  assetAllocation: {
    type: DataTypes.JSON,
    defaultValue: {
      stocks: 0,
      mutualFunds: 0,
      crypto: 0,
      savings: 0
    }
  },
  lastUpdated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

// Instance methods
Portfolio.prototype.calculateTotals = async function() {
  const Holding = require('./Holding');
  const holdings = await Holding.findAll({ where: { portfolioId: this.id } });
  
  this.totalInvested = holdings.reduce((sum, holding) => sum + parseFloat(holding.totalInvested), 0);
  this.currentValue = holdings.reduce((sum, holding) => sum + parseFloat(holding.currentValue), 0);
  this.totalProfitLoss = this.currentValue - this.totalInvested;
  this.totalProfitLossPercentage = this.totalInvested > 0 
    ? ((this.totalProfitLoss / this.totalInvested) * 100).toFixed(2) 
    : 0;
  
  const allocation = {
    stocks: 0,
    mutualFunds: 0,
    crypto: 0,
    savings: 0
  };
  
  holdings.forEach(holding => {
    switch(holding.assetType) {
      case 'stock':
        allocation.stocks += parseFloat(holding.currentValue);
        break;
      case 'mutual_fund':
        allocation.mutualFunds += parseFloat(holding.currentValue);
        break;
      case 'crypto':
        allocation.crypto += parseFloat(holding.currentValue);
        break;
      case 'savings':
        allocation.savings += parseFloat(holding.currentValue);
        break;
    }
  });
  
  if (this.currentValue > 0) {
    this.assetAllocation = {
      stocks: ((allocation.stocks / this.currentValue) * 100).toFixed(2),
      mutualFunds: ((allocation.mutualFunds / this.currentValue) * 100).toFixed(2),
      crypto: ((allocation.crypto / this.currentValue) * 100).toFixed(2),
      savings: ((allocation.savings / this.currentValue) * 100).toFixed(2)
    };
  }
  
  this.lastUpdated = new Date();
  await this.save();
};

module.exports = Portfolio;