# BigMart Product Catalog API Contract

## 1. Categories
- **Endpoint**: `GET /api/v1/categories`
- **Response**: Array of categories (potentially hierarchical).
- **Endpoint**: `GET /api/v1/categories/slug/:slug`
- **Response**: Single category details.

## 2. Product Search & Listing
- **Endpoint**: `GET /api/v1/products`
- **Query Parameters**:
  - `q` (string)
  - `categorySlug` (string)
  - `categoryId` (ObjectId)
  - `subCategory` (ObjectId)
  - `brand` (string)
  - `seller` (ObjectId)
  - `minPrice` (number)
  - `maxPrice` (number)
  - `minRating` (0-5)
  - `maxRating` (0-5)
  - `inStock` (boolean string)
  - `minDiscount` (number)
  - `sort` (relevance, newest, price_asc, price_desc, rating_desc, rating_asc, discount_desc, price_low_to_high, price_high_to_low, name)
  - `page` (number)
  - `limit` (number)
- **Response Structure**:
  ```json
  {
    "success": true,
    "data": {
      "products": [...],
      "pagination": {
        "total": 128,
        "page": 1,
        "limit": 20,
        "totalPages": 7
      }
    }
  }
  ```

## 3. Product by Category
- **Endpoint**: `GET /api/v1/products/category/:categorySlug`
- **Query Parameters**: `brand`, `minPrice`, `maxPrice`, `sort`, `page`, `limit`

## 4. Product Details
- **Endpoint**: `GET /api/v1/products/:slug`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "product": { ... }
    }
  }
  ```

## 5. Public Recommendations
- **Endpoints**:
  - `GET /api/v1/recommendations/new-arrivals`
  - `GET /api/v1/recommendations/trending`
  - `GET /api/v1/recommendations/top-rated`
  - `GET /api/v1/recommendations/best-deals`
- **Response**: Array of products.

## 6. Wishlist & Cart
- *(Assumed typical structures since specific endpoints are in `wishlistRoutes.js` and `cartRoutes.js` which we haven't peeked into deeply yet, but standard REST applies)*
- Wishlist: `POST /api/v1/wishlist/:productId`, `DELETE /api/v1/wishlist/:productId`, `GET /api/v1/wishlist`
- Cart: `POST /api/v1/cart`, `GET /api/v1/cart`
