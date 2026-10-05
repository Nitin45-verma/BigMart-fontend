import React, { useEffect, useState } from 'react';
import adminApi from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';

const SellerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchApplications = async () => {
    try {
      const res = await adminApi.getSellerApplications();
      setApplications(res.data.applications || res.data);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to load seller applications', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [addToast]);

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this seller application?')) return;
    try {
      await adminApi.approveSellerApplication(id);
      addToast('Application approved', 'success');
      fetchApplications();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to approve', 'error');
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
      await adminApi.rejectSellerApplication(id, { reason });
      addToast('Application rejected', 'success');
      fetchApplications();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to reject', 'error');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading applications...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Seller Applications</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">GSTIN / Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No pending applications found.</td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.businessName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.user?.name || app.user?.email || 'Unknown'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.gstin || 'N/A'} / {app.businessType || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize 
                        ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          app.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      {app.status === 'pending' && (
                        <>
                          <button onClick={() => handleApprove(app._id)} className="text-green-600 hover:text-green-900">Approve</button>
                          <button onClick={() => handleReject(app._id)} className="text-red-600 hover:text-red-900">Reject</button>
                        </>
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

export default SellerApplications;
