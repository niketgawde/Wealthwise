const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Recommendation = sequelize.define('Recommendation', {
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
  type: {
    type: DataTypes.ENUM('buy', 'sell', 'hold', 'rebalance', 'diversify'),
    allowNull: false
  },
  asset: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      symbol: '',
      name: '',
      type: '',
      currentPrice: 0,
      targetPrice: 0,
      expectedReturn: 0
    }
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  confidence: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 100
    }
  },
  factors: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  riskLevel: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    allowNull: false
  },
  timeHorizon: {
    type: DataTypes.ENUM('short', 'medium', 'long'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'expired', 'executed', 'dismissed'),
    defaultValue: 'active'
  },
  validUntil: {
    type: DataTypes.DATE,
    allowNull: false
  },
  executedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  executionPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  outcome: {
    type: DataTypes.ENUM('successful', 'unsuccessful', 'pending'),
    allowNull: true
  }
}, {
  indexes: [
    { fields: ['user_id', 'status', 'created_at'] },
    { fields: ['user_id', 'type'] },
    { fields: ['valid_until'] }
  ]
});

// Instance methods
Recommendation.prototype.isValid = function() {
  return this.status === 'active' && this.validUntil > new Date();
};

// Class methods
Recommendation.getSuccessRate = async function(userId, type) {
  const executed = await this.findAll({
    where: {
      userId,
      type,
      status: 'executed',
      outcome: ['successful', 'unsuccessful']
    }
  });

  if (executed.length === 0) return 0;

  const successful = executed.filter(r => r.outcome === 'successful').length;
  return (successful / executed.length) * 100;
};

module.exports = Recommendation;