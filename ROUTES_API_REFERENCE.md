# Updated Routes & API Reference

## Frontend Routes

### Public Routes
- `/` - Home page
- `/products` - Product listing
- `/products/:id` - Product detail page
- `/cart` - Shopping cart
- **`/checkout`** - ✨ NEW: Multi-step checkout form
- **`/order-confirmation/:orderId`** - ✨ NEW: Order confirmation & invoice options
- `/track-order` - Order tracking (enhanced)
- `/new-arrivals` - New products page
- `/trending` - Trending products page
- `/sale` - Sale products page
- `/pre-order` - Pre-order products page
- `/support` - Support page
- `/login` - Login page
- `/register` - Registration page

### Protected Routes (Authenticated Users)
- `/profile` - User profile page
- `/checkout` - Checkout (requires login)
- `/order-confirmation/:orderId` - Order confirmation (requires login)

### Admin Routes (Admin Only)
- `/admin/login` - Admin login page
- `/admin/dashboard` - Admin dashboard with:
  - **Overview** - Key metrics and statistics
  - **Products** - Product management
  - **Orders** - ✨ NEW: Order status management with Bone Command feature
  - **Users** - User management
  - **Analytics** - ✨ NEW: Revenue and order analytics
  - **Inventory** - ✨ NEW: Stock level management
  - **Settings** - ✨ NEW: System configuration
- `/admin/products/new` - Add new product
- `/admin/products/edit/:id` - Edit product

## Backend API Endpoints

### Authentication APIs
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Product APIs
- `GET /api/products` - Get all products (with pagination, filtering, sorting)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)
- `GET /api/products/categories` - Get all categories
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id/reviews` - Get product reviews
- `POST /api/products/:id/reviews` - Add product review (protected)

### Order APIs - UPDATED
- `POST /api/orders` - Create order (protected)
- `GET /api/orders` - Get all orders (admin only)
- `GET /api/orders/:id` - Get order by ID (protected)
- `GET /api/orders/myorders` - Get user's orders (protected)
- `PUT /api/orders/:id` - Update order (admin only)
- `DELETE /api/orders/:id` - Delete order (admin only)
- `GET /api/orders/stats/overview` - Get order statistics (admin only)

### Order APIs - NEW (Facture/Invoice Generation & Bone Command)
- **`GET /api/orders/:id/invoice`** - ✨ Generate PDF invoice (protected)
  - Returns: PDF file
  - Authentication: Bearer token required
- **`POST /api/orders/:id/send-invoice`** - ✨ Send invoice via email (protected)
  - Returns: `{ message: "Invoice sent successfully" }`
  - Authentication: Bearer token required
- **`PUT /api/orders/:id/status`** - ✨ Update order status (admin only, Bone Command)
  - Request body: `{ status: "pending|processing|shipped|delivered|cancelled" }`
  - Returns: `{ message: "Order status updated...", order: {...} }`
  - Authentication: Bearer token + Admin role required

### User APIs
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### Stats APIs
- `GET /api/stats/dashboard` - Get dashboard statistics (admin only)
- `GET /api/orders/stats/overview` - Get order stats (admin only)

## Key Implementation Details

### Invoice Generation Flow
1. User completes checkout and creates order
2. User can download PDF invoice from order confirmation page
3. Admin can view order in Orders Management
4. Customer can request invoice to be sent via email
5. Backend generates PDF using pdfkit and sends via nodemailer

### Order Status Management (Bone Command)
1. Admin navigates to Admin Dashboard → Orders
2. Admin searches or filters orders
3. Admin clicks edit icon on order
4. Admin selects new status from dropdown
5. Admin clicks SAVE to update
6. Status updates in database and UI updates immediately
7. Valid statuses: pending → processing → shipped → delivered (or cancelled)

### Shopping Flow
1. Customer adds products to cart
2. Customer clicks "PROCEED TO CHECKOUT" on cart page
3. Redirects to `/checkout` with multi-step form
4. Step 1: Enter shipping address and contact info
5. Step 2: Select payment method and enter payment details
6. Step 3: Review order and confirm
7. Order is created via POST `/api/orders`
8. Redirects to `/order-confirmation/:orderId`
9. Customer can download invoice or request it via email
10. Customer can track order via `/track-order`

### Order Tracking Flow
1. Customer navigates to `/track-order`
2. Option 1: Search by order number
3. Option 2: Login and view order history
4. Click on order to view details
5. See visual timeline of order status
6. View shipping address and order items
7. See estimated delivery timeframe

## Testing Checklist

### Frontend Testing
- [ ] Cart → Checkout button navigates to `/checkout`
- [ ] Checkout form validates all fields
- [ ] Order creation sends to backend
- [ ] Successful order redirects to confirmation page
- [ ] Invoice download button works
- [ ] Email invoice button triggers email
- [ ] Track order search works
- [ ] Admin can view all orders
- [ ] Admin can update order status
- [ ] Analytics dashboard displays data
- [ ] Inventory section shows stock levels

### Backend Testing
- [ ] `POST /api/orders` creates order and reduces stock
- [ ] `GET /api/orders/:id/invoice` generates PDF  
- [ ] `POST /api/orders/:id/send-invoice` sends email
- [ ] `PUT /api/orders/:id/status` updates status
- [ ] Status update validation works
- [ ] Protected routes require authentication
- [ ] Admin routes require admin role
- [ ] Error handling returns proper status codes

## Dependencies Added

### Backend
```json
{
  "pdfkit": "^0.13.0",
  "nodemailer": "^6.9.7"
}
```

### Install Command
```bash
cd backend
npm install pdfkit nodemailer
```

## Environment Configuration

### For Email/Invoice Functionality
Add to `.env` file in backend directory:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

Note: For Gmail, use an App Password, not your regular password.

---

**Last Updated**: February 15, 2026
**API Version**: 1.0
