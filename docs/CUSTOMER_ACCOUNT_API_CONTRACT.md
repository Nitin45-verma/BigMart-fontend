# Customer Account API Contract

## 1. Profile Endpoint
- **Method**: `GET`, `PATCH`
- **URL**: `/api/v1/users/me`
- **Role**: Customer (Auth & Verified Email required)
- **GET Response**:
  ```json
  {
    "success": true,
    "data": { "user": { "name": "...", "email": "...", "phone": "..." } }
  }
  ```
- **PATCH Request Body**:
  ```json
  { "name": "...", "phone": "..." }
  ```

## 2. Addresses Endpoints (Reused from Step 6)
- **URL**: `/api/v1/users/me/addresses`

## 3. My Orders Endpoint
- **Method**: `GET`
- **URL**: `/api/v1/orders`
- **Role**: Customer
- **Response**:
  ```json
  {
    "success": true,
    "data": { "orders": [], "total": 0, "page": 1, "limit": 20 }
  }
  ```

## 4. Order Details Endpoint
- **Method**: `GET`
- **URL**: `/api/v1/orders/:orderId`
- **Response**: Returns the single `order` object.

## 5. Cancel Order
- **Method**: `PATCH`
- **URL**: `/api/v1/orders/:orderId/cancel`
- **Request Body**:
  ```json
  { "reason": "Changed my mind" }
  ```
- **Response**: Success message.

## 6. Return Request
- **Method**: `POST`
- **URL**: `/api/v1/orders/:orderId/returns`
- **Request Body**: Validated by `validateCreateReturnInput` (likely `items: [{ product, quantity, reason }]`).

## 7. Order Tracking / Shipment
- **Method**: `GET`
- **URL**: `/api/v1/orders/:orderId/tracking`

## 8. Notifications
- **Method**: `GET`
- **URL**: `/api/v1/notifications`
- **Method**: `GET`
- **URL**: `/api/v1/notifications/unread-count`
- **Method**: `PATCH`
- **URL**: `/api/v1/notifications/:notificationId/read`

## 9. Product Reviews
- **Method**: `POST`
- **URL**: `/api/v1/products/:productId/reviews`
- **Request Body**: `{ rating, title, comment, images }`
