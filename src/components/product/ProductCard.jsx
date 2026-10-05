import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
// We'll dispatch real wishlist/cart thunks later when we build the cart/wishlist features, 
// for now we'll handle the UI state or call api directly if we want, 
// actually the prompt says "Wishlist integration - Use existing Step 19 backend wishlist APIs".
import { wishlistApi, cartApi } from '../../services/productApi';

const ProductCard = ({ product }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [imageError, setImageError] = useState(false);

  const fallbackImage = 'https://via.placeholder.com/300x300?text=No+Image';
  const primaryImage = product.images?.find(img => img.isPrimary)?.url || product.images?.[0]?.url || fallbackImage;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login?redirect=' + window.location.pathname);
      return;
    }
    try {
      setAddingToCart(true);
      await cartApi.addItem({ productId: product._id, quantity: 1 });
      alert('Added to cart!'); // We can replace with a toast later
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login?redirect=' + window.location.pathname);
      return;
    }
    try {
      setAddingToWishlist(true);
      await wishlistApi.addItem({ productId: product._id });
      alert('Added to wishlist!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding to wishlist');
    } finally {
      setAddingToWishlist(false);
    }
  };

  return (
    <div className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <Link to={`/products/${product.slug}`} className="block relative aspect-w-1 aspect-h-1 overflow-hidden">
        <img
          src={imageError ? fallbackImage : primaryImage}
          alt={product.name}
          onError={() => setImageError(true)}
          className="w-full h-48 object-contain object-center p-4 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {product.discount}% OFF
          </span>
        )}
        <button
          onClick={handleWishlist}
          disabled={addingToWishlist}
          className="absolute top-2 right-2 p-2 rounded-full bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 shadow-sm transition-colors"
          aria-label="Add to wishlist"
        >
          <FiHeart className={addingToWishlist ? 'animate-pulse' : ''} />
        </button>
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-gray-500 mb-1">{product.brand}</div>
        <Link to={`/products/${product.slug}`}>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-primary-600 h-10">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center mt-2">
          <div className="flex items-center text-yellow-400">
            <FiStar className="fill-current" />
            <span className="ml-1 text-sm font-medium text-gray-700">{product.averageRating?.toFixed(1) || '0.0'}</span>
          </div>
          <span className="mx-2 text-gray-300">|</span>
          <span className="text-xs text-gray-500">{product.numberOfReviews || 0} reviews</span>
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">₹{product.sellingPrice}</span>
          {product.originalPrice > product.sellingPrice && (
            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
          )}
        </div>
        
        {/* Fill vertical space */}
        <div className="flex-grow"></div>

        <div className="mt-4">
          <button
            onClick={handleAddToCart}
            disabled={addingToCart || product.stock <= 0}
            className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              product.stock > 0 
                ? 'bg-primary-50 text-primary-700 hover:bg-primary-600 hover:text-white' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <FiShoppingCart />
            {addingToCart ? 'Adding...' : product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
