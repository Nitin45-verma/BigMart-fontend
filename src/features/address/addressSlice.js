import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from './addressThunks';

const initialState = {
  addresses: [],
  selectedAddressId: null, // Used for checkout
  loading: false,
  saving: false,
  deletingId: null,
  settingDefaultId: null,
  error: null
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    selectCheckoutAddress: (state, action) => {
      state.selectedAddressId = action.payload;
    },
    clearAddressError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Addresses
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
        
        // Auto-select default address if none is selected
        if (!state.selectedAddressId && action.payload.length > 0) {
          const defaultAddr = action.payload.find(a => a.isDefault);
          if (defaultAddr) {
            state.selectedAddressId = defaultAddr._id;
          } else {
            state.selectedAddressId = action.payload[0]._id;
          }
        }
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Address
      .addCase(createAddress.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.saving = false;
        // If this is the only address, make it selected
        if (state.addresses.length === 0) {
          state.selectedAddressId = action.payload._id;
        }
        
        // If backend returned it as default, we must unset others
        if (action.payload.isDefault) {
          state.addresses.forEach(a => { a.isDefault = false; });
          state.selectedAddressId = action.payload._id;
        }
        
        state.addresses.push(action.payload);
      })
      .addCase(createAddress.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      
      // Update Address
      .addCase(updateAddress.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.saving = false;
        const index = state.addresses.findIndex(a => a._id === action.payload._id);
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
        // If it was updated to be default
        if (action.payload.isDefault) {
          state.addresses.forEach(a => {
            if (a._id !== action.payload._id) a.isDefault = false;
          });
          state.selectedAddressId = action.payload._id;
        }
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      
      // Delete Address
      .addCase(deleteAddress.pending, (state, action) => {
        state.deletingId = action.meta.arg;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.deletingId = null;
        state.addresses = state.addresses.filter(a => a._id !== action.payload);
        
        // If deleted address was selected, unset selection
        if (state.selectedAddressId === action.payload) {
          state.selectedAddressId = null;
          // try to re-select default
          const defaultAddr = state.addresses.find(a => a.isDefault);
          if (defaultAddr) {
            state.selectedAddressId = defaultAddr._id;
          } else if (state.addresses.length > 0) {
            state.selectedAddressId = state.addresses[0]._id;
          }
        }
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.deletingId = null;
        state.error = action.payload;
      })
      
      // Set Default Address
      .addCase(setDefaultAddress.pending, (state, action) => {
        state.settingDefaultId = action.meta.arg;
        state.error = null;
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.settingDefaultId = null;
        state.addresses.forEach(a => {
          a.isDefault = (a._id === action.payload);
        });
        state.selectedAddressId = action.payload;
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.settingDefaultId = null;
        state.error = action.payload;
      });
  }
});

export const { selectCheckoutAddress, clearAddressError } = addressSlice.actions;
export default addressSlice.reducer;
