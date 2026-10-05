import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails, fetchRelatedProducts } from '../features/products/productThunks';
import ProductGallery from '../components/product/ProductGallery';
import ProductInfo from '../components/product/ProductInfo';
import ProductReviews from '../components/review/ProductReviews';
import ProductCard from '../components/product/ProductCard';
import { FiChevronRight, FiAlertCircle } from 'react-icons/fi';

const ProductDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  
  const { 
    selectedProduct: product, 
    productLoading, 
    productError,
    relatedProducts,
    relatedProductsLoading
  } = useSelector((state) => state.products);

  useEffect(() => {
    if (slug) {
      dispatch(fetchProductDetails(slug));
      window.scrollTo(0, 0);
    }
  }, [dispatch, slug]);

  useEffect(() => {
    if (product?._id) {
      dispatch(fetchRelatedProducts(product._id));
    }
  }, [dispatch, product?._id]);

  if (productLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <div className="h-[400px] bg-gray-200 rounded-lg w-full"></div>
            <div className="flex gap-4 mt-4">
              {[1, 2, 3].map(i => <div key={i} className="h-20 w-20 bg-gray-200 rounded"></div>)}
            </div>
          </div>
          <div className="lg:w-1/2 space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            <div className="h-24 bg-gray-200 rounded w-full"></div>
            <div className="h-12 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <FiAlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h2 className="mt-2 text-lg font-medium text-gray-900">
          {productError === 'Product not found' ? 'Product Not Found' : 'Error Loading Product'}
        </h2>
        <p className="mt-1 text-sm text-gray-500 mb-6">
          {productError || 'The product you are looking for does not exist or has been removed.'}
        </p>
        <Link 
          to="/products" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white pb-16">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="border-b border-gray-200 bg-gray-50">
        <ol className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-10 space-x-2 text-sm text-gray-500">
          <li>
            <Link to="/" className="hover:text-primary-600">Home</Link>
          </li>
          <li><FiChevronRight className="h-4 w-4 text-gray-400" /></li>
          <li>
            <Link to="/products" className="hover:text-primary-600">Products</Link>
          </li>
          <li><FiChevronRight className="h-4 w-4 text-gray-400" /></li>
          {product.category && (
            <>
              <li>
                <Link to={`/products?categorySlug=${product.category.slug}`} className="hover:text-primary-600">
                  {product.category.name}
                </Link>
              </li>
              <li><FiChevronRight className="h-4 w-4 text-gray-400" /></li>
            </>
          )}
          <li className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-md" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-4">
        {/* Gallery & Info */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          <ProductGallery images={product.images} productName={product.name} />
          
          <div className="mt-10 lg:mt-0 px-2 sm:px-0">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Product Specifications / Full Description */}
        {product.description && (
          <div className="mt-16 border-t border-gray-200 pt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Details</h2>
            <div className="prose prose-sm sm:prose text-gray-600 max-w-none">
              {product.description.split('\n').map((para, idx) => (
                <p key={idx} className="mb-4">{para}</p>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <ProductReviews product={product} />

        {/* Related Products */}
        {!relatedProductsLoading && relatedProducts?.length > 0 && (
          <div className="mt-16 border-t border-gray-200 pt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map(rp => (
                <ProductCard key={rp._id} product={rp} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductDetail;
