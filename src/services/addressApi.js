import api from './api';

const addressApi = {
  getAddresses: async () => {
    const response = await api.get('/users/me/addresses');
    return response.data;
  },
  
  createAddress: async (addressData) => {
    const response = await api.post('/users/me/addresses', addressData);
    return response.data;
  },
  
  updateAddress: async (addressId, addressData) => {
    const response = await api.patch(`/users/me/addresses/${addressId}`, addressData);
    return response.data;
  },
  
  deleteAddress: async (addressId) => {
    const response = await api.delete(`/users/me/addresses/${addressId}`);
    return response.data;
  },
  
  setDefaultAddress: async (addressId) => {
    const response = await api.patch(`/users/me/addresses/${addressId}/default`);
    return response.data;
  }
};

export default addressApi;
