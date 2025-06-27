const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Asset = sequelize.define('Asset', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  symbol: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    set(value) {
      this.setDataValue('symbol', value.toUpperCase());
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('stock', 'mutual_fund', 'crypto'),
    allowNull: false
  },
  currentPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  previousClose: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  dayChange: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  dayChangePercentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  marketCap: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  volume: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  sector: {
    type: DataTypes.STRING,
    allowNull: true
  },
  exchange: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastUpdated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  indexes: [
    { fields: ['symbol'] },
    { fields: ['type'] }
  ]
});

module.exports = Asset;