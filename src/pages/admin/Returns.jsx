import React, { useEffect, useState } from 'react';
import adminApi from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';

const Returns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedReturnId, setSelectedReturnId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const { addToast } = useToast();

  const fetchReturns = async () => {
    try {
      const res = await adminApi.getTransforms(); 
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

  const openRejectModal = (id) => {
    setSelectedReturnId(id);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      addToast('Rejection reason is required', 'error');
      return;
    }
    try {
      await adminApi.rejectReturn(selectedReturnId, { reason: rejectReason });
      addToast('Return rejected', 'success');
      setRejectModalOpen(false);
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
                          <button onClick={() => openRejectModal(ret._id)} className="text-red-600 hover:text-red-900">Reject</button>
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

      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setRejectModalOpen(false)}></div>
            <div className="relative inline-block w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Reject Return</h3>
              <form onSubmit={handleRejectSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reason for Rejection *</label>
                  <textarea 
                    required 
                    rows={3} 
                    value={rejectReason} 
                    onChange={e => setRejectReason(e.target.value)} 
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  ></textarea>
                </div>
                <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">Reject Return</button>
                  <button type="button" onClick={() => setRejectModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Returns;
