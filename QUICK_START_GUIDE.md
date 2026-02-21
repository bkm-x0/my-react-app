# Quick Start Guide - New Features

## 🎯 For Customers

### Making a Purchase - Step by Step

#### Step 1: Browse & Add to Cart
```
1. Visit home page
2. Click on product to view details
3. Click "ADD TO CART" button
4. Continue shopping or go to cart
```

#### Step 2: Go to Checkout
```
1. Click shopping cart icon in navbar → "YOUR CART" page
2. Scroll to order summary section
3. Click "PROCEED TO CHECKOUT" button
```

#### Step 3: Fill In Shipping Information
```
Checkout Page - Step 1/3: SHIPPING

Required fields:
- First Name
- Last Name
- Email
- Phone Number
- Street Address
- City
- ZIP Code
- Country (optional)

Click "CONTINUE TO PAYMENT" when done
```

#### Step 4: Enter Payment Details
```
Checkout Page - Step 2/3: PAYMENT

1. Select Payment Method:
   - Credit Card OR
   - Cryptocurrency

2. If Credit Card selected, enter:
   - Cardholder Name
   - Card Number
   - Expiry Date (MM/YY)
   - CVV

Click "REVIEW ORDER" when done
```

#### Step 5: Review & Confirm Order
```
Checkout Page - Step 3/3: CONFIRM

1. Review shipping address
2. Review payment method
3. Confirm security notice
4. Click "PLACE ORDER"

Wait for order to be processed...
```

#### Step 6: Order Confirmation
```
Order Confirmation Page

You will see:
✓ Order confirmation message
✓ Order ID (#ORD-12345)
✓ Order items and total
✓ Shipping address
✓ Order timeline

Actions available:
- DOWNLOAD INVOICE (PDF)
- EMAIL INVOICE (to your email)
- TRACK YOUR ORDER
- CONTINUE SHOPPING
```

### Tracking Your Order

#### Method 1: Quick Search
```
1. Go to "TRACK ORDER" page
2. Enter your Order ID (e.g., "ORD-123" or just "123")
3. Click "SEARCH" button
4. View order status and shipment timeline
```

#### Method 2: View Your Orders (if logged in)
```
1. Go to "TRACK ORDER" page
2. Click "LOAD MY ORDERS" button
3. Select order from your history
4. View detailed status and tracking info
```

#### Understanding Order Status
```
❏ PENDING      → Order received, confirming details
↓
◐ PROCESSING   → Order being prepared for shipment
↓
Ⓜ SHIPPED      → On the way to you (3-5 business days)
↓
✓ DELIVERED    → Order arrived! 🎉

Alternative: ✗ CANCELLED → Order was cancelled
```

### Getting Your Invoice

#### Option 1: Download as PDF
```
1. On Order Confirmation page
2. Click "DOWNLOAD INVOICE" button
3. File "Invoice-[OrderID].pdf" will download
4. Print or save for your records
```

#### Option 2: Send to Email
```
1. On Order Confirmation page
2. Click "EMAIL INVOICE" button
3. Invoice sent to your registered email address
4. Check inbox/spam folder for email with attachment
```

---

## 👨‍💼 For Admin Users

### Access Admin Dashboard
```
1. Navigate to /admin/login
2. Enter credentials:
   Email: admin@cyberstore.com
   Password: admin123
3. Click LOGIN
4. Redirected to Admin Dashboard
```

### Dashboard Overview
```
The sidebar shows 7 main sections:

1. DASHBOARD    → Key metrics & stats overview
2. PRODUCTS    → Manage product inventory
3. ORDERS      → View & manage customer orders
4. USERS       → Manage user accounts
5. ANALYTICS   → Revenue & sales analytics
6. INVENTORY   → Stock level monitoring
7. SETTINGS    → System configuration
```

### Managing Orders (Bone Command Feature)

#### Viewing All Orders
```
1. Click "ORDERS" tab in sidebar
2. See all customer orders in table format
3. Columns: Order ID | Customer | Total | Status | Date | Actions
```

#### Searching & Filtering Orders
```
SEARCH:
- Enter by Order ID (e.g., "123")
- Or by Customer Name (e.g., "John")
- Results update in real-time

FILTER BY STATUS:
- Dropdown menu at top
- Options: All | Pending | Processing | Shipped | Delivered | Cancelled
```

#### Updating Order Status (Bone Command)
```
To change order status:

1. Find order in list
2. Click the EDIT icon (pencil) in Actions column
3. Status field becomes editable dropdown
4. Select new status:
   - PENDING
   - PROCESSING
   - SHIPPED
   - DELIVERED
   - CANCELLED
5. Click SAVE button
6. Status updates immediately
7. Customer sees updated status on tracking page

Status Color Legend:
🟡 Pending (yellow)
🔵 Processing (blue)
🟣 Shipped (purple)
🟢 Delivered (green)
🔴 Cancelled (red)
```

#### Order Details
```
Each order shows:
- Order ID (unique identifier)
- Customer Name (who ordered)
- Total Amount (what they paid)
- Current Status (where it is)
- Order Date (when ordered)
```

### Viewing Analytics

#### Analytics Dashboard
```
1. Click "ANALYTICS" tab
2. Select date range:
   - LAST 24 HOURS
   - LAST 7 DAYS (default)
   - LAST 30 DAYS

Key metrics displayed:
📊 REVENUE        → Total sales ($)
📦 ORDERS         → Total orders count
💰 AVG ORDER VAL  → Average purchase amount
🛍️ PRODUCTS       → Total products available
👥 CUSTOMERS      → Total registered users

Each metric shows:
- Current value
- Change percentage (↑ increase / → no change)
```

#### Daily Performance Chart
```
Visual representation of:
- Orders per day (blue bar)
- Revenue per day (green bar)

Days shown: Monday through Sunday
Shows trend of sales activity
```

### Managing Inventory

#### Inventory Overview
```
Click "INVENTORY" tab

Top cards show:
📦 TOTAL PRODUCTS    → All products in catalog
⚠️  LOW STOCK        → Items with <10 units
❌ OUT OF STOCK      → Items with 0 units
```

#### Stock Level Display
```
Each product shows:
- Product Name
- SKU (product code)
- Stock Level (number of units)
- Visual progress bar

Color coding:
🟢 Green   → Good stock (>10 units)
🟡 Yellow  → Low stock (<10 units)
🔴 Red     → Out of stock (0 units)
```

#### Stock Management Actions
```
Available actions:
1. Filter by category
2. Sort by stock level (low to high)
3. Reorder low stock items
4. View product details
5. Edit product info
```

### System Settings

#### Accessing Settings
```
1. Click "SETTINGS" tab
2. Three configuration sections visible
```

#### Store Information
```
Configure:
- Store Name (displayed on site)
- Store Description (marketing text)
- Logo & Branding (future enhancement)
```

#### Email Settings
```
Configure email capabilities:
- SMTP Server (e.g., smtp.gmail.com)
- Email Address (sender address)
- Authentication details (when needed)

Used for:
- Invoice delivery
- Order notifications
- Customer communications
```

#### Payment Methods
```
Enable/Disable payment options:

☑️ Credit Card      → Visa, Mastercard, etc.
☑️ Cryptocurrency   → Bitcoin, Ethereum, etc.
☐ PayPal           → (available but disabled)

Check/uncheck to enable/disable
Click SAVE SETTINGS to apply changes
```

---

## 📱 Mobile Responsiveness

All new pages are fully responsive:
- Checkout adapts to mobile screens
- Order tracking is mobile-friendly
- Admin dashboard is touch-optimized
- Tables collapse on smaller screens

## 🔒 Security Features

1. **Authentication**: JWT tokens protect all endpoints
2. **Authorization**: Admins required for management features
3. **Data Protection**: Order data encrypted in transit
4. **PDF Generation**: Done server-side, never in browser
5. **Email Security**: SMTP with authentication

## 🆘 Troubleshooting

### Checkout Issues
```
❌ "Please fill in all required fields"
   → Make sure all fields have valid input

❌ "Order creation failed"
   → Check backend is running: npm run dev
   → Verify internet connection
   → Try again in a few seconds

❌ "Redirected to login"
   → Must be logged in to checkout
   → Log in or register first
```

### Invoice Issues
```
❌ "Error generating invoice"
   → Order may not exist
   → Try refreshing page
   → Check order ID is correct

❌ "Failed to send email"
   → Email configuration may be incomplete
   → Check SMTP settings in backend
   → Verify email credentials in .env file
```

### Order Tracking Issues
```
❌ "Order not found"
   → Check order number is correct (numbers only)
   → Make sure you have permission to view order
   → Order may still be processing

❌ "Can't load my orders"
   → Must be logged in
   → Check if you have any orders
```

### Admin Dashboard Issues
```
❌ "Access Denied"
   → Admin account required
   → Check if user has admin role
   → Log out and log in again

❌ "Orders not loading"
   → Backend may be down
   → Check database connection
   → Restart backend server
```

## 📊 Database Records

### Test Orders
```
To test order tracking, ensure database has test orders:

SELECT * FROM orders;

Fields to verify:
- id (order number)
- user_id (customer)
- total_amount (total paid)
- status (pending/processing/shipped/delivered)
- shipping_address (delivery location)
- created_at (order date)
```

### Sample Order Status Flow
```
Order #123 Timeline:
2024-02-15 10:00 → Created (PENDING)
2024-02-15 14:00 → Updated to PROCESSING
2024-02-16 08:00 → Updated to SHIPPED
2024-02-18 15:00 → Updated to DELIVERED ✓
```

---

## 🚀 Production Deployment Notes

### Before Going Live

1. **Update Email Configuration**
   ```env
   EMAIL_USER=your-business-email@company.com
   EMAIL_PASS=your-app-specific-password
   ```

2. **Enable Proper Database**
   - Migrate from test database
   - Backup all existing data
   - Verify connection string

3. **Update URLs**
   - Change localhost:5000 to production API URL
   - Update frontend config
   - Test all API calls

4. **SSL/HTTPS**
   - Enable SSL on backend
   - Use HTTPS for all pages
   - Update payment gateway SSL settings

5. **Environment Variables**
   - Set NODE_ENV=production
   - Secure all secrets
   - Use environment-specific configs

---

**Last Updated**: February 15, 2026
**Version**: 1.0
