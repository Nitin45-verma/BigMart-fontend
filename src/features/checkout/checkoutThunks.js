import { createAsyncThunk } from '@reduxjs/toolkit';
import orderApi from '../../services/orderApi';
import paymentApi from '../../services/paymentApi';

export const createOrder = createAsyncThunk(
  'checkout/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const data = await orderApi.createOrder(orderData);
      return data.data; // { orderId, razorpayOrderId, amountPaise, keyId, ... }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create order');
    }
  }
);

export const verifyPayment = createAsyncThunk(
  'checkout/verifyPayment',
  async (verificationData, { rejectWithValue }) => {
    try {
      const data = await paymentApi.verifyPayment(verificationData);
      return data.data; // { message, order }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify payment');
    }
  }
);
