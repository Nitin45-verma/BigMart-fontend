import api from './api';

const adminApi = {
  // Dashboard
  getDashboardSummary: async () => {
    const response = await api.get('/admin/dashboard/summary');
    return response.data;
  },

  // Users
  getUsers: async (params) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },
  getUserById: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },
  blockUser: async (id, data) => {
    const response = await api.patch(`/admin/users/${id}/block`, data);
    return response.data;
  },

  // Sellers
  getSellers: async (params) => {
    const response = await api.get('/admin/sellers', { params });
    return response.data;
  },
  getSellerById: async (id) => {
    const response = await api.get(`/admin/sellers/${id}`);
    return response.data;
  },
  blockSeller: async (id, data) => {
    const response = await api.patch(`/admin/sellers/${id}/block`, data);
    return response.data;
  },
  unblockSeller: async (id) => {
    const response = await api.patch(`/admin/sellers/${id}/unblock`);
    return response.data;
  },
  suspendSeller: async (id, data) => {
    const response = await api.patch(`/admin/sellers/${id}/suspend`, data);
    return response.data;
  },
  reactivateSeller: async (id) => {
    const response = await api.patch(`/admin/sellers/${id}/reactivate`);
    return response.data;
  },

  // Seller Applications
  getSellerApplications: async (params) => {
    const response = await api.get('/admin/seller-applications', { params });
    return response.data;
  },
  approveSellerApplication: async (id) => {
    const response = await api.patch(`/admin/seller-applications/${id}/approve`);
    return response.data;
  },
  rejectSellerApplication: async (id, data) => {
    const response = await api.patch(`/admin/seller-applications/${id}/reject`, data);
    return response.data;
  },

  // Categories
  getCategories: async () => {
    const response = await api.get('/admin/categories');
    return response.data;
  },
  getCategoryById: async (id) => {
    const response = await api.get(`/admin/categories/${id}`);
    return response.data;
  },
  createCategory: async (data) => {
    const response = await api.post('/admin/categories', data);
    return response.data;
  },
  updateCategory: async (id, data) => {
    const response = await api.patch(`/admin/categories/${id}`, data);
    return response.data;
  },
  deleteCategory: async (id) => {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  },

  // Products
  getProducts: async (params) => {
    const response = await api.get('/admin/products', { params });
    return response.data;
  },
  getProductById: async (id) => {
    const response = await api.get(`/admin/products/${id}`);
    return response.data;
  },
  moderateProduct: async (id, data) => {
    const response = await api.patch(`/admin/products/${id}/moderate`, data);
    return response.data;
  },

  // Orders
  getOrders: async (params) => {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },
  getOrderById: async (id) => {
    const response = await api.get(`/admin/orders/${id}`);
    return response.data;
  },
  updateOrderStatus: async (id, data) => {
    const response = await api.patch(`/admin/orders/${id}/status`, data);
    return response.data;
  },

  // Returns
  getTransforms: async (params) => {
    const response = await api.get('/admin/returns', { params });
    return response.data;
  },
  getReturnById: async (id) => {
    const response = await api.get(`/admin/returns/${id}`);
    return response.data;
  },
  approveReturn: async (id) => {
    const response = await api.patch(`/admin/returns/${id}/approve`);
    return response.data;
  },
  rejectReturn: async (id, data) => {
    const response = await api.patch(`/admin/returns/${id}/reject`, data);
    return response.data;
  },
  processReturnRefund: async (id, data) => {
    const response = await api.patch(`/admin/returns/${id}/refund`, data);
    return response.data;
  },

  // Finance
  getFinanceOverview: async (params) => {
    const response = await api.get('/admin/finance/summary', { params });
    return response.data;
  },

  // Audit Logs
  getAuditLogs: async (params) => {
    const response = await api.get('/admin/audit-logs', { params });
    return response.data;
  },

  // Analytics
  getAnalyticsOverview: async () => {
    const response = await api.get('/admin/analytics/overview');
    return response.data;
  },
  
  // Support
  getSupportStats: async () => {
    const response = await api.get('/admin/support/stats');
    return response.data;
  },
  getSupportTickets: async (params) => {
    const response = await api.get('/admin/support/tickets', { params });
    return response.data;
  },
  getSupportTicket: async (id) => {
    const response = await api.get(`/admin/support/tickets/${id}`);
    return response.data;
  },
  addSupportMessage: async (id, data) => {
    const response = await api.post(`/admin/support/tickets/${id}/messages`, data);
    return response.data;
  },
  changeSupportStatus: async (id, data) => {
    const response = await api.patch(`/admin/support/tickets/${id}/status`, data);
    return response.data;
  },
  assignSupportTicket: async (id, data) => {
    const response = await api.patch(`/admin/support/tickets/${id}/assign`, data);
    return response.data;
  },
  escalateSupportTicket: async (id, data) => {
    const response = await api.patch(`/admin/support/tickets/${id}/escalate`, data);
    return response.data;
  },
};

export default adminApi;
