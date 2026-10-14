import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import sellerApi from '../../services/sellerApi';
import { useToast } from '../../context/ToastContext';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { addToast } = useToast();
  // Guard against StrictMode double-invocation
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchDetails = async () => {
      try {
        const res = await sellerApi.getOrderById(orderId);
        // API returns: { success, data: { orderId, orderNumber, items, ... } }
        // Note: the service returns the order object directly under `data`, not `data.order`
        const orderData = res.data;
        if (!orderData || !orderData.orderId) {
          setNotFound(true);
        } else {
          setOrder(orderData);
        }
      } catch (err) {
        const status = err.response?.status;
        const message = err.response?.data?.message || 'Failed to load order details';
        if (status === 404) {
          setNotFound(true);
        } else {
          addToast(message, 'error');
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [orderId]); // orderId is the only true dependency; addToast is stable

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          <Link to="/seller/orders" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            &larr; Back to Orders
          </Link>
        </div>
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
          <h3 className="text-lg font-medium text-gray-900 mb-1">Order not found</h3>
          <p className="text-sm text-gray-500 mb-4">
            This order either does not exist or does not belong to your seller account.
          </p>
          <Link
            to="/seller/orders"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
          >
            &larr; Back to Orders
          </Link>
        </div>
      </div>
    );
  }

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
              <p className="text-sm text-gray-500">
                Order <span className="font-medium text-gray-900">
                  {order.orderNumber || order.orderId?.toString?.().substring(0, 8)}
                </span>
              </p>
              <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize bg-blue-100 text-blue-800">
                {order.orderStatus?.replace('_', ' ') ?? 'unknown'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Items to Fulfill</h3>
          <div className="overflow-x-auto mb-6">
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
                {(order.items ?? []).map((item) => (
                  <tr key={item._id ?? item.product?.toString()}>
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

          {/* Financial Summary */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Your Subtotal</span>
              <span>₹{order.sellerSubtotal ?? '—'}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Platform Fee</span>
              <span className="text-red-600">− ₹{order.platformFee ?? '—'}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-gray-900 border-t border-gray-200 pt-2 mt-2">
              <span>Net Revenue</span>
              <span>₹{order.sellerNetRevenue ?? '—'}</span>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Ship To</h4>
              <p className="text-sm text-gray-600">{order.shippingAddress.fullName}</p>
              <p className="text-sm text-gray-600">{order.shippingAddress.phone}</p>
              <p className="text-sm text-gray-600">
                {[
                  order.shippingAddress.addressLine1,
                  order.shippingAddress.addressLine2,
                  order.shippingAddress.city,
                  order.shippingAddress.state,
                  order.shippingAddress.postalCode,
                  order.shippingAddress.country,
                ]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            </div>
          )}

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-medium text-blue-900 mb-2">Fulfillment Operations</h3>
            <p className="text-sm text-blue-700">
              State transitions (Confirm, Pack, Ship) are managed via the dedicated Fulfillments API
              (<code>/api/v1/seller/fulfillments</code>). Please route shipment mutations through the
              native warehouse manager dashboard if configured.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
