import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://wealthwise-backend-es1p.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: any) =>
    api.post('/auth/register', data),
};

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data: any) => api.put('/user/profile', data),
  completeKYC: () => api.post('/user/complete-kyc'),
};

export const portfolioAPI = {
  getPortfolio: () => api.get('/portfolio'),
  addHolding: (data: any) => api.post('/portfolio/add-holding', data),
  updatePrices: () => api.post('/portfolio/update-prices'),
  removeHolding: (symbol: string, assetType: string) =>
    api.delete(`/portfolio/holding/${symbol}?assetType=${assetType}`),
};

export const transactionAPI = {
  getTransactions: (params?: any) => api.get('/transactions', { params }),
  createTransaction: (data: any) => api.post('/transactions', data),
  getSummary: (period?: string) => api.get('/transactions/summary', { params: { period } }),
};

export const investmentAPI = {
  getAssets: (params?: any) => api.get('/investments/assets', { params }),
  getAsset: (symbol: string) => api.get(`/investments/assets/${symbol}`),
  buyAsset: (data: any) => api.post('/investments/buy', data),
  sellAsset: (data: any) => api.post('/investments/sell', data),
};

export const marketDataAPI = {
  getOverview: () => api.get('/market-data/overview'),
  getPrices: (symbols: string[]) => api.post('/market-data/prices', { symbols }),
  getHistory: (symbol: string, period?: string) => 
    api.get(`/market-data/history/${symbol}`, { params: { period } }),
};

export const recommendationAPI = {
  getRecommendations: (status?: string, limit?: number) => 
    api.get('/recommendations', { params: { status, limit } }),
  generateRecommendations: () => api.post('/recommendations/generate'),
  getRecommendation: (id: string) => api.get(`/recommendations/${id}`),
  executeRecommendation: (id: string, executionPrice: number) => 
    api.post(`/recommendations/${id}/execute`, { executionPrice }),
  dismissRecommendation: (id: string) => api.post(`/recommendations/${id}/dismiss`),
  getStats: () => api.get('/recommendations/stats/overview'),
  getPerformanceHistory: (period?: string) => 
    api.get('/recommendations/history/performance', { params: { period } }),
};

export default api;