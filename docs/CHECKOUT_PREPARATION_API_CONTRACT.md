# Checkout Preparation API Contract

## 1. Address APIs

### 1.1 Get All Addresses
- **Endpoint**: `GET /api/v1/users/me/addresses`
- **Authentication**: Required (Customer)
- **Response Structure**: Array of address objects.

### 1.2 Create Address
- **Endpoint**: `POST /api/v1/users/me/addresses`
- **Authentication**: Required (Customer)
- **Request Body**:
  - `fullName` (string, required)
  - `addressLine1` (string, required)
  - `addressLine2` (string, optional)
  - `city` (string, required)
  - `state` (string, required)
  - `postalCode` (string, required, must be 6 digits if country is India)
  - `country` (string, optional, defaults to 'India')
  - `landmark` (string, optional)
  - `phone` (string, optional)
  - `addressType` (string, optional, 'home' | 'work' | 'other', defaults to 'home')
- **Response Structure**: Created address object.

### 1.3 Update Address
- **Endpoint**: `PATCH /api/v1/users/me/addresses/:addressId`
- **Authentication**: Required (Customer, Owner)
- **Request Body**: Same as Create Address, but all fields are optional.

### 1.4 Delete Address
- **Endpoint**: `DELETE /api/v1/users/me/addresses/:addressId`
- **Authentication**: Required (Customer, Owner)

### 1.5 Set Default Address
- **Endpoint**: `PATCH /api/v1/users/me/addresses/:addressId/default`
- **Authentication**: Required (Customer, Owner)
- **Response Structure**: Updates the address to `isDefault: true` and removes default from other addresses.

---

## 2. Shipping API

### 2.1 Get Shipping Quote
- **Endpoint**: `POST /api/v1/shipping/quote`
- **Authentication**: Required (Customer, Verified Email)
- **Request Body**:
  - `addressId` (string, required, valid MongoDB ObjectId)
- **Validation Rules**:
  - Rejects client-supplied `deliveryFee`, `shippingTotal`, `totalDeliveryFee`, `distanceKm`, `billableDistanceKm`, `sellerShippingFee`, `shipping`. The backend is strictly authoritative.
- **Response Structure**:
  - Expected to return shipping cost breakdown. Likely returns `shippingTotal` and potentially seller-wise breakdown if implemented. (Must rely on actual backend response structure).

---

## 3. Coupon API

### 3.1 Validate Coupon
- **Endpoint**: `POST /api/v1/coupons/validate`
- **Authentication**: Required (Customer)
- **Request Body**:
  - `code` (string, required)
- **Validation Rules**:
  - Rejects client-supplied `discountAmount`, `discount`, `finalTotal`, `couponOwner`, `usedCount`, `usageLimit`, `seller`, `createdBy`, `isActive`, `status`. Backend calculates discount based on active cart.
- **Response Structure**:
  - Expected to return coupon details, discount value, and potentially final calculated total. 

---

## 4. General API Contract Rules
1. **Server-Authoritative Fields**: Price, GST, Shipping Fee, and Coupon Discount are strictly managed by the backend. The frontend acts only as a presentation layer.
2. **Authentication**: All endpoints require a valid Bearer token for a user with the `customer` role. Shipping API additionally requires the email to be verified (though potentially mocked for dev environments).
3. **Cart Invalidation**: Shipping quotes and applied coupons become stale and must be re-validated if the cart contents change.
