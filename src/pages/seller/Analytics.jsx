import React, { useEffect, useState } from 'react';
import sellerApi from '../../services/sellerApi';
import { useToast } from '../../context/ToastContext';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await sellerApi.getAnalyticsOverview();
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

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics Overview</h1>
      
      <div className="bg-white shadow rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Revenue</h3>
            <p className="text-2xl font-bold text-gray-900">₹{data?.totalRevenue?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Orders</h3>
            <p className="text-2xl font-bold text-gray-900">{data?.totalOrders || 0}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Items Sold</h3>
            <p className="text-2xl font-bold text-gray-900">{data?.totalItemsSold || 0}</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Insights</h3>
          <p className="text-gray-600 text-sm">
            Detailed time-series charts (via <code>/api/v1/seller/analytics/sales-trend</code>) and Product break-downs 
            can be rendered here using Chart.js or Recharts once fully populated with ledger history.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
