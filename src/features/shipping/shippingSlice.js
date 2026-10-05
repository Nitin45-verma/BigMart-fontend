import { createSlice } from '@reduxjs/toolkit';
import { getShippingQuote } from './shippingThunks';

const initialState = {
  quote: null,
  selectedAddressId: null, // Track which address the quote belongs to
  loading: false,
  error: null
};

const shippingSlice = createSlice({
  name: 'shipping',
  initialState,
  reducers: {
    invalidateShippingQuote: (state) => {
      state.quote = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getShippingQuote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getShippingQuote.fulfilled, (state, action) => {
        state.loading = false;
        state.quote = action.payload.quote;
        state.selectedAddressId = action.payload.addressId;
      })
      .addCase(getShippingQuote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.quote = null;
      });
  }
});

export const { invalidateShippingQuote } = shippingSlice.actions;
export default shippingSlice.reducer;
