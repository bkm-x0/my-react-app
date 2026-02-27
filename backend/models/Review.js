// backend/models/Review.js
const { pool } = require('../config/db');

class Review {
  static async create({ productId, userId = null, rating = 5, comment = '' }) {
    const [result] = await pool.execute(`
      INSERT INTO reviews (product_id, user_id, rating, comment)
      VALUES (?, ?, ?, ?)
    `, [productId, userId, rating, comment]);

    const id = result.insertId;
    const [rows] = await pool.execute(`SELECT r.*, u.username as username FROM reviews r LEFT JOIN users u ON r.user_id = u.id WHERE r.id = ?`, [id]);
    return rows[0] || null;
  }

  static async findByProduct(productId, { limit = 20, offset = 0 } = {}) {
    // Ensure limit and offset are valid integers
    const safeLimit = Math.max(1, Math.min(parseInt(limit) || 20, 100));
    const safeOffset = Math.max(0, parseInt(offset) || 0);
    
    const [rows] = await pool.query(`
      SELECT r.id, r.product_id, r.user_id, r.rating, r.comment, r.created_at, u.username
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
      LIMIT ${safeLimit} OFFSET ${safeOffset}
    `, [productId]);

    return rows;
  }

  static async getStatsForProduct(productId) {
    const [rows] = await pool.execute(`
      SELECT COUNT(*) as count, COALESCE(AVG(rating), 0) as avgRating
      FROM reviews
      WHERE product_id = ?
    `, [productId]);

    return rows[0] || { count: 0, avgRating: 0 };
  }
}

module.exports = Review;
