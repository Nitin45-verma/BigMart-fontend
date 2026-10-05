import { createAsyncThunk } from '@reduxjs/toolkit';
import shippingApi from '../../services/shippingApi';

export const getShippingQuote = createAsyncThunk(
  'shipping/getQuote',
  async (addressId, { rejectWithValue, getState }) => {
    try {
      const data = await shippingApi.getQuote(addressId);
      // Backend should return quote in data.data
      return { quote: data.data, addressId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to calculate shipping');
    }
  }
);
