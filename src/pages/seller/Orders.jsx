import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import sellerApi from '../../services/sellerApi';
import { useToast } from '../../context/ToastContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  // Guard against StrictMode double-invocation firing duplicate error toasts
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchOrders = async () => {
      try {
        const res = await sellerApi.getOrders();
        // API returns: { success, data: { orders, total, page, ... } }
        setOrders(res.data?.orders ?? []);
      } catch (err) {
        addToast(err.response?.data?.message || 'Failed to load orders', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []); // addToast is stable (useCallback); no deps needed

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'paid':
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'shipped':
      case 'out_of_delivery': return 'bg-indigo-100 text-indigo-800';
      case 'pending_payment': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending':
      case 'created': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>
        <div className="bg-white shadow rounded-lg border border-gray-200 p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No orders yet</h3>
          <p className="text-sm text-gray-500">
            Orders from customers containing your products will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Your Subtotal</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => {
                // The service returns `orderId` (the MongoDB _id) — NOT `_id`
                const id = order.orderId?.toString?.() ?? order._id?.toString?.();
                return (
                  <tr key={id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.orderNumber || (id ? id.substring(0, 8) : '—')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{order.sellerSubtotal ?? order.sellerTotal ?? order.grandTotal ?? '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusColor(order.orderStatus)}`}>
                        {(order.orderStatus || 'unknown').replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {(order.paymentStatus || 'created').replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {id ? (
                        <Link to={`/seller/orders/${id}`} className="text-primary-600 hover:text-primary-900">
                          View Details
                        </Link>
                      ) : (
                        <span className="text-gray-400">Unavailable</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
