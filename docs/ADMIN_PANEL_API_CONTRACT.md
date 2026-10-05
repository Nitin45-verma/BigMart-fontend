# Admin Panel API Contract

All routes documented here require an authenticated user with `role="admin"`. 
These align with the endpoints exposed under `/api/v1/admin/*`.

## 1. Admin Dashboard (`/api/v1/admin/dashboard`)
- **GET /summary**: Retrieves a high-level summary of total users, sellers, products, orders, gross sales, platform fees, refunds, pending returns, and pending seller applications.
- **GET /revenue-trend**: Time-series revenue chart data.

## 2. User Management (`/api/v1/admin/users`)
- **GET /**: List all users (customers, sellers, admins) with pagination and filtering.
- **GET /:id**: View specific user details.
- **PATCH /:id/block**: Block or unblock a user account.
- **PATCH /:id/role**: Update user role (only if backend supports this mutation directly).

## 3. Seller Management (`/api/v1/admin/sellers`)
- **GET /**: List approved sellers.
- **GET /:id**: View details about an approved seller.
- **PATCH /:id/suspend**: Suspend or reactivate a seller.

## 4. Seller Applications (`/api/v1/admin/seller-applications`)
- **GET /**: List pending seller applications.
- **GET /:id**: View a specific application.
- **PATCH /:id/approve**: Approve the application.
- **PATCH /:id/reject**: Reject the application (requires a `reason`).

## 5. Category Management (`/api/v1/admin/categories`)
- **GET /**: List all categories.
- **POST /**: Create a new category.
- **PATCH /:id**: Update a category.
- **DELETE /:id**: Delete a category (backend enforces referential integrity).

## 6. Product Management (`/api/v1/admin/products`)
- **GET /**: List all products across the platform.
- **GET /:id**: View specific product details.
- **PATCH /:id/moderate**: Approve/reject/suspend a product for marketplace safety.

## 7. Order Management (`/api/v1/admin/orders`)
- **GET /**: List all orders platform-wide.
- **GET /:id**: View order details (includes all seller partitions).

## 8. Returns & Refunds (`/api/v1/admin/returns`, `/api/v1/admin/finance/refunds`)
- **GET /admin/returns**: List return requests across the platform.
- **PATCH /admin/returns/:id/approve**: Approve a return.
- **GET /admin/finance/refunds**: List processed and pending refunds.

## 9. Finance (`/api/v1/admin/finance`)
- **GET /overview**: Top-level finance overview.
- **GET /payouts**: List seller payout requests.
- **PATCH /payouts/:id/process**: Mark a payout as processed/paid.

## 10. Audit Logs (`/api/v1/admin/audit-logs`)
- **GET /**: List immutable audit logs of critical actions with pagination.

## 11. Analytics (`/api/v1/admin/analytics`)
- **GET /overview**: Marketplace performance overview.
- **GET /sales**: Sales trend timeseries.
- **GET /top-products**: Top selling products across all sellers.
- **GET /top-sellers**: Top performing sellers.
