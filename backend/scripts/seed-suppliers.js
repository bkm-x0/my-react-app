// backend/scripts/seed-suppliers.js
// Run: node scripts/seed-suppliers.js
require('colors');
const { pool, connectDB } = require('../config/db');

const suppliers = [
  {
    name: 'NVIDIA Corporation',
    slug: 'nvidia-corporation',
    description: 'World leader in GPU technology, known for GeForce gaming graphics cards and data center solutions.',
    logo: '',
    email: 'info@nvidia.com',
    phone: '+1-408-486-2000',
    website: 'https://www.nvidia.com',
    address: '2788 San Tomas Expressway',
    city: 'Santa Clara',
    country: 'USA',
    rating: 4.8,
  },
  {
    name: 'AMD',
    slug: 'amd',
    description: 'Advanced Micro Devices - producer of high-performance processors and graphics solutions for gaming and professional use.',
    logo: '',
    email: 'info@amd.com',
    phone: '+1-408-749-4000',
    website: 'https://www.amd.com',
    address: '2485 Augustine Drive',
    city: 'Santa Clara',
    country: 'USA',
    rating: 4.7,
  },
  {
    name: 'Intel Corporation',
    slug: 'intel-corporation',
    description: 'Leading semiconductor manufacturer known for processors, motherboards, and integrated computing solutions.',
    logo: '',
    email: 'support@intel.com',
    phone: '+1-408-765-8080',
    website: 'https://www.intel.com',
    address: '2200 Mission College Blvd',
    city: 'Santa Clara',
    country: 'USA',
    rating: 4.5,
  },
  {
    name: 'ASUS',
    slug: 'asus',
    description: 'Premium gaming hardware manufacturer — motherboards, GPUs, laptops, monitors, and ROG gaming peripherals.',
    logo: '',
    email: 'info@asus.com',
    phone: '+886-2-2894-3447',
    website: 'https://www.asus.com',
    address: '15 Li-Te Road, Peitou',
    city: 'Taipei',
    country: 'Taiwan',
    rating: 4.6,
  },
  {
    name: 'MSI',
    slug: 'msi',
    description: 'Micro-Star International — gaming laptops, motherboards, graphics cards, and high-performance desktops.',
    logo: '',
    email: 'info@msi.com',
    phone: '+886-2-3234-5599',
    website: 'https://www.msi.com',
    address: 'No.69, Lide St., Zhonghe Dist.',
    city: 'New Taipei City',
    country: 'Taiwan',
    rating: 4.5,
  },
  {
    name: 'Corsair',
    slug: 'corsair',
    description: 'High-performance gaming peripherals, memory, cooling solutions, and PC components for enthusiasts.',
    logo: '',
    email: 'support@corsair.com',
    phone: '+1-510-657-8747',
    website: 'https://www.corsair.com',
    address: '115 N McCarthy Blvd',
    city: 'Milpitas',
    country: 'USA',
    rating: 4.6,
  },
  {
    name: 'Samsung Electronics',
    slug: 'samsung-electronics',
    description: 'Global technology leader — SSDs, memory, monitors, and storage solutions for consumers and enterprises.',
    logo: '',
    email: 'info@samsung.com',
    phone: '+82-2-2255-0114',
    website: 'https://www.samsung.com',
    address: '129 Samsung-ro, Yeongtong-gu',
    city: 'Suwon',
    country: 'South Korea',
    rating: 4.7,
  },
  {
    name: 'Logitech',
    slug: 'logitech',
    description: 'Premium gaming and productivity peripherals — mice, keyboards, headsets, and webcams.',
    logo: '',
    email: 'support@logitech.com',
    phone: '+41-21-863-5111',
    website: 'https://www.logitech.com',
    address: 'EPFL Innovation Park',
    city: 'Lausanne',
    country: 'Switzerland',
    rating: 4.5,
  },
];

async function seedSuppliers() {
  try {
    await connectDB();
    console.log('Connected to database');

    for (const s of suppliers) {
      try {
        await pool.execute(
          `INSERT INTO suppliers (name, slug, description, logo, email, phone, website, address, city, country, rating, is_active)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
          [s.name, s.slug, s.description, s.logo, s.email, s.phone, s.website, s.address, s.city, s.country, s.rating]
        );
        console.log(`✅ Added supplier: ${s.name}`);
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.log(`⏭️  Supplier already exists: ${s.name}`);
        } else {
          console.error(`❌ Error adding ${s.name}:`, err.message);
        }
      }
    }

    console.log('\n🎉 Supplier seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedSuppliers();
