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
        ('Desktops', 'desktops', 'Complete desktop computer systems', 'fas-desktop', '#4a90e2'),
        ('Laptops', 'laptops', 'Portable computers for all needs', 'fa-laptop', '#50c878'),
        ('Gaming Systems', 'gaming-systems', 'High-performance gaming computers', 'fa-gamepad', '#9b59b6'),
        ('Processors', 'processors', 'CPUs from Intel and AMD', 'fa-microchip', '#e67e22'),
        ('Graphics Cards', 'graphics-cards', 'GPUs for gaming and professional work', 'fa-tachometer-alt', '#e74c3c'),
        ('Memory', 'memory-ram', 'RAM modules for desktops and laptops', 'fa-memory', '#3498db'),
        ('Storage', 'storage', 'SSDs, HDDs, and external storage', 'fa-hdd', '#95a5a6'),
        ('Monitors', 'monitors', 'Displays for work and gaming', 'fa-tv', '#1abc9c'),
        ('Keyboards', 'keyboards', 'Mechanical, membrane, and gaming keyboards', 'fa-keyboard', '#34495e'),
        ('Mice', 'mice', 'Wired and wireless pointing devices', 'fa-mouse', '#7f8c8d'),
        ('Audio', 'audio', 'Headsets, speakers, and microphones', 'fa-headphones', '#f39c12'),
        ('Networking', 'networking', 'Routers, switches, and adapters', 'fa-network-wired', '#16a085')
    `);
    
    // Get category IDs
    const categories = await db.query('SELECT id, name FROM categories');
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });
    
    // Create products
    console.log('📦 Creating products...');
    const products = [
      {
        name: 'CyberStation Pro X1',
        slug: 'cyberstation-pro-x1',
        description: 'High-end desktop with Intel i9 and RTX 4080',
        price: 2499,
        categoryId: categoryMap['Desktops'],
        stock: 15,
        sku: 'DSK-PRO-001',
        features: ['Intel i9-14900K', '64GB DDR5', '2TB NVMe SSD', 'RTX 4080'],
        rating: 4.9,
        isFeatured: true,
        image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'CyberStation Office 500',
        slug: 'cyberstation-office-500',
        description: 'Reliable office desktop for daily productivity',
        price: 799,
        categoryId: categoryMap['Desktops'],
        stock: 30,
        sku: 'DSK-OFF-001',
        features: ['Intel i5-13400', '16GB DDR4', '512GB SSD'],
        rating: 4.5,
        isFeatured: false,
        image: 'https://images.unsplash.com/photo-1593640495253-23196b27a87f?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Laptop Dell XPS 15',
        slug: 'laptop-dell-xps-15',
        description: 'Professional laptop with 15-inch OLED display',
        price: 1999,
        categoryId: categoryMap['Laptops'],
        stock: 10,
        sku: 'LPT-XPS-001',
        features: ['Intel i7-13700H', '16GB RAM', '512GB SSD', 'OLED Display'],
        rating: 4.9,
        isFeatured: true,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Lenovo ThinkPad E14',
        slug: 'lenovo-thinkpad-e14',
        description: 'Business laptop built for reliability',
        price: 899,
        categoryId: categoryMap['Laptops'],
        stock: 22,
        sku: 'LPT-TPE-001',
        features: ['AMD Ryzen 5', '8GB RAM', '256GB SSD'],
        rating: 4.4,
        isFeatured: false,
        image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'CyberBeast RTX Gaming Rig',
        slug: 'cyberbeast-rtx-gaming-rig',
        description: 'Ultimate gaming PC with liquid cooling',
        price: 3499,
        categoryId: categoryMap['Gaming Systems'],
        stock: 8,
        sku: 'GAM-BST-001',
        features: ['Intel i9-14900KS', 'RTX 4090', '128GB DDR5', 'Custom Loop Cooling'],
        rating: 5.0,
        isFeatured: true,
        image: 'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'AMD Ryzen 9 7950X',
        slug: 'amd-ryzen-9-7950x',
        description: '16-core 32-thread desktop processor',
        price: 599,
        categoryId: categoryMap['Processors'],
        stock: 25,
        sku: 'CPU-R9-7950',
        features: ['16 Cores', '32 Threads', '5.7GHz Boost', 'AM5 Socket'],
        rating: 4.9,
        isFeatured: true,
        image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Intel Core i7-14700K',
        slug: 'intel-core-i7-14700k',
        description: '20-core hybrid desktop processor',
        price: 419,
        categoryId: categoryMap['Processors'],
        stock: 35,
        sku: 'CPU-I7-14700',
        features: ['20 Cores', '28 Threads', '5.6GHz Boost', 'LGA 1700'],
        rating: 4.7,
        isFeatured: false,
        image: 'https://images.unsplash.com/photo-1591799265444-d66432b91588?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'RTX 4090 Graphics Card',
        slug: 'rtx-4090-graphics-card',
        description: 'Flagship NVIDIA GPU for extreme performance',
        price: 1599,
        categoryId: categoryMap['Graphics Cards'],
        stock: 6,
        sku: 'GPU-4090-001',
        features: ['24GB GDDR6X', 'Ray Tracing', 'DLSS 3', '16384 CUDA Cores'],
        rating: 5.0,
        isFeatured: true,
        image: 'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'RX 7900 XTX',
        slug: 'rx-7900-xtx',
        description: 'AMD flagship GPU with 24GB VRAM',
        price: 999,
        categoryId: categoryMap['Graphics Cards'],
        stock: 12,
        sku: 'GPU-7900XTX-001',
        features: ['24GB GDDR6', 'RDNA 3', 'AV1 Encode', '96 Compute Units'],
        rating: 4.7,
        isFeatured: true,
        image: 'https://images.unsplash.com/photo-1659957898831-a6285d6e95e5?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Corsair Vengeance DDR5 32GB',
        slug: 'corsair-vengeance-ddr5-32gb',
        description: 'High-speed DDR5 memory kit (2x16GB)',
        price: 129,
        categoryId: categoryMap['Memory'],
        stock: 50,
        sku: 'RAM-CV5-32',
        features: ['32GB (2x16GB)', 'DDR5-6000', 'CL30', 'Intel XMP 3.0'],
        rating: 4.8,
        isFeatured: true,
        image: 'https://images.unsplash.com/photo-1562976540-1502c2145851?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Samsung 990 Pro 2TB',
        slug: 'samsung-990-pro-2tb',
        description: 'Ultra-fast PCIe 4.0 NVMe SSD',
        price: 179,
        categoryId: categoryMap['Storage'],
        stock: 40,
        sku: 'SSD-S990-2TB',
        features: ['2TB', '7450 MB/s Read', 'PCIe 4.0', 'V-NAND'],
        rating: 4.9,
        isFeatured: true,
        image: 'https://images.unsplash.com/photo-1597872557048-bd6c8b31c26e?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'WD Black SN850X 1TB',
        slug: 'wd-black-sn850x-1tb',
        description: 'Gaming NVMe SSD with heatsink',
        price: 89,
        categoryId: categoryMap['Storage'],
        stock: 60,
        sku: 'SSD-WDB-1TB',
        features: ['1TB', '7300 MB/s Read', 'Heatsink Included', 'Game Mode 2.0'],
        rating: 4.7,
        isFeatured: false,
        image: 'https://images.unsplash.com/photo-1602526432604-029a709e131a?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'LG UltraGear 27" 4K 144Hz',
        slug: 'lg-ultragear-27-4k-144hz',
        description: 'Premium 4K gaming monitor with Nano IPS',
        price: 799,
        categoryId: categoryMap['Monitors'],
        stock: 14,
        sku: 'MON-LG27-4K',
        features: ['27" 4K', '144Hz', 'Nano IPS', 'G-Sync Compatible'],
        rating: 4.8,
        isFeatured: true,
        image: 'https://images.unsplash.com/photo-1527443224154-c4a573d5f5c4?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Samsung Odyssey G9 49"',
        slug: 'samsung-odyssey-g9-49',
        description: 'Super ultrawide curved gaming monitor',
        price: 1299,
        categoryId: categoryMap['Monitors'],
        stock: 7,
        sku: 'MON-SOG9-49',
        features: ['49" DQHD', '240Hz', '1000R Curve', 'Quantum Mini-LED'],
        rating: 4.6,
        isFeatured: true,
        image: 'https://images.unsplash.com/photo-1547119957-637f8679db1e?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Razer Huntsman V3 Pro',
        slug: 'razer-huntsman-v3-pro',
        description: 'Analog optical gaming keyboard',
        price: 249,
        categoryId: categoryMap['Keyboards'],
        stock: 20,
        sku: 'KBD-RHV3-001',
        features: ['Analog Optical Switches', 'Per-Key RGB', 'Wrist Rest', 'Magnetic'],
        rating: 4.8,
        isFeatured: true,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Logitech MX Keys S',
        slug: 'logitech-mx-keys-s',
        description: 'Premium wireless productivity keyboard',
        price: 109,
        categoryId: categoryMap['Keyboards'],
        stock: 30,
        sku: 'KBD-MXK-001',
        features: ['Wireless', 'Backlit', 'Multi-Device', 'USB-C'],
        rating: 4.7,
        isFeatured: false,
        image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Razer DeathAdder V3 Pro',
        slug: 'razer-deathadder-v3-pro',
        description: 'Ultra-lightweight wireless gaming mouse',
        price: 149,
        categoryId: categoryMap['Mice'],
        stock: 25,
        sku: 'MOU-RDA3-001',
        features: ['63g Weight', '30K DPI', 'Wireless', '90hr Battery'],
        rating: 4.9,
        isFeatured: true,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'SteelSeries Arctis Nova Pro',
        slug: 'steelseries-arctis-nova-pro',
        description: 'Hi-Res wireless gaming headset with ANC',
        price: 349,
        categoryId: categoryMap['Audio'],
        stock: 18,
        sku: 'AUD-ANP-001',
        features: ['Hi-Res Audio', 'Active Noise Cancelling', 'Dual Wireless', 'Hot-Swap Battery'],
        rating: 4.8,
        isFeatured: true,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Bose SoundLink Revolve+',
        slug: 'bose-soundlink-revolve-plus',
        description: '360-degree portable Bluetooth speaker',
        price: 329,
        categoryId: categoryMap['Audio'],
        stock: 20,
        sku: 'AUD-BSR-001',
        features: ['360° Sound', 'IP55 Waterproof', '17hr Battery', 'Bluetooth 5.3'],
        rating: 4.7,
        isFeatured: false,
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'ASUS ROG Rapture GT-AX6000',
        slug: 'asus-rog-rapture-gt-ax6000',
        description: 'Dual-band WiFi 6 gaming router',
        price: 349,
        categoryId: categoryMap['Networking'],
        stock: 16,
        sku: 'NET-ROG-001',
        features: ['WiFi 6', '6000 Mbps', 'Game Acceleration', 'AiMesh'],
        rating: 4.6,
        isFeatured: true,
        image: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=800&q=80'
      }
    ];
    
    for (const product of products) {
      await db.query(`
        INSERT INTO products (name, slug, description, price, category_id, stock, sku, features, rating, is_featured, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        product.isFeatured ? 1 : 0,
        product.image || null
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