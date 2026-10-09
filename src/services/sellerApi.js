import api from './api';

const sellerApi = {
  // Dashboard
  getDashboardSummary: async () => {
    const response = await api.get('/seller/dashboard/summary');
    return response.data;
  },
  getDashboardSales: async () => {
    const response = await api.get('/seller/dashboard/sales');
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/seller/dashboard/profile');
    return response.data;
  },
  
  // Analytics
  getAnalyticsOverview: async () => {
    const response = await api.get('/seller/analytics/overview');
    return response.data;
  },
  getSalesTrend: async (params) => {
    const response = await api.get('/seller/analytics/sales-trend', { params });
    return response.data;
  },
  
  // Products
  getProducts: async (params) => {
    const response = await api.get('/seller/products', { params });
    return response.data;
  },
  getProductById: async (productId) => {
    const response = await api.get(`/seller/products/${productId}`);
    return response.data;
  },
  createProduct: async (productData) => {
    const response = await api.post('/seller/products', productData);
    return response.data;
  },
  updateProduct: async (productId, productData) => {
    const response = await api.patch(`/seller/products/${productId}`, productData);
    return response.data;
  },
  deleteProduct: async (productId) => {
    const response = await api.delete(`/seller/products/${productId}`);
    return response.data;
  },

  // Product Images
  uploadProductImage: async (productId, formData, onUploadProgress) => {
    const response = await api.post(`/seller/products/${productId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress
    });
    return response.data;
  },
  deleteProductImage: async (productId, fileId) => {
    const response = await api.delete(`/seller/products/${productId}/images/${fileId}`);
    return response.data;
  },
  reorderProductImages: async (productId, imageIds) => {
    const response = await api.patch(`/seller/products/${productId}/images/reorder`, { imageIds });
    return response.data;
  },

  // Orders & Fulfillments
  getOrders: async (params) => {
    const response = await api.get('/seller/dashboard/orders', { params });
    return response.data;
  },
  getOrderById: async (orderId) => {
    const response = await api.get(`/seller/dashboard/orders/${orderId}`);
    return response.data;
  },
  getFulfillments: async (params) => {
    const response = await api.get('/seller/fulfillments', { params });
    return response.data;
  },
  getFulfillmentById: async (id) => {
    const response = await api.get(`/seller/fulfillments/${id}`);
    return response.data;
  },
  confirmFulfillment: async (id) => {
    const response = await api.patch(`/seller/fulfillments/${id}/confirm`);
    return response.data;
  },
  packFulfillment: async (id) => {
    const response = await api.patch(`/seller/fulfillments/${id}/pack`);
    return response.data;
  },
  shipFulfillment: async (id, shippingData) => {
    const response = await api.patch(`/seller/fulfillments/${id}/ship`, shippingData);
    return response.data;
  },

  // Inventory
  getInventory: async (params) => {
    const response = await api.get('/seller/inventory', { params });
    return response.data;
  },
  adjustInventory: async (productId, data) => {
    const response = await api.post(`/seller/inventory/${productId}/adjust`, data);
    return response.data;
  },

  // Wallet
  getWallet: async () => {
    const response = await api.get('/seller/wallet');
    return response.data;
  },
  getTransactions: async (params) => {
    const response = await api.get('/seller/wallet/transactions', { params });
    return response.data;
  },
  getPayouts: async (params) => {
    const response = await api.get('/seller/wallet/payouts', { params });
    return response.data;
  },
  requestPayout: async (data) => {
    const response = await api.post('/seller/wallet/payouts', data);
    return response.data;
  }
};

export default sellerApi;
