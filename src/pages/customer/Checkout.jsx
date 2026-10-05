import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCart } from '../../features/cart/cartThunks';
import { selectCheckoutAddress } from '../../features/address/addressSlice';
import { getShippingQuote } from '../../features/shipping/shippingThunks';
import { invalidateShippingQuote } from '../../features/shipping/shippingSlice';
import { validateCoupon } from '../../features/coupon/couponThunks';
import { createOrder, verifyPayment } from '../../features/checkout/checkoutThunks';
import { setPaymentStatus, resetCheckout } from '../../features/checkout/checkoutSlice';
import AddressCard from '../../components/address/AddressCard';
import AddressForm from '../../components/address/AddressForm';
import CouponBox from '../../components/checkout/CouponBox';
import CheckoutSummary from '../../components/checkout/CheckoutSummary';
import { FiMapPin, FiTruck, FiAlertCircle, FiPlus } from 'react-icons/fi';
import { useToast } from '../../context/ToastContext';
import { fetchAddresses as fetchAddressesThunk, createAddress as createAddressThunk } from '../../features/address/addressThunks';
import { loadRazorpayScript } from '../../utils/razorpay';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const { user, isAuthenticated, isInitializing } = useSelector((state) => state.auth);
  const { items, cartTotal, loading: cartLoading } = useSelector((state) => state.cart);
  const { addresses, selectedAddressId, loading: addressLoading, error: addressError } = useSelector((state) => state.address);
  const { quote, error: shippingError } = useSelector((state) => state.shipping);
  const { appliedCoupon } = useSelector((state) => state.coupon);
  
  const { 
    orderCreationLoading, 
    verificationLoading, 
    createdOrder, 
    paymentStatus, 
    successOrderId 
  } = useSelector((state) => state.checkout);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  
  // Track cart changes to invalidate quotes
  const prevCartTotalRef = useRef(cartTotal);
  const prevItemsLengthRef = useRef(items.length);

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate('/login?redirect=/checkout');
    }
  }, [isAuthenticated, isInitializing, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
      dispatch(fetchAddressesThunk());
      dispatch(resetCheckout());
    }
  }, [dispatch, isAuthenticated]);

  // When selected address changes, get shipping quote
  useEffect(() => {
    if (selectedAddressId && items.length > 0) {
      dispatch(getShippingQuote(selectedAddressId));
    } else {
      dispatch(invalidateShippingQuote());
    }
  }, [dispatch, selectedAddressId, items.length]);

  // Cart change invalidation
  useEffect(() => {
    if (
      prevCartTotalRef.current !== undefined &&
      (prevCartTotalRef.current !== cartTotal || prevItemsLengthRef.current !== items.length)
    ) {
      if (selectedAddressId) {
        dispatch(getShippingQuote(selectedAddressId));
      }
      if (appliedCoupon) {
        dispatch(validateCoupon(appliedCoupon.code));
      }
    }
    
    prevCartTotalRef.current = cartTotal;
    prevItemsLengthRef.current = items.length;
  }, [cartTotal, items.length, selectedAddressId, appliedCoupon, dispatch]);

  const handleAddressSelect = (id) => {
    dispatch(selectCheckoutAddress(id));
  };

  const handleAddressSubmit = async (formData) => {
    try {
      await dispatch(createAddressThunk(formData)).unwrap();
      addToast('Address added successfully', 'success');
      setShowAddressForm(false);
    } catch (err) {
      addToast(err || 'Failed to add address', 'error');
    }
  };

  // ── PAYMENT FLOW ──
  
  useEffect(() => {
    if (paymentStatus === 'success' && successOrderId) {
      addToast('Payment successful!', 'success');
      navigate(`/order-success/${successOrderId}`);
    }
  }, [paymentStatus, successOrderId, navigate, addToast]);

  const handleContinueToPayment = async () => {
    if (!selectedAddressId) {
      addToast('Please select a shipping address', 'error');
      return;
    }
    
    try {
      const orderPayload = {
        addressId: selectedAddressId,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined
      };
      
      const response = await dispatch(createOrder(orderPayload)).unwrap();
      
      // Load script
      const res = await loadRazorpayScript();
      if (!res) {
        addToast('Razorpay SDK failed to load. Are you online?', 'error');
        dispatch(setPaymentStatus('failed'));
        return;
      }
      
      const options = {
        key: response.keyId,
        amount: response.amountPaise,
        currency: response.currency,
        name: 'BigMart',
        description: `Order ${response.orderNumber}`,
        order_id: response.razorpayOrderId,
        handler: async function (handlerResponse) {
          try {
            await dispatch(verifyPayment({
              razorpay_order_id: handlerResponse.razorpay_order_id,
              razorpay_payment_id: handlerResponse.razorpay_payment_id,
              razorpay_signature: handlerResponse.razorpay_signature
            })).unwrap();
            
            // On success, useEffect takes over and redirects
          } catch (verifyErr) {
            addToast(verifyErr || 'Payment verification failed', 'error');
            dispatch(setPaymentStatus('failed'));
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: '' 
        },
        theme: {
          color: '#4f46e5'
        },
        modal: {
          ondismiss: function() {
            addToast('Payment cancelled', 'info');
            dispatch(setPaymentStatus('failed'));
          }
        }
      };

      dispatch(setPaymentStatus('open'));
      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function (response) {
        addToast(`Payment failed: ${response.error.description}`, 'error');
        dispatch(setPaymentStatus('failed'));
      });
      
      paymentObject.open();

    } catch (err) {
      addToast(err || 'Failed to initialize payment', 'error');
      dispatch(setPaymentStatus('failed'));
    }
  };

  const isCheckoutDisabled = orderCreationLoading || paymentStatus === 'initializing' || paymentStatus === 'open' || verificationLoading;

  if (isInitializing || !isAuthenticated) return null;

  if (cartLoading && items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="h-64 bg-gray-200 rounded-lg w-full"></div>
            <div className="h-48 bg-gray-200 rounded-lg w-full"></div>
          </div>
          <div className="lg:col-span-4 mt-8 lg:mt-0 h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!cartLoading && items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <FiAlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add items to your cart to proceed with checkout.</p>
        <Link 
          to="/products"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const hasUnavailableItems = items.some(item => !item.isAvailable);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
          Checkout
        </h1>

        {hasUnavailableItems && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Please return to the <Link to="/cart" className="font-bold underline">cart</Link> and remove unavailable items to continue.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          <div className="lg:col-span-8 space-y-6 opacity-100 transition-opacity" style={{ opacity: isCheckoutDisabled ? 0.6 : 1, pointerEvents: isCheckoutDisabled ? 'none' : 'auto' }}>
            
            {/* Address Selection Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <FiMapPin className="text-primary-600" /> Delivery Address
                </h2>
                {!showAddressForm && (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="text-sm font-medium text-primary-600 hover:text-primary-500 flex items-center gap-1"
                  >
                    <FiPlus /> Add New
                  </button>
                )}
              </div>
              <div className="p-4 sm:p-6">
                {addressLoading && addresses.length === 0 ? (
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-4 py-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                ) : addressError ? (
                  <p className="text-red-500 text-sm">{addressError}</p>
                ) : showAddressForm ? (
                  <AddressForm 
                    onSubmit={handleAddressSubmit} 
                    onCancel={() => setShowAddressForm(false)} 
                  />
                ) : addresses.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-sm text-gray-500 mb-4">You don't have any saved addresses.</p>
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                    >
                      <FiPlus className="mr-2 -ml-1 h-5 w-5" /> Add Address
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <AddressCard
                        key={address._id}
                        address={address}
                        isSelected={selectedAddressId === address._id}
                        onSelect={handleAddressSelect}
                        selectable={true}
                        onEdit={() => navigate('/account/addresses')}
                        onDelete={() => navigate('/account/addresses')}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Info Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <FiTruck className="text-primary-600" /> Shipping & Delivery
                </h2>
              </div>
              <div className="p-4 sm:p-6">
                {!selectedAddressId ? (
                  <p className="text-sm text-gray-500 text-center py-4">Please select a delivery address to view shipping options.</p>
                ) : shippingError ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md text-sm">
                    {shippingError}
                  </div>
                ) : quote ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-700">
                      Standard Delivery to <span className="font-semibold">{addresses.find(a => a._id === selectedAddressId)?.postalCode}</span>
                    </p>
                    
                    {quote.sellers && quote.sellers.length > 1 ? (
                      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                        <p className="text-sm font-medium text-gray-900 mb-2">Multiple shipments required:</p>
                        <ul className="space-y-2">
                          {quote.sellers.map((seller, idx) => (
                            <li key={idx} className="flex justify-between text-sm text-gray-600 border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                              <span>Items from {seller.sellerName || 'Seller'}</span>
                              <span className="font-medium">₹{seller.shippingFee}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="bg-green-50 p-4 rounded-md border border-green-200 text-sm text-green-800 flex justify-between">
                        <span>Delivery Fee</span>
                        <span className="font-bold">
                          {quote.shippingTotal === 0 ? 'FREE' : `₹${quote.shippingTotal || quote.deliveryFee || 0}`}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-4 py-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Coupon Section */}
            <CouponBox />

          </div>

          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <CheckoutSummary 
              onContinue={handleContinueToPayment}
              isValidating={isCheckoutDisabled}
            />
            {verificationLoading && (
              <div className="mt-4 text-center text-sm font-medium text-primary-600 animate-pulse">
                Verifying your secure payment...
              </div>
            )}
            {orderCreationLoading && (
              <div className="mt-4 text-center text-sm font-medium text-primary-600 animate-pulse">
                Preparing secure payment...
              </div>
            )}
            <div className="mt-4 p-4 border border-gray-200 rounded-md bg-white">
               <p className="text-xs text-gray-500 text-center">
                 Your payment is securely processed by Razorpay. Do not refresh the page during checkout.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
