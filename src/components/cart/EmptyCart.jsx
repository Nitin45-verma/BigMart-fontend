import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';

const EmptyCart = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
      <div className="h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
        <FiShoppingCart className="h-10 w-10 text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        Looks like you haven't added anything to your cart yet. Browse our products and find something you love.
      </p>
      <Link
        to="/products"
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

export default EmptyCart;
