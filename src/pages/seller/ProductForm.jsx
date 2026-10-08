import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import sellerApi from '../../services/sellerApi';
import { useToast } from '../../context/ToastContext';

const ProductForm = () => {
  const { productId } = useParams();
  const isEdit = Boolean(productId);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    price: '',
    compareAtPrice: '',
    costPrice: '',
    stock: '',
    gstRate: '18',
    category: '', // Usually ObjectId but we might need dropdown
    isPublished: false
  });

  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const res = await sellerApi.getProductById(productId);
          const p = res.data.product;
          setFormData({
            name: p.name || '',
            description: p.description || '',
            sku: p.sku || '',
            price: p.price || '',
            compareAtPrice: p.compareAtPrice || '',
            costPrice: p.costPrice || '',
            stock: p.stock || '',
            gstRate: p.gstRate?.toString() || '18',
            category: p.category?._id || p.category || '',
            isPublished: p.isPublished || false
          });
        } catch (err) {
          addToast('Failed to load product', 'error');
          navigate('/seller/products');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [isEdit, productId, navigate, addToast]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Formatting data for backend
    const payload = {
      ...formData,
      price: Number(formData.price),
      compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
      costPrice: formData.costPrice ? Number(formData.costPrice) : undefined,
      stock: Number(formData.stock),
      gstRate: Number(formData.gstRate)
    };

    try {
      if (isEdit) {
        await sellerApi.updateProduct(productId, payload);
        addToast('Product updated successfully', 'success');
      } else {
        await sellerApi.createProduct(payload);
        addToast('Product created successfully', 'success');
        navigate('/seller/products');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save product', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading product...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
        <Link to="/seller/products" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          &larr; Back to Products
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name *</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 px-3 border" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description *</label>
            <textarea name="description" required rows={4} value={formData.description} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 px-3 border" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">SKU *</label>
              <input type="text" name="sku" required value={formData.sku} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 px-3 border" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Category ID *</label>
              <input type="text" name="category" required value={formData.category} onChange={handleChange} placeholder="MongoDB ObjectId" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 px-3 border" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Price (₹) *</label>
              <input type="number" step="0.01" min="0" name="price" required value={formData.price} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 px-3 border" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Compare at Price (₹)</label>
              <input type="number" step="0.01" min="0" name="compareAtPrice" value={formData.compareAtPrice} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 px-3 border" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Initial Stock *</label>
              <input type="number" min="0" name="stock" required value={formData.stock} onChange={handleChange} disabled={isEdit} className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm py-2 px-3 border ${isEdit ? 'bg-gray-100 text-gray-500' : 'focus:ring-primary-500 focus:border-primary-500'}`} />
              {isEdit && <p className="text-xs text-gray-500 mt-1">Use Inventory tab to adjust stock</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">GST Rate (%) *</label>
              <select name="gstRate" value={formData.gstRate} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm py-2 px-3 border">
                <option value="0">0%</option>
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
                <option value="28">28%</option>
              </select>
            </div>
          </div>

          <div className="flex items-center mt-4">
            <input type="checkbox" name="isPublished" id="isPublished" checked={formData.isPublished} onChange={handleChange} className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
            <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
              Publish Product (visible to customers)
            </label>
          </div>

          <div className="pt-5 border-t border-gray-200 flex justify-end">
            <Link to="/seller/products" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 mr-3">
              Cancel
            </Link>
            <button type="submit" disabled={submitting} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-900 bg-primary-600 hover:bg-primary-700 disabled:opacity-50">
              {submitting ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
      
      {isEdit && (
        <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Image Management</h3>
          <p className="text-sm text-blue-700 mb-4">
            Product image upload via ImageKit requires backend direct integration for production deployment.
            The frontend securely defers image injection to the native ImageKit interface in Step 10.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductForm;
