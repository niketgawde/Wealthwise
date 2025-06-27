import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { portfolioAPI, transactionAPI } from '../services/api';
import { Portfolio } from '../types';
import RecommendationsSection from '../components/RecommendationsSection';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  BanknotesIcon,
  WalletIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { ChartPieIcon } from '@heroicons/react/24/solid';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [portfolioRes, summaryRes] = await Promise.all([
        portfolioAPI.getPortfolio(),
        transactionAPI.getSummary('month'),
      ]);
      setPortfolio(portfolioRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Portfolio Value',
      value: `$${portfolio?.currentValue?.toLocaleString() || '0'}`,
      change: portfolio?.totalProfitLossPercentage || 0,
      icon: WalletIcon,
      gradient: 'from-indigo-500 to-purple-600',
      shadowColor: 'shadow-indigo-500/25',
    },
    {
      name: 'Total Invested',
      value: `$${portfolio?.totalInvested?.toLocaleString() || '0'}`,
      icon: BanknotesIcon,
      gradient: 'from-blue-500 to-cyan-600',
      shadowColor: 'shadow-blue-500/25',
    },
    {
      name: 'Monthly Income',
      value: `$${summary?.income?.toLocaleString() || '0'}`,
      icon: ArrowTrendingUpIcon,
      gradient: 'from-green-500 to-teal-600',
      shadowColor: 'shadow-green-500/25',
    },
    {
      name: 'Monthly Expenses',
      value: `$${summary?.expenses?.toLocaleString() || '0'}`,
      icon: ArrowTrendingDownIcon,
      gradient: 'from-orange-500 to-red-600',
      shadowColor: 'shadow-red-500/25',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="mt-2 text-gray-600">
          Here's your financial overview for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.name}
            className={`card-hover p-6 bg-white shadow-lg ${stat.shadowColor} animate-slide-up`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              {stat.change !== undefined && (
                <div
                  className={`flex items-center text-sm font-semibold ${
                    stat.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.change >= 0 ? (
                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 mr-1" />
                  )}
                  <span>{Math.abs(stat.change)}%</span>
                </div>
              )}
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
            <p className="text-2xl font-bold text-gray-900 tabular-nums">{stat.value}</p>
          </div>
        ))}
      </div>

      {portfolio && portfolio.holdings.length > 0 && (
        <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center mb-4">
            <ChartPieIcon className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Asset Allocation</h2>
          </div>
          <div className="card p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: 'Stocks', value: portfolio.assetAllocation.stocks, color: 'from-blue-500 to-indigo-600' },
                { name: 'Mutual Funds', value: portfolio.assetAllocation.mutualFunds, color: 'from-purple-500 to-pink-600' },
                { name: 'Crypto', value: portfolio.assetAllocation.crypto, color: 'from-orange-500 to-red-600' },
                { name: 'Savings', value: portfolio.assetAllocation.savings, color: 'from-green-500 to-teal-600' },
              ].map((asset, index) => (
                <div key={asset.name} className="text-center hover-grow">
                  <div className="relative mb-3">
                    <svg className="w-24 h-24 mx-auto transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="36"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-200"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="36"
                        stroke={`url(#gradient-${index})`}
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(asset.value / 100) * 226.2} 226.2`}
                        className="transition-all duration-1000 ease-out"
                      />
                      <defs>
                        <linearGradient id={`gradient-${index}`}>
                          <stop offset="0%" className={`bg-gradient-to-r ${asset.color}`} stopColor="currentColor" />
                          <stop offset="100%" className={`bg-gradient-to-r ${asset.color}`} stopColor="currentColor" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900">{asset.value}%</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-600">{asset.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {summary?.categoryBreakdown && summary.categoryBreakdown.length > 0 && (
        <div className="animate-slide-up" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center mb-4">
            <ChartBarIcon className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Monthly Expense Breakdown</h2>
          </div>
          <div className="card p-6">
            <div className="space-y-4">
              {summary.categoryBreakdown.slice(0, 5).map((category: any, index: number) => {
                const maxTotal = Math.max(...summary.categoryBreakdown.map((c: any) => c.total));
                const percentage = (category.total / maxTotal) * 100;
                return (
                  <div key={category._id} className="group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                        {category._id}
                      </span>
                      <span className="text-sm font-semibold text-gray-900 tabular-nums">
                        ${category.total.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${percentage}%`,
                          animationDelay: `${index * 100}ms`
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* AI Recommendations Section */}
      <div className="animate-slide-up" style={{ animationDelay: '600ms' }}>
        <RecommendationsSection />
      </div>

      {!user?.kycCompleted && (
        <div className="animate-slide-up card-glass bg-amber-50/90 border border-amber-200 p-6" style={{ animationDelay: '700ms' }}>
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="p-3 bg-amber-100 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-amber-900">
                Complete your KYC
              </h3>
              <p className="mt-2 text-amber-700">
                Please complete your KYC verification to unlock all investment features and personalized recommendations.
              </p>
              <button className="mt-3 btn-primary bg-amber-600 hover:bg-amber-700 focus:ring-amber-500">
                Start KYC Process
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;