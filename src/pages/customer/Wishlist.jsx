import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchWishlist, clearWishlist, removeFromWishlist, moveWishlistItemToCart } from '../../features/wishlist/wishlistThunks';
import { FiHeart, FiShoppingCart, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import { useToast } from '../../context/ToastContext';
import Pagination from '../../components/ui/Pagination';

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const { items, count, loading, itemLoading, movingToCartProductId, error, pagination } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist({ page: 1, limit: 20 }));
    } else {
      navigate('/login?redirect=/wishlist');
    }
  }, [dispatch, isAuthenticated, navigate]);

  const handlePageChange = (page) => {
    dispatch(fetchWishlist({ page, limit: 20 }));
    window.scrollTo(0, 0);
  };

  const handleClearWishlist = async () => {
    try {
      await dispatch(clearWishlist()).unwrap();
      addToast('Wishlist cleared successfully', 'success');
      setShowClearConfirm(false);
    } catch (err) {
      addToast(err || 'Failed to clear wishlist', 'error');
    }
  };

  const handleRemove = async (productId) => {
    try {
      await dispatch(removeFromWishlist(productId)).unwrap();
      addToast('Item removed from wishlist', 'success');
    } catch (err) {
      addToast(err || 'Failed to remove item', 'error');
    }
  };

  const handleMoveToCart = async (productId) => {
    try {
      await dispatch(moveWishlistItemToCart(productId)).unwrap();
      addToast('Item moved to cart successfully', 'success');
    } catch (err) {
      addToast(err || 'Failed to move item to cart', 'error');
    }
  };

  if (!isAuthenticated) return null;

  if (loading && items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-80 bg-gray-200 rounded-lg w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error && items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <FiAlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
        <h2 className="text-xl font-medium text-gray-900 mb-2">Error Loading Wishlist</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <button 
          onClick={() => dispatch(fetchWishlist({ page: 1, limit: 20 }))}
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="h-24 w-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <FiHeart className="h-10 w-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Save items you love to your wishlist to keep track of them or buy them later.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
            My Wishlist ({count})
          </h1>
          
          {items.length > 0 && (
            <div>
              {showClearConfirm ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700">Clear wishlist?</span>
                  <button 
                    onClick={() => setShowClearConfirm(false)}
                    className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleClearWishlist}
                    disabled={loading}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    {loading ? 'Clearing...' : 'Yes, clear'}
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowClearConfirm(true)}
                  className="text-sm font-medium text-red-600 hover:text-red-500 flex items-center gap-1"
                >
                  <FiTrash2 className="h-4 w-4" />
                  Clear Wishlist
                </button>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => {
            const prod = item.product;
            const isUnavailable = item.availability !== 'available';
            const isItemLoading = itemLoading === prod?._id;
            const isMoving = movingToCartProductId === prod?._id;
            const fallbackImage = 'https://via.placeholder.com/300x300?text=No+Image';
            
            if (!prod) {
              return (
                <div key={item._id || Math.random()} className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col items-center justify-center h-64 text-center">
                  <FiAlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">This product is no longer available.</p>
                </div>
              );
            }

            const primaryImage = prod.images?.find(img => img.isPrimary)?.url || prod.images?.[0]?.url || fallbackImage;

            return (
              <div key={prod._id} className={`group relative bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col h-full ${(isItemLoading || isMoving) ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="block relative aspect-w-1 aspect-h-1 overflow-hidden bg-gray-50">
                  <Link to={`/products/${prod.slug}`}>
                    <img
                      src={primaryImage}
                      alt={prod.name}
                      className={`w-full h-48 object-contain object-center p-4 ${isUnavailable ? 'grayscale' : 'group-hover:scale-105 transition-transform duration-300'}`}
                      loading="lazy"
                    />
                  </Link>
                  <button
                    onClick={() => handleRemove(prod._id)}
                    disabled={isItemLoading}
                    className="absolute top-2 right-2 p-2 rounded-full bg-white text-red-500 hover:bg-red-50 shadow-sm transition-colors"
                    title="Remove from wishlist"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                  
                  {isUnavailable && (
                    <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center">
                      <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                        {item.availability.replace('_', ' ')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  {prod.brand && <div className="text-xs text-gray-500 mb-1">{prod.brand}</div>}
                  <Link to={`/products/${prod.slug}`}>
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-primary-600 h-10">
                      {prod.name}
                    </h3>
                  </Link>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-lg font-bold text-gray-900">₹{prod.price}</span>
                    {prod.compareAtPrice > prod.price && (
                      <span className="text-sm text-gray-500 line-through">₹{prod.compareAtPrice}</span>
                    )}
                  </div>
                  
                  <div className="flex-grow"></div>

                  <div className="mt-4">
                    <button
                      onClick={() => handleMoveToCart(prod._id)}
                      disabled={isUnavailable || isMoving}
                      className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        !isUnavailable 
                          ? 'bg-primary-50 text-primary-700 hover:bg-primary-600 hover:text-white' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <FiShoppingCart />
                      {isMoving ? 'Moving...' : 'Move to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8">
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
