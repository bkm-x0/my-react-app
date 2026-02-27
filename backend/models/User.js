// backend/models/User.js
const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const [result] = await pool.execute(`
      INSERT INTO users (username, email, password, role, neural_implant_id, balance)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      userData.username,
      userData.email.toLowerCase(),
      hashedPassword,
      userData.role || 'user',
      userData.neuralImplantId || '',
      userData.balance || 0
    ]);
    
    return await this.findById(result.insertId);
  }

  static async findByEmail(email) {
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email.toLowerCase()]
    );
    return users[0] || null;
  }

  static async findByUsername(username) {
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return users[0] || null;
  }

  static async findById(id) {
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return users[0] || null;
  }

  static async update(id, updateData) {
    const fields = [];
    const values = [];
    
    if (updateData.password) {
      fields.push('password = ?');
      values.push(await bcrypt.hash(updateData.password, 10));
    }
    
    if (updateData.email !== undefined) {
      fields.push('email = ?');
      values.push(updateData.email.toLowerCase());
    }
    
    if (updateData.username !== undefined) {
      fields.push('username = ?');
      values.push(updateData.username);
    }
    
    if (updateData.balance !== undefined) {
      fields.push('balance = ?');
      values.push(updateData.balance);
    }
    
    if (updateData.role !== undefined) {
      fields.push('role = ?');
      values.push(updateData.role);
    }
    
    if (updateData.isActive !== undefined) {
      fields.push('is_active = ?');
      values.push(updateData.isActive ? 1 : 0);
    }
    
    if (fields.length === 0) return null;
    
    values.push(id);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    
    await pool.execute(sql, values);
    return await this.findById(id);
  }

  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  static async findAll(limit = 100, offset = 0) {
    // Ensure limit and offset are valid integers
    const safeLimit = parseInt(limit) || 100;
    const safeOffset = parseInt(offset) || 0;
    
    const [users] = await pool.execute(`
      SELECT id, username, email, role, balance, is_active, created_at
      FROM users 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `, [safeLimit, safeOffset]);
    
    return users;
  }

  static async count() {
    const [[result]] = await pool.execute('SELECT COUNT(*) as count FROM users');
    return result.count;
  }
}

module.exports = User;