import React, { useState, useEffect } from 'react';
import { 
  FiMapPin, FiSave, FiCompass, FiSearch, 
  FiAlertCircle, FiCheckCircle, FiInfo 
} from 'react-icons/fi';
import sellerApi from '../../services/sellerApi';
import { useToast } from '../../context/ToastContext';

const SellerProfile = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [locationSuccess, setLocationSuccess] = useState('');

  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    description: '',
    gstNumber: '',
    panNumber: '',
    verificationStatus: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    latitude: '',
    longitude: ''
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await sellerApi.getProfile();
      const profile = res.data;
      if (profile) {
        setFormData({
          businessName: profile.businessName || '',
          businessType: profile.businessType || '',
          description: profile.description || '',
          gstNumber: profile.gstNumber || '',
          panNumber: profile.panNumber || '',
          verificationStatus: profile.verificationStatus || '',
          addressLine1: profile.businessAddress?.addressLine1 || profile.addressLine1 || '',
          addressLine2: profile.businessAddress?.addressLine2 || profile.addressLine2 || '',
          city: profile.businessAddress?.city || profile.city || '',
          state: profile.businessAddress?.state || profile.state || '',
          postalCode: profile.businessAddress?.postalCode || profile.postalCode || '',
          country: profile.businessAddress?.country || profile.country || 'India',
          latitude: profile.latitude !== null && profile.latitude !== undefined ? profile.latitude : '',
          longitude: profile.longitude !== null && profile.longitude !== undefined ? profile.longitude : ''
        });
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to load seller profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setLocationError('');
    setLocationSuccess('');
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lon = Number(pos.coords.longitude.toFixed(6));
        setFormData(prev => ({
          ...prev,
          latitude: lat,
          longitude: lon
        }));
        setLocationSuccess(`Device coordinates captured: ${lat}, ${lon}`);
        setIsLocating(false);
      },
      (err) => {
        let msg = 'Failed to get location from browser.';
        if (err.code === 1) msg = 'Location access denied. Please enable location permission in your browser.';
        if (err.code === 2) msg = 'Location unavailable on your network/GPS.';
        if (err.code === 3) msg = 'Location request timed out. Please try again.';
        setLocationError(msg);
        setIsLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleGeocodeAddress = async () => {
    const { addressLine1, city, state, postalCode, country } = formData;
    if (!postalCode && !city) {
      setLocationError('Please provide at least a City or Postal Code before geocoding.');
      return;
    }
    setIsGeocoding(true);
    setLocationError('');
    setLocationSuccess('');
    
    const queries = [];
    if (addressLine1 && city) {
      queries.push(`${addressLine1}, ${city}, ${state || ''} ${postalCode || ''}, ${country || 'India'}`);
    }
    if (postalCode) {
      queries.push(`${postalCode}, ${city || ''}, ${state || ''}, ${country || 'India'}`);
    }
    if (city) {
      queries.push(`${city}, ${state || ''}, ${country || 'India'}`);
    }

    try {
      let found = null;
      for (const q of queries) {
        const cleanQuery = q.replace(/,\s*,/g, ',').trim();
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanQuery)}&limit=1`;
        const res = await fetch(url, { headers: { 'User-Agent': 'BigMart-Seller-Portal/1.0' } });
        const data = await res.json();
        if (data && data.length > 0) {
          found = data[0];
          break;
        }
      }

      if (found) {
        const lat = Number(parseFloat(found.lat).toFixed(6));
        const lon = Number(parseFloat(found.lon).toFixed(6));
        setFormData(prev => ({
          ...prev,
          latitude: lat,
          longitude: lon
        }));
        setLocationSuccess(`Geocoded via OpenStreetMap: ${found.display_name.slice(0, 90)}... (${lat}, ${lon})`);
      } else {
        setLocationError('Could not find coordinates for this address. Please refine address or use "Use Current Location".');
      }
    } catch (e) {
      setLocationError('Geocoding service unavailable. Please check connection or use "Use Current Location".');
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.latitude === '' || formData.longitude === '') {
      setLocationError('Business location coordinates are required for shipping delivery fee calculations. Please capture them using "Geocode Address" or "Use Current Location".');
      return;
    }

    const numLat = Number(formData.latitude);
    const numLon = Number(formData.longitude);

    if (isNaN(numLat) || numLat < -90 || numLat > 90) {
      setLocationError('Latitude must be a valid number between -90 and 90.');
      return;
    }
    if (isNaN(numLon) || numLon < -180 || numLon > 180) {
      setLocationError('Longitude must be a valid number between -180 and 180.');
      return;
    }

    setIsSaving(true);
    setLocationError('');
    try {
      const payload = {
        businessName: formData.businessName,
        description: formData.description,
        latitude: numLat,
        longitude: numLon,
        businessAddress: {
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          latitude: numLat,
          longitude: numLon
        }
      };
      await sellerApi.updateProfile(payload);
      addToast('Store profile & business location updated successfully!', 'success');
      setLocationSuccess('Coordinates saved and active for shipping calculations.');
      await fetchProfile();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update store profile';
      setLocationError(msg);
      addToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const hasCoordinates = 
    formData.latitude !== '' && 
    formData.longitude !== '' && 
    !isNaN(Number(formData.latitude)) && 
    !isNaN(Number(formData.longitude));

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FiMapPin className="text-primary-600" /> Store Profile & Business Location
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure your business address and exact geographic coordinates. Delivery fees for customers are calculated using these coordinates.
        </p>
      </div>

      {/* Coordinate Status Alert */}
      {hasCoordinates ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <FiCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-green-800">
            <p className="font-semibold">Dispatch Coordinates Configured</p>
            <p className="mt-0.5 text-green-700">
              Your store is active for automated distance-based delivery calculations. Coordinates: {formData.latitude}, {formData.longitude}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-300 rounded-lg p-4 flex items-start gap-3">
          <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-800">
            <p className="font-semibold">Missing Dispatch Coordinates</p>
            <p className="mt-0.5 text-red-700">
              Customers cannot calculate delivery fees or complete checkout for your products until valid dispatch coordinates are saved below.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Overview Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-3">
            Business Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Type
              </label>
              <input
                type="text"
                disabled
                value={formData.businessType ? formData.businessType.replace('_', ' ').toUpperCase() : 'N/A'}
                className="w-full bg-gray-50 border border-gray-200 text-gray-500 rounded-md px-3 py-2 text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GSTIN
              </label>
              <input
                type="text"
                disabled
                value={formData.gstNumber || 'Not provided'}
                className="w-full bg-gray-50 border border-gray-200 text-gray-500 rounded-md px-3 py-2 text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PAN Number
              </label>
              <input
                type="text"
                disabled
                value={formData.panNumber || 'Not provided'}
                className="w-full bg-gray-50 border border-gray-200 text-gray-500 rounded-md px-3 py-2 text-sm cursor-not-allowed"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description / About Your Store
              </label>
              <textarea
                name="description"
                rows={2}
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Brief description of your products and service"
              />
            </div>
          </div>
        </div>

        {/* Business Address Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-3 flex items-center justify-between">
            <span>Dispatch & Warehouse Address</span>
            <span className="text-xs text-gray-500 font-normal">Physical location of your goods</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 1 (Shop / Street / Building) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="addressLine1"
                required
                value={formData.addressLine1}
                onChange={handleChange}
                placeholder="e.g. Shop No. 12, Main Market Road"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 2 (Area / Landmark)
              </label>
              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                placeholder="e.g. Near City Clock Tower"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Jaipur"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                required
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g. Rajasthan"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code (PIN) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="postalCode"
                required
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="e.g. 302001"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Real Coordinates & Location Picker */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <FiCompass className="text-primary-600" /> Geographic Coordinates (Latitude & Longitude)
            </h2>
            <span className="text-xs text-red-500 font-medium">* Required for Delivery Calculations</span>
          </div>

          <p className="text-xs text-gray-600">
            Coordinates must correspond to your store/warehouse dispatch address. You can capture them directly using your device location or geocode them from your address above. Never invent coordinates.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              disabled={isLocating || isGeocoding}
              className="inline-flex items-center px-4 py-2 border border-primary-600 rounded-md shadow-sm text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              <FiCompass className={`mr-2 -ml-1 h-4 w-4 ${isLocating ? 'animate-spin' : ''}`} />
              {isLocating ? 'Detecting Location...' : 'Use Current Location'}
            </button>

            <button
              type="button"
              onClick={handleGeocodeAddress}
              disabled={isLocating || isGeocoding}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              <FiSearch className={`mr-2 -ml-1 h-4 w-4 ${isGeocoding ? 'animate-spin' : ''}`} />
              {isGeocoding ? 'Geocoding Address...' : 'Geocode from Address'}
            </button>
          </div>

          {/* Feedback messages */}
          {locationSuccess && (
            <div className="text-xs text-green-700 bg-green-50 p-2.5 rounded border border-green-200 flex items-center gap-1.5">
              <FiCheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{locationSuccess}</span>
            </div>
          )}

          {locationError && (
            <div className="text-xs text-red-700 bg-red-50 p-2.5 rounded border border-red-200 flex items-center gap-1.5">
              <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{locationError}</span>
            </div>
          )}

          {/* Coordinate Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Latitude <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                name="latitude"
                required
                value={formData.latitude}
                onChange={handleChange}
                placeholder="e.g. 26.915458"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Longitude <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                name="longitude"
                required
                value={formData.longitude}
                onChange={handleChange}
                placeholder="e.g. 75.818982"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            <FiSave className="mr-2 -ml-1 h-5 w-5" />
            {isSaving ? 'Saving Changes...' : 'Save Profile & Location'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellerProfile;
