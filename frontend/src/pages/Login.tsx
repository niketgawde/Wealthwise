import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ChartBarIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setFormData({
      email: 'demo4@wealthwise.com',
      password: 'demo123'
    });
  };

  const features = [
    'Real-time portfolio tracking',
    'AI-powered investment recommendations',
    'Comprehensive financial analytics',
    'Secure and encrypted data'
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
        <div className="max-w-md w-full space-y-8 animate-fade-in">
          {/* Logo and Header */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-2xl shadow-indigo-500/25">
                <ChartBarIcon className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gradient mb-2">
              WealthWise
            </h1>
            <h2 className="text-2xl font-semibold text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-gray-600">
              Sign in to manage your investments
            </p>
          </div>
          
          {/* Demo Credentials Card */}
          <div className="card-glass bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-xl border border-indigo-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <SparklesIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Try Demo Account</h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Explore all features instantly
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="btn-primary bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-sm"
              >
                Use Demo
              </button>
            </div>
            <div className="mt-3 pt-3 border-t border-indigo-100">
              <p className="text-xs text-gray-600">
                <span className="font-medium">Email:</span> demo4@wealthwise.com
              </p>
              <p className="text-xs text-gray-600 mt-1">
                <span className="font-medium">Password:</span> demo123
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4 animate-slide-down">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/30"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                  Create one now
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Panel - Feature Showcase */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center h-full px-12 xl:px-20">
          <div className="max-w-lg">
            <h2 className="text-4xl font-bold text-white mb-6">
              Smart Investment Management
            </h2>
            <p className="text-xl text-white/90 mb-12">
              Take control of your financial future with AI-powered insights and real-time portfolio tracking.
            </p>
            
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-center space-x-4 animate-slide-up"
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <CheckCircleIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <p className="text-lg text-white">
                    {feature}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-white/20">
              <p className="text-white/80 text-sm">
                Trusted by over 10,000 investors worldwide
              </p>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30"
                    />
                  ))}
                </div>
                <div className="text-white">
                  <p className="text-sm font-semibold">+10,000</p>
                  <p className="text-xs text-white/80">Active Users</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 h-64 w-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 h-96 w-96 bg-purple-300/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default Login;