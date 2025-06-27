const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Holding = sequelize.define('Holding', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  portfolioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Portfolios',
      key: 'id'
    }
  },
  assetType: {
    type: DataTypes.ENUM('stock', 'mutual_fund', 'crypto', 'savings'),
    allowNull: false
  },
  symbol: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: false
  },
  averagePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currentPrice: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  totalInvested: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currentValue: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  profitLoss: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  profitLossPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0
  }
});

module.exports = Holding;