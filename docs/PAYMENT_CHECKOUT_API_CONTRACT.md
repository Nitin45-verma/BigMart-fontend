# Payment Checkout API Contract

## 1. Create Order Endpoint
- **Method**: `POST`
- **URL**: `/api/v1/orders`
- **Authentication**: Required (Customer role, verified email)
- **Request Body**:
  ```json
  {
    "addressId": "65b9... (valid MongoDB ObjectId)",
    "couponCode": "BIGMART10 (optional, string)"
  }
  ```
- **Response Structure** (Server-Authoritative Values):
  ```json
  {
    "success": true,
    "message": "Order created successfully",
    "data": {
      "orderId": "65ba...",
      "orderNumber": "BM-20261005-XXXX",
      "razorpayOrderId": "order_XXXX",
      "amount": 1000.50,
      "amountPaise": 100050,
      "currency": "INR",
      "keyId": "rzp_test_mock_key",
      "order": { /* full order object */ }
    }
  }
  ```
- **Rules**:
  - The frontend MUST NOT send financial totals or pricing overrides.
  - The backend recalculates everything (Subtotal, GST, Delivery Fee, Coupon Discount) strictly from the DB before making the Razorpay order.

## 2. Verify Payment Endpoint
- **Method**: `POST`
- **URL**: `/api/v1/payments/razorpay/verify`
- **Authentication**: Required (Customer role, verified email)
- **Request Body**:
  ```json
  {
    "razorpay_order_id": "order_XXXX",
    "razorpay_payment_id": "pay_XXXX",
    "razorpay_signature": "signature_XXXX"
  }
  ```
- **Response Structure**:
  ```json
  {
    "success": true,
    "data": {
      "message": "Payment verified and order placed successfully",
      "order": { /* updated order object */ }
    }
  }
  ```
- **Rules**:
  - The Razorpay SDK generates the three payload identifiers upon successful UI completion.
  - The backend strictly compares `razorpay_signature` using the hidden `RAZORPAY_KEY_SECRET`.
  - The frontend is NEVER the authority on payment success. A successful validation resolves the payment.

## 3. Order Details Endpoint
- **Method**: `GET`
- **URL**: `/api/v1/orders/:orderId`
- **Authentication**: Required (Customer, Owner of the Order)
- **Response Structure**: Returns `order` object.

## 4. Idempotency & Concurrency
- Calling verify on an already paid order gracefully returns `Payment already verified`.
- If two verify requests happen, backend idempotency blocks duplicated actions.
- Cart is NOT cleared by frontend upon order creation, but strictly cleared by backend in `verifyPayment()`.

## 5. Security & Ownership
- The `RAZORPAY_KEY_SECRET` remains strictly out of the frontend environment variables and application logic.
- Only the `keyId` returned by `/api/v1/orders` is passed to the Razorpay SDK.
- Users can only fetch orders where `order.user.toString() === userId`.
