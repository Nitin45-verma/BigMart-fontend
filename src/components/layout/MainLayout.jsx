import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CategoryMenu from '../category/CategoryMenu';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <CategoryMenu />
      <main className="flex-grow bg-gray-50">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
