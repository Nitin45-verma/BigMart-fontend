import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiStar, FiCheck, FiTruck, FiShield } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import cartApi from '../../services/cartApi';
import wishlistApi from '../../services/wishlistApi';
import QuantitySelector from './QuantitySelector';
import { useToast } from '../../context/ToastContext';

const ProductInfo = ({ product }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold || 5);
  const hasDiscount = product.compareAtPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) 
    : 0;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=' + window.location.pathname);
      return;
    }
    
    try {
      setAddingToCart(true);
      setCartSuccess(false);
      await cartApi.addItem({ productId: product._id, quantity });
      setCartSuccess(true);
      addToast('Added to cart!', 'success');
      setTimeout(() => setCartSuccess(false), 3000);
    } catch (error) {
      addToast(error.response?.data?.message || 'Error adding to cart', 'error');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=' + window.location.pathname);
      return;
    }
    
    try {
      setAddingToWishlist(true);
      await wishlistApi.addItem({ productId: product._id });
      addToast('Added to wishlist!', 'success');
    } catch (error) {
      addToast(error.response?.data?.message || 'Error adding to wishlist', 'error');
    } finally {
      setAddingToWishlist(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Brand & Title */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-primary-600 tracking-wide uppercase mb-1">
          {product.brand}
        </h2>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
          {product.name}
        </h1>
      </div>

      {/* Ratings */}
      <div className="flex items-center mb-6">
        <div className="flex items-center text-yellow-400">
          <FiStar className="fill-current" />
          <span className="ml-1 text-sm font-medium text-gray-700">
            {product.ratingAverage?.toFixed(1) || '0.0'}
          </span>
        </div>
        <a href="#reviews" className="ml-4 text-sm font-medium text-primary-600 hover:text-primary-500">
          See all {product.ratingCount || 0} reviews
        </a>
      </div>

      {/* Pricing */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="flex items-baseline gap-4">
          <span className="text-3xl font-extrabold text-gray-900">₹{product.price}</span>
          {hasDiscount && (
            <>
              <span className="text-lg text-gray-500 line-through">MRP ₹{product.compareAtPrice}</span>
              <span className="text-sm font-semibold text-green-600">({discountPercent}% OFF)</span>
            </>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Inclusive of all taxes (GST {product.gstRate}%)
        </p>
      </div>

      {/* Short Description */}
      {product.shortDescription && (
        <div className="mb-6 prose prose-sm text-gray-600">
          <p>{product.shortDescription}</p>
        </div>
      )}

      {/* Stock Status */}
      <div className="mb-6 flex items-center">
        {isOutOfStock ? (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            Out of Stock
          </span>
        ) : isLowStock ? (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            Low Stock
          </span>
        ) : (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            In Stock
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="mt-auto space-y-6">
        {!isOutOfStock && (
          <QuantitySelector 
            quantity={quantity} 
            setQuantity={setQuantity} 
            maxStock={product.stock} 
          />
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || addingToCart}
            className={`flex-1 flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm transition-colors ${
              isOutOfStock
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : cartSuccess
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {cartSuccess ? (
              <><FiCheck className="mr-2" /> Added to Cart</>
            ) : (
              <><FiShoppingCart className="mr-2" /> {addingToCart ? 'Adding...' : 'Add to Cart'}</>
            )}
          </button>
          <button
            onClick={handleWishlist}
            disabled={addingToWishlist}
            className="flex items-center justify-center px-8 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <FiHeart className={`mr-2 ${addingToWishlist ? 'animate-pulse text-red-500' : ''}`} />
            Wishlist
          </button>
        </div>
      </div>

      {/* Seller & Trust Badges */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-200 text-sm text-gray-500">
        <div className="flex items-center gap-3">
          <FiShield className="text-primary-600 h-5 w-5" />
          <span>Sold by <strong>{product.seller?.businessName || 'Verified Seller'}</strong></span>
        </div>
        <div className="flex items-center gap-3">
          <FiTruck className="text-primary-600 h-5 w-5" />
          <span>Fast Delivery Available</span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
