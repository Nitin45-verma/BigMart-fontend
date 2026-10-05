import api from './api';

const couponApi = {
  validateCoupon: async (code) => {
    const response = await api.post('/coupons/validate', { code });
    return response.data;
  }
};

export default couponApi;
