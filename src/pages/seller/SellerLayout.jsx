import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { forceLogout } from '../../features/auth/authSlice';
import { 
  FiHome, FiBox, FiList, FiDollarSign, FiPieChart, 
  FiSettings, FiMenu, FiX, FiLogOut, FiUser 
} from 'react-icons/fi';

const SellerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const navigation = [
    { name: 'Dashboard', href: '/seller', icon: FiHome },
    { name: 'Products', href: '/seller/products', icon: FiBox },
    { name: 'Inventory', href: '/seller/inventory', icon: FiList },
    { name: 'Orders', href: '/seller/orders', icon: FiList },
    { name: 'Earnings & Wallet', href: '/seller/wallet', icon: FiDollarSign },
    { name: 'Analytics', href: '/seller/analytics', icon: FiPieChart },
  ];

  const handleLogout = () => {
    dispatch(forceLogout());
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/seller' && location.pathname === '/seller') return true;
    if (path !== '/seller' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm flex items-center justify-between p-4 z-20">
        <div className="text-xl font-bold text-primary-600">BigMart Seller</div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 focus:outline-none">
          {sidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-10 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-20 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="flex-1 flex flex-col overflow-y-auto">
            <div className="hidden md:flex items-center justify-center h-16 bg-primary-600 text-white font-bold text-xl">
              Seller Panel
            </div>
            
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="bg-primary-100 text-primary-700 h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg">
                  {user?.name?.charAt(0) || 'S'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">{user?.businessName || user?.name || 'Seller'}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.status === 'approved' ? 'Active' : user?.status}</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md
                    ${isActive(item.href) 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                >
                  <item.icon 
                    className={`
                      mr-3 flex-shrink-0 h-5 w-5 
                      ${isActive(item.href) ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'}
                    `} 
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="flex-shrink-0 w-full group block text-left"
            >
              <div className="flex items-center">
                <FiLogOut className="inline-block h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    Logout
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
          {user?.status !== 'approved' && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiSettings className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Your account is currently <span className="font-bold">{user?.status || 'pending'}</span>. 
                    Some features may be restricted until you are approved by an admin.
                  </p>
                </div>
              </div>
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
