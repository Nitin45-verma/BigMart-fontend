import { createAsyncThunk } from '@reduxjs/toolkit';
import wishlistApi from '../../services/wishlistApi';
import { fetchCart } from '../cart/cartThunks';

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (params, { rejectWithValue }) => {
    try {
      const response = await wishlistApi.getWishlist(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

export const fetchWishlistCount = createAsyncThunk(
  'wishlist/fetchWishlistCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await wishlistApi.getCount();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist count');
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async ({ productId }, { rejectWithValue }) => {
    try {
      const response = await wishlistApi.addItem({ productId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add item to wishlist');
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await wishlistApi.removeItem(productId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove item from wishlist');
    }
  }
);

export const clearWishlist = createAsyncThunk(
  'wishlist/clearWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await wishlistApi.clearWishlist();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear wishlist');
    }
  }
);

export const moveWishlistItemToCart = createAsyncThunk(
  'wishlist/moveToCart',
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      const response = await wishlistApi.moveToCart(productId);
      // Backend returns { wishlist, cart }
      // We could also re-fetch the cart directly to ensure state sync, 
      // but if the cart state is updated properly from the response it's fine.
      // To keep it simple and ensure cart slice updates, we can dispatch fetchCart.
      dispatch(fetchCart());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to move item to cart');
    }
  }
);
