// backend/models/Category.js
const { pool } = require('../config/db');

class Category {
  static async create(categoryData) {
    const [result] = await pool.execute(`
      INSERT INTO categories (name, slug, description, icon, color, is_active)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      categoryData.name,
      categoryData.slug,
      categoryData.description || '',
      categoryData.icon || '',
      categoryData.color || '#6db3c8',
      categoryData.isActive !== undefined ? (categoryData.isActive ? 1 : 0) : 1
    ]);
    
    return await this.findById(result.insertId);
  }

  static async findById(id) {
    const [categories] = await pool.execute(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );
    return categories[0] || null;
  }

  static async findBySlug(slug) {
    const [categories] = await pool.execute(
      'SELECT * FROM categories WHERE slug = ?',
      [slug]
    );
    return categories[0] || null;
  }

  static async findAll(isActive = true) {
    const [categories] = await pool.execute(`
      SELECT * FROM categories 
      WHERE is_active = ?
      ORDER BY name ASC
    `, [isActive ? 1 : 0]);
    
    return categories;
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
    
    if (updateData.description !== undefined) {
      fields.push('description = ?');
      values.push(updateData.description);
    }
    
    if (updateData.icon !== undefined) {
      fields.push('icon = ?');
      values.push(updateData.icon);
    }
    
    if (updateData.color !== undefined) {
      fields.push('color = ?');
      values.push(updateData.color);
    }
    
    if (updateData.isActive !== undefined) {
      fields.push('is_active = ?');
      values.push(updateData.isActive ? 1 : 0);
    }
    
    if (fields.length === 0) return null;
    
    values.push(id);
    const sql = `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`;
    
    await pool.execute(sql, values);
    return await this.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM categories WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Category;