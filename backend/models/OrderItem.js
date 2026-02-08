// backend/models/OrderItem.js
const { pool } = require('../config/db');

class OrderItem {
  static async findByOrderId(orderId) {
    const [items] = await pool.execute(`
      SELECT 
        oi.*,
        p.name as product_name,
        p.slug as product_slug,
        p.image_url as product_image
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [orderId]);
    
    return items;
  }

  static async createMultiple(items) {
    if (items.length === 0) return [];
    
    const values = items.map(item => [
      item.orderId,
      item.productId,
      item.quantity,
      item.price
    ]);
    
    const sql = `
      INSERT INTO order_items (order_id, product_id, quantity, price)
      VALUES ?
    `;
    
    const [result] = await pool.query(sql, [values]);
    return result;
  }
}

module.exports = OrderItem;