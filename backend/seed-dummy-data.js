const bcrypt = require('bcryptjs');
const { sequelize, User, Portfolio, Holding, Asset, Transaction, Recommendation } = require('./models');

async function seedDatabase() {
  try {
    // Sync database with force to start fresh
    await sequelize.sync({ force: true });
    console.log('Database synced successfully');

    // Create test user  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Niket@123', salt);
    const user = await User.create({
      email: 'test@gm.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      phoneNumber: '+1234567890',
      dateOfBirth: new Date('1990-01-01'),
      riskProfile: 'moderate',
      kycCompleted: true,
      totalBalance: 50000
    });
    console.log('User created');

    // Create assets
    const assets = await Asset.bulkCreate([
      // Stocks
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        type: 'stock',
        currentPrice: 178.45,
        previousClose: 176.23,
        dayChange: 2.22,
        dayChangePercentage: 1.26,
        marketCap: 2800000000000,
        volume: 45678900,
        description: 'Technology company known for iPhone, iPad, Mac',
        sector: 'Technology',
        exchange: 'NASDAQ'
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        type: 'stock',
        currentPrice: 142.67,
        previousClose: 141.89,
        dayChange: 0.78,
        dayChangePercentage: 0.55,
        marketCap: 1800000000000,
        volume: 23456789,
        description: 'Parent company of Google',
        sector: 'Technology',
        exchange: 'NASDAQ'
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        type: 'stock',
        currentPrice: 378.92,
        previousClose: 375.45,
        dayChange: 3.47,
        dayChangePercentage: 0.92,
        marketCap: 2900000000000,
        volume: 34567890,
        description: 'Software and cloud computing company',
        sector: 'Technology',
        exchange: 'NASDAQ'
      },
      {
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        type: 'stock',
        currentPrice: 245.67,
        previousClose: 242.34,
        dayChange: 3.33,
        dayChangePercentage: 1.37,
        marketCap: 780000000000,
        volume: 56789012,
        description: 'Electric vehicle and clean energy company',
        sector: 'Automotive',
        exchange: 'NASDAQ'
      },
      {
        symbol: 'JPM',
        name: 'JPMorgan Chase & Co.',
        type: 'stock',
        currentPrice: 158.34,
        previousClose: 157.89,
        dayChange: 0.45,
        dayChangePercentage: 0.28,
        marketCap: 460000000000,
        volume: 12345678,
        description: 'Largest bank in the United States',
        sector: 'Finance',
        exchange: 'NYSE'
      },
      // Mutual Funds
      {
        symbol: 'VTSAX',
        name: 'Vanguard Total Stock Market Index',
        type: 'mutual_fund',
        currentPrice: 112.45,
        previousClose: 111.89,
        dayChange: 0.56,
        dayChangePercentage: 0.50,
        marketCap: 1400000000000,
        volume: 0,
        description: 'Low-cost index fund tracking entire US stock market',
        sector: 'Diversified',
        exchange: 'VANGUARD'
      },
      {
        symbol: 'VTIAX',
        name: 'Vanguard Total International Stock Index',
        type: 'mutual_fund',
        currentPrice: 35.67,
        previousClose: 35.45,
        dayChange: 0.22,
        dayChangePercentage: 0.62,
        marketCap: 450000000000,
        volume: 0,
        description: 'International stock market index fund',
        sector: 'International',
        exchange: 'VANGUARD'
      },
      // Crypto
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        type: 'crypto',
        currentPrice: 42567.89,
        previousClose: 41234.56,
        dayChange: 1333.33,
        dayChangePercentage: 3.23,
        marketCap: 830000000000,
        volume: 23456789012,
        description: 'First and largest cryptocurrency',
        sector: 'Cryptocurrency',
        exchange: 'CRYPTO'
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        type: 'crypto',
        currentPrice: 2234.56,
        previousClose: 2189.34,
        dayChange: 45.22,
        dayChangePercentage: 2.07,
        marketCap: 270000000000,
        volume: 12345678901,
        description: 'Smart contract blockchain platform',
        sector: 'Cryptocurrency',
        exchange: 'CRYPTO'
      }
    ]);
    console.log('Assets created');

    // Create portfolio
    const portfolio = await Portfolio.create({
      userId: user.id,
      totalInvested: 35000,
      currentValue: 38500,
      totalProfitLoss: 3500,
      totalProfitLossPercentage: 10,
      assetAllocation: {
        stocks: 60,
        mutualFunds: 25,
        crypto: 10,
        savings: 5
      }
    });
    console.log('Portfolio created');

    // Create holdings
    const holdings = await Holding.bulkCreate([
      {
        portfolioId: portfolio.id,
        assetType: 'stock',
        symbol: 'AAPL',
        name: 'Apple Inc.',
        quantity: 50,
        averagePrice: 165.50,
        currentPrice: 178.45,
        totalInvested: 8275,
        currentValue: 8922.50,
        profitLoss: 647.50,
        profitLossPercentage: 7.82
      },
      {
        portfolioId: portfolio.id,
        assetType: 'stock',
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        quantity: 30,
        averagePrice: 135.20,
        currentPrice: 142.67,
        totalInvested: 4056,
        currentValue: 4280.10,
        profitLoss: 224.10,
        profitLossPercentage: 5.52
      },
      {
        portfolioId: portfolio.id,
        assetType: 'stock',
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        quantity: 20,
        averagePrice: 350.00,
        currentPrice: 378.92,
        totalInvested: 7000,
        currentValue: 7578.40,
        profitLoss: 578.40,
        profitLossPercentage: 8.26
      },
      {
        portfolioId: portfolio.id,
        assetType: 'mutual_fund',
        symbol: 'VTSAX',
        name: 'Vanguard Total Stock Market Index',
        quantity: 75,
        averagePrice: 108.50,
        currentPrice: 112.45,
        totalInvested: 8137.50,
        currentValue: 8433.75,
        profitLoss: 296.25,
        profitLossPercentage: 3.64
      },
      {
        portfolioId: portfolio.id,
        assetType: 'crypto',
        symbol: 'BTC',
        name: 'Bitcoin',
        quantity: 0.08,
        averagePrice: 38000,
        currentPrice: 42567.89,
        totalInvested: 3040,
        currentValue: 3405.43,
        profitLoss: 365.43,
        profitLossPercentage: 12.02
      },
      {
        portfolioId: portfolio.id,
        assetType: 'crypto',
        symbol: 'ETH',
        name: 'Ethereum',
        quantity: 0.5,
        averagePrice: 2100,
        currentPrice: 2234.56,
        totalInvested: 1050,
        currentValue: 1117.28,
        profitLoss: 67.28,
        profitLossPercentage: 6.41
      }
    ]);
    console.log('Holdings created');

    // Update portfolio totals
    await portfolio.calculateTotals();

    // Create transactions
    const transactions = await Transaction.bulkCreate([
      // Initial deposits
      {
        userId: user.id,
        type: 'deposit',
        category: 'Bank Transfer',
        amount: 50000,
        description: 'Initial deposit',
        assetType: 'cash',
        status: 'completed',
        date: new Date('2024-01-01')
      },
      // Stock purchases
      {
        userId: user.id,
        type: 'buy',
        category: 'Stock Purchase',
        amount: 8275,
        description: 'Bought 50 shares of AAPL',
        assetType: 'stock',
        symbol: 'AAPL',
        quantity: 50,
        price: 165.50,
        fees: 0,
        status: 'completed',
        date: new Date('2024-01-15')
      },
      {
        userId: user.id,
        type: 'buy',
        category: 'Stock Purchase',
        amount: 4056,
        description: 'Bought 30 shares of GOOGL',
        assetType: 'stock',
        symbol: 'GOOGL',
        quantity: 30,
        price: 135.20,
        fees: 0,
        status: 'completed',
        date: new Date('2024-02-01')
      },
      {
        userId: user.id,
        type: 'buy',
        category: 'Stock Purchase',
        amount: 7000,
        description: 'Bought 20 shares of MSFT',
        assetType: 'stock',
        symbol: 'MSFT',
        quantity: 20,
        price: 350.00,
        fees: 0,
        status: 'completed',
        date: new Date('2024-02-15')
      },
      // Mutual fund purchase
      {
        userId: user.id,
        type: 'buy',
        category: 'Mutual Fund Purchase',
        amount: 8137.50,
        description: 'Bought 75 shares of VTSAX',
        assetType: 'mutual_fund',
        symbol: 'VTSAX',
        quantity: 75,
        price: 108.50,
        fees: 0,
        status: 'completed',
        date: new Date('2024-03-01')
      },
      // Crypto purchases
      {
        userId: user.id,
        type: 'buy',
        category: 'Crypto Purchase',
        amount: 3040,
        description: 'Bought 0.08 BTC',
        assetType: 'crypto',
        symbol: 'BTC',
        quantity: 0.08,
        price: 38000,
        fees: 10,
        status: 'completed',
        date: new Date('2024-03-15')
      },
      {
        userId: user.id,
        type: 'buy',
        category: 'Crypto Purchase',
        amount: 1050,
        description: 'Bought 0.5 ETH',
        assetType: 'crypto',
        symbol: 'ETH',
        quantity: 0.5,
        price: 2100,
        fees: 5,
        status: 'completed',
        date: new Date('2024-04-01')
      },
      // Recent transactions
      {
        userId: user.id,
        type: 'dividend',
        category: 'Dividend Income',
        amount: 125.50,
        description: 'Quarterly dividend from AAPL',
        assetType: 'stock',
        symbol: 'AAPL',
        status: 'completed',
        date: new Date('2024-06-15')
      },
      {
        userId: user.id,
        type: 'dividend',
        category: 'Dividend Income',
        amount: 88.20,
        description: 'Quarterly dividend from MSFT',
        assetType: 'stock',
        symbol: 'MSFT',
        status: 'completed',
        date: new Date('2024-06-15')
      }
    ]);
    console.log('Transactions created');

    // Create recommendations
    const recommendations = await Recommendation.bulkCreate([
      {
        userId: user.id,
        type: 'buy',
        asset: {
          symbol: 'NVDA',
          name: 'NVIDIA Corporation',
          type: 'stock',
          currentPrice: 485.50,
          targetPrice: 550.00,
          expectedReturn: 13.3
        },
        reason: 'Strong AI growth momentum and datacenter demand. Recent earnings beat expectations with 265% YoY revenue growth.',
        confidence: 85,
        factors: [
          { name: 'AI Market Growth', impact: 'Positive', score: 90 },
          { name: 'Technical Analysis', impact: 'Positive', score: 80 },
          { name: 'Earnings Momentum', impact: 'Positive', score: 85 }
        ],
        riskLevel: 'medium',
        timeHorizon: 'medium',
        status: 'active',
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      },
      {
        userId: user.id,
        type: 'rebalance',
        asset: {
          symbol: 'PORTFOLIO',
          name: 'Portfolio Rebalancing',
          type: 'portfolio',
          currentPrice: 0,
          targetPrice: 0,
          expectedReturn: 0
        },
        reason: 'Your crypto allocation (10%) is below target (15%). Consider increasing crypto exposure for better diversification.',
        confidence: 75,
        factors: [
          { name: 'Asset Allocation', impact: 'Neutral', score: 70 },
          { name: 'Risk Profile Match', impact: 'Positive', score: 80 },
          { name: 'Market Conditions', impact: 'Positive', score: 75 }
        ],
        riskLevel: 'low',
        timeHorizon: 'short',
        status: 'active',
        validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
      },
      {
        userId: user.id,
        type: 'sell',
        asset: {
          symbol: 'TSLA',
          name: 'Tesla Inc.',
          type: 'stock',
          currentPrice: 245.67,
          targetPrice: 220.00,
          expectedReturn: -10.5
        },
        reason: 'Valuation concerns and increased competition in EV market. Consider taking profits after recent rally.',
        confidence: 70,
        factors: [
          { name: 'Valuation Metrics', impact: 'Negative', score: 60 },
          { name: 'Competition', impact: 'Negative', score: 65 },
          { name: 'Technical Indicators', impact: 'Negative', score: 70 }
        ],
        riskLevel: 'high',
        timeHorizon: 'short',
        status: 'active',
        validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
      },
      {
        userId: user.id,
        type: 'diversify',
        asset: {
          symbol: 'VTIAX',
          name: 'Vanguard Total International Stock Index',
          type: 'mutual_fund',
          currentPrice: 35.67,
          targetPrice: 38.00,
          expectedReturn: 6.5
        },
        reason: 'Low international exposure in portfolio. Adding international stocks can reduce portfolio volatility.',
        confidence: 80,
        factors: [
          { name: 'Geographic Diversification', impact: 'Positive', score: 85 },
          { name: 'Currency Hedging', impact: 'Neutral', score: 70 },
          { name: 'Global Growth', impact: 'Positive', score: 75 }
        ],
        riskLevel: 'low',
        timeHorizon: 'long',
        status: 'active',
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      },
      {
        userId: user.id,
        type: 'hold',
        asset: {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          type: 'stock',
          currentPrice: 178.45,
          targetPrice: 185.00,
          expectedReturn: 3.7
        },
        reason: 'Strong fundamentals but fairly valued. Hold for long-term growth and dividend income.',
        confidence: 78,
        factors: [
          { name: 'Financial Health', impact: 'Positive', score: 85 },
          { name: 'Innovation Pipeline', impact: 'Positive', score: 80 },
          { name: 'Valuation', impact: 'Neutral', score: 65 }
        ],
        riskLevel: 'low',
        timeHorizon: 'long',
        status: 'active',
        validUntil: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) // 21 days from now
      }
    ]);
    console.log('Recommendations created');

    console.log('Seed data created successfully!');
    console.log('Login credentials:');
    console.log('Email: test@gm.com');
    console.log('Password: Niket@123');
    
    // Close the database connection
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();