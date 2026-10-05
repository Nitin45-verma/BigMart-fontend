import React, { useEffect, useState } from 'react';
import adminApi from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const handleModerate = async (productId, status) => {
    const reason = window.prompt(`Enter reason to mark product as ${status}:`);
    if (reason === null) return;
    try {
      await adminApi.moderateProduct(productId, { status, reason });
      addToast(`Product marked as ${status}`, 'success');
      fetchProducts();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to moderate product', 'error');
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
                        <button onClick={() => handleModerate(p._id, 'suspended')} className="text-red-600 hover:text-red-900">Suspend</button>
                      )}
                      {p.status === 'suspended' && (
                        <button onClick={() => handleModerate(p._id, 'active')} className="text-green-600 hover:text-green-900">Activate</button>
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

export default Products;
