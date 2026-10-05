import api from './api';

const orderApi = {
  createOrder: async (orderData) => {
    // orderData expects { addressId, couponCode }
    const response = await api.post('/orders', orderData);
    return response.data;
  },
  
  getOrderById: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },
  
  getUserOrders: async (page = 1, limit = 20) => {
    const response = await api.get(`/orders?page=${page}&limit=${limit}`);
    return response.data;
  },

  cancelOrder: async (orderId, reason) => {
    const response = await api.patch(`/orders/${orderId}/cancel`, { reason });
    return response.data;
  },

  createReturn: async (orderId, returnData) => {
    const response = await api.post(`/orders/${orderId}/returns`, returnData);
    return response.data;
  },

  getOrderTracking: async (orderId) => {
    const response = await api.get(`/orders/${orderId}/tracking`);
    return response.data;
  }
};

export default orderApi;
