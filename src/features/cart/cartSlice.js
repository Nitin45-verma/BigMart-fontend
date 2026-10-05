import { createSlice } from '@reduxjs/toolkit';
import { fetchCart, addToCart, updateCartItem, removeCartItem, clearCart } from './cartThunks';

const initialState = {
  cart: null,
  items: [],
  cartTotal: 0,
  itemCount: 0,
  loading: false,
  updatingItemId: null,
  removingItemId: null,
  clearing: false,
  error: null,
  lastUpdated: null,
};

const updateStateWithCartData = (state, payload) => {
  if (payload?.data?.cart) {
    const { cart } = payload.data;
    state.cart = cart;
    state.items = cart.items || [];
    state.cartTotal = cart.cartTotal || 0;
    state.itemCount = cart.itemCount || 0;
    state.lastUpdated = cart.updatedAt || new Date().toISOString();
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Cart
    builder.addCase(fetchCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.loading = false;
      updateStateWithCartData(state, action.payload);
    });
    builder.addCase(fetchCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Add To Cart
    builder.addCase(addToCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.loading = false;
      updateStateWithCartData(state, action.payload);
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update Item
    builder.addCase(updateCartItem.pending, (state, action) => {
      state.updatingItemId = action.meta.arg.productId;
      state.error = null;
    });
    builder.addCase(updateCartItem.fulfilled, (state, action) => {
      state.updatingItemId = null;
      updateStateWithCartData(state, action.payload);
    });
    builder.addCase(updateCartItem.rejected, (state, action) => {
      state.updatingItemId = null;
      state.error = action.payload;
    });

    // Remove Item
    builder.addCase(removeCartItem.pending, (state, action) => {
      state.removingItemId = action.meta.arg;
      state.error = null;
    });
    builder.addCase(removeCartItem.fulfilled, (state, action) => {
      state.removingItemId = null;
      updateStateWithCartData(state, action.payload);
    });
    builder.addCase(removeCartItem.rejected, (state, action) => {
      state.removingItemId = null;
      state.error = action.payload;
    });

    // Clear Cart
    builder.addCase(clearCart.pending, (state) => {
      state.clearing = true;
      state.error = null;
    });
    builder.addCase(clearCart.fulfilled, (state, action) => {
      state.clearing = false;
      updateStateWithCartData(state, action.payload);
    });
    builder.addCase(clearCart.rejected, (state, action) => {
      state.clearing = false;
      state.error = action.payload;
    });
  },
});

export default cartSlice.reducer;
