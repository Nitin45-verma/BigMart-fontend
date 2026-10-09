import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import sellerApi from '../../services/sellerApi';
import { productApi } from '../../services/productApi';
import { useToast } from '../../context/ToastContext';

// ─── Constants ─────────────────────────────────────────────────────────────────
const MAX_IMAGES = 10;
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_EXT_LABEL = 'JPG, JPEG, PNG, WebP';
const GST_RATES = [0, 5, 12, 18, 28];

// ─── Helpers ───────────────────────────────────────────────────────────────────
function validateImageFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return `"${file.name}" is not allowed. Accepted formats: ${ALLOWED_EXT_LABEL}.`;
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `"${file.name}" exceeds the ${MAX_FILE_SIZE_MB} MB limit.`;
  }
  return null;
}

// ─── ProductForm ───────────────────────────────────────────────────────────────
const ProductForm = () => {
  const { productId } = useParams();
  const isEdit = Boolean(productId);
  const navigate = useNavigate();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  // ── Form state ─────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    description: '',
    brand: '',
    sku: '',
    price: '',
    compareAtPrice: '',
    costPrice: '',
    stock: '',
    gstRate: '18',
    category: '',
    weight: '',
    status: 'draft',
    isPublished: false
  });

  // ── Category state ─────────────────────────────────────────────────────────
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState(null);

  // ── Image state ────────────────────────────────────────────────────────────
  // productImages: committed images stored in product record
  const [productImages, setProductImages] = useState([]);
  // pendingUploads: local files queued but not yet uploaded
  const [pendingUploads, setPendingUploads] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  // ── Fetch categories (public, no auth required) ─────────────────────────
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCatLoading(true);
        setCatError(null);
        const res = await productApi.getCategories();
        const list = res?.data?.data?.categories ?? [];
        setCategories(list);
      } catch {
        setCatError('Failed to load categories. Please refresh the page.');
      } finally {
        setCatLoading(false);
      }
    };
    loadCategories();
  }, []);

  // ── Fetch existing product (edit mode) ───────────────────────────────────
  useEffect(() => {
    if (!isEdit) return;
    const fetchProduct = async () => {
      try {
        const res = await sellerApi.getProductById(productId);
        const p = res.data.product;
        setFormData({
          name: p.name || '',
          shortDescription: p.shortDescription || '',
          description: p.description || '',
          brand: p.brand || '',
          sku: p.sku || '',
          price: p.price ?? '',
          compareAtPrice: p.compareAtPrice ?? '',
          costPrice: p.costPrice ?? '',
          stock: p.stock ?? '',
          gstRate: p.gstRate?.toString() || '18',
          category: p.category?._id || p.category || '',
          weight: p.weight ?? '',
          status: p.status || 'draft',
          isPublished: p.isPublished || false
        });
        const sorted = [...(p.images || [])].sort((a, b) => a.sortOrder - b.sortOrder);
        setProductImages(sorted);
      } catch {
        addToast('Failed to load product', 'error');
        navigate('/seller/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [isEdit, productId, navigate, addToast]);

  // ── Input handlers ────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // ── Price validation ──────────────────────────────────────────────────────
  const validatePrices = () => {
    const errors = {};
    const price = Number(formData.price);
    const compareAtPrice = formData.compareAtPrice !== '' ? Number(formData.compareAtPrice) : null;

    if (formData.price === '' || formData.price === undefined) {
      errors.price = 'Selling price is required.';
    } else if (isNaN(price) || price < 0) {
      errors.price = 'Selling price must be a non-negative number.';
    }

    if (compareAtPrice !== null) {
      if (isNaN(compareAtPrice) || compareAtPrice < 0) {
        errors.compareAtPrice = 'Compare-at price must be a non-negative number.';
      } else if (compareAtPrice <= price) {
        errors.compareAtPrice = `Compare-at price (${compareAtPrice}) must be greater than selling price (${price}).`;
      }
    }

    return errors;
  };

  // ── Form submit ───────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    const priceErrors = validatePrices();
    if (Object.keys(priceErrors).length > 0) {
      setFieldErrors(priceErrors);
      return;
    }

    if (!formData.category) {
      setFieldErrors({ category: 'Please select a category.' });
      return;
    }

    setSubmitting(true);

    const payload = {
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      price: Number(formData.price),
      compareAtPrice: formData.compareAtPrice !== '' ? Number(formData.compareAtPrice) : undefined,
      costPrice: formData.costPrice !== '' ? Number(formData.costPrice) : undefined,
      stock: Number(formData.stock),
      gstRate: Number(formData.gstRate),
      status: formData.status,
      isPublished: formData.isPublished
    };

    if (formData.shortDescription) payload.shortDescription = formData.shortDescription;
    if (formData.description) payload.description = formData.description;
    if (formData.brand) payload.brand = formData.brand;
    if (formData.weight !== '') payload.weight = Number(formData.weight);

    // Submit payload with status and isPublished

    try {
      if (isEdit) {
        await sellerApi.updateProduct(productId, payload);
        addToast('Product updated successfully', 'success');
      } else {
        const res = await sellerApi.createProduct(payload);
        addToast('Product created! You can now add images below.', 'success');
        const newId = res?.data?.product?._id;
        navigate(newId ? `/seller/products/${newId}/edit` : '/seller/products');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save product', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  //  IMAGE MANAGEMENT (edit mode only)
  // ─────────────────────────────────────────────────────────────────────────

  const addFilesToQueue = useCallback((files) => {
    const fileArray = Array.from(files);
    const slots = MAX_IMAGES - productImages.length;
    if (slots <= 0) {
      addToast(`Maximum ${MAX_IMAGES} images allowed.`, 'error');
      return;
    }

    const toAdd = fileArray.slice(0, slots);
    if (fileArray.length > slots) {
      addToast(`Only ${slots} more image(s) can be added. Extra files were ignored.`, 'info');
    }

    const newPending = toAdd.map(file => ({
      localId: `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      progress: 0,
      error: validateImageFile(file),
      uploading: false,
      done: false
    }));

    setPendingUploads(prev => [...prev, ...newPending]);
  }, [productImages.length, addToast]);

  const handleFileInputChange = (e) => {
    if (e.target.files?.length) {
      addFilesToQueue(e.target.files);
      e.target.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) addFilesToQueue(e.dataTransfer.files);
  };

  const removePending = (localId) => {
    setPendingUploads(prev => {
      const item = prev.find(p => p.localId === localId);
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
      return prev.filter(p => p.localId !== localId);
    });
  };

  const uploadPending = async (localId) => {
    const item = pendingUploads.find(p => p.localId === localId);
    if (!item || item.error || item.uploading || item.done) return;

    setPendingUploads(prev =>
      prev.map(p => p.localId === localId ? { ...p, uploading: true, progress: 0, error: null } : p)
    );

    const fd = new FormData();
    fd.append('image', item.file);

    try {
      const result = await sellerApi.uploadProductImage(
        productId,
        fd,
        (progressEvent) => {
          const pct = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setPendingUploads(prev =>
            prev.map(p => p.localId === localId ? { ...p, progress: pct } : p)
          );
        }
      );

      const newImage = result?.data?.image;
      if (newImage) setProductImages(prev => [...prev, newImage]);

      setPendingUploads(prev => {
        const found = prev.find(p => p.localId === localId);
        if (found?.previewUrl) URL.revokeObjectURL(found.previewUrl);
        return prev.filter(p => p.localId !== localId);
      });

      addToast('Image uploaded successfully', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Upload failed. Please try again.';
      setPendingUploads(prev =>
        prev.map(p => p.localId === localId ? { ...p, uploading: false, progress: 0, error: msg } : p)
      );
    }
  };

  const uploadAllPending = () => {
    pendingUploads.filter(p => !p.error && !p.uploading && !p.done).forEach(p => uploadPending(p.localId));
  };

  const handleDeleteImage = async (fileId) => {
    if (!window.confirm('Remove this image?')) return;
    try {
      const result = await sellerApi.deleteProductImage(productId, fileId);
      const updated = result?.data?.images ?? productImages.filter(img => img.fileId !== fileId);
      setProductImages([...updated].sort((a, b) => a.sortOrder - b.sortOrder));
      addToast('Image removed', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete image', 'error');
    }
  };

  const moveImage = async (index, direction) => {
    const newImages = [...productImages];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newImages.length) return;
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];

    // Optimistic update
    setProductImages(newImages);

    try {
      const imageIds = newImages.map(img => img.fileId);
      const result = await sellerApi.reorderProductImages(productId, imageIds);
      const updated = result?.data?.images ?? newImages;
      setProductImages([...updated].sort((a, b) => a.sortOrder - b.sortOrder));
    } catch (err) {
      // Revert on failure
      setProductImages(productImages);
      addToast(err.response?.data?.message || 'Failed to reorder images', 'error');
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="animate-spin inline-block w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full mb-2" />
        <p>Loading product…</p>
      </div>
    );
  }

  const inputCls = (field) =>
    `mt-1 block w-full rounded-md shadow-sm sm:text-sm py-2 px-3 border ${
      fieldErrors[field]
        ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
    }`;

  const readyToUploadCount = pendingUploads.filter(p => !p.error && !p.uploading && !p.done).length;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>
        <Link to="/seller/products" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          ← Back to Products
        </Link>
      </div>

      {/* Main form card */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">

          {/* SECTION: Basic Information */}
          <div className="pt-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Basic Information</h3>
            <div className="space-y-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Name *</label>
            <input
              id="product-name"
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className={inputCls('name')}
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Short Description</label>
            <input
              id="product-short-description"
              type="text"
              name="shortDescription"
              maxLength={300}
              value={formData.shortDescription}
              onChange={handleChange}
              className={inputCls('shortDescription')}
              placeholder="Brief summary (max 300 chars)"
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Description</label>
            <textarea
              id="product-description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className={inputCls('description')}
            />
          </div>

          {/* SKU / Brand */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">SKU *</label>
              <input
                id="product-sku"
                type="text"
                name="sku"
                required
                value={formData.sku}
                onChange={handleChange}
                className={inputCls('sku')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Brand</label>
              <input
                id="product-brand"
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className={inputCls('brand')}
              />
            </div>
            </div>
          </div>
          </div>

          {/* SECTION: Category */}
          <div className="pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Category</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category *</label>
            {catLoading ? (
              <p className="mt-1 text-sm text-gray-400">Loading categories…</p>
            ) : catError ? (
              <div className="mt-1">
                <p className="text-sm text-red-500">{catError}</p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-1 text-xs text-blue-600 underline"
                >
                  Retry
                </button>
              </div>
            ) : (
              <select
                id="product-category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className={inputCls('category')}
              >
                <option value="">— Select a category —</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
            {fieldErrors.category && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.category}</p>
            )}
            </div>
          </div>

          {/* SECTION: Pricing & GST */}
          <div className="pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Pricing & GST</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Selling Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Selling Price (₹) *</label>
              <input
                id="product-price"
                type="number"
                step="0.01"
                min="0"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                className={inputCls('price')}
              />
              {fieldErrors.price && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.price}</p>
              )}
            </div>

            {/* Compare-at Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Compare-at Price (₹)
                <span className="ml-1 text-gray-400 text-xs font-normal">must be &gt; Selling Price</span>
              </label>
              <input
                id="product-compare-at-price"
                type="number"
                step="0.01"
                min="0"
                name="compareAtPrice"
                value={formData.compareAtPrice}
                onChange={handleChange}
                className={inputCls('compareAtPrice')}
              />
              {fieldErrors.compareAtPrice && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.compareAtPrice}</p>
              )}
            </div>

            {/* Cost Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Cost Price (₹)</label>
              <input
                id="product-cost-price"
                type="number"
                step="0.01"
                min="0"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleChange}
                className={inputCls('costPrice')}
              />
            </div>
            
            {/* GST Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700">GST Rate (%) *</label>
              <select
                id="product-gst-rate"
                name="gstRate"
                value={formData.gstRate}
                onChange={handleChange}
                className={inputCls('gstRate')}
              >
                {GST_RATES.map(r => (
                  <option key={r} value={r}>{r}%</option>
                ))}
              </select>
            </div>
            </div>
          </div>

          {/* SECTION: Inventory & Weight */}
          <div className="pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Inventory & Physical</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {isEdit ? 'Stock' : 'Initial Stock *'}
                </label>
                <input
                  id="product-stock"
                  type="number"
                  min="0"
                  name="stock"
                  required={!isEdit}
                  value={formData.stock}
                  onChange={handleChange}
                  disabled={isEdit}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm py-2 px-3 border ${
                    isEdit
                      ? 'bg-gray-100 text-gray-500 border-gray-200'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
                {isEdit && (
                  <p className="text-xs text-gray-400 mt-1">Use the Inventory tab to adjust stock.</p>
                )}
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                <input
                  id="product-weight"
                  type="number"
                  step="0.01"
                  min="0"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className={inputCls('weight')}
                />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Visibility & Status</h3>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  id="product-status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={inputCls('status')}
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="out_of_stock">Out of Stock</option>
                  <option value="archived">Archived</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">Only Active products appear in the public store.</p>
              </div>

              <div className="flex items-center pt-6">
                <input
                  id="product-isPublished"
                  name="isPublished"
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="product-isPublished" className="ml-2 block text-sm text-gray-900">
                  Publish Product (visible to customers)
                </label>
              </div>
            </div>
            {formData.status === 'draft' && (
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Your product is currently a <strong>Draft</strong>. To make it visible to customers, set Status to <strong>Active</strong> and check <strong>Publish Product</strong>.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-5 border-t border-gray-200 flex justify-end gap-3">
            <Link
              to="/seller/products"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              id="product-form-submit"
              type="submit"
              disabled={submitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>

      {/* ── Image Management (edit mode only) ──────────────────────────────── */}
      {isEdit && (
        <div className="mt-8 bg-white shadow sm:rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>
              <p className="text-sm text-gray-500 mt-0.5">
                {productImages.length} / {MAX_IMAGES} images &bull; {ALLOWED_EXT_LABEL} &bull; max {MAX_FILE_SIZE_MB} MB each
              </p>
            </div>
            {readyToUploadCount > 0 && (
              <button
                type="button"
                onClick={uploadAllPending}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Upload All ({readyToUploadCount})
              </button>
            )}
          </div>

          {/* Drop zone */}
          {productImages.length < MAX_IMAGES && (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                dragOver
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }`}
            >
              <svg className="mx-auto h-10 w-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-gray-500">
                <span className="font-medium text-blue-600">Click to browse</span> or drag &amp; drop
              </p>
              <p className="text-xs text-gray-400 mt-1">{ALLOWED_EXT_LABEL} &bull; up to {MAX_FILE_SIZE_MB} MB each</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={handleFileInputChange}
              />
            </div>
          )}

          {/* Committed images grid */}
          {productImages.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Uploaded Images</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {productImages.map((img, index) => (
                  <div
                    key={img.fileId}
                    className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square bg-gray-50"
                  >
                    <img
                      src={img.url}
                      alt={img.altText || `Product image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {/* Hover controls */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-1.5">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => moveImage(index, -1)}
                          disabled={index === 0}
                          title="Move left"
                          className="p-1 bg-white/90 rounded text-gray-700 hover:bg-white disabled:opacity-30 text-xs"
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImage(index, 1)}
                          disabled={index === productImages.length - 1}
                          title="Move right"
                          className="p-1 bg-white/90 rounded text-gray-700 hover:bg-white disabled:opacity-30 text-xs"
                        >
                          →
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img.fileId)}
                        title="Remove image"
                        className="p-1 bg-red-600 rounded text-white hover:bg-red-700 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                    {index === 0 && (
                      <span className="absolute top-1 left-1 bg-blue-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                        Main
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending uploads list */}
          {pendingUploads.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Pending Uploads</p>
              <div className="space-y-2">
                {pendingUploads.map(item => (
                  <div
                    key={item.localId}
                    className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    {/* Thumbnail */}
                    <div className="w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-gray-100 border border-gray-200">
                      <img src={item.previewUrl} alt="preview" className="w-full h-full object-cover" />
                    </div>

                    {/* File info + progress */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 truncate">{item.file.name}</p>
                      <p className="text-xs text-gray-400">{(item.file.size / 1024 / 1024).toFixed(2)} MB</p>
                      {item.error ? (
                        <p className="text-xs text-red-500 mt-0.5">{item.error}</p>
                      ) : item.uploading ? (
                        <div className="mt-1">
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full transition-all duration-200"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{item.progress}%</p>
                        </div>
                      ) : null}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      {!item.error && !item.uploading && (
                        <button
                          type="button"
                          onClick={() => uploadPending(item.localId)}
                          className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Upload
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removePending(item.localId)}
                        disabled={item.uploading}
                        className="text-xs px-2 py-1 bg-white border border-gray-300 text-gray-600 rounded hover:bg-gray-50 disabled:opacity-40"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {productImages.length === 0 && pendingUploads.length === 0 && (
            <p className="text-sm text-gray-400 mt-3 text-center">
              No images yet. Add up to {MAX_IMAGES} images above.
            </p>
          )}

          {/* Visibility tip instead of moderation notice */}
          <div className="mt-5 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-xs text-blue-800">
              <strong>Tip:</strong> Images will be visible as soon as the product is published and active.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductForm;
