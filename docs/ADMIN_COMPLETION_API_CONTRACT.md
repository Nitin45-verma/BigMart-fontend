# Admin Completion API Contract

All routes documented here require an authenticated user with `role="admin"`. 
These align with the endpoints exposed under `/api/v1/admin/*`.

## 1. Category Management (`/api/v1/admin/categories`)
- **GET /**: List all categories.
- **POST /**: Create a new category.
- **GET /:categoryId**: Get category details.
- **PATCH /:categoryId**: Update a category.
- **DELETE /:categoryId**: Delete a category (backend enforces referential integrity).

## 2. Admin Seller Management (`/api/v1/admin/sellers`)
- **GET /**: List sellers.
- **GET /:sellerId**: Get seller details.
- **PATCH /:sellerId/block**: Block seller.
- **PATCH /:sellerId/unblock**: Unblock seller.
- **PATCH /:sellerId/suspend**: Suspend seller.
- **PATCH /:sellerId/reactivate**: Reactivate seller.

## 3. Order Details & Status (`/api/v1/admin/orders`)
- **GET /**: List all orders.
- **GET /:orderId**: Get full order details.
- **PATCH /:orderId/status**: Update global order status.

## 4. Admin Returns (`/api/v1/admin/returns`)
- **GET /**: List return requests.
- **GET /:returnId**: Get return details.
- **PATCH /:returnId/approve**: Approve return.
- **PATCH /:returnId/reject**: Reject return (requires reason).
- **PATCH /:returnId/refund**: Process refund.

## 5. Audit Logs (`/api/v1/admin/audit-logs`)
- **GET /**: List immutable audit logs of critical actions.

## 6. Admin Analytics (`/api/v1/admin/analytics`)
- **GET /overview**: Marketplace performance overview.
- **GET /sales-trend**: Sales trend timeseries.
- **GET /sales**: Sales analytics.
- **GET /orders**: Orders analytics.
- **GET /sellers**: Sellers analytics.
- **GET /products**: Products analytics.
- **GET /categories**: Categories analytics.
- **GET /customers**: Customers analytics.
- **GET /top-products**: Top selling products.
- **GET /inventory**: Inventory analytics.
- **GET /returns**: Returns analytics.
- **GET /cancellations**: Cancellations analytics.
- **GET /payouts**: Payouts analytics.
- **GET /platform-fees**: Platform fees analytics.
- **GET /support**: Support analytics.
