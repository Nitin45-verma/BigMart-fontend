import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiSearch, FiShoppingCart, FiHeart, FiUser, FiLogOut } from 'react-icons/fi';
import { logoutUser } from '../../features/auth/authThunks';
import { fetchCart } from '../../features/cart/cartThunks';
import { fetchWishlistCount } from '../../features/wishlist/wishlistThunks';

const Header = () => {
  const { isAuthenticated, user, isInitializing } = useSelector((state) => state.auth);
  const { itemCount: cartCount } = useSelector((state) => state.cart);
  const { count: wishlistCount } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user?.role === 'customer') {
      dispatch(fetchCart());
      dispatch(fetchWishlistCount());
    }
  }, [dispatch, isAuthenticated, user?.role]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600">
              BigMart
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8 hidden md:block">
            <form onSubmit={(e) => {
              e.preventDefault();
              const query = e.target.search.value;
              if (query.trim()) {
                navigate(`/products?q=${encodeURIComponent(query)}`);
              }
            }} className="relative">
              <input
                type="text"
                name="search"
                placeholder="Search products, brands and categories..."
                className="w-full bg-gray-100 rounded-md py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button type="submit" className="absolute right-0 top-0 mt-2 mr-3 text-gray-500 hover:text-primary-600">
                <FiSearch size={20} />
              </button>
            </form>
          </div>

          {/* Navigation/Icons */}
          <div className="flex items-center space-x-6">
            {!isInitializing && !isAuthenticated && (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium hidden sm:block">
                  Login
                </Link>
                <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium hidden sm:block">
                  Register
                </Link>
              </>
            )}

            {isAuthenticated && user && (
              <>
                <div className="hidden sm:block text-sm text-gray-700 font-medium">
                  Hello, {user.name}
                </div>
                
                {user.role === 'customer' && (
                  <Link to="/wishlist" className="text-gray-600 hover:text-primary-600 relative">
                    <FiHeart size={22} />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                )}

                {/* Unified Account Dropdown */}
                <div className="relative group">
                  <button className="flex items-center text-gray-600 hover:text-primary-600 focus:outline-none">
                    <FiUser size={22} />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block border border-gray-100">
                    <Link to="/account/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Account</Link>
                    
                    {user.role === 'customer' && (
                      <Link to="/account/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Orders</Link>
                    )}

                    {user.role === 'seller' && (
                      <>
                        <Link to="/seller" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-medium text-primary-600">Seller Dashboard</Link>
                        <Link to="/seller/products/new" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Add Product</Link>
                        <Link to="/seller/products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Products</Link>
                        <Link to="/seller/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Seller Orders</Link>
                      </>
                    )}

                    {user.role === 'admin' && (
                      <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-medium text-primary-600">Admin Dashboard</Link>
                    )}
                    
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 border-t border-gray-100 mt-1">
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}

            {(!isAuthenticated || (isAuthenticated && user?.role === 'customer')) && (
              <Link to="/cart" className="text-gray-600 hover:text-primary-600 relative">
                <FiShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
