import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">BigMart</h3>
            <p className="text-sm">
              India's premier marketplace. Shop from thousands of verified sellers offering the best products at the best prices.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Customer Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
              <li><Link to="/track" className="hover:text-white">Track Order</Link></li>
              <li><Link to="/returns" className="hover:text-white">Returns & Refunds</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Sell on BigMart</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/seller/register" className="hover:text-white">Become a Seller</Link></li>
              <li><Link to="/seller/login" className="hover:text-white">Seller Login</Link></li>
              <li><Link to="/seller/policies" className="hover:text-white">Seller Policies</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Policies</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-white">Shipping Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} BigMart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
