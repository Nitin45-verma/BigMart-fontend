import React, { useState, useEffect } from 'react';
import { FiX, FiMapPin } from 'react-icons/fi';

const AddressForm = ({ initialData, onSubmit, onCancel, isSaving, error }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    addressType: 'home',
    isDefault: false,
    latitude: null,
    longitude: null
  });

  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName || '',
        phone: initialData.phone || '',
        addressLine1: initialData.addressLine1 || '',
        addressLine2: initialData.addressLine2 || '',
        landmark: initialData.landmark || '',
        city: initialData.city || '',
        state: initialData.state || '',
        postalCode: initialData.postalCode || '',
        country: initialData.country || 'India',
        addressType: initialData.addressType || 'home',
        isDefault: initialData.isDefault || false,
        latitude: initialData.latitude || null,
        longitude: initialData.longitude || null
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }
    
    setIsLocating(true);
    setLocationError('');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));
        setIsLocating(false);
      },
      (error) => {
        setLocationError('Failed to get location. Please enable location permissions.');
        setIsLocating(false);
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          {initialData ? 'Edit Address' : 'Add New Address'}
        </h3>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-500"
            aria-label="Cancel"
          >
            <FiX className="h-6 w-6" />
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">Address Line 1 *</label>
            <input
              type="text"
              id="addressLine1"
              name="addressLine1"
              required
              value={formData.addressLine1}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="House/Flat No., Building, Street"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700">Address Line 2</label>
            <input
              type="text"
              id="addressLine2"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Area, Sector, Village"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="landmark" className="block text-sm font-medium text-gray-700">Landmark</label>
            <input
              type="text"
              id="landmark"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City *</label>
            <input
              type="text"
              id="city"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">State *</label>
            <input
              type="text"
              id="state"
              name="state"
              required
              value={formData.state}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code (PIN) *</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              required
              value={formData.postalCode}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country *</label>
            <select
              id="country"
              name="country"
              required
              value={formData.country}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="India">India</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Coordinates</label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={isLocating}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <FiMapPin className="mr-2 -ml-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                {isLocating ? 'Locating...' : 'Use Current Location'}
              </button>
              {formData.latitude && formData.longitude && (
                <span className="text-sm text-green-600 font-medium">
                  ✓ Location captured for delivery
                </span>
              )}
            </div>
            {locationError && (
              <p className="mt-2 text-sm text-red-600">{locationError}</p>
            )}
            {!formData.latitude && (
               <p className="mt-2 text-xs text-yellow-600">
                  Please capture your location to enable distance-based delivery fee calculation at checkout.
               </p>
            )}
          </div>

          <div className="sm:col-span-1 mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="addressType"
                  value="home"
                  checked={formData.addressType === 'home'}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Home</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="addressType"
                  value="work"
                  checked={formData.addressType === 'work'}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Work</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="addressType"
                  value="other"
                  checked={formData.addressType === 'other'}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Other</span>
              </label>
            </div>
          </div>
          
          <div className="sm:col-span-2">
            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="isDefault"
                  name="isDefault"
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="isDefault" className="font-medium text-gray-700">
                  Make this my default address
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSaving}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Address'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
