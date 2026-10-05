import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchWishlist, 
  fetchWishlistCount, 
  addToWishlist, 
  removeFromWishlist, 
  clearWishlist, 
  moveWishlistItemToCart 
} from './wishlistThunks';

const initialState = {
  items: [],
  count: 0,
  loading: false,
  itemLoading: null,
  movingToCartProductId: null,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1
  }
};

const updateStateWithWishlistData = (state, payload) => {
  // If payload contains full paginated list
  if (payload?.data?.items) {
    state.items = payload.data.items;
    if (payload.data.pagination) {
      state.pagination = payload.data.pagination;
      state.count = payload.data.pagination.total;
    }
  } 
  // If payload contains just the count (from count endpoint)
  else if (payload?.data?.count !== undefined) {
    state.count = payload.data.count;
  }
  // If payload contains { wishlist, cart } from moveToCart
  else if (payload?.data?.wishlist?.items) {
    state.items = payload.data.wishlist.items;
    if (payload.data.wishlist.pagination) {
      state.pagination = payload.data.wishlist.pagination;
      state.count = payload.data.wishlist.pagination.total;
    }
  }
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Wishlist
    builder.addCase(fetchWishlist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchWishlist.fulfilled, (state, action) => {
      state.loading = false;
      updateStateWithWishlistData(state, action.payload);
    });
    builder.addCase(fetchWishlist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch Wishlist Count
    builder.addCase(fetchWishlistCount.fulfilled, (state, action) => {
      updateStateWithWishlistData(state, action.payload);
    });

    // Add To Wishlist
    builder.addCase(addToWishlist.pending, (state, action) => {
      state.itemLoading = action.meta.arg.productId;
      state.error = null;
    });
    builder.addCase(addToWishlist.fulfilled, (state, action) => {
      state.itemLoading = null;
      updateStateWithWishlistData(state, action.payload);
    });
    builder.addCase(addToWishlist.rejected, (state, action) => {
      state.itemLoading = null;
      state.error = action.payload;
    });

    // Remove From Wishlist
    builder.addCase(removeFromWishlist.pending, (state, action) => {
      state.itemLoading = action.meta.arg;
      state.error = null;
    });
    builder.addCase(removeFromWishlist.fulfilled, (state, action) => {
      state.itemLoading = null;
      updateStateWithWishlistData(state, action.payload);
    });
    builder.addCase(removeFromWishlist.rejected, (state, action) => {
      state.itemLoading = null;
      state.error = action.payload;
    });

    // Clear Wishlist
    builder.addCase(clearWishlist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(clearWishlist.fulfilled, (state, action) => {
      state.loading = false;
      state.items = [];
      state.count = 0;
      state.pagination.total = 0;
    });
    builder.addCase(clearWishlist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Move to Cart
    builder.addCase(moveWishlistItemToCart.pending, (state, action) => {
      state.movingToCartProductId = action.meta.arg;
      state.error = null;
    });
    builder.addCase(moveWishlistItemToCart.fulfilled, (state, action) => {
      state.movingToCartProductId = null;
      updateStateWithWishlistData(state, action.payload);
    });
    builder.addCase(moveWishlistItemToCart.rejected, (state, action) => {
      state.movingToCartProductId = null;
      state.error = action.payload;
    });
  },
});

export default wishlistSlice.reducer;
