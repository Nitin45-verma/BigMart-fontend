# Seller Panel API Contract

All requests require authentication and `seller` role (`<RoleRoute allowedRoles={['seller']}>`). 

## 1. Seller Dashboard (`/api/v1/seller/dashboard`)
- **GET /summary**: Returns overall dashboard metrics (orders, sales, pending, etc.).
- **GET /orders**: Returns seller-specific order partitions.
- **GET /orders/:orderId**: Returns details of a specific seller order.
- **GET /products**: Returns summary of seller products.
- **GET /sales**: Returns sales summary.
- **GET /profile**: Returns the seller's business profile.

## 2. Seller Products (`/api/v1/seller/products`)
- **GET /**: List all products for the seller.
- **GET /:productId**: Get specific product details.
- **POST /**: Create a new product.
- **PATCH /:productId**: Update product details.
- **DELETE /:productId**: Archive/Delete product.
- **POST /:productId/images**: Upload new product image (ImageKit integration).
- **PATCH /:productId/images/reorder**: Reorder product images.
- **DELETE /:productId/images/:fileId**: Delete an image.

## 3. Seller Inventory (`/api/v1/seller/inventory`)
- **GET /**: Get inventory levels for seller products.
- **GET /:productId/movements**: Get inventory history for a product.
- **POST /:productId/adjust**: Adjust product stock manually.

## 4. Seller Fulfillments (`/api/v1/seller/fulfillments`)
- **GET /**: Get list of fulfillments/shipments.
- **GET /:fulfillmentId**: Get specific fulfillment details.
- **PATCH /:fulfillmentId/confirm**: Confirm order processing.
- **PATCH /:fulfillmentId/pack**: Mark fulfillment as packed.
- **PATCH /:fulfillmentId/ship**: Mark fulfillment as shipped and provide tracking information.

## 5. Seller Wallet & Earnings (`/api/v1/seller/wallet`)
- **GET /**: Get wallet balance and overview (available, pending, reserved).
- **GET /transactions**: Get ledger history.
- **GET /payouts**: Get payout history.
- **POST /payouts**: Request a new payout.

## 6. Seller Analytics (`/api/v1/seller/analytics`)
- **GET /overview**: High level analytics overview.
- **GET /sales-trend**: Timeseries chart data for sales.
- **GET /products**: Product performance analytics.

## 7. Seller Application (`/api/v1/seller/application`)
- **GET /**: Get the seller's onboarding application details/status.
