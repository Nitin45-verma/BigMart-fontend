import { createSlice } from '@reduxjs/toolkit';
import { fetchCategories, fetchProducts, fetchProductDetails, fetchHomeRecommendations } from './productThunks';

const initialState = {
  categories: [],
  categoriesLoading: false,
  
  products: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1
  },
  productsLoading: false,
  productsError: null,
  
  selectedProduct: null,
  productLoading: false,
  productError: null,

  homeRecommendations: {
    newArrivals: [],
    trending: [],
    topRated: [],
    bestDeals: []
  },
  homeRecsLoading: false,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Categories
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload.data.categories || [];
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.categoriesLoading = false;
      })
      
      // Products
      .addCase(fetchProducts.pending, (state) => {
        state.productsLoading = true;
        state.productsError = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.productsLoading = false;
        state.products = action.payload.data.products;
        state.pagination = {
          total: action.payload.data.total || 0,
          page: action.payload.data.page || 1,
          limit: action.payload.data.limit || 20,
          totalPages: action.payload.data.totalPages || 1
        };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.productsLoading = false;
        state.productsError = action.payload;
      })
      
      // Product Details
      .addCase(fetchProductDetails.pending, (state) => {
        state.productLoading = true;
        state.productError = null;
        state.selectedProduct = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.productLoading = false;
        state.selectedProduct = action.payload.data.product;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.productLoading = false;
        state.productError = action.payload;
      })

      // Home Recommendations
      .addCase(fetchHomeRecommendations.pending, (state) => {
        state.homeRecsLoading = true;
      })
      .addCase(fetchHomeRecommendations.fulfilled, (state, action) => {
        state.homeRecsLoading = false;
        state.homeRecommendations = action.payload;
      })
      .addCase(fetchHomeRecommendations.rejected, (state) => {
        state.homeRecsLoading = false;
      });
  },
});

export default productSlice.reducer;
