import React, { useEffect, useState } from 'react';
import sellerApi from '../../services/sellerApi';
import { useToast } from '../../context/ToastContext';

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchData = async () => {
    try {
      const [walletRes, txRes] = await Promise.all([
        sellerApi.getWallet(),
        sellerApi.getTransactions()
      ]);
      setWallet(walletRes.data.wallet || walletRes.data);
      setTransactions(txRes.data.transactions || txRes.data);
    } catch (err) {
      addToast('Failed to load wallet data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [addToast]);

  const handleRequestPayout = async () => {
    if (!window.confirm('Request payout for available balance?')) return;
    try {
      await sellerApi.requestPayout({ amount: wallet.availableBalance });
      addToast('Payout requested successfully', 'success');
      fetchData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to request payout', 'error');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading wallet...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Earnings & Wallet</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Available Balance</h3>
          <p className="text-3xl font-bold text-green-600 mb-4">₹{wallet?.availableBalance?.toFixed(2) || '0.00'}</p>
          <button 
            onClick={handleRequestPayout}
            disabled={!wallet?.availableBalance || wallet.availableBalance <= 0}
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
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
          <p className="text-xs text-gray-400 mt-2">Lifetime earnings</p>
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No transactions found.</td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="capitalize text-sm font-medium text-gray-900">{tx.type.replace('_', ' ')}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.referenceId || '-'}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
