import React from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';

const QuantitySelector = ({ quantity, setQuantity, maxStock }) => {
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxStock) {
      setQuantity(quantity + 1);
    }
  };

  const handleChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      if (val >= 1 && val <= maxStock) {
        setQuantity(val);
      } else if (val > maxStock) {
        setQuantity(maxStock);
      } else if (val < 1) {
        setQuantity(1);
      }
    }
  };

  return (
    <div className="flex items-center">
      <span className="mr-4 text-sm font-medium text-gray-700">Quantity</span>
      <div className="flex items-center border border-gray-300 rounded-md bg-white">
        <button
          type="button"
          onClick={handleDecrease}
          disabled={quantity <= 1}
          className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed rounded-l-md"
          aria-label="Decrease quantity"
        >
          <FiMinus size={16} />
        </button>
        <input
          type="number"
          value={quantity}
          onChange={handleChange}
          min="1"
          max={maxStock}
          className="w-12 text-center text-sm font-medium border-x border-gray-300 py-2 focus:outline-none appearance-none"
          aria-label="Quantity"
        />
        <button
          type="button"
          onClick={handleIncrease}
          disabled={quantity >= maxStock}
          className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed rounded-r-md"
          aria-label="Increase quantity"
        >
          <FiPlus size={16} />
        </button>
      </div>
      {maxStock > 0 && maxStock <= 5 && (
        <span className="ml-4 text-xs text-red-500 font-medium">
          Only {maxStock} left!
        </span>
      )}
    </div>
  );
};

export default QuantitySelector;
