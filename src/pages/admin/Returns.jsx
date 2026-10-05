import React, { useEffect, useState } from 'react';
import adminApi from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';

const Returns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchReturns = async () => {
    try {
      const res = await adminApi.getTransforms(); // Note: method is named getTransforms in adminApi.js mapping to /admin/returns
      setReturns(res.data.returns || res.data);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to load returns', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, [addToast]);

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this return?')) return;
    try {
      await adminApi.approveReturn(id);
      addToast('Return approved', 'success');
      fetchReturns();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to approve return', 'error');
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Enter rejection reason:');
    if (reason === null) return;
    if (!reason.trim()) {
      addToast('Rejection reason is required', 'error');
      return;
    }
    try {
      await adminApi.rejectReturn(id, { reason });
      addToast('Return rejected', 'success');
      fetchReturns();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to reject return', 'error');
    }
  };

  const handleRefund = async (id) => {
    if (!window.confirm('Process refund for this return?')) return;
    try {
      await adminApi.processReturnRefund(id, { notes: 'Admin initiated refund' });
      addToast('Refund processed successfully', 'success');
      fetchReturns();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to process refund', 'error');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading returns...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Return Management</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Return ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {returns.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No returns found.</td>
                </tr>
              ) : (
                returns.map((ret) => (
                  <tr key={ret._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ret._id.substring(0, 8)}...</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ret.order?.substring(0, 8) || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{ret.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize 
                        ${ret.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          ret.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                          ret.status === 'refunded' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {ret.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      {ret.status === 'pending' && (
                        <>
                          <button onClick={() => handleApprove(ret._id)} className="text-green-600 hover:text-green-900">Approve</button>
                          <button onClick={() => handleReject(ret._id)} className="text-red-600 hover:text-red-900">Reject</button>
                        </>
                      )}
                      {ret.status === 'approved' && (
                        <button onClick={() => handleRefund(ret._id)} className="text-blue-600 hover:text-blue-900">Process Refund</button>
                      )}
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

export default Returns;
