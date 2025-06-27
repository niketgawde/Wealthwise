const mongoose = require('mongoose');
const Asset = require('../models/Asset');
require('dotenv').config();

const sampleAssets = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    type: 'stock',
    currentPrice: 185.50,
    previousClose: 183.25,
    dayChange: 2.25,
    dayChangePercentage: 1.23,
    marketCap: 2900000000000,
    volume: 45678900,
    description: 'Technology company that designs and manufactures consumer electronics',
    sector: 'Technology',
    exchange: 'NASDAQ'
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    type: 'stock',
    currentPrice: 142.80,
    previousClose: 141.50,
    dayChange: 1.30,
    dayChangePercentage: 0.92,
    marketCap: 1800000000000,
    volume: 23456789,
    description: 'Multinational technology company specializing in Internet services',
    sector: 'Technology',
    exchange: 'NASDAQ'
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    type: 'stock',
    currentPrice: 378.45,
    previousClose: 375.80,
    dayChange: 2.65,
    dayChangePercentage: 0.71,
    marketCap: 2800000000000,
    volume: 34567890,
    description: 'Technology corporation that develops and supports software and services',
    sector: 'Technology',
    exchange: 'NASDAQ'
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    type: 'crypto',
    currentPrice: 45250.00,
    previousClose: 44800.00,
    dayChange: 450.00,
    dayChangePercentage: 1.00,
    marketCap: 885000000000,
    volume: 28500000000,
    description: 'Decentralized digital currency',
    sector: 'Cryptocurrency',
    exchange: 'Crypto'
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    type: 'crypto',
    currentPrice: 2380.50,
    previousClose: 2350.00,
    dayChange: 30.50,
    dayChangePercentage: 1.30,
    marketCap: 286000000000,
    volume: 15600000000,
    description: 'Decentralized platform for smart contracts',
    sector: 'Cryptocurrency',
    exchange: 'Crypto'
  },
  {
    symbol: 'VTSAX',
    name: 'Vanguard Total Stock Market Index Fund',
    type: 'mutual_fund',
    currentPrice: 108.75,
    previousClose: 108.25,
    dayChange: 0.50,
    dayChangePercentage: 0.46,
    marketCap: 1400000000000,
    volume: 4567890,
    description: 'Index fund that tracks the entire U.S. stock market',
    sector: 'Mutual Fund',
    exchange: 'Vanguard'
  },
  {
    symbol: 'VTIAX',
    name: 'Vanguard Total International Stock Index Fund',
    type: 'mutual_fund',
    currentPrice: 45.80,
    previousClose: 45.60,
    dayChange: 0.20,
    dayChangePercentage: 0.44,
    marketCap: 450000000000,
    volume: 2345678,
    description: 'Index fund providing exposure to international stocks',
    sector: 'Mutual Fund',
    exchange: 'Vanguard'
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Asset.deleteMany({});
    console.log('Cleared existing assets');

    await Asset.insertMany(sampleAssets);
    console.log('Sample assets inserted successfully');

    mongoose.connection.close();
    console.log('Database seeding completed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();