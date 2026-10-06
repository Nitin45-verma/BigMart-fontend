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

import SellerLayout from '../pages/seller/SellerLayout';
import SellerDashboard from '../pages/seller/Dashboard';
import SellerProducts from '../pages/seller/Products';
import SellerProductForm from '../pages/seller/ProductForm';
import SellerOrders from '../pages/seller/Orders';
import SellerOrderDetails from '../pages/seller/OrderDetails';
import SellerInventory from '../pages/seller/Inventory';
import SellerAnalytics from '../pages/seller/Analytics';
import SellerWallet from '../pages/seller/Wallet';
import BecomeASeller from '../pages/seller/BecomeASeller';

import AdminLayout from '../pages/admin/AdminLayout';
import AdminDashboard from '../pages/admin/Dashboard';
import AdminUsers from '../pages/admin/Users';
import AdminSellers from '../pages/admin/Sellers';
import AdminCategories from '../pages/admin/Categories';
import AdminProducts from '../pages/admin/Products';
import AdminSellerApplications from '../pages/admin/SellerApplications';
import AdminOrders from '../pages/admin/Orders';
import AdminOrderDetails from '../pages/admin/OrderDetails';
import AdminReturns from '../pages/admin/Returns';
import AdminFinance from '../pages/admin/Finance';
import AdminAnalytics from '../pages/admin/Analytics';
import AdminAuditLogs from '../pages/admin/AuditLogs';
import AdminSupportDashboard from '../pages/admin/SupportDashboard';
import AdminSupportTickets from '../pages/admin/SupportTickets';
import AdminSupportTicketDetails from '../pages/admin/SupportTicketDetails';

import NotFoundPage from '../pages/NotFoundPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import {
  PrivacyPolicy,
  TermsOfService,
  ShippingPolicy,
  SellerPolicies,
  HelpCenter,
  ContactUs,
  ReturnsRefunds,
  TrackOrder,
} from '../pages/PublicPages';

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
      { path: 'unauthorized', element: <UnauthorizedPage /> },

      // Public / Informational routes referenced by Footer/UI
      { path: 'privacy', element: <PrivacyPolicy /> },
      { path: 'terms', element: <TermsOfService /> },
      { path: 'shipping-policy', element: <ShippingPolicy /> },
      { path: 'help', element: <HelpCenter /> },
      { path: 'contact', element: <ContactUs /> },
      { path: 'returns', element: <ReturnsRefunds /> },
      { path: 'track', element: <TrackOrder /> },

      // Seller onboarding (public — shows login prompt if not authenticated)
      { path: 'seller/register', element: <BecomeASeller /> },
      { path: 'seller/policies', element: <SellerPolicies /> },

      {
        path: 'cart',
        element: <ProtectedRoute><RoleRoute allowedRoles={['customer']}><Cart /></RoleRoute></ProtectedRoute>,
      },
      {
        path: 'checkout',
        element: <ProtectedRoute><RoleRoute allowedRoles={['customer']}><Checkout /></RoleRoute></ProtectedRoute>,
      },
      {
        path: 'order-success/:orderId',
        element: <ProtectedRoute><RoleRoute allowedRoles={['customer']}><OrderSuccess /></RoleRoute></ProtectedRoute>,
      },
      // Customer account routes
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
      {
        path: 'wishlist',
        element: <ProtectedRoute><RoleRoute allowedRoles={['customer']}><Wishlist /></RoleRoute></ProtectedRoute>,
      },
    ],
  },
  // Seller Routes — requires authenticated seller role
  {
    path: '/seller',
    element: <ProtectedRoute><RoleRoute allowedRoles={['seller']}><SellerLayout /></RoleRoute></ProtectedRoute>,
    children: [
      { index: true, element: <SellerDashboard /> },
      { path: 'products', element: <SellerProducts /> },
      { path: 'products/new', element: <SellerProductForm /> },
      { path: 'products/:productId/edit', element: <SellerProductForm /> },
      { path: 'inventory', element: <SellerInventory /> },
      { path: 'orders', element: <SellerOrders /> },
      { path: 'orders/:orderId', element: <SellerOrderDetails /> },
      { path: 'wallet', element: <SellerWallet /> },
      { path: 'analytics', element: <SellerAnalytics /> },
    ],
  },
  // Admin Routes — requires authenticated admin role
  {
    path: '/admin',
    element: <ProtectedRoute><RoleRoute allowedRoles={['admin']}><AdminLayout /></RoleRoute></ProtectedRoute>,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'users', element: <AdminUsers /> },
      { path: 'sellers', element: <AdminSellers /> },
      { path: 'seller-applications', element: <AdminSellerApplications /> },
      { path: 'categories', element: <AdminCategories /> },
      { path: 'products', element: <AdminProducts /> },
      { path: 'orders', element: <AdminOrders /> },
      { path: 'orders/:orderId', element: <AdminOrderDetails /> },
      { path: 'returns', element: <AdminReturns /> },
      { path: 'finance', element: <AdminFinance /> },
      { path: 'analytics', element: <AdminAnalytics /> },
      { path: 'audit-logs', element: <AdminAuditLogs /> },
      { path: 'support', element: <AdminSupportDashboard /> },
      { path: 'support/tickets', element: <AdminSupportTickets /> },
      { path: 'support/tickets/:ticketId', element: <AdminSupportTicketDetails /> },
    ],
  },
  // Global 404 fallback — catches any URL not matched above
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
