import React, { useState, useEffect } from 'react';
import { investmentAPI, transactionAPI } from '../services/api';
import { Asset } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Investments: React.FC = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [assetType, setAssetType] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [buyAmount, setBuyAmount] = useState('');
  const [buyQuantity, setBuyQuantity] = useState('');

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const response = await investmentAPI.getAssets({
        type: assetType,
        search: searchTerm,
      });
      setAssets(response.data);
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetType, searchTerm]);

  const handleBuy = async () => {
    if (!selectedAsset || !buyQuantity) return;

    try {
      await investmentAPI.buyAsset({
        symbol: selectedAsset.symbol,
        assetType: selectedAsset.type,
        quantity: parseFloat(buyQuantity),
        price: selectedAsset.currentPrice,
      });

      await transactionAPI.createTransaction({
        type: 'deposit',
        category: 'Investment',
        amount: parseFloat(buyQuantity) * selectedAsset.currentPrice,
        description: `Bought ${buyQuantity} ${selectedAsset.symbol}`,
        assetType: selectedAsset.type,
        symbol: selectedAsset.symbol,
        quantity: parseFloat(buyQuantity),
        price: selectedAsset.currentPrice,
      });

      alert('Purchase successful!');
      setSelectedAsset(null);
      setBuyQuantity('');
      setBuyAmount('');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Purchase failed');
    }
  };

  const getAssetTypeColor = (type: string) => {
    switch (type) {
      case 'stock':
        return 'bg-blue-100 text-blue-800';
      case 'crypto':
        return 'bg-purple-100 text-purple-800';
      case 'mutual_fund':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Investments</h1>
          <p className="mt-2 text-sm text-gray-700">
            Browse and invest in stocks, mutual funds, and cryptocurrencies.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          value={assetType}
          onChange={(e) => setAssetType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="stock">Stocks</option>
          <option value="mutual_fund">Mutual Funds</option>
          <option value="crypto">Cryptocurrency</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block mt-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Asset
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Type
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Price
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Change
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Market Cap
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Buy</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {assets.map((asset) => (
                    <tr key={asset._id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <div>
                          <div className="font-medium text-gray-900">{asset.symbol}</div>
                          <div className="text-gray-500">{asset.name}</div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getAssetTypeColor(
                            asset.type
                          )}`}
                        >
                          {asset.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        ${asset.currentPrice.toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`${
                            asset.dayChangePercentage >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {asset.dayChangePercentage >= 0 ? '+' : ''}
                          {asset.dayChangePercentage}%
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        ${(asset.marketCap / 1000000000).toFixed(2)}B
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => setSelectedAsset(asset)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Buy
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden mt-6 space-y-4">
            {assets.map((asset) => (
              <div key={asset._id} className="bg-white shadow rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{asset.symbol}</h3>
                    <p className="text-sm text-gray-500">{asset.name}</p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getAssetTypeColor(
                      asset.type
                    )}`}
                  >
                    {asset.type.replace('_', ' ')}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Price</p>
                    <p className="font-medium">${asset.currentPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Change</p>
                    <p className={`font-medium ${
                      asset.dayChangePercentage >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {asset.dayChangePercentage >= 0 ? '+' : ''}
                      {asset.dayChangePercentage}%
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Market Cap</p>
                    <p className="font-medium">${(asset.marketCap / 1000000000).toFixed(2)}B</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAsset(asset)}
                  className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Buy
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedAsset && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Buy {selectedAsset.name}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Current Price
                </label>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  ${selectedAsset.currentPrice.toFixed(2)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={buyQuantity}
                  onChange={(e) => {
                    setBuyQuantity(e.target.value);
                    setBuyAmount(
                      (parseFloat(e.target.value) * selectedAsset.currentPrice).toFixed(2)
                    );
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Total Amount
                </label>
                <p className="mt-1 text-xl font-semibold text-gray-900">
                  ${buyAmount || '0.00'}
                </p>
              </div>
              {user?.totalBalance !== undefined && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Available Balance
                  </label>
                  <p className="mt-1 text-lg text-gray-900">
                    ${user.totalBalance.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleBuy}
                disabled={!buyQuantity || parseFloat(buyAmount) > (user?.totalBalance || 0)}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Purchase
              </button>
              <button
                onClick={() => {
                  setSelectedAsset(null);
                  setBuyQuantity('');
                  setBuyAmount('');
                }}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Investments;