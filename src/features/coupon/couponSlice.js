import { createSlice } from '@reduxjs/toolkit';
import { validateCoupon } from './couponThunks';

const initialState = {
  appliedCoupon: null,
  discountAmount: 0,
  loading: false,
  error: null
};

const couponSlice = createSlice({
  name: 'coupon',
  initialState,
  reducers: {
    removeCoupon: (state) => {
      state.appliedCoupon = null;
      state.discountAmount = 0;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedCoupon = action.payload.coupon || action.payload; // fallback depending on response
        state.discountAmount = action.payload.discountAmount || action.payload.discount || 0;
      })
      .addCase(validateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.appliedCoupon = null;
        state.discountAmount = 0;
      });
  }
});

export const { removeCoupon } = couponSlice.actions;
export default couponSlice.reducer;
