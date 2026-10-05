import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCart, clearCart } from '../../features/cart/cartThunks';
import CartItem from '../../components/cart/CartItem';
import EmptyCart from '../../components/cart/EmptyCart';
import { FiLock, FiAlertCircle } from 'react-icons/fi';
import { useToast } from '../../context/ToastContext';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { items, cartTotal, itemCount, loading, clearing, error } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    } else {
      // If user logs out while on cart, or lands on cart as guest
      navigate('/login?redirect=/cart');
    }
  }, [dispatch, isAuthenticated, navigate]);

  const handleClearCart = async () => {
    try {
      await dispatch(clearCart()).unwrap();
      addToast('Cart cleared successfully', 'success');
      setShowClearConfirm(false);
    } catch (err) {
      addToast(err || 'Failed to clear cart', 'error');
    }
  };

  if (!isAuthenticated) return null; // Let the navigate handle it

  if (loading && items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          <div className="lg:col-span-8 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg w-full"></div>
            ))}
          </div>
          <div className="lg:col-span-4 mt-8 lg:mt-0 h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error && items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <FiAlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
        <h2 className="text-xl font-medium text-gray-900 mb-2">Error Loading Cart</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <button 
          onClick={() => dispatch(fetchCart())}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EmptyCart />
      </div>
    );
  }

  // Check for unavailable items
  const hasUnavailableItems = items.some(item => !item.isAvailable);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 mb-8">
          Shopping Cart ({itemCount} {itemCount === 1 ? 'Item' : 'Items'})
        </h1>

        {hasUnavailableItems && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Some items in your cart are currently unavailable. Please remove them to proceed with checkout.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 py-6 sm:px-6">
                <ul role="list" className="-my-6 divide-y divide-gray-200">
                  {items.map((item) => (
                    <li key={item.product._id}>
                      <CartItem item={item} />
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-200 flex justify-between items-center">
                <Link to="/products" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                  &larr; Continue Shopping
                </Link>
                
                {showClearConfirm ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-700">Are you sure?</span>
                    <button 
                      onClick={() => setShowClearConfirm(false)}
                      className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                      disabled={clearing}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleClearCart}
                      disabled={clearing}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      {clearing ? 'Clearing...' : 'Yes, clear cart'}
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowClearConfirm(true)}
                    className="text-sm font-medium text-red-600 hover:text-red-500"
                  >
                    Clear Cart
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
              
              <dl className="space-y-4 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <dt>Subtotal ({itemCount} items)</dt>
                  <dd className="font-medium text-gray-900">₹{cartTotal}</dd>
                </div>
                
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-base font-medium text-gray-900">Estimated Total</dt>
                  <dd className="text-base font-bold text-gray-900">₹{cartTotal}</dd>
                </div>
              </dl>

              <div className="mt-6">
                <button
                  type="button"
                  disabled={hasUnavailableItems || items.length === 0}
                  className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <FiLock className="mr-2 -ml-1 h-5 w-5" aria-hidden="true" />
                  Proceed to Checkout
                </button>
                <p className="mt-2 text-xs text-center text-gray-500">
                  Checkout functionality will be implemented in a future step.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
