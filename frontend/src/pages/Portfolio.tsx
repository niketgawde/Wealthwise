import React, { useEffect, useState } from 'react';
import { portfolioAPI } from '../services/api';
import { Portfolio as PortfolioType, Holding } from '../types';
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BriefcaseIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useWebSocket } from '../contexts/WebSocketContext';

const Portfolio: React.FC = () => {
  const [portfolio, setPortfolio] = useState<PortfolioType | null>(null);
  const [loading, setLoading] = useState(true);
  const { isConnected, onPortfolioUpdate, subscribeToAsset, unsubscribeFromAsset } = useWebSocket();

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await portfolioAPI.getPortfolio();
      setPortfolio(response.data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time portfolio updates
  useEffect(() => {
    if (isConnected && portfolio) {
      // Subscribe to real-time portfolio updates
      onPortfolioUpdate((data) => {
        setPortfolio(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            ...data,
          };
        });
      });

      // Subscribe to individual asset updates
      portfolio.holdings.forEach(holding => {
        subscribeToAsset(holding.symbol, (priceData) => {
          setPortfolio(prev => {
            if (!prev) return prev;
            
            const updatedHoldings = prev.holdings.map(h => {
              if (h.symbol === priceData.symbol) {
                const currentValue = h.quantity * priceData.currentPrice;
                const profitLoss = currentValue - h.totalInvested;
                const profitLossPercentage = ((profitLoss / h.totalInvested) * 100).toFixed(2);
                
                return {
                  ...h,
                  currentPrice: priceData.currentPrice,
                  currentValue,
                  profitLoss,
                  profitLossPercentage: parseFloat(profitLossPercentage)
                };
              }
              return h;
            });

            // Recalculate totals
            const totalInvested = updatedHoldings.reduce((sum, h) => sum + h.totalInvested, 0);
            const currentValue = updatedHoldings.reduce((sum, h) => sum + h.currentValue, 0);
            const totalProfitLoss = currentValue - totalInvested;
            const totalProfitLossPercentage = totalInvested > 0 
              ? parseFloat(((totalProfitLoss / totalInvested) * 100).toFixed(2))
              : 0;

            return {
              ...prev,
              holdings: updatedHoldings,
              totalInvested,
              currentValue,
              totalProfitLoss,
              totalProfitLossPercentage
            };
          });
        });
      });

      // Cleanup subscriptions
      return () => {
        portfolio.holdings.forEach(holding => {
          unsubscribeFromAsset(holding.symbol);
        });
      };
    }
  }, [isConnected, portfolio?.holdings.length]);

  const handleRemoveHolding = async (symbol: string, assetType: string) => {
    try {
      await portfolioAPI.removeHolding(symbol, assetType);
      await fetchPortfolio();
    } catch (error) {
      console.error('Error removing holding:', error);
    }
  };

  const getAssetTypeColor = (type: string) => {
    switch (type) {
      case 'stock':
        return { bg: 'bg-blue-100', text: 'text-blue-800', gradient: 'from-blue-500 to-indigo-600' };
      case 'crypto':
        return { bg: 'bg-purple-100', text: 'text-purple-800', gradient: 'from-purple-500 to-pink-600' };
      case 'mutual_fund':
        return { bg: 'bg-green-100', text: 'text-green-800', gradient: 'from-green-500 to-teal-600' };
      case 'savings':
        return { bg: 'bg-gray-100', text: 'text-gray-800', gradient: 'from-gray-500 to-gray-600' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', gradient: 'from-gray-500 to-gray-600' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg">
            <BriefcaseIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Portfolio</h1>
            <p className="mt-1 text-gray-600">
              Track your investments and monitor performance in real-time
            </p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={fetchPortfolio}
            className="btn-primary flex items-center space-x-2"
          >
            <ArrowPathIcon className="h-4 w-4" />
            <span>Refresh Prices</span>
          </button>
        </div>
      </div>

      {portfolio && portfolio.holdings.length > 0 ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-6 hover-lift animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl shadow-md">
                  <CurrencyDollarIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600">Total Invested</p>
              <p className="text-2xl font-bold text-gray-900 tabular-nums">
                ${portfolio.totalInvested.toLocaleString()}
              </p>
            </div>
            
            <div className="card p-6 hover-lift animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-md">
                  <ChartBarIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600">Current Value</p>
              <p className="text-2xl font-bold text-gray-900 tabular-nums">
                ${portfolio.currentValue.toLocaleString()}
              </p>
            </div>
            
            <div className="card p-6 hover-lift animate-slide-up" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl shadow-md bg-gradient-to-r ${
                  portfolio.totalProfitLoss >= 0 ? 'from-green-500 to-teal-600' : 'from-orange-500 to-red-600'
                }`}>
                  {portfolio.totalProfitLoss >= 0 ? (
                    <ArrowTrendingUpIcon className="h-6 w-6 text-white" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-6 w-6 text-white" />
                  )}
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600">Total P&L</p>
              <div className={`text-2xl font-bold tabular-nums ${
                portfolio.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {portfolio.totalProfitLoss >= 0 ? '+' : '-'}${Math.abs(portfolio.totalProfitLoss).toLocaleString()}
              </div>
            </div>
            
            <div className="card p-6 hover-lift animate-slide-up" style={{ animationDelay: '400ms' }}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl shadow-md bg-gradient-to-r ${
                  portfolio.totalProfitLossPercentage >= 0 ? 'from-green-500 to-teal-600' : 'from-orange-500 to-red-600'
                }`}>
                  {portfolio.totalProfitLossPercentage >= 0 ? (
                    <ArrowUpIcon className="h-6 w-6 text-white" />
                  ) : (
                    <ArrowDownIcon className="h-6 w-6 text-white" />
                  )}
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600">Total Return</p>
              <div className={`text-2xl font-bold tabular-nums ${
                portfolio.totalProfitLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {portfolio.totalProfitLossPercentage >= 0 ? '+' : ''}{portfolio.totalProfitLossPercentage}%
              </div>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block animate-slide-up" style={{ animationDelay: '500ms' }}>
            <div className="card overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asset
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Value
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      P&L
                    </th>
                    <th className="relative px-6 py-4">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {portfolio.holdings.map((holding: Holding, index) => {
                    const typeColors = getAssetTypeColor(holding.assetType);
                    return (
                      <tr key={`${holding.symbol}-${holding.assetType}`} className="table-row-hover">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`h-10 w-10 rounded-lg bg-gradient-to-r ${typeColors.gradient} flex items-center justify-center shadow-md`}>
                              <span className="text-white font-bold text-sm">
                                {holding.symbol.substring(0, 2).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{holding.symbol}</div>
                              <div className="text-sm text-gray-500">{holding.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${typeColors.bg} ${typeColors.text}`}>
                            {holding.assetType.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium tabular-nums">
                          {holding.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 tabular-nums">
                          ${holding.averagePrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium tabular-nums">
                          ${holding.currentPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 tabular-nums">
                          ${holding.currentValue.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`flex items-center space-x-1 ${holding.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {holding.profitLoss >= 0 ? (
                              <ArrowUpIcon className="h-4 w-4" />
                            ) : (
                              <ArrowDownIcon className="h-4 w-4" />
                            )}
                            <div>
                              <div className="font-semibold tabular-nums">
                                ${Math.abs(holding.profitLoss).toFixed(2)}
                              </div>
                              <div className="text-xs tabular-nums">
                                ({holding.profitLossPercentage}%)
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleRemoveHolding(holding.symbol, holding.assetType)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors duration-200"
                            title="Remove holding"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {portfolio.holdings.map((holding: Holding, index) => {
              const typeColors = getAssetTypeColor(holding.assetType);
              return (
                <div
                  key={`${holding.symbol}-${holding.assetType}`}
                  className="card-hover p-5 animate-slide-up"
                  style={{ animationDelay: `${(index + 5) * 100}ms` }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-r ${typeColors.gradient} flex items-center justify-center shadow-lg`}>
                        <span className="text-white font-bold">
                          {holding.symbol.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{holding.symbol}</h3>
                        <p className="text-sm text-gray-500">{holding.name}</p>
                      </div>
                    </div>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${typeColors.bg} ${typeColors.text}`}>
                      {holding.assetType.replace('_', ' ')}
                    </span>
                  </div>
                
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900 tabular-nums">{holding.quantity}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Price</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900 tabular-nums">${holding.averagePrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900 tabular-nums">${holding.currentPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900 tabular-nums">${holding.currentValue.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Profit/Loss</p>
                      <div className={`flex items-center space-x-2 ${holding.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {holding.profitLoss >= 0 ? (
                          <ArrowUpIcon className="h-5 w-5" />
                        ) : (
                          <ArrowDownIcon className="h-5 w-5" />
                        )}
                        <div>
                          <span className="text-lg font-bold tabular-nums">
                            ${Math.abs(holding.profitLoss).toFixed(2)}
                          </span>
                          <span className="text-sm font-medium ml-2 tabular-nums">
                            ({holding.profitLossPercentage}%)
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveHolding(holding.symbol, holding.assetType)}
                      className="btn-danger flex items-center space-x-2"
                    >
                      <TrashIcon className="h-4 w-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="text-center py-16 animate-fade-in">
          <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <BriefcaseIcon className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No investments yet</h3>
          <p className="text-gray-500 mb-6">
            Start building your portfolio by making your first investment.
          </p>
          <button className="btn-primary">
            Make Your First Investment
          </button>
        </div>
      )}
    </div>
  );
};

export default Portfolio;