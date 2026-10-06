import React from 'react';
import { Link } from 'react-router-dom';

const PolicyLayout = ({ title, lastUpdated, children }) => (
  <div className="max-w-3xl mx-auto px-4 py-12">
    <div className="mb-8">
      <Link to="/" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
        ← Back to Home
      </Link>
    </div>
    <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
    {lastUpdated && (
      <p className="text-sm text-gray-500 mb-8">Last updated: {lastUpdated}</p>
    )}
    <div className="prose prose-gray max-w-none">
      {children}
    </div>
  </div>
);

const PlaceholderNotice = () => (
  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-6">
    <p className="text-amber-800 text-sm font-medium">
      ⚠️ This page contains placeholder content. Final legal content must be reviewed and
      supplied by the BigMart legal team before production launch.
    </p>
  </div>
);

export const PrivacyPolicy = () => (
  <PolicyLayout title="Privacy Policy" lastUpdated="January 2025">
    <PlaceholderNotice />
    <p className="text-gray-600 mb-4">
      At BigMart, we are committed to protecting your personal information and your right
      to privacy. This policy explains what information we collect, how we use it, and
      what rights you have in relation to it.
    </p>
    <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Information We Collect</h2>
    <p className="text-gray-600 mb-4">
      We collect information you provide directly to us (such as name, email, address, and
      payment details) when you register, make a purchase, or contact us.
    </p>
    <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">How We Use Your Information</h2>
    <p className="text-gray-600 mb-4">
      We use your information to process orders, provide customer support, improve our
      services, and send relevant communications with your consent.
    </p>
    <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Contact</h2>
    <p className="text-gray-600 mb-4">
      For privacy-related inquiries, please contact us at{' '}
      <Link to="/contact" className="text-primary-600 hover:underline">our contact page</Link>.
    </p>
  </PolicyLayout>
);

export const TermsOfService = () => (
  <PolicyLayout title="Terms of Service" lastUpdated="January 2025">
    <PlaceholderNotice />
    <p className="text-gray-600 mb-4">
      By accessing or using BigMart, you agree to be bound by these Terms of Service.
      Please read them carefully before using our platform.
    </p>
    <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Eligibility</h2>
    <p className="text-gray-600 mb-4">
      You must be at least 18 years of age to use BigMart. By using our service, you
      represent that you meet this requirement.
    </p>
    <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">User Accounts</h2>
    <p className="text-gray-600 mb-4">
      You are responsible for maintaining the confidentiality of your account credentials
      and for all activity that occurs under your account.
    </p>
    <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Prohibited Conduct</h2>
    <p className="text-gray-600 mb-4">
      You agree not to use BigMart to engage in fraudulent activities, violate any
      applicable laws, or infringe the rights of others.
    </p>
  </PolicyLayout>
);

export const ShippingPolicy = () => (
  <PolicyLayout title="Shipping Policy" lastUpdated="January 2025">
    <PlaceholderNotice />
    <p className="text-gray-600 mb-4">
      BigMart is a multi-vendor marketplace. Shipping is handled by individual sellers.
      Shipping charges and delivery timelines vary by seller and location.
    </p>
    <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Estimated Delivery</h2>
    <p className="text-gray-600 mb-4">
      Standard delivery: 3–7 business days. Express delivery options may be available
      depending on the seller and your location.
    </p>
    <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Shipping Charges</h2>
    <p className="text-gray-600 mb-4">
      Shipping charges are calculated based on the distance between the seller's warehouse
      and your delivery address, and are shown at checkout before you confirm your order.
    </p>
    <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Track Your Order</h2>
    <p className="text-gray-600 mb-4">
      You can track your order status from your{' '}
      <Link to="/account/orders" className="text-primary-600 hover:underline">Orders page</Link>.
    </p>
  </PolicyLayout>
);

export const SellerPolicies = () => (
  <PolicyLayout title="Seller Policies" lastUpdated="January 2025">
    <PlaceholderNotice />
    <p className="text-gray-600 mb-4">
      These policies govern sellers operating on the BigMart marketplace. By selling on
      BigMart, you agree to comply with all policies listed here.
    </p>
    <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Listing Requirements</h2>
    <p className="text-gray-600 mb-4">
      All products must be accurately described with clear images and correct categorisation.
      Prohibited items include counterfeit goods, illegal products, and hazardous materials.
    </p>
    <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Order Fulfillment</h2>
    <p className="text-gray-600 mb-4">
      Sellers are required to confirm and ship orders within the agreed handling time.
      Repeated delays or cancellations may result in account suspension.
    </p>
    <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Returns & Refunds</h2>
    <p className="text-gray-600 mb-4">
      Sellers must honour return requests within BigMart's return policy window.
      Refunds are processed through the BigMart payment system.
    </p>
    <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Commission</h2>
    <p className="text-gray-600 mb-4">
      BigMart charges a platform commission on each sale. Commission rates vary by
      category and are detailed in the seller onboarding documentation.
    </p>
    <div className="mt-8 p-4 bg-primary-50 rounded-lg">
      <p className="text-primary-800 text-sm">
        Ready to sell?{' '}
        <Link to="/seller/register" className="font-medium hover:underline">
          Apply to become a seller →
        </Link>
      </p>
    </div>
  </PolicyLayout>
);

export const HelpCenter = () => (
  <PolicyLayout title="Help Center">
    <p className="text-gray-600 mb-6">
      Find answers to common questions or contact our support team.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {[
        { title: 'Orders & Tracking', desc: 'View and track your orders.', link: '/account/orders' },
        { title: 'Returns & Refunds', desc: 'Learn about our return policy.', link: '/returns' },
        { title: 'Contact Support', desc: 'Get in touch with our team.', link: '/contact' },
        { title: 'Become a Seller', desc: 'Start selling on BigMart.', link: '/seller/register' },
      ].map((item) => (
        <Link
          key={item.title}
          to={item.link}
          className="block p-5 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
        >
          <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
          <p className="text-sm text-gray-500">{item.desc}</p>
        </Link>
      ))}
    </div>
    <PlaceholderNotice />
    <p className="text-gray-600">
      For urgent inquiries, please use our{' '}
      <Link to="/contact" className="text-primary-600 hover:underline">Contact page</Link>.
    </p>
  </PolicyLayout>
);

export const ContactUs = () => (
  <PolicyLayout title="Contact Us">
    <p className="text-gray-600 mb-6">
      We're here to help. Reach out to us through any of the channels below.
    </p>
    <PlaceholderNotice />
    <div className="space-y-4 mb-8">
      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <span className="text-2xl">📧</span>
        <div>
          <p className="font-medium text-gray-900">Email Support</p>
          <p className="text-sm text-gray-500">support@bigmart.in</p>
          <p className="text-xs text-gray-400">Response within 24–48 hours</p>
        </div>
      </div>
      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <span className="text-2xl">📞</span>
        <div>
          <p className="font-medium text-gray-900">Phone Support</p>
          <p className="text-sm text-gray-500">+91 1800 XXX XXXX (Toll-free)</p>
          <p className="text-xs text-gray-400">Mon–Sat, 9 AM – 6 PM IST</p>
        </div>
      </div>
    </div>
    <p className="text-sm text-gray-500">
      For order-specific issues, please visit your{' '}
      <Link to="/account/orders" className="text-primary-600 hover:underline">Orders page</Link>{' '}
      to initiate a return or cancellation directly.
    </p>
  </PolicyLayout>
);

export const ReturnsRefunds = () => (
  <PolicyLayout title="Returns & Refunds">
    <PlaceholderNotice />
    <p className="text-gray-600 mb-4">
      BigMart supports easy returns within the eligible return window for most products.
    </p>
    <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Return Window</h2>
    <p className="text-gray-600 mb-4">
      Most products are eligible for return within 7 days of delivery. Some categories
      may have different return windows as specified on the product page.
    </p>
    <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">How to Return</h2>
    <p className="text-gray-600 mb-4">
      Go to your{' '}
      <Link to="/account/orders" className="text-primary-600 hover:underline">Orders page</Link>,
      find the relevant order, and click "Request Return". Our team will guide you through
      the process.
    </p>
    <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Refund Timeline</h2>
    <p className="text-gray-600 mb-4">
      Refunds are processed within 5–7 business days after the return is received and
      inspected by the seller.
    </p>
  </PolicyLayout>
);

export const TrackOrder = () => {
  return (
    <div className="max-w-xl mx-auto px-4 py-12 text-center">
      <div className="text-6xl mb-4">📦</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">Track Your Order</h1>
      <p className="text-gray-600 mb-6">
        View live order status and tracking information from your account's Orders page.
      </p>
      <Link
        to="/account/orders"
        className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium inline-block"
      >
        Go to My Orders
      </Link>
    </div>
  );
};
