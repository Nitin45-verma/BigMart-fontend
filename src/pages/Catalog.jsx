import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../features/products/productThunks';
import ProductCard from '../components/product/ProductCard';
import ProductFilters from '../components/product/ProductFilters';
import Pagination from '../components/ui/Pagination';
import { FiFilter, FiAlertCircle, FiChevronDown } from 'react-icons/fi';

const sortOptions = [
  { name: 'Relevance', value: 'relevance' },
  { name: 'Newest Arrivals', value: 'newest' },
  { name: 'Price: Low to High', value: 'price_asc' },
  { name: 'Price: High to Low', value: 'price_desc' },
  { name: 'Customer Rating', value: 'rating_desc' },
  { name: 'Better Discount', value: 'discount_desc' }
];

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { products, pagination, productsLoading, productsError, categories } = useSelector((state) => state.products);
  
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Extract query parameters exactly as the backend expects
  const currentParams = useMemo(() => {
    const params = {};
    for (let [key, value] of searchParams.entries()) {
      if (value) params[key] = value;
    }
    return params;
  }, [searchParams]);

  // Fetch products whenever the URL parameters change
  useEffect(() => {
    dispatch(fetchProducts(currentParams));
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dispatch, currentParams]);

  const updateQueryParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.keys(updates).forEach(key => {
      if (updates[key] === null || updates[key] === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, updates[key]);
      }
    });

    // Reset to page 1 if not explicitly changing page
    if (!updates.page) {
      newParams.set('page', '1');
    }

    setSearchParams(newParams);
  };

  const clearFilters = () => {
    const q = searchParams.get('q');
    const categorySlug = searchParams.get('categorySlug');
    
    const resetParams = {};
    if (q) resetParams.q = q;
    if (categorySlug) resetParams.categorySlug = categorySlug;
    
    setSearchParams(new URLSearchParams(resetParams));
  };

  // Determine page title based on current context
  const getPageTitle = () => {
    const q = searchParams.get('q');
    const categorySlug = searchParams.get('categorySlug');
    
    if (q) return `Search results for "${q}"`;
    if (categorySlug) {
      const category = categories.find(c => c.slug === categorySlug);
      return category ? category.name : 'Category Products';
    }
    return 'All Products';
  };

  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <ProductFilters 
          filters={currentParams}
          updateFilter={(key, val) => updateQueryParams({ [key]: val })}
          clearFilters={clearFilters}
          isMobile={true}
          mobileFiltersOpen={mobileFiltersOpen}
          setMobileFiltersOpen={setMobileFiltersOpen}
        />

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">{getPageTitle()}</h1>
              <p className="mt-2 text-sm text-gray-500">
                {productsLoading ? 'Loading...' : `${pagination.total} products found`}
              </p>
            </div>

            <div className="flex items-center">
              <div className="relative inline-block text-left group z-10">
                <div className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200 cursor-pointer">
                  Sort by
                  <FiChevronDown className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                </div>
                
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block transition-all z-20">
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateQueryParams({ sort: option.value })}
                        className={`block px-4 py-2 text-sm w-full text-left ${
                          currentParams.sort === option.value ? 'font-medium text-primary-600 bg-primary-50' : 'text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FiFilter className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">Products</h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <div className="hidden lg:block">
                <ProductFilters 
                  filters={currentParams}
                  updateFilter={(key, val) => updateQueryParams({ [key]: val })}
                  clearFilters={clearFilters}
                  isMobile={false}
                />
              </div>

              {/* Product grid */}
              <div className="lg:col-span-3">
                {productsError && (
                  <div className="rounded-md bg-red-50 p-4 border border-red-200 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FiAlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error loading products</h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>{productsError}</p>
                        </div>
                        <button
                          onClick={() => dispatch(fetchProducts(currentParams))}
                          className="mt-3 text-sm font-medium text-red-800 hover:text-red-900 bg-red-100 px-3 py-1 rounded"
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {productsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className="bg-white p-4 rounded-lg border border-gray-200 animate-pulse h-80">
                        <div className="bg-gray-200 h-48 rounded mb-4"></div>
                        <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                        <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : products.length === 0 && !productsError ? (
                  <div className="text-center py-24 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No products found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your search or filters to find what you're looking for.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={clearFilters}
                        className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {products.map(product => (
                        <ProductCard key={product._id} product={product} />
                      ))}
                    </div>
                    
                    <Pagination 
                      pagination={pagination} 
                      onPageChange={(page) => updateQueryParams({ page: page.toString() })} 
                    />
                  </>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Catalog;
