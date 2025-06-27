import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import websocketService, { PriceUpdate, PortfolioUpdate } from '../services/websocket';

interface WebSocketContextType {
  isConnected: boolean;
  subscribeToAsset: (symbol: string, callback: (data: PriceUpdate) => void) => void;
  unsubscribeFromAsset: (symbol: string) => void;
  onPortfolioUpdate: (callback: (data: PortfolioUpdate) => void) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Connect to WebSocket server
      websocketService.connect();
      setIsConnected(websocketService.isConnected());

      // Join user's portfolio room
      websocketService.joinPortfolio(user.id);

      // Check connection status periodically
      const interval = setInterval(() => {
        setIsConnected(websocketService.isConnected());
      }, 5000);

      return () => {
        clearInterval(interval);
        websocketService.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  const value: WebSocketContextType = {
    isConnected,
    subscribeToAsset: websocketService.subscribeToAsset.bind(websocketService),
    unsubscribeFromAsset: websocketService.unsubscribeFromAsset.bind(websocketService),
    onPortfolioUpdate: websocketService.onPortfolioUpdate.bind(websocketService),
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};