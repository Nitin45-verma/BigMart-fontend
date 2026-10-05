import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Home from '../pages/Home';

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
      { path: 'products', element: <Placeholder title="Products Catalog" /> },
      { path: 'products/:slug', element: <Placeholder title="Product Details" /> },
      { path: 'categories/:slug', element: <Placeholder title="Category Products" /> },
      { path: 'login', element: <Placeholder title="Login Page" /> },
      { path: 'register', element: <Placeholder title="Register Page" /> },
      { path: 'verify-email', element: <Placeholder title="Verify Email" /> },
      { path: 'cart', element: <Placeholder title="Shopping Cart" /> },
      // Customer Routes
      {
        path: 'account',
        children: [
          { index: true, element: <Placeholder title="My Account" /> },
          { path: 'orders', element: <Placeholder title="My Orders" /> },
          { path: 'wishlist', element: <Placeholder title="My Wishlist" /> },
        ],
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
