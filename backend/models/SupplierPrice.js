// backend/models/SupplierPrice.js
const { pool } = require('../config/db');

class SupplierPrice {
  // إنشاء سعر شراء جديد من المورد
  static async create(priceData) {
    const [result] = await pool.execute(`
      INSERT INTO supplier_prices (
        product_id, supplier_id, cost_price, quantity_min, quantity_max,
        currency, validity_start, validity_end, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      priceData.productId,
      priceData.supplierId,
      priceData.costPrice,
      priceData.quantityMin || 1,
      priceData.quantityMax || null,
      priceData.currency || 'USD',
      priceData.validityStart || new Date(),
      priceData.validityEnd || null,
      priceData.notes || ''
    ]);

    return await this.findById(result.insertId);
  }

  static async findById(id) {
    const [prices] = await pool.execute(`
      SELECT
        sp.*,
        p.name as product_name,
        p.price as selling_price,
        s.name as supplier_name
      FROM supplier_prices sp
      LEFT JOIN products p ON sp.product_id = p.id
      LEFT JOIN suppliers s ON sp.supplier_id = s.id
      WHERE sp.id = ?
    `, [id]);

    return prices[0] || null;
  }

  // الحصول على أفضل سعر شراء لمنتج معين من مورد معين
  static async getBestPrice(productId, supplierId, quantity = 1) {
    const [prices] = await pool.execute(`
      SELECT * FROM supplier_prices
      WHERE product_id = ? AND supplier_id = ?
      AND validity_start <= NOW()
      AND (validity_end IS NULL OR validity_end >= NOW())
      AND (quantity_min <= ? OR quantity_min IS NULL)
      AND (quantity_max IS NULL OR quantity_max >= ?)
      ORDER BY cost_price ASC
      LIMIT 1
    `, [productId, supplierId, quantity, quantity]);

    return prices[0] || null;
  }

  // الحصول على جميع أسعار المورد لمنتج محدد
  static async getByProduct(productId, options = {}) {
    const { supplierId } = options;

    let sql = `
      SELECT
        sp.*,
        s.name as supplier_name,
        p.price as selling_price
      FROM supplier_prices sp
      LEFT JOIN suppliers s ON sp.supplier_id = s.id
      LEFT JOIN products p ON sp.product_id = p.id
      WHERE sp.product_id = ?
    `;

    const params = [productId];

    if (supplierId) {
      sql += ' AND sp.supplier_id = ?';
      params.push(supplierId);
    }

    sql += ` AND sp.validity_start <= NOW()
      AND (sp.validity_end IS NULL OR sp.validity_end >= NOW())
      ORDER BY sp.cost_price ASC`;

    const [prices] = await pool.execute(sql, params);
    return prices;
  }

  static async update(id, updateData) {
    const fields = [];
    const values = [];

    if (updateData.costPrice !== undefined) {
      fields.push('cost_price = ?');
      values.push(updateData.costPrice);
    }

    if (updateData.quantityMin !== undefined) {
      fields.push('quantity_min = ?');
      values.push(updateData.quantityMin);
    }

    if (updateData.quantityMax !== undefined) {
      fields.push('quantity_max = ?');
      values.push(updateData.quantityMax);
    }

    if (updateData.validityEnd !== undefined) {
      fields.push('validity_end = ?');
      values.push(updateData.validityEnd);
    }

    if (updateData.notes !== undefined) {
      fields.push('notes = ?');
      values.push(updateData.notes);
    }

    if (fields.length === 0) return null;

    values.push(id);
    const sql = `UPDATE supplier_prices SET ${fields.join(', ')} WHERE id = ?`;

    await pool.execute(sql, values);
    return await this.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM supplier_prices WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = SupplierPrice;
