import React, { useState } from 'react';
import { Recommendation } from '../types';
import { recommendationAPI, investmentAPI } from '../services/api';
import {
  LightBulbIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onUpdate: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getTypeIcon = () => {
    switch (recommendation.type) {
      case 'buy':
        return <ArrowUpIcon className="h-5 w-5 text-green-500" />;
      case 'sell':
        return <ArrowDownIcon className="h-5 w-5 text-red-500" />;
      case 'rebalance':
        return <ChartBarIcon className="h-5 w-5 text-blue-500" />;
      case 'diversify':
        return <LightBulbIcon className="h-5 w-5 text-purple-500" />;
      default:
        return <CheckCircleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRiskLevelColor = () => {
    switch (recommendation.riskLevel) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-red-600 bg-red-100';
    }
  };

  const getConfidenceColor = () => {
    if (recommendation.confidence >= 80) return 'text-green-600';
    if (recommendation.confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleExecute = async () => {
    setLoading(true);
    try {
      if (recommendation.type === 'buy') {
        // Execute buy order
        await investmentAPI.buyAsset({
          symbol: recommendation.asset.symbol,
          assetType: recommendation.asset.type,
          quantity: 1, // In production, calculate based on user's balance
          price: recommendation.asset.currentPrice
        });
      } else if (recommendation.type === 'sell') {
        // Execute sell order
        await investmentAPI.sellAsset({
          symbol: recommendation.asset.symbol,
          assetType: recommendation.asset.type,
          quantity: 1, // In production, get from user's holdings
          price: recommendation.asset.currentPrice
        });
      }

      // Mark recommendation as executed
      await recommendationAPI.executeRecommendation(
        recommendation._id,
        recommendation.asset.currentPrice
      );

      onUpdate();
    } catch (error) {
      console.error('Error executing recommendation:', error);
      alert('Failed to execute recommendation');
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = async () => {
    setLoading(true);
    try {
      await recommendationAPI.dismissRecommendation(recommendation._id);
      onUpdate();
    } catch (error) {
      console.error('Error dismissing recommendation:', error);
    } finally {
      setLoading(false);
    }
  };

  const timeUntilExpiry = () => {
    const now = new Date();
    const expiry = new Date(recommendation.validUntil);
    const hours = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60));
    if (hours < 24) return `${hours} hours`;
    return `${Math.floor(hours / 24)} days`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex items-start space-x-3">
          {getTypeIcon()}
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              {recommendation.type.charAt(0).toUpperCase() + recommendation.type.slice(1)} {recommendation.asset.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {recommendation.asset.symbol} • ${recommendation.asset.currentPrice.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-xl sm:text-2xl font-bold ${getConfidenceColor()}`}>
            {recommendation.confidence}%
          </span>
          <span className="text-xs text-gray-500">confidence</span>
        </div>
      </div>

      <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-700">{recommendation.reason}</p>

      <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor()}`}>
          {recommendation.riskLevel} risk
        </span>
        <span className="text-gray-500 flex items-center">
          <ClockIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
          Valid for {timeUntilExpiry()}
        </span>
        {recommendation.asset.expectedReturn && (
          <span className="text-green-600 font-medium">
            +{recommendation.asset.expectedReturn}% expected
          </span>
        )}
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Analysis Factors</h4>
          <div className="space-y-2">
            {recommendation.factors.map((factor, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{factor.name.replace(/_/g, ' ')}</span>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    factor.impact === 'high' ? 'bg-red-100 text-red-700' :
                    factor.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {factor.impact}
                  </span>
                  <span className="text-gray-700 font-medium">{factor.score}%</span>
                </div>
              </div>
            ))}
          </div>
          {recommendation.asset.targetPrice && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Target Price</span>
                <span className="font-medium">${recommendation.asset.targetPrice.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs sm:text-sm text-blue-600 hover:text-blue-800"
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </button>
        <div className="flex space-x-2">
          <button
            onClick={handleDismiss}
            disabled={loading}
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            Dismiss
          </button>
          {(recommendation.type === 'buy' || recommendation.type === 'sell') && (
            <button
              onClick={handleExecute}
              disabled={loading}
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Execute'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;