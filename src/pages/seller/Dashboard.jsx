import React, { useEffect, useState } from 'react';
import { FiDollarSign, FiPackage, FiShoppingBag, FiClock } from 'react-icons/fi';
import sellerApi from '../../services/sellerApi';
import { useToast } from '../../context/ToastContext';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await sellerApi.getDashboardSummary();
        setSummary(res.data);
      } catch (err) {
        addToast('Failed to load dashboard data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [addToast]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>)}
        </div>
      </div>
    );
  }

  const statCards = [
    { name: 'Total Revenue', value: `₹${summary?.revenue?.toFixed(2) || '0.00'}`, icon: FiDollarSign, color: 'bg-green-100 text-green-600' },
    { name: 'Total Orders', value: summary?.totalOrders || 0, icon: FiShoppingBag, color: 'bg-blue-100 text-blue-600' },
    { name: 'Total Products', value: summary?.totalProducts || 0, icon: FiPackage, color: 'bg-purple-100 text-purple-600' },
    { name: 'Pending Orders', value: summary?.pendingOrders || 0, icon: FiClock, color: 'bg-yellow-100 text-yellow-600' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-5 flex items-center">
              <div className={`p-3 rounded-full ${stat.color} mr-4`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 truncate">{stat.name}</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <p className="text-gray-500">More charts and analytics are available in the Analytics section.</p>
      </div>
    </div>
  );
};

export default Dashboard;
