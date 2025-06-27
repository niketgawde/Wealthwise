const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const authMiddleware = require('../middleware/auth');
const aiRecommendationService = require('../services/aiRecommendationService');
const Recommendation = require('../models/Recommendation');
const { body, validationResult } = require('express-validator');

// Get AI-generated recommendations for the user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status = 'active', limit = 10 } = req.query;
    
    // Get existing recommendations
    const recommendations = await Recommendation.findAll({
      where: {
        userId: req.userId,
        status
      },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit)
    });

    // If no active recommendations, generate new ones
    if (status === 'active' && recommendations.length === 0) {
      const newRecommendations = await aiRecommendationService.generateRecommendations(req.userId);
      return res.json({
        recommendations: newRecommendations,
        generated: true
      });
    }

    res.json({
      recommendations,
      generated: false
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// Generate new recommendations
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    // Clean up old recommendations first
    await aiRecommendationService.cleanupExpiredRecommendations();

    const recommendations = await aiRecommendationService.generateRecommendations(req.userId);
    
    res.json({
      message: 'Recommendations generated successfully',
      recommendations,
      count: recommendations.length
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// Get recommendation details
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const recommendation = await Recommendation.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      }
    });

    if (!recommendation) {
      return res.status(404).json({ error: 'Recommendation not found' });
    }

    res.json(recommendation);
  } catch (error) {
    console.error('Error fetching recommendation:', error);
    res.status(500).json({ error: 'Failed to fetch recommendation' });
  }
});

// Execute a recommendation
router.post('/:id/execute', authMiddleware, [
  body('executionPrice').isNumeric().withMessage('Execution price is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { executionPrice } = req.body;
    
    const recommendation = await aiRecommendationService.executeRecommendation(
      req.params.id,
      executionPrice
    );

    res.json({
      message: 'Recommendation executed successfully',
      recommendation
    });
  } catch (error) {
    console.error('Error executing recommendation:', error);
    res.status(500).json({ error: error.message || 'Failed to execute recommendation' });
  }
});

// Dismiss a recommendation
router.post('/:id/dismiss', authMiddleware, async (req, res) => {
  try {
    const recommendation = await aiRecommendationService.dismissRecommendation(req.params.id);

    if (!recommendation) {
      return res.status(404).json({ error: 'Recommendation not found' });
    }

    res.json({
      message: 'Recommendation dismissed',
      recommendation
    });
  } catch (error) {
    console.error('Error dismissing recommendation:', error);
    res.status(500).json({ error: 'Failed to dismiss recommendation' });
  }
});

// Get recommendation statistics
router.get('/stats/overview', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    // Get total recommendations
    const total = await Recommendation.count({ where: { userId } });
    
    // Get recommendations by status
    const statusCounts = await Recommendation.findAll({
      where: { userId },
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['status']
    });

    // Get success rate by type
    const successRates = {};
    const types = ['buy', 'sell', 'rebalance', 'diversify'];
    
    for (const type of types) {
      successRates[type] = await Recommendation.getSuccessRate(userId, type);
    }

    // Get recommendations by type
    const typeCounts = await Recommendation.findAll({
      where: { userId },
      attributes: ['type', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['type']
    });

    res.json({
      total,
      byStatus: statusCounts.reduce((acc, curr) => {
        acc[curr.status] = curr.get('count');
        return acc;
      }, {}),
      byType: typeCounts.reduce((acc, curr) => {
        acc[curr.type] = curr.get('count');
        return acc;
      }, {}),
      successRates
    });
  } catch (error) {
    console.error('Error fetching recommendation stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get recommendation performance history
router.get('/history/performance', authMiddleware, async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch(period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    const executedRecommendations = await Recommendation.findAll({
      where: {
        userId: req.userId,
        status: 'executed',
        executedAt: {
          [Op.gte]: startDate,
          [Op.lte]: endDate
        }
      },
      order: [['executedAt', 'DESC']]
    });

    // Calculate performance metrics
    const performance = {
      total: executedRecommendations.length,
      successful: executedRecommendations.filter(r => r.outcome === 'successful').length,
      unsuccessful: executedRecommendations.filter(r => r.outcome === 'unsuccessful').length,
      pending: executedRecommendations.filter(r => r.outcome === 'pending').length,
      recommendations: executedRecommendations
    };

    performance.successRate = performance.total > 0 
      ? ((performance.successful / performance.total) * 100).toFixed(2)
      : 0;

    res.json(performance);
  } catch (error) {
    console.error('Error fetching performance history:', error);
    res.status(500).json({ error: 'Failed to fetch performance history' });
  }
});

// Schedule cleanup of expired recommendations
router.post('/cleanup', authMiddleware, async (req, res) => {
  try {
    const cleaned = await aiRecommendationService.cleanupExpiredRecommendations();
    
    res.json({
      message: 'Cleanup completed',
      expiredCount: cleaned
    });
  } catch (error) {
    console.error('Error cleaning up recommendations:', error);
    res.status(500).json({ error: 'Failed to cleanup recommendations' });
  }
});

module.exports = router;