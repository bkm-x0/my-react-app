// backend/models/Order.js
const { pool } = require('../config/db');

class Order {
  static async create(orderData) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Create order
      const [orderResult] = await connection.execute(`
        INSERT INTO orders (user_id, total_amount, status, shipping_address, payment_method)
        VALUES (?, ?, ?, ?, ?)
      `, [
        orderData.userId,
        orderData.totalAmount,
        orderData.status || 'pending',
        orderData.shippingAddress || '',
        orderData.paymentMethod || 'credit_card'
      ]);
      
      const orderId = orderResult.insertId;
      
      // Create order items
      for (const item of orderData.items) {
        await connection.execute(`
          INSERT INTO order_items (order_id, product_id, quantity, price)
          VALUES (?, ?, ?, ?)
        `, [orderId, item.productId, item.quantity, item.price]);
        
        // Update product stock
        await connection.execute(`
          UPDATE products 
          SET stock = stock - ? 
          WHERE id = ? AND stock >= ?
        `, [item.quantity, item.productId, item.quantity]);
      }
      
      await connection.commit();
      return await this.findById(orderId);
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async findById(id) {
    const [orders] = await pool.execute(`
      SELECT 
        o.*,
        u.username as user_username,
        u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `, [id]);
    
    if (orders.length === 0) return null;
    
    const order = orders[0];
    
    // Get order items
    const [items] = await pool.execute(`
      SELECT 
        oi.*,
        p.name as product_name,
        p.slug as product_slug,
        p.sku as product_sku
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [id]);
    
    order.items = items;
    return order;
  }

  static async findByUserId(userId, options = {}) {
    const { limit = 50, offset = 0, status } = options;
    
    // Ensure limit and offset are valid integers
    const safeLimit = parseInt(limit) || 50;
    const safeOffset = parseInt(offset) || 0;
    
    let sql = `
      SELECT 
        o.*,
        u.username as user_username,
        u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.user_id = ?
    `;
    
    const params = [userId];
    
    if (status) {
      sql += ' AND o.status = ?';
      params.push(status);
    }
    
    sql += ` ORDER BY o.created_at DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`;
    
    const [orders] = await pool.execute(sql, params);
    
    // Get items for each order
    for (const order of orders) {
      const [items] = await pool.execute(`
        SELECT 
          oi.*,
          p.name as product_name,
          p.slug as product_slug
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [order.id]);
      
      order.items = items;
    }
    
    return orders;
  }

  static async updateStatus(id, status) {
    const [result] = await pool.execute(`
      UPDATE orders 
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [status, id]);
    
    return result.affectedRows > 0;
  }

  static async updateAdminNotes(id, notes) {
    try {
      const [result] = await pool.execute(`
        UPDATE orders 
        SET admin_notes = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [notes, id]);
      return result.affectedRows > 0;
    } catch (error) {
      // If admin_notes column doesn't exist, add it
      if (error.code === 'ER_BAD_FIELD_ERROR') {
        await pool.execute(`ALTER TABLE orders ADD COLUMN admin_notes TEXT DEFAULT NULL`);
        const [result] = await pool.execute(`
          UPDATE orders 
          SET admin_notes = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `, [notes, id]);
        return result.affectedRows > 0;
      }
      throw error;
    }
  }

  static async findAll(options = {}) {
    const { 
      limit = 100, 
      offset = 0, 
      status,
      startDate,
      endDate
    } = options;
    
    // Ensure limit and offset are valid integers
    const safeLimit = parseInt(limit) || 100;
    const safeOffset = parseInt(offset) || 0;
    
    let sql = `
      SELECT 
        o.*,
        u.username as user_username,
        u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (status) {
      sql += ' AND o.status = ?';
      params.push(status);
    }
    
    if (startDate) {
      sql += ' AND o.created_at >= ?';
      params.push(startDate);
    }
    
    if (endDate) {
      sql += ' AND o.created_at <= ?';
      params.push(endDate);
    }
    
    sql += ` ORDER BY o.created_at DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`;
    
    const [orders] = params.length > 0 
      ? await pool.execute(sql, params)
      : await pool.query(sql);
    
    // Get items for each order
    for (const order of orders) {
      const [items] = await pool.execute(`
        SELECT 
          oi.*,
          p.name as product_name,
          p.slug as product_slug
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [order.id]);
      order.items = items;
    }

    // Get order counts for summary
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as average_order_value
      FROM orders
      WHERE status = 'completed'
    `);
    
    return {
      orders,
      stats: stats[0] || { total_orders: 0, total_revenue: 0, average_order_value: 0 }
    };
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM orders WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Order;