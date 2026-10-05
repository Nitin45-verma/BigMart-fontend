import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import adminApi from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchDetails = async () => {
    try {
      const res = await adminApi.getOrderById(orderId);
      setOrder(res.data.order || res.data);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to load order details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [orderId, addToast]);

  const handleStatusChange = async (newStatus) => {
    if (!window.confirm(`Change order status to ${newStatus}?`)) return;
    try {
      await adminApi.updateOrderStatus(orderId, { orderStatus: newStatus });
      addToast('Order status updated', 'success');
      fetchDetails();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 animate-pulse">Loading order...</div>;
  }

  if (!order) return <div className="p-8 text-center text-gray-500">Order not found</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
        <Link to="/admin/orders" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
          &larr; Back to Orders
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-200 mb-6 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center">
            <div>
              <p className="text-sm text-gray-500">Order <span className="font-medium text-gray-900">{order.orderNumber || order._id}</span></p>
              <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-2 items-center">
              <span className="text-sm text-gray-500 mr-2">Admin Override:</span>
              <select 
                value={order.orderStatus} 
                onChange={(e) => handleStatusChange(e.target.value)}
                className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="returned">Returned</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Details</h3>
            <p className="text-sm text-gray-600"><span className="font-medium">Name:</span> {order.customer?.name || 'N/A'}</p>
            <p className="text-sm text-gray-600"><span className="font-medium">Email:</span> {order.customer?.email || 'N/A'}</p>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900">Shipping Address</h4>
              {order.shippingAddress ? (
                <p className="text-sm text-gray-600 mt-1">
                  {order.shippingAddress.street}<br/>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br/>
                  {order.shippingAddress.country}
                </p>
              ) : (
                <p className="text-sm text-gray-500 mt-1">No address provided</p>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Summary</h3>
            <p className="text-sm text-gray-600"><span className="font-medium">Method:</span> {order.paymentMethod || 'Razorpay'}</p>
            <p className="text-sm text-gray-600"><span className="font-medium">Status:</span> {order.paymentStatus}</p>
            <p className="text-sm text-gray-600 mt-2"><span className="font-medium">Subtotal:</span> ₹{order.totalAmount}</p>
            <p className="text-sm text-gray-600"><span className="font-medium">Shipping:</span> ₹{order.shippingCost}</p>
            {order.discountAmount > 0 && <p className="text-sm text-green-600"><span className="font-medium">Discount:</span> -₹{order.discountAmount}</p>}
            <p className="text-base font-bold text-gray-900 mt-2 border-t pt-2">Grand Total: ₹{order.grandTotal}</p>
          </div>
        </div>

        <div className="px-6 pb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 border-t pt-6">Order Items</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seller ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items?.map((item) => (
                  <tr key={item._id}>
                    <td className="px-4 py-4 text-sm text-gray-900">{item.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{item.seller?.substring(0,8) || 'N/A'}...</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{item.quantity}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">₹{item.unitPrice}</td>
                    <td className="px-4 py-4 text-sm text-gray-900 font-medium">₹{item.itemTotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
