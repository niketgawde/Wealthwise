const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const Asset = require('../models/Asset');
const Transaction = require('../models/Transaction');
const Recommendation = require('../models/Recommendation');
const Holding = require('../models/Holding');
const { Op } = require('sequelize');

class AIRecommendationService {
  constructor() {
    this.factors = {
      PORTFOLIO_DIVERSITY: 'portfolio_diversity',
      RISK_PROFILE: 'risk_profile',
      MARKET_MOMENTUM: 'market_momentum',
      PERFORMANCE_HISTORY: 'performance_history',
      SECTOR_ALLOCATION: 'sector_allocation',
      INVESTMENT_GOALS: 'investment_goals',
      MARKET_CONDITIONS: 'market_conditions'
    };
  }

  // Main recommendation engine
  async generateRecommendations(userId) {
    try {
      const user = await User.findByPk(userId);
      const portfolio = await Portfolio.findOne({ 
        where: { userId },
        include: [{
          model: Holding,
          as: 'Holdings'
        }]
      });
      
      const recentTransactions = await Transaction.findAll({
        where: { userId },
        order: [['date', 'DESC']],
        limit: 50
      });
      
      const recommendations = [];

      // Analyze portfolio composition
      const portfolioAnalysis = await this.analyzePortfolio(portfolio);
      
      // Generate diversification recommendations
      if (portfolioAnalysis.needsDiversification) {
        const diversifyRecs = await this.generateDiversificationRecommendations(
          user,
          portfolio,
          portfolioAnalysis
        );
        recommendations.push(...diversifyRecs);
      }

      // Generate rebalancing recommendations
      if (portfolioAnalysis.needsRebalancing) {
        const rebalanceRecs = await this.generateRebalancingRecommendations(
          user,
          portfolio,
          portfolioAnalysis
        );
        recommendations.push(...rebalanceRecs);
      }

      // Generate growth opportunities
      const growthRecs = await this.generateGrowthRecommendations(
        user,
        portfolio,
        recentTransactions
      );
      recommendations.push(...growthRecs);

      // Generate risk management recommendations
      const riskRecs = await this.generateRiskManagementRecommendations(
        user,
        portfolio
      );
      recommendations.push(...riskRecs);

      // Sort by confidence and limit to top recommendations
      const topRecommendations = recommendations
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 5);

      // Save recommendations to database
      const savedRecommendations = await Promise.all(
        topRecommendations.map(rec => Recommendation.create(rec))
      );

      return savedRecommendations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw error;
    }
  }

  // Analyze portfolio composition and health
  async analyzePortfolio(portfolio) {
    if (!portfolio || !portfolio.Holdings || portfolio.Holdings.length === 0) {
      return {
        isEmpty: true,
        needsDiversification: true,
        needsRebalancing: false,
        riskScore: 0
      };
    }

    const analysis = {
      isEmpty: false,
      totalValue: portfolio.currentValue,
      assetCount: portfolio.Holdings.length,
      assetTypes: new Set(portfolio.Holdings.map(h => h.assetType)).size,
      concentration: {},
      needsDiversification: false,
      needsRebalancing: false,
      riskScore: 0
    };

    // Calculate concentration by asset
    portfolio.Holdings.forEach(holding => {
      const percentage = (holding.currentValue / portfolio.currentValue) * 100;
      analysis.concentration[holding.symbol] = percentage;
      
      // Flag if any single asset is over 30%
      if (percentage > 30) {
        analysis.needsRebalancing = true;
      }
    });

    // Check diversification
    if (analysis.assetCount < 5 || analysis.assetTypes < 3) {
      analysis.needsDiversification = true;
    }

    // Calculate risk score (simplified)
    const cryptoPercentage = portfolio.assetAllocation?.crypto || 0;
    const stockPercentage = portfolio.assetAllocation?.stocks || 0;
    analysis.riskScore = (cryptoPercentage * 0.9 + stockPercentage * 0.6) / 100;

    return analysis;
  }

  // Generate diversification recommendations
  async generateDiversificationRecommendations(user, portfolio, analysis) {
    const recommendations = [];
    const currentAssets = new Set(portfolio?.Holdings?.map(h => h.symbol) || []);
    
    // Get all available assets
    const allAssets = await Asset.findAll();
    
    // Filter out assets user already owns
    const potentialAssets = allAssets.filter(
      asset => !currentAssets.has(asset.symbol)
    );

    // Recommend different asset types based on what's missing
    const missingTypes = this.getMissingAssetTypes(portfolio);
    
    for (const type of missingTypes) {
      const assetsOfType = potentialAssets.filter(a => a.type === type);
      
      if (assetsOfType.length > 0) {
        // Pick the best performing asset of this type
        const bestAsset = assetsOfType.sort(
          (a, b) => (b.dayChangePercentage || 0) - (a.dayChangePercentage || 0)
        )[0];

        recommendations.push({
          userId: user.id,
          type: 'diversify',
          asset: {
            symbol: bestAsset.symbol,
            name: bestAsset.name,
            type: bestAsset.type,
            currentPrice: bestAsset.currentPrice,
            expectedReturn: this.calculateExpectedReturn(bestAsset)
          },
          reason: `Diversify your portfolio by adding ${type.replace('_', ' ')} investments. ${bestAsset.name} shows strong performance.`,
          confidence: 85,
          factors: [
            { name: this.factors.PORTFOLIO_DIVERSITY, impact: 'high', score: 90 },
            { name: this.factors.MARKET_MOMENTUM, impact: 'medium', score: 75 }
          ],
          riskLevel: this.getAssetRiskLevel(bestAsset.type),
          timeHorizon: 'medium',
          validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        });
      }
    }

    return recommendations;
  }

  // Generate rebalancing recommendations
  async generateRebalancingRecommendations(user, portfolio, analysis) {
    const recommendations = [];
    const targetAllocation = this.getTargetAllocation(user.riskProfile || 'moderate');

    // Compare current allocation with target
    const currentAllocation = portfolio.assetAllocation || {};
    
    for (const [assetType, currentPercentage] of Object.entries(currentAllocation)) {
      const targetPercentage = targetAllocation[assetType] || 0;
      const difference = Math.abs(currentPercentage - targetPercentage);

      if (difference > 10) {
        const action = currentPercentage > targetPercentage ? 'sell' : 'buy';
        
        // Find the best asset to buy/sell
        const assetTypeConverted = assetType === 'stocks' ? 'stock' : 
                                  assetType === 'mutualFunds' ? 'mutual_fund' :
                                  assetType === 'crypto' ? 'crypto' : 'savings';
        
        const holdings = portfolio.Holdings.filter(
          h => h.assetType === assetTypeConverted
        );

        if (holdings.length > 0) {
          const targetHolding = action === 'sell' 
            ? holdings.sort((a, b) => (b.profitLossPercentage || 0) - (a.profitLossPercentage || 0))[0]
            : holdings[0];

          recommendations.push({
            userId: user.id,
            type: 'rebalance',
            asset: {
              symbol: targetHolding.symbol,
              name: targetHolding.name,
              type: targetHolding.assetType,
              currentPrice: targetHolding.currentPrice
            },
            reason: `Rebalance portfolio: ${action} ${assetType} to align with your ${user.riskProfile || 'moderate'} risk profile. Current: ${currentPercentage.toFixed(1)}%, Target: ${targetPercentage}%`,
            confidence: 80,
            factors: [
              { name: this.factors.RISK_PROFILE, impact: 'high', score: 85 },
              { name: this.factors.SECTOR_ALLOCATION, impact: 'high', score: 80 }
            ],
            riskLevel: 'low',
            timeHorizon: 'short',
            validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
          });
        }
      }
    }

    return recommendations;
  }

  // Generate growth opportunity recommendations
  async generateGrowthRecommendations(user, portfolio, transactions) {
    const recommendations = [];
    
    // Get trending assets
    const trendingAssets = await Asset.findAll({
      order: [['dayChangePercentage', 'DESC']],
      limit: 10
    });

    // Analyze user's trading patterns
    const userPreferences = this.analyzeUserPreferences(transactions);

    for (const asset of trendingAssets) {
      // Skip if user already owns this asset
      if (portfolio?.Holdings?.some(h => h.symbol === asset.symbol)) {
        continue;
      }

      // Calculate recommendation score based on multiple factors
      const score = this.calculateRecommendationScore(asset, user, userPreferences);

      if (score.confidence > 70) {
        recommendations.push({
          userId: user.id,
          type: 'buy',
          asset: {
            symbol: asset.symbol,
            name: asset.name,
            type: asset.type,
            currentPrice: asset.currentPrice,
            targetPrice: asset.currentPrice * 1.15, // 15% growth target
            expectedReturn: 15
          },
          reason: score.reason,
          confidence: score.confidence,
          factors: score.factors,
          riskLevel: this.getAssetRiskLevel(asset.type),
          timeHorizon: 'medium',
          validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
      }
    }

    return recommendations.slice(0, 3); // Top 3 growth opportunities
  }

  // Generate risk management recommendations
  async generateRiskManagementRecommendations(user, portfolio) {
    const recommendations = [];

    if (!portfolio || !portfolio.Holdings || portfolio.Holdings.length === 0) {
      return recommendations;
    }

    // Check for assets with significant losses
    const losingPositions = portfolio.Holdings.filter(
      h => (h.profitLossPercentage || 0) < -10
    );

    for (const position of losingPositions) {
      recommendations.push({
        userId: user.id,
        type: 'sell',
        asset: {
          symbol: position.symbol,
          name: position.name,
          type: position.assetType,
          currentPrice: position.currentPrice
        },
        reason: `Consider selling ${position.name} to cut losses. Currently down ${Math.abs(position.profitLossPercentage).toFixed(1)}%. This aligns with risk management best practices.`,
        confidence: 70,
        factors: [
          { name: this.factors.PERFORMANCE_HISTORY, impact: 'high', score: 30 },
          { name: this.factors.RISK_PROFILE, impact: 'medium', score: 60 }
        ],
        riskLevel: 'high',
        timeHorizon: 'short',
        validUntil: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days
      });
    }

    // Check for overconcentration
    const overconcentrated = portfolio.Holdings.filter(
      h => (h.currentValue / portfolio.currentValue) * 100 > 40
    );

    for (const position of overconcentrated) {
      const percentage = ((position.currentValue / portfolio.currentValue) * 100).toFixed(1);
      
      recommendations.push({
        userId: user.id,
        type: 'sell',
        asset: {
          symbol: position.symbol,
          name: position.name,
          type: position.assetType,
          currentPrice: position.currentPrice
        },
        reason: `Reduce concentration risk: ${position.name} represents ${percentage}% of your portfolio. Consider selling some to maintain healthy diversification.`,
        confidence: 75,
        factors: [
          { name: this.factors.PORTFOLIO_DIVERSITY, impact: 'high', score: 40 },
          { name: this.factors.RISK_PROFILE, impact: 'high', score: 70 }
        ],
        riskLevel: 'medium',
        timeHorizon: 'short',
        validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      });
    }

    return recommendations;
  }

  // Helper methods
  getMissingAssetTypes(portfolio) {
    const existingTypes = new Set(portfolio?.Holdings?.map(h => h.assetType) || []);
    const allTypes = ['stock', 'mutual_fund', 'crypto', 'savings'];
    return allTypes.filter(type => !existingTypes.has(type));
  }

  getTargetAllocation(riskProfile) {
    const allocations = {
      conservative: { stocks: 30, mutualFunds: 40, crypto: 5, savings: 25 },
      moderate: { stocks: 40, mutualFunds: 30, crypto: 15, savings: 15 },
      aggressive: { stocks: 50, mutualFunds: 20, crypto: 25, savings: 5 }
    };
    return allocations[riskProfile] || allocations.moderate;
  }

  getAssetRiskLevel(assetType) {
    const riskLevels = {
      savings: 'low',
      mutual_fund: 'medium',
      stock: 'medium',
      crypto: 'high'
    };
    return riskLevels[assetType] || 'medium';
  }

  calculateExpectedReturn(asset) {
    // Simplified expected return calculation
    const baseReturn = {
      stock: 8,
      mutual_fund: 6,
      crypto: 15,
      savings: 2
    };
    
    const momentum = (asset.dayChangePercentage || 0) > 0 ? 2 : -1;
    return baseReturn[asset.type] + momentum;
  }

  analyzeUserPreferences(transactions) {
    const preferences = {
      favoriteAssetTypes: {},
      averageHoldingPeriod: 0,
      tradingFrequency: 'low'
    };

    // Analyze transaction history
    transactions.forEach(tx => {
      if (tx.type === 'buy') {
        preferences.favoriteAssetTypes[tx.assetType] = 
          (preferences.favoriteAssetTypes[tx.assetType] || 0) + 1;
      }
    });

    // Determine trading frequency
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const monthlyTransactions = transactions.filter(
      tx => new Date(tx.date) > thirtyDaysAgo
    ).length;

    if (monthlyTransactions > 10) preferences.tradingFrequency = 'high';
    else if (monthlyTransactions > 5) preferences.tradingFrequency = 'medium';

    return preferences;
  }

  calculateRecommendationScore(asset, user, preferences) {
    let confidence = 50; // Base confidence
    const factors = [];
    let reason = '';

    // Market momentum factor
    const changePercent = asset.dayChangePercentage || 0;
    if (changePercent > 2) {
      confidence += 15;
      factors.push({
        name: this.factors.MARKET_MOMENTUM,
        impact: 'high',
        score: 80
      });
      reason = `${asset.name} shows strong momentum with ${changePercent.toFixed(1)}% daily gain. `;
    }

    // User preference alignment
    if (preferences.favoriteAssetTypes[asset.type] > 3) {
      confidence += 10;
      factors.push({
        name: this.factors.INVESTMENT_GOALS,
        impact: 'medium',
        score: 70
      });
      reason += `This aligns with your investment history in ${asset.type}s. `;
    }

    // Risk profile alignment
    const assetRisk = this.getAssetRiskLevel(asset.type);
    const userRiskProfile = user.riskProfile || 'moderate';
    const profileMatch = 
      (userRiskProfile === 'aggressive' && assetRisk === 'high') ||
      (userRiskProfile === 'moderate' && assetRisk === 'medium') ||
      (userRiskProfile === 'conservative' && assetRisk === 'low');

    if (profileMatch) {
      confidence += 10;
      factors.push({
        name: this.factors.RISK_PROFILE,
        impact: 'high',
        score: 85
      });
      reason += `Matches your ${userRiskProfile} risk profile.`;
    }

    return { confidence, factors, reason };
  }

  // Get user's recommendation history
  async getUserRecommendations(userId, status = 'active') {
    return await Recommendation.findAll({
      where: { userId, status },
      order: [['created_at', 'DESC']],
      limit: 10
    });
  }

  // Mark recommendation as executed
  async executeRecommendation(recommendationId, executionPrice) {
    const recommendation = await Recommendation.findByPk(recommendationId);
    if (!recommendation) {
      throw new Error('Recommendation not found');
    }

    recommendation.status = 'executed';
    recommendation.executedAt = new Date();
    recommendation.executionPrice = executionPrice;

    // Determine outcome (simplified - in production, track actual performance)
    const assetData = recommendation.asset;
    if (recommendation.type === 'buy' && executionPrice <= assetData.currentPrice) {
      recommendation.outcome = 'successful';
    } else if (recommendation.type === 'sell' && executionPrice >= assetData.currentPrice) {
      recommendation.outcome = 'successful';
    } else {
      recommendation.outcome = 'pending';
    }

    await recommendation.save();
    return recommendation;
  }

  // Dismiss a recommendation
  async dismissRecommendation(recommendationId) {
    const recommendation = await Recommendation.findByPk(recommendationId);
    if (!recommendation) {
      return null;
    }
    
    recommendation.status = 'dismissed';
    await recommendation.save();
    return recommendation;
  }

  // Clean up expired recommendations
  async cleanupExpiredRecommendations() {
    const result = await Recommendation.update(
      { status: 'expired' },
      {
        where: {
          status: 'active',
          validUntil: { [Op.lt]: new Date() }
        }
      }
    );
    return result[0]; // Number of rows affected
  }
}

module.exports = new AIRecommendationService();