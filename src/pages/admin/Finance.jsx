import React, { useEffect, useRef, useState } from 'react';
import adminApi from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';

const Finance = () => {
  const [finance, setFinance] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchFinance = async () => {
      try {
        const res = await adminApi.getFinanceOverview();
        // API returns: { success, data: { period, from, to, metrics: { ... } } }
        setFinance(res.data);
      } catch (err) {
        addToast('Failed to load finance overview', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchFinance();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-gray-200 rounded-lg"></div>)}
        </div>
      </div>
    );
  }

  // The service response structure is: { period, from, to, metrics: { grossSales, platformFees, ... } }
  const metrics = finance?.metrics || {};

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Finance Overview</h1>

      {finance?.period && (
        <p className="text-sm text-gray-500 mb-4">
          Period: {finance.period === 'custom' ? `${finance.from?.slice(0,10)} → ${finance.to?.slice(0,10)}` : finance.period}
        </p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Gross Sales</h3>
          <p className="text-3xl font-bold text-gray-900">₹{(metrics.grossSales ?? 0).toFixed(2)}</p>
          <p className="text-xs text-gray-400 mt-1">{metrics.paidOrderCount ?? 0} paid orders</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Platform Fees</h3>
          <p className="text-3xl font-bold text-indigo-600">₹{(metrics.platformFees ?? 0).toFixed(2)}</p>
          <p className="text-xs text-gray-400 mt-1">Estimated from item totals</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Refunds Processed</h3>
          <p className="text-3xl font-bold text-red-600">₹{(metrics.refunds ?? 0).toFixed(2)}</p>
          <p className="text-xs text-gray-400 mt-1">{metrics.refundCount ?? 0} refunds</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Shipping Collected</h3>
          <p className="text-3xl font-bold text-blue-600">₹{(metrics.shippingCollected ?? 0).toFixed(2)}</p>
          <p className="text-xs text-gray-400 mt-1">Delivery fees from paid orders</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Net Merchandise Sales</h3>
          <p className="text-3xl font-bold text-green-600">₹{(metrics.netSales ?? 0).toFixed(2)}</p>
          <p className="text-xs text-gray-400 mt-1">Gross sales − shipping</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-gray-900">{metrics.totalOrderCount ?? 0}</p>
          <p className="text-xs text-gray-400 mt-1">All statuses in period</p>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-medium text-blue-900 mb-2">Ledger Integrity</h3>
        <p className="text-sm text-blue-700">
          All financial calculations displayed here are aggregated securely in the backend from immutable order snapshots.
          The frontend does not modify or re-calculate any gross transaction volumes to ensure ledger parity.
        </p>
      </div>
    </div>
  );
};

export default Finance;
