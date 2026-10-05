import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import sellerApi from '../../services/sellerApi';
import { useToast } from '../../context/ToastContext';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchDetails = async () => {
    try {
      const res = await sellerApi.getOrderById(orderId);
      setOrder(res.data.order);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to load order details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [orderId, addToast]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading order...</div>;
  }

  if (!order) return <div className="p-8 text-center text-gray-500">Order not found</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
        <Link to="/seller/orders" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          &larr; Back to Orders
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-200 mb-6 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center">
            <div>
              <p className="text-sm text-gray-500">Order <span className="font-medium text-gray-900">{order.orderNumber || order._id.substring(0, 8)}</span></p>
              <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize bg-blue-100 text-blue-800">
                {order.orderStatus.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Items to Fulfill</h3>
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items.map((item) => (
                  <tr key={item._id}>
                    <td className="px-4 py-4 text-sm text-gray-900 font-medium">{item.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{item.sku || 'N/A'}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{item.quantity}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">₹{item.unitPrice}</td>
                    <td className="px-4 py-4 text-sm text-gray-900 font-medium">₹{item.itemTotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-medium text-blue-900 mb-2">Fulfillment Operations</h3>
            <p className="text-sm text-blue-700">
              State transitions (Confirm, Pack, Ship) are managed via the dedicated Fulfillments API (`/api/v1/seller/fulfillments`).
              Please route shipment mutations through the native warehouse manager dashboard if configured.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
