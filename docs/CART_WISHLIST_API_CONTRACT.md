# BigMart Cart & Wishlist API Contract

## 1. Cart API

- **Endpoint Root**: `/api/v1/cart`
- **Authentication**: Required (`customer` role, verified email)

### Get Cart
- **GET** `/`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "cart": {
        "_id": "...",
        "user": "...",
        "items": [
          {
            "product": {
              "_id": "...",
              "name": "...",
              "price": 1000,
              "compareAtPrice": 1200,
              "availableStock": 10
            },
            "quantity": 2,
            "itemTotal": 2000,
            "isAvailable": true
          }
        ],
        "cartTotal": 2000,
        "itemCount": 2,
        "updatedAt": "..."
      }
    }
  }
  ```

### Add to Cart
- **POST** `/items`
- **Body**: `{ "productId": "...", "quantity": 1 }`
- **Response**: Standard cart response.

### Update Quantity
- **PATCH** `/items/:productId`
- **Body**: `{ "quantity": 2 }`
- **Response**: Standard cart response.

### Remove from Cart
- **DELETE** `/items/:productId`
- **Response**: Standard cart response.

### Clear Cart
- **DELETE** `/`
- **Response**: Standard cart response.

---

## 2. Wishlist API

- **Endpoint Root**: `/api/v1/wishlist`
- **Authentication**: Required (`customer` role, verified email)

### Get Wishlist
- **GET** `/`
- **Query Params**: `page=1&limit=20`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "items": [
        {
          "product": {
            "_id": "...",
            "name": "...",
            "price": 1000,
            "availableStock": 10
          },
          "availability": "available",
          "addedAt": "..."
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 20,
        "total": 1,
        "totalPages": 1
      }
    }
  }
  ```

### Add to Wishlist
- **POST** `/items`
- **Body**: `{ "productId": "..." }`
- **Response**: Standard wishlist response.

### Remove from Wishlist
- **DELETE** `/items/:productId`
- **Response**: Standard wishlist response.

### Clear Wishlist
- **DELETE** `/`
- **Response**: `{ "success": true, "data": { "count": 0 } }`

### Wishlist Count
- **GET** `/count`
- **Response**: `{ "success": true, "data": { "count": 5 } }`

### Move to Cart
- **POST** `/items/:productId/move-to-cart`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "wishlist": { /* updated wishlist */ },
      "cart": { /* updated cart */ }
    }
  }
  ```
