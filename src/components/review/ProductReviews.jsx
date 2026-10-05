import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductReviews } from '../../features/products/productThunks';
import { FiStar, FiCheckCircle } from 'react-icons/fi';
import Pagination from '../ui/Pagination';

const ProductReviews = ({ product }) => {
  const dispatch = useDispatch();
  const { productReviews, reviewsPagination, reviewsLoading } = useSelector((state) => state.products);
  
  const [filterRating, setFilterRating] = useState('');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    if (product?._id) {
      dispatch(fetchProductReviews({ 
        productId: product._id, 
        params: { page: 1, limit: 10, sort, rating: filterRating } 
      }));
    }
  }, [dispatch, product?._id, sort, filterRating]);

  const handlePageChange = (page) => {
    dispatch(fetchProductReviews({ 
      productId: product._id, 
      params: { page, limit: 10, sort, rating: filterRating } 
    }));
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center text-yellow-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar key={star} className={star <= rating ? 'fill-current' : 'text-gray-300'} />
        ))}
      </div>
    );
  };

  const getPercentage = (count) => {
    if (!product.ratingCount || product.ratingCount === 0) return 0;
    return Math.round((count / product.ratingCount) * 100);
  };

  return (
    <div id="reviews" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 mt-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Rating Summary */}
        <div className="lg:w-1/3">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
          
          <div className="flex items-center mb-4">
            <span className="text-4xl font-extrabold text-gray-900 mr-4">
              {product.ratingAverage?.toFixed(1) || '0.0'}
            </span>
            <div>
              {renderStars(Math.round(product.ratingAverage || 0))}
              <p className="text-sm text-gray-500 mt-1">Based on {product.ratingCount || 0} reviews</p>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = product.ratingBreakdown?.[rating] || 0;
              const percent = getPercentage(count);
              return (
                <div key={rating} className="flex items-center text-sm">
                  <span className="w-8 text-gray-600 font-medium">{rating} ★</span>
                  <div className="flex-1 mx-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 rounded-full" 
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-gray-500">{percent}%</span>
                </div>
              );
            })}
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Review this product</h3>
            <p className="text-sm text-gray-500 mb-4">Share your thoughts with other customers.</p>
            {/* The Write Review form is complex due to order validation. For now, a disabled prompt or redirect to orders page is safest per backend constraints. */}
            <button
              disabled
              className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none cursor-not-allowed opacity-75"
              title="Only customers who purchased this item can write a review via their Orders page."
            >
              Write a Review
            </button>
            <p className="text-xs text-gray-400 mt-2 text-center">Purchased items can be reviewed from your Orders page.</p>
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:w-2/3">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-gray-200 gap-4">
            <h3 className="text-lg font-medium text-gray-900">
              {reviewsPagination.total} {reviewsPagination.total === 1 ? 'Review' : 'Reviews'}
            </h3>
            
            <div className="flex gap-4 w-full sm:w-auto">
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="block w-full rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-gray-900 focus:ring-primary-500 focus:border-primary-500 sm:text-sm border"
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="block w-full rounded-md border-gray-300 py-1.5 pl-3 pr-10 text-gray-900 focus:ring-primary-500 focus:border-primary-500 sm:text-sm border"
              >
                <option value="newest">Newest First</option>
                <option value="rating_high">Highest Rated</option>
                <option value="rating_low">Lowest Rated</option>
              </select>
            </div>
          </div>

          {reviewsLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse flex gap-4">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : productReviews.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No reviews found matching your criteria.
            </div>
          ) : (
            <div className="space-y-8">
              {productReviews.map((review) => (
                <div key={review._id} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                        {review.customer?.firstName?.charAt(0) || review.customer?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {review.customer?.firstName || review.customer?.name || 'Anonymous'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    {review.isVerifiedPurchase && (
                      <span className="inline-flex items-center text-xs font-medium text-green-600">
                        <FiCheckCircle className="mr-1" />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-3 mb-2 flex items-center gap-3">
                    {renderStars(review.rating)}
                    {review.title && <h4 className="text-sm font-bold text-gray-900">{review.title}</h4>}
                  </div>
                  
                  <div className="prose prose-sm max-w-none text-gray-600">
                    <p>{review.comment}</p>
                  </div>

                  {review.sellerReply && (
                    <div className="mt-4 bg-gray-50 rounded-lg p-4 ml-4 sm:ml-12 border border-gray-200 border-l-4 border-l-primary-500">
                      <p className="text-xs font-bold text-gray-900 mb-1">
                        Response from Seller
                        <span className="text-gray-500 font-normal ml-2">
                          {new Date(review.sellerReplyAt).toLocaleDateString()}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">{review.sellerReply}</p>
                    </div>
                  )}
                </div>
              ))}

              <Pagination pagination={reviewsPagination} onPageChange={handlePageChange} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
