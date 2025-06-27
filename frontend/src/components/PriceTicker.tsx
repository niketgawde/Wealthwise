import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface TickerItem {
  symbol: string;
  name: string;
  currentPrice: number;
  dayChangePercentage: number;
  lastUpdated: string;
}

interface PriceTickerProps {
  symbols?: string[];
}

const PriceTicker: React.FC<PriceTickerProps> = ({ 
  symbols = ['AAPL', 'GOOGL', 'MSFT', 'BTC', 'ETH'] 
}) => {
  const [tickerData, setTickerData] = useState<Map<string, TickerItem>>(new Map());
  const { isConnected, subscribeToAsset, unsubscribeFromAsset } = useWebSocket();

  useEffect(() => {
    if (isConnected) {
      // Subscribe to each symbol
      symbols.forEach(symbol => {
        subscribeToAsset(symbol, (priceData) => {
          setTickerData(prev => {
            const newData = new Map(prev);
            newData.set(symbol, {
              symbol: priceData.symbol,
              name: symbol, // In production, we'd fetch the full name
              currentPrice: priceData.currentPrice,
              dayChangePercentage: priceData.dayChangePercentage,
              lastUpdated: priceData.lastUpdated
            });
            return newData;
          });
        });
      });

      // Cleanup subscriptions
      return () => {
        symbols.forEach(symbol => {
          unsubscribeFromAsset(symbol);
        });
      };
    }
  }, [isConnected, symbols.join(',')]);

  return (
    <div className="bg-gray-900 text-white py-1 sm:py-2">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center space-x-3 sm:space-x-6 overflow-x-auto scrollbar-hide">
          <span className="hidden sm:inline text-sm font-medium text-gray-400 whitespace-nowrap">
            Live Prices
          </span>
          {Array.from(tickerData.values()).map((item) => (
            <div 
              key={item.symbol} 
              className="flex items-center space-x-2 whitespace-nowrap"
            >
              <span className="text-xs sm:text-sm font-medium">{item.symbol}</span>
              <span className="text-xs sm:text-sm">${item.currentPrice.toFixed(2)}</span>
              <span
                className={`flex items-center text-xs ${
                  item.dayChangePercentage >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {item.dayChangePercentage >= 0 ? (
                  <ArrowUpIcon className="h-3 w-3" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3" />
                )}
                {Math.abs(item.dayChangePercentage).toFixed(2)}%
              </span>
            </div>
          ))}
          {tickerData.size === 0 && (
            <span className="text-xs sm:text-sm text-gray-500">Loading...</span>
          )}
          {isConnected && (
            <span className="text-xs text-green-400 flex items-center ml-auto">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
              <span className="hidden sm:inline">Live</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceTicker;