import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // Slices will be added here later (e.g. auth, cart, products)
  },
});
