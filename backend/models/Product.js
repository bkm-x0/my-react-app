// backend/models/Product.js
const { pool } = require('../config/db');

class Product {
  static async create(productData) {
    const features = productData.features ? 
      JSON.stringify(productData.features) : '[]';
    
    // Ensure description is provided
    const description = productData.description || '';
    
    const [result] = await pool.execute(`
      INSERT INTO products (name, slug, description, price, category_id, stock, sku, features, image, rating, is_featured, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      productData.name,
      productData.slug || productData.name.toLowerCase().replace(/\s+/g, '-'),
      description,
      productData.price,
      productData.categoryId || 1,
      productData.stock || 0,
      productData.sku,
      features,
      productData.image || null,
      productData.rating || 0,
      productData.isFeatured ? 1 : 0,
      productData.isActive !== undefined ? (productData.isActive ? 1 : 0) : 1
    ]);
    
    return await this.findById(result.insertId);
  }

  static async findById(id) {
    const [products] = await pool.execute(`
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [id]);
    
    return products[0] || null;
  }

  static async findBySlug(slug) {
    const [products] = await pool.execute(`
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ?
    `, [slug]);
    
    const product = products[0] || null;
    if (product) {
      if (product.features) {
        try {
          product.features = JSON.parse(product.features);
        } catch (err) {
          product.features = Array.isArray(product.features) ? product.features : [product.features];
        }
      } else {
        product.features = [];
      }
    }

    return product;
  }

  static async findAll(options = {}) {
    const { 
      categoryId, 
      isFeatured, 
      isActive = true,
      minPrice, 
      maxPrice,
      limit = 100,
      offset = 0,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = options;
    
    let sql = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = ?
    `;
    
    const params = [isActive ? 1 : 0];
    
    if (categoryId) {
      sql += ' AND p.category_id = ?';
      params.push(categoryId);
    }
    
    if (isFeatured !== undefined) {
      sql += ' AND p.is_featured = ?';
      params.push(isFeatured ? 1 : 0);
    }
    
    if (minPrice) {
      sql += ' AND p.price >= ?';
      params.push(minPrice);
    }
    
    if (maxPrice) {
      sql += ' AND p.price <= ?';
      params.push(maxPrice);
    }
    
    // Validate sort column
    const validSortColumns = ['name', 'price', 'rating', 'created_at', 'updated_at'];
    const safeSortBy = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    sql += ` ORDER BY p.${safeSortBy} ${safeSortOrder} LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    
    // allow simple text search
    if (options.search) {
      sql = sql.replace('WHERE p.is_active = ?', 'WHERE p.is_active = ? AND (p.name LIKE ? OR p.description LIKE ?)');
      const term = `%${options.search}%`;
      // insert the two search params after the is_active param
      params.splice(1, 0, term, term);
    }

    const [products] = await pool.execute(sql, params);

    // normalize `features` (stored as JSON string in DB) to an array
    const normalized = products.map((p) => {
      if (p.features) {
        try {
          p.features = JSON.parse(p.features);
        } catch (err) {
          p.features = Array.isArray(p.features) ? p.features : [p.features];
        }
      } else {
        p.features = [];
      }
      return p;
    });

    return normalized;
  }

  static async update(id, updateData) {
    const fields = [];
    const values = [];
    
    if (updateData.name !== undefined) {
      fields.push('name = ?');
      values.push(updateData.name);
    }
    
    if (updateData.slug !== undefined) {
      fields.push('slug = ?');
      values.push(updateData.slug);
    }

    if (updateData.sku !== undefined) {
      fields.push('sku = ?');
      values.push(updateData.sku);
    }
    
    if (updateData.description !== undefined) {
      fields.push('description = ?');
      values.push(updateData.description);
    }
    
    if (updateData.price !== undefined) {
      fields.push('price = ?');
      values.push(updateData.price);
    }
    
    if (updateData.categoryId !== undefined) {
      fields.push('category_id = ?');
      values.push(updateData.categoryId);
    }
    
    if (updateData.stock !== undefined) {
      fields.push('stock = ?');
      values.push(updateData.stock);
    }

    if (updateData.image !== undefined) {
      fields.push('image = ?');
      values.push(updateData.image);
    }
    
    if (updateData.features !== undefined) {
      fields.push('features = ?');
      values.push(JSON.stringify(updateData.features));
    }
    
    if (updateData.rating !== undefined) {
      fields.push('rating = ?');
      values.push(updateData.rating);
    }
    
    if (updateData.isFeatured !== undefined) {
      fields.push('is_featured = ?');
      values.push(updateData.isFeatured ? 1 : 0);
    }
    
    if (updateData.isActive !== undefined) {
      fields.push('is_active = ?');
      values.push(updateData.isActive ? 1 : 0);
    }
    
    if (fields.length === 0) return null;
    
    values.push(id);
    const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
    
    await pool.execute(sql, values);
    return await this.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async search(query, limit = 50) {
    const [products] = await pool.execute(`
      SELECT 
        p.*,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1
      AND (
        p.name LIKE ? OR 
        p.description LIKE ? OR 
        p.sku LIKE ?
      )
      LIMIT ?
    `, [`%${query}%`, `%${query}%`, `%${query}%`, limit]);
    
    return products;
  }

  static async decreaseStock(productId, quantity) {
    const [result] = await pool.execute(`
      UPDATE products 
      SET stock = stock - ? 
      WHERE id = ? AND stock >= ?
    `, [quantity, productId, quantity]);
    
    return result.affectedRows > 0;
  }
}

module.exports = Product;