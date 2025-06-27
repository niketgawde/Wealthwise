export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  kycCompleted: boolean;
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  totalBalance?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface Holding {
  assetType: 'stock' | 'mutual_fund' | 'crypto' | 'savings';
  symbol: string;
  name: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  totalInvested: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
}

export interface Portfolio {
  _id: string;
  userId: string;
  holdings: Holding[];
  totalInvested: number;
  currentValue: number;
  totalProfitLoss: number;
  totalProfitLossPercentage: number;
  assetAllocation: {
    stocks: number;
    mutualFunds: number;
    crypto: number;
    savings: number;
  };
  lastUpdated: string;
}

export interface Transaction {
  _id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'buy' | 'sell' | 'dividend' | 'interest' | 'expense';
  category: string;
  amount: number;
  description: string;
  assetType: 'stock' | 'mutual_fund' | 'crypto' | 'savings' | 'cash';
  symbol?: string;
  quantity?: number;
  price?: number;
  fees?: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  date: string;
}

export interface Asset {
  _id: string;
  symbol: string;
  name: string;
  type: 'stock' | 'mutual_fund' | 'crypto';
  currentPrice: number;
  previousClose: number;
  dayChange: number;
  dayChangePercentage: number;
  marketCap: number;
  volume: number;
  description: string;
  sector: string;
  exchange: string;
  lastUpdated: string;
}

export interface Recommendation {
  _id: string;
  userId: string;
  type: 'buy' | 'sell' | 'hold' | 'rebalance' | 'diversify';
  asset: {
    symbol: string;
    name: string;
    type: 'stock' | 'mutual_fund' | 'crypto' | 'savings';
    currentPrice: number;
    targetPrice?: number;
    expectedReturn?: number;
  };
  reason: string;
  confidence: number;
  factors: {
    name: string;
    impact: string;
    score: number;
  }[];
  riskLevel: 'low' | 'medium' | 'high';
  timeHorizon: 'short' | 'medium' | 'long';
  status: 'active' | 'expired' | 'executed' | 'dismissed';
  validUntil: string;
  createdAt: string;
  executedAt?: string;
  executionPrice?: number;
  outcome?: 'successful' | 'unsuccessful' | 'pending';
}