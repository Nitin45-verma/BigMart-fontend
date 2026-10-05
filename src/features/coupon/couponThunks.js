import { createAsyncThunk } from '@reduxjs/toolkit';
import couponApi from '../../services/couponApi';

export const validateCoupon = createAsyncThunk(
  'coupon/validateCoupon',
  async (code, { rejectWithValue }) => {
    try {
      const data = await couponApi.validateCoupon(code);
      return data.data; // Should return { coupon, discountAmount, ... } based on backend
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to validate coupon');
    }
  }
);
