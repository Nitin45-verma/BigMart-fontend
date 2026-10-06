import React, { useEffect, useState } from 'react';
import adminApi from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import { FiTrendingUp, FiShoppingBag, FiUsers, FiDollarSign } from 'react-icons/fi';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await adminApi.getAnalyticsOverview();
        setData(res.data);
      } catch (err) {
        addToast('Failed to load analytics', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [addToast]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading analytics...</div>;
  }

  const statCards = [
    { name: 'Total Revenue', value: `₹${data?.totalRevenue?.toFixed(2) || '0.00'}`, icon: FiDollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Total Orders', value: data?.totalOrders || 0, icon: FiShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Avg Order Value', value: `₹${data?.averageOrderValue?.toFixed(2) || '0.00'}`, icon: FiTrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Active Users', value: data?.activeUsers || 0, icon: FiUsers, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Marketplace Analytics</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-5 flex items-center">
              <div className={`p-3 rounded-full ${stat.bg} ${stat.color} mr-4`}>
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

      <div className="bg-white shadow rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Analytics Expansion</h3>
        <p className="text-gray-600 mb-4">
          The backend supports extensive Analytics endpoints (`/api/v1/admin/analytics/sales`, `/top-products`, `/customers`, etc.). 
          These can be seamlessly wired into visual graphs (e.g. Chart.js, Recharts) in the future. Data is securely aggregated server-side.
        </p>
      </div>
    </div>
  );
};

export default Analytics;
