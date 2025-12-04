import React, { useState, useEffect } from 'react';
import { Menu, Bell, User, Plus, TrendingUp, TrendingDown, Minus, ChevronRight, LogOut, Settings } from 'lucide-react';

const StockDashboardWireframes = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');
  
  // Available stocks
  const AVAILABLE_STOCKS = ['GOOG', 'TSLA', 'AMZN', 'META', 'NVDA'];
  
  // Stock prices state - shared across all users (simulating real market data)
  const [stockPrices, setStockPrices] = useState({
    GOOG: { price: 178.34, change: -0.5, previousPrice: 178.34 },
    TSLA: { price: 242.67, change: 1.8, previousPrice: 242.67 },
    AMZN: { price: 183.45, change: 1.2, previousPrice: 183.45 },
    META: { price: 512.89, change: 0.8, previousPrice: 512.89 },
    NVDA: { price: 891.25, change: 3.2, previousPrice: 891.25 }
  });

  // Users and their subscriptions
  const [users, setUsers] = useState({
    'user1@email.com': { subscriptions: ['TSLA', 'GOOG', 'NVDA'] },
    'user2@email.com': { subscriptions: ['AMZN', 'META'] }
  });

  // Update stock prices every second
  useEffect(() => {
    const interval = setInterval(() => {
      setStockPrices(prevPrices => {
        const newPrices = { ...prevPrices };
        
        AVAILABLE_STOCKS.forEach(ticker => {
          // Random price change between -2% and +2%
          const changePercent = (Math.random() - 0.5) * 4;
          const changeAmount = (newPrices[ticker].price * changePercent) / 100;
          const newPrice = Math.max(1, newPrices[ticker].price + changeAmount);
          
          newPrices[ticker] = {
            price: parseFloat(newPrice.toFixed(2)),
            change: parseFloat(changePercent.toFixed(2)),
            previousPrice: newPrices[ticker].price
          };
        });
        
        return newPrices;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Login handler
  const handleLogin = (email) => {
    if (!users[email]) {
      setUsers(prev => ({
        ...prev,
        [email]: { subscriptions: [] }
      }));
    }
    setCurrentUser(email);
    setCurrentView('dashboard');
  };

  // Subscribe to stock
  const handleSubscribe = (ticker) => {
    if (currentUser && !users[currentUser].subscriptions.includes(ticker)) {
      setUsers(prev => ({
        ...prev,
        [currentUser]: {
          ...prev[currentUser],
          subscriptions: [...prev[currentUser].subscriptions, ticker]
        }
      }));
    }
  };

  // Unsubscribe from stock
  const handleUnsubscribe = (ticker) => {
    if (currentUser) {
      setUsers(prev => ({
        ...prev,
        [currentUser]: {
          ...prev[currentUser],
          subscriptions: prev[currentUser].subscriptions.filter(t => t !== ticker)
        }
      }));
    }
  };

  const getStockFullName = (ticker) => {
    const names = {
      GOOG: 'Alphabet Inc.',
      TSLA: 'Tesla Inc.',
      AMZN: 'Amazon.com Inc.',
      META: 'Meta Platforms Inc.',
      NVDA: 'NVIDIA Corp.'
    };
    return names[ticker];
  };

  const getStockColor = (ticker) => {
    const colors = {
      GOOG: { bg: 'bg-blue-100', text: 'text-blue-600' },
      TSLA: { bg: 'bg-red-100', text: 'text-red-600' },
      AMZN: { bg: 'bg-orange-100', text: 'text-orange-600' },
      META: { bg: 'bg-blue-100', text: 'text-blue-600' },
      NVDA: { bg: 'bg-green-100', text: 'text-green-600' }
    };
    return colors[ticker];
  };

  // Login View
  const LoginView = () => {
    const [email, setEmail] = useState('');

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">StockWatch Pro</h1>
            <p className="text-gray-600 text-sm mt-2">Real-time Stock Portfolio Dashboard</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button 
              onClick={() => handleLogin(email)}
              disabled={!email}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Sign In
            </button>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Quick Login:</p>
              <div className="space-y-2">
                <button 
                  onClick={() => handleLogin('user1@email.com')}
                  className="w-full text-left px-3 py-2 bg-white border border-blue-200 rounded text-sm hover:bg-blue-50"
                >
                  user1@email.com
                </button>
                <button 
                  onClick={() => handleLogin('user2@email.com')}
                  className="w-full text-left px-3 py-2 bg-white border border-blue-200 rounded text-sm hover:bg-blue-50"
                >
                  user2@email.com
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Dashboard View
  const DashboardView = () => {
    const userSubscriptions = users[currentUser]?.subscriptions || [];
    
    const totalValue = userSubscriptions.reduce((sum, ticker) => 
      sum + stockPrices[ticker].price, 0
    );

    const avgChange = userSubscriptions.length > 0 
      ? userSubscriptions.reduce((sum, ticker) => sum + stockPrices[ticker].change, 0) / userSubscriptions.length
      : 0;

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Stock Broker</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">Live Updates</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">{currentUser}</span>
              </div>
              <button 
                onClick={() => {
                  setCurrentUser(null);
                  setCurrentView('login');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-6">
          {/* Portfolio Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Portfolio Summary</h2>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">${totalValue.toFixed(2)}</p>
                <p className={`text-sm flex items-center gap-1 mt-1 ${avgChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {avgChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(2)}% avg
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Stocks</p>
                <p className="text-2xl font-bold text-gray-900">{userSubscriptions.length}</p>
                <p className="text-sm text-gray-500 mt-1">of {AVAILABLE_STOCKS.length} available</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                <p className="text-2xl font-bold text-gray-900">Live</p>
                <p className="text-sm text-gray-500 mt-1">Auto-refreshing</p>
              </div>
            </div>
          </div>

          {/* Subscribed Stocks */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">My Subscriptions</h2>
              <button 
                onClick={() => setCurrentView('subscribe')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Subscribe to Stock
              </button>
            </div>

            {userSubscriptions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="mb-4">You haven't subscribed to any stocks yet.</p>
                <button 
                  onClick={() => setCurrentView('subscribe')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Subscribe to Stocks
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {userSubscriptions.map(ticker => {
                  const stock = stockPrices[ticker];
                  const colors = getStockColor(ticker);
                  const priceMoving = stock.price !== stock.previousPrice;
                  
                  return (
                    <div 
                      key={ticker}
                      className={`border border-gray-200 rounded-lg p-4 transition-all ${
                        priceMoving ? 'ring-2 ring-blue-300' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center`}>
                            <span className={`text-lg font-bold ${colors.text}`}>{ticker[0]}</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{ticker}</h3>
                            <p className="text-sm text-gray-600">{getStockFullName(ticker)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">${stock.price.toFixed(2)}</p>
                            <p className={`text-sm flex items-center gap-1 justify-end ${
                              stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {stock.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                            </p>
                          </div>
                          <button 
                            onClick={() => handleUnsubscribe(ticker)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Minus className="w-5 h-5 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Subscribe View
  const SubscribeView = () => {
    const userSubscriptions = users[currentUser]?.subscriptions || [];

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 rotate-180" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">Subscribe to Stocks</h1>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium">{currentUser}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-600 mb-6">Select stocks to add to your dashboard. Prices update in real-time.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AVAILABLE_STOCKS.map(ticker => {
                const stock = stockPrices[ticker];
                const colors = getStockColor(ticker);
                const isSubscribed = userSubscriptions.includes(ticker);

                return (
                  <div 
                    key={ticker}
                    className={`border-2 rounded-lg p-4 transition-all ${
                      isSubscribed 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-blue-500 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center`}>
                          <span className={`text-lg font-bold ${colors.text}`}>{ticker[0]}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{ticker}</h3>
                          <p className="text-sm text-gray-600">{getStockFullName(ticker)}</p>
                        </div>
                      </div>
                      {isSubscribed ? (
                        <button 
                          onClick={() => handleUnsubscribe(ticker)}
                          className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
                        >
                          Unsubscribe
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleSubscribe(ticker)}
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                        >
                          Subscribe
                        </button>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-gray-900">${stock.price.toFixed(2)}</p>
                      <p className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* View Switcher - For Demo Purposes */}
      <div className="bg-gray-900 text-white p-4">
        <div className="flex gap-4 justify-center items-center flex-wrap">
          <div className="text-sm text-gray-400">Demo Controls:</div>
          <button
            onClick={() => {
              setCurrentUser(null);
              setCurrentView('login');
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentView === 'login' ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            Login
          </button>
          {currentUser && (
            <>
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'dashboard' ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('subscribe')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'subscribe' ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                Subscribe
              </button>
            </>
          )}
          <div className="text-sm text-gray-400">
            {currentUser ? `Logged in as: ${currentUser}` : 'Not logged in'}
          </div>
        </div>
      </div>

      {/* Render Current View */}
      {currentView === 'login' && <LoginView />}
      {currentView === 'dashboard' && currentUser && <DashboardView />}
      {currentView === 'subscribe' && currentUser && <SubscribeView />}
    </div>
  );
};

export default StockDashboardWireframes;