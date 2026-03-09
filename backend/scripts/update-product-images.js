// Script to update existing products with image URLs
// Run: node backend/scripts/update-product-images.js
const { pool } = require('../config/db');
require('dotenv').config({ path: require('path').join(__dirname, '../..', '.env') });

const productImages = [
  { sku: 'DSK-PRO-001', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80' },
  { sku: 'DSK-OFF-001', image: 'https://images.unsplash.com/photo-1593640495253-23196b27a87f?auto=format&fit=crop&w=800&q=80' },
  { sku: 'LPT-XPS-001', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80' },
  { sku: 'LPT-TPE-001', image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80' },
  { sku: 'GAM-BST-001', image: 'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?auto=format&fit=crop&w=800&q=80' },
  { sku: 'CPU-R9-7950', image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80' },
  { sku: 'CPU-I7-14700', image: 'https://images.unsplash.com/photo-1591799265444-d66432b91588?auto=format&fit=crop&w=800&q=80' },
  { sku: 'GPU-4090-001', image: 'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?auto=format&fit=crop&w=800&q=80' },
  { sku: 'GPU-7900XTX-001', image: 'https://images.unsplash.com/photo-1659957898831-a6285d6e95e5?auto=format&fit=crop&w=800&q=80' },
  { sku: 'RAM-CV5-32', image: 'https://images.unsplash.com/photo-1562976540-1502c2145851?auto=format&fit=crop&w=800&q=80' },
  { sku: 'SSD-S990-2TB', image: 'https://images.unsplash.com/photo-1597872557048-bd6c8b31c26e?auto=format&fit=crop&w=800&q=80' },
  { sku: 'SSD-WDB-1TB', image: 'https://images.unsplash.com/photo-1602526432604-029a709e131a?auto=format&fit=crop&w=800&q=80' },
  { sku: 'MON-LG27-4K', image: 'https://images.unsplash.com/photo-1527443224154-c4a573d5f5c4?auto=format&fit=crop&w=800&q=80' },
  { sku: 'MON-SOG9-49', image: 'https://images.unsplash.com/photo-1547119957-637f8679db1e?auto=format&fit=crop&w=800&q=80' },
  { sku: 'KBD-RHV3-001', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80' },
  { sku: 'KBD-MXK-001', image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80' },
  { sku: 'MOU-RDA3-001', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80' },
  { sku: 'AUD-ANP-001', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
  { sku: 'AUD-BSR-001', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80' },
  { sku: 'NET-ROG-001', image: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=800&q=80' },
];

async function updateImages() {
  console.log('🖼️  Updating product images...\n');
  let updated = 0;
  let skipped = 0;

  for (const { sku, image } of productImages) {
    try {
      const [result] = await pool.execute(
        'UPDATE products SET image = ? WHERE sku = ?',
        [image, sku]
      );
      if (result.affectedRows > 0) {
        console.log(`✅ Updated: ${sku}`);
        updated++;
      } else {
        console.log(`⚠️  Not found: ${sku}`);
        skipped++;
      }
    } catch (err) {
      console.error(`❌ Error updating ${sku}:`, err.message);
    }
  }

  console.log(`\n✨ Done! Updated: ${updated}, Not found: ${skipped}`);
  process.exit(0);
}

updateImages().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
