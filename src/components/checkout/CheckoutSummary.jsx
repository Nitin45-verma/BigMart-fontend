import React from 'react';
import { useSelector } from 'react-redux';
import { FiLock } from 'react-icons/fi';

const CheckoutSummary = ({ onContinue, isValidating }) => {
  const { cartTotal, itemCount, items } = useSelector(state => state.cart);
  const { quote, loading: shippingLoading } = useSelector(state => state.shipping);
  const { appliedCoupon, discountAmount, loading: couponLoading } = useSelector(state => state.coupon);

  // Financial calculations must remain illustrative here! Backend is the source of truth.
  // The backend might return final totals in the shipping quote or coupon validation.
  // We'll calculate a displayed final total here for UX, but never send it to the backend.
  
  const hasUnavailableItems = items.some(item => !item.isAvailable);
  const shippingFee = quote?.shippingTotal || quote?.deliveryFee || quote?.totalDeliveryFee || 0;
  
  const subtotal = cartTotal;
  const finalPayable = Math.max(0, subtotal - discountAmount + shippingFee);

  const isContinueDisabled = 
    hasUnavailableItems || 
    itemCount === 0 || 
    !quote || 
    shippingLoading || 
    couponLoading || 
    isValidating;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
      
      <dl className="space-y-4 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <dt>Subtotal ({itemCount} items)</dt>
          <dd className="font-medium text-gray-900">₹{subtotal}</dd>
        </div>

        {appliedCoupon && (
          <div className="flex items-center justify-between text-green-600">
            <dt>Discount ({appliedCoupon.code})</dt>
            <dd className="font-medium">-₹{discountAmount}</dd>
          </div>
        )}

        <div className="flex items-center justify-between">
          <dt>Shipping Fee</dt>
          <dd className="font-medium text-gray-900">
            {shippingLoading ? (
              <span className="text-gray-400">Calculating...</span>
            ) : quote ? (
              shippingFee === 0 ? <span className="text-green-600">Free</span> : `₹${shippingFee}`
            ) : (
              <span className="text-gray-400">Select address</span>
            )}
          </dd>
        </div>

        {quote?.sellers && quote.sellers.length > 1 && (
          <div className="pt-2 pb-2 pl-4 border-l-2 border-gray-100 space-y-2 text-xs">
            {quote.sellers.map((seller, idx) => (
              <div key={idx} className="flex justify-between text-gray-500">
                <span>Seller: {seller.sellerName || 'Unknown'}</span>
                <span>₹{seller.shippingFee || 0}</span>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <dt className="text-base font-medium text-gray-900">Total Payable</dt>
          <dd className="text-base font-bold text-gray-900">₹{finalPayable}</dd>
        </div>
      </dl>

      <div className="mt-6">
        <button
          type="button"
          disabled={isContinueDisabled}
          onClick={onContinue}
          className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <FiLock className="mr-2 -ml-1 h-5 w-5" aria-hidden="true" />
          Continue to Payment
        </button>
        {isContinueDisabled && !hasUnavailableItems && itemCount > 0 && !quote && (
          <p className="mt-2 text-xs text-center text-gray-500">
            Please select a delivery address to continue.
          </p>
        )}
      </div>
    </div>
  );
};

export default CheckoutSummary;
