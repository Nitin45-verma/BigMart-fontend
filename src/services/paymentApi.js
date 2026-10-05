import api from './api';

const paymentApi = {
  verifyPayment: async (verificationData) => {
    const response = await api.post('/payments/razorpay/verify', verificationData);
    return response.data;
  }
};

export default paymentApi;
