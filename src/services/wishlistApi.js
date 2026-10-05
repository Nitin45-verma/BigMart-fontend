import api from './api';

const wishlistApi = {
  getWishlist: (params) => api.get('/wishlist', { params }),
  getCount: () => api.get('/wishlist/count'),
  checkStatus: (productId) => api.get(`/wishlist/check/${productId}`),
  addItem: (data) => api.post('/wishlist/items', data),
  removeItem: (productId) => api.delete(`/wishlist/items/${productId}`),
  clearWishlist: () => api.delete('/wishlist'),
  moveToCart: (productId) => api.post(`/wishlist/items/${productId}/move-to-cart`),
};

export default wishlistApi;
