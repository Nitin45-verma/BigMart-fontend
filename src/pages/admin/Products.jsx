import React, { useEffect, useState } from 'react';
import adminApi from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moderateModalOpen, setModerateModalOpen] = useState(false);
  const [productToModerate, setProductToModerate] = useState(null);
  const [moderateStatus, setModerateStatus] = useState('');
  const [moderateReason, setModerateReason] = useState('');
  const [moderateLoading, setModerateLoading] = useState(false);
  const { addToast } = useToast();

  const fetchProducts = async () => {
    try {
      const res = await adminApi.getProducts();
      setProducts(res.data.products || res.data);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [addToast]);

  const openModerateModal = (productId, status) => {
    setProductToModerate(productId);
    setModerateStatus(status);
    setModerateReason('');
    setModerateModalOpen(true);
  };

  const closeModerateModal = () => {
    setModerateModalOpen(false);
    setProductToModerate(null);
    setModerateStatus('');
    setModerateReason('');
  };

  const submitModerate = async () => {
    if (!moderateReason.trim()) {
      addToast('Please provide a reason', 'error');
      return;
    }
    setModerateLoading(true);
    try {
      await adminApi.moderateProduct(productToModerate, { status: moderateStatus, reason: moderateReason });
      addToast(`Product marked as ${moderateStatus}`, 'success');
      fetchProducts();
      closeModerateModal();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to moderate product', 'error');
    } finally {
      setModerateLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading products...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Marketplace Products</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seller</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status / Publish</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No products found.</td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-500">SKU: {p.sku}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {p.seller?.businessName || p.seller?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize w-max
                          ${p.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {p.status}
                        </span>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize w-max
                          ${p.isPublished ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                          {p.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      {p.status !== 'suspended' && (
                        <button onClick={() => openModerateModal(p._id, 'suspended')} className="text-red-600 hover:text-red-900">Suspend</button>
                      )}
                      {p.status === 'suspended' && (
                        <button onClick={() => openModerateModal(p._id, 'active')} className="text-green-600 hover:text-green-900">Activate</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {moderateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeModerateModal}></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Mark product as {moderateStatus}
                  </h3>
                  <div className="mt-4">
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason</label>
                    <textarea
                      id="reason"
                      rows="3"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                      placeholder="Enter moderation reason..."
                      value={moderateReason}
                      onChange={(e) => setModerateReason(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  disabled={moderateLoading}
                  onClick={submitModerate}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {moderateLoading ? 'Saving...' : 'Confirm'}
                </button>
                <button
                  type="button"
                  onClick={closeModerateModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
