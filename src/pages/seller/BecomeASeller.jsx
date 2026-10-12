import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const BecomeASeller = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    gstin: '',
    panNumber: '',
    contactPhone: '',
    businessAddress: '',
    city: '',
    state: '',
    postalCode: '',
    businessDescription: '',
    latitude: '',
    longitude: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [locationNote, setLocationNote] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login?redirect=/seller/register');
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post('/seller/apply', formData);
      addToast('Your seller application has been submitted! We will review it shortly.', 'success');
      navigate('/account');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to submit application. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If already a seller, redirect to seller dashboard
  if (isAuthenticated && user?.role === 'seller') {
    navigate('/seller');
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Become a Seller on BigMart</h1>
        <p className="mt-3 text-gray-600">
          Join thousands of sellers and grow your business with India's premier marketplace.
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { icon: '🏪', title: 'Massive Reach', desc: 'Access millions of shoppers across India.' },
          { icon: '💰', title: 'Low Fees', desc: 'Competitive commission rates on every sale.' },
          { icon: '📦', title: 'Easy Fulfillment', desc: 'Simple order and inventory management tools.' },
        ].map((b) => (
          <div key={b.title} className="bg-gray-50 border border-gray-200 rounded-lg p-5 text-center">
            <div className="text-3xl mb-2">{b.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-1">{b.title}</h3>
            <p className="text-sm text-gray-500">{b.desc}</p>
          </div>
        ))}
      </div>

      {!isAuthenticated ? (
        <div className="text-center bg-primary-50 border border-primary-200 rounded-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Ready to get started?</h2>
          <p className="text-gray-600 mb-5">
            You need to be logged in to submit a seller application.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/login?redirect=/seller/register')}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Login to Apply
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
            >
              Create Account
            </button>
          </div>
        </div>
      ) : user?.sellerApplicationStatus === 'pending' ? (
        <div className="text-center bg-yellow-50 border border-yellow-200 rounded-lg p-8">
          <h2 className="text-xl font-semibold text-yellow-800 mb-3">Application Under Review</h2>
          <p className="text-yellow-700 mb-5">
            Your seller application is currently being reviewed by our team. We will notify you once it's approved.
          </p>
          <button
            onClick={() => navigate('/account')}
            className="px-6 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 font-medium"
          >
            Go to My Account
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Seller Application</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="businessName"
                  required
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Your business or brand name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="businessType"
                  required
                  value={formData.businessType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select type</option>
                  <option value="individual">Individual / Sole Proprietor</option>
                  <option value="small_business">Partnership</option>
                  <option value="medium_business">Private Limited Company</option>
                  <option value="large_business">Public Limited Company</option>
                  <option value="enterprise">LLP</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                <input
                  type="text"
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="15-digit GSTIN (optional)"
                  maxLength={15}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PAN Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="panNumber"
                  required
                  value={formData.panNumber}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="10-character PAN"
                  maxLength={10}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  required
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="10-digit mobile number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="businessAddress"
                  required
                  value={formData.businessAddress}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Full street address"
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
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="City"
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
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="State"
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
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="6-digit PIN code"
                  maxLength={6}
                />
              </div>
            </div>

            {/* Location Coordinates & Geocoding */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Store Dispatch Coordinates (Optional during application)</span>
                <span className="text-xs text-gray-500">Can also be configured after approval</span>
              </div>
              <p className="text-xs text-gray-600">
                Helps calculate accurate delivery fees for customers. You can detect your location or geocode it from your business address.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={isLocating || isGeocoding}
                  onClick={() => {
                    if (!navigator.geolocation) {
                      setLocationNote('Geolocation is not supported by your browser.');
                      return;
                    }
                    setIsLocating(true);
                    setLocationNote('');
                    navigator.geolocation.getCurrentPosition(
                      (pos) => {
                        const lat = Number(pos.coords.latitude.toFixed(6));
                        const lon = Number(pos.coords.longitude.toFixed(6));
                        setFormData(prev => ({ ...prev, latitude: lat, longitude: lon }));
                        setLocationNote(`Coordinates captured: ${lat}, ${lon}`);
                        setIsLocating(false);
                      },
                      (err) => {
                        setLocationNote('Could not retrieve device location. You can geocode from address.');
                        setIsLocating(false);
                      }
                    );
                  }}
                  className="px-3 py-1.5 text-xs font-medium rounded border border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
                >
                  {isLocating ? 'Detecting...' : '📍 Use Current Location'}
                </button>
                <button
                  type="button"
                  disabled={isLocating || isGeocoding}
                  onClick={async () => {
                    if (!formData.city && !formData.postalCode) {
                      setLocationNote('Please enter city or postal code first.');
                      return;
                    }
                    setIsGeocoding(true);
                    setLocationNote('');
                    const query = `${formData.postalCode || ''} ${formData.city || ''} ${formData.state || ''} India`.trim();
                    try {
                      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`, {
                        headers: { 'User-Agent': 'BigMart-Seller-Apply/1.0' }
                      });
                      const data = await res.json();
                      if (data && data.length > 0) {
                        const lat = Number(parseFloat(data[0].lat).toFixed(6));
                        const lon = Number(parseFloat(data[0].lon).toFixed(6));
                        setFormData(prev => ({ ...prev, latitude: lat, longitude: lon }));
                        setLocationNote(`Geocoded: ${lat}, ${lon}`);
                      } else {
                        setLocationNote('Address not found in geocoder.');
                      }
                    } catch (e) {
                      setLocationNote('Geocoding service unavailable.');
                    } finally {
                      setIsGeocoding(false);
                    }
                  }}
                  className="px-3 py-1.5 text-xs font-medium rounded border border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
                >
                  {isGeocoding ? 'Geocoding...' : '🔍 Geocode from Address'}
                </button>
              </div>
              {locationNote && (
                <p className="text-xs text-blue-600">{locationNote}</p>
              )}
              {formData.latitude && formData.longitude && (
                <p className="text-xs text-green-700 font-medium">
                  ✓ Coordinates set: {formData.latitude}, {formData.longitude}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="businessDescription"
                required
                value={formData.businessDescription}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Tell us about your business and what you plan to sell..."
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-60"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default BecomeASeller;
