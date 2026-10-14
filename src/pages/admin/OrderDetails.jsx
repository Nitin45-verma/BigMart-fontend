import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import adminApi from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const fetchedRef = useRef(false);

  const fetchDetails = async () => {
    try {
      const res = await adminApi.getOrderById(orderId);
      // Controller sends: { success, data: order }
      setOrder(res.data);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to load order details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchDetails();
  }, [orderId]);

  const handleStatusChange = async (newStatus) => {
    if (newStatus === order.orderStatus) return;
    if (!window.confirm(`Change order status to "${newStatus.replace(/_/g, ' ')}"?`)) return;
    try {
      const res = await adminApi.updateOrderStatus(orderId, { orderStatus: newStatus });
      addToast(res.message || 'Order status updated', 'success');
      // Re-fetch to get updated order
      const refreshed = await adminApi.getOrderById(orderId);
      setOrder(refreshed.data);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update status', 'error');
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

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'paid':
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'shipped':
      case 'out_of_delivery': return 'bg-indigo-100 text-indigo-800';
      case 'pending_payment': return 'bg-yellow-100 text-yellow-800';
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

  if (!order) return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
        <Link to="/admin/orders" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
          &larr; Back to Orders
        </Link>
      </div>
      <div className="bg-white shadow rounded-lg border border-gray-200 p-12 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-1">Order not found</h3>
        <p className="text-sm text-gray-500">This order does not exist in the system.</p>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
        <Link to="/admin/orders" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
          &larr; Back to Orders
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-200 mb-6 overflow-hidden">
        {/* Header: Order number, statuses, admin override */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <p className="text-sm text-gray-500">
                Order <span className="font-medium text-gray-900">{order.orderNumber || order._id}</span>
              </p>
              <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Order Status badge */}
              <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${getOrderStatusColor(order.orderStatus)}`}>
                {(order.orderStatus || 'unknown').replace(/_/g, ' ')}
              </span>
              {/* Payment Status badge */}
              <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${getPaymentStatusColor(order.payment?.status)}`}>
                Payment: {(order.payment?.status || 'unknown').replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Customer details */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Details</h3>
            <p className="text-sm text-gray-600"><span className="font-medium">Name:</span> {order.user?.name || 'N/A'}</p>
            <p className="text-sm text-gray-600"><span className="font-medium">Email:</span> {order.user?.email || 'N/A'}</p>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900">Shipping Address</h4>
              {order.shippingAddress ? (
                <p className="text-sm text-gray-600 mt-1">
                  {order.shippingAddress.fullName && <>{order.shippingAddress.fullName}<br/></>}
                  {order.shippingAddress.phone && <>{order.shippingAddress.phone}<br/></>}
                  {order.shippingAddress.addressLine1}{order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}<br/>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br/>
                  {order.shippingAddress.country || 'India'}
                </p>
              ) : (
                <p className="text-sm text-gray-500 mt-1">No address provided</p>
              )}
            </div>
          </div>

          {/* Payment & Financial Summary */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Summary</h3>
            <p className="text-sm text-gray-600"><span className="font-medium">Provider:</span> {order.payment?.provider || 'Razorpay'}</p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Payment Status:</span>{' '}
              <span className={`inline-flex px-2 text-xs leading-5 font-semibold rounded-full capitalize ${getPaymentStatusColor(order.payment?.status)}`}>
                {(order.payment?.status || 'unknown').replace(/_/g, ' ')}
              </span>
            </p>
            {order.payment?.razorpayPaymentId && (
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Razorpay Payment ID:</span> {order.payment.razorpayPaymentId}
              </p>
            )}
            <div className="mt-4 space-y-1">
              <p className="text-sm text-gray-600"><span className="font-medium">Subtotal:</span> ₹{order.subtotal?.toFixed(2)}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">GST:</span> ₹{order.gstTotal?.toFixed(2)}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">Delivery Fee:</span> ₹{(order.deliveryFee || 0).toFixed(2)}</p>
              {(order.discount > 0 || order.coupon?.discountAmount > 0) && (
                <p className="text-sm text-green-600">
                  <span className="font-medium">Discount:</span> −₹{(order.discount || order.coupon?.discountAmount || 0).toFixed(2)}
                  {order.coupon?.code && <span className="text-gray-500 ml-1">({order.coupon.code})</span>}
                </p>
              )}
              <p className="text-base font-bold text-gray-900 mt-2 border-t pt-2">
                Grand Total: ₹{order.grandTotal?.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Admin Order Status Override */}
        <div className="px-6 pb-6 border-t border-gray-200 pt-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Change Order Status:</label>
            <select 
              value={order.orderStatus} 
              onChange={(e) => handleStatusChange(e.target.value)}
              className="block w-52 pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
            >
              <option value="pending_payment">Pending Payment</option>
              <option value="paid">Paid</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="out_of_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <span className="text-xs text-gray-400">
              State machine enforced server-side
            </span>
          </div>
        </div>

        {/* Order Items */}
        <div className="px-6 pb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 border-t pt-6">Order Items</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seller</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">GST</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items?.map((item, idx) => (
                  <tr key={item._id || idx}>
                    <td className="px-4 py-4 text-sm text-gray-900 font-medium">{item.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {item.seller?.businessName || (typeof item.seller === 'string' ? item.seller.substring(0, 8) + '…' : 'N/A')}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">{item.sku || 'N/A'}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{item.quantity}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">₹{item.unitPrice}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{item.gstRate || 0}%</td>
                    <td className="px-4 py-4 text-sm text-gray-900 font-medium">₹{item.itemTotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shipping breakdown if available */}
        {order.shipping?.sellers && order.shipping.sellers.length > 0 && (
          <div className="px-6 pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 border-t pt-6">Shipping Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seller</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Distance</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery Fee</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.shipping.sellers.map((s, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-4 text-sm text-gray-900">{s.sellerName || s.seller?.toString().substring(0, 8)}</td>
                      <td className="px-4 py-4 text-sm text-gray-500">{s.distanceKm?.toFixed(1)} km</td>
                      <td className="px-4 py-4 text-sm text-gray-900">₹{s.deliveryFee?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
