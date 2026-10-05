import React from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Home from '../pages/Home';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import VerifyEmail from '../pages/auth/VerifyEmail';
import OAuthSuccess from '../pages/auth/OAuthSuccess';
import Catalog from '../pages/Catalog';
import ProductDetail from '../pages/ProductDetail';

import Cart from '../pages/customer/Cart';
import Wishlist from '../pages/customer/Wishlist';
import AddressManagement from '../pages/customer/AddressManagement';
import Checkout from '../pages/customer/Checkout';
import OrderSuccess from '../pages/customer/OrderSuccess';

import ProtectedRoute from '../components/common/ProtectedRoute';
import RoleRoute from '../components/common/RoleRoute';

import AccountDashboard from '../pages/customer/account/AccountDashboard';
import Profile from '../pages/customer/account/Profile';
import Orders from '../pages/customer/account/Orders';
import OrderDetails from '../pages/customer/account/OrderDetails';

// Route placeholders for future features
const Placeholder = ({ title }) => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <h1 className="text-2xl font-semibold text-gray-700">{title}</h1>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'products', element: <Catalog /> },
      { path: 'products/:slug', element: <ProductDetail /> },
      { path: 'categories/:slug', element: <Placeholder title="Category Products" /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'verify-email', element: <VerifyEmail /> },
      { path: 'oauth/success', element: <OAuthSuccess /> },
      { 
        path: 'cart', 
        element: <ProtectedRoute><RoleRoute allowedRoles={['customer']}><Cart /></RoleRoute></ProtectedRoute> 
      },
      { 
        path: 'checkout', 
        element: <ProtectedRoute><RoleRoute allowedRoles={['customer']}><Checkout /></RoleRoute></ProtectedRoute> 
      },
      { 
        path: 'order-success/:orderId', 
        element: <ProtectedRoute><RoleRoute allowedRoles={['customer']}><OrderSuccess /></RoleRoute></ProtectedRoute> 
      },
      // Customer Routes
      {
        path: 'account',
        element: <ProtectedRoute><RoleRoute allowedRoles={['customer']}><Outlet /></RoleRoute></ProtectedRoute>,
        children: [
          { index: true, element: <AccountDashboard /> },
          { path: 'profile', element: <Profile /> },
          { path: 'orders', element: <Orders /> },
          { path: 'orders/:orderId', element: <OrderDetails /> },
          { path: 'wishlist', element: <Wishlist /> },
          { path: 'addresses', element: <AddressManagement /> },
        ],
      },
      // Keep legacy /wishlist route at root level for easy access if needed, or redirect
      { 
        path: 'wishlist', 
        element: <ProtectedRoute><RoleRoute allowedRoles={['customer']}><Wishlist /></RoleRoute></ProtectedRoute> 
      },
    ],
  },
  // Seller Routes
  {
    path: '/seller',
    element: <Placeholder title="Seller Layout" />,
    children: [
      { index: true, element: <Placeholder title="Seller Dashboard" /> },
      { path: 'products', element: <Placeholder title="Seller Products" /> },
      { path: 'orders', element: <Placeholder title="Seller Orders" /> },
    ],
  },
  // Admin Routes
  {
    path: '/admin',
    element: <Placeholder title="Admin Layout" />,
    children: [
      { index: true, element: <Placeholder title="Admin Dashboard" /> },
      { path: 'users', element: <Placeholder title="Manage Users" /> },
    ],
  },
]);
