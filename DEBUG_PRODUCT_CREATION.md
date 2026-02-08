# Product Creation Debugging Guide

## Problem
Getting "Error adding product: Server error" when trying to create a product in the admin panel.

## Root Causes (Most Common First)

### 1. **Database Not Initialized**
The categories table might be empty. Products need valid category IDs.

**Solution:**
```powershell
cd backend
node test-db.js
```

This will:
- Test MySQL connection
- Check if categories exist
- Automatically seed the database if needed

### 2. **Backend Not Running**
The frontend can't reach the API at `http://localhost:5000`

**Solution:**
```powershell
cd backend
npm run dev
```
Check console output for: `✅ Server running on port 5000`

### 3. **Token/Authentication Issue**
Admin is not logged in with a valid token

**Solution:**
1. Check browser DevTools > Application > Storage > localStorage
2. Look for `token` key
3. If missing or invalid, log in as admin again:
   - Email: `admin@cyberstore.com`
   - Password: `admin123` (from seed.js)

### 4. **Image Upload Issue**
Large image might exceed buffer limits or file saving fails

**Solution:**
1. Use a smaller image (< 1MB)
2. Check `/public` directory exists in backend root
3. Check Windows file permissions on `/public/uploads`

## Detailed Testing Steps

### Step 1: Verify MySQL Connection
```powershell
cd backend
node test-db.js
```

**Expected Output:**
```
✅ Database connected successfully!
Found 4 categories:
  - 1: Neural Tech (neural-tech)
  - 2: Cybernetic Limbs (cybernetic-limbs)
  - 3: Quantum Hardware (quantum-hardware)
  - 4: Holographic Tech (holographic-tech)
Found 2 users:
  - cyberadmin (admin@cyberstore.com) - admin
  - cyberuser (user@cyberstore.com) - user
✅ All tests passed!
```

If you see connection errors:
1. Verify MySQL is running
2. Check `.env` file in backend directory:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=cyberstore
   ```
3. Make sure database `cyberstore` exists:
   ```sql
   CREATE DATABASE cyberstore;
   ```

### Step 2: Start Backend with Logging
```powershell
cd backend
npm run dev
```

Leave this running and watch for error messages.

### Step 3: Test Product Creation via API
Open a new PowerShell window and test directly:

```powershell
$token = "YOUR_ADMIN_TOKEN_HERE"  # Get from browser localStorage

$productData = @{
    name = "Test Product"
    sku = "TEST-001"
    price = 99.99
    stock = 10
    category = "Neural Tech"
    description = "Test description"
    isFeatured = $false
    features = @()
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/products" `
    -Method POST `
    -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    } `
    -Body $productData -Verbose
```

### Step 4: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try adding a product
4. Look for detailed error message with:
   - `Sending product data:` - Shows what frontend sent
   - Error response with specific details

### Step 5: Review Backend Logs
In the terminal where backend is running, look for:
- `Creating product with data:` - What backend received
- `Product creation error:` - Specific error message
- `Stack:` - Full error stack trace

## Error Response Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 400 | Bad Request - Missing/invalid fields | Check form fields in browser console |
| 401 | Unauthorized - No valid token | Log in as admin |
| 403 | Forbidden - Not admin user | Use admin account, not regular user |
| 500 | Server Error - Backend crashed | Check backend console for error details |

## Common Issues & Solutions

### "Network error - Make sure backend is running"
- Backend crashed or not started
- `npm run dev` in backend directory
- Check port 5000 is not blocked by firewall

### "Bad request: Invalid data" or "Missing required fields"
- Required fields: name, sku, price, stock
- Price must be a number
- Stock must be integer
- Category must match one in database

### "Server error: Check backend logs"
- See the Product Creation Backend Errors section below
- Check backend console for more details

### Image fails to upload
- File size too large (keep under 1MB)
- Check `/public/uploads` directory exists
- Run from backend root, not another directory

## Product Creation Backend Errors

When you see "Server error" on frontend, the backend console should show:
```
Creating product with data: { ... }
Product creation error: [SPECIFIC ERROR]
Stack: [ERROR STACK TRACE]
```

### Common Backend Errors:

**"ENOENT: no such file or directory, open '...uploads'..."**
- `/public/uploads` directory doesn't exist
- Fix: `mkdir public/uploads` from backend root

**"Category not found"**
- Category slug doesn't match database
- The code defaults to categoryId=1, so should still work
- If failing, check categories exist: `node test-db.js`

**"ER_DUP_ENTRY"** (Duplicate SKU error)
- Product with same SKU already exists
- Choose different SKU value

**Connection pool errors**
- MySQL disconnected or max connections reached
- Restart backend: `npm run dev`

## Manual Database Seed

If `node test-db.js` doesn't seed automatically:

```powershell
cd backend
node seed.js
```

## Next Steps If Still Not Working

1. **Share backend console output:**
   - Run `npm run dev`
   - Try adding a product
   - Copy the error messages shown

2. **Check environment variables:**
   - Create/update `.env` in backend directory:
     ```
     NODE_ENV=development
     PORT=5000
     DB_HOST=localhost
     DB_PORT=3306
     DB_USER=root
     DB_PASSWORD=
     DB_NAME=cyberstore
     JWT_SECRET=your_secret_key_here
     ```

3. **Verify MySQL user has permissions:**
   ```sql
   GRANT ALL PRIVILEGES ON cyberstore.* TO 'root'@'localhost';
   FLUSH PRIVILEGES;
   ```

## Quick Checklist

- [ ] MySQL is running
- [ ] `node test-db.js` shows 4 categories
- [ ] Backend is running on port 5000
- [ ] Logged in as admin (admin@cyberstore.com)
- [ ] Token exists in browser localStorage
- [ ] Form has: name, sku, price (number), stock (number)
- [ ] Image is less than 1MB
- [ ] `/public/uploads` directory exists
