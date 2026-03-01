// backend/models/Supplier.js
const { pool } = require('../config/db');

class Supplier {
  static async create(supplierData) {
    const [result] = await pool.execute(`
      INSERT INTO suppliers (name, slug, description, logo, email, phone, website, address, city, country, rating, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      supplierData.name,
      supplierData.slug,
      supplierData.description || '',
      supplierData.logo || '',
      supplierData.email || '',
      supplierData.phone || '',
      supplierData.website || '',
      supplierData.address || '',
      supplierData.city || '',
      supplierData.country || '',
      supplierData.rating || 0,
      supplierData.isActive !== undefined ? (supplierData.isActive ? 1 : 0) : 1
    ]);

    return await this.findById(result.insertId);
  }

  static async findById(id) {
    const [suppliers] = await pool.execute(
      'SELECT * FROM suppliers WHERE id = ?',
      [id]
    );
    return suppliers[0] || null;
  }

  static async findBySlug(slug) {
    const [suppliers] = await pool.execute(
      'SELECT * FROM suppliers WHERE slug = ?',
      [slug]
    );
    return suppliers[0] || null;
  }

  static async findAll(options = {}) {
    let sql = 'SELECT * FROM suppliers';
    const conditions = [];
    const values = [];

    if (options.isActive !== undefined) {
      conditions.push('is_active = ?');
      values.push(options.isActive ? 1 : 0);
    }

    if (options.search) {
      conditions.push('(name LIKE ? OR description LIKE ? OR city LIKE ? OR country LIKE ?)');
      const searchTerm = `%${options.search}%`;
      values.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (options.country) {
      conditions.push('country = ?');
      values.push(options.country);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    // Sorting
    const sortOptions = {
      'name_asc': 'name ASC',
      'name_desc': 'name DESC',
      'rating': 'rating DESC',
      'newest': 'created_at DESC',
    };
    const sortBy = sortOptions[options.sort] || 'name ASC';
    sql += ` ORDER BY ${sortBy}`;

    // Pagination
    const page = parseInt(options.page) || 1;
    const limit = parseInt(options.limit) || 20;
    const offset = (page - 1) * limit;
    sql += ` LIMIT ${limit} OFFSET ${offset}`;

    const [suppliers] = await pool.execute(sql, values);

    // Get total count
    let countSql = 'SELECT COUNT(*) as total FROM suppliers';
    if (conditions.length > 0) {
      countSql += ' WHERE ' + conditions.join(' AND ');
    }
    const [countResult] = await pool.execute(countSql, values);
    const total = countResult[0].total;

    return {
      suppliers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async update(id, updateData) {
    const fields = [];
    const values = [];

    const allowedFields = {
      name: 'name',
      slug: 'slug',
      description: 'description',
      logo: 'logo',
      email: 'email',
      phone: 'phone',
      website: 'website',
      address: 'address',
      city: 'city',
      country: 'country',
      rating: 'rating',
    };

    for (const [key, column] of Object.entries(allowedFields)) {
      if (updateData[key] !== undefined) {
        fields.push(`${column} = ?`);
        values.push(updateData[key]);
      }
    }

    if (updateData.isActive !== undefined) {
      fields.push('is_active = ?');
      values.push(updateData.isActive ? 1 : 0);
    }

    if (fields.length === 0) return null;

    values.push(id);
    const sql = `UPDATE suppliers SET ${fields.join(', ')} WHERE id = ?`;

    await pool.execute(sql, values);
    return await this.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM suppliers WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async getProductCount(supplierId) {
    const [result] = await pool.execute(
      'SELECT COUNT(*) as count FROM products WHERE supplier_id = ?',
      [supplierId]
    );
    return result[0].count;
  }

  static async getProducts(supplierId, options = {}) {
    const page = parseInt(options.page) || 1;
    const limit = parseInt(options.limit) || 12;
    const offset = (page - 1) * limit;

    const [products] = await pool.execute(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.supplier_id = ? AND p.is_active = 1 
       ORDER BY p.created_at DESC 
       LIMIT ${limit} OFFSET ${offset}`,
      [supplierId]
    );

    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM products WHERE supplier_id = ? AND is_active = 1',
      [supplierId]
    );

    return {
      products,
      pagination: {
        page,
        limit,
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    };
  }
}

module.exports = Supplier;
