# BigMart Product Details API Contract

## 1. Product Information
- **Endpoint**: `GET /api/v1/products/:slug`
- **Response Structure**:
  ```json
  {
    "success": true,
    "data": {
      "product": {
        "_id": "...",
        "name": "...",
        "slug": "...",
        "brand": "...",
        "sku": "...",
        "shortDescription": "...",
        "description": "...",
        "price": 1000,
        "compareAtPrice": 1200,
        "gstRate": 18,
        "stock": 50,
        "status": "active",
        "isPublished": true,
        "images": [
          { "url": "...", "isPrimary": true, "altText": "..." }
        ],
        "ratingAverage": 4.5,
        "ratingCount": 128,
        "ratingBreakdown": { "1": 0, "2": 2, "3": 10, "4": 40, "5": 76 },
        "category": { "_id": "...", "name": "...", "slug": "..." },
        "seller": { "_id": "...", "businessName": "..." }
      }
    }
  }
  ```
  *(Note: `costPrice` and other sensitive metrics are strictly hidden by the backend).*

## 2. Product Reviews
- **Endpoint**: `GET /api/v1/products/:productId/reviews`
- **Query Params**: `page`, `limit`, `rating`, `sort` (`newest`, `oldest`, `rating_high`, `rating_low`)
- **Response Structure**:
  ```json
  {
    "success": true,
    "data": {
      "reviews": [
        {
          "_id": "...",
          "rating": 5,
          "title": "...",
          "comment": "...",
          "isVerifiedPurchase": true,
          "createdAt": "...",
          "customer": { "name": "...", "firstName": "...", "avatar": "..." },
          "sellerReply": "...",
          "sellerReplyAt": "...",
          "images": []
        }
      ],
      "total": 128,
      "page": 1,
      "limit": 10,
      "totalPages": 13
    }
  }
  ```

## 3. Product Recommendations
- **Endpoint (Related)**: `GET /api/v1/recommendations/related/:productId`
- **Response Structure**: Standard product array.

## 4. Wishlist & Cart (Existing)
- **Check Wishlist**: `GET /api/v1/wishlist/check/:productId` (Returns `{ inWishlist: boolean }`)
- **Add to Cart**: `POST /api/v1/cart/items` with `{ productId, quantity }`
