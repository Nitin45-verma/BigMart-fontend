import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { forceLogout } from '../../features/auth/authSlice';
import { 
  FiHome, FiUsers, FiBriefcase, FiCheckSquare, 
  FiBox, FiShoppingBag, FiDollarSign, FiMenu, 
  FiX, FiLogOut 
} from 'react-icons/fi';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: FiHome },
    { name: 'Users', href: '/admin/users', icon: FiUsers },
    { name: 'Sellers', href: '/admin/sellers', icon: FiBriefcase },
    { name: 'Applications', href: '/admin/seller-applications', icon: FiCheckSquare },
    { name: 'Products', href: '/admin/products', icon: FiBox },
    { name: 'Orders', href: '/admin/orders', icon: FiShoppingBag },
    { name: 'Finance', href: '/admin/finance', icon: FiDollarSign },
  ];

  const handleLogout = () => {
    dispatch(forceLogout());
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-indigo-900 shadow-sm flex items-center justify-between p-4 z-20">
        <div className="text-xl font-bold text-white">BigMart Admin</div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-300 focus:outline-none hover:text-white">
          {sidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-75 z-10 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-20 w-64 bg-indigo-900 shadow-xl transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="flex-1 flex flex-col overflow-y-auto">
            <div className="hidden md:flex items-center justify-center h-16 bg-indigo-950 text-white font-bold text-xl tracking-wider">
              ADMIN PANEL
            </div>
            
            <div className="p-4 border-b border-indigo-800">
              <div className="flex items-center">
                <div className="bg-indigo-700 text-white h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white line-clamp-1">{user?.name || 'Administrator'}</p>
                  <p className="text-xs text-indigo-300 capitalize">Super Admin</p>
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
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive(item.href) 
                      ? 'bg-indigo-800 text-white' 
                      : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'}
                  `}
                >
                  <item.icon 
                    className={`
                      mr-3 flex-shrink-0 h-5 w-5 
                      ${isActive(item.href) ? 'text-white' : 'text-indigo-300 group-hover:text-white'}
                    `} 
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
            <button
              onClick={handleLogout}
              className="flex-shrink-0 w-full group block text-left"
            >
              <div className="flex items-center">
                <FiLogOut className="inline-block h-5 w-5 text-indigo-300 group-hover:text-white" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-indigo-200 group-hover:text-white">
                    Logout
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-100">
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
