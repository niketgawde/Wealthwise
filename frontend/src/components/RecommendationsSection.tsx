import React, { useState, useEffect } from 'react';
import { recommendationAPI } from '../services/api';
import { Recommendation } from '../types';
import RecommendationCard from './RecommendationCard';
import { SparklesIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const RecommendationsSection: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchRecommendations();
    fetchStats();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await recommendationAPI.getRecommendations('active', 5);
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await recommendationAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const generateNewRecommendations = async () => {
    setGenerating(true);
    try {
      const response = await recommendationAPI.generateRecommendations();
      setRecommendations(response.data.recommendations);
      await fetchStats();
    } catch (error) {
      console.error('Error generating recommendations:', error);
      alert('Failed to generate recommendations');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <SparklesIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">AI Recommendations</h2>
          </div>
          <button
            onClick={generateNewRecommendations}
            disabled={generating}
            className="flex items-center justify-center space-x-2 px-3 py-2 sm:px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 text-sm sm:text-base"
          >
            <SparklesIcon className="h-4 w-4" />
            <span>{generating ? 'Generating...' : 'Generate New'}</span>
          </button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="bg-gray-50 rounded p-2 sm:p-3">
              <p className="text-xs sm:text-sm text-gray-600">Total Generated</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.total || 0}</p>
            </div>
            <div className="bg-green-50 rounded p-2 sm:p-3">
              <p className="text-xs sm:text-sm text-gray-600">Success Rate</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600">
                {stats.successRates?.buy || 0}%
              </p>
            </div>
            <div className="bg-blue-50 rounded p-2 sm:p-3">
              <p className="text-xs sm:text-sm text-gray-600">Active</p>
              <p className="text-lg sm:text-2xl font-bold text-blue-600">
                {stats.byStatus?.active || 0}
              </p>
            </div>
            <div className="bg-purple-50 rounded p-2 sm:p-3">
              <p className="text-xs sm:text-sm text-gray-600">Executed</p>
              <p className="text-lg sm:text-2xl font-bold text-purple-600">
                {stats.byStatus?.executed || 0}
              </p>
            </div>
          </div>
        )}

        {recommendations.length === 0 ? (
          <div className="text-center py-12">
            <SparklesIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No active recommendations
            </h3>
            <p className="text-gray-500 mb-4">
              Generate AI-powered investment recommendations based on your profile and market conditions.
            </p>
            <button
              onClick={generateNewRecommendations}
              disabled={generating}
              className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              Generate Recommendations
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((recommendation) => (
              <RecommendationCard
                key={recommendation._id}
                recommendation={recommendation}
                onUpdate={fetchRecommendations}
              />
            ))}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 sm:p-6">
        <div className="flex items-start space-x-3">
          <ChartBarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 flex-shrink-0" />
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              How AI Recommendations Work
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                Analyzes your portfolio composition and risk profile
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                Monitors market trends and momentum indicators
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                Suggests diversification and rebalancing opportunities
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">•</span>
                Provides confidence scores and risk assessments
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsSection;