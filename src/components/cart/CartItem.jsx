import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiAlertCircle } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { updateCartItem, removeCartItem } from '../../features/cart/cartThunks';
import { useToast } from '../../context/ToastContext';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const { updatingItemId, removingItemId } = useSelector((state) => state.cart);
  
  const isUpdating = updatingItemId === item.product._id;
  const isRemoving = removingItemId === item.product._id;
  const isLoading = isUpdating || isRemoving;

  const fallbackImage = 'https://via.placeholder.com/150x150?text=No+Image';
  const primaryImage = item.product.images?.find(img => img.isPrimary)?.url || item.product.images?.[0]?.url || fallbackImage;

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1 || newQuantity > item.product.availableStock || isLoading) return;
    
    try {
      await dispatch(updateCartItem({ productId: item.product._id, quantity: newQuantity })).unwrap();
    } catch (error) {
      addToast(error || 'Failed to update quantity', 'error');
    }
  };

  const handleRemove = async () => {
    try {
      await dispatch(removeCartItem(item.product._id)).unwrap();
      addToast('Item removed from cart', 'success');
    } catch (error) {
      addToast(error || 'Failed to remove item', 'error');
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row py-6 border-b border-gray-200 last:border-b-0 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Image */}
      <div className="flex-shrink-0 w-full sm:w-24 h-24 rounded-md overflow-hidden bg-gray-50 border border-gray-100 mb-4 sm:mb-0">
        <Link to={`/products/${item.product.slug}`}>
          <img
            src={primaryImage}
            alt={item.product.name}
            className="w-full h-full object-contain object-center mix-blend-multiply p-2"
          />
        </Link>
      </div>

      <div className="sm:ml-6 flex-1 flex flex-col">
        {/* Title and Price */}
        <div className="flex flex-col sm:flex-row justify-between">
          <div className="pr-4 mb-2 sm:mb-0">
            {item.product.brand && (
              <p className="text-xs text-gray-500 mb-1">{item.product.brand}</p>
            )}
            <h3 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2">
              <Link to={`/products/${item.product.slug}`} className="hover:text-primary-600">
                {item.product.name}
              </Link>
            </h3>
            
            {!item.isAvailable && (
              <div className="mt-2 inline-flex items-center text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                <FiAlertCircle className="mr-1" /> Currently Unavailable
              </div>
            )}
          </div>
          <div className="text-left sm:text-right">
            <p className="text-lg font-bold text-gray-900">₹{item.product.price}</p>
            {item.product.compareAtPrice > item.product.price && (
              <p className="text-sm text-gray-500 line-through">₹{item.product.compareAtPrice}</p>
            )}
          </div>
        </div>

        {/* Quantity and Actions */}
        <div className="flex-1 flex items-end justify-between mt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                type="button"
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1 || isLoading}
                className="p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Decrease quantity"
              >
                <FiMinus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-medium text-gray-900">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={item.quantity >= item.product.availableStock || isLoading}
                className="p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Increase quantity"
              >
                <FiPlus className="h-4 w-4" />
              </button>
            </div>
            
            {item.product.availableStock > 0 && item.product.availableStock < 5 && (
              <span className="text-xs font-medium text-orange-600 hidden sm:inline-block">
                Only {item.product.availableStock} left
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-gray-900 hidden sm:block mr-4">
              Total: ₹{item.itemTotal}
            </div>
            <button
              type="button"
              onClick={handleRemove}
              disabled={isLoading}
              className="text-sm font-medium text-red-600 hover:text-red-500 flex items-center gap-1 disabled:opacity-50"
            >
              <FiTrash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Remove</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
