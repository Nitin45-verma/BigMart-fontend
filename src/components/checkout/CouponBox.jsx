import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { validateCoupon } from '../../features/coupon/couponThunks';
import { removeCoupon } from '../../features/coupon/couponSlice';
import { FiTag, FiX } from 'react-icons/fi';
import { useToast } from '../../context/ToastContext';

const CouponBox = () => {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const { appliedCoupon, discountAmount, loading, error } = useSelector(state => state.coupon);
  
  const [couponCode, setCouponCode] = useState('');

  const handleApply = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    
    try {
      await dispatch(validateCoupon(couponCode.trim())).unwrap();
      addToast('Coupon applied successfully', 'success');
      setCouponCode('');
    } catch (err) {
      addToast(err || 'Failed to apply coupon', 'error');
    }
  };

  const handleRemove = () => {
    dispatch(removeCoupon());
    addToast('Coupon removed', 'info');
  };

  if (appliedCoupon) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-full">
            <FiTag className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-green-800">
              Coupon Applied: <span className="uppercase font-bold">{appliedCoupon.code}</span>
            </p>
            <p className="text-xs text-green-700">
              You saved ₹{discountAmount}
            </p>
          </div>
        </div>
        <button
          onClick={handleRemove}
          className="text-gray-500 hover:text-red-500 p-1"
          aria-label="Remove coupon"
        >
          <FiX className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
        <FiTag className="text-gray-400" /> Have a coupon code?
      </h3>
      <form onSubmit={handleApply} className="flex gap-2">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          placeholder="Enter code"
          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-primary-500 focus:border-primary-500 sm:text-sm uppercase placeholder:normal-case"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!couponCode.trim() || loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? 'Applying...' : 'Apply'}
        </button>
      </form>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default CouponBox;
