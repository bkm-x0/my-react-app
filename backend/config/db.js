// config/db.js - MySQL version
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

class Database {
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      database: process.env.DB_NAME || 'cyberstore',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '11224455',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,

      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    });
  }

  async  connect() {
    try {
      const connection = await this.pool.getConnection();
      console.log(`✅ MySQL Connected`.cyan.underline);
      connection.release();
      
      // Create tables if they don't exist
      await this.createTables();
    } catch (error) {
      console.error(`❌ MySQL Connection Error: ${error.message}`.red.underline.bold);
      process.exit(1);
    }
  }

  async createTables() {
    const connection = await this.pool.getConnection();
    
    try {
      // Users table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role ENUM('user', 'admin') DEFAULT 'user',
          neural_implant_id VARCHAR(50) DEFAULT '',
          biometric_enabled BOOLEAN DEFAULT FALSE,
          neural_auth_enabled BOOLEAN DEFAULT FALSE,
          balance DECIMAL(10, 2) DEFAULT 0.00,
          is_active BOOLEAN DEFAULT TRUE,
          last_login TIMESTAMP NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_email (email),
          INDEX idx_username (username),
          INDEX idx_role (role)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // Categories table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS categories (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) UNIQUE NOT NULL,
          slug VARCHAR(100) UNIQUE NOT NULL,
          description TEXT,
          icon VARCHAR(50),
          color VARCHAR(20) DEFAULT '#6db3c8',
          is_active BOOLEAN DEFAULT TRUE,
          product_count INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_slug (slug),
          INDEX idx_is_active (is_active)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // Suppliers table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS suppliers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(200) NOT NULL,
          slug VARCHAR(200) UNIQUE NOT NULL,
          description TEXT,
          logo VARCHAR(255) DEFAULT '',
          email VARCHAR(100) DEFAULT '',
          phone VARCHAR(50) DEFAULT '',
          website VARCHAR(255) DEFAULT '',
          address VARCHAR(500) DEFAULT '',
          city VARCHAR(100) DEFAULT '',
          country VARCHAR(100) DEFAULT '',
          rating DECIMAL(3, 2) DEFAULT 0.00,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_slug (slug),
          INDEX idx_is_active (is_active),
          INDEX idx_country (country)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // Products table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS products (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(200) NOT NULL,
          slug VARCHAR(200) UNIQUE NOT NULL,
          description TEXT NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          category_id INT,
          supplier_id INT DEFAULT NULL,
          stock INT NOT NULL DEFAULT 0,
          sku VARCHAR(50) UNIQUE NOT NULL,
          features JSON,
          specifications JSON,
          image VARCHAR(255) DEFAULT NULL,
          rating DECIMAL(3, 2) DEFAULT 0.00,
          is_featured BOOLEAN DEFAULT FALSE,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
          FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
          INDEX idx_slug (slug),
          INDEX idx_category (category_id),
          INDEX idx_supplier (supplier_id),
          INDEX idx_sku (sku),
          INDEX idx_is_featured (is_featured),
          INDEX idx_is_active (is_active),
          INDEX idx_price (price),
          FULLTEXT idx_search (name, description, sku)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // Orders table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS orders (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT,
          total_amount DECIMAL(10, 2) NOT NULL,
          status VARCHAR(20) DEFAULT 'pending',
          shipping_address TEXT,
          payment_method VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
          INDEX idx_user_id (user_id),
          INDEX idx_status (status),
          INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // Order items table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS order_items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_id INT,
          product_id INT,
          quantity INT NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
          INDEX idx_order_id (order_id),
          INDEX idx_product_id (product_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // Add supplier_id to products if not exists (migration for existing DBs)
      try {
        await connection.execute(`
          ALTER TABLE products ADD COLUMN supplier_id INT DEFAULT NULL,
          ADD FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
          ADD INDEX idx_supplier (supplier_id)
        `);
        console.log('✅ Added supplier_id to products table');
      } catch (e) {
        // Column already exists - ignore
      }

      console.log('✅ Tables created/verified successfully');
      
    } catch (error) {
      console.error('❌ Error creating tables:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  async query(sql, params) {
    try {
      const [results] = await this.pool.execute(sql, params);
      return results;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async getConnection() {
    return await this.pool.getConnection();
  }
}

const db = new Database();
const connectDB = () => db.connect();
const pool = db.pool;

module.exports = { db, connectDB, pool };