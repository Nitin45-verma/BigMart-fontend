import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import orderApi from '../../../services/orderApi';
import reviewApi from '../../../services/reviewApi';
import { useToast } from '../../../context/ToastContext';
import { FiStar } from 'react-icons/fi';

const VALID_RETURN_REASONS = [
  { value: 'damaged', label: 'Damaged Product' },
  { value: 'defective', label: 'Defective Product' },
  { value: 'wrong_item', label: 'Wrong Item Delivered' },
  { value: 'missing_item', label: 'Missing Item/Parts' },
  { value: 'not_as_described', label: 'Not As Described' },
  { value: 'quality_issue', label: 'Quality Issue' },
  { value: 'other', label: 'Other' }
];

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  
  // Return Modal State
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnItem, setReturnItem] = useState(null);
  const [returnQty, setReturnQty] = useState(1);
  const [returnReason, setReturnReason] = useState('damaged');
  const [returnDesc, setReturnDesc] = useState('');
  const [returning, setReturning] = useState(false);

  // Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewItem, setReviewItem] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToast } = useToast();

  const fetchDetails = async () => {
    try {
      const res = await orderApi.getOrderById(orderId);
      setOrder(res.data.order);
      
      try {
        const trackRes = await orderApi.getOrderTracking(orderId);
        setTracking(trackRes.data);
      } catch (err) {
        // tracking might not exist or be relevant
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to load order', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [orderId, addToast]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    setCanceling(true);
    try {
      await orderApi.cancelOrder(orderId, 'Customer requested cancellation');
      addToast('Order cancelled successfully', 'success');
      fetchDetails();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to cancel order', 'error');
    } finally {
      setCanceling(false);
    }
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    if (returnReason === 'other' && !returnDesc.trim()) {
      addToast('Please provide a description', 'error');
      return;
    }
    
    setReturning(true);
    try {
      await orderApi.createReturn(orderId, {
        items: [{ product: returnItem.product, quantity: returnQty }],
        reason: returnReason,
        description: returnDesc
      });
      addToast('Return request submitted successfully', 'success');
      setShowReturnModal(false);
      fetchDetails();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to submit return request', 'error');
    } finally {
      setReturning(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await reviewApi.createReview(reviewItem.product, {
        rating,
        title: reviewTitle,
        comment: reviewComment,
        orderId: order._id
      });
      addToast('Review submitted successfully', 'success');
      setShowReviewModal(false);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (!order) return <div className="p-8 text-center text-gray-500">Order not found</div>;

  const canCancel = order.orderStatus === 'pending_payment' || order.orderStatus === 'paid' || order.orderStatus === 'processing';
  const isDelivered = order.orderStatus === 'delivered';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
        <Link to="/account/orders" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          &larr; Back to Orders
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 mb-6">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Order <span className="font-medium text-gray-900">{order.orderNumber}</span></p>
            <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize bg-blue-100 text-blue-800">
              {order.orderStatus.replace('_', ' ')}
            </span>
            {canCancel && (
              <button 
                onClick={handleCancel}
                disabled={canceling}
                className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50 border border-red-200 px-3 py-1 rounded hover:bg-red-50"
              >
                {canceling ? 'Canceling...' : 'Cancel Order'}
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Items</h3>
              <ul className="divide-y divide-gray-200 border-t border-b border-gray-200">
                {order.items.map((item) => (
                  <li key={item._id} className="py-4 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                      <p className="text-sm text-gray-500">Unit Price: ₹{item.unitPrice}</p>
                      
                      {isDelivered && (
                        <div className="mt-3 flex gap-3">
                          <button
                            onClick={() => {
                              setReturnItem(item);
                              setReturnQty(1);
                              setShowReturnModal(true);
                            }}
                            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                          >
                            Return Item
                          </button>
                          <button
                            onClick={() => {
                              setReviewItem(item);
                              setRating(5);
                              setReviewTitle('');
                              setReviewComment('');
                              setShowReviewModal(true);
                            }}
                            className="text-xs text-gray-600 hover:text-gray-900 font-medium"
                          >
                            Write Review
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">₹{item.itemTotal}</p>
                    </div>
                  </li>
                ))}
              </ul>
              
              {tracking && tracking.fulfillments && tracking.fulfillments.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Shipment Tracking</h3>
                  <div className="bg-gray-50 rounded p-4 border border-gray-200 space-y-6">
                    {tracking.fulfillments.map((f, i) => (
                      <div key={i} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                        <p className="text-sm font-medium mb-1">Shipment {i+1} Status: <span className="capitalize text-primary-600">{f.status.replace('_', ' ')}</span></p>
                        {f.trackingNumber && <p className="text-sm text-gray-600 mb-2">Tracking Number: <span className="font-medium">{f.trackingNumber}</span> ({f.carrier || 'Standard'})</p>}
                        
                        {f.events && f.events.length > 0 && (
                          <div className="mt-3">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Timeline</h4>
                            <ul className="space-y-3">
                              {f.events.map((event, j) => (
                                <li key={j} className="text-sm flex items-start">
                                  <div className="min-w-[140px] text-gray-500 text-xs mt-0.5">
                                    {new Date(event.timestamp).toLocaleString()}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900 capitalize">{event.status.replace('_', ' ')}</p>
                                    {event.notes && <p className="text-gray-500 mt-0.5">{event.notes}</p>}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Order Summary</h3>
                <div className="bg-gray-50 rounded p-4 border border-gray-200">
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Subtotal</dt>
                      <dd className="font-medium text-gray-900">₹{order.subtotal}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Shipping</dt>
                      <dd className="font-medium text-gray-900">₹{order.deliveryFee}</dd>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <dt>Discount</dt>
                        <dd>-₹{order.discount}</dd>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                      <dt className="font-medium text-gray-900">Grand Total</dt>
                      <dd className="font-bold text-gray-900">₹{order.grandTotal}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Shipping Address</h3>
                <div className="bg-gray-50 rounded p-4 border border-gray-200 text-sm text-gray-700">
                  <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                  <p>{order.shippingAddress.country}</p>
                  <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Payment</h3>
                <div className="bg-gray-50 rounded p-4 border border-gray-200 text-sm text-gray-700">
                  <p className="capitalize">Method: {order.payment?.provider}</p>
                  <p>Status: <span className={`font-medium ${order.payment?.status === 'paid' ? 'text-green-600' : 'text-gray-900'}`}>{order.payment?.status}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Return Modal */}
      {showReturnModal && returnItem && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowReturnModal(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleReturnSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">Request Return</h3>
                  <p className="text-sm text-gray-500 mb-4">Returning: {returnItem.name}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                      <select 
                        value={returnQty} 
                        onChange={(e) => setReturnQty(Number(e.target.value))}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                      >
                        {[...Array(returnItem.quantity)].map((_, i) => (
                          <option key={i+1} value={i+1}>{i+1}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                      <select 
                        value={returnReason} 
                        onChange={(e) => setReturnReason(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                      >
                        {VALID_RETURN_REASONS.map(r => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                    </div>
                    {returnReason === 'other' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description (Required)</label>
                        <textarea
                          required
                          value={returnDesc}
                          onChange={(e) => setReturnDesc(e.target.value)}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          rows="3"
                          maxLength={1000}
                        ></textarea>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={returning}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {returning ? 'Submitting...' : 'Submit Request'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReturnModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && reviewItem && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowReviewModal(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleReviewSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">Write Review</h3>
                  <p className="text-sm text-gray-500 mb-4">Reviewing: {reviewItem.name}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                      <div className="flex items-center space-x-2 cursor-pointer">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FiStar 
                            key={star} 
                            onClick={() => setRating(star)}
                            className={`w-6 h-6 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title (Optional)</label>
                      <input
                        type="text"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        maxLength={200}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Comment (Required)</label>
                      <textarea
                        required
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        rows="4"
                        minLength={3}
                        maxLength={2000}
                        placeholder="What did you think about this product?"
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
