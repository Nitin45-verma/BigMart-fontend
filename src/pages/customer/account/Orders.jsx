import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import orderApi from '../../../services/orderApi';
import { useToast } from '../../../context/ToastContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderApi.getUserOrders();
        setOrders(response.data.orders);
      } catch (err) {
        addToast(err.response?.data?.message || 'Failed to load orders', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [addToast]);

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'returned': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
          <Link to="/products" className="text-primary-600 font-medium hover:text-primary-700">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
              <div className="bg-gray-50 px-4 py-4 sm:px-6 flex flex-wrap items-center justify-between border-b border-gray-200 gap-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm flex-1">
                  <div>
                    <p className="text-gray-500 font-medium">Order Placed</p>
                    <p className="text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">Total</p>
                    <p className="text-gray-900">₹{order.grandTotal}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">Ship To</p>
                    <p className="text-gray-900">{order.shippingAddress?.fullName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">Order #</p>
                    <p className="text-gray-900">{order.orderNumber}</p>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadgeColor(order.orderStatus)}`}>
                    {order.orderStatus.replace('_', ' ')}
                  </span>
                  <Link
                    to={`/account/orders/${order._id}`}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 whitespace-nowrap ml-auto"
                  >
                    View Details
                  </Link>
                </div>
              </div>
              
              <div className="px-4 py-4 sm:px-6">
                <ul className="divide-y divide-gray-200">
                  {order.items.slice(0, 2).map((item) => (
                    <li key={item._id} className="py-4 flex items-center">
                      <div className="flex-1 ml-4">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-medium text-gray-900">₹{item.itemTotal}</div>
                    </li>
                  ))}
                </ul>
                {order.items.length > 2 && (
                  <div className="pt-2 text-sm text-gray-500">
                    + {order.items.length - 2} more item(s)
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
