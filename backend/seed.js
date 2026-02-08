// seed.js - MySQL version
const { db } = require('./config/db');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  console.log('🚀 Starting CyberStore MySQL database seeding...');
  
  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await db.query('DELETE FROM order_items');
    await db.query('DELETE FROM orders');
    await db.query('DELETE FROM products');
    await db.query('DELETE FROM categories');
    await db.query('DELETE FROM users');
    console.log('✅ Database cleared');
    
    // Create admin user
    console.log('👥 Creating users...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);
    
    await db.query(`
      INSERT INTO users (username, email, password, role, neural_implant_id, balance) 
      VALUES 
        ('cyberadmin', 'admin@cyberstore.com', ?, 'admin', 'ADMIN-001', 100000),
        ('cyberuser', 'user@cyberstore.com', ?, 'user', 'USER-001', 5000)
    `, [adminPassword, userPassword]);
    
    console.log('✅ Users created');
    
    // Create categories
    console.log('📁 Creating categories...');
    await db.query(`
      INSERT INTO categories (name, slug, description, icon, color) 
      VALUES 
        ('Neural Tech', 'neural-tech', 'Brain-computer interfaces and neural enhancement technology', 'Cpu', '#6db3c8'),
        ('Cybernetic Limbs', 'cybernetic-limbs', 'Advanced prosthetics and body augmentations', 'Zap', '#c9988b'),
        ('Quantum Hardware', 'quantum-hardware', 'Next-generation quantum computing technology', 'Shield', '#7a9d8e'),
        ('Holographic Tech', 'holographic-tech', 'Immersive display and holographic systems', 'Sparkles', '#6b5b8f')
    `);
    
    // Get category IDs
    const categories = await db.query('SELECT id, name FROM categories');
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name.toLowerCase().split(' ')[0]] = cat.id;
    });
    
    // Create products
    console.log('📦 Creating products...');
    const products = [
      {
        name: 'Neural Interface MK.II',
        slug: 'neural-interface-mkii',
        description: 'Advanced brain-computer interface with 256-channel neural sensors',
        price: 2999,
        categoryId: categoryMap['neural'],
        stock: 15,
        sku: 'NI-MKII-001',
        features: ['256-Channel Sensors', 'Quantum Encryption', 'AI Calibration'],
        rating: 4.8,
        isFeatured: true
      },
      {
        name: 'Quantum Processor Q9',
        slug: 'quantum-processor-q9',
        description: '512 qubit quantum processor with cryo-cooling',
        price: 8999,
        categoryId: categoryMap['quantum'],
        stock: 8,
        sku: 'QP-Q9-001',
        features: ['512 Qubits', 'Cryo-Cooled', 'Neural Optimization'],
        rating: 4.9,
        isFeatured: true
      },
      {
        name: 'Cybernetic Arm v4.0',
        slug: 'cybernetic-arm-v40',
        description: 'Prosthetic arm with tactile feedback and super strength',
        price: 12999,
        categoryId: categoryMap['cybernetic'],
        stock: 5,
        sku: 'CA-V40-001',
        features: ['Tactile Feedback', 'Super Strength', 'Tool Integration'],
        rating: 5.0,
        isFeatured: true
      },
      {
        name: 'Holo-Display Pro',
        slug: 'holo-display-pro',
        description: '4K holographic display with gesture control',
        price: 4599,
        categoryId: categoryMap['holographic'],
        stock: 25,
        sku: 'HD-PRO-001',
        features: ['4K Resolution', 'Gesture Control', '360° Viewing'],
        rating: 4.7,
        isFeatured: true
      },
      {
        name: 'Neural OS v2.1',
        slug: 'neural-os-v21',
        description: 'Operating system for neural interfaces',
        price: 899,
        categoryId: categoryMap['neural'],
        stock: 100,
        sku: 'NOS-V21-001',
        features: ['Neural Support', 'AI Assistant', 'Security Suite'],
        rating: 4.5,
        isFeatured: true
      }
    ];
    
    for (const product of products) {
      await db.query(`
        INSERT INTO products (name, slug, description, price, category_id, stock, sku, features, rating, is_featured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        product.name,
        product.slug,
        product.description,
        product.price,
        product.categoryId,
        product.stock,
        product.sku,
        JSON.stringify(product.features),
        product.rating,
        product.isFeatured ? 1 : 0
      ]);
    }
    
    // Update category product counts
    console.log('📊 Updating category counts...');
    await db.query(`
      UPDATE categories c
      SET product_count = (
        SELECT COUNT(*) 
        FROM products p 
        WHERE p.category_id = c.id AND p.is_active = 1
      )
    `);
    
    // Display summary
    const [userCount] = await db.query('SELECT COUNT(*) as count FROM users');
    const [categoryCount] = await db.query('SELECT COUNT(*) as count FROM categories');
    const [productCount] = await db.query('SELECT COUNT(*) as count FROM products');
    
    console.log('\n🎉 DATABASE SEEDING COMPLETE!');
    console.log('==============================');
    console.log('\n🔑 Admin Login:');
    console.log('   Email: admin@cyberstore.com');
    console.log('   Password: admin123');
    console.log('\n👤 User Login:');
    console.log('   Email: user@cyberstore.com');
    console.log('   Password: user123');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${userCount.count}`);
    console.log(`   Categories: ${categoryCount.count}`);
    console.log(`   Products: ${productCount.count}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;