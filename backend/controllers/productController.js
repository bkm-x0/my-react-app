const Product = require('../models/Product');
const Category = require('../models/Category');
const { pool } = require('../config/db');
const fs = require('fs');
const path = require('path');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12,
      featured,
      rating,
      stock
    } = req.query;

    // Build options for Product.findAll()
    // Ensure limit and offset are valid integers (not NaN)
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 12;
    
    const options = {
      isActive: true,
      limit: limitNum,
      offset: (pageNum - 1) * limitNum
    };

    if (category) {
      // allow passing either category id or slug from the frontend
      if (isNaN(Number(category))) {
        const cat = await Category.findBySlug(category);
        if (cat) options.categoryId = cat.id;
      } else {
        options.categoryId = Number(category);
      }
    }

    if (minPrice) options.minPrice = Number(minPrice);
    if (maxPrice) options.maxPrice = Number(maxPrice);

    if (featured === 'true') {
      options.isFeatured = true;
    }

    if (rating) {
      options.minRating = Number(rating);
    }

    if (stock) {
      options.stockFilter = stock;
    }

    if (search) {
      options.search = String(search).trim();
    }

    // Sort options
    options.sortBy = 'created_at';
    options.sortOrder = 'DESC';
    
    switch (sort) {
      case 'price_asc':
        options.sortBy = 'price';
        options.sortOrder = 'ASC';
        break;
      case 'price_desc':
        options.sortBy = 'price';
        options.sortOrder = 'DESC';
        break;
      case 'rating':
        options.sortBy = 'rating';
        options.sortOrder = 'DESC';
        break;
      case 'newest':
        options.sortBy = 'created_at';
        options.sortOrder = 'DESC';
        break;
    }

    const products = await Product.findAll(options);
    
    // Get total count
    const allProducts = await Product.findAll({ ...options, limit: 999999, offset: 0 });
    const total = allProducts.length;

    res.json({
      products,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.is_active) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // include up-to-date review stats
    const Review = require('../models/Review');
    const stats = await Review.getStatsForProduct(product.id);
    product.reviews_count = Number(stats.count) || 0;
    // Only override the seed/stored rating when real reviews exist
    if (product.reviews_count > 0) {
      product.rating = Number(Number(stats.avgRating).toFixed(2));
    } else {
      product.rating = Number(Number(product.rating || 0).toFixed(2));
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/products/:id/reviews
const getProductReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const offset = (page - 1) * limit;

    const Review = require('../models/Review');
    const reviews = await Review.findByProduct(id, { limit, offset });

    res.json({ reviews, page, limit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/products/:id/reviews
const addProductReview = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const { id } = req.params;
    const { rating, comment } = req.body;

    console.log(`\n[REVIEWS] addProductReview called — productId=${id} userId=${userId} rating=${rating}`);

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Verify product exists to avoid FK errors and provide a clear response
    const existing = await Product.findById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const Review = require('../models/Review');
    const created = await Review.create({ productId: id, userId, rating: Math.round(rating), comment: comment || '' });

    // recompute and persist product rating (best-effort)
    const stats = await Review.getStatsForProduct(id);
    await Product.update(id, { rating: Number(stats.avgRating).toFixed(2) });

    res.status(201).json(created);
  } catch (error) {
    console.error('\n[REVIEWS] addProductReview ERROR:', error.message);
    console.error(error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    console.log('\n📦 [CREATE PRODUCT] Received data:', {
      name: productData.name,
      sku: productData.sku,
      price: productData.price,
      stock: productData.stock,
      category: productData.category,
      hasImage: !!productData.image
    });

    // Validate required fields
    if (!productData.name?.trim()) {
      return res.status(400).json({ message: 'Product name is required' });
    }
    if (!productData.sku?.trim()) {
      return res.status(400).json({ message: 'Product SKU is required' });
    }
    if (productData.price === undefined || productData.price === null || productData.price === '') {
      return res.status(400).json({ message: 'Product price is required' });
    }
    if (productData.stock === undefined || productData.stock === null || productData.stock === '') {
      return res.status(400).json({ message: 'Product stock is required' });
    }

    // Validate price and stock are numbers
    const price = parseFloat(productData.price);
    const stock = parseInt(productData.stock);
    
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }
    if (isNaN(stock) || stock < 0) {
      return res.status(400).json({ message: 'Stock must be a non-negative number' });
    }

    productData.price = price;
    productData.stock = stock;

    // Map category to categoryId if needed
    if (productData.category && !productData.categoryId) {
      const categoryString = productData.category?.trim();
      console.log(`🔍 [CATEGORY] Looking up: "${categoryString}"`);
      
      try {
        // Get all categories
        const allCategories = await Category.findAll();
        console.log(`📋 [CATEGORY] Available categories:`, allCategories.map(c => `${c.id}: ${c.name} (${c.slug})`));
        
        if (allCategories.length === 0) {
          throw new Error('No categories found in database');
        }
        
        // First try finding by name (exact, case-insensitive)
        let category = allCategories.find(c => c.name.toLowerCase() === categoryString.toLowerCase());
        
        // If not found, try matching slug
        if (!category) {
          const slug = categoryString.toLowerCase().replace(/\s+/g, '-');
          category = allCategories.find(c => c.slug === slug);
        }
        
        // If not found, try partial match on name
        if (!category) {
          category = allCategories.find(c => c.name.toLowerCase().includes(categoryString.toLowerCase()));
        }
        
        if (category) {
          console.log(`✅ [CATEGORY] Found: ${category.name} (ID: ${category.id})`);
          productData.categoryId = category.id;
        } else {
          console.log(`⚠️  [CATEGORY] Not found by name, using first available (ID: ${allCategories[0].id})`);
          productData.categoryId = allCategories[0].id;
        }
      } catch (err) {
        console.error('❌ [CATEGORY] Error looking up category:', err.message);
        // Fallback: get first category from database
        try {
          const [categories] = await pool.execute('SELECT id FROM categories LIMIT 1');
          if (categories.length > 0) {
            productData.categoryId = categories[0].id;
            console.log(`📌 [CATEGORY] Using fallback category (ID: ${categories[0].id})`);
          } else {
            throw new Error('No categories exist in database');
          }
        } catch (fallbackErr) {
          console.error('❌ [CATEGORY] Fallback failed:', fallbackErr.message);
          throw new Error('Cannot find any category in database');
        }
      }
      delete productData.category;
    } else if (!productData.categoryId) {
      try {
        const allCategories = await Category.findAll();
        if (allCategories.length > 0) {
          productData.categoryId = allCategories[0].id;
          console.log(`📌 [CATEGORY] Using first available category (ID: ${productData.categoryId})`);
        } else {
          throw new Error('No categories exist in database');
        }
      } catch (err) {
        console.error('❌ [CATEGORY] Cannot assign default category:', err.message);
        throw new Error('No categories available. Please add a category first.');
      }
    }

    // Handle image upload
    if (productData.image && productData.image.startsWith('data:')) {
      try {
        console.log('🖼️  [IMAGE] Processing base64 image...');
        
        // Create uploads directory if it doesn't exist
        const uploadDir = path.join(__dirname, '../public/uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
          console.log(`✅ [IMAGE] Created directory: ${uploadDir}`);
        }

        // Extract base64 data
        const base64Data = productData.image.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');
        const imageSizeKB = imageBuffer.length / 1024;
        
        console.log(`📏 [IMAGE] Size: ${imageSizeKB.toFixed(2)} KB`);
        
        if (imageSizeKB > 5000) {
          console.warn(`⚠️  [IMAGE] Large image: ${imageSizeKB.toFixed(2)} KB`);
        }
        
        // Generate unique filename
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(7);
        const filename = `product_${timestamp}_${randomStr}.png`;
        const filepath = path.join(uploadDir, filename);

        // Save image file
        fs.writeFileSync(filepath, imageBuffer);
        productData.image = `/uploads/${filename}`;
        
        console.log(`✅ [IMAGE] Saved: ${filename}`);
      } catch (imageError) {
        console.error('❌ [IMAGE] Error saving image:', imageError.message);
        console.error('📋 [IMAGE] Stack:', imageError.stack);
        productData.image = null;
      }
    } else {
      productData.image = null;
      console.log('ℹ️  [IMAGE] No image provided');
    }

    console.log('💾 [DATABASE] Inserting product:', {
      name: productData.name,
      sku: productData.sku,
      price: productData.price,
      stock: productData.stock,
      categoryId: productData.categoryId,
      image: productData.image ? 'yes' : 'no'
    });

    const createdProduct = await Product.create(productData);
    
    console.log(`✅ [DATABASE] Product created successfully! ID: ${createdProduct.id}`);
    res.status(201).json(createdProduct);
    
  } catch (error) {
    console.error('\n❌ [ERROR] Product creation failed!');
    console.error('📝 Message:', error.message);
    console.error('📋 Stack:', error.stack);
    
    // Determine specific error type
    let errorMessage = 'Server error creating product';
    if (error.code === 'ER_DUP_ENTRY') {
      errorMessage = 'Product SKU already exists. Use a different SKU.';
    } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      errorMessage = 'Invalid category ID. Category does not exist.';
    } else if (error.sqlMessage) {
      errorMessage = `Database error: ${error.sqlMessage}`;
    }
    
    res.status(500).json({ 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal error' 
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const productData = { ...req.body };
    console.log('\n📝 [UPDATE PRODUCT] Updating product ID:', req.params.id);

    // Map category to categoryId if provided
    if (productData.category && !productData.categoryId) {
      const categoryString = productData.category?.trim();
      console.log(`🔍 [CATEGORY] Looking up: "${categoryString}"`);
      
      try {
        const allCategories = await Category.findAll();
        
        let category = allCategories.find(c => c.name.toLowerCase() === categoryString.toLowerCase());
        
        if (!category) {
          const slug = categoryString.toLowerCase().replace(/\s+/g, '-');
          category = allCategories.find(c => c.slug === slug);
        }
        
        if (!category) {
          category = allCategories.find(c => c.name.toLowerCase().includes(categoryString.toLowerCase()));
        }
        
        if (category) {
          console.log(`✅ [CATEGORY] Found: ${category.name} (ID: ${category.id})`);
          productData.categoryId = category.id;
        } else {
          console.log(`⚠️  [CATEGORY] Not found, keeping existing`);
          delete productData.categoryId;
        }
      } catch (err) {
        console.error('❌ [CATEGORY] Error looking up category:', err.message);
        delete productData.categoryId;
      }
      delete productData.category;
    }

    // Handle image upload
    if (productData.image && productData.image.startsWith('data:')) {
      try {
        console.log('🖼️  [IMAGE] Processing base64 image...');
        
        const uploadDir = path.join(__dirname, '../public/uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const base64Data = productData.image.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');
        
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(7);
        const filename = `product_${timestamp}_${randomStr}.png`;
        const filepath = path.join(uploadDir, filename);

        fs.writeFileSync(filepath, imageBuffer);
        productData.image = `/uploads/${filename}`;
        
        console.log(`✅ [IMAGE] Saved: ${filename}`);
      } catch (imageError) {
        console.error('❌ [IMAGE] Error saving image:', imageError.message);
        delete productData.image;
      }
    }

    const updatedProduct = await Product.update(req.params.id, productData);
    console.log(`✅ [UPDATE] Product updated successfully!`);
    res.json(updatedProduct);
  } catch (error) {
    console.error('❌ [UPDATE ERROR]:', error.message);
    console.error('📋 Stack:', error.stack);
    res.status(500).json({ 
      message: 'Error updating product',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal error'
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Soft delete
    await Product.update(req.params.id, { isActive: false });

    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ 
      isFeatured: true, 
      isActive: true,
      limit: 8 
    });
    
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.findAll({ 
      categoryId: req.params.category,
      isActive: true 
    });
    
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get categories
// @route   GET /api/products/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductsByCategory,
  getCategories,
  getProductReviews,
  addProductReview
};