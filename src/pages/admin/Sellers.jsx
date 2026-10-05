import React, { useEffect, useState } from 'react';
import adminApi from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';

const Sellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchSellers = async () => {
    try {
      const res = await adminApi.getSellers();
      setSellers(res.data.sellers || res.data);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to load sellers', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, [addToast]);

  const handleAction = async (id, actionStr) => {
    if (!window.confirm(`Are you sure you want to ${actionStr} this seller?`)) return;
    try {
      if (actionStr === 'suspend') {
        await adminApi.suspendSeller(id, { reason: 'Admin Action' });
      } else if (actionStr === 'reactivate') {
        await adminApi.reactivateSeller(id);
      } else if (actionStr === 'block') {
        await adminApi.blockSeller(id, { reason: 'Admin Action' });
      } else if (actionStr === 'unblock') {
        await adminApi.unblockSeller(id);
      }
      addToast(`Seller ${actionStr}ed successfully`, 'success');
      fetchSellers();
    } catch (err) {
      addToast(err.response?.data?.message || `Failed to ${actionStr} seller`, 'error');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading sellers...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Seller Management</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sellers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No sellers found.</td>
                </tr>
              ) : (
                sellers.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-900">{s.businessName}</p>
                      <p className="text-xs text-gray-500">GSTIN: {s.gstin || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {s.user?.email || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{s.businessType}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize 
                        ${s.status === 'suspended' || s.status === 'blocked' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      {s.status !== 'suspended' && s.status !== 'blocked' && (
                        <button onClick={() => handleAction(s._id, 'suspend')} className="text-yellow-600 hover:text-yellow-900">Suspend</button>
                      )}
                      {s.status === 'suspended' && (
                        <button onClick={() => handleAction(s._id, 'reactivate')} className="text-green-600 hover:text-green-900">Reactivate</button>
                      )}
                      {s.status !== 'blocked' && (
                        <button onClick={() => handleAction(s._id, 'block')} className="text-red-600 hover:text-red-900">Block</button>
                      )}
                      {s.status === 'blocked' && (
                        <button onClick={() => handleAction(s._id, 'unblock')} className="text-indigo-600 hover:text-indigo-900">Unblock</button>
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

export default Sellers;
