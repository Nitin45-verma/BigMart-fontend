import api from './api';

export const productApi = {
  // Categories
  getCategories: () => api.get('/categories'),
  getCategoryBySlug: (slug) => api.get(`/categories/slug/${slug}`),

  // Products
  getProducts: (params) => api.get('/products', { params }),
  getProductBySlug: (slug) => api.get(`/products/${slug}`),
  
  // Recommendations
  getNewArrivals: (params) => api.get('/recommendations/new-arrivals', { params }),
  getTrending: (params) => api.get('/recommendations/trending', { params }),
  getTopRated: (params) => api.get('/recommendations/top-rated', { params }),
  getBestDeals: (params) => api.get('/recommendations/best-deals', { params }),
  getRelatedProducts: (productId) => api.get(`/recommendations/related/${productId}`),

  // Reviews
  getProductReviews: (productId, params) => api.get(`/products/${productId}/reviews`, { params }),
};
