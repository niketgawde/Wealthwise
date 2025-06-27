import React, { useState, useEffect } from 'react';
import { recommendationAPI } from '../services/api';
import { Recommendation } from '../types';
import { Tab } from '@headlessui/react';
import {
  SparklesIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChartBarIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Recommendations: React.FC = () => {
  const [activeRecommendations, setActiveRecommendations] = useState<Recommendation[]>([]);
  const [historyRecommendations, setHistoryRecommendations] = useState<Recommendation[]>([]);
  const [performance, setPerformance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [activeRes, historyRes, perfRes] = await Promise.all([
        recommendationAPI.getRecommendations('active'),
        recommendationAPI.getRecommendations('executed', 20),
        recommendationAPI.getPerformanceHistory('30d')
      ]);

      setActiveRecommendations(activeRes.data.recommendations);
      setHistoryRecommendations(historyRes.data.recommendations);
      setPerformance(perfRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      case 'executed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'expired':
        return <XCircleIcon className="h-5 w-5 text-gray-500" />;
      case 'dismissed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getOutcomeColor = (outcome?: string) => {
    switch (outcome) {
      case 'successful':
        return 'text-green-600 bg-green-100';
      case 'unsuccessful':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-0">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Recommendations</h1>
          <p className="mt-1 text-sm text-gray-600">
            Track your AI-powered investment recommendations and performance
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
        >
          <SparklesIcon className="h-4 w-4 mr-2" />
          Generate New
        </button>
      </div>

      {performance && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Executed</p>
                  <p className="text-2xl font-bold text-gray-900">{performance.total}</p>
                </div>
                <ChartBarIcon className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <div className="bg-green-50 rounded p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Successful</p>
                  <p className="text-2xl font-bold text-green-600">{performance.successful}</p>
                </div>
                <CheckCircleIcon className="h-8 w-8 text-green-400" />
              </div>
            </div>
            <div className="bg-yellow-50 rounded p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-yellow-600">{performance.successRate}%</p>
                </div>
                <TrophyIcon className="h-8 w-8 text-yellow-400" />
              </div>
            </div>
            <div className="bg-blue-50 rounded p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-blue-600">{performance.pending}</p>
                </div>
                <ClockIcon className="h-8 w-8 text-blue-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-6">
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            Active ({activeRecommendations.length})
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            History ({historyRecommendations.length})
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <div className="space-y-4">
              {activeRecommendations.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <SparklesIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No active recommendations</p>
                </div>
              ) : (
                activeRecommendations.map((rec) => (
                  <div key={rec._id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getStatusIcon(rec.status)}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {rec.type.charAt(0).toUpperCase() + rec.type.slice(1)} {rec.asset.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{rec.reason}</p>
                          <div className="mt-2 flex items-center space-x-4 text-sm">
                            <span className="text-gray-500">
                              Confidence: <span className="font-medium">{rec.confidence}%</span>
                            </span>
                            <span className="text-gray-500">
                              Risk: <span className="font-medium">{rec.riskLevel}</span>
                            </span>
                            <span className="text-gray-500">
                              Valid until: {new Date(rec.validUntil).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="space-y-4">
              {historyRecommendations.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No recommendation history</p>
                </div>
              ) : (
                historyRecommendations.map((rec) => (
                  <div key={rec._id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getStatusIcon(rec.status)}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {rec.type.charAt(0).toUpperCase() + rec.type.slice(1)} {rec.asset.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{rec.reason}</p>
                          <div className="mt-2 flex items-center space-x-4 text-sm">
                            <span className="text-gray-500">
                              Executed: {rec.executedAt ? new Date(rec.executedAt).toLocaleDateString() : 'N/A'}
                            </span>
                            <span className="text-gray-500">
                              Price: ${rec.executionPrice?.toFixed(2) || 'N/A'}
                            </span>
                            {rec.outcome && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOutcomeColor(rec.outcome)}`}>
                                {rec.outcome}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Recommendations;