# WealthWise MVP

A minimal viable product (MVP) for a comprehensive personal finance and investment platform.

## Features

- User authentication (register/login)
- Dashboard with financial overview
- Portfolio management
- Investment options (stocks, mutual funds, crypto)
- Transaction history
- Asset tracking

## Tech Stack

### Backend
- Node.js + Express
- MongoDB with Mongoose
- JWT authentication
- RESTful API

### Frontend
- React with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd wealthwise-mvp/backend
```

2. Install dependencies:
```bash
npm install
```

3. Update `.env` file with your MongoDB connection string and JWT secret

4. Seed the database with sample assets:
```bash
node utils/seedData.js
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd wealthwise-mvp/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on http://localhost:3000

## Usage

1. Register a new account or login
2. Add funds to your account using the deposit feature
3. Browse available investments
4. Make purchases and track your portfolio
5. View transaction history and performance metrics

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### User
- GET `/api/user/profile` - Get user profile
- PUT `/api/user/profile` - Update profile
- POST `/api/user/complete-kyc` - Complete KYC

### Portfolio
- GET `/api/portfolio` - Get user portfolio
- POST `/api/portfolio/add-holding` - Add new holding
- POST `/api/portfolio/update-prices` - Update asset prices
- DELETE `/api/portfolio/holding/:symbol` - Remove holding

### Transactions
- GET `/api/transactions` - Get transaction history
- POST `/api/transactions` - Create new transaction
- GET `/api/transactions/summary` - Get transaction summary

### Investments
- GET `/api/investments/assets` - Get available assets
- GET `/api/investments/assets/:symbol` - Get specific asset
- POST `/api/investments/buy` - Buy asset
- POST `/api/investments/sell` - Sell asset

## Note

This is a minimal MVP implementation. In a production environment, you would need:
- Proper error handling and validation
- Real-time market data integration
- Secure payment processing
- Enhanced security measures
- Comprehensive testing
- Performance optimization
- Proper deployment configuration