import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress } from '../../features/address/addressThunks';
import AddressCard from '../../components/address/AddressCard';
import AddressForm from '../../components/address/AddressForm';
import { FiPlus, FiAlertCircle } from 'react-icons/fi';
import { useToast } from '../../context/ToastContext';

const AddressManagement = () => {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const { addresses, loading, saving, deletingId, settingDefaultId, error } = useSelector((state) => state.address);
  
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleAddClick = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEditClick = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingAddress) {
        await dispatch(updateAddress({ addressId: editingAddress._id, addressData: formData })).unwrap();
        addToast('Address updated successfully', 'success');
      } else {
        await dispatch(createAddress(formData)).unwrap();
        addToast('Address added successfully', 'success');
      }
      setShowForm(false);
      setEditingAddress(null);
    } catch (err) {
      addToast(err || 'Failed to save address', 'error');
    }
  };

  const handleDelete = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await dispatch(deleteAddress(addressId)).unwrap();
        addToast('Address deleted successfully', 'success');
      } catch (err) {
        addToast(err || 'Failed to delete address', 'error');
      }
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await dispatch(setDefaultAddress(addressId)).unwrap();
      addToast('Default address updated', 'success');
    } catch (err) {
      addToast(err || 'Failed to set default address', 'error');
    }
  };

  if (loading && addresses.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold mb-8">My Addresses</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
        {!showForm && (
          <button
            onClick={handleAddClick}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FiPlus className="mr-2 -ml-1 h-5 w-5" />
            Add New Address
          </button>
        )}
      </div>

      {showForm ? (
        <div className="mb-10 max-w-3xl">
          <AddressForm 
            initialData={editingAddress} 
            onSubmit={handleSubmit} 
            onCancel={handleCancelForm}
            isSaving={saving}
            error={error}
          />
        </div>
      ) : (
        <>
          {addresses.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="mx-auto h-16 w-16 text-gray-400 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <FiAlertCircle className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No addresses saved</h3>
              <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto mb-6">
                You haven't saved any addresses yet. Add an address for faster checkout.
              </p>
              <button
                onClick={handleAddClick}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                <FiPlus className="mr-2 -ml-1 h-5 w-5" />
                Add Address
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {addresses.map((address) => (
                <AddressCard
                  key={address._id}
                  address={address}
                  onEdit={handleEditClick}
                  onDelete={handleDelete}
                  onSetDefault={handleSetDefault}
                  isDeleting={deletingId}
                  isSettingDefault={settingDefaultId}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AddressManagement;
