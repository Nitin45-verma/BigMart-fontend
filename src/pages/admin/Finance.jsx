import React, { useEffect, useState } from 'react';
import adminApi from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';

const Finance = () => {
  const [finance, setFinance] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchFinance = async () => {
      try {
        const res = await adminApi.getFinanceOverview();
        setFinance(res.data);
      } catch (err) {
        addToast('Failed to load finance overview', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchFinance();
  }, [addToast]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading finance data...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Finance Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Gross Sales</h3>
          <p className="text-3xl font-bold text-gray-900">₹{finance?.grossSales?.toFixed(2) || '0.00'}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Platform Fees</h3>
          <p className="text-3xl font-bold text-indigo-600">₹{finance?.platformFees?.toFixed(2) || '0.00'}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Refunds Processed</h3>
          <p className="text-3xl font-bold text-red-600">₹{finance?.refunds?.toFixed(2) || '0.00'}</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Seller Payouts</h3>
          <p className="text-3xl font-bold text-blue-600">₹{finance?.sellerPayouts?.toFixed(2) || '0.00'}</p>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-medium text-blue-900 mb-2">Ledger Integrity</h3>
        <p className="text-sm text-blue-700">
          All financial calculations displayed here are aggregated securely in the backend. 
          The frontend does not modify or re-calculate any gross transaction volumes to ensure ledger parity.
        </p>
      </div>
    </div>
  );
};

export default Finance;
