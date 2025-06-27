const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { type, assetType, startDate, endDate, limit = 50, skip = 0 } = req.query;
    
    const query = { userId: req.userId };
    
    if (type) query.type = type;
    if (assetType) query.assetType = assetType;
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Transaction.countDocuments(query);

    res.json({ transactions, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const transaction = new Transaction({
      ...req.body,
      userId: req.userId
    });

    await transaction.save();

    if (transaction.type === 'deposit' || transaction.type === 'withdrawal') {
      const adjustment = transaction.type === 'deposit' ? transaction.amount : -transaction.amount;
      await User.findByIdAndUpdate(req.userId, {
        $inc: { totalBalance: adjustment }
      });
    }

    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/summary', authMiddleware, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let startDate = new Date();
    switch(period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    const income = await Transaction.aggregate([
      {
        $match: {
          userId: req.userId,
          type: { $in: ['deposit', 'dividend', 'interest'] },
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const expenses = await Transaction.aggregate([
      {
        $match: {
          userId: req.userId,
          type: { $in: ['withdrawal', 'expense', 'buy'] },
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const categoryBreakdown = await Transaction.aggregate([
      {
        $match: {
          userId: req.userId,
          type: 'expense',
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    res.json({
      income: income[0]?.total || 0,
      expenses: expenses[0]?.total || 0,
      net: (income[0]?.total || 0) - (expenses[0]?.total || 0),
      categoryBreakdown
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;