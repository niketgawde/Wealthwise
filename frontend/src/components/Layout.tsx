import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PriceTicker from './PriceTicker';
import {
  HomeIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  SparklesIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  Cog6ToothIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, color: 'text-indigo-600' },
    { name: 'Portfolio', href: '/portfolio', icon: BriefcaseIcon, color: 'text-purple-600' },
    { name: 'Investments', href: '/investments', icon: CurrencyDollarIcon, color: 'text-green-600' },
    { name: 'Recommendations', href: '/recommendations', icon: SparklesIcon, color: 'text-amber-600' },
    { name: 'Transactions', href: '/transactions', icon: DocumentTextIcon, color: 'text-blue-600' },
  ];

  const [hasNotifications] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <PriceTicker />
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:pt-12">
        <div className="flex flex-col flex-1 bg-white border-r border-gray-200">
          {/* Logo Header */}
          <div className="flex items-center h-16 px-6 gradient-primary">
            <ChartBarIcon className="h-8 w-8 text-white mr-3" />
            <h1 className="text-xl font-bold text-white">WealthWise</h1>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 hover-lift`}
                >
                  <item.icon
                    className={`${
                      isActive ? item.color : 'text-gray-400 group-hover:text-gray-500'
                    } mr-3 h-5 w-5 transition-colors duration-200`}
                  />
                  {item.name}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>
          
          {/* User Section */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center shadow-soft">
                  <span className="text-white font-semibold">
                    {user?.firstName?.charAt(0).toUpperCase()}{user?.lastName?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-3 w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
              Sign out
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-12 left-0 right-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-indigo-600 mr-2" />
            <h1 className="text-xl font-bold text-gradient">WealthWise</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button className="relative p-2">
              <BellIcon className="h-6 w-6 text-gray-600" />
              {hasNotifications && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden animate-fade-in">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setMobileMenuOpen(false)} />
            <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl animate-slide-in-right">
              <div className="h-full flex flex-col">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between h-16 px-4 gradient-primary">
                  <h2 className="text-lg font-semibold text-white">Menu</h2>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-md text-white hover:bg-white/20"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                
                {/* Mobile Navigation */}
                <nav className="flex-1 px-4 py-4 space-y-1">
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`${
                          isActive
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        } group flex items-center px-3 py-3 text-base font-medium rounded-lg transition-colors duration-200`}
                      >
                        <item.icon
                          className={`${
                            isActive ? item.color : 'text-gray-400'
                          } mr-3 h-6 w-6`}
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
                
                {/* Mobile User Section */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {user?.firstName?.charAt(0).toUpperCase()}{user?.lastName?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-medium text-gray-700">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center px-4 py-2 text-base font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Desktop Header Bar */}
        <header className="hidden lg:block sticky top-12 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200">
                  <BellIcon className="h-6 w-6" />
                  {hasNotifications && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                </button>
                <Link 
                  to="/settings" 
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  <Cog6ToothIcon className="h-6 w-6" />
                </Link>
              </div>
            </div>
          </div>
        </header>
        
        <main className="px-4 sm:px-6 lg:px-8 py-8 pt-20 lg:pt-8">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;