import { createAsyncThunk } from '@reduxjs/toolkit';
import { productApi } from '../../services/productApi';

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productApi.getCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await productApi.getProducts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  'products/fetchProductDetails',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await productApi.getProductBySlug(slug);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product details');
    }
  }
);

// Recommendations
export const fetchHomeRecommendations = createAsyncThunk(
  'products/fetchHomeRecommendations',
  async (_, { rejectWithValue }) => {
    try {
      const [newArrivals, trending, topRated, bestDeals] = await Promise.all([
        productApi.getNewArrivals({ limit: 4 }),
        productApi.getTrending({ limit: 4 }),
        productApi.getTopRated({ limit: 4 }),
        productApi.getBestDeals({ limit: 4 }),
      ]);
      return {
        newArrivals: newArrivals.data.data.products,
        trending: trending.data.data.products,
        topRated: topRated.data.data.products,
        bestDeals: bestDeals.data.data.products,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recommendations');
    }
  }
);
