const sequelize = require('../config/database');
const User = require('./User');
const Portfolio = require('./Portfolio');
const Holding = require('./Holding');
const Transaction = require('./Transaction');
const Asset = require('./Asset');
const Recommendation = require('./Recommendation');

// Define associations
User.hasOne(Portfolio, { foreignKey: 'userId', onDelete: 'CASCADE' });
Portfolio.belongsTo(User, { foreignKey: 'userId' });

Portfolio.hasMany(Holding, { foreignKey: 'portfolioId', onDelete: 'CASCADE' });
Holding.belongsTo(Portfolio, { foreignKey: 'portfolioId' });

User.hasMany(Transaction, { foreignKey: 'userId', onDelete: 'CASCADE' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Recommendation, { foreignKey: 'userId', onDelete: 'CASCADE' });
Recommendation.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Portfolio,
  Holding,
  Transaction,
  Asset,
  Recommendation
};