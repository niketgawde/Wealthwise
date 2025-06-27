import { io, Socket } from 'socket.io-client';

export interface PriceUpdate {
  symbol: string;
  currentPrice: number;
  previousClose: number;
  dayChange: number;
  dayChangePercentage: number;
  lastUpdated: string;
}

export interface PortfolioUpdate {
  holdings: any[];
  totalInvested: number;
  currentValue: number;
  totalProfitLoss: number;
  totalProfitLossPercentage: number;
  assetAllocation: any;
  lastUpdated: string;
}

class WebSocketService {
  private socket: Socket | null = null;
  private priceUpdateCallbacks: Map<string, (data: PriceUpdate) => void> = new Map();
  private portfolioUpdateCallback: ((data: PortfolioUpdate) => void) | null = null;

  connect() {
    if (this.socket?.connected) {
      return;
    }

    const wsUrl = process.env.REACT_APP_WS_URL || 'http://localhost:5001';
    this.socket = io(wsUrl, {
      transports: ['websocket'],
      upgrade: false
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    // Listen for price updates
    this.socket.on('price-update', (data: PriceUpdate) => {
      const callback = this.priceUpdateCallbacks.get(data.symbol);
      if (callback) {
        callback(data);
      }
    });

    // Listen for portfolio updates
    this.socket.on('portfolio-update', (data: PortfolioUpdate) => {
      if (this.portfolioUpdateCallback) {
        this.portfolioUpdateCallback(data);
      }
    });

    this.socket.on('error', (error: any) => {
      console.error('WebSocket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Join portfolio room for real-time updates
  joinPortfolio(userId: string) {
    if (this.socket?.connected) {
      this.socket.emit('join-portfolio', userId);
    }
  }

  // Subscribe to asset price updates
  subscribeToAsset(symbol: string, callback: (data: PriceUpdate) => void) {
    if (this.socket?.connected) {
      this.socket.emit('subscribe-asset', symbol);
      this.priceUpdateCallbacks.set(symbol, callback);
    }
  }

  // Unsubscribe from asset price updates
  unsubscribeFromAsset(symbol: string) {
    if (this.socket?.connected) {
      this.socket.emit('unsubscribe-asset', symbol);
      this.priceUpdateCallbacks.delete(symbol);
    }
  }

  // Set portfolio update callback
  onPortfolioUpdate(callback: (data: PortfolioUpdate) => void) {
    this.portfolioUpdateCallback = callback;
  }

  // Check if connected
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export default new WebSocketService();