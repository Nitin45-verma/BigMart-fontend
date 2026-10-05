import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiSearch, FiShoppingCart, FiHeart, FiUser, FiLogOut } from 'react-icons/fi';
import { logoutUser } from '../../features/auth/authThunks';

const Header = () => {
  const { isAuthenticated, user, isInitializing } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

          {/* Search Bar (Placeholder) */}
          <div className="flex-1 max-w-lg mx-8 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products, brands and categories..."
                className="w-full bg-gray-100 rounded-md py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button className="absolute right-0 top-0 mt-2 mr-3 text-gray-500">
                <FiSearch size={20} />
              </button>
            </div>
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
                  <>
                    <Link to="/account/wishlist" className="text-gray-600 hover:text-primary-600">
                      <FiHeart size={22} />
                    </Link>
                    <Link to="/account" className="text-gray-600 hover:text-primary-600">
                      <FiUser size={22} />
                    </Link>
                  </>
                )}
                {user.role === 'seller' && (
                  <Link to="/seller" className="text-primary-600 font-medium hover:text-primary-700">
                    Seller Dashboard
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-primary-600 font-medium hover:text-primary-700">
                    Admin Panel
                  </Link>
                )}
                <button onClick={handleLogout} className="text-gray-600 hover:text-red-600" title="Logout">
                  <FiLogOut size={22} />
                </button>
              </>
            )}

            <Link to="/cart" className="text-gray-600 hover:text-primary-600 relative">
              <FiShoppingCart size={22} />
              <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
