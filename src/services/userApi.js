import api from './api';

const userApi = {
  getProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
  
  updateProfile: async (profileData) => {
    const response = await api.patch('/users/me', profileData);
    return response.data;
  }
};

export default userApi;
