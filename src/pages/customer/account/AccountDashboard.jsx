import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiUser, FiPackage, FiMapPin, FiHeart, FiLogOut } from 'react-icons/fi';

const AccountDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const stats = [
    { name: 'My Orders', icon: FiPackage, href: '/account/orders', color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'My Addresses', icon: FiMapPin, href: '/account/addresses', color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'My Profile', icon: FiUser, href: '/account/profile', color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Wishlist', icon: FiHeart, href: '/account/wishlist', color: 'text-pink-600', bg: 'bg-pink-100' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="mt-2 text-sm text-gray-600">Welcome back, {user?.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center hover:shadow-md transition-shadow duration-200"
          >
            <div className={`p-4 rounded-full ${item.bg} ${item.color} mb-4`}>
              <item.icon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AccountDashboard;
