import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import sellerApi from '../../services/sellerApi';
import { useToast } from '../../context/ToastContext';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchProducts = async () => {
    try {
      const res = await sellerApi.getProducts();
      setProducts(res.data.products);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [addToast]);

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete/archive this product?')) return;
    try {
      await sellerApi.deleteProduct(productId);
      addToast('Product removed successfully', 'success');
      fetchProducts();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete product', 'error');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link 
          to="/seller/products/new" 
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-primary-600 hover:bg-primary-700"
        >
          <FiPlus className="-ml-1 mr-2 h-5 w-5" /> Add Product
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
        <ul className="divide-y divide-gray-200">
          {products.length === 0 ? (
            <li className="p-8 text-center text-gray-500">No products found. Start by adding one.</li>
          ) : (
            products.map((product) => (
              <li key={product._id}>
                <div className="px-4 py-4 flex items-center sm:px-6 hover:bg-gray-50">
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <img className="h-12 w-12 rounded-md object-cover" src={product.images[0].url} alt="" />
                        ) : (
                          <div className="h-12 w-12 rounded-md bg-gray-200 flex items-center justify-center text-gray-500 text-xs">No img</div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-primary-600 truncate">{product.name}</p>
                        <p className="text-sm text-gray-500">
                          SKU: {product.sku} &bull; Price: ₹{product.price} &bull; Stock: {product.stock}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5 flex gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${product.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {product.isPublished ? 'Published' : 'Draft'}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${product.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                        {product.status}
                      </span>
                    </div>
                  </div>
                  <div className="ml-5 flex-shrink-0 flex space-x-2">
                    <Link to={`/seller/products/${product._id}/edit`} className="text-gray-400 hover:text-gray-500">
                      <FiEdit2 className="h-5 w-5" />
                    </Link>
                    <button onClick={() => handleDelete(product._id)} className="text-red-400 hover:text-red-500">
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Products;
