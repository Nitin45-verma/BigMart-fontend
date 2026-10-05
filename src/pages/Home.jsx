import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchHomeRecommendations } from '../features/products/productThunks';
import ProductCard from '../components/product/ProductCard';

const ProductSection = ({ title, products, isLoading }) => {
  if (isLoading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white p-4 rounded-lg border border-gray-200 animate-pulse h-80">
              <div className="bg-gray-200 h-48 rounded mb-4"></div>
              <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
              <div className="bg-gray-200 h-4 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <div className="mt-12">
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <Link to="/products" className="text-sm font-medium text-primary-600 hover:text-primary-700 hidden sm:block">
          View all <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      <div className="mt-4 sm:hidden">
        <Link to="/products" className="block w-full text-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          View all {title}
        </Link>
      </div>
    </div>
  );
};

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { homeRecommendations, homeRecsLoading } = useSelector(state => state.products);
  
  useEffect(() => {
    dispatch(fetchHomeRecommendations());
  }, [dispatch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = e.target.search.value;
    if (query.trim()) {
      navigate(`/products?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Hero Section */}
      <div className="relative bg-primary-700 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-primary-700 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">India's Premier</span>{' '}
                  <span className="block text-primary-200">Marketplace</span>
                </h1>
                <p className="mt-3 text-base text-primary-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Shop millions of products from verified sellers. Electronics, fashion, home goods and more with fast shipping and secure payments.
                </p>
                
                {/* Mobile Search - Visible only on mobile since header has desktop search */}
                <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0 md:hidden">
                  <form onSubmit={handleSearchSubmit} className="flex">
                    <input
                      name="search"
                      type="text"
                      placeholder="Search products..."
                      className="block w-full px-4 py-3 rounded-l-md border-0 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-3 border border-transparent text-base font-medium rounded-r-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none"
                    >
                      Search
                    </button>
                  </form>
                </div>

                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start hidden md:flex">
                  <div className="rounded-md shadow">
                    <Link to="/products" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductSection 
          title="Best Deals" 
          products={homeRecommendations.bestDeals} 
          isLoading={homeRecsLoading} 
        />
        
        <ProductSection 
          title="Trending Now" 
          products={homeRecommendations.trending} 
          isLoading={homeRecsLoading} 
        />
        
        <ProductSection 
          title="New Arrivals" 
          products={homeRecommendations.newArrivals} 
          isLoading={homeRecsLoading} 
        />
        
        <ProductSection 
          title="Top Rated" 
          products={homeRecommendations.topRated} 
          isLoading={homeRecsLoading} 
        />
      </div>
    </div>
  );
};

export default Home;
