import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Home = () => {
  const [healthStatus, setHealthStatus] = useState('Checking...');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await api.get('/health');
        if (response.data && response.data.success) {
          setHealthStatus('Backend Connected');
        } else {
          setHealthStatus('Backend Unavailable');
        }
      } catch (error) {
        setHealthStatus('Backend Unavailable');
      }
    };
    checkHealth();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Welcome to BIGMART</span>
          <span className="block text-primary-600">India's Marketplace</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Discover millions of products from verified sellers across the country. Enjoy secure payments, fast shipping, and reliable customer support.
        </p>
        
        <div className="mt-10">
          <div className="inline-flex flex-col items-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-2">System Status</h2>
            <div className="flex items-center space-x-2">
              <span className={`h-3 w-3 rounded-full ${healthStatus === 'Backend Connected' ? 'bg-green-500' : healthStatus === 'Checking...' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
              <span className="text-sm font-medium text-gray-700">{healthStatus}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Target API: {import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
