import { createSlice } from '@reduxjs/toolkit';
import { createOrder, verifyPayment } from './checkoutThunks';

const initialState = {
  orderCreationLoading: false,
  verificationLoading: false,
  createdOrder: null, // Holds razorpayOrderId, keyId, amount, etc.
  paymentStatus: 'idle', // 'idle' | 'initializing' | 'open' | 'verifying' | 'success' | 'failed'
  error: null,
  successOrderId: null,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    resetCheckout: (state) => {
      state.orderCreationLoading = false;
      state.verificationLoading = false;
      state.createdOrder = null;
      state.paymentStatus = 'idle';
      state.error = null;
      state.successOrderId = null;
    },
    setPaymentStatus: (state, action) => {
      state.paymentStatus = action.payload;
    },
    setCheckoutError: (state, action) => {
      state.error = action.payload;
      state.paymentStatus = 'failed';
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.orderCreationLoading = true;
        state.error = null;
        state.paymentStatus = 'initializing';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderCreationLoading = false;
        state.createdOrder = action.payload;
        // Don't set paymentStatus to open here, we do it when Razorpay actually opens
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderCreationLoading = false;
        state.error = action.payload;
        state.paymentStatus = 'failed';
      })
      
      // Verify Payment
      .addCase(verifyPayment.pending, (state) => {
        state.verificationLoading = true;
        state.error = null;
        state.paymentStatus = 'verifying';
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.verificationLoading = false;
        state.paymentStatus = 'success';
        // The backend returns { message, order }
        state.successOrderId = action.payload.order?._id; 
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.verificationLoading = false;
        state.error = action.payload;
        state.paymentStatus = 'failed';
      });
  }
});

export const { resetCheckout, setPaymentStatus, setCheckoutError } = checkoutSlice.actions;
export default checkoutSlice.reducer;
