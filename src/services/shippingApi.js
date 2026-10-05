import api from './api';

const shippingApi = {
  getQuote: async (addressId) => {
    const response = await api.post('/shipping/quote', { addressId });
    return response.data;
  }
};

export default shippingApi;
