import React, { useEffect, useRef, useState } from 'react';
import sellerApi from '../../services/sellerApi';
import { useToast } from '../../context/ToastContext';

const TYPE_LABELS = {
  ORDER_EARNING: 'Order Earning',
  PLATFORM_FEE: 'Platform Fee',
  REFUND_DEBIT: 'Refund Debit',
  CANCELLATION_DEBIT: 'Cancellation Debit',
  PAYOUT_REQUEST: 'Payout Request',
  PAYOUT_COMPLETED: 'Payout Completed',
  PAYOUT_FAILED: 'Payout Failed',
  PAYOUT_REVERSED: 'Payout Reversed',
  ADJUSTMENT_CREDIT: 'Adjustment Credit',
  ADJUSTMENT_DEBIT: 'Adjustment Debit',
  SETTLEMENT_AVAILABLE: 'Settlement Available'
};

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const fetchedRef = useRef(false);

  const fetchData = async () => {
    try {
      const [walletRes, txRes] = await Promise.all([
        sellerApi.getWallet(),
        sellerApi.getTransactions()
      ]);
      // GET /seller/wallet returns: { success, data: { pendingBalance, availableBalance, ... } }
      setWallet(walletRes.data);
      // GET /seller/wallet/transactions returns: { success, data: [tx, ...], pagination }
      const txData = txRes.data;
      setTransactions(Array.isArray(txData) ? txData : (txData?.transactions || txData?.data || []));
    } catch (err) {
      addToast('Failed to load wallet data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchData();
  }, []);

  const handleRequestPayout = async () => {
    if (!wallet?.availableBalance || wallet.availableBalance <= 0) {
      addToast('No available balance to withdraw', 'error');
      return;
    }
    if (!window.confirm(`Request payout of ₹${wallet.availableBalance.toFixed(2)}?`)) return;
    try {
      await sellerApi.requestPayout({ amount: wallet.availableBalance });
      addToast('Payout requested successfully', 'success');
      // Reset ref so we can re-fetch
      fetchedRef.current = false;
      setLoading(true);
      fetchedRef.current = true;
      fetchData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to request payout', 'error');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1,2,3].map(i => <div key={i} className="h-28 bg-gray-200 rounded-lg"></div>)}
        </div>
        <div className="h-48 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Earnings & Wallet</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Available Balance</h3>
          <p className="text-3xl font-bold text-green-600">₹{wallet?.availableBalance?.toFixed(2) || '0.00'}</p>
          <button 
            onClick={handleRequestPayout}
            disabled={!wallet?.availableBalance || wallet.availableBalance <= 0}
            className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Request Payout
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Pending Escrow</h3>
          <p className="text-3xl font-bold text-yellow-500">₹{wallet?.pendingBalance?.toFixed(2) || '0.00'}</p>
          <p className="text-xs text-gray-400 mt-2">Awaiting delivery/return window</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Earned</h3>
          <p className="text-3xl font-bold text-gray-900">₹{wallet?.totalEarned?.toFixed(2) || '0.00'}</p>
          <p className="text-xs text-gray-400 mt-2">Lifetime gross earnings</p>
        </div>
      </div>

      {/* Additional metrics row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-center">
          <h3 className="text-xs font-medium text-gray-500 mb-1">Platform Fees Paid</h3>
          <p className="text-xl font-bold text-indigo-600">₹{wallet?.totalPlatformFees?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-center">
          <h3 className="text-xs font-medium text-gray-500 mb-1">Total Refunded</h3>
          <p className="text-xl font-bold text-red-600">₹{wallet?.totalRefunded?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-center">
          <h3 className="text-xs font-medium text-gray-500 mb-1">Total Withdrawn</h3>
          <p className="text-xl font-bold text-blue-600">₹{wallet?.totalWithdrawn?.toFixed(2) || '0.00'}</p>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">
                    No transactions found. Earnings will appear here after a customer completes a paid order containing your products.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  // Direction-based display: credit = positive (green), debit = negative (red), transfer = neutral (blue)
                  const isCredit = tx.direction === 'credit';
                  const isDebit = tx.direction === 'debit';
                  const colorClass = isCredit ? 'text-green-600' : isDebit ? 'text-red-600' : 'text-blue-600';
                  const sign = isCredit ? '+' : isDebit ? '−' : '↔';

                  return (
                    <tr key={tx._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {TYPE_LABELS[tx.type] || tx.type?.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tx.order?.orderNumber || tx.referenceId || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {tx.description || '—'}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${colorClass}`}>
                        {sign}₹{Math.abs(tx.amount).toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
