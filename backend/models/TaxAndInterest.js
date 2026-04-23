// backend/models/TaxAndInterest.js
const { pool } = require('../config/db');

class TaxAndInterest {
  // إنشاء سجل ضرائب وفائدة
  static async create(taxData) {
    const [result] = await pool.execute(`
      INSERT INTO taxes_interests (
        order_id, supplier_id, cost_price, selling_price, quantity,
        cost_total, selling_total, profit, tax_rate, tax_amount,
        interest_rate, interest_amount, total_charges, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      taxData.orderId,
      taxData.supplierId,
      taxData.costPrice,
      taxData.sellingPrice,
      taxData.quantity,
      taxData.costTotal,
      taxData.sellingTotal,
      taxData.profit,
      taxData.taxRate || 0,
      taxData.taxAmount || 0,
      taxData.interestRate || 0,
      taxData.interestAmount || 0,
      taxData.totalCharges || (taxData.taxAmount || 0) + (taxData.interestAmount || 0),
      taxData.notes || ''
    ]);

    return await this.findById(result.insertId);
  }

  static async findById(id) {
    const [records] = await pool.execute(`
      SELECT
        ti.*,
        o.status as order_status,
        s.name as supplier_name
      FROM taxes_interests ti
      LEFT JOIN orders o ON ti.order_id = o.id
      LEFT JOIN suppliers s ON ti.supplier_id = s.id
      WHERE ti.id = ?
    `, [id]);

    return records[0] || null;
  }

  static async getByOrderId(orderId) {
    const [records] = await pool.execute(`
      SELECT
        ti.*,
        s.name as supplier_name
      FROM taxes_interests ti
      LEFT JOIN suppliers s ON ti.supplier_id = s.id
      WHERE ti.order_id = ?
      ORDER BY ti.created_at DESC
    `, [orderId]);

    return records;
  }

  static async getByOrderItemId(orderItemId) {
    const [records] = await pool.execute(`
      SELECT
        ti.*,
        s.name as supplier_name
      FROM taxes_interests ti
      LEFT JOIN suppliers s ON ti.supplier_id = s.id
      WHERE ti.order_item_id = ?
    `, [orderItemId]);

    return records[0] || null;
  }

  static async getSummary(options = {}) {
    let sql = `
      SELECT
        SUM(tax_amount) as total_taxes,
        SUM(interest_amount) as total_interests,
        SUM(total_charges) as total_charges,
        SUM(profit) as total_profit,
        COUNT(*) as transaction_count
      FROM taxes_interests
      WHERE 1=1
    `;

    const params = [];

    if (options.supplierId) {
      sql += ' AND supplier_id = ?';
      params.push(options.supplierId);
    }

    if (options.startDate) {
      sql += ' AND created_at >= ?';
      params.push(options.startDate);
    }

    if (options.endDate) {
      sql += ' AND created_at <= ?';
      params.push(options.endDate);
    }

    const [result] = await pool.execute(sql, params);
    return result[0] || {
      total_taxes: 0,
      total_interests: 0,
      total_charges: 0,
      total_profit: 0,
      transaction_count: 0
    };
  }

  // الحصول على تقرير تفصيلي
  static async getDetailedReport(options = {}) {
    const { limit = 100, offset = 0, supplierId, startDate, endDate } = options;

    let sql = `
      SELECT
        ti.*,
        s.name as supplier_name,
        o.user_id,
        u.username
      FROM taxes_interests ti
      LEFT JOIN suppliers s ON ti.supplier_id = s.id
      LEFT JOIN orders o ON ti.order_id = o.id
      LEFT JOIN users u ON o.user_id = u.id
      WHERE 1=1
    `;

    const params = [];

    if (supplierId) {
      sql += ' AND ti.supplier_id = ?';
      params.push(supplierId);
    }

    if (startDate) {
      sql += ' AND ti.created_at >= ?';
      params.push(startDate);
    }

    if (endDate) {
      sql += ' AND ti.created_at <= ?';
      params.push(endDate);
    }

    sql += ` ORDER BY ti.created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    const [records] = await pool.execute(sql, params);
    return records;
  }

  static async update(id, updateData) {
    const fields = [];
    const values = [];

    const allowedFields = [
      'costPrice', 'sellingPrice', 'quantity', 'costTotal',
      'sellingTotal', 'profit', 'taxRate', 'taxAmount',
      'interestRate', 'interestAmount', 'totalCharges', 'notes'
    ];

    const fieldMap = {
      costPrice: 'cost_price',
      sellingPrice: 'selling_price',
      costTotal: 'cost_total',
      sellingTotal: 'selling_total',
      taxRate: 'tax_rate',
      taxAmount: 'tax_amount',
      interestRate: 'interest_rate',
      interestAmount: 'interest_amount',
      totalCharges: 'total_charges'
    };

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        const dbField = fieldMap[field] || field;
        fields.push(`${dbField} = ?`);
        values.push(updateData[field]);
      }
    }

    if (fields.length === 0) return null;

    values.push(id);
    const sql = `UPDATE taxes_interests SET ${fields.join(', ')} WHERE id = ?`;

    await pool.execute(sql, values);
    return await this.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM taxes_interests WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = TaxAndInterest;
