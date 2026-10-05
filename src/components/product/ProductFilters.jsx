import React, { useState } from 'react';
import { FiX, FiFilter } from 'react-icons/fi';

const ProductFilters = ({ filters, updateFilter, clearFilters, isMobile, setMobileFiltersOpen }) => {
  const handlePriceChange = (e, type) => {
    e.preventDefault();
    updateFilter(type, e.target.value);
  };

  const clearSection = (type) => {
    updateFilter(type, null);
  };

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Price Range Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 flex justify-between">
          Price Range
          {(filters.minPrice || filters.maxPrice) && (
            <button onClick={() => { clearSection('minPrice'); clearSection('maxPrice'); }} className="text-xs text-primary-600 hover:text-primary-700">Clear</button>
          )}
        </h3>
        <div className="mt-4 flex items-center space-x-2">
          <input
            type="number"
            placeholder="Min"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-2 py-1 border"
            value={filters.minPrice || ''}
            onChange={(e) => handlePriceChange(e, 'minPrice')}
            min="0"
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            placeholder="Max"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-2 py-1 border"
            value={filters.maxPrice || ''}
            onChange={(e) => handlePriceChange(e, 'maxPrice')}
            min="0"
          />
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 flex justify-between">
          Brand
          {filters.brand && (
            <button onClick={() => clearSection('brand')} className="text-xs text-primary-600 hover:text-primary-700">Clear</button>
          )}
        </h3>
        <div className="mt-4">
          <input
            type="text"
            placeholder="Search brand..."
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-2 py-1 border"
            value={filters.brand || ''}
            onChange={(e) => updateFilter('brand', e.target.value)}
          />
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 flex justify-between">
          Minimum Rating
          {filters.minRating && (
            <button onClick={() => clearSection('minRating')} className="text-xs text-primary-600 hover:text-primary-700">Clear</button>
          )}
        </h3>
        <div className="mt-4 space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center">
              <input
                id={`rating-${rating}`}
                name="rating"
                type="radio"
                checked={filters.minRating === rating.toString()}
                onChange={() => updateFilter('minRating', rating.toString())}
                className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor={`rating-${rating}`} className="ml-3 text-sm text-gray-600">
                {rating} Stars & Up
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 flex justify-between">
          Availability
          {filters.inStock && (
            <button onClick={() => clearSection('inStock')} className="text-xs text-primary-600 hover:text-primary-700">Clear</button>
          )}
        </h3>
        <div className="mt-4">
          <div className="flex items-center">
            <input
              id="inStock"
              name="inStock"
              type="checkbox"
              checked={filters.inStock === 'true'}
              onChange={(e) => updateFilter('inStock', e.target.checked ? 'true' : null)}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="inStock" className="ml-3 text-sm text-gray-600">
              In Stock Only
            </label>
          </div>
        </div>
      </div>

      {/* Minimum Discount */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 flex justify-between">
          Discount
          {filters.minDiscount && (
            <button onClick={() => clearSection('minDiscount')} className="text-xs text-primary-600 hover:text-primary-700">Clear</button>
          )}
        </h3>
        <div className="mt-4 space-y-2">
          {[50, 40, 30, 20, 10].map((discount) => (
            <div key={discount} className="flex items-center">
              <input
                id={`discount-${discount}`}
                name="discount"
                type="radio"
                checked={filters.minDiscount === discount.toString()}
                onChange={() => updateFilter('minDiscount', discount.toString())}
                className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor={`discount-${discount}`} className="ml-3 text-sm text-gray-600">
                {discount}% or more
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 flex z-50 lg:hidden">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setMobileFiltersOpen(false)} aria-hidden="true" />
        <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-lg font-medium text-gray-900">Filters</h2>
            <button
              type="button"
              className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
              onClick={() => setMobileFiltersOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <FiX className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-4 border-t border-gray-200 px-4 py-6">
            <div className="flex justify-between mb-6">
              <button 
                onClick={clearFilters}
                className="text-sm font-medium text-primary-600"
              >
                Clear all
              </button>
              <button 
                onClick={() => setMobileFiltersOpen(false)}
                className="text-sm font-medium text-white bg-gray-900 px-4 py-1 rounded-md"
              >
                Apply
              </button>
            </div>
            <FilterContent />
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="hidden lg:block border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <FiFilter /> Filters
        </h2>
        <button 
          type="button" 
          onClick={clearFilters}
          className="text-sm text-gray-500 hover:text-primary-600 font-medium"
        >
          Clear all
        </button>
      </div>
      <FilterContent />
    </form>
  );
};

export default ProductFilters;
